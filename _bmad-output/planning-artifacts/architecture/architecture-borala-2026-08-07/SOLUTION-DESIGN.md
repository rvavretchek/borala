---
name: Bora Lá — Solution Design
type: architecture-companion
status: final
created: '2026-08-07'
updated: '2026-08-07'
language: pt-BR
code-language: en
spine: ARCHITECTURE-SPINE.md
---

# Solution Design — Bora Lá

Este companion explica como implementar o [Architecture Spine](./ARCHITECTURE-SPINE.md). Em caso de divergência, o spine e as fontes normativas vencem. Diagramas estão em [UML](./UML.md).

## 1. Contexto e fronteira

O Bora Lá é uma aplicação web responsiva orientada por Convite. Ela organiza informação de encontros informais sem substituir a conversa do grupo e sem decidir por ele. O sistema possui três atores externos:

- pessoa não identificada com um Convite, que recebe somente a prévia pública;
- participante identificada, que consulta e registra fatos no Rolê;
- provedor de e-mail, que entrega o desafio de autenticação.

A aplicação não possui chat, painel histórico, cadastro de grupo, moderação, reserva, pagamento ou publicação automática.

## 2. Arquitetura de runtime

Uma imagem OCI ARM64 contém a aplicação React Router/Node.js e expõe dois comandos:

- `web`: SSR, loaders, actions e assets;
- `maintenance`: eliminação, limpeza de credenciais e verificação do DR.

Caddy termina TLS e encaminha para um de dois slots locais, `blue` ou `green`. A aplicação é stateless; sessão, challenges, idempotência e domínio residem no OCI MySQL privado. Resend é acessado por HTTPS pelo adapter `EmailSender`.

Não há API pública separada. Formulários React Router são a interface de comandos; endpoints JSON existem somente quando uma interação progressivamente aprimorada realmente exige.

## 3. Módulos e dependências

### 3.1 `identity`

Responsabilidades:

- normalizar o e-mail e calcular `emailLookup`;
- emitir, limitar, consumir e expirar `LoginChallenge`;
- criar ou recuperar `Identity` após prova do e-mail;
- emitir, rotacionar, validar e revogar `Session`;
- enviar o desafio pelo port `EmailSender`.

O módulo não conhece Convite, Nick, Rolê ou participação.

### 3.2 `outings`

Responsabilidades:

- criar e projetar Rolês;
- associar `Identity` a `Participant` e `DisplayName` contextual;
- registrar Interesse Geral, Opções, Respostas, Declarações e Correções;
- aplicar tempo, concorrência, cancelamento, substituição e encerramento;
- produzir DTO público ou identificado;
- manter `AuditEvent` e `CommandReceipt`.

O módulo recebe `identityId` autenticada; nunca recebe e-mail.

### 3.3 `shared`

Somente:

- `Clock`;
- `IdGenerator`;
- `TokenGenerator`;
- `DomainError` e `Result`;
- tipos de instante e paginação técnica.

Não há `utils`, `common services` ou regras de negócio compartilhadas.

## 4. Composition root

`app/server/composition/composition-root.server.ts` é o único lugar que instancia infraestrutura:

```ts
interface ApplicationContext {
  identity: IdentityUseCases;
  outings: OutingUseCases;
  database: DatabaseHealth;
}
```

Routes solicitam o contexto por função estável. Testes substituem ports no composition root de teste; código de domínio não usa container de injeção, service locator ou singleton global mutável.

## 5. Contrato web

### 5.1 Rotas conceituais

| Método e rota | Audiência | Contrato |
|---|---|---|
| `GET /` | pública | Entrada e criação de Rolê. |
| `POST /auth/challenges` | pública | Emite resposta neutra e envia botão/código. |
| `GET /auth/continue/:token` | pública | Mostra confirmação; não consome token. |
| `POST /auth/continue/:token` | pública | Consome desafio e cria sessão. |
| `POST /auth/codes` | pública | Valida código e cria sessão. |
| `POST /outings` | autenticada | Cria Rolê, primeira participação e Convite. |
| `GET /r/:inviteToken` | progressiva | Resolve estado antes de projetar público ou identificado. |
| `POST /r/:inviteToken/join` | autenticada | Cria Nick somente se ainda não houver participação. |
| `POST /r/:inviteToken/commands/:command` | participante | Executa um comando permitido pelo estado. |
| `POST /logout` | autenticada | Revoga sessão e limpa UI. |
| `GET /health/live` | operação | Verifica processo sem acessar MySQL. |
| `GET /health/ready` | operação restrita | Verifica versão, migration e conectividade MySQL. |

Os nomes físicos podem ser refinados sem alterar a semântica. GET nunca muda estado. O token do Convite permanece no path; desafio e sessão nunca entram em query string.

#### Matriz de guards

| Rota | Sessão | CSRF | Origin/Fetch Metadata | Rate limit/efeito |
|---|---|---|---|---|
| `GET /`, `GET /r/:inviteToken` | opcional | não | GET sem efeito | lookup limitado por IP; resposta por audiência. |
| `POST /auth/challenges` | não | pre-auth token | origem exata; rejeita cross-site | buckets de emissão; resposta neutra. |
| `GET /auth/continue/:token` | não | emite pre-auth token | GET sem efeito | valida disponibilidade sem incrementar tentativa ou consumir; mensagem não revela e-mail/Identity. |
| `POST /auth/continue/:token`, `POST /auth/codes` | não | pre-auth token | origem exata; rejeita cross-site | máximo cinco tentativas; consumo atômico e sessão nova. |
| `POST /outings` | sim | sessão | origem exata; rejeita cross-site | Identity + `commandId`; cria primeira participação. |
| `POST /r/:inviteToken/join` | sim | sessão | origem exata; rejeita cross-site | `commandId`; cria Participant somente em Rolê mutável. |
| `POST /r/:inviteToken/commands/:command` | sim | sessão | origem exata; rejeita cross-site | Participant, `commandId` e precondições de versão. |
| `POST /logout` | sim | sessão | origem exata; rejeita cross-site | revoga sessão; sem audit de domínio. |

