# Acceptance Auditor — Revisão da História 1.1 (Bora Lá)

## Tarefa

Revise o diff desta história contra o arquivo de contexto da história e os critérios de aceitação (ACs). Verifique: violações de critérios de aceitação, desvios da intenção do spec, implementação ausente de comportamento especificado e contradições entre as restrições do documento e o código real.

## Diff

O diff está em: `_bmad-output/implementation-artifacts/code-review-1-1/diff-1-1.txt`

(Este diff contém 31 arquivos da História 1.1 — branch `feature/epic-1-story-1-base-executavel`, commits `8886494` + `1316763` sobre `4fc7260` — excluindo `package-lock.json`, que é gerado e possui 7.349 linhas. Não foi incluído por ser auto-gerado com `npm ci`.)

## Spec / Contexto

Arquivo da história: `_bmad-output/implementation-artifacts/1-1-abrir-a-base-executavel-do-bora-la.md`

Fontes normativas de referência:
- `_bmad-output/planning-artifacts/ux-designs/ux-borala-2026-08-06/DESIGN.md` — tokens visuais.
- `_bmad-output/planning-artifacts/ux-designs/ux-borala-2026-08-06/EXPERIENCE.md` — acessibilidade e responsivo.
- `_bmad-output/planning-artifacts/architecture/architecture-borala-2026-08-07/ARCHITECTURE-SPINE.md` — invariantes, stack, Structural Seed.
- `CONSTITUTION.md` — princípios II, III e V e definição de pronto.

## Critérios de aceitação da História 1.1 (resumo)

1. Clone limpo: `npm ci`, dev/test/build funcionam; versões fixadas no `package-lock.json`; stack aprovada.
2. Rota inicial: SSR em Node.js; página pt-BR com marca e explicação factual; conteúdo principal no HTML sem hidratação.
3. Estrutura: rotas obtêm comportamento pelo composition root; domínio sem dependência de React/HTTP/Kysely/MySQL/adapters; somente diretórios/abstrações consumidos existem.
4. Identidade visual: tokens de cor, tipografia, espaçamento, raios e foco; `#F37735` restrito à marca/decoração; contraste documentado.
5. Responsivo/acessibilidade: 320 CSS px, zoom 400%, teclado/foco, sem perda de conteúdo, rolagem horizontal, altura fixa ou foco recortado.
6. Segurança HTTP: CSP por nonce, nosniff, no-referrer, proteção contra framing, Permissions Policy mínima; nenhum dado pessoal/token em headers/logs.
7. CI: bloqueio em falha de formatação, lint, TS, imports, testes ou build; pelo menos 1 teste SSR e 1 verificação de acessibilidade.
8. Rastreabilidade: AR1–AR3, AR12, AR26, AR29, NFR5, NFR10, UX-DR1–UX-DR5, UX-DR19 e UX-DR24; sem tabelas/autenticação/Convite/abstrações sem consumidor.

## Regras de saída

- Cada achado: título de uma linha, qual AC/constraint viola e evidência do diff.
- Se não houver violação em uma AC específica, não invente.
- Reporte o que está **presente no diff**, não o que se desvia de uma interpretação pessoal.