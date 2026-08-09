# Spine Pair Review — Bora Lá

## Overall verdict

O par cobre bem as seis jornadas do PRD, preserva “organizar sem governar” e tem forma editorial adequada, mas ainda não é um contrato limpo para arquitetura e story-dev. O principal risco é mecânico: quatro fontes normativas do frontmatter não resolvem; além disso, requisitos/capabilities não têm rastreabilidade até passos dos fluxos, componentes essenciais e estados por superfície estão incompletos, e decisões visuais/behaviorais load-bearing permanecem como `[ASSUMPTION]` ou `Open Questions`.

## 1. Flow coverage — broken

Foram extraídos das fontes seis jornadas (`UJ-1`–`UJ-6`), onze capabilities (`CAP-1`–`CAP-11`), vinte e dois requisitos funcionais (`FR-1`–`FR-22`) e dez NFRs (`NFR-1`–`NFR-10`). As seis UJs possuem protagonista nomeado, passos numerados, clímax e falha aplicável em `EXPERIENCE.md`; as requirements e capabilities, porém, não são ligadas nominalmente aos fluxos ou aos passos que as realizam.

### Findings

- **[high]** `CAP-1`–`CAP-11`, `FR-1`–`FR-22` e `NFR-1`–`NFR-10` não têm Key Flow próprio nem uma matriz explícita que demonstre cobertura por fluxo/passo; um consumidor não consegue distinguir cobertura intencional de coincidência textual (`EXPERIENCE.md`, `## Key Flows`; PRD `§4` e `§5`; SPEC `## Capabilities`). *Fix:* acrescentar rastreabilidade compacta requisito → UJ → passos/falha/estado, preservando os nomes verbatim; quando um requisito transversal não justificar fluxo próprio, declarar explicitamente onde ele é exercitado.

## 2. Token completeness — adequate

Todos os tokens de cor possuem hex; os objetos de tipografia, raios, espaçamento e componentes respeitam os tipos do spec. Todas as referências `{path.to.token}` encontradas nos dois spines resolvem. A completude mecânica é boa, mas um par de contraste load-bearing falha e a tipografia de produção continua provisória.

### Findings

- **[high]** `{colors.accent-warm}` (`#F37735`) sobre `{colors.surface-raised}` mede aproximadamente `2,80:1` e sobre `{colors.surface-base}` aproximadamente `2,53:1`; ambos ficam abaixo de `3:1`, inclusive para o texto grande de `{typography.metric}` usado no agregado aprovado (`DESIGN.md`, `## Colors`, `## Typography`, `interest-envelope`). *Fix:* ajustar o laranja ou a superfície até pelo menos `3:1` para texto grande e registrar os pares/limiares verificados; se houver uso em texto normal, atingir `4,5:1`.
- **[medium]** A fonte editorial de produção é declarada provisória (`Georgia`) e tamanhos críticos permanecem sem regra de escala/resposta além do empilhamento (`DESIGN.md`, `## Typography`; `EXPERIENCE.md`, `## Open Questions`). *Fix:* comprometer a família final ou declarar Georgia como decisão definitiva do MVP e especificar como os tokens escalam com zoom/texto ampliado.

## 3. Component coverage — thin

Os dez componentes nomeados no frontmatter de `DESIGN.md` têm linha visual em `DESIGN.md.Components` e linha comportamental correspondente em `EXPERIENCE.md.Component Patterns`. A simetria nominal é forte, mas diversas peças essenciais usadas nas superfícies e estados não foram elevadas a componentes com contrato bilateral.

### Findings

- **[high]** Campos de Data/Horário/Nick/local, resumo de validação, controle de compartilhamento/copiar, ação de rota externa, lista nominal de `Topo` e revisão/confirmação consciente são usados como elementos load-bearing, mas não possuem componente visual e comportamental pareado (`EXPERIENCE.md`, IA, State Patterns e Interaction Primitives; `DESIGN.md`, `## Components`). *Fix:* nomear somente os componentes realmente reutilizáveis e adicionar, para cada um, anatomia/estados visuais no DESIGN e regras de comportamento/foco/erro no EXPERIENCE.
- **[medium]** `brand-signature` diz “Linka identidade ao resumo”, expressão que pode ser lida como comportamento de link, enquanto o visual descreve apenas um logo e nenhum destino é especificado (`EXPERIENCE.md`, `Component Patterns.brand-signature`). *Fix:* trocar por “associa visualmente” ou definir destino, foco e nome acessível se a marca for acionável.

