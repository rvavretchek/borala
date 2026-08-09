# Bora Lá — Documento de Requisitos (MVP)

| | |
|---|---|
| **Produto** | Bora Lá — app móvel para definir onde um grupo de amigos se encontra |
| **Versão** | 0.2 (rascunho — MVP) |
| **Data** | 02/06/2026 |
| **Responsável** | Ricardo — Integrit Soluções Empresariais |

---

## 1. Visão geral

O **Bora Lá** resolve a indecisão clássica de um grupo de amigos sobre *onde se encontrar*. A partir da localização de cada participante, o app calcula um ponto médio geograficamente justo, lista os bares e botecos ao redor desse ponto e define o local do encontro por **sorteio** ou **eleição**.

O produto é **gratuito** e monetizado por **anúncios**, com ênfase em formatos não-intrusivos — sem pop-ups ou sequestro de tela. A facilidade de uso é requisito de primeira ordem: criar um rolê deve custar poucos toques.

**Proposta de valor:** acabar com o "ah, decide aí" do grupo, de forma rápida, divertida e justa para quem mora mais longe.

---

## 2. Escopo do MVP

**Dentro do MVP**
- Conta, grupos de amigos e criação de rolês.
- Localização por GPS ou endereço de casa.
- Cálculo do ponto médio no próprio dispositivo (sem trânsito).
- Listagem de bares/botecos dentro de um raio definido por rolê.
- Definição do local por sorteio e/ou eleição.
- Notificação do resultado e rota até o local.
- Anúncios não-intrusivos (banner discreto + base para estabelecimento patrocinado).

**Fora do MVP (não-objetivos por enquanto)**
- Refinamento do ponto médio considerando trânsito em tempo real.
- Roteador de mapas próprio (OSRM/Valhalla self-hosted).
- Chat dentro do app, histórico social, fotos do rolê.
- Pagamentos, cupons e programa de fidelidade com os bares.
- Painel/onboarding para estabelecimentos parceiros.

---

## 3. Glossário

- **Rolê:** um encontro específico criado por um organizador, com um conjunto de participantes, um raio e um modo de decisão.
- **Organizador:** quem cria o rolê e convida os participantes.
- **Participante:** amigo convidado que confirma presença e informa sua localização.
- **Ponto médio:** coordenada calculada que minimiza a soma das distâncias dos participantes (mediana geométrica).
- **Raio:** distância a partir do ponto médio dentro da qual os bares são buscados.

---

## 4. Atores

| Ator | Papel |
|---|---|
| **Organizador** | Cria o rolê, convida, define raio e modo de decisão. |
| **Participante** | Aceita o convite, informa localização, vota. |
| **Estabelecimento parceiro** | *(futuro)* Paga para aparecer em destaque. Fora do MVP. |

---

## 5. Requisitos funcionais

### Conta e autenticação
- **RF01** — Login social (Google e Apple), para reduzir fricção e atender exigências das lojas.
- **RF02** — Perfil com nome, foto e endereço de casa (opcional).
- **RF03** — Logout e exclusão de conta com remoção dos dados pessoais (LGPD).

### Grupos e amigos
- **RF04** — Criar grupos de amigos.
- **RF05** — Convidar amigos por link compartilhável ou contato.
- **RF06** — Visualizar e gerenciar membros de um grupo.

### Criação do rolê
- **RF07** — Organizador cria um rolê selecionando participantes de um grupo.
- **RF08** — Organizador define o raio de busca (campo pré-preenchido com default).
- **RF09** — Organizador escolhe o modo de decisão (sorteio, eleição ou híbrido).
- **RF10** — Envio de convites com notificação push aos participantes.

### Localização do participante
- **RF11** — Participante escolhe a fonte da localização: **GPS** (no momento) ou **endereço de casa** (cadastrado).
- **RF12** — GPS capturado apenas com permissão explícita, somente no momento do rolê, nunca em segundo plano.
- **RF13** — Endereço de casa informado via Places Autocomplete, geocodificado uma única vez e armazenado.
- **RF14** — Participante confirma presença no rolê.

### Cálculo do ponto médio
- **RF15** — Calcular a mediana geométrica das coordenadas dos participantes confirmados, no dispositivo, sem chamadas a APIs de rota.
- **RF16** — Recalcular o ponto médio quando um participante entra ou sai.

### Descoberta de bares
- **RF17** — Listar bares e botecos dentro do raio, a partir do ponto médio, com uma única chamada à API de places.
- **RF18** — Exibir, para cada local: nome, foto, avaliação, faixa de preço, distância do ponto médio e indicação de "aberto agora".
- **RF19** — Auto-expansão: se o número de resultados ficar abaixo de um limiar, ampliar o raio automaticamente e avisar o usuário.
- **RF20** — *(opcional)* Filtros básicos: faixa de preço, avaliação mínima, categoria.

