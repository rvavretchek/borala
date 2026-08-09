  Esta foi uma conversa inicial no Claude para dar a primeira forma ao app web Bora Lá:
  
	  Me ajude a levantar os requisitos da aplicação móvel Bora Lá. Trata-se de um app que, para um grupo de amigos cadastrados, identifica o ponto médio, levando em conta distância e trânsito, elenca os bares e botecos dentro de um raio (fixo ou definivel?) e fecha (por sorteio ou eleição) o local do encontro. É importante que esse app seja de fácil uso, pois É ideia é monetizar com anúncios, sendo o app gratuito. A forma de anúncio ainda não está definida, mas gostaria de sugestões para maximialzar ganhos sem "onerar" o usuário, com pop ups e sequestros de telas.

Boa, o Bora Lá tem um caso de uso bem redondo. Antes de jogar os requisitos no papel, vale fixar três decisões de produto que mudam tudo o resto:

**De onde vem a localização de cada pessoa?** Isso define metade dos requisitos. Três modelos possíveis: (a) endereço fixo cadastrado no perfil, (b) localização em tempo real no momento de criar o rolê, ou (c) o organizador define um "ponto de partida" por pessoa manualmente. O mais útil e fácil costuma ser o (b) com fallback pro (a) — mas tempo real implica LGPD, permissão de localização e a decisão de só capturar no momento do convite, nunca em background.

**"Ponto médio" é centróide geométrico ou ponto que minimiza tempo total?** São coisas bem diferentes. O centróide (média das coordenadas) é grátis e instantâneo, mas ignora trânsito e pode cair num rio ou numa via expressa. O ponto que minimiza a soma dos tempos de deslocamento exige chamadas a uma API de rotas (matriz origem-destino) e isso custa por requisição — num app gratuito monetizado por ads, esse custo come margem. Sugiro começar pelo centróide ponderado e só refinar com trânsito quando os resultados forem listados (calcular tempo real apenas pros bares candidatos, não pra um grid de pontos).

---

## Requisitos funcionais

**Cadastro e grupos**

- RF01 — Cadastro/login (recomendo social login: Google/Apple, reduz fricção e é exigência da Apple se tiver login).
- RF02 — Criar grupos de amigos e convidar por link/contato.
- RF03 — Perfil com localização-base opcional e preferências (tipo de lugar, faixa de preço).

**Criação do encontro**

- RF04 — Organizador cria um "rolê", seleciona participantes do grupo e dispara convites.
- RF05 — Cada convidado confirma presença e fornece seu ponto de partida (tempo real ou cadastrado).
- RF06 — Sistema calcula o ponto de encontro a partir dos confirmados (recalcula conforme gente entra/sai).

**Descoberta de locais**

- RF07 — Listar bares/botecos dentro do raio a partir do ponto, via API de places.
- RF08 — Filtros: aberto agora, faixa de preço, avaliação, categoria.
- RF09 — Para cada candidato, exibir tempo/distância de deslocamento por participante (ou pelo "pior caso", quem mora mais longe).

**Decisão**

- RF10 — Modo de fechamento configurável: eleição (votação) ou sorteio.
- RF11 — Votação com prazo/quórum e regra de desempate definida.
- RF12 — Sorteio com animação (é onde mora a diversão do app) — e o híbrido vale ouro: _sortear entre os N mais votados_.
- RF13 — Notificar todos do local fechado, com botão "traçar rota" abrindo o mapa nativo.

---

## Sobre suas duas perguntas

**Raio fixo ou definível?** Definível pelo organizador, com default sensato (2–3 km) e _auto-expansão_: se vierem menos de X resultados, o app alarga o raio sozinho e avisa. Isso mantém o uso fácil (ninguém _precisa_ mexer) sem deixar a tela vazia numa região com poucos bares.

