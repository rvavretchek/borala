---
name: Bora Lá
status: final
project: borala
created: 2026-08-06
updated: 2026-08-07
sources:
  - ../../prds/prd-borala-2026-08-06/prd.md
  - ../../../specs/spec-borala-mvp/SPEC.md
  - ../../../specs/spec-borala-mvp/mvp-rules.md
  - ../../../specs/spec-borala-mvp/state-machines.md
  - ../../briefs/brief-borala-2026-08-06/brief.md
  - ../../../../CONSTITUTION.md
---

# Bora Lá — Experience Spine

> **Precedência normativa:** `CONSTITUTION.md`, PRD, SPEC e companions governam este contrato. `DESIGN.md` governa a identidade visual e este spine governa o comportamento; ambos vencem mocks, imports e estudos históricos em caso de conflito.

## Foundation

Web responsiva mobile-first em React.js. A pessoa alterna entre o Convite e o canal social; no desktop, a interface se adapta sem criar outra jornada.

Princípio obrigatório: **organizar sem governar**. O produto registra estado; não infere consenso, maioria, quórum, vencedor, influência, legitimidade ou autoridade. Pessoa Criadora e Pessoa Convidada identificada têm exatamente os mesmos poderes após a criação. A conversa e a resolução social permanecem externas.

Identificação do MVP: somente código de uso único por e-mail, sem senha, SMS, WhatsApp ou login social. Mensagens de envio e recuperação são neutras para impedir a enumeração de contas; o e-mail nunca aparece para participantes. Após a verificação, restaura-se a intenção original e cria-se ou recupera-se o Nick contextual.

## Information Architecture

```text
Bora Lá
├── Criar Rolê (dois começos equivalentes)
└── Convite
    ├── Prévia pública
    ├── Identificação por e-mail + código + Nick
    └── Rolê identificado
        ├── Estado/plano vigente
        ├── Interesse Geral
        ├── Opções → Detalhe
        ├── Histórico operacional
        └── Ações contextuais
```

| Superfície | Entrega e limite |
|---|---|
| Criar Rolê | Data, Horário Aproximado, nome e dois começos com peso igual; criação exige identidade. |
| Prévia pública | Nome, Local ou indicação de Local em aberto, Data, Horário Aproximado e `Topo + Tudo bem`; sem Nick, autoria, respostas individuais ou histórico. |
| Identificação + Nick | E-mail → código único → Nick; retorno à ação protegida que motivou a identificação. |
| Rolê identificado | Estado ou plano vigente, detalhes, participação, autorias e ações válidas. `Dar o seu pitaco` precede `Quem já topou?`. |
| Detalhe da Opção | Informações vigentes, autoria, estado, quatro Respostas, Nicks apenas de `Topo`, correções e histórico. |
| Histórico | Sequência factual secundária, sem reputação ou restauração terminal. |

Referências de composição: [Convite](mockups/convite.html), [Criar Rolê](mockups/criar-role.html), [Organização](mockups/organizacao.html) e [plano definido com conflito](mockups/plano-conflito.html). Identificação, detalhe e histórico, inativação/reativação, compartilhamento, extensão e estados terminais são superfícies **spine-only**. Os spines vencem os mocks em caso de conflito.

Precedência de renderização: Cancelado → Substituído → Encerrado → Em andamento → Definido → Ocorrência declarada → Organização. Interesse Geral é contexto separado, não cabeçalho legitimador das Opções.

### Ordem estável das Opções

Opções ativas usam ordem de criação crescente (`createdAt`, desempate por `optionId`) e nunca se reordenam por Respostas, autoria ou edição. Inativas permanecem na posição original, com estado operacional, autoria e momento tanto da inativação quanto da reativação; não são “eliminadas”. Fechadas preservam a mesma ordem. Filtros opcionais só mudam visibilidade por ação explícita e não alteram a ordem canônica.

## Privacy, Authorization & Session

### Privacidade por audiência e tempo

| Estado | Público | Identificado antes do Limite Final | Após Limite Final |
|---|---|---|---|
| Ativo/definido | resumo mínimo de FR-2 | detalhes, ações e autorias permitidos | somente `Este Rolê terminou.` |
| Cancelado | `Rolê cancelado.` sem Nick, momento detalhado, plano ou histórico | Nick e momento conforme FR-22; sem mutações/restauração | somente frase terminal |
| Substituído | aviso e link do Outro Rolê; sem autoria/plano antigo | autoria/momento e link vigente | somente frase terminal |
| Conflito/correção | nunca público | partes, autoria e momento necessários à auditoria | nunca disponível |

### Cache, BFCache e sessão

