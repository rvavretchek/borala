---
name: Reconciliação de cobertura — arquitetura do Bora Lá
type: architecture-reconciliation
status: complete
created: '2026-08-07'
reviewer: coverage
scope:
  - ../ARCHITECTURE-SPINE.md
  - ../SOLUTION-DESIGN.md
  - ../UML.md
sources:
  - ../../../../../specs/spec-borala-mvp/SPEC.md
  - ../../../../../specs/spec-borala-mvp/mvp-rules.md
  - ../../../../../specs/spec-borala-mvp/state-machines.md
  - ../../../prds/prd-borala-2026-08-06/prd.md
  - ../../../ux-designs/ux-borala-2026-08-06/EXPERIENCE.md
  - ../../../ux-designs/ux-borala-2026-08-06/DESIGN.md
---

# Reconciliação de cobertura

## Resultado

A arquitetura cobre a espinha das onze capacidades e os dez requisitos não funcionais, inclusive privacidade por audiência, concorrência com MySQL real, acessibilidade, retenção e limites explícitos do MVP. Ela ainda não está pronta para ser usada sem interpretação pelos agentes: há **6 achados altos** e **7 médios**. Três semânticas de produto exigem decisão humana; os demais achados admitem correção documental objetiva.

Severidades usadas:

- **Alta:** pode produzir comportamento contrário ao contrato, vazamento de detalhe terminal ou bloqueio de uma jornada essencial.
- **Média:** deixa uma parte obrigatória subespecificada ou cria divergência capaz de confundir implementação e testes.

## Matriz de cobertura

| Capacidade | Situação | Evidência principal | Lacuna associada |
|---|---|---|---|
| CAP-1 — identidade privada | Parcial | Spine AD-8 a AD-10; Solution 6 e 7 | Correção auditada de Nick não possui comando explícito (COV-08). |
| CAP-2 — criação por dois começos | Parcial | Spine mapa CAP-2; Solution `CreateOuting` | Não há rota POST de criação e o envelope não acomoda criação (COV-02). |
| CAP-3 — Convite progressivo | Parcial | Spine AD-10/AD-11; Solution 7 | Fórmula do agregado público não está definida (COV-04). |
| CAP-4 — Interesse e Respostas | Parcial | Solution `SetGeneralInterest`/`SetVenueResponse`; UML `Participant`/`VenueResponse` | Valores de Interesse Geral e relação com o agregado público estão indefinidos (COV-05). |
| CAP-5 — Opções e histórico | Parcial | Spine AD-7/AD-14; Solution 8 e 11 | Alerta obrigatório de possível duplicidade não tem contrato (COV-07). |
| CAP-6 — Declarações iguais | Parcial | Spine AD-1/AD-6/AD-7; Solution 9 | Persistência e projeção do conflito com ambas as autorias estão ambíguas (COV-03). |
| CAP-7 — correção/substituição | Parcial por divergência de fonte | Spine AD-14; Solution 8; UML 7 | UX aprovada e PRD/SPEC ainda usam contratos incompatíveis para correção de Local declarado (COV-09). |
| CAP-8 — tempo aproximado | Parcial | Spine AD-12/AD-13; Solution 10 | Limite Final de horário explícito anterior a 18h está aberto; derivação de `IN_PROGRESS` precisa de guarda (COV-06 e COV-11). |
| CAP-9 — cancelamento | Coberta | Spine AD-15; Solution `CancelOuting`; retenção preserva a âncora temporal | Sem lacuna própria. |
| CAP-10 — consulta e redistribuição | Parcial | Spine mapa CAP-10; Solution DTO identificado | Contrato de compartilhamento/rota externa está implícito (COV-10). |
| CAP-11 — encerramento | Parcial e inconsistente | Spine AD-11/AD-15; Solution estados/projeções; UML 4/10 | Precedência pode expor substituição depois do Limite Final (COV-01). |

## Achados acionáveis

### COV-01 — Alta — O hard gate do Limite Final conflita com a precedência terminal

**Evidência normativa:** SPEC CAP-11, `mvp-rules.md` > Tempo e PRD FR-21 exigem que, depois do Limite Final, o Convite mostre apenas `Este Rolê terminou.`, sem local, nomes, histórico ou reaproveitamento.

