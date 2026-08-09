---
name: Bora Lá
type: architecture-spine
purpose: build-substrate
altitude: feature
paradigm: monólito modular com arquitetura hexagonal
scope: MVP do Bora Lá
status: final
created: '2026-08-07'
updated: '2026-08-07'
binds: [all]
sources:
  - ../../../../CONSTITUTION.md
  - ../../../specs/spec-borala-mvp/SPEC.md
  - ../../../specs/spec-borala-mvp/mvp-rules.md
  - ../../../specs/spec-borala-mvp/state-machines.md
  - ../../prds/prd-borala-2026-08-06/prd.md
  - ../../ux-designs/ux-borala-2026-08-06/EXPERIENCE.md
  - ../../ux-designs/ux-borala-2026-08-06/DESIGN.md
companions:
  - SOLUTION-DESIGN.md
  - UML.md
---

# Architecture Spine — Bora Lá

Este spine é o contrato de convergência para agentes implementadores e para revisão técnica. A Constituição, a SPEC e seus companions e o PRD final são normativos; a UX final governa interação e apresentação onde não conflitar com esse contrato. Fontes históricas não criam requisitos.

## Adjudicações vigentes

- A decisão direta de 2026-08-07 refina o contrato antigo de Correção: após a definição, editar nome, endereço ou URLs preserva o mesmo Local social; trocar Local ou Data exige `Criar Outro Rolê`. Antes da definição, detalhes da Opção podem ser alterados.
- A decisão direta de 2026-08-07 define autenticação passwordless por e-mail com botão de continuidade e código alternativo; senha e fluxo exclusivamente por código não pertencem ao MVP.
- A decisão direta de 2026-08-07 define `Quantos tão a fim?` pelo Interesse Geral, com a mesma semântica havendo ou não Opções; Respostas de Local não alimentam esse agregado.

## Design Paradigm

Um monólito modular, implantado como uma única imagem OCI, usa arquitetura hexagonal para manter regras sociais e temporais independentes de React Router, MySQL, e-mail e infraestrutura. Os módulos de negócio são `identity` e `outings`; `shared` contém somente primitivas transversais sem regra de produto.

## Invariants & Rules

### AD-1 — Organizar sem governar

- **Binds:** todos os módulos, projeções, textos, métricas e testes.
- **Prevents:** maioria, quórum, ranking, vencedor, autoridade da pessoa criadora ou inferência de legitimidade social.
- **Rule:** o sistema registra fatos e declarações; qualquer participante identificado possui os mesmos poderes e nenhuma regra pode converter contagens ou respostas em decisão coletiva.

### AD-2 — Dependências apontam para o núcleo

- **Binds:** estrutura de código e composição.
- **Prevents:** domínio acoplado a HTTP, React, Kysely, MySQL, Resend ou OCI.
- **Rule:** `domain` não importa camadas externas; `application` depende de domain e ports; adapters implementam ports; routes obtêm casos de uso exclusivamente pelo composition root.

### AD-3 — Ownership modular e vocabulário

- **Binds:** modelo, schema, código e eventos.
- **Prevents:** ownership duplicado, módulos genéricos e termos portugueses em identificadores.
- **Rule:** `identity` é dono de `Identity`, `LoginChallenge` e `Session`; `outings` é dono dos demais conceitos e conhece apenas `identityId`. Código usa `Outing`, `Participant`, `DisplayName`, `VenueOption`, `SelectedVenue`, `VenueResponse`, `Declaration`, `Correction`, `ReplacementOuting`, `ApproximateStart` e `FinalLimit`.

### AD-4 — Uma aplicação SSR, sem API ou serviço paralelo

- **Binds:** web e runtime.
- **Prevents:** SPA/API separadas, CORS, autenticação cross-origin e microsserviços prematuros.
- **Rule:** React Router Framework Mode entrega SSR, loaders e actions no processo Node.js; loaders/actions são inbound adapters e não contêm regra de domínio nem SQL.

### AD-5 — MySQL/InnoDB é a unidade transacional

