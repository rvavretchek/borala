---
stepsCompleted:
  - step-01-document-discovery
  - step-02-prd-analysis
  - step-03-epic-coverage-validation
  - step-04-ux-alignment
  - step-05-epic-quality-review
  - step-06-final-assessment
inputDocuments:
  - prds/prd-borala-2026-08-06/prd.md
  - prds/prd-borala-2026-08-06/addendum.md
  - architecture/architecture-borala-2026-08-07/ARCHITECTURE-SPINE.md
  - architecture/architecture-borala-2026-08-07/SOLUTION-DESIGN.md
  - architecture/architecture-borala-2026-08-07/UML.md
  - epics.md
  - ux-designs/ux-borala-2026-08-06/DESIGN.md
  - ux-designs/ux-borala-2026-08-06/EXPERIENCE.md
---

# Relatório de Avaliação da Prontidão para Implementação

**Data:** 10/08/2026
**Projeto:** Bora Lá

## Inventário de documentos

### PRD

- `prds/prd-borala-2026-08-06/prd.md`
- `prds/prd-borala-2026-08-06/addendum.md`

### Arquitetura

- `architecture/architecture-borala-2026-08-07/ARCHITECTURE-SPINE.md`
- `architecture/architecture-borala-2026-08-07/SOLUTION-DESIGN.md`
- `architecture/architecture-borala-2026-08-07/UML.md`

### Epics e Stories

- `epics.md`

### UX

- `ux-designs/ux-borala-2026-08-06/DESIGN.md`
- `ux-designs/ux-borala-2026-08-06/EXPERIENCE.md`

### Resultado da descoberta

Todos os tipos documentais obrigatórios foram encontrados. Não há duplicidade entre documentos integrais e versões fragmentadas com `index.md`. Revisões, reconciliações e memórias de trabalho permanecem como evidências auxiliares e não substituem as fontes normativas acima.

## Análise do PRD

### Requisitos funcionais

FR1: A pessoa deve comprovar uma Identidade Verificada e escolher um Nick antes de criar um Rolê. A criação não pode ser concluída sem ambos, e os dados da credencial não podem aparecer em visões públicas ou de participantes.

FR2: Qualquer pessoa com um Convite Operacional pode ver nome, Data, Horário Aproximado, Local quando definido e o agregado permitido. A prévia não mostra Nicks, respostas individuais, autoria, histórico ou contatos, e o cancelamento vigente precede informações antigas.

FR3: Uma pessoa pode comprovar uma Identidade Verificada, escolher Nick não usado no Rolê e acessar detalhes e ações permitidas. A mesma credencial recupera a identidade em outro aparelho; a correção do Nick preserva valor anterior, autoria e momento.

FR4: A Pessoa Criadora pode escolher `Primeiro, quem topa` ou `Já tenho um local`, informar Data e Horário Aproximado e aceitar ou editar o nome sugerido. Cada criação produz `eventId` e Convite únicos; começar por local cria a primeira Opção com as mesmas regras das demais.

FR5: Qualquer Pessoa Convidada pode gerar mensagem pronta e abrir o compartilhamento nativo. A mensagem sempre contém o Convite vivo, não é publicada automaticamente e nunca prevalece sobre o estado vigente.

FR6: Uma Pessoa Convidada pode registrar e alterar sua disposição geral enquanto não há Local definido. Interesse Geral permanece separado de Respostas e não escolhe Opção.

FR7: Uma Pessoa Convidada pode criar Opção com nome, endereço ou referência e zero ou mais URLs. Os valores originais são congelados com autoria e momento; possível duplicidade gera aviso não bloqueante.

FR8: Uma Pessoa Convidada pode corrigir ou complementar nome, endereço e URLs de uma Opção. Originais e valores substituídos permanecem no histórico com autoria e momento, e acrescentar URL não invalida as anteriores.

FR9: Qualquer Pessoa Convidada pode inativar ou reativar uma Opção durante a Organização. A Opção nunca é excluída, conserva Respostas e histórico, precisa estar ativa para ser escolhida e fica fechada após a definição do Local.