Revalidar autorização, identidade e precedência antes de renderizar dados protegidos: cold-load, `pageshow` (inclusive BFCache), retorno ao foreground, restauração de aba e antes de cada mutação. Respostas autenticadas usam `Cache-Control: no-store`; service worker não armazena dados protegidos; local/session storage não guarda Nicks, Respostas, Local, URLs, autorias, histórico, e-mail ou código. Logout, troca de identidade, expiração, Cancelado/Substituído/Encerrado limpam memória/UI e invalidam formulários. Rascunho local só pode sobreviver durante a mesma sessão/identidade e nunca conter credencial.

## Voice and Tone

Informal, clara, factual e operacional. Dizer o que foi registrado, nunca o que “o grupo quis”. Usar Rolê, Organização, Opção, Resposta, Declaração, Pessoa Criadora, Pessoa Convidada, Local em aberto e Local do Rolê. Evitar votação, candidato, voto, aprovado, vencedor e “o grupo escolheu”.

- Agregado: `7 pessoas marcaram Topo ou Tudo bem.`
- Substituído público: `Existe Outro Rolê ligado a este.`
- Substituído identificado: `Existe Outro Rolê ligado a este. Registrado por {Nick}, {momento}.`
- Concorrência: `O Rolê mudou enquanto você fazia isso. Sua tentativa não substituiu o estado atual.`
- Encerrado: `Este Rolê terminou.`

`Dar o seu pitaco` é o rótulo aprovado de entrada, mas a pergunta que introduz cada controle de Resposta é neutra: `Como este local funciona para você?`. Não usar “apoie”, “vote” ou “preferido”.

## Component Patterns

| Componente | Contrato comportamental |
|---|---|
| `brand-signature` | Associa visualmente a marca; não é link por padrão. |
| `invitation-summary` | Resolve estado/autorização antes dos dados; ordem Nome → Local → Data/Hora → agregado. |
| `interest-envelope` | Exibe apenas o agregado `Topo + Tudo bem`; não é acionável nem serve como justificativa de Declaração. |
| `primary-action` | Controle nativo; ocupado evita repetição; sucesso só após persistência. |
| `access-gate-row` | Link/botão nativo com nome completo, ex. `Dar o seu pitaco — requer identificação`; preserva intenção. |
| `identity-gate` | E-mail e código com mensagens neutras; troca/sair limpa dados; Nick duplicado só informa indisponibilidade. |
| `form-field` | `label` associado, ajuda via descrição, erro inline; mantém o valor em caso de falha, desde que a identidade permaneça a mesma. |
| `validation-summary` | Em submit inválido recebe foco, lista links aos campos e não duplica mensagens em live region. |
| `option-card` | Ordem canônica estável; estado exposto em texto e programaticamente; duplicidade avisa sem bloquear. |
| `response-control` | `fieldset` + `legend` + radios nativos (ou padrão ARIA completo); uma seleção; setas/teclado; quatro opções equivalentes. |
| `top-list` | Lista semântica; aparece depois do controle de Resposta na ordem da interface; mostra somente Nicks associados a `Topo`, sem estatística por pessoa. |
| `declaration-panel` | Informa que qualquer Pessoa Convidada identificada pode agir; a autoria registra quem acionou, não uma autoridade. Contagens ficam fora. |
| `share-control` | Gesto explícito; mensagem pronta e compartilhamento nativo; a alternativa copia sem ler a área de transferência e confirma a cópia. |
| `external-route-control` | `Abrir rota em…`; antes de abrir o serviço externo, informa que o aplicativo escolhido receberá o endereço; usa `noopener noreferrer`. |
| `operational-history` | Lista cronológica; autoria+instante em frase legível; valor anterior rotulado; sem badges/agregação por autor. |
| `state-notice` | Usa `status` para informação e `alert` para erro ou conflito bloqueante; as versões pública e identificada têm conteúdos diferentes. |

## State Patterns

### Matriz por superfície

| Superfície | Carregando | Vazio | Erro/retry | Foco/retorno | Indisponível/terminal |
|---|---|---|---|---|---|
| Criar Rolê | estrutura sem valores inventados | não aplicável | preserva campos; retry idempotente | erro → resumo de validação; identificação concluída → campo ou ação original | sessão expirada → porta de identidade sem concluir criação |
| Prévia pública | resolve precedência antes de dados | mensagens factuais para Local em aberto e agregado igual a zero | retry sem revelar cache protegido | mantém acionador | cancelado/substituído públicos sem autoria; encerrado só frase terminal |
| Identificação + Nick | progresso textual | não aplicável | código inválido/expirado sem enumerar e-mail; reenviar | ao abrir, foco no título do diálogo ou da página; após o sucesso, retorno à intenção original | troca/sair limpa UI, memória e formulários protegidos |
| Rolê identificado | esqueleto sem dado antigo | mensagens factuais, sem pressão | preserva a intenção; recarrega o estado vigente | atualização remota anuncia sem roubar foco | estado/tempo explica por que ação cessou |
| Detalhe da Opção | estado neutro | mensagens factuais quando não há Respostas nem Nicks associados a `Topo` | retry mantém resposta pretendida | foco permanece no controle ou aviso de conflito | inativa/fechada em texto e somente ações válidas |
| Histórico | indicador de carregamento no próprio controle de expansão | não renderiza seção vazia | retry local, vigente permanece visível | disclosure devolve foco ao acionador | terminal nunca oferece restauração; expirado não renderiza |