O pre-auth CSRF usa cookie `__Host-borala_preauth` aleatório, `Secure`, `HttpOnly`, `SameSite=Lax`, e token de formulário HMAC vinculado ao nonce; não exige Identity nem persistência. `Origin` é obrigatório quando enviado e deve ser exatamente o origin configurado; Fetch Metadata rejeita `Sec-Fetch-Site: cross-site`. Uma falha usa resposta neutra sem criar/trocar sessão.

### 5.2 Envelopes e guards

Criação e ingresso não inventam uma versão inexistente:

```ts
interface CreateCommandEnvelope<TPayload> {
  commandId: string;
  csrfToken: string;
  payload: TPayload;
}

type VersionPreconditions = Partial<{
  outing: number;
  venueOption: number;
  participant: number;
  generalInterest: number;
  venueResponse: number;
}>;

interface VersionedCommandEnvelope<TPayload>
  extends CreateCommandEnvelope<TPayload> {
  expectedVersions: VersionPreconditions;
}
```

Autenticação pública usa challenge, rate limit e consumo atômico, sem sessão prévia. `CreateOuting` exige Identity verificada; `join`, sessão verificada; comandos sobre Outing existente, sessão + Participant; logout, sessão. CSRF aplica-se a todos os POSTs ligados a sessão, mas `expectedVersions` somente às entidades existentes e `commandId` aos comandos de `outings` que precisam de idempotência. Cada caso de uso aceita apenas as chaves de versão declaradas na matriz de locks.

O servidor resolve sessão, Convite e participação quando aplicáveis, valida a entrada com Zod e só então constrói tipos de domínio. O cliente nunca envia `identityId`, `participantId`, autoria, contagem ou estado final.

### 5.3 Erros estáveis

Application retorna códigos, e a borda web escolhe o texto em Português:

| Código | HTTP | Uso |
|---|---:|---|
| `VALIDATION_FAILED` | 422 | Entrada estrutural inválida. |
| `AUTHENTICATION_REQUIRED` | 401 | Sessão ausente ou inválida. |
| `PARTICIPATION_REQUIRED` | 403 | Identity ainda não escolheu Nick neste Rolê. |
| `INVITATION_NOT_AVAILABLE` | 404 | Token inválido ou registro já eliminado. |
| `OUTING_ENDED` | 410 | Limite Final atingido; resposta sem detalhes. |
| `STALE_VERSION` | 409 | Estado mudou desde a tela apresentada. |
| `DECLARATION_CONFLICT` | 409 | Outra declaração incompatível venceu a corrida. |
| `DISPLAY_NAME_TAKEN` | 409 | Nick contextual indisponível. |
| `INVALID_STATE` | 409 | Comando não permitido no estado vigente. |
| `IDEMPOTENCY_KEY_REUSED` | 409 | Mesmo `commandId` reapareceu com actor, escopo, tipo ou payload diferente. |
| `RATE_LIMITED` | 429 | Limite de autenticação excedido; mensagem neutra. |

Falhas inesperadas retornam correlação por `requestId`, nunca stack, SQL ou dado pessoal.

## 6. Identidade, challenge e sessão

### 6.1 Normalização e lookup

`EmailAddressNormalizer` aplica trim, normaliza domínio por IDNA, compara de forma case-insensitive e não remove pontos nem aliases `+`. O e-mail normalizado existe apenas em memória durante a requisição. O lookup persistido é:

```text
HMAC-SHA-256(emailLookupSecret, normalizedEmail)
```

Segredos diferentes protegem e-mail, código e tokens. Rotação usa `secretVersion` no registro; versões antigas permanecem disponíveis somente enquanto houver dados protegidos por elas.

| Derivação persistida | Tabela/campo | Versão | Protocolo de leitura/rotação |
|---|---|---|---|
| lookup de e-mail | `identity_email_aliases.email_lookup` | `email_lookup_secret_version` | calcula HMAC para versões legíveis; encontra alias antigo e cria alias corrente ligado à mesma Identity. |
| ponte do challenge | `login_challenges.email_alias_id` | versão pertence ao alias | vários challenges referenciam o mesmo alias, mesmo antes de existir Identity. |
| link e código | `login_challenges.*_digest` | `challenge_secret_version` | verifica somente pela versão gravada; chave fica legível até todos os challenges vencerem e serem eliminados. |
| digest diário de IP | `auth_rate_limit_buckets.subject_digest` | `subject_secret_date` | chave diária permanece somente pela janela + 24h. |
| Convite/sessão | `outings.invite_token_digest`, `sessions.token_digest` | não se aplica | SHA-256 de token aleatório de alta entropia, sem chave. |

Emissão pesquisa aliases de todas as versões legíveis. Se não encontrar, cria alias corrente com `identity_id = null`; se encontrar alias antigo já vinculado, cria por UPSERT o alias corrente para a mesma Identity e referencia o corrente. No consumo, bloqueia o alias: se ainda for null, cria uma Identity e liga o alias; se outro challenge já fez isso, reutiliza a Identity. Assim, challenges antigos continuam resolvendo pelo alias antigo depois da rotação. Unique `(secret_version, email_lookup)` e retries por duplicate key impedem claims duplicados.

Alias antigo só é removido quando nenhum challenge o referencia e existe alias corrente para a Identity, ou quando a Identity/claim órfã é eliminada. A chave sai do secret store apenas quando a contagem de aliases/challenges dependentes for zero. Como o e-mail não é persistido, migração é lazy e versões antigas podem permanecer por longo prazo. Deploy ocorre em duas fases: distribuir como legível; depois promover a corrente em todos os processos. Testes A/B cobrem dois challenges pré-rotação: A liga o alias antigo à nova Identity, B reencontra a mesma Identity, e uma solicitação posterior — agora com e-mail em memória — cria o alias corrente; cobrem também criação concorrente, expiração e purge.

### 6.2 Challenge

Um challenge contém link aleatório de 32 bytes e código decimal de seis dígitos, com digests HMAC distintos e contexto que inclui `challengeId`; expira em dez minutos e aceita no máximo cinco tentativas. O e-mail contém:

- botão `Continuar no Bora Lá`;
- código alternativo;
- validade e aviso para ignorar solicitação não iniciada.

