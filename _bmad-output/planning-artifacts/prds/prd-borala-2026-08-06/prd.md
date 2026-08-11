---
title: "PRD: Bora Lá"
status: final
created: 2026-08-06
updated: 2026-08-11
---

# PRD: Bora Lá

## 0. Propósito do documento

Este PRD orienta produto, UX, arquitetura, histórias e testes do MVP gratuito do Bora Lá. Ele transforma em requisitos verificáveis o [Product Brief](../../briefs/brief-borala-2026-08-06/brief.md), a [SPEC](../../../specs/spec-borala-mvp/SPEC.md) e seus companions. A [Constituição](../../../../CONSTITUTION.md) prevalece sobre decisões de implementação. Os documentos de `design-artifacts/A-Product-Brief` são fontes históricas não normativas.

## 1. Visão

O Bora Lá ajuda grupos recorrentes a transformar a intenção dispersa de fazer um happy hour em um encontro que as pessoas reconhecem como real. Ele acompanha a conversa no canal social já usado pelo grupo e mantém um estado compartilhado de interesse, opções de local e decisões registradas.

A aposta central é **organizar sem governar**: o produto torna sinais sociais e o plano vigente visíveis, mas não calcula consenso, escolhe vencedores, exige quórum ou substitui a conversa. O MVP é gratuito, funciona sem grupo previamente cadastrado e busca provar valor antes de qualquer monetização.

## 2. Público-alvo e trabalhos a realizar

### 2.1 Público-alvo

Grupos recorrentes que organizam happy hours espontâneos em canais como WhatsApp, com respostas assíncronas e decisão social informal.

### 2.2 Trabalhos a realizar

- Criar e compartilhar um rolê rapidamente, começando pelas pessoas ou por um local.
- Perceber se há adesão real sem reler uma conversa extensa.
- Comparar opções de local sem transformar preferência em eleição automática.
- Registrar uma decisão tomada pelo grupo sem formalizar sua dinâmica social.
- Consultar o plano vigente e chegar ao local mesmo tendo acompanhado pouco da conversa.
- Corrigir informações erradas com autoria e histórico, sem apagar o que ocorreu.

### 2.3 Não usuários do MVP

- Organizadores de viagens, eventos formais, festas ou encontros que exigem lista controlada, convite individual ou moderação.
- Estabelecimentos que desejam anunciar, receber reservas ou vender pelo produto.
- Grupos que precisam de chat, votação formal, controle de acesso ou governança centralizada.

### 2.4 Jornadas principais

- **UJ-1. João cria um rolê a partir das pessoas.** João inicia um happy hour no canal do grupo, identifica-se, escolhe `Primeiro, quem topa`, informa a data e aceita ou edita o nome sugerido. Ele compartilha o link e reconhece valor quando as adesões deixam de estar dispersas na conversa.
- **UJ-2. Ana entra por um convite e sinaliza sua disposição.** Ana abre o link, vê antes de se identificar o nome, a data, o horário humano e quantas pessoas marcaram `Tô a fim` no Interesse Geral. Após identificar-se e escolher um nick, vê os detalhes e responde a cada Opção. Seu nick aparece apenas quando responde `Topo`.
- **UJ-3. Bruno sugere um local sem apagar a história.** Bruno adiciona nome, endereço ou referência e URLs opcionais. O sistema avisa sobre possível duplicidade sem bloquear. Outra pessoa corrige um endereço; o valor anterior permanece visível no histórico com autoria.
- **UJ-4. Carla registra que vai ter rolê.** Após a discussão externa, Carla declara `Vai ter rolê` e depois define uma Opção como Local do Rolê. O sistema não pede justificativa, quórum ou confirmação. Todos passam a ver o plano vigente e quem o declarou.
- **UJ-5. Diego consulta o rolê tarde.** Diego abre o link durante o encontro e vê primeiro eventual cancelamento; caso esteja ativo, consulta local, endereço, URLs e rota. Ao fim do Limite Final, o link informa apenas que o Rolê terminou.
- **UJ-6. Elisa encontra uma divergência concorrente.** Elisa tenta declarar outro local sobre uma versão já alterada. O sistema preserva a primeira declaração, mostra o conflito e deixa o grupo resolver no canal externo. Se o registro vigente estiver errado, uma Correção consciente mantém o mesmo Rolê; se o grupo mudou de local, será criado Outro Rolê sem respostas herdadas.