FR10: Uma Pessoa Convidada pode manter uma Resposta atual por Opção entre `Topo`, `Tudo bem`, `Não tenho certeza` e `Não vou nesse`. `Topo` mostra Nick e contagem; as demais somente contagem; trocas são atômicas e silêncio não é resposta.

FR11: Respostas permanecem editáveis durante a Organização e, após a definição, somente até o Horário Aproximado. A passagem desse horário não encerra uma Organização ainda indefinida.

FR12: Qualquer Pessoa Convidada pode declarar `Vai ter rolê` sem definir Local. A declaração mostra Nick e momento, não usa quórum, maioria, ranking ou conversão de Respostas e mantém Opções abertas.

FR13: Qualquer Pessoa Convidada pode declarar uma Opção ativa como Local. A declaração mostra Nick e momento, fecha todas as Opções, trata repetição idêntica como idempotente e não exige confirmação adicional do sistema.

FR14: O sistema deve detectar declarações incompatíveis sobre a mesma versão. A primeira confirmação permanece, a tentativa conflitante não sobrescreve o estado e o conflito fica visível com autorias sem inferir legitimidade.

FR15: Uma Pessoa Convidada pode corrigir conscientemente o Local registrado quando ele não reflete a decisão social. A correção preserva `eventId`, Data, histórico e autorias e é explicitamente distinta de criar Outro Rolê.

FR16: Quando Local ou Data realmente mudarem, uma Pessoa Convidada pode iniciar Outro Rolê. O novo encontro recebe `eventId` e Convite próprios, não herda Interesse ou Respostas e substitui atomicamente o anterior, cujo Convite aponta primeiro para o vigente.

FR17: A Pessoa Criadora pode escolher `Depois do expediente` sem hora visível ou uma hora exibida como `Por volta das HHh`. A referência móvel usa o fuso do Rolê, inicia em 18h, avança duas horas à frente em passos de 30 minutos a partir de 16h30, pode cruzar meia-noite sem mudar a Data social, limita-se a 03h e congela ao definir o Local.

FR18: Uma Pessoa Convidada pode alterar o Horário Aproximado na mesma Data somente quando `currentTime <= approximateStart - 1h`. Alterar a Data oferece Outro Rolê.

FR19: Até o Limite Final, uma Pessoa Convidada pode consultar Local, endereço vigente, URLs e abrir rota externa. Cancelamento precede endereço e rota, e o histórico não substitui valores vigentes.

FR20: Qualquer Pessoa Convidada pode escolher Limite Final posterior ao vigente e até 07h enquanto o Convite estiver operacional. Extensões concorrentes são monotônicas, ficam autoradas e não reabrem janelas encerradas.

FR21: Depois do Limite Final, o Convite informa apenas que o Rolê terminou. Nicks, Respostas, Local, URLs, autorias e histórico deixam de ser acessíveis, sem recuperação ou reaproveitamento no MVP.

FR22: Qualquer Pessoa Convidada pode cancelar o Rolê antes ou durante sua realização. O cancelamento registra Nick e momento, tem precedência visual, é terminal e bloqueia novas mutações sem apagar o registro antes do Limite Final.

**Total de requisitos funcionais:** 22.

### Requisitos não funcionais

NFR1 — Privacidade: credenciais e contatos de autenticação nunca podem ser expostos por interface, compartilhamento, URL, telemetria ou resposta de API destinada a clientes.

NFR2 — Autorização: toda mutação deve validar no servidor uma Identidade Verificada vinculada ao Rolê; qualquer Pessoa Convidada pode estender o Limite Final dentro das regras funcionais.

NFR3 — Concorrência: respostas, declarações, correções, inativações e cancelamento devem ser atômicos, detectar versão obsoleta e impedir sobrescrita silenciosa.

NFR4 — Auditabilidade: mutações relevantes devem registrar identidade interna, Nick contextual, instante e valores anterior e posterior quando aplicável.

NFR5 — Acessibilidade: fluxos essenciais devem atender WCAG 2.2 AA, não depender somente de cor e ser operáveis por teclado.

NFR6 — Desempenho percebido: em 4G móvel estável, prévia pública e plano vigente devem apresentar o conteúdo principal em até 2,5 segundos no percentil 75.