**Sorteio ou eleição?** Os dois, escolhidos por rolê. Eleição agrada quem é mais controlador; sorteio resolve a indecisão clássica do grupo ("ah, tanto faz, decide aí"). O híbrido (sorteio entre os mais votados) é provavelmente o modo que vira a assinatura do produto.

---

## Monetização sem sequestrar a tela

Aqui está a melhor notícia: **seu inventário de anúncio já é o conteúdo do app.** Um app que lista bares e fecha onde o grupo vai é praticamente uma máquina de publicidade nativa contextual. A ordem de prioridade que eu seguiria:

1. **Estabelecimentos patrocinados (native ads).** O bar paga para aparecer em destaque ou no topo da lista de candidatos, claramente sinalizado como "Patrocinado". É relevante (a pessoa _quer_ descobrir bares), não interrompe nada e tem ticket muito maior que banner de rede. Esse é o coração do modelo.
    
2. **Comissão/lead por conversão.** "Chegou pelo Bora Lá, primeira rodada com desconto." Você fecha parceria com os bares e cobra por grupo que aparece. Casa perfeitamente com o momento em que o local é definido — você sabe que aquele grupo vai comparecer.
    
3. **Rewarded ads opcionais.** O usuário _escolhe_ assistir um vídeo para desbloquear algo (raio maior, mais um sorteio, remover o banner por uma semana). Não-intrusivo por definição: só roda se a pessoa apertar o botão.
    
4. **Banner discreto** de rede (AdMob) no rodapé das telas de listagem, como piso de receita enquanto o native/parceria não escala.
    

O intersticial, se usar, só no momento de transição natural — depois de fechar o local, na tela de confirmação, nunca no meio do fluxo de decisão. Mas eu deixaria isso por último; ele atrita justamente com o "fácil de usar".

---

## Não-funcionais que não dá pra ignorar

- **LGPD:** localização é dado pessoal sensível por inferência. Coletar só com consentimento explícito, só no momento do rolê, nunca em background, e deixar claro na política. Isso também é gate de aprovação nas lojas.
- **Custo de API de mapas/places:** projete cache agressivo (resultados de uma região por algumas horas), limite recálculos e considere alternativas ao Google (Overpass/OSM para o inventário de bares, ou Foursquare) para não inviabilizar a margem.
- **Performance percebida:** o cálculo do ponto + listagem precisa parecer instantâneo. Mostre o centróide na hora e refine o trânsito em segundo plano.

---

Duas decisões que destravariam o resto: **o ponto de partida vai ser tempo real ou cadastrado?** e **você quer começar já com a estratégia de bar patrocinado/parceria, ou validar primeiro com AdMob puro e só depois construir a camada comercial com os estabelecimentos?** A resposta a essa segunda muda bastante o escopo da v1.

Se quiser, depois disso eu consolido tudo num documento de requisitos formal (com casos de uso e priorização MoSCoW) pra v1.


	Para cada usuário ele tem a opção de utilizar GPS ou home do Google. Ponto que minimiza tempo total. Precisamos encontrar uma forma de reduzir as requisições de geolocalização

Antes de tudo, uma distinção importante sobre onde está o custo: a chamada de _geolocalização_ em si (pegar o GPS do aparelho) é grátis e local. O que custa, e o que precisa ser reduzido, é a **matriz de tempos de deslocamento** — cada par (origem × destino) que você manda pra API de rotas é cobrado. Com N amigos e M bares candidatos, o jeito ingênuo gasta N×M elementos. É isso que precisa encolher.

A boa notícia é que "minimizar tempo total" não exige avaliar o espaço inteiro. O destino final é sempre um bar **real** (problema discreto), então você só precisa de tempos precisos para um punhado de candidatos finais. A estratégia é um funil, do cálculo grátis ao caro:

**Camada 0 — Âncora (grátis, no device).** Calcule a mediana geométrica das origens (algoritmo de Weiszfeld com Haversine). É o ponto que minimiza a soma das distâncias em linha reta — não é a resposta final, mas diz _onde procurar bares_. Zero requisições.

