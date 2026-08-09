# Revalidação adversarial — organizar sem governar

## Gate

**PASS**

`DESIGN.md`, `EXPERIENCE.md` e os quatro mocks promovidos estão coerentes com a premissa **organizar sem governar**. A interface registra sinais e decisões humanas sem transformar contagem, ordem, autoria ou concorrência em maioria, ranking, recomendação, legitimidade ou autoridade central.

Contagem residual: **0 crítico · 0 alto · 0 médio · 0 baixo**.

## Escopo e base normativa

Foram revalidados `DESIGN.md`, `EXPERIENCE.md` e `mockups/convite.html`, `mockups/criar-role.html`, `mockups/organizacao.html` e `mockups/plano-conflito.html`.

Critérios normativos:

- `CONSTITUTION.md:7`: o produto registra decisões, mas não determina consenso, maioria, quórum, influência ou legitimidade;
- PRD `§1`, `FR-2`, `FR-10`, `FR-12–FR-14` e `§6`: o agregado público é permitido, somente `Topo` é nominal, qualquer Pessoa Convidada pode declarar e o sistema não calcula vencedor nem autoridade;
- `SPEC.md`, CAP-6 e invariantes: Declarações humanas funcionam sem votação, ranking ou autoridade central;
- `mvp-rules.md`, “Respostas” e “Declarações”: Respostas são independentes por Opção; Declarações não convertem Respostas nem presumem consenso.

## Verificações aprovadas

### Prova social e significado do agregado

- `DESIGN.md` exige frase factual inseparável em `{typography.body-strong}` e `{colors.ink-primary}`, sem métrica ampliada, pergunta, sombra, barra ou tendência.
- `EXPERIENCE.md` fixa `{N} pessoas marcaram Topo ou Tudo bem`, não acionável e nunca usado como justificativa de Declaração.
- `mockups/convite.html` e `mockups/organizacao.html` renderizam a frase completa em escala de corpo e tinta primária, sem destacar o número.
- `mockups/organizacao.html` usa o título factual `Respostas registradas`; não resta ocorrência de `Quantos tão a fim?` nos mocks promovidos.

### Formação da Resposta antes da consulta nominal

- `mockups/convite.html` não oferece mais acesso direto a `Quem já topou?`; a única entrada protegida é `Dar o seu pitaco — requer identificação`.
- Na Organização, os `response-control` das Opções aparecem no DOM antes de `top-list`/`Quem já topou?`.
- A ordem implementa `EXPERIENCE.md:49`, o contrato de `top-list` e UJ-2, eliminando o caminho visual anteriormente capaz de expor Nicks antes da formação da Resposta.

### Ranking e ordem das Opções

- `EXPERIENCE.md` define ordem crescente por `createdAt`, desempate por `optionId`, sem reordenação por Respostas, autoria, edição, inativação ou reativação.
- Nenhum mock apresenta vencedor, percentual, barra, tendência, opção “mais votada” ou sinal de quórum.
- Opções inativas são estados operacionais preservados, não alternativas eliminadas pelo grupo.

### Equivalência das quatro Respostas

- `DESIGN.md` e `EXPERIENCE.md` exigem área, tipografia, peso e comportamento equivalentes.
- `mockups/organizacao.html` mantém `Topo`, `Tudo bem`, `Não tenho certeza` e `Não vou nesse` no mesmo padrão; `Topo` não recebe verde, celebração, escala, posição ou ícone privilegiado.

### Autoridade e Declarações

- Pessoa Criadora e Pessoa Convidada identificada têm os mesmos poderes após a criação.
- `declaration-panel` informa que qualquer pessoa identificada pode agir e que autoria não significa autoridade.
- Definição de Local usa consequência inline e gesto único, sem rito de homologação, maioria ou segunda aprovação.
- Cancelamento é apresentado como capacidade equivalente e excepcional, com consequência terminal e autoria, não como poder de organizador.

### Concorrência, Correção e Outro Rolê

- `mockups/plano-conflito.html` trata a primeira persistência como estado técnico vigente, sem afirmar que ela representa a vontade do grupo.
- Correção preserva o registro e Outro Rolê representa mudança efetiva; o produto explica consequências e mantém a resolução social fora da interface.

### Compartilhamento e histórico

- Templates são factuais e não contêm Nicks, “confirmados”, vencedor, maioria ou agregado como justificativa da Declaração.
- Histórico é sequência factual com autoria e momento, sem badges, estatísticas por pessoa, reputação ou destaque de quem prevaleceu.

## Conclusão

Os dois achados do rerun anterior foram resolvidos nos artefatos promovidos. Não há bloqueio residual desta lente para handoff. A hipótese comportamental — participantes compreenderem o agregado sem lê-lo como maioria, quórum ou recomendação — permanece apropriada para teste moderado de produto, mas não representa inconsistência documental nem reprova este gate.
