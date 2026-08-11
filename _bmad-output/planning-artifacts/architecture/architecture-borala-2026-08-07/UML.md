---
name: Bora Lá — UML e vistas arquiteturais
type: architecture-companion
status: final
created: '2026-08-07'
updated: '2026-08-07'
language: pt-BR
code-language: en
spine: ARCHITECTURE-SPINE.md
---

# UML e vistas arquiteturais — Bora Lá

Estes diagramas complementam o [Architecture Spine](./ARCHITECTURE-SPINE.md) e o [Solution Design](./SOLUTION-DESIGN.md). Eles descrevem fronteiras, dependências e sequências que afetam decisões de implementação. Em caso de divergência textual, o spine e as fontes normativas prevalecem.

## 1. Contexto do sistema

```mermaid
flowchart LR
    Guest[Pessoa com o link] -->|abre a prévia pública| BoraLa[Bora Lá]
    Participant[Participante identificado] -->|consulta e registra fatos| BoraLa
    BoraLa -->|envia desafio de acesso| EmailProvider[Provedor de e-mail]
    EmailProvider -->|link e código| Participant
    BoraLa -->|estado transacional| MySQL[(OCI MySQL privado)]
    Operator[Operação técnica] -->|deploy, métricas e restore| BoraLa
    Operator -->|backup e recuperação| MySQL

    note["O link descobre o Rolê; não autentica a pessoa.<br/>{N} pessoas marcaram Tô a fim. vem de GeneralInterest.INTERESTED, não das Opções.<br/>O sistema organiza informação; não decide pelo grupo."]
    note -.-> BoraLa
```

## 2. Componentes e dependências

```mermaid
flowchart TB
    subgraph Web[Inbound adapters — React Router]
        Routes[Routes SSR, loaders e actions]
        Middleware[Headers, sessão, CSRF e rate limit]
    end

    subgraph Identity[identity]
        IdentityApp[Application use cases]
        IdentityDomain[Domain]
        IdentityPorts[Repository, EmailSender, Clock, Crypto]
        IdentityApp --> IdentityDomain
        IdentityApp --> IdentityPorts
    end

    subgraph Outings[outings]
        OutingApp[Application use cases]
        OutingDomain[Domain]
        OutingPorts[Repositories, Clock, IdGenerator]
        OutingApp --> OutingDomain
        OutingApp --> OutingPorts
    end

    subgraph Infrastructure[Outbound adapters]
        MySQLAdapter[Kysely MysqlDialect + mysql2]
        EmailAdapter[Resend adapter]
        CryptoAdapter[Node crypto adapter]
        TimeAdapter[Clock + Temporal]
    end

    Routes --> Middleware
    Middleware --> IdentityApp
    Middleware --> OutingApp
    IdentityApp -. fornece identityId .-> OutingApp
    IdentityPorts --> MySQLAdapter
    IdentityPorts --> EmailAdapter
    IdentityPorts --> CryptoAdapter
    IdentityPorts --> TimeAdapter
    OutingPorts --> MySQLAdapter
    OutingPorts --> CryptoAdapter
    OutingPorts --> TimeAdapter

    Composition[Composition root] --> Routes
    Composition --> IdentityApp
    Composition --> OutingApp
    Composition --> Infrastructure
```

As setas representam dependência em runtime. No código, `domain` não importa framework, adapter ou banco; a composição concreta ocorre somente no composition root.

## 3. Modelo de domínio essencial