O GET do botão mostra a confirmação e não consome o desafio, evitando consumo por scanner de e-mail. Somente o POST ou código correto consome. Criação/recuperação de `Identity`, consumo e emissão de sessão ocorrem numa transação.

Rate limits usam buckets por `emailLookup`, digest de IP com segredo rotativo diário e janela. Resposta, duração observável e texto não revelam se a Identity existia.

Defaults de emissão: três challenges por e-mail/15min e dez/dia; vinte por IP/15min e cem/dia; no máximo três challenges simultaneamente válidos por e-mail. Verificação mantém cinco tentativas por challenge e cinquenta por IP/15min. Novo envio só é aceito após 60s, não invalida desafio anterior e parâmetros podem ser apertados por configuração, nunca afrouxados sem decisão de segurança.

A emissão persiste `PENDING`, faz commit e chama o provedor com timeout de 5s. Entrega confirmada marca `SENT`; rejeição explícita marca `DELIVERY_FAILED` e expira o challenge; timeout ambíguo marca `DELIVERY_UNKNOWN` e mantém validade porque a mensagem pode chegar. Não há retry automático que possa duplicar e-mail; a pessoa pode solicitar outro após o cooldown. Todas as categorias retornam a mesma confirmação neutra e consomem o bucket de emissão.

Rotas com token são registradas apenas pelo template (`/auth/continue/:token` e `/r/:inviteToken`); Caddy e aplicação nunca registram URL bruta. Páginas de autenticação também usam `no-store` e `no-referrer`.

### 6.3 Sessão

- token: 32 bytes aleatórios, Base64URL;
- banco: SHA-256 do token, nunca o token;
- cookie: `__Host-borala_session`, `Path=/`, `HttpOnly`, `Secure`, `SameSite=Lax`;
- duração: 30 dias absolutos;
- rotação: autenticação bem-sucedida e eventos de risco;
- logout: revogação server-side e cookie expirado.

CSRF usa token HMAC vinculado ao token de sessão ou pre-auth nonce, inclui key ID e expira em 30 minutos; valida também `Origin`/Fetch Metadata. A key anterior permanece legível somente pelo TTL do formulário. `SameSite` é defesa adicional, não a única defesa.

## 7. Convite, participação e projeções

`inviteToken` possui 24 bytes aleatórios e o banco armazena SHA-256. O token só localiza o Rolê. Para agir:

```text
token válido + sessão válida + Participant vigente + comando permitido
```

Uma Identity autenticada que abre um Convite:

- recupera automaticamente o `Participant` existente; ou
- escolhe um novo `DisplayName`, único naquele Rolê.

Não há listagem de Rolês por Identity.

### 7.1 DTO público

`PublicInvitationView` contém somente:

- nome;
- Data e texto humano de horário;
- nome/referência pública do Local quando definido, sem endereço ou URLs;
- `interestedCount`, o total de pessoas com Interesse Geral `Tô a fim`;
- estado terminal público;
- link do replacement quando aplicável.

Antes de montar qualquer DTO, `Clock >= finalLimit` retorna exclusivamente `EndedInvitationView` com `Este Rolê terminou.`. Cancelamento, substituição e link do replacement só são projetados antes dessa borda.

`interestedCount` usa `COUNT(DISTINCT participant_id)` sobre o estado vigente `GeneralInterest.INTERESTED`. A fórmula é idêntica com zero, uma ou várias Opções, que estejam ativas, inativas ou fechadas. `UNSURE`, ausência e qualquer `VenueResponse` não entram nessa conta. A frase pública pode dizer `{n} pessoas tão a fim`, sem ligar o número a uma Opção ou Declaração.

### 7.2 DTO identificado

`ParticipantOutingView` acrescenta somente dados necessários ao estado e à ação vigente: opções, contagens, Nicks de `Topo`, autorias contextuais, histórico operacional e capacidades permitidas. Nunca contém e-mail, digests, IDs de sessão ou credenciais.

Um mapper diferente constrói cada audiência. Não existe DTO “completo” filtrado depois.

#### Projeções discriminadas

| `kind` efetivo | Pública — allowlist | Participant — acréscimos permitidos |
|---|---|---|
| `organizing` | nome, Data, horário humano, `interestedCount`, `localStatus=open` | própria participação, Interesse Geral, Opções ativas/inativas em ordem, Respostas/contagens autorizadas, Nicks somente de `Topo`, autorias e capacidades válidas. |
| `occurrenceDeclared` | mesmos campos de organização; sem autoria | declaração/autoria, além dos campos identificados de organização. |
| `defined` / `inProgress` | nome, Data, horário humano, `interestedCount`, nome do Local | endereço/URLs, rota, Option selecionada e histórico factual; Resposta somente enquanto a policy permitir; demais Opções fechadas em histórico. |
| `cancelled` | nome + `Rolê cancelado.` | `cancelledByDisplayName` e `cancelledAt`; sem Local, endereço, rota, Respostas, contagem operacional ou ações mutáveis. |
| `replaced` | nome + aviso + URL do novo Convite | `replacedByDisplayName` e `replacedAt`; sem plano operacional antigo ou ações mutáveis. |
| `ended` | somente `Este Rolê terminou.` | nenhum acréscimo. |

Esses tipos são uniões discriminadas separadas; mappers partem de `kind` e constroem somente a allowlist. Contract tests negativos fazem serialização falhar se um campo não permitido aparecer, inclusive em Cancelado, Substituído e Encerrado.

### 7.3 Compartilhamento e rota externa

Compartilhar usa Web Share API quando disponível e fallback de cópia por gesto explícito, sem ler o clipboard. A mensagem é montada na hora, sempre contém o Convite vivo e não é persistida. Estado compartilhado antigo nunca prevalece sobre a leitura atual.

Abrir rota exige gesto explícito e aviso de que o endereço será enviado ao provedor externo. A URL é construída por adapter com template HTTPS e host em allowlist; nunca é aceita uma URL de rota arbitrária. A navegação usa `noopener noreferrer`.

## 8. Modelo de domínio

### 8.1 Agregados

`Outing` é a raiz para transições coletivas. `VenueOption` possui versão própria para edições concorrentes. `Participant` garante Nick contextual. `Identity` e `Session` pertencem ao módulo identity.