NFR7 — Confiabilidade: uma ação confirmada deve reaparecer após recarregar o Convite; falhas preservam o estado anterior e permitem nova tentativa sem duplicidade.

NFR8 — Localização temporal: Data, Horário Aproximado e Limite Final usam fuso persistido e permanecem corretos em mudança de dia.

NFR9 — Expiração e minimização: o acesso público detalhado cessa imediatamente após o Limite Final; a retenção técnica interna deve ser definida antes da produção.

NFR10 — Linguagem: interface e documentação usam Português do Brasil e o vocabulário do PRD.

**Total de requisitos não funcionais:** 10.

### Requisitos e restrições adicionais

- A Constituição prevalece sobre decisões de implementação; a aposta normativa é organizar sem governar.
- O MVP não inclui chat, votação formal, ranking, quórum, mapas embutidos, reservas, pagamentos, moderação, grupos persistentes ou memória pós-evento.
- Desenvolvimento segue orientação a objetos, Clean Code, Object Calisthenics, SOLID, Lei de Demeter, encapsulamento, composição sobre herança e TDD vermelho-verde-refatoração.
- React é obrigatório no frontend; Cypress é o padrão E2E; bibliotecas TanStack exigem benefício demonstrável.
- `eventId` difere da identidade social Local + Data; credencial privada difere do Nick contextual; mensagens compartilhadas não governam o Convite vivo.
- Estados coletivos exigem concorrência, idempotência, transações atômicas e auditoria; valores originais de Opção são imutáveis e suas revisões posteriores.
- As métricas SM1–SM5 medem influência percebida, conclusão ponta a ponta, compreensão, atrito inicial e continuidade do canal social. Quantidade de respostas, decisão acelerada e retenção artificial são contramétricas explícitas.
- OQ1, OQ2 e OQ3 exigiam decisões de autenticação, retenção e backend antes da implementação/produção; devem ser conferidas contra a arquitetura. OQ4, sobre pesquisa sem coleta de presença, é exigida antes do piloto.

### Avaliação inicial da completude do PRD

O PRD possui escopo, jornadas, glossário, 22 FRs testáveis, 10 NFRs mensuráveis, não objetivos, métricas e guardrails. As questões técnicas originalmente bloqueantes estão encaminhadas para validação contra a arquitetura. Há um ponto semântico que exige rastreabilidade cuidadosa nas etapas seguintes: o PRD descreve o agregado público como `Topo + Tudo bem`, enquanto documentos posteriores podem ter refinado sua fonte para Interesse Geral; a avaliação deve confirmar se a adjudicação foi incorporada de modo consistente em requisitos, UX, arquitetura e histórias.

## Validação de cobertura dos Epics

### Matriz de cobertura

| FR | Requisito do PRD | Cobertura principal | Situação |
|---|---|---|---|
| FR1 | Identidade Verificada e Nick antes da criação | Epic 1, Histórias 1.2–1.4 e 1.7 | Coberto |
| FR2 | Prévia pública minimizada do Convite | Epic 1, História 1.6 | Coberto |
| FR3 | Entrada, recuperação de identidade e correção de Nick | Epic 1, Histórias 1.2, 1.3, 1.7 e 1.8 | Coberto |
| FR4 | Criação pelos dois pontos de partida | Epic 1, Histórias 1.4 e 1.5 | Coberto |
| FR5 | Compartilhamento manual do Convite vivo | Epic 1, História 1.9 | Coberto |
| FR6 | Interesse Geral independente | Epic 2, História 2.1 | Coberto |
| FR7 | Criação manual de Opção | Epic 2, História 2.2; fundação na 1.5 | Coberto |
| FR8 | Correção ou complemento de Opção | Epic 2, História 2.3 | Coberto |
| FR9 | Inativação, reativação e fechamento | Epic 2, História 2.4 | Coberto |
| FR10 | Quatro Respostas por Opção | Epic 2, História 2.5 | Coberto |
| FR11 | Janela temporal das Respostas | Epic 3, História 3.3 | Coberto |
| FR12 | Declaração de que haverá Rolê | Epic 3, História 3.1 | Coberto |
| FR13 | Definição do Local | Epic 3, História 3.2 | Coberto |
| FR14 | Declarações concorrentes e conflito | Epic 3, História 3.4 | Coberto |
| FR15 | Correção factual do Local declarado | Epic 3, História 3.5 | Coberto |
| FR16 | Criação e vínculo de Outro Rolê | Epic 3, História 3.6 | Coberto |
| FR17 | Horário Aproximado e referência móvel | Epic 1, Histórias 1.4 e 1.6; Epic 3, História 3.2 | Coberto |
| FR18 | Alteração do Horário Aproximado | Epic 4, História 4.1 | Coberto |
| FR19 | Consulta do plano e rota externa | Epic 4, História 4.2 | Coberto |
| FR20 | Extensão monotônica do Limite Final | Epic 4, História 4.3 | Coberto |
| FR21 | Encerramento e minimização | Epic 4, História 4.4 | Coberto |
| FR22 | Cancelamento terminal | Epic 4, História 4.5 | Coberto |

