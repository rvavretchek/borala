# PRD Quality Review — Bora Lá

## Overall verdict

O PRD tem uma tese distintiva, escopo honesto e requisitos funcionais muito acima da média em verificabilidade; ele preserva com clareza a aposta de “organizar sem governar” e está bem moldado para alimentar UX, arquitetura e histórias. Ainda não está plenamente pronto para autorizar implementação: a validação proposta comprova principalmente usabilidade, não o resultado central de aumentar a chance de comparecimento, e algumas regras temporais e de substituição de Rolê deixam comportamentos de fronteira sem uma única interpretação testável.

## Decision-readiness — adequate

As principais decisões aparecem como decisões: ausência de votação, quórum e moderação; identidade progressiva; autoria e histórico; Opções que não são excluídas; cancelamento terminal; e separação entre Correção e Outro Rolê. A seção §6 torna as renúncias explícitas, enquanto o adendo registra alternativas rejeitadas e suas razões. As quatro questões abertas têm responsáveis e condições de resolução, sem fingirem estar encerradas.

O documento, contudo, mistura dois níveis de prontidão. O produto e o escopo estão decididos, mas autenticação, retenção e backend ainda são bloqueadores declarados. Isso é aceitável para entrada em UX e arquitetura, porém não para um “green light” direto de implementação. Além disso, a consequência exata de substituir um Rolê por Outro Rolê precisa virar decisão, e não permanecer implícita na palavra “substituído”.

### Findings

- **medium** Tornar explícito o gate de implementação (§10) — OQ-1 e OQ-2 bloqueiam, respectivamente, FR-1/FR-3 e produção, mas o status `draft` não informa ao leitor quais workflows podem avançar agora. *Fix:* acrescentar uma nota de prontidão: “apto para UX e arquitetura; implementação de identidade bloqueada por OQ-1; produção bloqueada por OQ-2”.
- **medium** Decidir o efeito de criar Outro Rolê sobre o anterior (§4.4, FR-16) — “permanece identificável como substituído” não diz quem o marca assim, se a operação é atômica, se ele continua mutável ou se passa a um estado terminal. Essa lacuna afeta concorrência, UX e histórias. *Fix:* definir a transição observável do Rolê anterior e suas ações permitidas após a substituição.

## Substance over theater — strong

O conteúdo é específico ao Bora Lá. As jornadas influenciam diretamente os requisitos; a visão não poderia ser transplantada sem perda para um produto genérico de eventos; e os NFRs tratam riscos reais do domínio, como privacidade de credenciais, concorrência de declarações, autoria, virada de dia e expiração pública. Não há seção de personas decorativa, alegação artificial de inovação ou coleção de requisitos genéricos de “segurança, escala e facilidade”.

A distinção entre Convite vivo e mensagem compartilhada como snapshot, a nominalidade exclusiva de `Topo` e a decisão deliberada de aceitar identidades duplicadas por credenciais distintas demonstram substância obtida na descoberta, não preenchimento de template.

### Findings

- **low** Substituir a expressão ampla “ação coletiva” por um conjunto fechado (§5, NFR-4) — O termo não pertence ao Glossário e pode fazer equipes diferentes auditarem conjuntos diferentes de ações. *Fix:* enumerar declarações, correções, criação/inativação/reativação de Opções, alteração de horário, extensão e cancelamento, ou referenciar explicitamente os FRs aplicáveis.

## Strategic coherence — thin

A estratégia tem uma tese clara: tornar visíveis os sinais sociais e o plano vigente sem governar a decisão. O recorte de funcionalidades decorre dessa tese, e as contramétricas protegem o produto contra otimização oportunista de votos, velocidade e retenção. O MVP também é coerentemente um teste de solução/experiência, não uma tentativa prematura de plataforma ou receita.

O elo crítico entre tese e sucesso, porém, ainda não está operacionalizado. A visão afirma que o produto busca transformar intenção em encontro real e o histórico de descoberta define aumentar a chance de comparecimento como sucesso principal. SM-1 mede conclusão assistida do fluxo, SM-2 compreensão, SM-3 velocidade de criação e SM-4 compatibilidade com o canal social. Nenhuma delas testa se o Bora Lá aumenta, ou sequer é percebido como aumentando, a propensão a comparecer. O próprio PRD reconhece a lacuna e a transfere para OQ-4, mas isso deixa a aposta principal sem critério de decisão para o piloto.