## 3. Glossário

- **Pessoa Criadora** — Identidade Verificada que cria o Convite; depois da criação, não possui autoridade adicional sobre o grupo.
- **Pessoa Convidada** — identidade verificada que entrou no Rolê por seu Convite e escolheu um Nick.
- **Identidade Verificada** — vínculo privado comprovado por um método de autenticação; dados de contato não são exibidos.
- **Nick** — nome público único dentro de um Rolê, associado à Identidade Verificada.
- **Convite** — link universal que dá acesso progressivo ao Rolê.
- **Convite Operacional** — Convite de um Rolê que ainda não atingiu estado terminal nem seu Limite Final.
- **Rolê** — encontro em uma Data; depois de definido, sua identidade social é Local do Rolê + Data. Possui `eventId` interno imutável.
- **Organização** — período anterior à definição do Local do Rolê.
- **Interesse Geral** — disposição em participar antes de haver uma Opção específica.
- **Opção** — local candidato durante a Organização, em estado ativa, inativa ou fechada.
- **Local do Rolê** — local vigente de um Rolê definido.
- **Resposta** — posição atual de uma Pessoa Convidada sobre uma Opção ou plano vigente: `Topo`, `Tudo bem`, `Não tenho certeza` ou `Não vou nesse`.
- **Declaração** — registro autorado de `Vai ter rolê`, definição do Local do Rolê ou cancelamento.
- **Correção** — ajuste autorado de registro errado que preserva o mesmo Rolê e seu histórico.
- **Outro Rolê** — novo encontro criado quando Local do Rolê ou Data realmente mudam; não herda Respostas.
- **Horário Aproximado** — referência operacional frouxa dentro da mesma Data, exibida como `Depois do expediente` ou `Por volta das HHh`.
- **Limite Final** — instante até o qual o Convite oferece consulta operacional.

## 4. Funcionalidades e requisitos funcionais

### 4.1 Identidade e acesso progressivo

**Descrição:** o Convite entrega valor antes da autenticação, mas exige Identidade Verificada e Nick para revelar detalhes pessoais ou permitir ações. Realiza UJ-1, UJ-2 e UJ-5.

#### FR-1: Identificar a Pessoa Criadora

A pessoa deve comprovar uma Identidade Verificada e escolher um Nick antes de criar um Rolê.

**Consequências testáveis:**
- A criação não é concluída sem autenticação e Nick.
- Dados da credencial não aparecem em nenhuma visão pública ou de Pessoa Convidada.

#### FR-2: Oferecer prévia pública do Convite

Qualquer pessoa com um Convite Operacional pode ver nome, Data, Horário Aproximado, Local do Rolê quando definido e o total agregado de pessoas que marcaram `Tô a fim` no Interesse Geral.

**Consequências testáveis:**
- A prévia não mostra nicks, respostas individuais, autoria, histórico ou dados de contato.
- Cancelamento vigente aparece antes de informações operacionais antigas.
- O agregado conta Pessoas Convidadas distintas cujo Interesse Geral vigente é `Tô a fim`; `Ainda não sei`, ausência de Interesse Geral e Respostas sobre Opções não entram nessa contagem.

#### FR-3: Identificar a Pessoa Convidada

Uma pessoa pode comprovar uma Identidade Verificada, escolher um Nick não usado no Rolê e então acessar detalhes e ações permitidas.

**Consequências testáveis:**
- O sistema rejeita Nick duplicado apenas dentro do mesmo Rolê.
- A mesma credencial recupera a identidade em outro aparelho; credenciais diferentes permanecem identidades separadas.
- Uma Correção de Nick preserva o valor anterior, a autoria e o momento da alteração.

### 4.2 Criação e compartilhamento

**Descrição:** a Pessoa Criadora inicia pelas pessoas ou por um local, sem cadastro prévio de grupo. Realiza UJ-1.

#### FR-4: Criar um Rolê por dois pontos de partida

A Pessoa Criadora pode escolher `Primeiro, quem topa` ou `Já tenho um local`, informar a Data e o Horário Aproximado e aceitar ou editar um nome sugerido.

**Consequências testáveis:**
- Sem local, a sugestão de nome começa com `Rolê`; com local, começa com `Rolê no {local}`.
- Cada criação produz `eventId` e Convite únicos, mesmo com nomes públicos repetidos.
- `Já tenho um local` cria a primeira Opção com os mesmos campos e regras das demais.