### Decisão do local
- **RF21** — **Eleição:** cada participante vota em um local; vence o mais votado, respeitando prazo e quórum.
- **RF22** — **Sorteio:** seleção aleatória entre os candidatos, com animação.
- **RF23** — **Híbrido:** sorteio entre os locais mais votados.
- **RF24** — Regras de quórum e de desempate aplicadas conforme o modo.
- **RF25** — Organizador pode encerrar a decisão manualmente.

### Fechamento e compartilhamento
- **RF26** — Notificar todos os participantes do local definido.
- **RF27** — Botão "traçar rota" que abre o app de mapas nativo a partir da localização de cada um.
- **RF28** — Exibir detalhes do local: endereço, telefone e horário de funcionamento.

### Monetização
- **RF29** — Exibir bares patrocinados em destaque na lista, claramente sinalizados como "Patrocinado".
- **RF30** — Banner discreto (rede de anúncios) no rodapé das telas de listagem.
- **RF31** — *(opcional)* Anúncio recompensado, acionado pelo usuário, para desbloquear recursos (ex.: ampliar raio).

---

## 6. Requisitos não-funcionais

- **RNF01 — Privacidade / LGPD:** localização é dado pessoal. Coletar apenas com consentimento, só no momento do rolê, nunca em segundo plano; permitir exclusão de conta e dados; política de privacidade clara.
- **RNF02 — Custo de API:** arquitetura limitada a ~1 chamada paga por rolê (a busca de places). Cache de geocodificação (endereço fixo) e de resultados de places por região/janela de horário.
- **RNF03 — Desempenho:** ponto médio instantâneo (cálculo local); lista de bares carregada em até ~3 s em condições normais de rede.
- **RNF04 — Usabilidade:** criar um rolê em poucos toques; defaults sensatos em todos os campos; nada obrigatório que possa ser inferido.
- **RNF05 — Anúncios não-intrusivos:** proibidos pop-ups e intersticiais no meio do fluxo de decisão; intersticial, se usado, apenas em transições naturais (ex.: após o fechamento).
- **RNF06 — Plataformas:** Android e iOS. *(Decisão pendente: nativo vs. cross-platform — ver questões em aberto.)*
- **RNF07 — Resiliência:** tratar perda de conexão e ausência de resultados sem travar o fluxo.
- **RNF08 — Segurança:** tráfego sob TLS; tokens de sessão protegidos; mínimo de dados sensíveis persistidos.
- **RNF09 — Acessibilidade:** contraste, tamanho de toque e leitura por leitor de tela nos fluxos principais.

---

## 7. Casos de uso principais

### UC01 — Criar e disparar um rolê
**Ator:** Organizador
1. Seleciona um grupo e os participantes.
2. Define o raio (ou aceita o default) e o modo de decisão.
3. Confirma e dispara os convites.
4. O sistema notifica os participantes.

### UC02 — Participar e informar localização
**Ator:** Participante
1. Recebe a notificação e abre o rolê.
2. Confirma presença.
3. Escolhe GPS ou endereço de casa.
4. O sistema registra a coordenada e recalcula o ponto médio.

### UC03 — Definir o local
**Ator:** Participantes / Organizador
1. O sistema apresenta os bares dentro do raio.
2. **Eleição:** cada um vota; ao atingir quórum ou prazo, vence o mais votado (empate → sorteio entre empatados).
   **Sorteio:** o sistema sorteia entre os candidatos com animação.
3. O local é definido.

### UC04 — Consultar o local e ir até lá
**Ator:** Participante
1. Recebe a notificação do local definido.
2. Visualiza endereço, horário e telefone.
3. Toca em "traçar rota" e o mapa nativo abre a navegação.

---

## 8. Priorização (MoSCoW)

**Must have**
- RF01, RF04, RF05, RF07, RF08, RF10 (conta, grupo, criação e convite)
- RF11, RF12, RF13, RF14 (localização)
- RF15, RF16 (ponto médio)
- RF17, RF18 (lista de bares)
- RF22 (sorteio — mais simples de implementar, sem prazo/quórum)
- RF26, RF27, RF28 (fechamento e rota)
- RF30 (banner como piso de receita)

**Should have**
- RF02, RF03 (perfil completo e exclusão LGPD)
- RF19 (auto-expansão do raio)
- RF21, RF24, RF25 (eleição com regras)
- RF29 (bar patrocinado — início da camada comercial)

**Could have**
- RF20 (filtros)
- RF23 (modo híbrido)
- RF31 (anúncio recompensado)
- Histórico de rolês

