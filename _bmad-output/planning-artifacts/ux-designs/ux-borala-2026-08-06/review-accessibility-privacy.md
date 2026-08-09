# Revisão adversarial — Acessibilidade e privacidade

**Escopo:** `DESIGN.md`, `EXPERIENCE.md`, Constituição, PRD final, SPEC e companions, memlog, imports SVG e mock aprovado `direction-assinatura-brinde-refinada.html`.

**Lente:** produto consumidor; WCAG 2.2 AA comportamental, teclado, foco, leitor de tela, toque, zoom/reflow, movimento, contraste, acesso progressivo, identidade contextual e estados prioritários.

**Resultado:** **requer correções antes de finalizar**. Foram encontrados 2 achados altos, 7 médios e 3 baixos. Os spines não foram alterados.

## Achados altos

### A1. O laranja aprovado falha contraste nos usos textuais comprometidos

- **Evidência/local:** `DESIGN.md:21`, `DESIGN.md:83-86`, `DESIGN.md:140`, `DESIGN.md:144`, `DESIGN.md:172`; mock aprovado `.interest strong` e `.kicker` usam `#F37735` sobre branco ou papel quente.
- **Medição:** `#F37735` sobre `#FFFFFF` = **2,80:1**; sobre `#F8F3E8` = **2,53:1**. Falha WCAG 1.4.3 inclusive para texto grande (mínimo 3:1). O número agregado de 32 px e os rótulos pequenos ficam fora de AA.
- **Impacto:** baixa visão, telas sob luz externa e deficiências de percepção de cor; a métrica central pode ficar ilegível.
- **Correção:** preservar `accent-warm` como marca/decoração, mas criar um token textual laranja escuro que alcance ao menos 4,5:1 nos fundos usados (ou 3:1 somente quando comprovadamente texto grande). Aplicar esse token ao número, `pessoas`, kicker e qualquer texto funcional. Registrar uma matriz de pares de cor aprovada; a verificação de contraste não pode permanecer Open Question na finalização.

### A2. Autoria do cancelamento pode vazar Nick na visão pública

- **Evidência/local:** `EXPERIENCE.md:46-51` afirma prévia pública sem dados pessoais; `EXPERIENCE.md:98`, `115`, `216` manda mostrar autoria/momento no cancelamento ao abrir. O PRD FR-2 proíbe autoria na prévia pública (`prd.md:84-90`), enquanto FR-22 exige Nick e momento no cancelamento (`prd.md:283-292`) sem autorizar sua exposição antes da identificação. `mvp-rules.md:21-22` só libera autorias depois da identificação.
- **Impacto:** qualquer portador do link pode descobrir o Nick contextual de quem cancelou, contrariando privacidade por padrão e acesso progressivo.
- **Correção:** definir duas variantes explícitas. **Pública:** `Rolê cancelado`, sem Nick, momento detalhado, plano antigo ou histórico. **Identificada e antes do Limite Final:** pode mostrar Nick e momento conforme FR-22. Depois do Limite Final, sempre somente `Este Rolê terminou.`. Aplicar a mesma separação a Substituído, conflitos e demais autorias.

## Achados médios

### M1. Reflow está limitado a zoom de 200%, abaixo do teste necessário para conteúdo responsivo

- **Evidência/local:** `EXPERIENCE.md:138` compromete somente zoom a 200%; `DESIGN.md:156` fala em empilhar Data/Hora sem critérios; mock usa viewport fixo de 360 × 738 px, `overflow:hidden` em `.phone` e `.screen`.
- **Impacto:** a 400%/viewport equivalente a 320 CSS px, conteúdo e ações podem ser cortados ou exigir rolagem bidimensional; o mock já oculta overflow vertical.
- **Correção:** exigir reflow sem perda de conteúdo/ação e sem rolagem em duas dimensões a 320 CSS px (salvo exceções WCAG), zoom de navegador a 400%, orientação retrato/paisagem e conteúdo com strings longas. Proibir altura fixa e `overflow:hidden` em superfícies de produção. Adicionar suporte aos ajustes de espaçamento de texto de WCAG 1.4.12.

### M2. Gestão de foco e anúncios assíncronos está vaga e pode causar silêncio ou duplicidade

