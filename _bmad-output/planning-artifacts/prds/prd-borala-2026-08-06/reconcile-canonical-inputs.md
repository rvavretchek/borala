# Reconciliação do PRD com as fontes canônicas

**Data:** 2026-08-06  
**Artefatos avaliados:** `prd.md` e `addendum.md`  
**Fontes canônicas:** Product Brief, SPEC, `state-machines.md`, `mvp-rules.md` e `CONSTITUTION.md`

## Resultado executivo

O PRD está substancialmente alinhado ao contrato canônico do MVP. Não foi encontrado conflito material que altere a proposta central, o escopo gratuito, a autonomia do grupo, a privacidade da identidade, as quatro respostas, a distinção entre Correção e Outro Rolê, as regras temporais ou o cancelamento terminal.

Foram encontradas quatro omissões pontuais, uma formulação ambígua no adendo e uma inconsistência interna nas próprias fontes canônicas. Há ainda requisitos não funcionais quantitativos acrescentados pelo PRD; estão identificados como metas iniciais, mas não derivam das fontes.

## Matriz de cobertura

| Área canônica | Cobertura no PRD | Observação |
|---|---|---|
| Organizar sem governar | Completa | Visão, declarações, não objetivos e contramétricas preservam autonomia social. |
| Identidade privada e Nick contextual | Parcial | Falta explicitar a correção auditada do Nick. |
| Criação pelos dois pontos de partida | Completa | `Primeiro, quem topa` e `Já tenho um local` estão preservados. |
| Convite e acesso progressivo | Completa | Prévia pública e acesso identificado correspondem à SPEC. |
| Interesse, Opções e quatro Respostas | Completa | Inclui nominalidade exclusiva de `Topo`, contagens e silêncio não interpretado. |
| Imutabilidade, correções e URLs | Completa | Preserva valores originais, autoria, revisões e complementos. |
| Inativação e reativação | Parcial | Transições estão corretas; consultabilidade posterior das Opções fechadas não está explícita. |
| Declarações e concorrência | Completa | Sem quórum; primeira declaração vigora; conflito fica visível. |
| Correção versus Outro Rolê | Completa | Mantém `eventId` na correção e zera Respostas no novo Rolê. |
| Horário aproximado e Data | Completa | Preserva `Depois do expediente`, referência móvel e barreira de uma hora. |
| Consulta, compartilhamento e substituição | Parcial | O estado vivo prevalece, mas falta explicitar a precedência visual da substituição. |
| Cancelamento terminal | Completa no PRD | Há inconsistência na máquina de estados canônica, detalhada abaixo. |
| Limite Final e expiração | Completa | Sem reaproveitamento e com extensão exclusiva pela Pessoa Criadora. |
| Fora do MVP | Completa | Não houve reintrodução de memória, chat, integrações, mapas, monetização ou comparecimento. |
| Constituição de engenharia | Completa | O adendo preserva OO, TDD, Cypress, React, avaliação TanStack e decisão futura de backend. |

## Omissões encontradas

### RC-1 — Correção auditada do Nick

**Fonte:** `mvp-rules.md`, seção “Identidade e visibilidade”: “Nick — exigir unicidade dentro do rolê; permitir correção auditada.”

O FR-3 exige unicidade e cobre continuidade ou separação de identidades, mas não diz que uma Pessoa Convidada pode corrigir seu Nick com auditoria. NFR-4 não supre integralmente a lacuna, pois não estabelece a capacidade funcional de correção.

**Recomendação:** acrescentar ao FR-3 uma consequência testável para correção auditada do Nick, preservando autoria interna e evitando colisão contextual.

### RC-2 — Consulta de Opções fechadas no histórico operacional

**Fonte:** `mvp-rules.md`, seção “Sugestões e correções”: após a definição, todas as Opções fecham e permanecem consultáveis no histórico operacional.

O FR-9 determina fechamento, preservação de Respostas e histórico, mas não assegura explicitamente que as Opções fechadas continuem consultáveis. O FR-19 cobre somente o Local do Rolê vigente, endereço, URLs e rota.

**Recomendação:** declarar no FR-9 ou FR-19 que Opções fechadas continuam consultáveis por Pessoa Convidada identificada enquanto o Convite estiver operacional.

### RC-3 — Precedência visual de Rolê substituído

**Fonte:** `mvp-rules.md`, seção “Compartilhamento”: ao abrir o link, cancelamento **ou substituição** aparece antes de endereço, rota ou informações antigas.

