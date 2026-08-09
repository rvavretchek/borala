# Revisão editorial de estrutura — Design e Experience Spines

Escopo: revisão estrutural, sem edição dos spines. O conteúdo é sacrossanto. A prioridade é o consumo por LLMs downstream no handoff para arquitetura e implementação, com escaneabilidade humana preservada. Não foi fornecido `style_guide` adicional nem meta de redução.

## Priorização geral

1. **P0 — elevar restrições arquiteturais críticas:** tornar privacidade, autorização, cache e ciclo de sessão uma seção principal de `EXPERIENCE.md`.
2. **P1 — corrigir a taxonomia do contrato:** reunir Correção/Outro Rolê com as demais transições e mover foco/anúncios para acessibilidade.
3. **P2 — reforçar fonte única e precedência:** manter breakpoints no `DESIGN.md` e retirar de `EXPERIENCE.md` a repetição literal, substituindo-a por referência inequívoca.
4. **P3 — separar normativo de histórico:** mover inspiração e explorações rejeitadas para o fim do `EXPERIENCE.md`, explicitamente como proveniência não normativa.
5. **Preservação obrigatória:** manter jornadas, matrizes de estado/privacidade, rastreabilidade, acessibilidade, distinções normativas, exemplos e contratos negativos.

---

## Documento 1 — `DESIGN.md`

### Document Summary

- **Validação de entrada:** conteúdo válido, com mais de três palavras; `reader_type=llm` válido.
- **Tipo atual:** spine de referência visual com front matter estruturado, prosa normativa e tabelas.
- **Purpose:** handoff inequívoco da identidade visual e dos invariantes de apresentação para arquitetura e implementação.
- **Audience:** LLMs downstream, arquitetos, designers e pessoas desenvolvedoras.
- **Reader type:** `llm`, com escaneabilidade humana secundária preservada.
- **Structure model:** Reference/Database — acesso aleatório, terminologia estável e schemas consistentes.
- **Pergunta central:** quais tokens, hierarquias, componentes e limites visuais implementam “organizar sem governar”?
- **Frase de propósito:** Este documento existe para ajudar LLMs downstream e implementadores a transformar a direção visual aprovada em uma interface consistente, acessível e não governante.
- **Current length:** 1.094 palavras, 8 seções H2 e 9 headings no total.
- **Length target:** não especificado.

### Mapa estrutural

| Bloco | Palavras | Serve diretamente ao propósito? |
|---|---:|---|
| Front matter + título | 375 | Sim; fornece metadados, tokens e anatomia visual legíveis por máquina. |
| Brand & Style | 80 | Sim; fixa direção, referências e precedência normativa. |
| Colors | 105 | Sim; fixa paleta, usos e contraste. |
| Typography | 61 | Sim; fixa fontes, escala e limites. |
| Layout & Spacing | 88 | Sim; fixa responsividade e ordem do Convite. |
| Elevation & Depth | 22 | Sim; impede que profundidade comunique legitimidade. |
| Shapes | 37 | Sim; fixa formas e alvos interativos. |
| Components | 215 | Sim; é o registro semântico dos componentes. |
| Do's and Don'ts | 111 | Sim; traduz invariantes em guardrails de implementação. |

### Análise estrutural e de fluxo

- O documento obedece bem ao modelo de referência: tokens vêm antes dos contratos de componente, e os contratos vêm antes dos anti-patterns.
- A informação mais crítica para resolver conflitos — “os spines vencem qualquer mock ou import” — aparece somente no fim de `Brand & Style`; para um LLM, a precedência deve ser conhecida antes de interpretar assets e referências.
- `Elevation & Depth` e `Shapes` são microseções relacionadas a primitivas visuais; separadas, aumentam navegação sem acrescentar uma fronteira conceitual forte.
- O front matter de `components` e a tabela `Components` não são redundância verdadeira: o primeiro declara valores/tokenização; a segunda declara semântica e proibições.
- A matriz de contraste, os exemplos de texto e o quadro Do/Don't são apoios de compreensão e grounding específico do projeto; não devem ser removidos.
- Não há detalhe prematuro, FAQ, apêndice descartável ou violação de escopo relevante.

### Recommendations

#### 1. MOVE — precedência normativa e status das referências

**Rationale:** Mover a frase sobre precedência dos spines e o status normativo/histórico dos assets para um bloco curto imediatamente após o título impede que LLMs tratem mocks ou estudos como autoridade antes de chegar a `Brand & Style`.

**Impact:** ~0 palavras; apenas reordenação.

#### 2. MERGE — `Elevation & Depth` + `Shapes`

**Rationale:** Reunir as duas microseções sob uma seção como `Visual Primitives`, mantendo subtítulos ou rótulos internos, reduz fragmentação sem perder nenhuma regra.

**Impact:** ~4 palavras de headings.

#### 3. PRESERVE — front matter de componentes + tabela `Components`

**Rationale:** Os dois blocos cumprem funções distintas — valores consumíveis por máquina e contrato semântico — e sua remoção prejudicaria tanto geração quanto revisão humana.