- **Evidência/local:** `EXPERIENCE.md:98` diz “recebe foco quando necessário”; `106` só afirma que atualizações não roubam foco; `135` reúne persistência, erro e conflito em `aria-live` sem prioridade ou destino. Não há regra para modal/confirmação, erro de formulário, retorno da identificação, conflito concorrente ou troca de estado terminal.
- **Impacto:** pessoas com leitor de tela podem não perceber mudanças críticas, ouvir mensagens duas vezes ou perder a posição de navegação.
- **Correção:** especificar por evento: sucesso assíncrono em `role=status`/polite; erro bloqueante e conflito em `role=alert` sem duplicar texto; erro de submit move foco ao resumo com links para campos; diálogo move foco ao título/primeiro controle, prende foco e devolve ao acionador; retorno da identificação restaura a intenção e posiciona foco no destino; mudança remota não rouba foco, mas anuncia resumo e oferece atualização consciente.

### M3. Os controles essenciais ainda não têm contrato semântico

- **Evidência/local:** `EXPERIENCE.md:92`, `95`, `121`, `132-137`; mock renderiza `access-gate-row` como `<div class="locked">`, apesar de ser acionável no spine. As quatro Respostas não definem `fieldset/legend`, grupo de rádio, nome/estado acessível ou operação por setas. Histórico e lista de `Topo` só são descritos como “compreensíveis”.
- **Impacto:** controles podem ser inacessíveis por teclado e leitor de tela mesmo mantendo a aparência aprovada.
- **Correção:** exigir `button`/`a` nativos para linhas de acesso, com toda a linha acionável; Respostas como grupo nomeado de seleção única (`fieldset` + `legend` e radios, ou padrão ARIA completo); listas como listas; autoria + instante em uma frase/estrutura legível; valor anterior com texto “anterior/substituído”, nunca apenas tachado; estado ativo/inativo/fechado exposto programaticamente.

### M4. Cadeado pode produzir nome duplicado ou ambíguo

- **Evidência/local:** `DESIGN.md:174`, `188`; `EXPERIENCE.md:92`, `136`; mock usa um `role=img` nomeado dentro de uma linha que já tem texto, e a linha não é controle.
- **Impacto:** leitor de tela pode anunciar “Quem já topou? Requer identificação” como elementos desconectados, ou repetir o requisito para cada ícone; usuários de comando por voz não têm alvo coerente.
- **Correção:** tornar a linha um único link/botão com nome completo, por exemplo `Quem já topou? Requer identificação`; deixar SVG/círculo `aria-hidden=true`. Usar ícone nomeado apenas se ele for o único portador do requisito, o que não é recomendado aqui. O cadeado nunca deve ser o único sinal visual/textual de acesso.

### M5. Alvos de toque e foco visual continuam como suposição, sem cobertura de espaçamento e ocultação

- **Evidência/local:** `EXPERIENCE.md:133` deixa 44 × 44 CSS px como `[ASSUMPTION]`; `DESIGN.md` não define espessura/offset do foco. O mock tem links identificados com padding pequeno e não prova 44 px; foco não é estilizado.
- **Impacto:** ações pequenas ou próximas podem falhar WCAG 2.5.8 e uso móvel; foco pode ficar encoberto por cabeçalho ou contêiner.
- **Correção:** transformar 44 × 44 em requisito do produto (mais forte que o mínimo de 24 × 24 da WCAG 2.2), incluindo linhas de acesso e chips; quando tecnicamente impossível, garantir mínimo 24 × 24 e espaçamento conforme 2.5.8. Definir indicador de foco com contraste ≥3:1, espessura/área compatível com 2.4.11/2.4.13 e `scroll-margin` para não ficar encoberto.

### M6. Sessão, cache e navegação de retorno podem reexpor dados após logout, expiração ou troca de estado

- **Evidência/local:** `EXPERIENCE.md:104`, `109`, `114-117`, `148` protege apenas a renderização inicial; não há contrato para Back/Forward Cache, cache HTTP/service worker, armazenamento local, abas antigas, logout, troca de conta ou dispositivo compartilhado. O PRD NFR-9 exige cessar acesso detalhado imediatamente após o Limite Final.
- **Impacto:** Nicks, respostas, local, URLs, autorias e histórico podem reaparecer via botão Voltar, snapshot de aba ou cache depois de perder autorização/expirar.
- **Correção:** exigir revalidação de autorização e estado prioritário ao abrir, restaurar aba, `pageshow`, voltar ao foreground e antes de renderizar dados sensíveis; limpar memória/UI ao logout, troca de identidade, expiração e terminalidade; não persistir conteúdo protegido em storage do cliente no MVP; definir política de cache de respostas autenticadas e testes de bfcache. Preservação local de formulário não pode incluir credenciais nem sobreviver à troca de identidade.

