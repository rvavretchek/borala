# Bora Lá — Relatório de Status

**Data:** 2026-09-03
**Objetivo:** Resumir o que já foi realizado e os próximos passos do projeto.

---

## 1. Resumo executivo

O Bora Lá está na **fase de implementação do Epic 1**, com o planejamento do MVP concluído e validado. A base executável (História 1.1) está implementada e **aguardando revisão de código** antes da integração na branch `dev`. Toda a fundação documental — Product Brief, PRD, UX, Arquitetura, SPEC e Epics — está concluída e aprovada.

**Status geral:** planejamento 100% concluído · implementação ~3% (1 de 29 histórias em revisão).

---

## 2. O que já foi realizado

### 2.1 Fundação documental (concluída e normativa)

| Artefato | Local | Status |
|---|---|---|
| Constituição do Projeto | `CONSTITUTION.md` | v1.0.0 ratificada em 2026-08-06 |
| Product Brief | `_bmad-output/planning-artifacts/briefs/` | Concluído |
| PRD (22 FRs, 10 NFRs) | `_bmad-output/planning-artifacts/prds/` | Concluído |
| Design System UX | `_bmad-output/planning-artifacts/ux-designs/` | Validado — gate aprovado sem achados críticos/altos/médios |
| Architecture Spine + Solution Design + UML | `_bmad-output/planning-artifacts/architecture/` | Final |
| SPEC do MVP + regras + máquinas de estado | `_bmad-output/specs/spec-borala-mvp/` | Contrato canônico |
| Contexto persistente do projeto | `docs/project-context.md` | Concluído |

### 2.2 Planejamento e governança (concluída)

- **4 épicos e 29 histórias** definidos e rastreados em `_bmad-output/planning-artifacts/epics.md`.
- **Cobertura funcional de 100%** — todos os 22 FRs do PRD mapeados para épicos e histórias.
- **Relatório de prontidão inicial (10/08/2026):** reprovado — identificou 12 problemas (contradições normativas e dependências futuras em histórias).
- **Correção de curso aprovada (11/08/2026):** canônica do agregado público, alinhamento de autenticação passwordless, remoção de antecipações, divisão da História 4.7 em três.
- **Relatório de prontidão final (11/08/2026):** **PRONTO PARA IMPLEMENTAÇÃO** — zero questões abertas.

### 2.3 Implementação — História 1.1 (em revisão)

A História 1.1 "Abrir a base executável do Bora Lá" foi implementada na branch `feature/epic-1-story-1-base-executavel`:

- **Stack fixada e validada:** Node.js 24.18.0, React 19.2.7, React Router 8.3.0 (Framework Mode SSR), Vite 8.0.16, TypeScript 6.0.2.
- **Aplicação SSR:** home em Português do Brasil com marca Bora Lá, HTML integralmente renderizado no servidor, sem dependência de hidratação.
- **Segurança:** CSP por nonce por resposta, HSTS condicionado a HTTPS validado, `nosniff`, `no-referrer`, Permissions Policy e proteção contra framing.
- **Acessibilidade e responsivo:** tokens visuais do `DESIGN.md`, layout mobile-first, WCAG 2.2 AA, operável por teclado e reflow a 320 CSS px.
- **Testes (TDD):** 5 testes Vitest (SSR, cabeçalhos de segurança, fronteiras de imports) + 3 cenários Cypress/axe.
- **CI configurada:** `.github/workflows/ci.yml` e `codeql.yml` com gates de formato, lint, tipos, imports, testes, build, Cypress/axe e auditoria de dependências.
- **Status no sprint:** `review` (pronta para revisão de código).
- **Arquivo da história:** `_bmad-output/implementation-artifacts/1-1-abrir-a-base-executavel-do-bora-la.md`.

### 2.4 Estado do repositório

- Branch de trabalho: `feature/epic-1-story-1-base-executavel`.
- Branch `dev` existe e receberá a integração após revisão.
- Working tree com apenas normalização de line endings (LF → CRLF) em `ARCHITECTURE-SPINE.md` e `SPEC.md` — sem mudança de conteúdo.
- Pasta `.vscode/` ainda não versionada.