**Impact:** 0 palavras.

#### 4. PRESERVE — `Colors`, matriz WCAG e restrições distribuídas de acessibilidade

**Rationale:** Contrastes verificados, dimensões e comportamento de foco são evidência implementável, não explicação repetida.

**Impact:** 0 palavras.

#### 5. PRESERVE — `Do's and Don'ts`

**Rationale:** O quadro ancora proibições constitucionais em pares concretos e reduz interpretações erradas por LLMs, mesmo quando reforça regras anteriores.

**Impact:** 0 palavras.

#### 6. PRESERVE — `Layout & Spacing` como fonte canônica de breakpoints e largura

**Rationale:** Manter os valores responsivos em um único contrato visual permite que `EXPERIENCE.md` referencie este bloco sem duplicar números suscetíveis a divergência.

**Impact:** 0 palavras neste documento.

### Summary

- **Total recommendations:** 6.
- **Estimated reduction:** ~4 palavras (<1% do original).
- **Meets length target:** nenhuma meta especificada.
- **Comprehension trade-offs:** nenhum; as recomendações preservam exemplos, matriz, acessibilidade e guardrails.
- **Conclusão:** a estrutura é sólida; a única mudança estrutural material é antecipar a autoridade normativa.

---

## Documento 2 — `EXPERIENCE.md`

### Document Summary

- **Validação de entrada:** conteúdo válido, com mais de três palavras; `reader_type=llm` válido.
- **Tipo atual:** spine comportamental de referência, com IA, contratos de componentes, estados, interações, jornadas e rastreabilidade.
- **Purpose:** handoff inequívoco do comportamento do MVP e de seus limites normativos para arquitetura e implementação.
- **Audience:** LLMs downstream, arquitetos, pessoas desenvolvedoras, QA, UX e acessibilidade.
- **Reader type:** `llm`, com escaneabilidade humana secundária preservada.
- **Structure model:** Reference/Database — consulta aleatória, cobertura MECE e contratos com schema consistente.
- **Pergunta central:** como cada superfície, estado e interação deve se comportar para organizar o Rolê sem inferir ou conceder autoridade social?
- **Frase de propósito:** Este documento existe para ajudar LLMs downstream e implementadores a construir os fluxos e estados do MVP sem violar privacidade, acessibilidade nem o princípio “organizar sem governar”.
- **Current length:** 2.071 palavras, 12 seções H2 e 25 headings no total.
- **Length target:** não especificado.

### Mapa estrutural

| Bloco | Palavras | Serve diretamente ao propósito? |
|---|---:|---|
| Front matter + título | 38 | Sim; fixa metadados e fontes. |
| Foundation | 117 | Sim; define autoridade, princípio e identificação do MVP. |
| Information Architecture | 203 | Sim; define superfícies, precedência e ordem canônica. |
| Voice and Tone | 121 | Sim; fixa vocabulário e microcopy de risco. |
| Component Patterns | 387 | Sim; define comportamento por componente, mas contém uma transição de domínio fora de categoria. |
| State Patterns | 377 | Sim; define matriz, privacidade e cache, embora restrições arquiteturais críticas estejam subordinadas. |
| Interaction Primitives | 235 | Sim; define mutações, saídas e foco, mas mistura acessibilidade com transições. |
| Accessibility Floor | 74 | Sim; fixa o piso WCAG, hoje separado dos detalhes de foco. |
| Responsive & Platform | 52 | Sim; contém regras de plataforma, mas repete valores canônicos do Design Spine. |
| Inspiration & Anti-patterns | 43 | Parcialmente; registra proveniência útil, mas não é contrato de implementação. |
| Key Flows | 242 | Sim; valida os contratos em jornadas ponta a ponta. |
| Rastreabilidade compacta | 155 | Sim; conecta capacidades/requisitos à cobertura UX. |
| Open Questions | 27 | Sim; delimita o que segue para arquitetura. |

### Análise estrutural e de fluxo

- `Foundation` e `Information Architecture` fornecem scaffolding adequado antes dos detalhes.
- As restrições mais importantes para arquitetura — privacidade por audiência/tempo e cache/BFCache/sessão — estão enterradas como H3 de `State Patterns`; esse posicionamento aumenta o risco de serem tratadas como simples estados de UI.
- `Opção, Correção e Outro Rolê` descreve transições de domínio e consequências persistentes, mas está dentro de `Component Patterns`; o título pai induz classificação errada.
- `Foco e anúncios` é parte operacional da acessibilidade, mas está separado do `Accessibility Floor`, exigindo que o downstream reconstrua o contrato a partir de duas áreas.
- `Responsive & Platform` repete literalmente breakpoints e larguras já canônicos em `DESIGN.md`; é a única redundância verdadeira relevante entre os dois spines.
- `Inspiration & Anti-patterns` interrompe a passagem das regras normativas para jornadas/rastreabilidade; seu conteúdo é útil como proveniência, mas deve permanecer claramente não normativo.
- As jornadas compactas têm schema consistente em conteúdo — passos, clímax e falha — porém estão em parágrafos densos; a conversão para blocos rotulados melhora parsing e leitura sem condensar ideias.
- `Key Flows` e `Rastreabilidade compacta` não são repetição: as jornadas demonstram comportamento; a matriz prova cobertura normativa.
- Não há FAQ, overview que repita integralmente o corpo ou apêndice que deva ser cortado.