```mermaid
classDiagram
    class Identity {
      +IdentityId id
      +Instant lastActiveAt
    }
    class IdentityEmailAlias {
      +AliasId id
      +EmailLookup emailLookup
      +int secretVersion
      +IdentityId identityId
    }
    class Session {
      +SessionId id
      +TokenDigest tokenDigest
      +Instant expiresAt
      +Instant revokedAt
    }
    class LoginChallenge {
      +ChallengeId id
      +TokenDigest linkDigest
      +CodeDigest codeDigest
      +Instant expiresAt
      +int attemptCount
      +consume()
    }
    class Outing {
      +OutingId id
      +OutingState state
      +SocialDate socialDate
      +TimeZoneId timeZone
      +ApproximateStart start
      +FinalLimit finalLimit
      +int version
      +selectVenue()
      +cancel()
      +replace()
    }
    class Participant {
      +ParticipantId id
      +IdentityId identityId
      +DisplayName displayName
      +GeneralInterest interest
    }
    class GeneralInterest {
      <<enumeration>>
      INTERESTED
      UNSURE
    }
    class VenueOption {
      +VenueOptionId id
      +VenueDetails details
      +OptionState state
      +int version
      +editDetails()
      +deactivate()
    }
    class VenueResponse {
      +VenueResponseId id
      +ResponseValue value
      +Instant updatedAt
    }
    class Declaration {
      +DeclarationId id
      +DeclarationType type
      +Instant declaredAt
    }
    class OutingReplacement {
      +OutingId sourceOutingId
      +OutingId replacementOutingId
      +ParticipantId createdBy
      +Instant createdAt
    }
    class AuditEvent {
      +AuditEventId id
      +EventType type
      +int aggregateVersion
      +Instant occurredAt
    }

    Identity "1" --> "0..*" Session
    Identity "0..1" <-- "1..*" IdentityEmailAlias : resolve para
    IdentityEmailAlias "1" --> "0..*" LoginChallenge : ancora
    Identity "1" --> "0..*" Participant : assume nicks contextuais
    Outing "1" *-- "1..*" Participant
    Participant "1" --> "0..1" GeneralInterest : informa
    Outing "1" *-- "0..*" VenueOption
    Outing "1" *-- "0..*" Declaration
    Outing "1" *-- "0..*" AuditEvent
    Participant "1" --> "0..*" VenueResponse
    VenueOption "1" --> "0..*" VenueResponse
    Outing "1" --> "0..1" OutingReplacement : origem
    OutingReplacement --> Outing : destino novo
```

`SelectedVenue` é uma referência imutável à opção declarada no Rolê. Alterar `VenueDetails` corrige somente os fatos descritivos da mesma opção; trocar o local social exige `ReplacementOuting`.

## 4. Estado persistido e estado efetivo

### 4.1 `PersistedOutingState`

```mermaid
stateDiagram-v2
    [*] --> Organizing : createOuting
    Organizing --> OccurrenceDeclared : declareOccurrence
    Organizing --> Defined : selectVenue
    Organizing --> Cancelled : cancelOuting

    OccurrenceDeclared --> Defined : selectVenue
    OccurrenceDeclared --> Cancelled : cancelOuting

    Defined --> Replaced : createReplacement
    Defined --> Cancelled : cancelOuting
    Replaced --> [*]
    Cancelled --> [*]

    note right of Organizing
      Participantes podem propor locais,
      responder e declarar um local.
    end note
    note right of Defined
      O combinado está congelado.
      Só detalhes factuais são editáveis.
      Novo local ou nova data cria outro Rolê.
    end note
```

Não há cron, evento ou coluna para persistir `InProgress` ou `Ended`. Edição factual não muda o estado. `Cancelled` e `Replaced` são terminais para comandos.

### 4.2 `EffectiveOutingViewState`

```mermaid
flowchart TD
    Start[Resolver projeção com Clock] --> Final{now >= finalLimit?}
    Final -->|sim| Ended[Ended<br/>somente frase terminal]
    Final -->|não| Persisted{persistedState}
    Persisted -->|CANCELLED| Cancelled[Cancelled]
    Persisted -->|REPLACED| Replaced[Replaced]
    Persisted -->|DEFINED| Started{now >= approximateStart?}
    Started -->|sim| InProgress[InProgress]
    Started -->|não| Defined[Defined]
    Persisted -->|OCCURRENCE_DECLARED| OccurrenceDeclared[OccurrenceDeclared]
    Persisted -->|ORGANIZING| Organizing[Organizing]
```