#### FR-5: Compartilhar o estado vigente

Qualquer Pessoa Convidada pode gerar uma mensagem pronta e abrir o compartilhamento nativo do aparelho.

**Consequências testáveis:**
- A mensagem sempre contém o Convite vivo.
- O sistema não publica automaticamente em canal externo.
- Ao reabrir o Convite, prevalece o estado vigente, não o texto da mensagem compartilhada.

### 4.3 Interesse, opções e respostas

**Descrição:** durante a Organização, o grupo registra Interesse Geral, cria múltiplas Opções e responde sem que o sistema determine resultado. Realiza UJ-2 e UJ-3.

#### FR-6: Registrar Interesse Geral

Uma Pessoa Convidada pode registrar e alterar sua disposição geral enquanto o Rolê não possui Local do Rolê.

**Consequências testáveis:**
- O Interesse Geral não escolhe Opção nem é convertido automaticamente em Resposta.
- A interface distingue Interesse Geral de Resposta sobre local.

#### FR-7: Criar Opção manual

Uma Pessoa Convidada pode criar uma Opção com nome, endereço ou referência e zero ou mais URLs.

**Consequências testáveis:**
- Os valores originais ficam congelados e identificados por autoria e momento.
- Similaridade de nome, rua, número próximo ou URL idêntica gera aviso e nunca bloqueia a criação.

#### FR-8: Corrigir ou complementar uma Opção

Uma Pessoa Convidada pode informar nome correto, corrigir endereço ou URL e acrescentar URLs.

**Consequências testáveis:**
- O nome original permanece preservado; o nome correto é um registro estruturado posterior.
- Valor substituído permanece no histórico, visualmente invalidado, com autoria e momento.
- Acrescentar URL não invalida URLs existentes.

#### FR-9: Inativar e reativar Opção

Qualquer Pessoa Convidada pode inativar ou reativar uma Opção durante a Organização.

**Consequências testáveis:**
- A Opção nunca é excluída e conserva Respostas e histórico.
- Uma Opção inativa não pode ser escolhida sem antes ser reativada.
- Ao definir o Local do Rolê, todas as Opções fecham, deixam de aceitar essas ações e permanecem consultáveis no histórico operacional.

#### FR-10: Responder em quatro níveis

Uma Pessoa Convidada pode manter uma Resposta atual por Opção: `Topo`, `Tudo bem`, `Não tenho certeza` ou `Não vou nesse`.

**Consequências testáveis:**
- `Topo` mostra Nick e contagem; as demais mostram apenas contagem.
- A troca de Resposta atualiza contagens e a lista nominal de modo atômico; ao sair de `Topo`, o Nick é removido na mesma operação.
- O silêncio não é contado como Resposta.

#### FR-11: Controlar a janela de Respostas

Respostas permanecem editáveis durante a Organização; após a definição, permanecem editáveis somente até o Horário Aproximado.

**Consequências testáveis:**
- A passagem do Horário Aproximado não encerra uma Organização ainda indefinida.
- Depois do Horário Aproximado de um Rolê definido, Respostas ficam somente leitura.

### 4.4 Declarações e conflitos

**Descrição:** qualquer Pessoa Convidada registra a decisão social sem autorização especial. Realiza UJ-4 e UJ-6.

#### FR-12: Declarar que vai ter rolê

Qualquer Pessoa Convidada pode declarar `Vai ter rolê` sem definir um Local do Rolê.

**Consequências testáveis:**
- A Declaração mostra Nick e momento.
- Nenhum quórum, maioria, ranking ou conversão de Respostas é aplicado.
- Opções continuam abertas enquanto não houver Local do Rolê.

#### FR-13: Definir o Local do Rolê

Qualquer Pessoa Convidada pode declarar uma Opção ativa como Local do Rolê.

**Consequências testáveis:**
- A Declaração mostra Nick e momento e fecha todas as Opções.
- Declarações idênticas repetidas são idempotentes.
- A definição não exige confirmação adicional do sistema.

#### FR-14: Tratar declarações concorrentes

O sistema deve detectar Declarações incompatíveis feitas sobre a mesma versão do Rolê.