## 4. State coverage — thin

O spine cobre categorias globais úteis — cold-load, vazio, foco, envio, sucesso, erro/offline, validação, duplicidade, concorrência, tempo, identificação e estados terminais. A caminhada superfície por superfície, contudo, não fecha os estados esperados de todas as superfícies da IA.

### Findings

- **[high]** `Criar Rolê`, `Identificação + Nick`, `Rolê identificado`, `Detalhe da Opção` e `Histórico operacional` não têm cobertura explícita, por superfície, de cold-load, vazio, erro/retry, foco e indisponibilidade aplicáveis; o tratamento global não diz qual conteúdo permanece, qual ação volta a receber foco ou qual fallback cada superfície oferece (`EXPERIENCE.md`, `## Information Architecture` versus `## State Patterns`). *Fix:* substituir/estender a tabela por uma matriz superfície × estado aplicável, incluindo “não aplicável” consciente quando pertinente.
- **[medium]** `Erro recuperável/offline` reúne falha transitória e ausência de conectividade num mesmo contrato, e `Permissão/identificação ausente` mistura autorização negada com porta de autenticação (`EXPERIENCE.md`, `## State Patterns`). *Fix:* separar offline, erro de servidor, sessão expirada/identificação ausente e permissão negada, com comportamento e microcopy próprios.

## 5. Visual reference coverage — adequate

Não existem diretórios `mockups/` ou `wireframes/`. Em `imports/`, os dois SVGs reais são ligados inline e recebem propósito específico; `.gitkeep` não é referência visual. A direção aprovada também é ligada e os spines-win-on-conflict são declarados uma vez.

### Findings

- **[medium]** A única tela aprovada continua em `.working/direction-assinatura-brinde-refinada.html`, não em `mockups/`, portanto o contrato de referência durável ainda depende de um artefato de exploração (`DESIGN.md`, `## Brand & Style`). *Fix:* promover a direção aprovada a `mockups/` e atualizar o link inline, mantendo `.working/` para estudos.
- **[low]** `.working/directions-convite.html` e `.working/directions-convite-logos.html` foram lidos como contexto histórico relevante, mas não são mencionados como explorações rejeitadas; a trilha entre alternativas e decisão depende apenas do memlog (`.working/`; `DESIGN.md`, `## Brand & Style`). *Fix:* ou mantê-los explicitamente como working não normativo sem promoção, ou registrar uma breve referência de rejeição na seção Inspiration/Anti-patterns.

## 6. Bloat & overspecification — adequate

A estrutura é majoritariamente escaneável e usa tabelas onde ajudam. Não há narrativa decorativa extensa nem especificação pixel a pixel disseminada; ainda assim, parte do contrato de produto foi reescrita dentro do spine de experiência.

### Findings

- **[medium]** Precedência de estados, regras temporais, idempotência, concorrência e proibições de domínio são parcialmente restatadas em várias seções sem IDs de origem; isso aumenta risco de drift em relação ao PRD/SPEC (`EXPERIENCE.md`, Foundation, IA, Component Patterns, State Patterns e Interaction Primitives). *Fix:* manter no spine apenas a consequência de UX e referenciar `FR-*`/`CAP-*` para a regra normativa, usando uma tabela de rastreabilidade em vez de repetição narrativa.

## 7. Inheritance discipline — broken

Os nomes das seis UJs são preservados verbatim e os componentes mantêm nomes idênticos nos dois spines. Referências de tokens do EXPERIENCE resolvem no DESIGN. A herança falha, porém, no ponto mais básico: quatro caminhos normativos do frontmatter não resolvem a partir do diretório dos spines, e há um conflito load-bearing ainda não decidido com `FR-13`.

### Findings