### Findings

- **high** Definir uma métrica para a hipótese central de comparecimento (§1, §8 e OQ-4) — As métricas atuais podem ficar verdes mesmo que o Bora Lá não altere a chance de ninguém ir ao encontro. *Fix:* antes do piloto, converter OQ-4 em uma métrica primária de pesquisa com instrumento, população, limiar e regra de decisão; por exemplo, comparação declarada com o processo habitual ou intenção contrafactual, sem introduzir check-in no produto.
- **medium** Definir decisão de continuidade do MVP a partir das métricas (§8) — Os limiares dizem o que medir, mas não o que o time fará se usabilidade for boa e influência percebida no comparecimento for baixa, ou vice-versa. *Fix:* registrar critérios mínimos de avançar, iterar ou interromper após o piloto.

## Done-ness clarity — thin

Os 22 FRs têm consequências testáveis, e em muitos casos descrevem fronteiras excelentes: unicidade do Nick apenas no Rolê, não herança de Respostas, idempotência, ausência de conversão automática e cancelamento terminal. Essa estrutura dará uma base forte para ATDD e histórias.

As lacunas concentram-se nas regras temporais e em estados derivados. São poucas, mas importantes porque geram implementações incompatíveis que ainda poderiam alegar conformidade com o texto. O limite de alteração do horário diverge na fronteira exata de uma hora; a referência móvel de `Depois do expediente` não define até quando avança; e a extensão do Limite Final não possui entrada, alcance ou teto observável. NFR-7 também não estabelece um limite de consistência após confirmação.

### Findings

- **high** Resolver a fronteira exata de uma hora (§4.5, FR-18) — “a pelo menos uma hora” permite alterar exatamente a 1h do horário vigente, enquanto a regra descoberta e o exemplo das 19h30 para 20h indicam que a alteração deve ser bloqueada dentro da última hora. *Fix:* escolher e registrar uma desigualdade inequívoca (`currentTime < approximateStart - 1h`, se exatamente uma hora já estiver bloqueada) e adicionar exemplos nos limites de 59, 60 e 61 minutos.
- **high** Completar a regra móvel de `Depois do expediente` (§4.5, FR-17) — “adiada em 30 minutos a cada 30 minutos desde 16h30” não define quando o avanço cessa, como se comporta após meia-noite nem qual referência governa respostas e alterações se o Rolê for definido tarde. *Fix:* fornecer uma tabela ou fórmula com início, cadência, condição de parada, limite superior/virada de data e efeito da definição do Local do Rolê.
- **high** Especificar a extensão do Limite Final (§4.5, FR-20) — O requisito diz quem pode estender e quando, mas não como o novo limite é informado, quanto pode avançar, se pode ser estendido repetidamente ou qual é o limite máximo. *Fix:* definir formato de entrada, granularidade, teto, repetibilidade e comportamento concorrente da extensão.
- **medium** Dar limite verificável à confirmação persistida (§5, NFR-7) — “deve aparecer após recarregar” não define quanto tempo o cliente pode aguardar nem o que significa confirmação em caso de timeout. *Fix:* estabelecer que sucesso só é mostrado após persistência confirmada e um orçamento mensurável para leitura após gravação, ou declarar consistência imediata por contrato.
- **medium** Fechar a máquina de estados de Opção no PRD (§3, §4.3) — O Glossário introduz `fechada`, mas FR-9 só afirma que todas “fecham”; faltam as ações e visualizações permitidas nesse estado, sobretudo histórico e seleção numa Correção. *Fix:* declarar `fechada` como somente leitura e explicitar quais fluxos posteriores podem referenciá-la.

## Scope honesty — strong

O documento é especialmente honesto sobre omissões. §2.3, §6 e §7.2 se complementam sem esconder chat, grupos persistentes, busca, integrações, monetização, moderação, comparecimento ou memória. O texto também admite que o MVP não mede presença, aceita a limitação de identidade entre credenciais diferentes e separa expiração pública de retenção técnica ainda aberta.