### Requisitos ausentes

Nenhum requisito funcional do PRD está ausente dos Epics e Stories. Também não há FR numerado no artefato de Epics sem correspondente no PRD.

### Estatísticas de cobertura

- Total de FRs no PRD: 22.
- FRs cobertos nos Epics: 22.
- Cobertura: 100%.

## Avaliação de alinhamento de UX

### Situação da documentação de UX

UX documentada e finalizada em `DESIGN.md` e `EXPERIENCE.md`, com quatro mocks promovidos e precedência normativa explícita dos spines sobre referências visuais.

### Alinhamentos confirmados

- As jornadas UJ1–UJ6 do PRD possuem fluxos correspondentes na UX.
- Os dois pontos de partida recebem o mesmo peso, e Pessoa Criadora não ganha autoridade adicional.
- Interesse Geral, Respostas, Declarações e contagens permanecem separados, sem ranking, quórum ou decisão automática.
- A arquitetura sustenta DTOs distintos por audiência e estado, minimização pós-limite, `no-store`, `no-referrer`, revalidação em BFCache/foreground e ausência de dados protegidos no storage.
- Ordem de Opções, quatro Respostas equivalentes, Nick somente em `Topo`, histórico factual, conflitos, Correção × Outro Rolê e precedência terminal estão refletidos na arquitetura e nas histórias.
- Web Share, fallback de cópia, rota externa com aviso e `noopener noreferrer` possuem suporte arquitetural.
- SSR, projeções limitadas, gate Lighthouse p75 ≤2,5s, WCAG 2.2 AA, reflow a 320 CSS px, zoom de 400%, foco e anúncios acessíveis estão contemplados.

### Problemas de alinhamento

#### UX-AL-1 — Alta — Método de autenticação contraditório

`EXPERIENCE.md > Foundation` define “somente código de uso único por e-mail” e sua arquitetura de informação descreve `e-mail → código único → Nick`. A decisão arquitetural vigente define mensagem com botão/link de continuidade e código alternativo e declara que fluxo exclusivamente por código não pertence ao MVP. As Histórias 1.2 e 1.3 seguem a arquitetura, não o texto da UX.

**Impacto:** implementação fiel à UX eliminaria o link; implementação fiel à arquitetura contrariaria o fluxo normativo de experiência.

**Recomendação:** atualizar `EXPERIENCE.md` para “link de continuidade com código alternativo por e-mail”, refletindo ambos os caminhos no `identity-gate`, estados e UJ1/UJ2.

#### UX-AL-2 — Alta — Fonte e frase do agregado público divergem

PRD e UX apresentam o agregado como pessoas que marcaram `Topo ou Tudo bem`, enquanto `ARCHITECTURE-SPINE.md` e `SOLUTION-DESIGN.md` determinam `COUNT(DISTINCT participant_id)` apenas para `GeneralInterest.INTERESTED`; `VenueResponse` nunca alimenta esse total. A UX não define um rótulo de Interesse Geral que torne verdadeira a frase “marcaram Topo ou Tudo bem”. As Histórias 1.6 e 2.1 preservam simultaneamente as duas regras incompatíveis.