- **Binds:** todo estado persistido.
- **Prevents:** semântica divergente entre bancos, storage alternativo e ORM vazando ao domínio.
- **Rule:** OCI MySQL HeatWave Always Free, somente MySQL DB System/InnoDB e com HeatWave analítico desabilitado, é a fonte de verdade; a OCI controla a versão efetiva, com MySQL 8.4 como baseline mínimo de compatibilidade. Kysely `MysqlDialect` + `mysql2` fica no adapter e migrations SQL versionadas são a fonte do schema; mudança de major exige suite de upgrade/restore antes da manutenção.

### AD-6 — Concorrência explícita e curta

- **Binds:** respostas, declarações, correções, inativação, substituição, cancelamento e tempo.
- **Prevents:** sobrescrita silenciosa, lock amplo e corrida técnica interpretada como decisão social.
- **Rule:** transações `READ COMMITTED` curtas bloqueiam a linha de `Outing` com `SELECT ... FOR UPDATE` para transições globais; CAS/version protege `Outing`, `VenueOption`, `Participant`, `GeneralInterest` e `VenueResponse`, usando zero para ausência; FKs compostas impedem referências entre Rolês; deadlock só pode repetir comando idempotente.

### AD-7 — Idempotência, unicidade e auditoria de domínio são atômicas

- **Binds:** comandos de `outings`, inclusive criação e ingresso; não abrange challenge, sessão ou logout.
- **Prevents:** efeitos duplicados, estado sem autoria e regressão do Limite Final.
- **Rule:** `commandId` é ligado a Identity, escopo, tipo e SHA-256 do payload canônico; replay só retorna resultado mínimo se todos coincidirem, e divergência retorna `IDEMPOTENCY_KEY_REUSED`. Uma resposta vigente é única por participante e opção; declarações idênticas retornam o resultado vigente; tentativa conflitante preserva autor, alvo, versão observada, declaração vigente e instante sem substituir estado; extensões usam máximo monotônico; receipt, estado e evidência/audit aplicáveis são gravados atomicamente.

### AD-8 — Identidade privada e passwordless

- **Binds:** autenticação e recuperação.
- **Prevents:** exposição de contato, enumeração de contas, senha no MVP e Nick como credencial.
- **Rule:** identidade é localizada por `IdentityEmailAlias` contendo HMAC keyed/versionado do e-mail; alias pode preceder a Identity, é compartilhado por challenges e ganha vínculo atômico no primeiro consumo. Leitura calcula versões aceitas e cria alias corrente para a mesma Identity; chave só é aposentada sem dependências. Desafio de 10 minutos oferece botão e código alternativo, máximo de cinco tentativas, resposta neutra, rate limit persistido e consumo atômico; nenhum e-mail é persistido em claro.

### AD-9 — Continuidade sem arquivo social

- **Binds:** sessão e participação contextual.
- **Prevents:** repetição desnecessária de Nick, fusão implícita de identidades e lista histórica de Rolês.
- **Rule:** sessão opaca de 256 bits armazena somente hash server-side e usa cookie `HttpOnly`, `Secure`, `SameSite=Lax` por até 30 dias; o mesmo e-mail restaura `Identity`, `Participant` e `DisplayName`, mas a pessoa ainda precisa do Convite.

### AD-10 — Convite é capacidade de descoberta, não autenticação

- **Binds:** rotas `/r/{inviteToken}` e autorização.
- **Prevents:** enumeração de Rolês, convite individual e personificação pelo link.
- **Rule:** token Base64URL aleatório de 192 bits é persistido apenas como SHA-256; sem sessão retorna `PublicInvitationView`; sessão + `Participant` retorna `ParticipantOutingView`; entidades nunca são serializadas diretamente.

### AD-11 — Privacidade depende de audiência e tempo

- **Binds:** renderização, cache, compartilhamento e links externos.
- **Prevents:** vazamento por cache, referer, storage do navegador, telemetria ou estado expirado.
- **Rule:** superfícies do Convite usam DTO discriminado com allowlist por audiência/estado, `Cache-Control: no-store` e `Referrer-Policy: no-referrer`; dados protegidos não entram em client storage ou service worker; autorização e precedência são revalidadas em cold-load, `pageshow`, foreground e antes de mutações; após `FinalLimit`, somente `Este Rolê terminou.` é exposto.

### AD-12 — Tempo civil e instante são distintos