**Evidência arquitetural:** Spine AD-11 repete corretamente o hard gate, mas AD-15 ordena `Cancelled → Replaced → Ended`; Solution 7.1 admite `link do replacement` no DTO público; UX Experience também lista Substituído antes de Encerrado. Lida literalmente, a precedência torna um Rolê substituído permanentemente `Replaced` e pode continuar revelando o novo Convite depois de `finalLimit`.

**Ação:** tornar `Clock >= finalLimit` uma guarda anterior a qualquer projeção, devolvendo somente a visão encerrada. Aplicar Cancelado/Substituído/Em andamento/... apenas enquanto `Clock < finalLimit`. Remover `replacement link` de qualquer DTO após o limite e testar Rolês cancelados e substituídos atravessando a borda.

### COV-02 — Alta — A jornada de criação não fecha no contrato web e conflita com a autorização global

**Evidência normativa:** CAP-2 e PRD FR-1/FR-4 exigem criar pelos dois começos depois de autenticar e escolher Nick.

**Evidência arquitetural:** Solution 5.1 possui somente `GET /` para “entrada e criação”; nenhuma rota POST executa `CreateOuting`. Solution 5.2 exige `expectedVersion` em todo POST de negócio, embora uma criação ainda não possua versão. Spine AD-18 exige sessão **e participação** em “toda mutação”, mas `CreateOuting` cria a primeira participação e `POST .../join` cria participação existente no Rolê; ambos ficariam impossíveis.

**Ação:** incluir uma rota de criação explícita, por exemplo `POST /outings`; separar envelopes `CreateCommand` (sem versão) e `VersionedCommand`; e limitar a exigência de Participant às mutações de Rolê que pressupõem participação. Autenticação, criação e ingresso precisam de guards próprios e explícitos.

### COV-03 — Alta — Conflito de declaração pode não deixar a evidência visível exigida

**Evidência normativa:** PRD FR-14 exige conflito visível “com autorias”; a máquina de concorrência informa a divergência aos dois participantes; NFR-4 exige autoria para Declarações.

**Evidência arquitetural:** Solution 9.2 diz que a declaração diferente sobre versão obsoleta “retorna conflito sem escrita substitutiva”; UML 6 diz “registra resultado idempotente ou rejeita conflito estável”. Não está definido se a tentativa incompatível é persistida, como ambas as autorias chegam à projeção nem se o conflito sobrevive ao reload.

**Ação:** definir um registro append-only de tentativa conflitante, na mesma transação do receipt, contendo autor contextual, alvo tentado, versão observada, declaração vigente e instante, sem modificar o Local vigente. Definir DTO e teste de reload que mostrem as duas autorias sem transformar a ordem técnica em legitimidade social.

### COV-04 — Alta — O agregado público `Topo + Tudo bem` não possui fórmula entre múltiplas Opções

**Evidência normativa:** CAP-3, `mvp-rules.md` > Identidade e visibilidade e PRD FR-2 chamam o valor de total agregado de `Topo + Tudo bem`; CAP-4 permite uma Resposta independente por Opção. UX exige a frase `7 pessoas marcaram Topo ou Tudo bem`.

**Evidência arquitetural:** Solution 7.1 apenas inclui o total; não define se soma respostas, conta pessoas distintas em qualquer Opção, usa somente a Opção escolhida ou usa Interesse Geral. Somar linhas pode contar uma pessoa várias vezes e contradizer a palavra “pessoas”.

**Ação:** após decisão humana, registrar uma função de projeção única para Organização e para Rolê Definido, com deduplicação e comportamento para zero Opções, opção inativa/fechada e troca de Resposta. Cobrir a consulta com MySQL real.

### COV-05 — Alta — Interesse Geral não tem domínio de valores nem transições definidos

**Evidência normativa:** CAP-4 e PRD FR-6 exigem registrar e alterar a disposição geral, separada de Respostas; a UX determina que ela seja contexto separado, não cabeçalho legitimador nem os botões removidos do box de contagem.

**Evidência arquitetural:** `SetGeneralInterest` e `general_interests` existem, mas `GeneralInterest` não possui enumeração, nulabilidade, remoção, projeção, autoria ou relação explícita com o agregado público. UML o representa como um campo simples de Participant.

**Ação:** após decisão humana, definir value object e transições completas (`unset` inclusive, se aplicável), período editável, projeção identificada e independência explícita de `VenueResponse` e da Declaração.

### COV-06 — Alta — O Limite Final de um horário explícito anterior a 18h bloqueia `FinalLimitPolicy`

