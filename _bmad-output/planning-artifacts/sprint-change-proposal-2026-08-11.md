---
title: Proposta de Mudança de Curso — Prontidão para Implementação
project: Bora Lá
date: 2026-08-11
status: approved
mode: batch
trigger: implementation-readiness-report-2026-08-10.md
scopeClassification: Moderate
approvedAt: 2026-08-11
---

# Proposta de Mudança de Curso — Prontidão para Implementação

## 1. Resumo do problema

O workflow `[IR] Check Implementation Readiness`, executado antes do Sprint Planning, encontrou cobertura funcional completa, mas reprovou a prontidão devido a divergências normativas e problemas de decomposição:

1. a arquitetura calcula o agregado público exclusivamente por `GeneralInterest.INTERESTED`, enquanto PRD, UX, regra do MVP e Stories atribuem a frase a `Topo ou Tudo bem`;
2. a UX descreve autenticação somente por código, enquanto arquitetura e Stories exigem botão/link de continuidade com código alternativo;
3. sete Stories exigem estados que somente histórias futuras produzem;
4. a História 4.7 reúne runtime, TLS, implantação blue-green, backup e restauração numa unidade grande demais;
5. três critérios menores e uma linha de rastreabilidade precisam ser corrigidos.

O problema é uma incompatibilidade de refinamentos documentais e de decomposição, não uma mudança da visão, do mercado ou do escopo funcional do MVP. Nenhum código de produto ou Sprint precisa ser revertido.

## 2. Análise de impacto

### 2.1 Impacto nos Epics

| Epic | Impacto | Decisão |
|---|---|---|
| Epic 1 | Alinhar autenticação/agregado e remover antecipações terminais de 1.6 e 1.9 | Manter objetivo e ordem |
| Epic 2 | Remover dependência futura de definição/fechamento em 2.4 e 2.5 | Manter objetivo e ordem |
| Epic 3 | Absorver critérios de fechamento e compartilhamento do estado substituído nas histórias que criam esses estados | Manter objetivo e ordem |
| Epic 4 | Concentrar cancelamento em 4.5 e dividir 4.7 em três histórias operacionais | Manter o Epic; ampliar de sete para nove Stories |

Nenhum Epic é criado, removido, renumerado ou reordenado.

### 2.2 Impacto nas Stories

Stories alteradas: 1.3, 1.5, 1.6, 1.9, 2.4, 2.5, 3.2, 3.6, 4.2, 4.3, 4.4, 4.5, 4.6 e 4.7.

Stories adicionadas: 4.8 e 4.9.

As Histórias 1.2 e 1.3 permanecem como fatias verticais coesas. Seu tamanho será controlado nos arquivos dedicados de Story, sem separar segurança, persistência ou testes do comportamento que protegem.

### 2.3 Conflitos entre artefatos

- **PRD:** UJ2 e FR2 precisam adotar a fonte canônica do agregado; OQ1–OQ3 devem ser marcadas como resolvidas.
- **SPEC e regras do MVP:** a regra de visibilidade pré-identificação precisa deixar de atribuir o agregado a Respostas de Opção; OQ de autenticação/backend/retenção precisam refletir as decisões arquiteturais.
- **Arquitetura:** modelo e decisões permanecem; somente a microcopy pública deve ser canonizada com a mesma frase dos demais artefatos.
- **UX:** Foundation, IA, `identity-gate`, fluxos, `interest-envelope`, rastreabilidade, mocks e microcopy precisam ser sincronizados.
- **Epics/Stories:** inventário, UX-DR7, critérios e rastreabilidade precisam incorporar as decisões e remover dependências futuras.
- **Sprint status:** inexistente; nenhuma migração é necessária.

### 2.4 Impacto técnico

Não há código implementado. Não há alteração de stack, modelo de domínio, schema ou protocolo. A mudança evita duas implementações concorrentes antes que elas existam e melhora a sequência do backlog.

## 3. Abordagem recomendada

### Ajuste Direto coordenado

Aplicar as correções nos artefatos existentes e reorganizar as Stories sem mudar os quatro Epics ou o escopo do MVP.

**Esforço estimado:** médio, concentrado em documentação e revalidação.

**Risco:** médio antes da correção; baixo após canonização e novo `[IR]`.

**Impacto no cronograma:** uma rodada de correção e uma rodada de revalidação antes do Sprint Planning. Não há retrabalho de implementação.

### Alternativas rejeitadas

- **Rollback:** não aplicável, pois não há Stories implementadas.
- **Revisão/redução do MVP:** desnecessária; FR1–FR22 permanecem válidos e 100% cobertos.
- **Novo Epic técnico:** rejeitado; runtime, deploy e recuperação continuam dentro do ciclo de valor do Epic 4, em Stories menores para a pessoa responsável pela operação.

## 4. Propostas detalhadas de alteração

### 4.1 Canonizar o agregado público

**Artefatos:** PRD, `mvp-rules.md`, `SOLUTION-DESIGN.md`, `DESIGN.md`, `EXPERIENCE.md`, mocks promovidos e `epics.md`.

