# Revisão adversarial — organizar sem governar

## Escopo e critério

Revisão de `DESIGN.md` e `EXPERIENCE.md` contra a Constituição, o PRD final, a SPEC e seus companions, o memlog e o mock aprovado `direction-assinatura-brinde-refinada.html`. O mock é evidência da direção aceita; os spines prevalecem. Esta revisão não altera os spines.

## Achados críticos

### C-1 — A métrica agregada ocupa o papel visual de principal prova social

**Evidência/local:** `DESIGN.md:33-38`, `DESIGN.md:83-87`, `DESIGN.md:140`, `DESIGN.md:148`, `DESIGN.md:172` e mock aprovado, linhas 30-34 e 69-73. `7 pessoas` recebe tipografia métrica, laranja de marca, invólucro branco elevado e sombra; a explicação semântica fica em `caption` de 10 px/baixo contraste.

**Risco:** mesmo sem barra ou percentual, a combinação tamanho + cor + elevação transforma adesão em argumento persuasivo e aproxima a tela da prova social comercial. A pessoa pode ler o número como quórum informal, confirmação ou recomendação do produto.

**Correção:** tornar a semântica inseparável da métrica e visualmente legível (`7 pessoas marcaram Topo ou Tudo bem` como unidade); não usar `caption` para a ressalva; reduzir pelo menos um dos sinais de destaque (cor, escala ou sombra); validar em teste que participantes não interpretam o módulo como confirmação, maioria ou indicador de que “já vale ir”.

### C-2 — “Quem já topou?” precede “Dar o seu pitaco” e pode induzir conformidade

**Evidência/local:** `EXPERIENCE.md:92`, `EXPERIENCE.md:176` e mock aprovado, linhas 75-80. Nas duas variações, a consulta nominal aparece antes da ação de responder.

**Risco:** expor primeiro os Nicks de `Topo` converte o produto em mecanismo de influência social: a pessoa vê quem aderiu antes de formar/registrar sua própria posição. A ordem pode ser interpretada como recomendação de seguir o grupo.

**Correção:** não fixar `Quem já topou?` antes de responder. Adotar ordem neutra ou contextual, testar as duas ordens e documentar que nenhuma ação recebe destaque por potencial de conformidade. Se a lista nominal continuar disponível antes da resposta, incluir explicitamente no teste de compreensão a hipótese de influência percebida.

## Achados altos

### A-1 — A ordenação neutra das Opções não possui algoritmo verificável

**Evidência/local:** `DESIGN.md:176` diz que aderência não altera ordem; `EXPERIENCE.md:94` apenas afirma que a ordem não comunica ranking.

**Risco:** falta definir ordem inicial, inserção de nova Opção e estabilidade após respostas, correções, inativação e reativação. Uma implementação plausível pode ordenar por contagem, recência ou autoria e criar ranking implícito.

**Correção:** especificar uma regra estável e não social (por exemplo, ordem de criação persistente), sem reordenação por Respostas, contagens, Pessoa Criadora, correção ou reativação; cobrir isso com critério de aceitação.

### A-2 — A interface de Declaração não exige tornar visível a igualdade de poder

**Evidência/local:** `EXPERIENCE.md:22` registra a regra global, mas `EXPERIENCE.md:60`, `EXPERIENCE.md:96`, `EXPERIENCE.md:124` e UJ-4 não exigem que a superfície informe que qualquer Pessoa Convidada identificada pode declarar. `DESIGN.md:178` fala apenas de separar contagens e explicar consequências.

**Risco:** sem esse reforço no ponto de ação, a posição do CTA, a autoria anterior ou o contexto da Pessoa Criadora podem ser lidos como mandato. A igualdade existe no documento, mas pode desaparecer na tela.

**Correção:** incluir no contrato do `declaration-panel` texto/semântica de que qualquer pessoa identificada pode registrar algo já combinado fora do produto; proibir badges, rótulos, ordem de ações ou destaque especial para a Pessoa Criadora.

### A-3 — “Primeira Declaração válida” atribui legitimidade social a uma corrida técnica

**Evidência/local:** `EXPERIENCE.md:202`; em contraste, `EXPERIENCE.md:221` explica corretamente que a primeira gravação é controle técnico, não regra social.

**Risco:** “válida” pode soar como decisão reconhecida/aprovada, e não apenas como primeira persistência concorrente.

**Correção:** usar terminologia técnica e factual de forma consistente: “primeira Declaração persistida com sucesso fica vigente provisoriamente; isso não determina legitimidade social”. Repetir essa formulação no conflito e no histórico.