O purge usa `final_limit_at`, não um estado `ENDED`. A indisponibilidade visual de ações nunca substitui a policy no servidor.

## 5. Identificação por e-mail

```mermaid
sequenceDiagram
    autonumber
    actor P as Pessoa
    participant B as Browser
    participant W as Web action
    participant I as Identity service
    participant M as MySQL
    participant E as Provedor de e-mail

    P->>B: Abre Convite
    B->>W: GET /r/:inviteToken
    W->>M: Busca por SHA-256 do token
    M-->>W: PublicInviteView
    W-->>B: Resumo público + no-store
    P->>B: Informa e-mail
    B->>W: POST request-login
    W->>I: requestLogin(normalizedEmail)
    I->>M: Aplica limites e persiste digests
    I->>E: Envia link e código
    I-->>W: Resultado neutro
    W-->>B: Confirmação neutra

    alt Link recebido
        P->>B: Abre link
        B->>W: GET verify-link
        W-->>B: Confirmação; GET não consome
        P->>B: Confirma continuar
        B->>W: POST consume-link
    else Código recebido
        P->>B: Digita código
        B->>W: POST verify-code
    end

    W->>I: consumeChallenge()
    I->>M: Bloqueia challenge e valida digest, prazo e tentativas
    I->>M: Cria/recupera Identity e emite Session
    M-->>I: Commit
    I-->>W: Token opaco de sessão
    W-->>B: Cookie Secure, HttpOnly, SameSite=Lax
    B->>W: Retorna ao mesmo Convite
    W-->>B: Solicita/reutiliza Nick contextual
```

O endereço de e-mail não é exposto ao módulo `outings`, aos demais participantes, aos logs ou à auditoria do Rolê.

## 6. Declaração concorrente de local

```mermaid
sequenceDiagram
    autonumber
    actor A as Participante A
    actor B as Participante B
    participant WA as Action A
    participant WB as Action B
    participant DB as MySQL/InnoDB

    par Requisições concorrentes
        A->>WA: selectVenue(optionA, commandA, expectedOutingVersion)
        B->>WB: selectVenue(optionB, commandB, expectedOutingVersion)
    end
    WA->>DB: BEGIN READ COMMITTED
    WA->>DB: SELECT outing FOR UPDATE
    DB-->>WA: Outing ORGANIZING v7
    WB->>DB: BEGIN READ COMMITTED
    WB->>DB: SELECT outing FOR UPDATE
    Note over WB,DB: aguarda lock curto
    WA->>DB: UPDATE selected venue + frozen time + version 8
    WA->>DB: INSERT audit + command receipt
    WA->>DB: COMMIT
    DB-->>WB: Outing DEFINED v8
    WB->>WB: Reavalia comando no estado atual
    WB->>DB: Registra resultado idempotente ou rejeita conflito estável
    WB->>DB: COMMIT

    Note over A,B: O resultado técnico não significa votação,<br/>maioria ou legitimidade superior.
```

Se os dois comandos declaram exatamente a mesma opção, o segundo pode retornar sucesso idempotente. Se declaram opções distintas, o segundo recebe erro de conflito e a projeção atual, sem sobrescrever a primeira transição.

## 7. Troca de local ou data após a definição

```mermaid
sequenceDiagram
    autonumber
    actor P as Participante identificado
    participant W as Web action
    participant O as Outing service
    participant DB as MySQL

    P->>W: Criar outro Rolê
    W->>O: createReplacement(sourceOutingId, commandId)
    O->>DB: BEGIN + lock source outing
    O->>O: Valida identidade, prazo e estado
    O->>DB: Cria novo Outing + novo token de Convite
    O->>DB: Marca origem como Replaced
    O->>DB: Persiste vínculo, audit e receipt
    O->>DB: COMMIT
    O-->>W: ReplacementCreated(newInvite)
    W-->>P: Novo Convite; sem herdar interesse ou respostas
```