Estados de `Outing` persistidos:

- `ORGANIZING`;
- `OCCURRENCE_DECLARED`;
- `DEFINED`;
- `CANCELLED`;
- `REPLACED`.

`IN_PROGRESS` e `ENDED` são projeções temporais derivadas de estado persistido + `Clock`; não exigem cron para transicionar. `ENDED` prevalece na exposição quando `Clock >= finalLimit`. `IN_PROGRESS` só existe quando `persistedState == DEFINED && approximateStart <= Clock < finalLimit`; a passagem da hora não muda Organização nem Ocorrência declarada.

Estados de `VenueOption`:

- `ACTIVE`;
- `INACTIVE`;
- `CLOSED`.

### 8.2 Comandos principais

| Comando | Pré-condição essencial | Efeito |
|---|---|---|
| `CreateOuting` | Identity verificada e Nick válido | Cria Outing, Participant e Convite atomicamente. |
| `ChangeDisplayName` | Participante e Nick disponível | Atualiza Nick e grava revisão/autoria atomicamente. |
| `SetGeneralInterest` | `ORGANIZING` ou `OCCURRENCE_DECLARED` | Define `INTERESTED`, `UNSURE` ou limpa; nunca converte Resposta. |
| `CreateVenueOption` | Organização ativa | Retorna hints de possível duplicidade; confirmação congela original e autoria. |
| `EditVenueDetails` | Participante; regra por estado | Acrescenta revisão factual sem trocar Local social. |
| `SetVenueOptionStatus` | Organização ativa | Inativa/reativa sem excluir. |
| `SetVenueResponse` | Policy de estado/tempo e CAS | Insere ou altera uma Resposta sem last-write-wins. |
| `DeclareOccurrence` | `ORGANIZING` | Registra declaração sem fechar opções; repetição no estado seguinte é idempotente. |
| `SelectVenue` | Organização e opção ativa | Define Local, congela hora móvel e fecha opções. |
| `CreateReplacementOuting` | Definido e não terminal | Cria novo Rolê vazio e substitui o anterior. |
| `ChangeApproximateStart` | Regra de uma hora e mesma Data | Atualiza instante sem mudar Data social. |
| `ExtendFinalLimit` | Convite operacional e limite válido | Mantém maior limite concorrente. |
| `CancelOuting` | Antes do Limite Final | Cancela terminalmente. |

Depois da definição não existe `ChangeSelectedVenue`. `EditVenueDetails` altera informação factual do Local já escolhido; outro Local ou Data exige `CreateReplacementOuting`.

### 8.3 Alerta de possível duplicidade

`DuplicateVenueHintPolicy` compara somente Opções do mesmo Rolê e nunca bloqueia, funde ou reordena. Texto comparável usa NFKD, remove marcas, aplica lowercase, converte pontuação em espaço e colapsa whitespace. Há hint quando: URL canônica é idêntica; nome tem igualdade ou similaridade normalizada de Levenshtein ≥ 0,85 para chaves com pelo menos cinco caracteres; ou rua normalizada é igual e números inteiros diferem no máximo dez. Casos sem número mostram a mesma rua para avaliação humana. A confirmação explícita sempre pode criar Opção independente, e testes de tabela fixam os exemplos.

### 8.4 Interesse Geral

`GeneralInterest` possui dois valores persistidos, `INTERESTED` e `UNSURE`; ausência de linha significa não informado. A pessoa pode definir, trocar ou limpar sua própria disposição enquanto o Local está aberto. Depois de `DEFINED`, o valor fica somente leitura. Interesse Geral não escolhe Opção, não vira Resposta, não participa de Declaração e não confere autoridade.

### 8.5 Nick e URLs

`DisplayName` preserva valor de exibição em NFC após trim e colapso de whitespace Unicode, aceita de 1 a 32 grapheme clusters e rejeita controles, bidi controls e caracteres default-ignorable. `DisplayNameKeyPolicy` aplica NFKC, colapso de whitespace e lowercase locale-insensitive; a unique key `(outing_id, display_name_key)` decide unicidade. Não remover diacríticos nem tentar resolver homoglyphs.

URL informada por participante precisa ser `https:`, ter no máximo 2.048 caracteres, não conter userinfo e passar por `URL`. Persistem-se o original imutável e a forma vigente; a chave de duplicidade normaliza host IDNA/lowercase, porta default, path vazio e remove fragment, sem executar fetch. Renderização usa texto seguro, `noopener noreferrer` e CSP; `javascript:`, `data:`, `file:` e URLs relativas são recusadas.

### 8.6 Matriz de comandos por estado e tempo

| Comando | Policy server-side |
|---|---|
| `JoinOuting` | somente antes de `FinalLimit` e enquanto persistido não for `CANCELLED`/`REPLACED`. |
| `ChangeDisplayName` | Organização, Ocorrência declarada, Definido ou Em andamento antes do limite; CAS de Participant. |
| `SetGeneralInterest` | somente `ORGANIZING`/`OCCURRENCE_DECLARED`; CAS do interesse, zero significa ausência. |
| `CreateVenueOption` | somente `ORGANIZING`/`OCCURRENCE_DECLARED`. |
| `EditVenueDetails` | Local aberto: Option-alvo ativa ou inativa; após `DEFINED`: somente Option selecionada e apenas antes do limite; terminal recusa. |
| `SetVenueOptionStatus` | somente Local aberto; Option fechada nunca reabre. |
| `SetVenueResponse` | Local aberto: Option ativa; após `DEFINED`: somente selecionada, mesmo fechada, enquanto `Clock <= approximateStart`; CAS da Resposta. |
| `DeclareOccurrence` | somente `ORGANIZING`; repetição idêntica em `OCCURRENCE_DECLARED` é idempotente. |
| `SelectVenue` | `ORGANIZING`/`OCCURRENCE_DECLARED`, Option ativa do mesmo Outing. |
| `ChangeApproximateStart` | qualquer estado não terminal anterior a Em andamento, mesma Data social e `Clock <= currentStart - 1h`; CAS de Outing. |
| `ExtendFinalLimit` | Organização, Ocorrência declarada, Definido ou Em andamento, sempre antes do limite; valor maior e até 07h. |
| `CreateReplacementOuting` | somente `DEFINED` ou sua projeção Em andamento, antes do limite. |
| `CancelOuting` | qualquer estado persistido não terminal antes do limite, inclusive Em andamento. |

