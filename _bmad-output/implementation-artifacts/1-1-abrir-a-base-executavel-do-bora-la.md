# História 1.1: Abrir a base executável do Bora Lá

Status: ready-for-dev

## História

Como pessoa que acessa o Bora Lá,
Quero abrir uma aplicação rápida, acessível e coerente com sua identidade,
Para ter uma base confiável para criar e acompanhar um Rolê.

## Critérios de aceitação

1. **Dado** um clone limpo do repositório

   **Quando** as dependências forem instaladas e os comandos de desenvolvimento, teste e build forem executados

   **Então** a aplicação React Router Framework Mode deve iniciar por SSR em Node.js e produzir um build de produção reproduzível

   **E** as versões devem respeitar a stack aprovada e permanecer fixadas no `package-lock.json`.

2. **Dado** uma pessoa abrindo a rota inicial

   **Quando** o servidor responder

   **Então** deve renderizar uma página em Português do Brasil com a marca Bora Lá e uma explicação factual do propósito do produto

   **E** o conteúdo principal deve existir no HTML SSR sem depender de hidratação ou JavaScript do cliente.

3. **Dado** a estrutura inicial do código

   **Quando** um implementador inspecionar suas dependências

   **Então** as rotas devem obter comportamento pelo composition root

   **E** nenhuma regra de domínio deve depender de React, HTTP, Kysely, MySQL ou adapters

   **E** somente diretórios e abstrações consumidos pela história devem existir.

4. **Dado** a identidade visual aprovada

   **Quando** a página inicial for renderizada

   **Então** deve usar os tokens fundamentais de cor, tipografia, espaçamento, raios e foco de `DESIGN.md`

   **E** o laranja `#F37735` deve permanecer restrito à marca ou decoração segura

   **E** textos funcionais devem usar os pares de contraste documentados.

5. **Dado** um viewport de 320 CSS px, zoom de 400%, teclado ou ajustes de espaçamento de texto

   **Quando** a pessoa navegar pela página

   **Então** não deve haver perda de conteúdo, rolagem horizontal, altura fixa ou foco recortado

   **E** todos os controles existentes devem ser operáveis por teclado, com foco visível.

6. **Dado** qualquer resposta HTML da aplicação

   **Quando** os cabeçalhos forem inspecionados

   **Então** devem estar presentes CSP por nonce, `X-Content-Type-Options: nosniff`, `Referrer-Policy: no-referrer`, proteção contra framing e Permissions Policy mínima

   **E** nenhum cabeçalho ou log deve incluir dado pessoal ou token sensível.

7. **Dado** uma pull request

   **Quando** a integração contínua for executada

   **Então** deve falhar diante de erro de formatação, lint, TypeScript, regra de imports, testes ou build

   **E** deve executar ao menos um teste automatizado do shell SSR e uma verificação de acessibilidade da superfície inicial.

8. **Dado** o código produzido nesta história

   **Quando** a implementação for revisada

   **Então** deve haver rastreabilidade para AR1–AR3, AR12, AR26, AR29, NFR5, NFR10, UX-DR1–UX-DR5, UX-DR19 e UX-DR24

   **E** a história não deve criar tabelas, autenticação, Convites ou abstrações sem consumidor.

## Tarefas e subtarefas

- [ ] 1. Inicializar o projeto React Router Framework Mode SSR (CA: 1, 3)
  - [ ] Criar o scaffold mínimo com Node.js 24 LTS, npm, TypeScript e React Router Framework Mode; não usar SPA Mode.
  - [ ] Fixar versões exatas no `package.json`, gerar e versionar `package-lock.json` com `npm ci` como instalação canônica.
  - [ ] Disponibilizar scripts executáveis para desenvolvimento, produção, formatação, lint, tipos, testes, verificação de imports, E2E e build.
  - [ ] Registrar a versão mínima/exata de Node para clone limpo (`engines` e arquivo de versão apropriado).

- [ ] 2. Implementar o shell e a rota inicial por SSR (CA: 2, 3, 4)
  - [ ] Criar `app/root.tsx`, `app/routes.ts` e a rota inicial seguindo a API vigente do React Router 8.
  - [ ] Entregar `<html lang="pt-BR">`, landmarks nativos, hierarquia de títulos coerente, marca Bora Lá e uma explicação factual curta no HTML retornado pelo servidor.
  - [ ] Copiar somente o logo normativo `_bmad-output/planning-artifacts/ux-designs/ux-borala-2026-08-06/imports/borala-logo-1.svg` para um destino estável em `public/`, com texto alternativo `Bora Lá` e sem transformá-lo em link ou controle.
  - [ ] Não adicionar CTA de criação, login ou Convite antes das histórias que entregam esses comportamentos.
  - [ ] Se a rota consumir comportamento server-side, resolvê-lo pelo composition root; não criar um composition root vazio, caso de uso fictício ou service locator apenas para satisfazer a estrutura futura.