**ANTES:**

> `{N} pessoas marcaram Topo ou Tudo bem.`

**DEPOIS:**

> `{N} pessoas marcaram Tô a fim.`

**Contrato canônico:** `interestedCount = COUNT(DISTINCT participant_id)` para `GeneralInterest.INTERESTED`. `UNSURE`, ausência e qualquer `VenueResponse` não entram no agregado. A frase não justifica Declaração, ordenação ou escolha de Local.

**Justificativa:** torna a microcopy verdadeira para a fonte arquitetural e elimina a falsa associação com Respostas de Opção.

### 4.2 Alinhar autenticação passwordless

**Artefatos:** PRD/OQ1, SPEC/Open Questions e `EXPERIENCE.md`.

**ANTES:**

> Identificação do MVP: somente código de uso único por e-mail.

**DEPOIS:**

> Identificação do MVP: e-mail com botão/link de continuidade e código alternativo de uso único; ambos convergem para o mesmo consumo seguro. Senha, SMS, WhatsApp e login social ficam fora do MVP.

**Justificativa:** alinha UX à decisão AD-8 e às Histórias 1.2/1.3, preservando acessibilidade e resistência a scanners de e-mail.

### 4.3 Atualizar decisões abertas já resolvidas

**Artefatos:** PRD e SPEC.

**ANTES:** OQ1 autenticação, OQ2 retenção e OQ3 backend permanecem abertas.

**DEPOIS:**

- OQ1 resolvida por link de continuidade + código alternativo por e-mail;
- OQ2 resolvida pela política de purge de 24 horas/30 dias e retenções operacionais da arquitetura;
- OQ3 resolvida por Node.js 24, React Router SSR e MySQL/InnoDB;
- OQ4 permanece aberta até o planejamento do piloto.

**Justificativa:** evita que documentos normativos continuem declarando bloqueios já adjudicados.

### 4.4 Remover antecipações do Epic 1

**História 1.6 — Prévia pública**

**ANTES:** exige Cancelado, Substituído e Encerrado antes de existirem.

**DEPOIS:** limita os critérios aos estados alcançáveis no Epic 1; cada projeção futura será acrescentada na Story que cria a transição correspondente.

**História 1.9 — Compartilhamento**

**ANTES:** exige mensagens para estados cancelado, substituído e encerrado.

**DEPOIS:** entrega compartilhamento dos estados do Epic 1. As Histórias 3.6, 4.4 e 4.5 estendem o componente para seus próprios estados.

### 4.5 Remover antecipações do Epic 2

**História 2.4**

**ANTES:** testa inativação/reativação depois de Local definido.

**DEPOIS:** cobre somente Organização. A História 3.2 comprova que todas as Opções fecham e não aceitam mudança de estado.

**História 2.5**

**ANTES:** testa Resposta concorrente com fechamento futuro.

**DEPOIS:** cobre Resposta concorrente com inativação. A História 3.2 assume a serialização entre Resposta e `SelectVenue`.

### 4.6 Concentrar estados terminais no Epic 4

**Histórias 4.2 e 4.3**

Remover critérios que dependem de cancelamento futuro. Manter substituição, já entregue no Epic 3, e encerramento quando aplicável.

**História 4.4**

Remover o cenário de um Rolê previamente cancelado atravessando o limite, pois cancelamento ainda não existe nessa ordem.

**História 4.5**

Manter todos os critérios de cancelamento, incluindo projeções pública/identificada, bloqueio de mutações, compartilhamento factual e minimização posterior ao Limite Final.

### 4.7 Dividir a História 4.7

**ANTES:**

> História 4.7 — Publicar e recuperar o Bora Lá com segurança

**DEPOIS:**

1. **História 4.7 — Executar o Bora Lá em runtime seguro:** imagem OCI ARM64, processos `web`/`maintenance`, Podman/Quadlet rootless, filesystem read-only, usuário dedicado e MySQL TLS fail-closed/readiness.
2. **História 4.8 — Implantar uma versão com troca segura:** digest por SHA, migrations expand/contract, slot blue-green, readiness/smoke, troca Caddy, rollback e recuperação após reboot.
3. **História 4.9 — Proteger e restaurar backups:** backup OCI, dump cifrado por `age` sem SQL plaintext, quota/retenção, falhas `.part`, RPO/RTO e ensaio de restauração.

**Justificativa:** cada Story passa a ter uma fronteira operacional, evidência própria e escopo compatível com uma sessão de desenvolvimento.

### 4.8 Corrigir critérios menores

- História 1.3: trocar “logout futuro deve poder revogar” por uma revogação server-side diretamente testável.
- História 1.5: remover o teste de possível duplicidade da primeira Opção; manter a política compartilhada e testar duplicidade efetiva em 2.2.
- História 4.6: retirar retenção de backups; mover o critério para 4.9.
- `EXPERIENCE.md`: corrigir a linha de rastreabilidade NFR7–NFR8 para Confiabilidade e Localização temporal.