**Consequências testáveis:**
- A primeira Declaração confirmada permanece vigente.
- A tentativa conflitante não sobrescreve silenciosamente o estado e gera conflito visível com autorias.
- O sistema não decide qual Declaração representa a vontade do grupo.

#### FR-15: Corrigir uma declaração errada

Uma Pessoa Convidada pode registrar uma Correção consciente do Local do Rolê quando o sistema não refletir a decisão social já tomada.

**Consequências testáveis:**
- A Correção preserva `eventId`, Data, histórico e autorias.
- A interface diferencia explicitamente `Corrigir local declarado` de criar Outro Rolê.

#### FR-16: Criar Outro Rolê

Quando o grupo realmente mudar o Local do Rolê ou a Data, uma Pessoa Convidada pode iniciar Outro Rolê.

**Consequências testáveis:**
- Outro Rolê recebe novo `eventId` e Convite.
- Nenhum Interesse Geral ou Resposta é copiado automaticamente.
- A criação confirmada de Outro Rolê marca atomicamente o Rolê anterior como substituído e bloqueia novas mutações nele.
- O Rolê anterior permanece consultável como substituído enquanto seu Convite estiver operacional.
- Ao abrir o Convite anterior, a substituição e o Convite vigente aparecem antes de local, endereço ou rota antigos.

### 4.5 Tempo, consulta operacional e encerramento

**Descrição:** o sistema usa tempo humano e frouxo, mas impõe limites previsíveis às alterações e à exposição. Realiza UJ-5.

#### FR-17: Representar o Horário Aproximado

A Pessoa Criadora pode escolher `Depois do expediente` sem hora visível ou informar uma hora exibida como `Por volta das HHh`.

**Consequências testáveis:**
- `Depois do expediente` não exibe fuso nem hora inventada ao usuário.
- O sistema interpreta datas e limites no fuso aplicável ao Rolê.
- Enquanto indefinido, `Depois do expediente` usa referência interna inicial de 18h e, a partir de 16h30, mantém essa referência duas horas à frente do relógio em passos de 30 minutos, sem torná-la visível.
- A referência interna pode atravessar a meia-noite sem alterar a Data social do Rolê e nunca ultrapassa o Limite Final padrão de 03h.
- Ao definir o Local do Rolê, a referência interna vigente congela como Horário Aproximado.
- Se o Rolê permanecer indefinido ao atingir 03h, ele encerra sem Local do Rolê definido.

#### FR-18: Alterar o Horário Aproximado

Uma Pessoa Convidada pode alterar o Horário Aproximado na mesma Data somente enquanto o horário vigente estiver a pelo menos uma hora do momento atual.

**Consequências testáveis:**
- Às 18h30, um horário vigente de 20h pode mudar para 21h.
- Às 19h, um horário vigente de 20h ainda pode mudar.
- Às 19h01, um horário vigente de 20h não pode mudar.
- A regra de permissão é `currentTime <= approximateStart - 1h`.
- Alterar a Data oferece a criação de Outro Rolê, não uma edição.

#### FR-19: Consultar o plano durante o Rolê

Até o Limite Final, uma Pessoa Convidada pode consultar Local do Rolê, endereço vigente, URLs e abrir uma rota externa.

**Consequências testáveis:**
- Cancelamento é destacado antes de rota e endereço.
- Histórico operacional não substitui os valores vigentes na ação de rota.

#### FR-20: Estender o Limite Final

Qualquer Pessoa Convidada pode escolher um novo Limite Final enquanto o Convite estiver operacional.

**Consequências testáveis:**
- Um Rolê noturno iniciado após 18h tem Limite Final padrão às 03h do dia seguinte.
- O novo horário deve ser posterior ao Limite Final vigente e não pode ultrapassar 07h do dia seguinte à Data social do Rolê.
- A pessoa escolhe diretamente o horário final; o sistema não oferece apenas acréscimos de duração fixa.
- Extensões concorrentes são monotônicas: confirma-se o maior horário válido, sem permitir que outra operação reduza o Limite Final.
- Cada extensão mostra Nick e momento.
- A extensão realizada fica autorada e não reabre Respostas nem alterações já encerradas.

#### FR-21: Encerrar o acesso detalhado

Depois do Limite Final, o Convite deve informar apenas que o Rolê terminou.