**Won't have (nesta versão)**
- Ponto médio com trânsito em tempo real
- Roteador de mapas self-hosted
- Chat, pagamentos, cupons, fidelidade
- Onboarding de estabelecimentos parceiros

> Sugestão de sequência: o **sorteio** é o caminho mais curto para um app funcional e divertido (não exige quórum, prazo nem desempate). A **eleição** entra logo em seguida como Should.

---

## 9. Regras de negócio

- **RN01** — Ponto médio = mediana geométrica das coordenadas dos participantes confirmados.
- **RN02** — Raio default de 3 km, ajustável por rolê.
- **RN03** — Auto-expansão: se a busca devolver menos que o limiar (ex.: 5 locais), ampliar o raio em passos até um teto e avisar.
- **RN04** — Eleição encerra por quórum (ex.: maioria dos confirmados) ou por prazo, o que ocorrer primeiro.
- **RN05** — Empate na eleição é resolvido por sorteio entre os empatados.
- **RN06** — Coordenadas capturadas por GPS são usadas apenas para o rolê e descartadas após o fechamento.
- **RN07** — A busca de places é servida a partir de cache sempre que houver resultado válido para a região e a janela de horário; só há chamada paga ao provedor em caso de cache miss ou expiração.

---

## 10. Considerações técnicas

### Decisões de arquitetura

- **Ponto médio no device:** algoritmo de Weiszfeld com distância de Haversine. Custo zero de API; precisão suficiente, pois o ponto serve apenas como centro do raio de busca.
- **Cache da busca de places como decisão de arquitetura (não otimização opcional):** o custo de API e a viabilidade do modelo gratuito dependem dele. Como os bares de uma região mudam pouco, o resultado de uma busca é cacheado por **região (geohash) + janela de horário** e reutilizado por todos os rolês naquela área. Em regiões já consultadas, o custo de API por rolê tende a zero. A geocodificação de endereço fixo é cacheada permanentemente. Esse cache deve existir desde a primeira versão.
- **Uma chamada paga por rolê (no pior caso):** apenas a busca de places, e somente em cache miss. Toda a triagem geográfica é local.
- **Provedor de places — decisão tomada:** **Google Places no MVP**, por ser a melhor fonte de dados de bar/boteco no Brasil (horário e avaliação confiáveis, essenciais para a confiança do usuário), pedindo o **mínimo de campos por busca** para conter o SKU e cacheando tudo. Caminho de escala: migrar a descoberta de POIs para **OpenStreetMap self-hospedado** (Overpass + extract do Brasil) quando o custo dos campos ricos pesar, complementando metadados onde faltarem. **Foursquare descartado** por ora: a mudança de preços de 01/06/2026 tirou do free tier justamente os campos necessários (horário, avaliação, fotos → Premium, sem cortesia) e a cobertura de botecos no Brasil é inferior.
- **Atenção a campos e custo:** em qualquer provedor, os campos que o produto precisa (aberto agora, avaliação, faixa de preço, foto) são os mais caros. O custo é função dos campos pedidos, não só do número de chamadas — o que reforça o cache e a parcimônia de campos.

### A confirmar

- **Backend:** necessário para grupos, rolês, votação e notificações push. Avaliar Firebase (rápido para MVP) vs. backend próprio.
- **Stack mobile:** avaliar cross-platform (Flutter/React Native) para cobrir iOS e Android com um único time.
- **Free tier do Google:** as fontes de 2026 divergem entre o histórico crédito mensal de US$ 200 e uma possível migração para planos pagos. Confirmar no Google Cloud Console antes de dimensionar o custo.
- **Licença ODbL (caso use OSM):** atribuição obrigatória e cláusula share-alike; avaliar implicações jurídicas para uso comercial antes de adotar.

---

## 11. Métricas de sucesso

- Rolês criados por semana.
- Taxa de conclusão (rolê criado → local definido).
- Tempo médio para fechar um rolê.
- Retenção de grupos (grupos que criam mais de um rolê).
- Receita por rolê / eCPM dos formatos de anúncio.

---

## 12. Questões em aberto

1. **Stack mobile** — nativo vs. cross-platform.
2. **Estratégia inicial de anúncio** — começar só com banner de rede (AdMob) ou já construir a camada de bar patrocinado?
3. **Backend** — Firebase para acelerar o MVP ou backend próprio desde o início?
4. **Ponto médio: soma vs. pior caso** — minimizar a soma das distâncias (default) ou garantir que ninguém fique muito longe (minimax)?

> Resolvida nesta versão: **provedor de places** → Google Places no MVP, com OpenStreetMap self-hospedado como caminho de escala. Ver seção 10.