Antes da definição, os detalhes da opção podem ser alterados. Depois da definição, `Editar detalhes` preserva a identidade social do local e modifica apenas nome, endereço ou URLs; para outro local ou outra data, a ação disponível é `Criar outro Rolê`.

## 8. Modelo relacional

```mermaid
erDiagram
    IDENTITIES ||--o{ SESSIONS : owns
    IDENTITIES o|--|{ IDENTITY_EMAIL_ALIASES : resolves
    IDENTITY_EMAIL_ALIASES ||--o{ LOGIN_CHALLENGES : anchors
    IDENTITIES ||--o{ PARTICIPANTS : assumes
    OUTINGS ||--|{ PARTICIPANTS : includes
    OUTINGS ||--o{ GENERAL_INTERESTS : scopes
    PARTICIPANTS ||--o| GENERAL_INTERESTS : states
    OUTINGS ||--o{ VENUE_OPTIONS : proposes
    PARTICIPANTS ||--o{ VENUE_RESPONSES : gives
    VENUE_OPTIONS ||--o{ VENUE_RESPONSES : receives
    OUTINGS ||--o{ DECLARATIONS : records
    OUTINGS ||--o{ DECLARATION_CONFLICTS : records
    PARTICIPANTS ||--o{ DECLARATION_CONFLICTS : attempts
    OUTINGS ||--o{ AUDIT_EVENTS : audits
    OUTINGS ||--o{ COMMAND_RECEIPTS : deduplicates
    OUTINGS ||--o| OUTING_REPLACEMENTS : source
    OUTINGS ||--o| OUTING_REPLACEMENTS : replacement

    IDENTITIES {
      char id PK
      datetime last_active_at
    }
    IDENTITY_EMAIL_ALIASES {
      char id PK
      binary email_lookup UK
      int email_lookup_secret_version
      char identity_id FK
      datetime created_at
    }
    SESSIONS {
      char id PK
      char identity_id FK
      binary token_digest UK
      datetime expires_at
      datetime revoked_at
    }
    LOGIN_CHALLENGES {
      char id PK
      char email_alias_id FK
      binary link_digest UK
      binary code_digest
      int challenge_secret_version
      varchar delivery_status
      int attempt_count
      datetime expires_at
      datetime consumed_at
    }
    OUTINGS {
      char id PK
      varchar state
      date social_date
      varchar time_zone
      datetime approximate_start_at
      datetime final_limit_at
      char selected_venue_option_id FK
      binary invite_token_digest UK
      int version
    }
    OUTING_REPLACEMENTS {
      char source_outing_id PK,FK
      char replacement_outing_id UK,FK
      char participant_id FK
      datetime created_at
    }
    PARTICIPANTS {
      char id PK
      char outing_id FK
      char identity_id FK
      varchar display_name
      int version
    }
    GENERAL_INTERESTS {
      char outing_id PK,FK
      char participant_id PK,FK
      varchar value
      datetime updated_at
      int version
    }
    VENUE_OPTIONS {
      char id PK
      char outing_id FK
      varchar state
      varchar name
      varchar address
      int version
    }
    VENUE_RESPONSES {
      char id PK
      char outing_id FK
      char participant_id FK
      char venue_option_id FK
      varchar value
      datetime updated_at
      int version
    }
    DECLARATIONS {
      char id PK
      char outing_id FK
      char participant_id FK
      varchar type
      char target_id
      datetime declared_at
    }
    DECLARATION_CONFLICTS {
      char id PK
      char outing_id FK
      char participant_id FK
      char attempted_target_id
      int observed_version
      datetime occurred_at
    }
    AUDIT_EVENTS {
      char id PK
      char outing_id FK
      varchar event_type
      int aggregate_version
      json change_snapshot
      datetime occurred_at
    }
    COMMAND_RECEIPTS {
      char command_id PK
      char actor_identity_id FK
      varchar scope_type
      char scope_id
      char resulting_outing_id FK
      varchar command_type
      binary payload_fingerprint
      varchar status
      int resulting_version
      json result_snapshot
      datetime created_at
    }
```