**Impacto:** equipes podem calcular por Respostas de Opção, contrariando a arquitetura, ou exibir uma frase semanticamente falsa para um valor de Interesse Geral.

**Recomendação:** obter uma decisão única de microcopy e canonizá-la. Mantida a fonte arquitetural, usar frase factual associada ao Interesse Geral, por exemplo `{N} pessoas marcaram Tô a fim`, e atualizar PRD, DESIGN, EXPERIENCE, mock promovido e História 1.6.

### Avisos

- A tabela de rastreabilidade compacta da UX associa NFR7–NFR8 a mensagens, sessão, compartilhamento e rota, embora no PRD esses IDs sejam Confiabilidade e Localização temporal. A cobertura comportamental existe em outras seções, mas a linha deve ser corrigida para evitar rastreabilidade enganosa.
- As demais lacunas visuais são cobertas por contratos spine-only; não há componente exigido pela UX sem suporte arquitetural identificado.

## Revisão de qualidade dos Epics e Stories

### Estrutura dos Epics

- Os quatro Epics possuem títulos e objetivos orientados a resultados de pessoas usuárias.
- Epic 1 entrega criação e compartilhamento de forma independente; Epic 2 funciona sobre o Epic 1; Epic 3 usa as Opções e Respostas já entregues; Epic 4 completa o ciclo operacional.
- Não há dependência reversa entre Epics nem Epic exclusivamente técnico.
- A sobreposição em módulos centrais é justificada por incrementos demonstráveis e checkpoints de feedback explícitos.
- A História 1.1 atende ao Structural Seed exigido, configura SSR, stack, CI e acessibilidade sem criar antecipadamente tabelas de domínio.
- As histórias orientam criação progressiva de entidades quando surge o primeiro consumidor.
- Todas as 27 histórias usam `Dado`/`Quando`/`Então`/`E` em Português do Brasil e mantêm rastreabilidade.

### Violações críticas

#### EPQ-1 — Crítica — História 4.7 possui escopo maior que uma sessão de desenvolvimento

A História 4.7 reúne pelo menos quatro entregas independentes e de alto risco: imagem/runtime rootless, TLS MySQL fail-closed, implantação blue-green com migrations e backup/restauração cifrados. Cada uma exige implementação, ambiente, testes de falha e revisão próprios.

**Remediação:** dividir em histórias sequenciais, por exemplo: runtime OCI/Quadlet; TLS/readiness; deploy blue-green/expand-contract; backup e restauração. Cada história deve terminar com evidência operacional executável.

### Problemas maiores

#### EPQ-2 — História 1.6 antecipa estados de Epics futuros

Seus critérios exigem projeção e testes para Cancelado, Substituído e Encerrado antes das histórias que criam essas transições. Isso induz enums, DTOs e testes sem consumidor corrente.

**Remediação:** limitar a História 1.6 aos estados alcançáveis no Epic 1 e acrescentar os contratos públicos de cada estado na primeira história que efetivamente o produz.

#### EPQ-3 — História 1.9 antecipa compartilhamento de estados futuros

A história exige mensagens para cancelamento, substituição e encerramento ainda inexistentes. Isso viola a regra de não depender de histórias futuras.

**Remediação:** entregar compartilhamento dos estados do Epic 1 e estender o mesmo componente nas histórias 3.6, 4.4 e 4.5.

#### EPQ-4 — Histórias 2.4 e 2.5 dependem do fechamento futuro do Local

A História 2.4 testa tentativa após Local definido; a 2.5 testa concorrência com fechamento da Opção. A definição do Local só existe na História 3.2.

**Remediação:** no Epic 2, cobrir apenas ativa/inativa e concorrência entre Resposta e inativação. Transferir fechamento, bloqueio posterior e disputa com `SelectVenue` para a História 3.2.

#### EPQ-5 — Ordem do Epic 4 cria dependências futuras em cancelamento

As Histórias 4.2, 4.3 e 4.4 exigem comportamento de Rolê cancelado antes da implementação do cancelamento na História 4.5.

**Remediação:** mover “Cancelar o Rolê” para antes das histórias que testam esse estado ou retirar delas os critérios de cancelamento e incorporá-los na História 4.5. A segunda opção reduz churn e preserva a sequência por capacidade.