O estado offline é distinto de um erro de servidor: offline, o produto não confirma mutações e oferece uma nova tentativa após a reconexão; em caso de erro de servidor, oferece uma nova tentativa idempotente. Identificação ausente encaminha ao gate; permissão negada informa indisponibilidade sem sugerir autoridade especial.

## Interaction Primitives

- Compartilhar é manual. Templates não contêm Nicks, respostas individuais ou autoria:
  - em aberto: `{Nome} — {Data}, {Horário}. Local ainda em aberto. Acompanhe: {Convite}`;
  - definido: `{Nome} — {Local}, {Data}, {Horário}. Confira o estado vigente: {Convite}`;
  - cancelado ou substituído: não gerar texto operacional antigo; compartilhar apenas o Convite e o estado factual vigente.
- Durante a Organização, `Definir como Local do Rolê` tem **um acionamento**, sem modal/segunda confirmação (FR-13). Consequência inline: `As outras Opções serão fechadas e continuarão consultáveis.` Concorrência é resolvida pelo servidor. A ação não existe no estado Definido.

### Opção, Correção e Outro Rolê

As ações dependem do estado e aparecem de forma direta, sem pedir que a pessoa classifique ou justifique o que o grupo decidiu:

- durante a Organização, `Editar informações` dentro de Detalhes do Local corrige ou complementa nome, endereço e URLs da Opção; ela ainda não é chamada de Local do Rolê;
- depois da definição, nome, endereço ou referência, links disponíveis, `Abrir rota em…` e o CTA `Editar detalhes` formam um único agrupamento sem título intermediário. O CTA edita somente nome, endereço e links do Local vigente. Essa Correção factual preserva `eventId`, Data, Respostas, autorias e histórico, sem trocar o local socialmente escolhido;
- depois da definição, `Criar Outro Rolê` é a única ação para uma mudança efetiva de Local ou Data; a ação cria um novo `eventId` e um novo Convite, sem herdar Respostas.

No estado Definido, não existe ação de troca direta do Local no mesmo Rolê.
- `Cancelar` está disponível com o mesmo peso para qualquer Pessoa Convidada identificada e usa uma confirmação de consequência, nunca uma senha de administrador: `Qualquer pessoa identificada pode cancelar em situação excepcional. O cancelamento é terminal e terá a autoria registrada.`
- Correção, Outro Rolê, cancelamento, alteração de horário e extensão usam revisão consciente; não são homologação ou votação.
- Antes de abrir o compartilhamento ou o mapa, informar que os dados serão enviados ao serviço externo quando isso não for óbvio; links externos não acessam a janela de origem.

## Accessibility Floor

WCAG 2.2 AA. Teclado completo; HTML nativo primeiro; 44 × 44 CSS px; foco conforme `DESIGN.md`; estados não dependem de cor. Reflow sem perda nem rolagem bidimensional a 320 CSS px e com zoom de 400% (salvo exceções da WCAG), em orientação retrato ou paisagem, com strings longas e com os ajustes previstos na WCAG 1.4.12. Sem flashes, autoplay, animação indispensável ou celebração de contagens; `prefers-reduced-motion` remove movimento não essencial. Atualizações numéricas são discretas e só anunciadas quando relevantes à tarefa.

### Foco e anúncios

- sucesso assíncrono: `role=status`, `aria-live=polite`;
- erro bloqueante/conflito: uma única `role=alert`; foco vai ao aviso somente quando a tarefa não pode continuar;
- submit inválido: foco no `validation-summary`, com links aos campos;
- diálogo aplicável: foco no título/primeiro controle, contenção e retorno ao acionador;
- retorno da identificação: foco no destino da intenção restaurada;
- mudança remota: não rouba foco; anuncia um resumo e oferece uma ação explícita para atualizar o estado;
- foco nunca fica oculto: usar `scroll-margin` e reposicionamento após transição.

## Responsive & Platform