`CANCELLED`, `REPLACED` e o gate `ENDED` recusam comandos de domínio. A Option selecionada estar `CLOSED` impede inativação/reativação, mas não a Resposta ao plano vigente dentro da janela nem a edição factual autorizada.

## 9. Concorrência

### 9.1 Ordem de locks

Para impedir deadlocks evitáveis, qualquer comando usa esta ordem:

1. claim de `command_receipts`, quando aplicável;
2. `outings`, por ID crescente;
3. `venue_options`, por ID crescente;
4. `participants`, por ID crescente;
5. `general_interests`/`venue_responses` e tabelas append-only.

| Comandos | Locks | CAS/versão incrementada |
|---|---|---|
| criação/ingresso | claim; raiz existente `FOR SHARE` no ingresso | nenhuma entidade anterior; uniques resolvem corrida. |
| Nick | raiz `FOR SHARE`; Participant `FOR UPDATE` | `participant`. |
| Interesse Geral | raiz `FOR SHARE`; Participant `FOR SHARE`; Interest `FOR UPDATE` se existir | `generalInterest`, zero para insert. |
| criar Option | raiz `FOR SHARE` | unique/ID + receipt; não incrementa Outing. |
| editar/inativar Option | raiz `FOR SHARE`; Option `FOR UPDATE` | `venueOption`. |
| Resposta | raiz `FOR SHARE`; Option e Participant `FOR SHARE`; Response `FOR UPDATE` se existir | `venueResponse`, zero para insert. |
| ocorrência, seleção, horário, limite, cancelamento | raiz `FOR UPDATE`; na seleção, Options por ID `FOR UPDATE` | `outing`; Options fechadas também incrementam. |
| replacement | raiz de origem `FOR UPDATE`; criação do destino; vínculo | `outing` de origem. |

Todas as operações que fecham janela obtêm lock exclusivo da raiz, portanto esperam Resposta/Interesse em curso. O lock da Option serializa Resposta contra inativação/edição, e as constraints compostas validam que Option/Participant pertencem à raiz.

### 9.2 Padrões

**Resposta:** unique `(outing_id, participant_id, venue_option_id)` e CAS. Ausência exige `expectedVersions.venueResponse = 0` e faz INSERT versão 1; existência faz `UPDATE ... WHERE response_version = expected`, incrementando a versão. Duplicate key ou zero rows retorna `STALE_VERSION` com a projeção vigente. O Nick de `Topo` é projeção da resposta; não há lista nominal separada.

**Declaração:** lock exclusivo da raiz, comparação de `expectedVersions.outing`, validação do estado e commit. Declaração idêntica retorna o receipt anterior ou o estado vigente. Declaração diferente sobre versão obsoleta não muda o Local, mas persiste `declaration_conflict` append-only com autor contextual, alvo tentado, versão observada, declaração vigente e instante, além do receipt; o DTO identificado mostra ambas as autorias após reload sem sugerir qual é legítima.

**Limite Final:** lock exclusivo, validação da janela e `max(current, requested)`. Uma tentativa menor nunca reduz o valor.

**Idempotência:** antes dos locks de domínio, o caso de uso tenta inserir receipt `IN_PROGRESS` com `commandId`, `actorIdentityId`, `scopeType/scopeId`, `commandType` e SHA-256 do payload + precondições serializados por JSON Canonicalization Scheme (RFC 8785). O insert participa da mesma transação. Duplicate key espera o commit concorrente e reabre leitura: coincidência exata retorna somente IDs/versão/código mínimos; qualquer divergência retorna `IDEMPOTENCY_KEY_REUSED`, sem executar ou revelar o receipt anterior. Após o efeito, o receipt vira `COMPLETED` com versão e resultado mínimo antes do commit. Rollback remove o claim.

Rejeição determinística de domínio após o claim também conclui o receipt com error code e versão observada; replay devolve o mesmo código sem repetir efeito. Erros de autenticação, autorização, CSRF ou validação estrutural acontecem antes do claim e nunca criam receipt/audit.

Deadlocks MySQL são tratados como falha transiente. O application service pode repetir a transação um número pequeno e limitado porque o `commandId` torna o resultado determinístico; a UI só informa sucesso depois do commit.

## 10. Tempo

O domínio usa `Temporal.Instant`, `Temporal.PlainDate`, `Temporal.PlainTime` e `Temporal.ZonedDateTime` por trás de tipos próprios. O banco recebe instantes UTC em `DATETIME(6)` e a conexão executa com `time_zone = '+00:00'`.

Combinar Data social + hora + IANA timezone usa explicitamente `disambiguation: 'compatible'` (avança em gap e escolhe a ocorrência anterior em overlap) e persiste o Instant resultante. A mesma implementação `temporal-polyfill` é importada por um adapter único no servidor e nos testes; não alternar entre polyfill e Temporal nativo dentro do mesmo release. Antes de migrar para Node 26+, testes diferenciais precisam demonstrar as mesmas bordas.

Na criação, o browser envia IANA timezone de `Intl.DateTimeFormat().resolvedOptions().timeZone`. O servidor valida. Se ausente ou inválido, a interface revela seleção de fuso; não existe fallback silencioso para o fuso do servidor.

### 10.1 `AfterWork`

A referência invisível é uma função pura:

```text
max(18:00, floorTo30Minutes(nowInOutingZone) + 2h), limitada a 03:00 seguinte
```

Antes de 16h30, permanece 18h. A partir de 16h30 avança em passos de 30 minutos. Ao definir o Local, o resultado vigente é convertido em instante e persistido em `approximate_start_at` na mesma transação.

### 10.2 Bordas

- alterar hora é permitido quando `now <= approximateStart - 1h`;
- exatamente uma hora é permitido;
- com menos de uma hora, é bloqueado;
- Data social nunca muda por cruzar meia-noite;
- extensão deve ser maior que o limite vigente e no máximo 07h do dia seguinte à Data social;
- organização `AfterWork` sem Local termina às 03h.

### 10.3 `FinalLimitPolicy`