- **Binds:** Data, Horário Aproximado e Limite Final.
- **Prevents:** mudança da Data social, dependência do fuso do servidor e precisão inventada.
- **Rule:** `socialDate` usa `DATE`, `timeZone` usa IANA ID e instantes usam `DATETIME(6)` convencionado em UTC; regras dependem de `Clock` e Temporal, nunca de `Date` ou timezone implícito.

### AD-13 — Depois do expediente é derivado até congelar

- **Binds:** FR-17 a FR-21.
- **Prevents:** cron mutando referência invisível e exibição de horário não informado.
- **Rule:** a referência móvel é calculada a partir de `Clock`; congela atomicamente ao definir o Local; respeita passos e bordas normativas, inclusive `currentTime <= approximateStart - 1h`. Todo Rolê, com `AfterWork` ou hora explícita — inclusive às 18h ou antes — tem `FinalLimit` padrão às 03h do dia seguinte à Data social e extensão monotônica máxima até 07h.

### AD-14 — Local social e detalhes factuais não se confundem

- **Binds:** Opções, Local definido, Correções e Outro Rolê.
- **Prevents:** troca silenciosa do Local no mesmo Rolê e julgamento de que o grupo estava errado.
- **Rule:** durante Organização, informações de Opção podem ser corrigidas; após definição, `Editar detalhes` altera somente nome, endereço e URLs do Local vigente; mudar efetivamente Local ou Data cria `ReplacementOuting` com novo ID/Convite e sem herdar respostas.

### AD-15 — Cancelamento e substituição têm precedência terminal

- **Binds:** leitura e mutações do Convite.
- **Prevents:** rota ou plano antigo após estado terminal e restauração de cancelamento.
- **Rule:** `Clock >= FinalLimit` é o primeiro gate e expõe somente `Ended`; antes dele, cada leitura resolve `Cancelled → Replaced → InProgress → Defined → OccurrenceDeclared → Organizing`; cancelamento é terminal para mutações e substituição bloqueia mutações no Rolê anterior.

### AD-16 — Retenção é eliminação, não memória

- **Binds:** dados de negócio, identidade, logs e backups.
- **Prevents:** retenção indefinida e métricas reidentificáveis.
- **Rule:** dados completos do Rolê e auditoria são hard-deleted 30 dias após `FinalLimit`; challenges, sessions expirados/revogados e buckets de rate limit sem utilidade saem em até 24h; Identity sem vínculo retido ou sessão válida sai em 30 dias; logs duram 14 dias e backups, no máximo 14 dias; métricas duráveis são agregadas e irreversíveis.

### AD-17 — Envelope gratuito OCI é explícito

- **Binds:** produção e DR.
- **Prevents:** dependência de serviço pago, banco no mesmo destino de falha da aplicação e uso acidental de HeatWave analítico.
- **Rule:** a imagem ARM64 executa `web` e `maintenance` em rootless Podman + Quadlet, sob usuário dedicado na VM OCI Always Free de 2 OCPUs/12 GiB; Caddy roda no host e termina TLS; MySQL.Free fica em endpoint privado da mesma VCN; não existem Redis, broker, object store de aplicação ou ambiente permanente de staging.

### AD-18 — Segurança por fronteira

- **Binds:** HTTP, sessão, containers, rede e segredos.
- **Prevents:** CSRF, exposição de segredo, execução privilegiada e acesso público ao banco.
- **Rule:** autenticação pública usa challenge, pre-auth CSRF, Origin/Fetch Metadata, rate limit e consumo atômico; `CreateOuting` exige Identity verificada, CSRF e `commandId`; `join` exige sessão, CSRF e `commandId`; comandos sobre Outing existente exigem sessão, participação, CSRF, `commandId` e versões esperadas; logout exige sessão e CSRF. MySQL exige TLS fail-closed com CA e `REQUIRE SSL`, além da NSG; containers são non-root/read-only; segredos entram apenas em runtime; logs nunca recebem e-mail, Nick, OTP, token, endereço, URL, histórico ou path sensível.

### AD-19 — Senha futura tem contrato mínimo

- **Binds:** qualquer futura credencial por senha.
- **Prevents:** hash rápido, salt compartilhado e pepper no banco.
- **Rule:** se senha entrar, usar Argon2id com salt único e pepper fora do banco; piso `m=19456 KiB`, `t=2`, `p=1`, ajustável somente para cima por benchmark; OTP continua usando HMAC, TTL e limites online.