**Evidência normativa:** SPEC e PRD FR-20 só fixam 03h para Rolê noturno iniciado após 18h. Não há padrão para `Por volta das HHh` anterior a 18h.

**Evidência arquitetural:** Solution 10.3 reconhece corretamente a lacuna, mas Outing, retenção, estados terminais e CAP-11 dependem de `finalLimit` desde a criação.

**Ação:** obter decisão humana e transformá-la em regra testável, incluindo mudança de Data, limite máximo de extensão e retenção. Não finalizar `FinalLimitPolicy` enquanto estiver aberta.

### COV-07 — Média — Alerta de possível duplicidade não tem contrato arquitetural

**Evidência normativa:** CAP-5, PRD FR-7/UJ-3 e `mvp-rules.md` exigem alerta por similaridade de nome/rua/número próximo ou URL idêntica e proíbem bloqueio.

**Evidência arquitetural:** `CreateVenueOption` apenas congela o original; não há port/policy, normalização, resposta de warning ou teste citado.

**Ação:** definir `DuplicateVenueHintPolicy` determinística, limitada às Opções do mesmo Rolê, e retorno não bloqueante que sempre permita confirmar a criação. Fixar exemplos de nome, rua/número e URL idêntica; não introduzir busca externa nem fusão automática.

### COV-08 — Média — Correção auditada de Nick não aparece como comando

**Evidência normativa:** PRD FR-3 e `mvp-rules.md` exigem Correção de Nick com valor anterior, autoria e momento.

**Evidência arquitetural:** existe `participant_name_revisions`, mas Solution 8.2 não possui `ChangeDisplayName`; a rota genérica não documenta pré-condições ou conflito de unicidade. UML não representa a revisão.

**Ação:** acrescentar comando, constraint e política de concorrência para troca de Nick; gravar revisão + Participant + AuditEvent atomicamente e cobrir colisão e reload.

### COV-09 — Média — Fontes canônicas ainda divergem sobre mudar o Local depois da definição

**Evidência:** PRD FR-15 e `state-machines.md` ainda permitem corrigir o Local declarado mantendo o mesmo Rolê. A UX aprovada determina que, depois da definição, `Editar detalhes` altera somente nome/endereço/URLs e mudança efetiva de Local ou Data usa `Criar Outro Rolê`. Spine AD-14, Solution 8 e UML 7 implementam a decisão mais recente.

**Ação:** não reabrir a decisão já aprovada; atualizar PRD/SPEC companions ou registrar formalmente a supersessão para que agentes não implementem `CorrectSelectedVenue` com base no contrato ainda normativo.

### COV-10 — Média — Compartilhamento e rota externa estão cobertos apenas por intenção

**Evidência normativa:** PRD FR-5/FR-19 e UX `share-control`/`external-route-control` exigem gesto explícito, mensagem com Convite vivo, fallback de cópia, aviso de transmissão do endereço e `noopener noreferrer`.

**Evidência arquitetural:** o mapa CAP-3/CAP-10 cita compartilhamento manual e rota externa, mas Solution não fixa esses contratos de borda nem os inclui nos cenários de teste.

**Ação:** documentar `Web Share API` com fallback de cópia sem leitura do clipboard, mensagem sempre contendo o link vivo, allowlist de provedores de rota ou construção segura de URL, aviso antes de transmitir o endereço e `noopener noreferrer`. Não persistir a mensagem compartilhada.

### COV-11 — Média — `IN_PROGRESS` derivado precisa depender de Rolê definido

**Evidência normativa:** `state-machines.md` permite `Defined → InProgress`; PRD FR-11 diz que a passagem do Horário Aproximado não encerra uma Organização indefinida.

**Evidência arquitetural:** Solution 8.1 diz apenas que `IN_PROGRESS` deriva de estado persistido + Clock. Sem guarda explícita, `ORGANIZING` ou `OCCURRENCE_DECLARED` pode ser projetado incorretamente como Em andamento quando o horário passa.

**Ação:** definir `IN_PROGRESS = persistedState == DEFINED && now >= approximateStart && now < finalLimit`. Um Rolê indefinido continua Organização/Ocorrência declarada até a regra terminal aplicável.

### COV-12 — Média — O diagrama de estados contradiz o modelo textual

**Evidência arquitetural:** UML 4 reduz o Rolê a `Open`/`VenueSelected`, omite `OccurrenceDeclared` e `InProgress`, permite `Open → Replaced`, embora Solution 8.2 limite replacement ao Definido, e usa `Closed` onde os documentos usam `Ended`.