Breakpoints, margens e larguras de coluna seguem exclusivamente `DESIGN.md > Layout & Spacing`. O compartilhamento nativo usa Web Share quando disponível e uma cópia acionada explicitamente como alternativa. Rota abre provedor externo; não há mapa embutido. Nenhuma interação depende exclusivamente de hover, swipe ou botão Voltar.

## Key Flows

### UJ-1. João cria um rolê a partir das pessoas
**Passos:** 1. Identifica-se por e-mail/código, escolhe Nick e um dos dois começos equivalentes. 2. Informa Data, Hora e nome. 3. Registra Interesse Geral. 4. Compartilha manualmente.

**Clímax:** um link vivo organiza sem criar dono.

**Falha:** erros de validação ou de rede preservam a intenção.

### UJ-2. Ana entra por um convite e sinaliza sua disposição
**Passos:** 1. Vê resumo público. 2. Identifica-se. 3. Abre `Dar o seu pitaco`. 4. Responde entre quatro opções iguais. 5. Depois consulta `Quem já topou?`.

**Clímax:** participa sem que a contagem decida por ela.

**Falha:** Nick duplicado não revela identidade.

### UJ-3. Bruno sugere um local sem apagar a história
**Passos:** 1. Sugere uma Opção. 2. Avalia o alerta não bloqueante. 3. Luiza corrige. 4. O histórico preserva o registro original e as autorias.

**Clímax:** corrigir não apaga.

**Falha:** a Opção inativa permanece consultável e reativável.

### UJ-4. Carla registra que vai ter rolê
**Passos:** 1. Declara ocorrência. 2. Opções seguem abertas. 3. Define Local com consequência inline e gesto único.

**Clímax:** registra decisão externa sem justificá-la por contagens.

**Falha:** a concorrência mostra o estado vigente.

### UJ-5. Diego consulta o rolê tarde
**Passos:** 1. Abre um link antigo. 2. A precedência resolve o estado. 3. Após se identificar, consulta a rota ou o plano, ou vê o estado terminal.

**Clímax:** sabe o que vale agora.

**Falha:** a expiração remove os detalhes inclusive após retorno por cache.

### UJ-6. Elisa encontra uma divergência concorrente
**Passos:** 1. Tenta declarar com base em uma versão desatualizada. 2. Vê conflito. 3. Grupo conversa fora. 4. Escolhe Correção ou Outro Rolê pelas consequências.

**Clímax:** uma corrida técnica não vira legitimidade social.

**Falha:** tentativa nunca sobrescreve silenciosamente.

## Rastreabilidade compacta

| Origem | Cobertura UX |
|---|---|
| CAP-1; FR-1–FR-3 | UJ-1 passos 1–2; UJ-2 passos 1–2; `identity-gate`, privacidade/cache |
| CAP-2; FR-4 | UJ-1 passos 1–3; Criar Rolê |
| CAP-3; FR-5 | UJ-1 passo 4; UJ-5; `share-control`, templates |
| CAP-4; FR-6, FR-10–FR-11 | UJ-2 passos 3–5; `response-control`, `top-list` |
| CAP-5; FR-7–FR-9 | UJ-3; `option-card`, histórico, ordem estável |
| CAP-6; FR-12–FR-14 | UJ-4; UJ-6 passos 1–2; `declaration-panel`, concorrência |
| CAP-7; FR-15–FR-16 | UJ-6 passos 3–4; Correção × Outro Rolê |
| CAP-8; FR-17–FR-18 | UJ-1 passo 2; UJ-5; campos/indisponibilidade temporal |
| CAP-10; FR-19–FR-20 | UJ-5 passos 2–3; rota, share, extensão |
| CAP-11; FR-21 | UJ-5 falha; privacidade/cache após limite |
| CAP-9; FR-22 | UJ-5; cancelamento público × identificado |
| NFR-1–NFR-3 | cold-load, envio/retry, estado vigente e `primary-action` |
| NFR-4–NFR-6 | Accessibility Floor, semântica, foco, reflow e contraste em DESIGN.md |
| NFR-7–NFR-8 | mensagens neutras, sessão/cache e controles de share/rota |
| NFR-9 | matriz expirada e Cache/BFCache |
| NFR-10 | Foundation/IA, igualdade de poder, ordem estável e templates |

## Open Questions

- Backend, retenção técnica interna pós-expiração e provedor transacional de e-mail seguem para arquitetura; a UX já fixa seus limites de privacidade, neutralidade, estado e cache.

## Proveniência não normativa — Inspiration & Anti-patterns

Familiaridade de link compartilhado de Instagram/marketplace: resumo imediato e próximo passo óbvio, sem copiar identidade ou mecânicas comerciais. Explorações `.working/directions-convite.html` e `.working/directions-convite-logos.html` são alternativas históricas rejeitadas; as referências promovidas estão listadas em Information Architecture.
