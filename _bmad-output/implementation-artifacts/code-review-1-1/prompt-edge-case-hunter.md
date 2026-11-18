# Edge Case Hunter — Revisão da História 1.1 (Bora Lá)

## Tarefa

Execute o skill `bmad-review-edge-case-hunter` sobre o diff desta história.

## Diff

O diff está em: `_bmad-output/implementation-artifacts/code-review-1-1/diff-1-1.txt`

(Este diff contém 31 arquivos da História 1.1 — branch `feature/epic-1-story-1-base-executavel`, commits `8886494` + `1316763` sobre `4fc7260` — excluindo `package-lock.json`, que é gerado e possui 7.349 linhas. Não foi incluído por ser auto-gerado com `npm ci`.)

## Contexto

- **Projeto:** Bora Lá — aplicação SSR React Router Framework Mode + Vite + TypeScript.
- **Stack fixada:** Node.js 24.18.0, React 19.2.7, React Router 8.3.0, Vite 8.0.16, TypeScript 6.0.2, Vitest 4.1.7, Cypress 15.19.0.
- **Alvo da história:** base executável SSR com home em pt-BR, identidade visual conforme DESIGN.md, cabeçalhos de segurança (CSP nonce, HSTS condicional, nosniff, no-referrer, Permissions Policy, frame-ancestors none), CI com gates de qualidade, testes TDD (Vitest + Cypress/axe) e documentação operacional.
- **Restrições da história:** não criar autenticação, banco, Convite, abstrações sem consumidor, CTA de criação/login.

## Áreas de atenção para casos de borda

- SSR: HEAD/GET, erro no shell, timeout de streaming, status 404/500, reutilização de nonce entre respostas.
- Segurança: CSP violando `self` com assets atuais, header absence em rotas de erro, encodamento do nonce em base64 (pode conter caracteres não seguros), falha de HSTS em produção.
- Layout acessível: 320px, zoom 400%, reflow sem `overflow-wrap`, quebra de strings longas em url, espaço entre palavras e letras.
- Todas as verificações devem ser determinísticas; apontar, se houver, testes que sejam flaky ou dependentes de ordem.

## Regras de saída

- Cada achado: título, arquivo/caminho, evidência do diff e justificativa de impacto.
- Relatar somente casos não tratados — não repita caminhos que já cobrem, e não reporte recomendações cosméticas.