**Ação:** substituir o diagrama pela máquina canônica com `Organizing`, `OccurrenceDeclared`, `Defined`, `InProgress`, `Cancelled`, `Replaced` e `Ended`; modelar `InProgress`/`Ended` como projeções temporais ou anotar essa distinção. Remover replacement antes da definição. No UML 5, alinhar ainda `GET /i/:inviteToken` com `/r/:inviteToken` do Spine/Solution.

### COV-13 — Média — Gates não enumeram alguns cenários obrigatórios

**Evidência:** Solution 16 cobre UJ-1 a UJ-6, concorrência e bordas de tempo, mas UJ-1 não exercita o segundo começo `Já tenho um local`; retenção/purge, fórmula do agregado, alerta de duplicidade, correção de Nick, compartilhamento/rota e todos os estados atravessando o Limite Final não aparecem como gates explícitos.

**Ação:** acrescentar matriz FR-1..FR-22/NFR-1..NFR-10 → nível de teste. Tornar obrigatórios os dois começos, purge idempotente em lotes e bordas de retenção, privacidade de DTO, aggregate count, warning não bloqueante, autoria/reload, terminalidade e acessibilidade dos fluxos spine-only.

## Requisitos não funcionais

| Requisito | Situação | Observação |
|---|---|---|
| NFR-1 Privacidade | Coberto | DTOs separados, no-store/no-referrer e logs allowlist; COV-01 precisa fechar o vazamento temporal. |
| NFR-2 Autorização | Parcial | Validação server-side existe, mas AD-18 precisa distinguir criação/ingresso das mutações que já exigem Participant. |
| NFR-3 Concorrência | Coberto com lacuna | Locks, versões e testes reais estão definidos; falta tornar o conflito visível persistente (COV-03). |
| NFR-4 Auditabilidade | Parcial | Audit atômico e snapshots existem; Nick e tentativa concorrente precisam de contrato explícito. |
| NFR-5 Acessibilidade | Coberto | WCAG 2.2 AA, teclado, foco, reflow 320 px, zoom 400%, contraste e axe estão como gate. |
| NFR-6 Desempenho | Coberto | Meta 2,5s p75 em 4G, SSR e métricas p50/p75/p95 estão definidos. |
| NFR-7 Confiabilidade | Coberto | Commit antes de sucesso, receipts e retry idempotente estão definidos. |
| NFR-8 Tempo | Parcial | IANA/UTC/Temporal e bordas estão definidos; COV-06 ainda impede política completa. |
| NFR-9 Expiração | Parcial | Hard gate e retenção foram decididos; a precedência de COV-01 precisa ser corrigida. |
| NFR-10 Linguagem | Coberto | Documentos em pt-BR e identificadores em inglês. |

## Retenção, autoria, acessibilidade e limites do MVP

- **Retenção:** coberta por hard-delete de Outing/Audit 30 dias após `FinalLimit`, credenciais efêmeras em até 24h, Identity inativa em 30 dias, logs em 14 dias e dump em 7 dias. Falta apenas tornar testes de purge/restore gates explícitos.
- **Autoria:** o modelo prevê Participant, snapshot de Nick, instante e valores; COV-03 e COV-08 fecham as duas lacunas observadas.
- **Acessibilidade:** cobertura forte e coerente com UX; cadeado decorativo, estados não dependentes de cor e controles específicos continuam governados pelos companions de UX.
- **Limites:** não foram introduzidos chat, grupo persistente, ranking, mapa embutido, moderação, reserva, pagamento ou memória social. Object Storage é usado somente para DR, não como storage de produto.

## Decisões humanas necessárias

1. **Limite Final para horário explícito anterior a 18h:** qual regra padrão cria `finalLimit` nesses Rolês?
2. **Agregado público durante Organização:** contar pessoas distintas com ao menos uma resposta `Topo`/`Tudo bem`, somar respostas por Opção, usar uma Opção específica ou outra fórmula? Depois da definição, a contagem deve considerar somente a Opção selecionada?
3. **Interesse Geral:** quais valores a pessoa pode registrar, é possível limpar a disposição e ele participa ou não do agregado público?

A política de mudança de Local depois da definição já foi decidida na UX aprovada; COV-09 pede apenas sua canonização, não uma nova escolha.