O padrão é 03h do dia seguinte à Data social para `AfterWork` e para qualquer horário explícito, inclusive exatamente 18h ou anterior. A regra define a janela operacional do Convite, não uma hora de término do encontro. Extensão continua direta, monotônica, posterior ao valor vigente e limitada a 07h do mesmo dia civil do limite.

## 11. Persistência MySQL

### 11.1 Convenções

- engine `InnoDB`;
- charset `utf8mb4`;
- collation textual escolhida por campo; chaves normalizadas usam collation binária;
- strict SQL mode;
- isolation `READ COMMITTED`;
- IDs UUID gerados por `IdGenerator`, armazenados como `CHAR(36) CHARACTER SET ascii COLLATE ascii_bin`;
- digests como `BINARY(32)`;
- instantes como `DATETIME(6)` UTC;
- estados como `VARCHAR` + `CHECK`, não enum proprietário;
- dinheiro e ponto flutuante não participam do MVP.

### 11.2 Tabelas lógicas

| Tabela | Ownership | Conteúdo/constraints essenciais |
|---|---|---|
| `identities` | identity | `identity_id` e timestamps; não contém e-mail ou lookup. |
| `identity_email_aliases` | identity | HMAC + versão UNIQUE, `identity_id` nullable e timestamps; claim estável pré-Identity. |
| `login_challenges` | identity | `email_alias_id`, digests + versão, delivery status, expiração, tentativas e consumo. |
| `sessions` | identity | `token_digest UNIQUE`, Identity, expiração e revogação. |
| `auth_rate_limit_buckets` | identity | subject digest + janela única + contador. |
| `outings` | outings | estado, Data/fuso/tempo, Local composto, cancelamento, `version`, invite digest único. |
| `outing_replacements` | outings | origem PK, destino UNIQUE e autoria; destino é criado na mesma transação. |
| `participants` | outings | Outing + Identity únicos; Nick/chave únicos no Outing e `version`. |
| `participant_name_revisions` | outings | valor anterior/novo, autor e instante. |
| `general_interests` | outings | uma disposição vigente por Participant/Outing e `version`. |
| `venue_options` | outings | original congelado, vigente projetado, estado, `version` e unique composto com Outing. |
| `venue_option_urls` | outings | URL original/vigente e estado sem apagar referência. |
| `venue_detail_revisions` | outings | campo, anterior, posterior, autor e instante. |
| `venue_responses` | outings | Outing + Participant + Option únicos, FKs compostas, nível e versão. |
| `outing_declarations` | outings | tipo, alvo, autor e instante; fatos sociais explícitos. |
| `declaration_conflicts` | outings | tentativa incompatível, versão observada, estado vigente, autor e instante; nunca altera o Local. |
| `audit_events` | outings | evento append-only, snapshots necessários e versão resultante. |
| `command_receipts` | outings | `command_id UNIQUE`, actor Identity, escopo lógico sem token, `resulting_outing_id` nullable, tipo, payload fingerprint, status, versão/resultado mínimos e timestamps. |
| `maintenance_runs` | operação | job + período únicos, início, fim e resultado. |

Foreign keys usam `RESTRICT` durante vida operacional. O purge explícito elimina agregados em lotes e não depende de cascata acidental. Migrations nomeiam constraints e índices.

Constraints canônicas incluem `UNIQUE(outing_id, participant_id)` e `UNIQUE(outing_id, venue_option_id)` como alvos de FK. Toda tabela de `outings` que referencia Participant ou Option também carrega `outing_id` e usa FK composta; `venue_responses` referencia ambos por pares compostos e `(outing_id, selected_venue_option_id)` referencia Option do mesmo Outing. Replacement nunca liga um Outing a si mesmo (`CHECK`), e o único comando permitido sempre cria o destino novo, sem replacement anterior; origem é PK e destino UNIQUE. Scripts e adapters não podem ligar dois Outings existentes. Testes MySQL tentam resposta/seleção/autoria cruzada, autorreferência e reuso de destino e exigem rejeição.

### 11.3 Auditoria não é event sourcing

Tabelas de estado são a fonte de leitura. `audit_events` não reconstrói agregados. Cada evento contém apenas o necessário para explicar uma mutação: tipo, IDs internos, Nick contextual em snapshot quando requerido, instante, valores anterior/posterior e versão. Nenhum contato de autenticação entra no audit.

### 11.4 Versão e TLS do MySQL

Always Free recebe a maior versão disponibilizada pela OCI e pode mudar de major em manutenção. Provisioning grava `SELECT VERSION()`; CI mantém MySQL 8.4 como baseline e uma lane obrigatória com a mesma major efetiva de produção. Quando a OCI anunciar major nova, um ambiente efêmero dessa major precisa passar por migrations, repositories, concorrência, dump/restore e smoke antes da janela; falha bloqueia deploy e exige correção antecipada, pois downgrade do serviço não é estratégia.

O usuário da aplicação usa `REQUIRE SSL`. `mysql2` recebe CA confiável, `rejectUnauthorized: true`, hostname/FQDN do endpoint privado como server name e `compress: false`; ausência, hostname divergente ou erro de CA falha sem fallback. Readiness consulta `Ssl_cipher` e falha se vazio. Migrations, maintenance e clientes CLI de dump/restore usam `VERIFY_IDENTITY`; nenhum caminho aceita `VERIFY_CA` isolado, `PREFERRED` ou plaintext.

## 12. Retenção e eliminação

`maintenance` executa de forma idempotente e registra `maintenance_runs`:

1. elimina challenges, sessions vencidos/revogados, buckets sem utilidade e aliases órfãos sem challenge há mais de 24h;
2. elimina agregados de Outing 30 dias após `final_limit_at`, em lotes;
3. elimina aliases e depois Identity sem sessão válida nem Outing retido após 30 dias de inatividade;
4. confirma idade do dump e publica métrica técnica.

Cancelamento ou substituição não altera a âncora de retenção. Após hard-delete, o token não confirma existência anterior e a rota responde indisponibilidade genérica.