O Índice de suposições declara não haver suposições comportamentais silenciosas e identifica os limiares quantitativos como metas iniciais. Não existem tags `[ASSUMPTION]` ou `[NOTE FOR PM]` sem tratamento; as quatro questões abertas são concretas e proporcionais à fase. A principal ressalva é que os limiares foram escolhidos sem baseline documentado, mas estão corretamente apresentados como recalibráveis após o piloto.

### Findings

- **low** Marcar os limiares quantitativos como hipóteses inline (§5, NFR-6; §8, SM-1 a SM-4; §11) — O índice explica a origem provisória em bloco, porém leitores que extraírem apenas NFR-6 ou uma métrica perdem esse contexto. *Fix:* adicionar “meta inicial de piloto” junto a cada limiar ou criar uma referência estável ao §11.

## Downstream usability — adequate

O PRD foi explicitamente construído como documento de cadeia superior. O Glossário é amplo, os IDs são únicos e contíguos (UJ-1–UJ-6, FR-1–FR-22, NFR-1–NFR-10, SM-1–SM-4 e SM-C1–SM-C3), e cada jornada tem protagonista nomeado com contexto embutido. Funcionalidades agrupam FRs de modo coerente, e as consequências testáveis são adequadas para extração em histórias e testes. Os links para Brief, SPEC e Constituição resolvem a partir do diretório do PRD.

A extração isolada ainda pode produzir ambiguidades porque alguns substantivos usados normativamente não estão no Glossário (`plano vigente`, `Convite ativo`, `estado substituído`) e porque a relação entre FRs e jornadas é apenas parcial nos textos introdutórios. Não é necessária uma matriz de rastreabilidade, mas os termos normativos precisam manter uma única semântica.

### Findings

- **medium** Normalizar termos de estado e acesso (§3, FR-2, FR-5, FR-16, FR-20) — `Convite ativo`, `Convite operacional`, `estado vigente`, `plano vigente` e `substituído` são usados sem definição formal, embora governem permissões. *Fix:* acrescentar ao Glossário os estados de Rolê/Convite ou substituir sinônimos por um vocabulário único ligado às transições.
- **low** Explicitar o alcance de “qualquer Pessoa Convidada” após estados terminais (§4) — Vários FRs isolados usam essa expressão sem repetir a condição de estado, e FR-22 depois bloqueia toda mutação. *Fix:* introduzir uma regra transversal de precedência dos estados terminais e referenciá-la nos grupos de funcionalidade.

## Shape fit — strong

O formato é adequado a um produto de consumo com UX significativa: seis jornadas compactas carregam os comportamentos sociais que dão sentido aos requisitos, sem criar personas artificiais. O documento equilibra narrativa estratégica, regras funcionais, NFRs, riscos, métricas e não objetivos. O adendo recebe corretamente decisões técnicas e alternativas rejeitadas, evitando contaminar o PRD com solução prematura.

O nível de formalidade também corresponde ao papel do PRD como entrada para UX, arquitetura, épicos e testes. Não há densidade excessiva de jornadas nem ausência de contexto humano; as jornadas cobrem criação, adesão, sugestão, declaração, consulta e conflito, os eixos essenciais da experiência.

### Findings

Nenhum achado substantivo.

## Mechanical notes

- IDs funcionais são contíguos e únicos de FR-1 a FR-22; NFRs, jornadas e métricas também não apresentam lacunas ou duplicações.
- Todas as jornadas UJ-1 a UJ-6 possuem protagonista nomeado.
- Não há tags `[ASSUMPTION]` inline; portanto, não há falha de roundtrip com o §11. Os limiares provisórios estão descritos em prosa, conforme observado no achado de Scope honesty.
- Há leve deriva terminológica entre `Local do Rolê`, “local declarado”, “outro local”, `plano vigente` e `estado vigente`; entre `Convite ativo` e `Convite operacional`; e entre Opção “fechada” e Opções que “fecham”.
- A grafia canônica do produto é “Bora Lá”, e o documento mantém o vocabulário de interface em Português do Brasil.
- Os links relativos para Product Brief, SPEC e Constituição são estruturalmente coerentes com a localização do PRD.
- Contagem de achados: 0 critical, 4 high, 6 medium e 3 low.