**Camada 1 — Candidatos (1 chamada Places).** Busca os bares no raio em torno da âncora. Já filtra por aberto agora, rating, preço.

**Camada 2 — Triagem por linha reta (grátis, no device).** Calcula Haversine de cada origem a cada candidato e descarta os que já estão obviamente fora (soma de distâncias muito pior que o melhor). Reduz de M candidatos para uns top-8. Esse passo é o que mais economiza, e não custa nada.

**Camada 3 — Tempo de rota sem trânsito (1 chamada Distance Matrix).** N origens × ~8 destinos, _sem_ `departure_time`. Roteamento real, mais barato porque não pede trânsito ao vivo. Ranqueia e reduz para os 3 finalistas.

**Camada 4 — Trânsito ao vivo (1 chamada, N × 3).** Só nos 3 finalistas, e idealmente só quando o grupo está perto de fechar / perto do horário. Esse é o único item caro, rodando no menor volume possível.

Resultado: ~3 chamadas pagas por rolê (1 Places + 2 Matrix), com a parte cara restrita a 3 destinos — ordens de magnitude abaixo do ingênuo.

**Cache por cima de tudo.** Arredonde cada origem para um geohash (~precisão 6, células de ~600 m) e use como chave `(origem_geohash, place_id, janela_horária)`. Trânsito varia por horário, então a janela entra na chave (bucket de hora + dia útil/fim de semana). Encontros recorrentes do mesmo grupo passam a ser quase grátis. Quem usa endereço fixo cacheia lindamente; dá até pra pré-computar as matrizes dos grupos frequentes na madrugada.

---

Dois pontos técnicos sobre as decisões que você tomou:

**Sobre "home do Google":** cuidado com a expectativa. Não existe API pública que leia o endereço "Casa" salvo na conta Google de outra pessoa — isso é privado. O que é viável e dá o mesmo resultado: o usuário define o endereço de casa no app via Places Autocomplete, você geocodifica **uma vez** e guarda a coordenada. Endereço fixo geocodifica uma só vez e cacheia pra sempre; o modo GPS é o único que precisa de chamada on-demand a cada rolê.

**Sobre trânsito ao vivo:** ele é justamente o recurso premium caro dos providers. Se o custo apertar, vale considerar rodar seu próprio roteador (OSRM ou Valhalla com dados do OpenStreetMap Brasil) — você já tem perfil de infra pra isso, e ficaria com roteamento ilimitado de graça. O porém: o open-source não traz trânsito em tempo real nativo, só velocidades históricas. Um meio-termo prático é roteamento self-hosted nas camadas 2-3 e API paga com trânsito ao vivo só na camada 4.

Quer que eu levante os preços atuais e compare Google Distance Matrix, Mapbox e HERE pra você dimensionar o custo por rolê? Os números mudam com frequência, então faria sentido eu buscar os valores vigentes em vez de chutar.


	O cálculo só precisa ser feito para o ponto médio. Daí levantamos uma lista de bares e botecos dentro de um raio pré estabelecido. O resto, para o MVP, é definir qual bar/boteco

Entendido, e esse corte deixa o MVP bem mais enxuto. Mas ele esbarra numa sutileza que vale explicitar, porque muda o custo de API a zero:

O "ponto médio considerando trânsito" é, na verdade, o pedaço **mais caro** de calcular com precisão — o ponto ótimo é contínuo e não tem fórmula fechada quando entra trânsito, então você teria que amostrar vários pontos no mapa e avaliar cada um via API de rotas. Só que, no seu fluxo, o ponto médio serve apenas como **centro do raio de busca de bares**. Se ele se deslocar 300-500 m, a lista de bares dentro do raio muda pouquíssimo. Ou seja: gastar API pra refinar o ponto médio com trânsito é pagar caro por uma precisão que não muda o resultado.