O job de Outing adquire `UNIQUE(job_name, scheduled_for)`, seleciona no máximo 50 raízes elegíveis e processa uma transação por Outing. Em cada transação: `SELECT outing FOR UPDATE`, revalida `Clock >= finalLimit + 30d`, remove vínculos de replacement como origem/destino, zera a referência ao Local selecionado e elimina, nesta ordem, Respostas, Interesse Geral, conflitos/Declarações, URLs/revisões de Local, revisões de Nick, audit/receipts, Participants, Options e por fim Outing. Qualquer falha reverte integralmente aquele agregado; retry recomeça pela mesma raiz. A pós-condição consulta todas as tabelas de ownership e precisa encontrar zero linhas.

Comandos concorrentes usam o mesmo lock da raiz e, depois do limite, são recusados; não podem recriar filhos durante o purge. Testes executam o schema completo, injetam falha em cada etapa e comprovam rollback, retry, ausência de órfãos e transação curta. Challenges/sessions/buckets usam lotes próprios e não entram no audit de domínio.

## 13. Segurança

### 13.1 Rede e processo

- Caddy é o único ingresso HTTP público em 80/443; SSH administrativo é separado e restrito por origem;
- MySQL 3306 aceita apenas a NSG/subnet da aplicação;
- conexão MySQL exige CA/TLS fail-closed e usuário `REQUIRE SSL`;
- administração MySQL não usa credencial da aplicação;
- SSH por chave, usuário restrito e regra de origem controlada;
- Oracle Linux 9 ARM64 usa rootless Podman/Quadlet sob usuário `borala`, linger habilitado, filesystem read-only, capabilities removidas e sem socket/daemon privilegiado;
- `borala-blue.container` e `borala-green.container` publicam somente `127.0.0.1:3001/3002`; maintenance é unit one-shot/timer com a mesma imagem;
- Caddy roda como serviço systemd do host, fora de Podman, e o deploy troca um fragmento de upstream validado antes de `caddy reload`;
- egress permitido somente ao MySQL privado, DNS, Resend, GHCR/OCI necessários e serviços de observabilidade configurados.

### 13.2 HTTP

Headers mínimos: CSP por nonce, HSTS após validação do domínio, `X-Content-Type-Options: nosniff`, `Referrer-Policy: no-referrer`, frame ancestors `none` e Permissions Policy mínima. Links externos usam `noopener noreferrer` e só recebem endereço após gesto explícito.

### 13.3 Credenciais

Segredos são injetados em runtime e versionados por finalidade. Convite, sessão, challenge e CSRF usam segredos/tokens independentes. Nunca reutilizar o pepper futuro como chave de HMAC.

Se senha entrar depois do MVP, `PasswordCredential` usa Argon2id + salt único + pepper fora do banco, conforme AD-19, e exige fluxo completo de verificação, recuperação e revogação.

## 14. Performance e acessibilidade

Para cumprir conteúdo principal em até 2,5s p75 em 4G:

- SSR entrega o resumo sem esperar hidratação;
- cada loader monta uma projeção bounded, sem N+1;
- assets possuem hash e cache longo; HTML e dados do Convite permanecem `no-store`;
- pool MySQL começa pequeno e possui timeout curto;
- índice cobre invite digest, participation, option order, response counts e purge date;
- imagens do logo são otimizadas e não bloqueiam conteúdo;
- JS cliente não é requisito para leitura pública.

WCAG 2.2 AA é gate. Testes cobrem teclado, foco, landmarks, nomes acessíveis, reflow a 320 CSS px, zoom 400%, contraste, reduced motion e anúncios definidos na UX.

O gate de laboratório usa build de produção, página pública de Convite com fixture fixa, Chrome/Lighthouse em emulação mobile e throttling 4G, cache frio, vinte execuções após duas de aquecimento e p75 de LCP ≤ 2,5s; também registra TTFB, JS transferido e bloqueio de main thread para detectar regressão. A CI compara com baseline no mesmo runner, não reivindica representar a internet real. No piloto, RUM agrega LCP sem Identity/Outing/token e decide o NFR pelo p75 real de sessões 4G; laboratório é gate de regressão, piloto é evidência de resultado.

## 15. Observabilidade

Cada request recebe `requestId`; cada comando de `outings` preserva `commandId`. Autenticação/sessão usam IDs técnicos próprios e nunca `AuditEvent` de domínio. Logs JSON usam allowlist de campos. Métricas não usam Identity, Outing, Nick ou token como label.

Indicadores mínimos:

- p50/p75/p95 de SSR público e identificado;
- taxa de 4xx/5xx por código estável;
- latência/erro/deadlock de transação;
- pool ativo/ocioso/em espera;
- challenge emitido, verificado, expirado e limitado em agregado;
- conflitos de versão e replay idempotente;
- idade do último maintenance e dump;
- quantidade agregada eliminada, sem IDs.

Logs operacionais duram 14 dias. Audit segue a retenção do Outing e não é exportado para logs.

## 16. Testes e gates

### 16.1 Pirâmide

- unitários: value objects, políticas de estado e tempo;
- application: casos de uso com fakes de ports;
- contract/integration: cada repository port contra MySQL 8.4 baseline e a major efetiva de produção;
- route/UI: loaders, actions, DTOs e componentes acessíveis;
- E2E: jornadas UJ-1 a UJ-6, autenticação, cache/retorno e estados terminais.

### 16.2 Concorrência obrigatória

Testes disparam conexões reais em paralelo para:

- duas declarações de locais diferentes;
- declaração idêntica duplicada;
- resposta concorrente do mesmo Participant/Option;
- criação concorrente de Resposta/Interesse ausente com expected version zero;
- cancelamento contra mutação;
- extensões em ordem inversa;
- replacement duplicado;
- replay após timeout entre commit e resposta HTTP.
- reuso de `commandId` por outro actor/escopo/payload;
- login e rekey concorrentes durante rotação de HMAC;
- tentativa de cruzar Participant, Option, Local ou replacement entre Rolês.

### 16.3 Tempo obrigatório

Cobrir 16h29, 16h30, passos de meia hora, meia-noite, 03h, exatamente uma hora, 59m59s, 07h, mudança de dia, gap/overlap de DST e timezone inválido. Testes nunca usam relógio real.

### 16.4 Rastreabilidade de gates

