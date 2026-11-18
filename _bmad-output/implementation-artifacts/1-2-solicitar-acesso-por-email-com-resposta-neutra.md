---
baseline_commit: 1316763edcbf3fdf08f7689151e6a3fbd73fc63b
---

# História 1.2: Solicitar acesso por e-mail com resposta neutra

Status: ready-for-dev

## História

Como pessoa que quer participar de um Rolê,
Quero solicitar um acesso privado pelo meu e-mail,
Para receber uma forma segura de continuar sem expor se já possuo identidade no Bora Lá.

## Critérios de aceitação

1. **Dado** uma pessoa sem sessão válida na porta de identificação

   **Quando** ela informar um e-mail válido e solicitar acesso

   **Então** o sistema deve responder com a mesma confirmação neutra, independentemente de a identidade já existir

   **E** deve preservar a intenção que levou a pessoa até a identificação

   **E** o e-mail nunca deve aparecer para outros participantes.

2. **Dado** o e-mail informado

   **Quando** o caso de uso de emissão for executado

   **Então** o e-mail normalizado deve existir apenas em memória durante lookup e entrega

   **E** a persistência deve usar `IdentityEmailAlias` com HMAC versionado

   **E** nenhum e-mail em claro deve ser gravado no banco, em logs, auditoria, telemetria ou URL.

3. **Dado** uma emissão aceita

   **Quando** o desafio for criado

   **Então** deve possuir link aleatório de 32 bytes e código decimal de seis dígitos, persistidos somente como digests HMAC distintos e vinculados ao `challengeId`

   **E** deve expirar em dez minutos

   **E** deve aceitar no máximo cinco tentativas na etapa de verificação.

4. **Dado** o formulário público de solicitação

   **Quando** ele for enviado

   **Então** a action deve validar o campo com Zod, o nonce CSRF pré-autenticação, `Origin` e Fetch Metadata

   **E** mensagens de validação devem preservar o e-mail digitado somente na resposta segura da mesma interação

   **E** o resumo de validação deve receber foco e ligar-se ao campo inválido.

5. **Dado** tentativas repetidas de emissão

   **Quando** os limites forem avaliados

   **Então** devem ser aplicados buckets persistidos por lookup de e-mail e digest diário de IP

   **E** os padrões iniciais devem limitar três desafios por e-mail a cada 15 minutos, dez por dia, vinte por IP a cada 15 minutos e cem por dia

   **E** no máximo três desafios simultaneamente válidos devem existir por e-mail

   **E** um novo envio só deve ser aceito após 60 segundos.

6. **Dado** um desafio persistido como `PENDING`

   **Quando** a transação for confirmada

   **Então** o adapter de e-mail deve receber a solicitação com timeout de cinco segundos

   **E** entrega confirmada deve registrar `SENT`

   **E** rejeição explícita deve registrar `DELIVERY_FAILED` e expirar o desafio

   **E** timeout ambíguo deve registrar `DELIVERY_UNKNOWN` e manter o desafio válido

   **E** não deve existir retry automático capaz de duplicar a mensagem.

7. **Dado** um desafio emitido

   **Quando** a mensagem for construída

   **Então** deve conter o botão `Continuar no Bora Lá`, o código alternativo, a validade de dez minutos e a orientação para ignorar solicitações não iniciadas

   **E** todo o conteúdo deve estar em Português do Brasil

   **E** nenhum dado de outro Rolê ou identidade deve integrar a mensagem.

8. **Dado** sucesso, limitação, falha explícita ou entrega incerta

   **Quando** a resposta for renderizada

   **Então** texto, status HTTP observável e duração não devem permitir inferir se a identidade existia

   **E** a confirmação deve usar região `status` com anúncio completo e sem roubar foco.

9. **Dado** a implementação da solicitação de acesso

   **Quando** os testes forem executados

   **Então** devem cobrir e-mail válido e inválido, identidade existente e inexistente, limites por e-mail/IP, cooldown, três desafios simultâneos e estados de entrega

   **E** contract tests devem comprovar ausência de e-mail em claro no schema persistido, logs e resposta pública

   **E** testes de interface devem cobrir teclado, foco, mensagens e reflow.