Os tipos ilustram intenção, não substituem migrations. Em `IDENTITY_EMAIL_ALIASES`, a unique key é composta por `(email_lookup_secret_version, email_lookup)` e `identity_id` pode ser null antes do primeiro consumo. O e-mail normalizado existe em memória somente durante emissão/entrega; a persistência usa lookup keyed, e tokens persistem somente como digest. URLs ficam na tabela normalizada `venue_option_urls`; revisões e tabelas operacionais omitidas desta vista estão enumeradas no Solution Design. URLs e endereços pertencem ao dado de negócio e nunca entram em logs técnicos.

## 9. Implantação

```mermaid
flowchart TB
    subgraph VCN[VCN privada — São Paulo]
        subgraph AppSubnet[Subnet da aplicação + NSG 80/443]
            subgraph VM[OCI Always Free VM — ARM64, 2 OCPU, 12 GB]
                Caddy[Caddy no host<br/>TLS + security headers] --> Active{slot ativo}
                Active --> Blue[Rootless Podman blue<br/>127.0.0.1:3001]
                Active --> Green[Rootless Podman green<br/>127.0.0.1:3002]
                Timer[systemd timers] --> Maintenance[Rootless Podman<br/>maintenance one-shot]
                Metrics[Logs e métricas allowlist]
                Blue --> Metrics
                Green --> Metrics
                Maintenance --> Metrics
            end
        end
        subgraph DBSubnet[Subnet privada + NSG somente aplicação]
            MySQL[(OCI MySQL DB System<br/>InnoDB, 2 ECPU, 8 GB, 50 GB)]
        end
    end

    Internet((Internet)) --> Caddy

    Blue -->|TLS/3306 privado| MySQL
    Green -->|TLS/3306 privado| MySQL
    Maintenance -->|TLS fail-closed: purge e dump| MySQL
    Maintenance -->|dump lógico cifrado, 7 dias| ObjectStorage[(OCI Object Storage)]
    MySQL -->|backup automático, 1 dia| OCIBackup[(OCI backup)]
    Blue -->|HTTPS| Resend[Resend]
    Green -->|HTTPS| Resend
    Pipeline[GitHub Actions] -->|imagem ARM64 por digest| GHCR[(GHCR)]
    GHCR --> Blue
    GHCR --> Green
```

O banco não possui endpoint público nem HA no envelope gratuito. O deploy troca apenas o slot depois de migration forward-compatible, readiness e smoke; restore em ambiente limpo verifica objetivos best effort de RPO 24h/RTO 4h.

## 10. Retenção

```mermaid
flowchart LR
    FinalLimit[FinalLimit atingido] -->|30 dias| PurgeOuting[Hard-delete do agregado]
    Cancelled[Rolê cancelado] --> FinalAnchor[Preserva a âncora FinalLimit]
    Replaced[Rolê substituído] --> FinalAnchor
    FinalAnchor --> PurgeOuting

    ChallengeExpired[Challenge expirado/consumido] -->|até 24h| PurgeCredential[Eliminar credencial efêmera]
    SessionExpired[Sessão expirada/revogada] -->|até 24h| PurgeCredential
    RateBucket[Bucket fora da janela] -->|até 24h| PurgeCredential
    IdentityIdle[Identity sem sessão nem Rolê retido] -->|30 dias| PurgeIdentity[Eliminar Identity]
    Logs[Logs técnicos] -->|14 dias| PurgeLogs[Expirar]
    LogicalDump[Dump lógico cifrado] -->|alvo 7 dias dentro da quota| PurgeBackup[Lifecycle]
```

Os jobs são idempotentes e processam lotes limitados. Nenhum dado de autenticação é preservado por auditoria de domínio.