- **[high]** Os caminhos para `SPEC.md`, `mvp-rules.md` e `state-machines.md` apontam para `specs/` na raiz, mas os arquivos reais estão em `_bmad-output/specs/`; o caminho `../../../../../CONSTITUTION.md` resolve fora da raiz do projeto, enquanto o arquivo real está em `borala/CONSTITUTION.md` (`DESIGN.md` e `EXPERIENCE.md`, frontmatter `sources`). *Fix:* a partir do diretório atual, usar `../../../specs/spec-borala-mvp/...` para a SPEC e companions e `../../../../CONSTITUTION.md` para a Constituição; validar todos por resolução filesystem antes de finalizar.
- **[high]** `FR-13` diz que definir o Local “não exige confirmação adicional do sistema”, enquanto `Interaction Primitives` exige confirmação consciente e deixa como `[ASSUMPTION]` se uma revisão no mesmo gesto é permitida (`EXPERIENCE.md`, `## Interaction Primitives` e `## Open Questions`; PRD `FR-13`). *Fix:* resolver com produto antes do handoff e comprometer um único padrão — por exemplo, consequência inline no mesmo gesto, sem modal/segunda confirmação, se isso for confirmado como compatível.
- **[medium]** O companion usa `Propor outro local`, enquanto PRD/EXPERIENCE alternam para `Criar Outro Rolê`; o resultado pode ser intenção de UX válida, mas não há mapeamento explícito entre os termos (`mvp-rules.md`, `## Declarações`; `EXPERIENCE.md`, Component Patterns e UJ-6). *Fix:* escolher o rótulo canônico de interface e registrar a equivalência ao termo normativo sem alternância silenciosa.

## 8. Shape fit — strong

`DESIGN.md` segue integralmente a ordem canônica: Brand & Style, Colors, Typography, Layout & Spacing, Elevation & Depth, Shapes, Components, Do's and Don'ts. `EXPERIENCE.md` contém todos os defaults obrigatórios; Responsive & Platform e Inspiration & Anti-patterns estão presentes porque foram acionados por web responsiva e referências explícitas. `Open Questions` merece existir, mas revela decisões ainda não comprometidas.

### Findings

- **[high]** Método de autenticação, tipografia final, largura/breakpoints, padrão compatível com `FR-13` e contraste permanecem abertos ou marcados `[ASSUMPTION]`; juntos impedem que consumidores implementem as superfícies de identidade, responsividade e ação crítica sem inventar decisões (`DESIGN.md`, Colors/Typography/Layout; `EXPERIENCE.md`, Foundation, Responsive & Platform, Interaction Primitives e Open Questions). *Fix:* resolver os bloqueadores de UX agora; encaminhar apenas decisões genuinamente arquiteturais com contrato de interface explícito e critérios que impeçam invenção downstream.

## Mechanical notes

- Referências `{path.to.token}`: 20 únicas no DESIGN e 2 no EXPERIENCE; todas resolvem para tokens definidos.
- Tokens de cor: 10/10 com hex. Pares medidos: `ink-primary/surface-base` `16,03:1`; `surface-raised/ink-primary` `17,74:1`; `ink-secondary/surface-base` `5,76:1`; `accent-cool/surface-raised` `4,70:1`; `accent-warm/surface-raised` `2,80:1`; `accent-warm/surface-base` `2,53:1`.
- Componentes pareados existentes: 11/11 (`brand-signature`, `invitation-summary`, `interest-envelope`, `primary-action`, `access-gate-row`, `identity-gate`, `option-card`, `response-control`, `declaration-panel`, `operational-history`, `state-notice`); todos aparecem nos dois spines e no frontmatter.
- Fontes do frontmatter: PRD e Product Brief resolvem; SPEC, dois companions e Constituição não resolvem pelos caminhos declarados.
- Referências visuais: `imports/borala-logo-1.svg` e `imports/borala-logo-2.svg` ligadas inline; mock aprovado ligado em `.working/`; sem `mockups/` ou `wireframes/` promovidos.
- Mermaid: nenhum bloco Mermaid nos spines; portanto não há sintaxe Mermaid a validar. A árvore textual da IA é legível, mas a renderização observada exibe mojibake no terminal; confirmar codificação UTF-8 no pipeline de consumo.
- Contagem de findings: **critical 0 · high 7 · medium 6 · low 1**.