10. **Dado** o código produzido nesta história

    **Quando** a rastreabilidade for revisada

    **Então** deve cobrir parcialmente FR1 e FR3 e integralmente NFR1, AR6, AR7, AR12, AR25, UX-DR9–UX-DR11, UX-DR19, UX-DR22 e UX-DR25

    **E** não deve criar Session, Participant, Outing ou tabelas de domínio ainda sem consumidor.

## Tarefas e subtarefas

- [ ] 1. Implementar o módulo `identity` com `IdentityEmailAlias` e HMAC versionado (CA: 2, 10)
  - [ ] Criar `app/modules/identity/domain/` com `IdentityEmailAlias` e digest HMAC.
  - [ ] Implementar normalização de e-mail (trim, lowercase) e lookup por HMAC.
  - [ ] Suportar rotação lazy de chaves HMAC sem dividir identidades.
  - [ ] Não persistir e-mail em claro em banco, logs, auditoria, telemetria ou URL.

- [ ] 2. Implementar o desafio de acesso (CA: 3, 6)
  - [ ] Criar `LoginChallenge` com link aleatório de 32 bytes e código decimal de seis dígitos.
  - [ ] Persistir link e código somente como digests HMAC distintos vinculados ao `challengeId`.
  - [ ] Expirar em dez minutos e aceitar máximo cinco tentativas.
  - [ ] Registrar estados `PENDING`, `SENT`, `DELIVERY_FAILED`, `DELIVERY_UNKNOWN`.

- [ ] 3. Implementar rate limits persistidos (CA: 5)
  - [ ] Buckets por lookup de e-mail e digest diário de IP.
  - [ ] Limites: 3 desafios/e-mail/15min, 10/dia, 20/IP/15min, 100/dia.
  - [ ] Máximo três desafios simultâneos válidos por e-mail.
  - [ ] Cooldown de 60 segundos entre envios.

- [ ] 4. Implementar o adapter de e-mail (CA: 6, 7)
  - [ ] Adapter com timeout de cinco segundos.
  - [ ] Manejar entrega confirmada, rejeção explícita e timeout ambíguo.
  - [ ] Construir mensagem com botão `Continuar no Bora Lá`, código alternativo, validade de dez minutos e orientação.
  - [ ] Todo o conteúdo em Português do Brasil; sem retry automático duplicador.

- [ ] 5. Implementar o formulário público de solicitação (CA: 1, 4, 8)
  - [ ] Formulário SSR com campo e-mail.
  - [ ] Validar com Zod, nonce CSRF pré-autenticação, `Origin` e Fetch Metadata.
  - [ ] Resposta neutra independente de identidade existente.
  - [ ] Preservar intenção original; resumo de validação focável.
  - [ ] Região `status` com anúncio completo sem roubar foco.

- [ ] 6. Implementar testes por TDD (CA: 9, 10)
  - [ ] Testes de e-mail válido/inválido, identidade existente/inexistente.
  - [ ] Testes de limites por e-mail/IP, cooldown, três desafios simultâneos.
  - [ ] Testes de estados de entrega.
  - [ ] Contract tests de ausência de e-mail em claro.
  - [ ] Testes de interface: teclado, foco, mensagens, reflow.

## Contexto para desenvolvimento

### Estado atual do repositório

- A História 1.1 está `done`: base executável SSR com home, segurança de documento, CI, testes Vitest/Cypress/axe.
- Stack fixada: Node.js 24.18.0, React 19.2.7, React Router 8.3.0 Framework Mode, Vite 8.0.16, TypeScript 6.0.2, Vitest 4.1.7, Cypress 15.19.0.
- Não existe ainda `app/modules/identity`, `app/modules/outings`, persistence, migrations, e-mail ou `ops/`.
- Esta história cria o módulo `identity` com `IdentityEmailAlias`, `LoginChallenge` e rate limits.

