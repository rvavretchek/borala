---
name: Reconciliação normativa da arquitetura do Bora Lá
type: architecture-reconciliation
status: complete
created: '2026-08-07'
updated: '2026-08-07'
reviewed:
  - ../ARCHITECTURE-SPINE.md
  - ../SOLUTION-DESIGN.md
  - ../UML.md
---

# Reconciliação normativa — arquitetura do Bora Lá

## Escopo e regra de autoridade

Foram comparados o Architecture Spine, o Solution Design e os diagramas UML com a Constituição, o PRD final, a SPEC e seus companions e os spines finais de UX. `design-artifacts/A-Product-Brief` não foi usado como requisito.

A ordem aplicável é: Constituição; decisões diretas mais recentes do responsável pelo produto; SPEC e companions como contrato do MVP; PRD; UX para comportamento/apresentação dentro desse contrato; arquitetura para decisões de implementação. A arquitetura acertadamente incorpora a decisão direta mais recente segundo a qual, após a definição, nome/endereço/URLs podem ser editados como detalhes factuais, mas trocar Local ou Data exige `Criar Outro Rolê`.

## Resultado executivo

- **Críticos:** 0.
- **Altos:** 5.
- **Médios:** 7.
- **Baixos:** 2.
- **Decisões humanas ainda necessárias:** 2.

O eixo arquitetural é compatível com a Constituição: monólito modular, domínio isolado, igualdade de poderes entre participantes, atomicidade, auditoria, privacidade por audiência, TDD e ausência de mecanismos de votação/governança. A finalização deve aguardar as duas decisões humanas e a correção das contradições altas.

## Achados altos

### H-1 — A precedência terminal pode expor estado depois do Limite Final

**Evidência:** AD-11 determina que, após `FinalLimit`, somente `Este Rolê terminou.` é exposto, mas AD-15 ordena `Cancelled → Replaced → Ended`. O Solution Design, por sua vez, diz que `ENDED` prevalece quando `Clock >= finalLimit`. FR-21, `mvp-rules.md` e a matriz de privacidade da UX também exigem somente a frase terminal após o limite.

**Risco:** uma implementação literal de AD-15 continuaria revelando cancelamento ou substituição e o novo Convite após a expiração, contrariando minimização e o contrato do MVP.

**Correção clara:** tornar a expiração o gate externo: `Ended → Cancelled → Replaced → InProgress → Defined → OccurrenceDeclared → Organizing`. Explicar que a ordem Cancelado/Substituído vale somente antes do Limite Final. Ajustar AD-15, projeções e diagramas de estado.

### H-2 — AD-18 torna os próprios fluxos públicos de autenticação impossíveis

**Evidência:** AD-18 afirma que “toda mutação” exige sessão, participação, CSRF, `expectedVersion` e `commandId`. Entretanto, `POST /auth/challenges`, consumo de challenge, `CreateOuting`, `join` e `logout` não possuem todas essas pré-condições por definição. O envelope do Solution Design também diz “Todo POST de negócio”, embora não haja agregado/versionamento anterior em todos os casos.

**Risco:** agentes podem proteger autenticação com autenticação, exigir participação antes de `join`, ou inventar versões fictícias.

**Correção clara:** separar contratos: comandos mutáveis do agregado `Outing` exigem sessão + participação + CSRF + `commandId` e, quando atuam sobre agregado existente, `expectedVersion`; `CreateOuting` exige Identity verificada, CSRF e idempotência; `join` exige sessão/Identity, CSRF e idempotência; autenticação pública usa seus próprios controles de challenge/rate limit/consumo atômico; logout exige sessão e CSRF, sem participação/versionamento.

### H-3 — O diagrama de estados contradiz o modelo persistido e a decisão de Outro Rolê

**Evidência:** o Solution Design persiste `ORGANIZING`, `OCCURRENCE_DECLARED`, `DEFINED`, `CANCELLED` e `REPLACED`. O UML colapsa os dois primeiros em `Open`, omite `declareOccurrence` e permite `Open --> Replaced`. A decisão direta vigente e a UX determinam que, antes da definição, altera-se a Opção; `Criar Outro Rolê` como substituição é a ação posterior à definição.

**Risco:** agentes geram uma máquina de estados incompatível e habilitam substituição atômica na Organização.

**Correção clara:** usar os estados persistidos no UML; incluir `Organizing --> OccurrenceDeclared`; permitir `createReplacement` apenas a partir de `Defined`/sua projeção `InProgress`; representar encerramento temporal como projeção/gate, sem criar um estado persistido divergente.

### H-4 — O modelo relacional do UML contradiz o Solution Design

**Evidência:** o Solution Design define IDs como `CHAR(36)`, `venue_option_urls` e invite digest em `outings`; o UML usa IDs `binary`, `urls` como JSON e uma tabela `INVITES`. O UML ainda relaciona `LoginChallenge` a uma `Identity`, embora o challenge possa existir antes da Identity e a tabela lógica use `email_lookup` sem `identity_id`. Tabelas normativamente relevantes como revisões, Interesse Geral e rate-limit buckets também não aparecem.

**Risco:** como o desenvolvimento será feito por agentes, duas descrições igualmente “oficiais” do schema podem gerar migrations incompatíveis.

**Correção clara:** escolher uma única representação e sincronizar texto e UML. A opção de menor mudança é fazer o UML seguir o Solution Design: `CHAR(36)`, URLs normalizadas/revisionáveis em tabela, invite digest em `outings` ou, se `invites` vencer, alterar a tabela lógica; retirar a cardinalidade obrigatória challenge→Identity e rotular o ER como essencial caso continue omitindo tabelas.

### H-5 — Divergências de Correção × Outro Rolê continuam nas fontes normativas