### M7. Saída para mapas/compartilhamento não explicita divulgação a terceiros

- **Evidência/local:** `EXPERIENCE.md:122-123` abre compartilhamento nativo e serviço externo de rota; Constituição IV exige finalidade comunicada e compartilhamento futuro com consentimento proporcional.
- **Impacto:** endereço/local e possivelmente URL do Convite são enviados a aplicativos terceiros sem expectativa clara; em fallback de cópia, o link sensível pode permanecer no clipboard.
- **Correção:** manter gesto explícito e rotular destino (`Abrir rota em…`, `Compartilhar convite`); antes de sair, informar de forma breve que o app escolhido receberá o endereço/link quando isso não for óbvio; nunca transmitir Nicks/respostas na mensagem; oferecer cópia consciente e feedback sem ler o clipboard; documentar que links externos abrem com proteção contra acesso à janela de origem.

## Achados baixos

### B1. Tamanhos de legenda muito pequenos elevam esforço de leitura

- **Evidência/local:** `DESIGN.md:49-59` define label em 11 px e caption em 10 px; mock chega a `.63rem` (~10 px) em explicações essenciais.
- **Impacto:** embora WCAG não imponha tamanho mínimo, explicações sobre `Topo + Tudo bem` e privacidade ficam frágeis em celular.
- **Correção:** usar pelo menos 12–14 px para texto informativo essencial, reservar 10–11 px a metadado não essencial e validar legibilidade com zoom/text spacing.

### B2. A autenticação ainda não tem requisitos contra enumeração e exposição contextual

- **Evidência/local:** `EXPERIENCE.md:47`, `93`, `232` deixa método aberto e só protege Nick duplicado/credencial alheia.
- **Impacto:** mensagens de login/recuperação podem confirmar existência de contato; alternância entre identidades pode associar Nicks indevidamente em dispositivo compartilhado.
- **Correção:** carregar para arquitetura requisitos UX mínimos: mensagens neutras para envio/recuperação, contato mascarado apenas para o próprio titular após prova adequada, opção clara de sair/trocar identidade e nenhuma associação visível entre Nicks de Rolês diferentes.

### B3. Movimento reduzido está correto, mas faltam flashing, autoplay e atualização visual contínua

- **Evidência/local:** `EXPERIENCE.md:139` cobre `prefers-reduced-motion`, sem proibir flashes/autoplay nem orientar contagens atualizadas em tempo real.
- **Impacto:** implementação futura pode introduzir animação de celebração ou atualização pulsante incompatível com a postura do produto e com acessibilidade.
- **Correção:** proibir flashes, autoplay e animações indispensáveis; não animar contagens como celebração; quando números mudarem, atualizar texto discretamente e anunciar apenas se relevante à tarefa atual.

## Pontos fortes preservados

- Acesso progressivo e proibição de credenciais em qualquer visão estão bem estabelecidos.
- Somente `Topo` revela Nick, com remoção atômica ao trocar a Resposta.
- Estado Encerrado minimiza corretamente a saída para uma frase, sem detalhes ou reutilização.
- Cold-load evita dados potencialmente antigos; concorrência impede sobrescrita silenciosa.
- Seleção não depende só de cor, teclado é obrigatório e gestos ocultos/hover exclusivo são proibidos.
- A direção evita ranking, quórum, urgência e prova social coercitiva.

## Gate recomendado

Antes de marcar os spines como `final`:

1. resolver **A1** com tokens de contraste verificados;
2. resolver **A2** com matriz público × identificado × expirado;
3. incorporar contratos de reflow, foco, semântica e cache dos achados **M1–M6**;
4. transformar contraste, alvo de toque e comportamento de foco de suposições/open questions em decisões testáveis;
5. validar os mocks finais com teclado, leitor de tela, 320 CSS px/400%, texto espaçado, contraste automatizado + inspeção manual e restauração por Voltar/aba.