- [ ] 3. Aplicar os tokens visuais e a base responsiva (CA: 4, 5)
  - [ ] Centralizar os tokens consumidos pela home em CSS: cores, tipo, espaçamento, raios e foco.
  - [ ] Implementar uma coluna mobile-first com breakpoints de 640 px e 1024 px e largura máxima de 680 px.
  - [ ] Impedir altura fixa, corte de conteúdo, rolagem horizontal e recorte do foco.
  - [ ] Respeitar `prefers-reduced-motion`; não adicionar animação, autoplay ou flash sem necessidade.

- [ ] 4. Aplicar cabeçalhos de segurança a toda resposta HTML (CA: 6)
  - [ ] Centralizar a política em código server-side e gerar um nonce criptográfico novo por resposta.
  - [ ] Usar o mesmo nonce nos recursos emitidos pelo React Router e na diretiva `script-src`; não recorrer a `unsafe-inline` ou `unsafe-eval`.
  - [ ] Configurar `default-src 'self'`, `base-uri 'none'`, `object-src 'none'`, `frame-ancestors 'none'`, `form-action 'self'` e allowlists mínimas para recursos realmente usados.
  - [ ] Enviar `nosniff`, `Referrer-Policy: no-referrer` e Permissions Policy mínima, ao menos `camera=(), microphone=(), geolocation=()`.
  - [ ] Preparar HSTS conforme AR12, habilitando-o somente no ambiente HTTPS cujo domínio tenha sido validado; não simular seu efeito no HTTP local.
  - [ ] Garantir que nonce, CSP completa, dados pessoais e tokens não sejam registrados em logs.

- [ ] 5. Implementar testes por TDD e gates locais (CA: 1–8)
  - [ ] Escrever primeiro testes Vitest do documento SSR, do idioma, landmarks, conteúdo factual, logo e independência de hidratação.
  - [ ] Testar os cabeçalhos no mecanismo global e também em uma resposta HTML 404; comprovar nonce novo por resposta e coerência entre header e markup.
  - [ ] Criar teste/regra de fronteira de imports sem introduzir ferramenta adicional quando ESLint ou um teste simples bastar.
  - [ ] Criar Cypress + axe para a home: WCAG AA, teclado/foco, 320 CSS px, zoom 400%, text spacing da WCAG 1.4.12 e string longa sem overflow.
  - [ ] Comprovar build e smoke SSR de produção; interpretar reprodutibilidade como `npm ci` + lockfile + configuração determinística, sem exigir hash byte a byte não garantido pela toolchain.

- [ ] 6. Configurar CI e documentação operacional mínima (CA: 1, 7, 8)
  - [ ] Criar workflow para pull requests destinados a `dev` e `main`, com passos diagnosticáveis para formato, lint, TypeScript, imports, Vitest, Cypress/axe e build.
  - [ ] Incluir `npm audit --audit-level=high` e análise CodeQL como scans iniciais; não adicionar banco, imagem OCI ou infraestrutura ainda sem consumidor.
  - [ ] Atualizar `README.md` com pré-requisitos, comandos efetivamente disponíveis, estado atual e próximos passos já coerentes com a implementação.
  - [ ] Não declarar branch protection concluída sem evidência da configuração externa; o repositório deve fornecer todos os checks necessários para ela.

## Contexto para desenvolvimento

### Estado atual do repositório

- O repositório é documental: não existem `package.json`, `package-lock.json`, `app/`, `tests/`, `cypress/`, workflow de CI nem aplicação legada.
- Todos os arquivos de aplicação desta história serão novos. `README.md` e `.gitignore` só devem ser alterados quando necessário para comandos e artefatos realmente criados.
- Não há história anterior implementada nem padrões de código prévios a preservar.

### Stack obrigatória

| Tecnologia | Versão aprovada | Uso nesta história |
|---|---:|---|
| Node.js | 24.18.0 LTS | runtime de desenvolvimento, build e SSR |
| React / React DOM | 19.2.7 | interface e SSR |
| React Router | 8.3.0 Framework Mode | rotas e documento SSR |
| `@react-router/dev` / `@react-router/node` | 8.3.0 | plugin Vite e runtime Node |
| Vite | 8.0.16 | build; sem RSC experimental |
| TypeScript | 6.0.2 | tipagem e verificação |
| Vitest | 4.1.7 | testes automatizados |
| React Testing Library | 16.3.2 | testes de UI; pinar também `@testing-library/dom` |
| Cypress | 15.19.0 | E2E e acessibilidade |

- Não instalar Kysely, `mysql2`, Zod, `temporal-polyfill`, Resend ou bibliotecas TanStack: não há consumidor nesta história.
- A documentação oficial confirma que Framework Mode oferece SSR e Route Modules tipados. React Router 8 exige Node 22.22+ e React 19.2.7+; Node 24.18.0 satisfaz esses mínimos.
- Vite 8 usa Rolldown e mantém os requisitos modernos de Node; TypeScript 6 é uma versão de transição para TypeScript 7, portanto opções já depreciadas devem ser evitadas.

### Estrutura mínima esperada

```text
app/
├── root.tsx
├── routes.ts
├── routes/
├── styles/
└── ui/
public/
tests/
├── architecture/
└── routes/
cypress/e2e/
.github/workflows/
```