**Evidência:** PRD FR-15, `mvp-rules.md` e `state-machines.md` ainda descrevem `Corrigir local declarado` no mesmo Rolê. A decisão direta mais recente e `EXPERIENCE.md` refinam a regra: após a definição, somente detalhes factuais do mesmo Local são editáveis; outro Local ou Data sempre cria Outro Rolê. AD-14 e o Solution Design seguem corretamente a decisão mais recente.

**Risco:** um agente que leia a SPEC sem a adjudicação da arquitetura pode implementar troca do Local selecionado no mesmo `eventId`.

**Correção clara:** manter AD-14 e registrar no spine uma seção curta de adjudicações, com a decisão direta e a data. Depois, atualizar PRD/SPEC companions em workflow próprio para substituir “Corrigir local declarado” por “Editar detalhes factuais do Local”. Não é necessária nova decisão de produto.

## Achados médios

### M-1 — Falta definir o Limite Final de horário explícito igual ou anterior a 18h

As fontes fixam 03h do dia seguinte para Rolê noturno iniciado após 18h e para `AfterWork`, mas não definem o padrão de um horário explícito às 18h ou antes. O próprio Solution Design reconhece a lacuna. `FinalLimitPolicy`, encerramento, retenção e testes não podem ser implementados sem uma decisão humana.

### M-2 — A origem do agregado público `Topo + Tudo bem` é ambígua

FR-2 exige o agregado inclusive quando o Local está em aberto; Respostas são por Opção, podem existir múltiplas Opções e o Interesse Geral é separado. Nenhuma fonte define se a contagem pública usa Interesse Geral, a união deduplicada das respostas positivas entre opções, uma opção específica ou outra regra. Também não há enum/semântica completa de Interesse Geral. Inventar a agregação pode transformar sinais em uma métrica social indevida. Requer decisão humana.

### M-3 — `DeclareOccurrence` possui pré-condição ampla demais

O Solution Design aceita `DeclareOccurrence` em qualquer estado “não terminal”. Normativamente, `Vai ter rolê` ocorre enquanto o Local está aberto e as Opções seguem ativas. Restringir a `ORGANIZING`, tratando repetição idêntica em `OCCURRENCE_DECLARED` como idempotente, evita uma declaração sem sentido após `DEFINED`.

### M-4 — Retenção do rate limit não foi fechada

`auth_rate_limit_buckets` persiste digest de e-mail/IP e janela, mas o job de retenção menciona somente challenges e sessions. Definir expiração e hard-delete dos buckets — por exemplo, em até 24h após a janela deixar de ser necessária — é necessário para cumprir minimização. A regra pode ser técnica, desde que não exceda o necessário aos limites aprovados.

### M-5 — `PublicInvitationView.local` precisa ser estreitado

“Local quando definido” pode ser interpretado como `VenueDetails` completo. O contrato público deve nomear explicitamente apenas o nome/referência pública necessária ao resumo; endereço e URLs ficam no DTO identificado, conforme acesso progressivo e controles de rota da UX.

### M-6 — Autenticação por botão + código diverge do texto final da UX

`EXPERIENCE.md` ainda fixa “somente código”, enquanto a decisão direta posterior aprova botão de continuidade + código alternativo, incorporada por AD-8. A arquitetura deve registrar esta adjudicação e a UX deve ser atualizada em workflow próprio. Não exige nova decisão humana.

### M-7 — “Convite Operacional” está semanticamente sobrecarregado

O PRD define Convite Operacional como não terminal, mas o Rolê substituído/cancelado continua legível de forma limitada até o Limite Final. O Solution Design usa “Convite operacional” como pré-condição de extensão. Diferenciar `inviteAccessible` (leitura terminal antes do limite) de `outingMutable`/`activeInvitation` evitará permitir extensão ou mutação em Cancelled/Replaced.

## Achados baixos

### L-1 — Rotas divergentes no UML

O contrato usa `/r/:inviteToken`; a sequência de identificação usa `/i/:inviteToken` e nomes como `request-login`/`verify-link`. Alinhar as rotas conceituais reduz ambiguidade para agentes.

### L-2 — A declaração de autoridade do spine é ampla demais para UX

O texto introdutório diz que “a UX final governa comportamento, privacidade e apresentação”. A própria UX afirma que Constituição, PRD e SPEC prevalecem. Reformular para dizer que UX governa interação e apresentação onde não conflitar com o contrato normativo; listar adjudicações diretas separadamente.

## Decisões humanas exigidas

1. **Limite Final para horário explícito ≤18h:** qual instante padrão encerra o acesso? A decisão deve cobrir também exatamente 18h e informar se horários que atravessam a meia-noite continuam na Data social original.
2. **Agregado público e Interesse Geral:** de qual dado vem `Quantos tão a fim?` quando não há Local definido e quando existem várias Opções? É preciso definir a deduplicação por pessoa e os valores permitidos de Interesse Geral, sem usar contagens para escolher ou legitimar uma Opção.

## Adjudicações já resolvidas que devem ficar explícitas

- Após a definição, editar nome/endereço/URLs preserva o mesmo Local social; trocar Local ou Data cria Outro Rolê.
- A autenticação do MVP é por e-mail passwordless com botão de continuidade e código alternativo; não há senha no MVP.
- Criadora e demais participantes identificados têm os mesmos poderes após a criação.
- `Topo + Tudo bem` informa adesão, nunca seleciona, ranqueia ou legitima uma decisão.

## Critério de saída da reconciliação

Depois das duas decisões humanas: corrigir H-1 a H-4 nos três artefatos, registrar H-5/M-6 como adjudicações, resolver M-3 a M-7, sincronizar o UML e executar o reviewer gate. A documentação pode então avançar de `draft` para `final` sem criar regra de produto silenciosa.