| Contrato | Evidência mínima automatizada |
|---|---|
| FR-1–FR-5 / CAP-1–CAP-3 | E2E dos dois começos, identificação/retorno, DTO público versus identificado, compartilhamento e estado vivo após reload. |
| FR-6–FR-11 / CAP-4–CAP-5 | Unit de `GeneralInterest`, integração de `interestedCount` independente de Opções, contagens/uniqueness de Respostas, warning não bloqueante, revisão histórica, inativação/reativação e janela de Respostas. |
| FR-12–FR-16 / CAP-6–CAP-7 | Integração concorrente, conflito persistente após reload, autoria, edição factual e replacement atômico sem heranças. |
| FR-17–FR-21 / CAP-8, CAP-10–CAP-11 | Unit com `Clock`, integração de extensão monotônica e E2E de todos os estados atravessando `FinalLimit`. |
| FR-22 / CAP-9 | E2E público/identificado de cancelamento, autoria permitida e impossibilidade de restauração. |
| NFR-1–NFR-4 | Contract tests de DTO, guards server-side, concorrência real, idempotência e audit atômico. |
| NFR-5–NFR-10 | Cypress/axe; orçamento p75; reload após commit; timezone; purge idempotente em lotes; lint de idioma/identificadores. |

Antes do piloto, o gate operacional restaura um dump em schema limpo, executa migrations e smoke. A matriz deve ser expandida para cenários individuais nas stories, sem reduzir estes mínimos.

## 17. CI/CD e migrations

Pull request executa formato, ESLint, TypeScript, regra de imports, Vitest, MySQL integration na baseline e major de produção, Cypress/axe, Lighthouse, build e scans. A imagem é construída para `linux/arm64` e publicada no GHCR pelo SHA/digest.

Deploy:

1. adquire lock operacional;
2. verifica versão/major MySQL, TLS/cipher e migration atual;
3. executa migration forward compatível;
4. grava o digest no Quadlet do slot inativo e sobe pelo systemd user;
5. executa readiness e smoke;
6. valida e recarrega o fragmento do Caddy para a porta local do slot;
7. observa erros por janela curta;
8. preserva slot anterior para rollback de aplicação.

Migrations usam expand/contract. Remover coluna, constraint ou semântica exige primeiro eliminar leitores/escritores antigos em release anterior. Falha de migration não troca tráfego.

Provisioning fixa Oracle Linux 9 ARM64, registra versões de Podman/Caddy, mantém HeatWave cluster/analytics explicitamente desabilitado e instala Quadlets rootless sob UID dedicado. `AutoUpdate=registry` fica desabilitado: somente o deploy muda digest. Reboot precisa restaurar Caddy e o slot ativo via systemd/linger sem puxar `latest`.

## 18. Disaster recovery

- OCI MySQL: backup automático, retenção fixa de um dia;
- job diário: `mysqldump --single-transaction` da major de produção usa TLS e faz stream por `zstd` e `age` até ciphertext local, enviado depois ao OCI Object Storage;
- lifecycle alvo: sete dias dentro da quota Always Free de 20 GB;
- RPO objetivo best effort: 24h;
- RTO objetivo best effort: 4h, sem SLA no Always Free;
- ensaio: trimestralmente, antes do piloto e após mudança relevante no schema;
- evidência: checksum, versão do schema, tamanho, início/fim e resultado, sem conteúdo no log.

O container read-only recebe um único bind mount gravável, `/backup`, vindo de `/var/lib/borala-backup`, modo 0700, UID `borala`, `noexec,nodev,nosuid` e quota de 18 GB. O pipeline nunca grava SQL plaintext: somente `{timestamp}.sql.zst.age.part`; `pipefail`, disco cheio ou falha removem `.part` por `ExecStopPost`, e boot/antes do job limpa partes órfãs. Após checksum e upload confirmado, o ciphertext local é removido. O recipient público `age` pode estar na VM; a chave privada de restore nunca está nela e fica no cofre do operador + cópia de recuperação offline. `age`, `zstd` e client MySQL ficam pinados no digest da imagem maintenance.

O job mede bucket, multipart uploads e espaço temporário antes de iniciar. Aos 60% da quota, alerta; se sete gerações projetadas não couberem sem custo, preserva primeiro o dump válido mais recente e no mínimo duas gerações, remove a mais antiga e abre revisão operacional — nunca gera cobrança silenciosa. O restore ensaiado cria DB System/schema limpo, valida major/TLS e faz stream inverso `age --decrypt | zstd --decompress | mysql`, sem SQL plaintext em disco; depois verifica migrations e smoke tests, troca secret e reinicia a aplicação. Testes cobrem disco cheio, pipeline interrompido, reboot com `.part` e chave indisponível. `OutOfHostCapacity` pode romper o RTO e é risco explícito aceito do envelope gratuito.

## 19. Referências técnicas verificadas

- [React versions](https://react.dev/versions)
- [React Router modes](https://reactrouter.com/start/modes)
- [React Router deployment on Node](https://reactrouter.com/start/framework/deploying)
- [Node.js releases](https://nodejs.org/en/about/previous-releases)
- [TypeScript 6.0](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-6-0.html)
- [MySQL 8.4 release notes](https://dev.mysql.com/doc/relnotes/mysql/8.4/en/)
- [OCI MySQL Always Free](https://docs.oracle.com/en-us/iaas/mysql-database/doc/features-mysql-heatwave-service.html)
- [OCI MySQL maintenance](https://docs.oracle.com/en-us/iaas/mysql-database/doc/overview-maintenance.html)
- [InnoDB locking reads](https://dev.mysql.com/doc/refman/8.4/en/innodb-locking-reads.html)
- [MySQL encrypted connections](https://dev.mysql.com/doc/refman/8.4/en/using-encrypted-connections.html)
- [mysql2 changelog](https://github.com/sidorares/node-mysql2/blob/master/Changelog.md)
- [Vite releases](https://github.com/vitejs/vite/releases)
- [Temporal status](https://github.com/tc39/proposal-temporal)
- [Oracle Linux Podman Quadlets](https://docs.oracle.com/en/operating-systems/oracle-linux/podman/quadlets.html)
- [OWASP Password Storage](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)
- [OWASP Session Management](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)