### Recommendations

#### 1. MOVE — `Privacidade por audiência e tempo` + `Cache, BFCache e sessão`

**Rationale:** Elevar os dois H3 para uma seção H2 própria, logo após `Information Architecture`, torna restrições de autorização, retenção e revalidação visíveis antes de qualquer decisão arquitetural ou de componente.

**Impact:** ~0 palavras; apenas mudança de nível e posição.

#### 2. MERGE — contrato `Opção, Correção e Outro Rolê` com as transições de `Interaction Primitives`

**Rationale:** Colocar as consequências persistentes de Correção e Outro Rolê junto das demais mutações elimina a falsa impressão de que a regra pertence a um componente e permite consolidar a frase genérica de “revisão consciente”.

**Impact:** ~8 palavras.

#### 3. MOVE — `Foco e anúncios` para `Accessibility Floor`

**Rationale:** Reunir o piso WCAG e seu comportamento de foco/live regions cria uma única superfície de consulta para implementação e testes de acessibilidade.

**Impact:** ~0 palavras.

#### 4. CONDENSE — `Responsive & Platform`

**Rationale:** Substituir a repetição de breakpoints e larguras por uma referência explícita a `DESIGN.md > Layout & Spacing`, preservando aqui Web Share, fallback, rota externa e independência de gestos, estabelece fonte única de verdade.

**Impact:** ~14 palavras, sem perda de conteúdo no conjunto dos spines.

#### 5. MOVE — `Inspiration & Anti-patterns`

**Rationale:** Mover o bloco para depois de `Open Questions`, sob um rótulo de proveniência não normativa, evita que estudos históricos interrompam a sequência contrato → jornadas → rastreabilidade → pendências.

**Impact:** ~0 palavras.

#### 6. PRESERVE — `Key Flows`, com schema visual consistente

**Rationale:** Manter todas as seis jornadas e apenas reformatar cada uma em `Passos`, `Clímax` e `Falha` torna o padrão explícito para humanos e LLMs sem remover contexto ponta a ponta.

**Impact:** ~0 palavras; reflow estrutural.

#### 7. PRESERVE — `Rastreabilidade compacta`

**Rationale:** A matriz é a prova de cobertura entre CAP/FR/NFR e UX, necessária para arquitetura, implementação e QA; não é um resumo dispensável das jornadas.

**Impact:** 0 palavras.

#### 8. PRESERVE — matrizes de estado e privacidade

**Rationale:** As matrizes diferenciam superfície, audiência, tempo e terminalidade de modo MECE e reduzem inferência indevida por downstream.

**Impact:** 0 palavras.

#### 9. PRESERVE — `Foundation` como contrato executivo

**Rationale:** A repetição seletiva do princípio, da igualdade de poderes e do método de identidade estabelece invariantes antes do detalhe e funciona como reforço intencional, não redundância.

**Impact:** 0 palavras.

#### 10. PRESERVE — distinções normativas e exemplos de microcopy

**Rationale:** Correção × Outro Rolê, público × identificado, erro × offline e exemplos de mensagens são grounding específico do produto e não devem ser resumidos em abstrações.

**Impact:** 0 palavras.

### Ordem recomendada após aceitação

1. Foundation
2. Information Architecture
3. Privacy, Authorization & Session (conteúdo elevado de `State Patterns`)
4. Voice and Tone
5. Component Patterns
6. State Patterns (matriz por superfície)
7. Interaction Primitives (incluindo Correção × Outro Rolê)
8. Accessibility Floor (incluindo foco e anúncios)
9. Responsive & Platform
10. Key Flows
11. Rastreabilidade compacta
12. Open Questions
13. Inspiration & Anti-patterns — proveniência não normativa

### Summary

- **Total recommendations:** 10.
- **Estimated reduction:** ~22 palavras (~1,1% do original).
- **Meets length target:** nenhuma meta especificada.
- **Comprehension trade-offs:** nenhum; as mudanças preservam todos os apoios de compreensão e tornam restrições críticas mais visíveis.
- **Conclusão:** o documento está completo; a melhoria de maior valor é taxonômica, não redacional.

---

## Resumo consolidado

- Não há justificativa estrutural para cortes substanciais.
- A redução estimada conjunta é de ~26 palavras; densidade virá de fonte única e melhor localização, não da remoção de conteúdo.
- Nenhuma recomendação remove rastreabilidade, jornadas, matrizes, acessibilidade, exemplos ou distinções normativas.
- Ordem de aplicação sugerida: recomendações 1–3 de `EXPERIENCE.md`, recomendação 1 de `DESIGN.md`, depois consolidação responsiva e proveniência histórica.