#### EPQ-6 — Histórias 1.2 e 1.3 apresentam risco alto de tamanho

A História 1.2 combina UI, persistência de challenge, HMAC de e-mail, vários rate limits, integração Resend e estados ambíguos de entrega. A História 1.3 combina dois métodos de consumo, concorrência de Identity, sessão, cookie, intenção preservada e rotação de chaves.

**Remediação:** antes do Sprint Planning, confirmar que cada história cabe em um contexto de implementação. Se não couber, dividi-las em fatias verticais que mantenham um fluxo executável, evitando divisão por camada técnica.

### Preocupações menores

- A História 1.3 diz que “logout futuro deve poder revogar” a sessão; o critério não é diretamente verificável nesta história. Substituir por capacidade server-side testável de revogação, sem prometer uma interface futura.
- A História 1.5 inclui alerta de duplicidade na criação da primeira e única Opção; o cenário só ganha utilidade quando já existem outras Opções. Manter apenas a política compartilhada ou transferir o teste efetivo para 2.2.
- A História 4.6 exige retenção de backups cuja implementação aparece somente em 4.7. Transferir esse critério para a história de backup após a decomposição de EPQ-1.

### Conformidade geral

| Critério | Resultado |
|---|---|
| Epics entregam valor | Aprovado |
| Independência entre Epics | Aprovado |
| Critérios BDD testáveis | Aprovado com ressalvas acima |
| Ausência de dependências futuras | Reprovado |
| Tamanho adequado das Stories | Reprovado para 4.7; risco em 1.2 e 1.3 |
| Criação progressiva de entidades | Aprovado |
| Starter/Structural Seed | Aprovado |
| Rastreabilidade | Aprovado |

## Resumo e recomendações

### Situação geral de prontidão

**NÃO PRONTO PARA IMPLEMENTAÇÃO.**

A documentação possui excelente cobertura funcional e uma base arquitetural forte, mas ainda contém contradições normativas capazes de produzir implementações diferentes e uma decomposição de Stories com dependências futuras e uma unidade crítica superdimensionada.

### Problemas críticos que exigem ação imediata

1. **Decompor a História 4.7.** Runtime, TLS/readiness, deploy blue-green e backup/restauração precisam ser histórias implementáveis e verificáveis separadamente.
2. **Canonizar a fonte e a frase do agregado público.** A arquitetura calcula `GeneralInterest.INTERESTED`, enquanto PRD/UX dizem que as pessoas marcaram `Topo ou Tudo bem`.
3. **Alinhar o método de autenticação.** UX diz fluxo exclusivo por código; arquitetura e Stories exigem botão/link de continuidade com código alternativo.
4. **Remover dependências futuras.** Estados ainda não implementados aparecem como critérios obrigatórios nas Histórias 1.6, 1.9, 2.4, 2.5, 4.2, 4.3 e 4.4.

### Próximos passos recomendados

1. Executar `bmad-correct-course` para registrar a mudança controlada sem editar isoladamente apenas um artefato.
2. Atualizar PRD, UX, arquitetura e Epics/Stories de forma atômica para as duas decisões normativas.
3. Reordenar ou redistribuir critérios de estados futuros para a primeira Story que produz cada estado.
4. Dividir 4.7 e revisar o tamanho de 1.2 e 1.3 em fatias verticais executáveis.
5. Corrigir a rastreabilidade NFR7–NFR8 de `EXPERIENCE.md` e os três critérios menores apontados.
6. Executar novamente `[IR]`; somente após resultado `PRONTO`, seguir para `[SP] Sprint Planning`.

### Nota final

Esta avaliação identificou 12 itens em duas categorias principais: três achados de alinhamento UX/arquitetura e nove achados de qualidade/dependência das Stories. Um é crítico, sete são altos/maiores e quatro são menores ou de manutenção. A cobertura de FRs é 100%, e OQ4 permanece uma atividade pré-piloto, não um bloqueio para iniciar desenvolvimento após as correções acima.

**Avaliador:** Codex, workflow BMad Implementation Readiness

**Data:** 10/08/2026