A recomendação pro MVP é calcular o ponto médio como **mediana geométrica** (Weiszfeld + Haversine), rodando no próprio device, grátis. Isso dá o ponto que minimiza a soma das distâncias em linha reta — justo o suficiente, e quem mora mais longe puxa o ponto na direção dele naturalmente. Trânsito fica de fora _do cálculo do ponto_, e tudo bem, porque ele é só o centro do raio.

Com isso, o custo de API por rolê cai para essencialmente **uma chamada** (a do Places, pra listar os bares no raio). Pra um app gratuito monetizado por ads, isso é o ideal — você quase não tem custo variável por uso.

Então o MVP fica:

1. Cada amigo entra com GPS ou endereço de casa → coordenadas.
2. Mediana geométrica no device → ponto médio (zero API).
3. Uma chamada Places → bares/botecos no raio fixo.
4. Sorteio ou eleição → bar definido.

A única decisão que resta nessa parte: você aceita o ponto médio **geométrico puro** (grátis, ignora trânsito) pro MVP, ou faz questão de que o trânsito influencie o ponto mesmo custando algumas chamadas a mais? Minha aposta é geométrico no MVP e, se fizer sentido depois, você adiciona o refinamento por trânsito numa v2 — mas é decisão sua.

Uma coisinha só: "raio pré-estabelecido" no MVP é raio **fixo no código** (ex: 3 km pra todo mundo) ou fixo **por rolê** (o organizador escolhe na hora de criar)? As duas são simples, mas a segunda já dá bastante flexibilidade sem custo.


	Por rolê

Fechado. Com raio por rolê, só garanta que o campo já venha **pré-preenchido com um default** (uns 3 km) na tela de criação — assim quem não quer pensar nisso é só seguir, e quem quer ajustar tem o controle. Mantém o "fácil de usar" intacto. E vale manter a auto-expansão como rede de segurança: se o raio escolhido devolver pouquíssimos bares, o app alarga sozinho e avisa, pra ninguém cair numa tela vazia.

Com isso, as decisões estruturais do MVP estão tomadas:

- Localização por GPS ou endereço de casa (geocodificado uma vez via Places Autocomplete)
- Ponto médio por mediana geométrica no device, sem trânsito no MVP
- Lista de bares com uma chamada Places, raio definido por rolê com default
- Definição do bar por sorteio ou eleição (com o híbrido como possível diferencial)
- Monetização ancorada em bar patrocinado/parceria, AdMob como piso

Quer que eu consolide tudo isso num documento de requisitos do MVP — com requisitos funcionais e não-funcionais numerados, casos de uso principais e priorização MoSCoW? Fica sendo a base pra você estimar e tocar o desenvolvimento.


	Sim, faça isso.

Vou montar o documento de requisitos do MVP consolidando tudo o que decidimos.Pronto. O documento consolida tudo: visão, escopo do MVP (com os não-objetivos explícitos), requisitos funcionais numerados por módulo, não-funcionais, casos de uso, priorização MoSCoW, regras de negócio, considerações técnicas e as questões em aberto.

Dois pontos que vale você olhar com atenção, porque são decisões suas que ainda destravam escopo:

A priorização sugere o **sorteio como Must e a eleição como Should** — é o caminho mais curto pra um app funcional, já que sorteio não precisa de quórum, prazo nem desempate. Se você prefere lançar já com os dois modos, é só promover a eleição pra Must.

E acrescentei uma quinta questão em aberto que não tínhamos discutido: o ponto médio pode minimizar a **soma** das distâncias (o que eu já assumi como default) ou o **pior caso** (minimax — garantir que ninguém fique muito longe). Para grupos onde um amigo mora bem mais distante, essa escolha muda bastante a sensação de "justiça" do resultado.

Se quiser, o próximo passo natural seria eu pesquisar e comparar os custos por requisição de Google Places, Foursquare e OpenStreetMap, que é o que define a viabilidade da questão #1 e do modelo gratuito como um todo.


	OK