### A-4 — Confirmações podem ritualizar aprovação pelo sistema

**Evidência/local:** `DESIGN.md:178`; `EXPERIENCE.md:96`, `EXPERIENCE.md:124` e questão aberta em `EXPERIENCE.md:235`. “Consequências precedem a confirmação” não distingue revisão informativa de uma segunda aprovação.

**Risco:** um modal de “confirmar decisão” pode fazer o Bora Lá parecer homologador da decisão ou criar uma autoridade adicional, contrariando o PRD e a própria ressalva do spine.

**Correção:** resolver a questão aberta antes dos mocks finais. Para definir Local, preferir revisão inline no mesmo gesto, rotulada como registro do que as pessoas combinaram, sem linguagem de aprovação, consenso ou dupla confirmação. Reservar confirmação destrutiva inequívoca para cancelamento/Outro Rolê conforme o contrato normativo.

### A-5 — O compartilhamento não tem contrato de conteúdo suficiente para impedir governo fora do app

**Evidência/local:** `EXPERIENCE.md:122` exige mensagem “factual”, mas não define campos, verbos proibidos nem tratamento do agregado. UJ-1 termina no envio manual (`EXPERIENCE.md:166-170`).

**Risco:** uma mensagem gerada como “7 pessoas já toparam”, “local escolhido” ou “confirme sua presença” transportaria quórum, decisão algorítmica ou coerção ao canal social, mesmo que a tela interna seja correta.

**Correção:** definir templates por estado com linguagem canônica, link vivo e data/hora da fotografia; proibir “confirmados”, “mais votado”, “vencedor”, “escolhido pelas respostas” e chamadas coercivas. Quando houver agregado, escrever integralmente `Topo + Tudo bem` e nunca usá-lo como justificativa da Declaração.

### A-6 — Cancelamento terminal por qualquer pessoa não recebe proteção contra aparência de autoridade unilateral

**Evidência/local:** `EXPERIENCE.md:62`, `EXPERIENCE.md:96`, `EXPERIENCE.md:115`, `EXPERIENCE.md:124`. O fluxo cobre consequência e terminalidade, mas não a microcopy que distingue capacidade técnica de legitimidade social.

**Risco:** o CTA pode ser lido como poder administrativo, especialmente se destacado no plano ou associado à Pessoa Criadora. Como a ação encerra o Rolê para todos, a aparência de “controle do evento” é particularmente forte.

**Correção:** manter cancelamento contextual, sem destaque de administração; explicar que qualquer pessoa identificada pode registrar cancelamento excepcional já necessário no contexto social; mostrar consequência terminal, autoria e momento; nunca usar “gerenciar”, “encerrar para o grupo” ou “cancelamento pelo organizador”.

## Achados médios

### M-1 — “Quantos tão a fim?” é semanticamente mais amplo que `Topo + Tudo bem`

**Evidência/local:** `DESIGN.md:150`, `DESIGN.md:187`, mock aprovado, linhas 69-72; `EXPERIENCE.md:46` e `EXPERIENCE.md:90` definem o cálculo correto.

**Risco:** o rótulo coloquial sugere interesse geral/comparecimento, enquanto o valor agrega duas Respostas de semânticas diferentes. Em Rolê com várias Opções, também pode ficar obscuro de qual universo vem a contagem. Isso favorece leitura de adesão consolidada.

**Correção:** definir explicitamente no componente a fonte e o escopo do agregado em cada estado e manter a frase explicativa em tamanho de corpo. Testar “Quantos tão a fim?” contra uma forma factual; se mantido, ele nunca pode aparecer desacompanhado de `Topo ou Tudo bem`.

### M-2 — “Dar o seu pitaco” aproxima Resposta de votação/opinião competitiva

**Evidência/local:** `EXPERIENCE.md:92`, `EXPERIENCE.md:176` e mock aprovado, linhas 76 e 79.

**Risco:** “pitaco” é amigável, mas sugere emitir opinião sobre alternativas e pode reforçar o modelo mental de enquete; “Meu pitaco” ainda transforma uma Resposta contextual por Opção numa posição global.

**Correção:** testar compreensão com `Responder sobre os locais`/`Dar minhas respostas`; se a voz aprovada mantiver “pitaco”, não usar `Meu pitaco` como rótulo global sem indicar que há uma Resposta independente por Opção e que ela não é voto.

### M-3 — A IA prioriza Interesse Geral antes das Opções e pode funcionar como âncora de legitimidade