- Adicionar `app/server/composition/` e `app/server/security/` somente se os respectivos arquivos forem consumidos pelo shell/servidor nesta história.
- Não criar ainda `app/modules/identity`, `app/modules/outings`, persistence, migrations, e-mail ou `ops/`. O Structural Seed descreve a arquitetura final, não autoriza scaffolding vazio.
- Arquivos e identificadores de código são em inglês; interface, mensagens, documentação e comentários explicativos são em Português do Brasil.

### Tokens e guardrails de UX

- Canvas `#E8E4DB`; superfícies `#F8F3E8`/`#FFFFFF`; ink `#111827`/`#556070`; foco e função fria `#4B71C5`; bordas `#D7D3C9`/`#C8C7C1`.
- `#F37735` é exclusivo de marca/decoração; texto funcional quente usa `#A6400F`.
- Display usa `Georgia, Cambria, serif`; corpo usa `system-ui`, 16 px/1.5; texto essencial nunca abaixo de 13 px. Não baixar webfont.
- Espaçamento: 4/8/12/16/20/24/32 px. Raios: 8/12/14 px e pill. Foco: 2 CSS px, offset 2 px, contraste ≥3:1 e sem recorte.
- Até 639 px, margem de 24 px, reduzível a 16 px em 320 CSS px; a partir de 640 px, coluna de até 640 px; a partir de 1024 px, até 680 px.
- Mocks são referências de composição. Não copiar moldura de celular, sombras de prancha, altura fixa ou textos auxiliares para produção.

### Arquitetura e segurança

- Manter monólito modular SSR; não criar SPA/API paralela, CORS ou serviço separado.
- Routes são inbound adapters. Regras futuras de domínio não podem importar React, HTTP ou infraestrutura.
- Não usar container de DI, service locator ou singleton global mutável.
- HTML nativo vem primeiro; JavaScript do cliente não pode ser requisito para compreender a home.
- Logs usam allowlist técnica e não recebem conteúdo pessoal, token ou nonce.

### Estratégia de testes e definição de pronto

- Seguir vermelho → verde → refatoração. Nenhuma suíte pode ficar ignorada sem justificativa.
- Gates mínimos locais e de CI: `npm ci`, formato, ESLint, TypeScript, imports, Vitest, Cypress/axe, build de produção e `npm audit --audit-level=high`; CodeQL roda no GitHub Actions.
- A home deve retornar 200, `lang="pt-BR"`, `<main>`, marca e texto factual no HTML bruto.
- Axe não deve reportar violação relevante na superfície; qualquer controle real deve funcionar por teclado e exibir foco visível.
- A ausência de controles interativos não justifica adicionar um controle artificial: valide landmarks e navegação do conteúdo existente.

### Escopo explicitamente excluído

- Banco, schema, tabelas, migrations, Kysely, MySQL e dados de domínio.
- Autenticação, e-mail, challenge, sessão, cookies, CSRF e Resend.
- Rolê, Participant, Convite, criação, compartilhamento ou DTOs dessas capacidades.
- Docker/Podman, Caddy, OCI, deploy blue-green, backup, restore, RUM e Lighthouse do Convite.
- Ports, entidades, módulos ou diretórios vazios destinados apenas a histórias futuras.

### Referências

- [Fonte: `_bmad-output/planning-artifacts/epics.md`, História 1.1 e regras de decomposição]
- [Fonte: `_bmad-output/planning-artifacts/architecture/architecture-borala-2026-08-07/ARCHITECTURE-SPINE.md`, AD-2, AD-4, Stack, Structural Seed e Consistency Conventions]
- [Fonte: `_bmad-output/planning-artifacts/architecture/architecture-borala-2026-08-07/SOLUTION-DESIGN.md`, §§ 2, 4, 13.2, 14, 16 e 17]
- [Fonte: `_bmad-output/planning-artifacts/ux-designs/ux-borala-2026-08-06/DESIGN.md`, Colors, Typography, Layout & Spacing, Shapes e Components]
- [Fonte: `_bmad-output/planning-artifacts/ux-designs/ux-borala-2026-08-06/EXPERIENCE.md`, Accessibility Floor e Responsive & Platform]
- [Fonte: `CONSTITUTION.md`, princípios II, III e V e definição de pronto]
- [Fonte oficial: https://reactrouter.com/start/framework/installation]
- [Fonte oficial: https://reactrouter.com/start/modes]
- [Fonte oficial: https://reactrouter.com/upgrading/v7]
- [Fonte oficial: https://nodejs.org/en/about/previous-releases]
- [Fonte oficial: https://vite.dev/blog/announcing-vite8]
- [Fonte oficial: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-6-0.html]

## Registro do agente de desenvolvimento

### Modelo utilizado

A preencher pelo agente de implementação.

### Referências de depuração

### Notas de conclusão

- Análise completa do motor de contexto concluída; guia abrangente para desenvolvimento criado.

### Lista de arquivos

- A preencher pelo agente de implementação.