### 4.9 Preservar critérios de tamanho das Histórias 1.2 e 1.3

Não dividir por camada. Ao criar os arquivos dedicados dessas Stories, explicitar sequência interna, limites de contexto e evidência mínima, mantendo emissão e consumo como fatias verticais seguras. Se a criação do arquivo demonstrar que não cabe em uma sessão, usar `bmad-correct-course` antes da implementação.

## 5. Handoff para implementação da mudança

### Classificação

**Moderada:** exige atualização coordenada de produto, arquitetura, UX e backlog, mas não altera visão, Epics, stack nem código existente.

### Responsabilidades

- **Produto/PM:** aprovar a microcopy do agregado e registrar OQ1–OQ3 como resolvidas.
- **Arquitetura:** confirmar que a frase pública continua derivada exclusivamente de `GeneralInterest.INTERESTED` e normalizar a microcopy no Solution Design.
- **UX:** atualizar spines, componentes, fluxos, rastreabilidade e mocks promovidos.
- **PO/Developer:** redistribuir critérios, dividir 4.7 e atualizar rastreabilidade das Stories.
- **Validação:** executar novamente `[IR]` após todas as mudanças.

### Sequência

1. Canonizar agregado e autenticação nas fontes normativas.
2. Atualizar arquitetura e UX.
3. Atualizar Epics/Stories e mocks.
4. Executar buscas mecânicas por textos antigos, conectores BDD em inglês e referências de Story.
5. Executar `[IR]` novamente.
6. Somente com resultado `PRONTO`, executar `[SP] Sprint Planning`.

### Critérios de sucesso

- Uma única fonte e uma única frase para `interestedCount` em todos os artefatos.
- Link de continuidade e código alternativo descritos de forma idêntica em PRD, SPEC, UX, arquitetura e Stories.
- Nenhuma Story exige estado produzido por Story futura.
- Histórias 4.7–4.9 possuem escopos operacionais independentes e testáveis.
- FR1–FR22 continuam 100% cobertos.
- Toda documentação e BDD permanecem em Português do Brasil.
- Novo `[IR]` retorna `PRONTO PARA IMPLEMENTAÇÃO`.

## 6. Checklist de navegação da mudança

### Seção 1 — Gatilho e contexto

- [N/A] 1.1 — nenhum Story implementada revelou o problema; o gatilho foi o relatório IR.
- [x] 1.2 — problema definido como incompatibilidade de refinamentos e decomposição.
- [x] 1.3 — evidências documentadas no relatório IR.

### Seção 2 — Impacto nos Epics

- [!] 2.1 — Epics viáveis com ajustes internos.
- [x] 2.2 — nenhum Epic novo/removido/redefinido.
- [!] 2.3 — Epics 1, 2, 3 e 4 recebem redistribuição de critérios.
- [x] 2.4 — nenhum Epic invalidado.
- [x] 2.5 — ordem dos Epics preservada.

### Seção 3 — Conflitos de artefatos

- [!] 3.1 — PRD precisa de correções pontuais.
- [!] 3.2 — arquitetura precisa normalizar microcopy, sem mudar modelo.
- [!] 3.3 — UX e mocks precisam de alinhamento.
- [!] 3.4 — SPEC, regras, Stories e testes são afetados.

### Seção 4 — Caminho

- [x] 4.1 — Ajuste Direto viável; esforço médio, risco médio.
- [N/A] 4.2 — rollback não aplicável.
- [N/A] 4.3 — revisão de escopo do MVP desnecessária.
- [x] 4.4 — Ajuste Direto selecionado.

### Seção 5 — Componentes da proposta

- [x] 5.1 — resumo do problema.
- [x] 5.2 — impacto e artefatos.
- [x] 5.3 — abordagem e alternativas.
- [x] 5.4 — MVP preservado e plano sequenciado.
- [x] 5.5 — handoff definido.

### Seção 6 — Revisão e handoff

- [x] 6.1 — checklist revisado; ações pendentes documentadas.
- [x] 6.2 — proposta pronta para revisão do usuário.
- [x] 6.3 — proposta aprovada explicitamente pelo usuário em 11/08/2026.
- [N/A] 6.4 — `sprint-status.yaml` ainda não existe.
- [x] 6.5 — handoff confirmado para Produto/Arquitetura/UX e PO/Developer, seguido de novo `[IR]`.

## 7. Registro de handoff

- **Problema tratado:** contradições normativas e falhas de decomposição identificadas pelo relatório IR de 10/08/2026.
- **Escopo:** moderado.
- **Artefatos a modificar:** PRD, SPEC, `mvp-rules.md`, Solution Design, Design Spine, Experience Spine, mocks promovidos e `epics.md`.
- **Encaminhamento:** Produto/PM decide e registra semântica; Arquitetura confirma contratos; UX atualiza experiência e mocks; PO/Developer reorganiza Stories e rastreabilidade.
- **Gate de saída:** novo `[IR]` com resultado `PRONTO PARA IMPLEMENTAÇÃO` antes de `[SP]`.