### Stack obrigatória

| Tecnologia | Versão aprovada | Uso nesta história |
|---|---:|---|
| Node.js | 24.18.0 LTS | runtime de desenvolvimento, build e SSR |
| React / React DOM | 19.2.7 | interface e SSR |
| React Router | 8.3.0 Framework Mode | rotas, loaders, actions e forms |
| Vite | 8.0.16 | build |
| TypeScript | 6.0.2 | tipagem e verificação |
| Vitest | 4.1.7 | testes automatizados |
| Cypress | 15.19.0 | E2E e acessibilidade |
| Zod | 4.4.3 | validação de entrada na borda |
| Kysely | 0.29.2 | query builder tipado no adapter |
| mysql2 | 3.23.2 | driver/pool MySQL |
| temporal-polyfill | 1.0.2 | implementação Temporal encapsulada |

- Não instalar Resend ainda: o adapter de e-mail deve ser isolado e testável; a integração real pode usar um stub/port nesta história.
- Não criar Session, Participant, Outing ou tabelas de domínio ainda sem consumidor.

### Arquitetura e segurança

- Monólito modular SSR; `identity` é dono de `Identity`, `LoginChallenge` e `Session`.
- `domain` não importa HTTP, React, Kysely, MySQL ou adapters.
- `IdentityEmailAlias` contém HMAC keyed/versionado do e-mail; alias pode preceder a Identity.
- Desafio de 10 minutos, máximo cinco tentativas, resposta neutra, rate limit persistido.
- Nenhum e-mail em claro persistido; logs usam allowlist técnica.
- CSRF pré-autenticação, `Origin` e Fetch Metadata na action pública.

### Estratégia de testes e definição de pronto

- TDD vermelho → verde → refatoração.
- Gates: `npm ci`, formato, ESLint, TypeScript, imports, Vitest, Cypress/axe, build, `npm audit --audit-level=high`.
- Contract tests de ausência de e-mail em claro.
- Testes de interface: teclado, foco, mensagens, reflow.

### Escopo explicitamente excluído

- Session, Participant, Outing, Convite, criação, compartilhamento.
- Banco de domínio, migrations de `outings`.
- Integração real de e-mail (Resend) — usar port/stub.
- Docker/Podman, Caddy, OCI, deploy, backup.

### Referências

- [Fonte: `_bmad-output/planning-artifacts/epics.md`, História 1.2]
- [Fonte: `_bmad-output/planning-artifacts/architecture/architecture-borala-2026-08-07/ARCHITECTURE-SPINE.md`, AD-8, AD-18, Stack, Structural Seed]
- [Fonte: `_bmad-output/planning-artifacts/architecture/architecture-borala-2026-08-07/SOLUTION-DESIGN.md`, §§ 2, 4, 13.2, 14, 16, 17]
- [Fonte: `_bmad-output/planning-artifacts/ux-designs/ux-borala-2026-08-06/EXPERIENCE.md`, Accessibility Floor, Privacy, identity-gate]
- [Fonte: `_bmad-output/planning-artifacts/ux-designs/ux-borala-2026-08-06/DESIGN.md`, Components, form-field, validation-summary]
- [Fonte: `CONSTITUTION.md`, princípios II, III, IV e V e definição de pronto]
- [Fonte: `docs/project-context.md`, idioma da documentação]

## Registro do agente de desenvolvimento

### Modelo utilizado

Claude (Cline)

### Referências de depuração

- História 1.1 concluída; base SSR, segurança, CI e testes estabelecidos.
- Preferência de idioma: toda comunicação e documentação em Português do Brasil; identificadores de código em inglês.

### Notas de conclusão

- Contexto da história 1.2 criado a partir dos epics e da arquitetura.

### Lista de arquivos

- `_bmad-output/implementation-artifacts/1-2-solicitar-acesso-por-email-com-resposta-neutra.md` (novo)