**Evidência/local:** `EXPERIENCE.md:59` estabelece `Interesse Geral → Opções...`; o convite também põe o agregado em grande destaque antes da participação (`EXPERIENCE.md:89-92`).

**Risco:** repetir adesão agregada antes de toda avaliação de Opção cria enquadramento de “o grupo já está indo”, pressionando respostas subsequentes. Isso é governo por arquitetura, ainda que não haja cálculo de vencedor.

**Correção:** justificar/testar a ordem sob a contramétrica de ausência de pressão; considerar estado vigente e ações neutras antes da prova social na experiência identificada; não repetir o agregado em cada etapa ou ao lado de Declarações.

### M-4 — Estados selecionados das quatro Respostas não têm restrições visuais suficientes

**Evidência/local:** `DESIGN.md:177` exige peso inicial igual e “mais de um sinal visual”, mas não limita cores, ícones, escala ou posição após seleção; `EXPERIENCE.md:95` trata comportamento, não hierarquia visual.

**Risco:** a implementação pode dar a `Topo` verde, check, animação ou destaque festivo e às demais respostas aparência negativa, estabelecendo a resposta socialmente desejável.

**Correção:** especificar tratamento selecionado estruturalmente equivalente para as quatro opções; proibir celebração, check exclusivo, verde de sucesso, mudança de tamanho e reordenação para `Topo`. Diferenciação deve comunicar seleção e semântica, não desirabilidade.

### M-5 — Separar “ativas” de “inativas” pode parecer endosso sem explicação da autoria

**Evidência/local:** `EXPERIENCE.md:59` coloca Opções ativas antes das inativas; `EXPERIENCE.md:94` mantém inativas consultáveis, mas não exige mostrar quem inativou, quando e que qualquer pessoa pode reativar no próprio contexto.

**Risco:** a seção “inativas” pode ser entendida como opções rejeitadas pelo grupo ou desqualificadas pelo sistema, especialmente sem regra de maioria.

**Correção:** rotular como estado operacional, não resultado; mostrar autoria/momento da inativação e ação equivalente de reativação enquanto permitido; evitar “descartadas”, “eliminadas” ou contagens como explicação.

### M-6 — Correção versus Outro Rolê ainda depende de uma interpretação individual da decisão social

**Evidência/local:** `EXPERIENCE.md:96`, `EXPERIENCE.md:224-225`; as escolhas são separadas, mas o spine não fixa a explicação de que a classificação deve refletir conversa externa já ocorrida.

**Risco:** uma pessoa pode usar “Correção” para substituir uma decisão real sem novo Rolê, e a interface parecer autorizá-la a reinterpretar o grupo.

**Correção:** antes das escolhas, perguntar factualmente se o registro estava errado no momento em que foi feito ou se o grupo decidiu mudar depois; explicitar consequências e que o Bora Lá não determina qual caso ocorreu; manter autoria completa no histórico.

## Achados baixos

### B-1 — “O grupo passou a organizar Outro Rolê” pode afirmar uma intenção coletiva não provada

**Evidência/local:** tratamento de Substituído em `EXPERIENCE.md:98` não fixa microcopy, mas o vocabulário consolidado da jornada propõe afirmação coletiva; o spine só exige apontar para Outro Rolê.

**Risco:** atribui vontade ao grupo quando o sistema conhece apenas uma ação autorada.

**Correção:** usar formulação factual: `Existe Outro Rolê ligado a este. Registrado por [Nick], [momento]. Abrir o Rolê atual.` Evitar narrar o que “o grupo passou a” fazer.

### B-2 — O histórico pode virar placar de influência se conflitos forem destacados por pessoa

**Evidência/local:** `DESIGN.md:179-180`; `EXPERIENCE.md:50`, `EXPERIENCE.md:97`, `EXPERIENCE.md:137` exigem autoria e auditabilidade, mas não limitam agregação, badges ou estatísticas por autor.

**Risco:** uma implementação pode transformar autoria necessária em reputação, frequência de correções ou disputa entre pessoas.

**Correção:** limitar histórico a sequência factual por evento, sem contagem por pessoa, badges, avatares de status, “mais ativo” ou destaque de quem prevaleceu; autoria serve à auditabilidade, não à reputação.

## Síntese

Os contratos rejeitam explicitamente voto, ranking, quórum, autoridade da Pessoa Criadora e substituição do canal social. O risco residual mais sério não está na terminologia proibida, mas na composição: o agregado tem saliência de prova social; a lista nominal antecede a resposta; e ordem de Opções, templates de compartilhamento, Declarações e cancelamento ainda carecem de regras implementáveis que impeçam autoridade ou influência implícita.