**Consequências testáveis:**
- Nicks, Respostas, Local do Rolê, URLs, autorias e histórico deixam de ser acessíveis pelo Convite.
- O MVP não oferece recuperação, memória ou reaproveitamento do Rolê encerrado.

### 4.6 Cancelamento excepcional

#### FR-22: Cancelar o Rolê

Qualquer Pessoa Convidada pode cancelar um Rolê antes ou durante sua realização.

**Consequências testáveis:**
- O cancelamento mostra Nick e momento e é destacado ao abrir o Convite.
- O cancelamento é terminal: não há restauração.
- O cancelamento não exclui o registro antes do Limite Final e bloqueia novas ações mutáveis.

## 5. Requisitos não funcionais transversais

- **NFR-1 — Privacidade:** credenciais e contatos de autenticação nunca podem ser expostos por interface, compartilhamento, URL, telemetria de produto ou resposta de API destinada a clientes.
- **NFR-2 — Autorização:** toda mutação deve validar no servidor uma Identidade Verificada vinculada ao Rolê; qualquer Pessoa Convidada pode estender o Limite Final dentro das regras de FR-20.
- **NFR-3 — Concorrência:** respostas, declarações, correções, inativações e cancelamento devem ser atômicos, detectar versão obsoleta e impedir sobrescrita silenciosa.
- **NFR-4 — Auditabilidade:** Declarações, Correções, criação, inativação e reativação de Opção, alteração de Horário Aproximado, extensão do Limite Final e cancelamento devem registrar identidade interna, Nick contextual, instante e valores anterior e posterior quando aplicável.
- **NFR-5 — Acessibilidade:** os fluxos essenciais devem atender WCAG 2.2 nível AA; estados não podem depender apenas de cor e todas as ações devem ser operáveis por teclado.
- **NFR-6 — Desempenho percebido:** em conexão móvel 4G estável, a prévia pública e o plano vigente devem apresentar conteúdo principal em até 2,5 segundos no percentil 75, desconsiderando navegação de rota externa.
- **NFR-7 — Confiabilidade:** uma ação confirmada pelo usuário deve aparecer após recarregar o Convite; falhas devem manter o estado anterior e permitir nova tentativa sem duplicar o efeito.
- **NFR-8 — Localização temporal:** regras de Data, Horário Aproximado e Limite Final devem usar um fuso persistido para o Rolê e permanecer corretas em mudança de dia.
- **NFR-9 — Expiração e minimização:** após o Limite Final, o acesso público detalhado deve cessar imediatamente. A retenção técnica interna segue a decisão resolvida em OQ-2.
- **NFR-10 — Linguagem:** toda interface e documentação do MVP devem usar Português do Brasil e o vocabulário deste PRD.

Os limiares de NFR-5 e NFR-6 são metas iniciais de qualidade adicionadas por este PRD e devem ser validados no planejamento técnico.

## 6. Não objetivos explícitos

- Substituir WhatsApp ou outro canal de conversa.
- Determinar consenso, maioria, quórum, vencedor ou legitimidade de uma Declaração.
- Remover participantes ou moderar conflitos sociais extremos.
- Impedir toda duplicidade de Opção ou fundir identidades com credenciais diferentes.
- Confirmar comparecimento, medir desfecho ou guardar recordações.
- Tornar o Horário Aproximado um compromisso preciso ou definir horário de término.

## 7. Escopo do MVP

### 7.1 Incluído

- Identidade Verificada, Nick contextual e acesso progressivo.
- Criação pelos dois pontos de partida e Convite universal.
- Interesse Geral, múltiplas Opções manuais e quatro Respostas.
- Correções auditadas, URLs adicionais e Opções ativas/inativas.
- Declarações humanas, conflitos visíveis e Outro Rolê.
- Horário Aproximado, consulta operacional, compartilhamento e rota externa.
- Cancelamento terminal e expiração do acesso detalhado.

### 7.2 Fora do MVP

- Grupos persistentes, `point`, memória, notas e histórico reutilizável.
- Busca de locais, ponto médio, mapas embutidos e avaliações agregadas.
- Chat, comentários, notificações automáticas e integrações com mensageiros.
- Reserva, publicidade, assinatura, pagamentos e monetização.
- Festas, aniversários, modo anfitrião, fotos e armazenamento pós-evento.
- Painel de estabelecimentos, moderação e remoção de participantes.

## 8. Métricas e validação