Vou pesquisar os preços atuais de cada um — eles mudam com frequência, então vale pegar os valores vigentes.Pesquisei os três. Antes dos números, o ponto que atravessa a decisão toda: **o custo não depende só do número de chamadas, mas dos campos que você pede.** E os campos que o Bora Lá precisa — aberto agora, avaliação, faixa de preço, foto — são justamente os mais caros em todos os provedores. Isso muda a conclusão de "1 chamada barata por rolê" para "1 chamada que pode não ser tão barata".

**Google Places (Nearby/Text Search)** É o de melhor qualidade de dados de bar/boteco no Brasil, com horário e avaliação confiáveis. A Places API não cobra uma taxa fixa por requisição — cobra por SKU, determinado pelos campos que você pede na resposta. Pedir só place_id, nome e geometria mantém você no SKU de dados básicos; pedir telefone, site e horário de funcionamento puxa para o SKU de dados de contato, com taxa por requisição bem mais alta, e rating/preço sobem ainda mais. A busca em si fica na ordem de US$ 0,017 por requisição no nível básico, mas com os campos ricos sobe bastante. Sobre o free tier há **sinais conflitantes nas fontes de 2026**: parte ainda descreve o histórico crédito mensal de US$ 200 aplicado a todos os SKUs, enquanto outras já falam em planos pagos (Starter US$ 100/mês com 50 mil chamadas, etc.). Vale confirmar isso direto no console antes de dimensionar. Dois limites técnicos relevantes: a Nearby Search devolve no máximo 60 resultados (20 por página, até 3 páginas) e o raio é limitado a 50.000 metros — mais que suficiente pro seu caso.

**Foursquare** Atenção que **a tabela de preços mudou ontem (1º de junho de 2026)** e o serviço acabou de passar por reestruturação. A partir de 1º de junho de 2026, as chamadas Pro (Place Search com campos default) são gratuitas até 500/mês, depois US$ 15 por mil (501 a 100 mil), caindo com o volume. O problema pro seu caso: horário, avaliação, fotos e tips são endpoints Premium, que não têm free tier — você paga desde a primeira chamada, a partir de cerca de US$ 18,75 por mil. Ou seja, exatamente os campos que você quer caem na faixa paga sem cortesia. Some a isso que os endpoints legados V3 foram descontinuados em 15 de maio de 2026, exigindo migração para a nova Places API, e que a cobertura de boteco no Brasil costuma ser inferior à do Google.

**OpenStreetMap** Aqui a distinção é crucial. Os _dados_ são grátis e abertos, mas os _serviços públicos_ não servem pro seu caso: você não deve basear uma aplicação que está vendendo nos servidores deles, pois podem mudar a qualquer momento e não há SLA nem garantias, e o uso pesado é proibido, com limite absoluto de 1 requisição por segundo. Aplicações comerciais e distribuídas devem rodar seu próprio serviço. Traduzindo: para o Bora Lá, OSM só faz sentido **self-hospedado** (Overpass + dados do Brasil), o que casa bem com a infra que você já opera — chamadas ilimitadas, custo só de servidor. As contrapartidas são a cobertura irregular de bares/botecos no Brasil (e metadados como horário frequentemente incompletos) e a licença: os dados vêm sob ODbL, que exige atribuição e tem cláusula share-alike — algo a avaliar juridicamente num produto comercial.

---

**Veredito para a questão #1.** O provedor importa menos do que a alavanca que você já tinha desenhado: o **cache**. Como bares numa região mudam pouco, cachear o resultado por região + janela de horário faz o custo real de API por rolê tender a zero nas regiões já consultadas — vários rolês no mesmo bairro reusam a mesma busca. Com cache agressivo, qualquer um dos três viabiliza o modelo gratuito.

A recomendação prática: **comece com Google Places** (melhor dado de boteco no Brasil, essencial pra confiança do usuário) pedindo o mínimo de campos por busca e cacheando tudo; o free tier cobre a fase de validação. Conforme escalar e o custo dos campos ricos pesar, migre a descoberta de POIs para **OSM self-hospedado**, complementando metadados onde faltarem. O Foursquare eu deixaria de fora por enquanto: a mudança de ontem tirou justamente os campos que você precisa do free tier, e a cobertura no Brasil não compensa.