O FR-2 dá precedência explícita apenas ao cancelamento. O FR-16 diz que o Rolê anterior permanece identificável como substituído, e o FR-5 afirma que o estado vigente prevalece, mas nenhum requisito exige que a substituição seja apresentada antes das informações operacionais antigas.

**Recomendação:** estender a consequência testável do FR-2 ou FR-16 para destacar substituição antes de endereço, URLs e rota do Rolê anterior.

### RC-4 — Reação da nominalidade ao trocar `Topo`

**Fonte:** `mvp-rules.md`, seção “Respostas”: trocar de `Topo` remove o Nick da lista nominal de forma atômica.

O FR-10 exige atualização atômica da lista nominal ao trocar a Resposta, o que cobre a intenção por inferência. Entretanto, a remoção do Nick ao sair de `Topo` não está expressa como comportamento verificável independente.

**Recomendação:** explicitar essa remoção para eliminar ambiguidade na derivação de testes. Esta é uma lacuna de precisão, não de comportamento aparente.

## Conflitos e inconsistências

### RC-5 — Inconsistência nas fontes sobre cancelamento durante a Organização

A SPEC (CAP-9), `mvp-rules.md` e o FR-22 permitem cancelamento antes ou durante o encontro. Porém, o diagrama “Estados do rolê” em `state-machines.md` possui transições para `Cancelled` somente a partir de `Defined` e `InProgress`; não há transição de `Organizing` nem de `OccurrenceDeclared`.

O PRD adotou corretamente a regra textual mais abrangente. Portanto, isto não é uma deriva do PRD, mas um defeito no companion normativo que pode induzir implementação ou testes incompletos.

**Recomendação:** corrigir a máquina de estados para incluir `Organizing --> Cancelled` e `OccurrenceDeclared --> Cancelled`.

### RC-6 — Formulação ambígua sobre notas no adendo

O adendo registra como alternativa rejeitada “Chat ou notas múltiplas por pessoa” e, logo depois, reconhece “uma nota livre por pessoa” como possibilidade futura. A decisão histórica/canônica do MVP é simplesmente não incluir notas livres; o Product Brief e a SPEC não consagram “notas múltiplas por pessoa” como alternativa real.

Não há ampliação de escopo, mas a primeira frase pode sugerir que apenas notas múltiplas foram rejeitadas.

**Recomendação:** substituir a formulação por “Chat ou notas livres no MVP” e manter a hipótese futura de uma nota editável por pessoa separadamente.

## Deriva de vocabulário

Não foi encontrada deriva grave. `Pessoa Criadora`, `Pessoa Convidada`, `Organização`, `Opção`, `Local do Rolê`, `Correção`, `Outro Rolê`, `Horário Aproximado` e `Limite Final` são empregados de modo consistente.

Pontos menores:

- O glossário define Opção como `ativa`, `inativa` ou `fechada`; a linguagem de interface validada para a retirada temporária é `Opção inativa`, preservada pelo PRD.
- O termo `plano vigente` é usado em algumas jornadas e requisitos como expressão descritiva, não como entidade concorrente a `Rolê`; não configura deriva, desde que UX e histórias não o transformem em conceito de domínio.
- `Resposta sobre plano vigente`, no FR-11, é menos preciso que `Resposta ao Local do Rolê definido`, usado pelas regras canônicas. Recomenda-se preferir o segundo nas histórias e testes.

## Adições não derivadas das fontes

O PRD acrescenta metas quantitativas e alguns NFRs que não constam explicitamente no Product Brief ou na SPEC:

- WCAG 2.2 AA no NFR-5;
- conteúdo principal em até 2,5 segundos no percentil 75 no NFR-6;
- limiares de SM-1 a SM-4.

Essas adições não conflitam com a Constituição e o próprio PRD as identifica como metas iniciais recalibráveis. Ainda assim, devem ser tratadas como hipóteses de qualidade/validação introduzidas pelo PRD, e não como decisões previamente validadas pelo usuário.

## Conclusão

**Parecer:** alinhado com ressalvas pontuais.  
**Bloqueadores para revisão:** nenhum conflito material no PRD.  
**Ajustes recomendados antes de marcar como final:** RC-1, RC-2 e RC-3.  
**Ajustes de precisão:** RC-4 e RC-6.  
**Correção necessária fora do PRD:** RC-5 em `state-machines.md`.