O MVP não registra comparecimento; portanto, a relação com presença será avaliada por pesquisa e teste de uso, não por inferência silenciosa.

**Primárias**

- **SM-1 — Influência percebida no comparecimento:** após usar o fluxo em contexto real, pelo menos 4 de 5 grupos-piloto relatam que o estado compartilhado reduziu a incerteza e aumentou a chance percebida de comparecimento em comparação com seu processo habitual. A pesquisa não exige check-in nem coleta presença no produto. Valida a tese e FR-2, FR-5, FR-10, FR-12, FR-13 e FR-19.
- **SM-2 — Fluxo ponta a ponta concluído:** em teste moderado, pelo menos 4 de 5 grupos-piloto criam, compartilham, recebem duas respostas, definem o Local do Rolê e consultam a rota sem ajuda operacional. Valida FR-1 a FR-5, FR-10, FR-13 e FR-19.
- **SM-3 — Estado compreensível:** pelo menos 80% dos participantes de teste identificam corretamente o plano vigente, o significado de `Topo` nominal e quem pode declarar, sem instrução externa. Valida FR-2, FR-10, FR-12 a FR-15.

**Secundárias**

- **SM-4 — Baixo atrito inicial:** mediana de até 2 minutos entre iniciar a criação e obter o Convite. Valida FR-1 e FR-4.
- **SM-5 — Continuidade do canal social:** pelo menos 80% dos grupos-piloto relatam que o Bora Lá complementou, sem tentar substituir, a conversa usada pelo grupo. Valida FR-5 e FR-12.

**Contramétricas**

- **SM-C1 — Quantidade de respostas:** não otimizar o número de votos, pois o produto não é uma eleição e grupos pequenos podem ter sucesso.
- **SM-C2 — Tempo até a decisão:** não forçar decisão rápida; uma Organização indefinida pode permanecer maleável para respeitar o contexto do grupo.
- **SM-C3 — Retenção artificial:** não prolongar acesso ou coletar histórico para aumentar recorrência antes de consentimento e valor comprovado.

## 9. Riscos e guardrails

- **Personificação por Nick:** mitigada por Identidade Verificada e unicidade contextual; identidades autenticadas por credenciais diferentes não serão fundidas no MVP.
- **Ação mal-intencionada:** autoria e histórico tornam a ação visível; o produto não adicionará hierarquia ou moderação desproporcional ao caso de uso.
- **Confusão entre Correção e Outro Rolê:** textos e fluxos devem explicitar a consequência antes da confirmação.
- **Exposição após o encontro:** o Convite deixa de revelar detalhes no Limite Final; retenção interna será minimizada e definida antes da produção.
- **Precisão temporal falsa:** a interface preserva linguagem humana e não mostra a referência interna de `Depois do expediente`.

## 10. Questões abertas

- **OQ-1 — Resolvida:** autenticação passwordless por e-mail com botão/link de continuidade e código alternativo de uso único; ambos convergem para o mesmo consumo seguro. Senha, SMS, WhatsApp e login social ficam fora do MVP.
- **OQ-2 — Resolvida:** credenciais efêmeras elegíveis são eliminadas em até 24 horas; agregado do Rolê e Identity órfã, após 30 dias; logs técnicos, em 14 dias; backups seguem a política arquitetural de recuperação e retenção.
- **OQ-3 — Resolvida:** Node.js 24 com React Router Framework Mode SSR e MySQL/InnoDB, conforme a arquitetura aprovada.
- **OQ-4:** qual método será usado no teste-piloto para avaliar a influência percebida do produto no comparecimento sem coletar presença no MVP? Responsável: pesquisa de produto; resolver antes do piloto.

### 10.1 Prontidão para os próximos workflows

- **Apto:** UX e arquitetura podem avançar com as regras de produto atuais.
- **Apto para planejamento de implementação:** OQ-1, OQ-2 e OQ-3 foram resolvidas pela arquitetura. OQ-4 permanece como gate anterior ao piloto, não à implementação do produto.

## 11. Índice de suposições

Não há suposições silenciosas de comportamento de produto. WCAG 2.2 AA, o limiar quantitativo de NFR-6 e as metas de SM-1 a SM-5 são metas iniciais de validação e devem ser confirmados no planejamento técnico ou recalibrados após o primeiro piloto, sem alterar as regras funcionais.