---

## 3. Próximos passos

### 3.1 Imediatos (concluir a História 1.1)

1. **Revisar o código da História 1.1** na branch `feature/epic-1-story-1-base-executavel` (code review).
2. **Garantir que todos os gates passem** localmente e na CI: `format:check`, `lint`, `typecheck`, `test`, `test:architecture`, `build`, `test:e2e`.
3. **Integrar na branch `dev`** após os gates e o repositório fornecer todos os checks para branch protection.

### 3.2 Epic 1 — Histórias seguintes (em ordem)

| # | História | Status |
|---|---|---|
| 1.2 | Solicitar acesso por e-mail com resposta neutra | backlog |
| 1.3 | Confirmar o acesso e estabelecer uma sessão privada | backlog |
| 1.4 | Criar um Rolê começando pelas pessoas | backlog |
| 1.5 | Criar um Rolê começando por um local | backlog |
| 1.6 | Abrir a prévia pública minimizada do Convite | backlog |
| 1.7 | Entrar em um Rolê com Nick contextual | backlog |
| 1.8 | Recuperar a participação e corrigir o Nick | backlog |
| 1.9 | Compartilhar manualmente o Convite vivo | backlog |

> Cada história segue o ciclo: Create Story → Validate Story → Dev Story → Code Review, com TDD e testes E2E.

### 3.3 Epic 2 — Organizar interesse, locais e respostas

- 2.1 Registrar e alterar o Interesse Geral
- 2.2 Propor uma Opção de local
- 2.3 Corrigir ou complementar uma Opção
- 2.4 Inativar e reativar uma Opção
- 2.5 Responder sobre cada Opção

### 3.4 Epic 3 — Registrar o combinado e resolver mudanças

- 3.1 Declarar que vai ter rolê
- 3.2 Definir uma Opção como Local do Rolê
- 3.3 Responder durante a janela permitida
- 3.4 Tornar visível um conflito concorrente
- 3.5 Corrigir detalhes factuais do Local
- 3.6 Criar outro rolê para mudar Local ou Data

### 3.5 Epic 4 — Acompanhar o Rolê até seu encerramento

- 4.1 Alterar o Horário Aproximado dentro da janela
- 4.2 Consultar o plano vigente e abrir uma rota externa
- 4.3 Estender o Limite Final
- 4.4 Encerrar e minimizar o Convite
- 4.5 Cancelar o Rolê
- 4.6 Eliminar dados conforme a política de retenção
- 4.7 Executar o Bora Lá em runtime seguro
- 4.8 Implantar uma versão com troca segura
- 4.9 Proteger e restaurar backups

### 3.6 Antes do piloto

- **OQ4:** definir o método de pesquisa para avaliar influência percebida no comparecimento, sem coletar presença no produto.
- **Checkpoints de feedback** ao fim de cada épico.
- **Ensaio de restauração de backup** e deploy blue-green comprovados.

---

## 4. Riscos e atenção

| Área | Observação |
|---|---|
| Histórias 1.2 e 1.3 | Alto risco de tamanho — devem permanecer fatias verticais coesas; se não couberem em uma sessão, usar `bmad-correct-course`. |
| Autenticação | Exige HMAC versionado de e-mail, challenge de 10 min, 5 tentativas, rate limits e entrega com timeout — sem expor e-mail em claro. |
| Concorrência | Respostas, declarações e cancelamento exigem CAS, locks curtos e idempotência por `commandId`. |
| Desempenho | Gate de LCP p75 ≤ 2,5s na prévia pública; validação com Lighthouse em build de produção. |
| Deploy | Imagem OCI ARM64, Podman/Quadlet rootless, migrations expand/contract e backup cifrado — todos nas Histórias 4.7–4.9. |

---

## 5. Comandos úteis

```powershell
npm ci              # instala dependências fixadas
npm run dev         # servidor de desenvolvimento SSR
npm run format:check
npm run lint
npm run typecheck
npm test            # testes Vitest
npm run test:architecture
npm run build
npm run test:e2e    # Cypress + axe