### AD-20 — Evidência executável precede deploy

- **Binds:** desenvolvimento por agentes, revisão e CI.
- **Prevents:** implementação sem teste, mocks que ocultam semântica do banco e divergência arquitetural.
- **Rule:** TDD vermelho-verde-refatoração é obrigatório; Vitest cobre domínio/aplicação, MySQL real cobre adapters e concorrência, Cypress cobre jornadas e axe-core cobre acessibilidade; CI bloqueia merge em falha de formato, lint, tipos, imports, testes, build ou scans.

### AD-21 — Deploy preserva a última versão saudável

- **Binds:** migrations e release.
- **Prevents:** `latest` mutável, schema incompatível e troca antes do smoke test.
- **Rule:** GitHub Actions publica imagem ARM64 por commit SHA e digest; migrations seguem expand/contract sob lock; Quadlets blue/green expõem somente `127.0.0.1:3001/3002`, e deploy sobe, testa e só então recarrega o upstream do Caddy host; rollback troca aplicação, nunca reverte dados automaticamente.

### AD-22 — DR e observabilidade são proporcionais

- **Binds:** operação.
- **Prevents:** backup não restaurável, logs pessoais e monitoramento que governa o grupo.
- **Rule:** backup OCI de um dia + dump lógico diário com compressão e cifra autenticada miram retenção de sete dias, RPO 24h e RTO 4h best effort, sem garantia no Always Free; quota e restore são monitorados e ensaiados trimestralmente, antes do piloto e após mudança relevante de schema. Logs JSON e métricas técnicas usam baixa cardinalidade e audit log de domínio permanece separado.

### AD-23 — Interesse Geral e Respostas de Local não se misturam

- **Binds:** CAP-3, CAP-4, Convite público e projeções identificadas.
- **Prevents:** agregado zerado por falta de Opção, dupla contagem, troca silenciosa de significado e uso de adesão para legitimar Local.
- **Rule:** `interestedCount` conta Participants distintos cujo `GeneralInterest == INTERESTED`, com ou sem Opções ativas; `UNSURE` e ausência não contam. `VenueResponse` nunca alimenta o agregado principal e permanece contextual a uma Opção. Interesse Geral pode ser definido, alterado ou limpo em `ORGANIZING` e `OCCURRENCE_DECLARED`; após `DEFINED`, fica somente leitura.

## Consistency Conventions

| Dimensão | Convenção obrigatória |
|---|---|
| Idioma | Documentação e interface em Português do Brasil; arquivos e identificadores de código em inglês. |
| Banco | `snake_case`; plural para tabelas; IDs e instantes gerados pela aplicação; `DATETIME(6)` sempre UTC. |
| Domínio | Tipos explícitos e comportamento próximo aos dados; composição sobre herança; Lei de Demeter. |
| Entrada | Zod valida na borda; validação do domínio decide invariantes; servidor nunca confia no cliente. |
| Saída | DTO por audiência; erros internos usam códigos ingleses e a web localiza mensagens. |
| Comando `outings` | `commandId`, transação curta, autoria e audit quando aplicável; `expectedVersions` tipadas somente para entidades existentes. Identity usa contratos próprios de AD-8/AD-9. |
| HTTP | GET sem efeito; POST para comandos; redirect-after-post para formulários; nenhum token sensível em query string. |
| UI | HTML nativo primeiro, WCAG 2.2 AA, 320 CSS px/400% zoom, estado nunca depende só de cor. |
| Ordem | Opções por `createdAt`, desempate `optionId`; nunca por resposta, autoria ou atividade. |
| Logs | `requestId`, `commandId`, rota, duração, status, error code e app version; sem conteúdo pessoal. |

## Stack