Quer que eu atualize a questão #1 do documento de requisitos com essa conclusão e registre o cache como decisão de arquitetura (não só como otimização)?


	Sim, gere um doc atualizado

Agora vou ver as seções de regras de negócio, considerações técnicas e questões em aberto para atualizá-las.Documento atualizado para a versão 0.2. As mudanças:

A **escolha do provedor virou decisão tomada** na seção 10 — Google Places no MVP, OSM self-hospedado como caminho de escala, Foursquare descartado, com a justificativa de cada um e a ressalva sobre o custo dos campos ricos.

O **cache foi promovido a decisão de arquitetura**, com texto explícito de que precisa existir desde a primeira versão por ser o que viabiliza o modelo gratuito — não mais listado como simples otimização. Entrou também como regra de negócio (RN07).

A seção 10 agora separa **decisões de arquitetura** do que ainda está **a confirmar**, e dentro do "a confirmar" registrei dois pontos que a pesquisa levantou: a divergência das fontes sobre o free tier do Google (confirmar no console) e as implicações da licença ODbL caso use OSM.

E a **questão #1 saiu da lista de pendências**, com uma nota apontando para a seção 10. Restam quatro questões em aberto: stack mobile, estratégia de anúncio, backend e o critério do ponto médio (soma vs. pior caso).


	Faltou uma funcionalidade: No momento da criação do rolê, deve ser informado o horário de início e estimativa de duração para evitar bares/botecos fechados no período do rolê.

Boa pegada — isso é importante, porque sem essa janela o app pode sortear um bar que estará fechado, que é o pior desfecho possível. Vou incorporar e ajustar os pontos que isso afeta em cascata.Vou ver o glossário e a seção de criação do rolê para ajustá-los.Agora as regras de negócio — vou adicionar a regra de elegibilidade e ajustar a auto-expansão para contar bares elegíveis.Agora um ajuste nas considerações técnicas, porque a janela tem implicação direta no custo e no cache.Agora o caso de uso de criação e o MoSCoW. Vou ver a seção de casos de uso.Por fim, um ajuste no RNF de custo para o termo "janela" não colidir com o novo conceito de janela do rolê.Versão 0.3 pronta. A funcionalidade entrou e propaguei tudo o que ela afeta:

Criei o **RF32** (organizador informa horário de início e duração na criação) e o **RF33** (só bares abertos durante toda a janela entram no sorteio/eleição). Adicionei a **RN08** com a regra de elegibilidade e ajustei a **RN03** para que a auto-expansão do raio conte bares _elegíveis_, não só resultados brutos — senão o app poderia parar de expandir achando que tem 8 bares quando só 2 estarão abertos. O glossário ganhou o termo "janela do rolê", e o UC01 e o UC03 foram atualizados.

Dois pontos que vale você saber, porque a sua observação mexeu na economia do projeto:

O horário de funcionamento deixou de ser opcional e virou campo obrigatório da busca — e ele é justamente um dos campos "caros" (Contact data no Google). Já estava previsto, mas agora é inegociável, o que **fecha de vez a escolha pelo Google** no MVP, já que é a fonte com horário confiável no Brasil. Registrei isso na seção 10.

A boa notícia compensa: a verificação da janela é **lógica local sobre o cache**, não chamada extra. O horário do bar é estável e cacheia bem; o que muda entre rolês é só a janela, comparada no device. Ou seja, a funcionalidade não piora o custo por rolê.

Uma decisão fina que deixei em aberto na RN08: bar que abre mas **fecha no meio** do rolê (ex.: encerra às 23h num rolê até 1h) está como "exibido mas não sorteável". Se você preferir um comportamento mais frouxo — deixá-lo sorteável com aviso — é só me dizer que ajusto a regra.