| Name | Version | Papel |
|---|---|---|
| Node.js | 24.18.0 LTS | Runtime de build e produção. |
| React | 19.2.7 | Interface. |
| React DOM | 19.2.7 | Renderização SSR/hidratação. |
| React Router | 8.3.0 Framework Mode | SSR, rotas, loaders, actions e forms. |
| `@react-router/dev` / `@react-router/node` | 8.3.0 | Plugin Vite e servidor Node customizado. |
| Vite | 8.0.16 | Build do Framework Mode, sem plugin RSC experimental. |
| TypeScript | 6.0.2 | Tipagem e build. |
| MySQL | versão controlada pela OCI; 9.7.1 corrente na verificação, baseline 8.4 | Persistência InnoDB; major efetiva confirmada no provisioning e espelhada em CI. |
| Kysely | 0.29.2 | Query builder tipado no adapter. |
| mysql2 | 3.23.2 ou patch superior aprovado | Driver/pool, sem compressão de protocolo. |
| Zod | 4.4.3 | Validação de entrada na borda. |
| temporal-polyfill | 1.0.2 | Implementação única e encapsulada; beta aceito até Temporal nativo validado. |
| Vitest | 4.1.7 | Testes unitários, application e arquitetura. |
| React Testing Library | 16.3.2 | Testes de UI; peer `@testing-library/dom` pinado no lock. |
| Cypress | 15.19.0 | E2E responsivo e acessibilidade. |
| Caddy | 2.11.4 | TLS e reverse proxy blue-green. |
| Podman + Quadlet | pacote Oracle Linux registrado no provisioning | Runtime rootless e lifecycle systemd. |

O `package-lock.json`, os digests das imagens, a versão Podman registrada/retida no provisioning e a versão reportada pelo OCI MySQL são as autoridades após o primeiro cold-start. Vite e dependências de teste recebem patch exato no lock; nenhum agente resolve ranges de modo independente.

## Structural Seed

```text
app/
├── root.tsx
├── routes.ts
├── routes/
├── ui/
├── modules/
│   ├── identity/{domain,application}/
│   └── outings/{domain,application}/
├── server/
│   ├── composition/
│   ├── persistence/mysql/
│   ├── email/resend/
│   ├── security/
│   └── observability/
└── shared/
migrations/
tests/{integration,architecture,fixtures}/
cypress/
ops/
├── caddy/
├── quadlet/
│   ├── borala-blue.container
│   └── borala-green.container
├── systemd/
└── runbooks/{deploy,rollback,backup,restore}.md
```

## Capability → Architecture Map

| Capacidade | Dono | Mecanismo principal |
|---|---|---|
| CAP-1 Identidade | `identity` + `outings` | Challenge HMAC, sessão opaca, participação/Nick contextual. |
| CAP-2 Criação | `outings` | `CreateOuting`, dois inícios equivalentes e Convite opaco. |
| CAP-3 Convite | `outings` + web | DTO público/protegido, SSR no-store e compartilhamento manual. |
| CAP-4 Interesse/Respostas | `outings` | Interesse Geral independente para `interestedCount`; Resposta única e contextual por Opção. |
| CAP-5 Opções | `outings` | Original imutável, revisões append-only, estado ativo/inativo e alerta determinístico não bloqueante de duplicidade. |
| CAP-6 Declarações | `outings` | Row lock, version check, declaração idempotente e tentativa conflitante auditável sem sobrescrita. |
| CAP-7 Correção/Substituição | `outings` | Detalhes factuais no mesmo Rolê; Local/Data efetivos em outro Rolê. |
| CAP-8 Tempo | `outings` + `Clock` | Data civil/IANA/UTC, Temporal e referência derivada. |
| CAP-9 Cancelamento | `outings` | Comando terminal, auditado e sem restauração. |
| CAP-10 Consulta | web + `outings` | Precedência, plano vigente, rota externa e limite monotônico. |
| CAP-11 Encerramento | `outings` + maintenance | Projeção terminal imediata e purge posterior. |

## Deferred

- Passkeys, senha, login social e fusão de identidades somente após evidência de uso frequente ou conta persistente; até lá AD-8 e AD-19 governam.
- HA, réplica, multi-região e banco pago somente se indisponibilidade observada ou uso real justificar novo orçamento; o MVP assume a indisponibilidade do Always Free como risco aceito.
- Exportador externo de métricas somente quando stdout/OCI Monitoring não bastarem; o schema de métricas de AD-22 permanece estável.
- Se OCI abandonar compatibilidade com o subconjunto SQL testado ou o Always Free, substituir apenas o adapter/persistência por outro MySQL compatível antes de considerar mudança do núcleo; mudança de major controlada pela OCI passa pelo gate de upgrade.
