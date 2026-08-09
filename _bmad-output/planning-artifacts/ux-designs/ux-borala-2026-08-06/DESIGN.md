---
name: Bora Lá
description: Identidade visual calorosa e editorial para organizar encontros sem governar o grupo.
status: final
project: borala
created: 2026-08-06
updated: 2026-08-09
sources:
  - ../../prds/prd-borala-2026-08-06/prd.md
  - ../../../specs/spec-borala-mvp/SPEC.md
  - ../../../specs/spec-borala-mvp/mvp-rules.md
  - ../../../specs/spec-borala-mvp/state-machines.md
  - ../../briefs/brief-borala-2026-08-06/brief.md
  - ../../../../CONSTITUTION.md
colors:
  page-canvas: '#E8E4DB'
  surface-base: '#F8F3E8'
  surface-raised: '#FFFFFF'
  ink-primary: '#111827'
  ink-secondary: '#556070'
  accent-warm-brand: '#F37735'
  accent-warm-text: '#A6400F'
  accent-cool: '#4B71C5'
  border-soft: '#D7D3C9'
  border-strong: '#C8C7C1'
  focus-outline: '#4B71C5'
typography:
  display: { fontFamily: 'Georgia, Cambria, serif', fontSize: 'clamp(32px, 7vw, 56px)', fontWeight: '600', lineHeight: '1', letterSpacing: '-0.035em' }
  metric: { fontFamily: 'Georgia, Cambria, serif', fontSize: 'clamp(30px, 7vw, 40px)', fontWeight: '600', lineHeight: '1', letterSpacing: '-0.035em' }
  body: { fontFamily: 'system-ui, -apple-system, Segoe UI, sans-serif', fontSize: '16px', fontWeight: '400', lineHeight: '1.5' }
  body-strong: { fontFamily: 'system-ui, -apple-system, Segoe UI, sans-serif', fontSize: '16px', fontWeight: '700', lineHeight: '1.35' }
  label: { fontFamily: 'system-ui, -apple-system, Segoe UI, sans-serif', fontSize: '12px', fontWeight: '800', lineHeight: '1.4', letterSpacing: '0.08em' }
  caption: { fontFamily: 'system-ui, -apple-system, Segoe UI, sans-serif', fontSize: '13px', fontWeight: '400', lineHeight: '1.4' }
rounded: { sm: '8px', md: '12px', lg: '14px', full: '9999px' }
spacing: { '1': '4px', '2': '8px', '3': '12px', '4': '16px', '5': '20px', '6': '24px', '7': '32px', page-mobile: '24px' }
components:
  brand-signature: { asset: 'imports/borala-logo-1.svg', width-mobile: '61px', height-mobile: '69px' }
  invitation-summary: { background: '{colors.surface-base}', foreground: '{colors.ink-primary}', accent-place: '{colors.accent-cool}' }
  interest-envelope: { background: '{colors.surface-raised}', foreground: '{colors.ink-primary}', border: '{colors.border-soft}', radius: '{rounded.lg}' }
  primary-action: { background: '{colors.ink-primary}', foreground: '{colors.surface-raised}', radius: '{rounded.full}' }
  access-gate-row: { foreground: '{colors.ink-primary}', icon: '{colors.accent-cool}', divider: '{colors.border-strong}' }
  identity-gate: { background: '{colors.surface-raised}', border: '{colors.border-soft}', radius: '{rounded.md}' }
  form-field: { background: '{colors.surface-raised}', foreground: '{colors.ink-primary}', border: '{colors.border-strong}', radius: '{rounded.sm}' }
  validation-summary: { background: '{colors.surface-raised}', foreground: '{colors.ink-primary}', border: '{colors.accent-warm-text}', radius: '{rounded.md}' }
  option-card: { background: '{colors.surface-raised}', border: '{colors.border-soft}', radius: '{rounded.lg}' }
  response-control: { background: '{colors.surface-raised}', foreground: '{colors.ink-primary}', border: '{colors.border-strong}', radius: '{rounded.md}' }
  top-list: { background: '{colors.surface-base}', foreground: '{colors.ink-primary}', divider: '{colors.border-soft}' }
  declaration-panel: { background: '{colors.surface-raised}', foreground: '{colors.ink-primary}', border: '{colors.border-soft}', radius: '{rounded.lg}' }
  share-control: { background: '{colors.ink-primary}', foreground: '{colors.surface-raised}', radius: '{rounded.full}' }
  external-route-control: { background: '{colors.surface-raised}', foreground: '{colors.ink-primary}', border: '{colors.border-strong}', radius: '{rounded.full}' }
  operational-history: { background: '{colors.surface-base}', foreground: '{colors.ink-secondary}', divider: '{colors.border-soft}' }
  state-notice: { background: '{colors.surface-raised}', foreground: '{colors.ink-primary}', border: '{colors.border-strong}', radius: '{rounded.md}' }
---

# Bora Lá — Design Spine

> **Precedência normativa:** este spine vence qualquer mock, import ou estudo em caso de conflito. Somente os [mocks promovidos](mockups/) e o [logo aprovado](imports/borala-logo-1.svg) são referências visuais vigentes; o [símbolo exploratório](imports/borala-logo-2.svg), todo conteúdo em `.working/` e os arquivos-fonte `BoraLá_Logo_*` mantidos na raiz deste workspace são históricos e não normativos.

## Brand & Style

**Assinatura de Brinde** é a direção aprovada: clara, calorosa, espaçosa e editorial. O logo completo assina o Convite; o estado operacional é protagonista. Celebração vive na marca, nunca em placar, confete, ranking ou pressão. Isso materializa **organizar sem governar**.

Referências visuais: [Convite](mockups/convite.html), [criação](mockups/criar-role.html), [Organização](mockups/organizacao.html), [plano definido e conflito](mockups/plano-conflito.html) e [logo aprovado](imports/borala-logo-1.svg).

## Colors

`{colors.accent-warm-brand}` é exclusivo da marca e da decoração não textual segura. Texto funcional laranja usa `{colors.accent-warm-text}`. Nenhuma cor comunica maioria, sucesso, autoridade ou urgência.

Matriz WCAG 2.2 AA verificada (texto normal):

| Primeiro plano | Fundo | Contraste | Uso |
|---|---:|---:|---|
| `#111827` | `#FFFFFF` | 17,74:1 | texto/controle |
| `#111827` | `#F8F3E8` | 16,03:1 | texto |
| `#556070` | `#F8F3E8` | 5,76:1 | texto secundário |
| `#4B71C5` | `#FFFFFF` | 4,70:1 | texto/ícone funcional |
| `#A6400F` | `#FFFFFF` | 6,25:1 | texto funcional quente |
| `#A6400F` | `#F8F3E8` | 5,65:1 | texto funcional quente |

Foco usa `{colors.focus-outline}` com pelo menos 2 CSS px, offset de 2 px e contraste ≥3:1 contra superfícies adjacentes. O contorno circunda o alvo inteiro e nenhum chassi, contêiner ou `overflow` pode recortá-lo.

## Typography

Títulos e métricas usam definitivamente `Georgia, Cambria, serif` no MVP, sem download ou dependência externa. Corpo e controles usam a pilha de sistema. Texto informativo essencial nunca fica abaixo de 13 px; corpo padrão é 16 px. A escala fluida mantém legibilidade a 320 CSS px e com zoom a 400%; rótulos em caixa alta ficam restritos a metadados curtos.

## Layout & Spacing

Mobile-first, uma coluna, com breakpoints fixos em **640 px** e **1024 px**. Até 639 px: margem de 24 px (mínimo de 16 px a 320 CSS px). A partir de 640 px: coluna central de leitura com até 640 px. A partir de 1024 px: a mesma coluna, com no máximo 680 px, recebe apenas mais respiro; não nasce outra arquitetura de informação.

Convite: assinatura → contexto → nome → local → data/hora → agregado público → participação. Data/hora empilham quando texto ou viewport exigirem. Não usar alturas fixas, corte de conteúdo ou rolagem horizontal em superfícies de produção.

## Elevation & Depth

Hierarquia vem de tipo, espaço, bordas e superfícies. `interest-envelope` não possui sombra. Elevação jamais sinaliza liderança, preferência ou validade social.

## Shapes

Invólucros usam `{rounded.md}`/`{rounded.lg}`; ações usam `{rounded.full}`. Círculos compactos de ícone não são medalhas. Alvos interativos têm 44 × 44 CSS px; quando esse tamanho for impossível, têm no mínimo 24 × 24 CSS px, com espaçamento conforme WCAG 2.5.8.

## Components

| Componente | Contrato visual |
|---|---|
| `brand-signature` | Logo íntegro, não acionável por padrão e com texto alternativo “Bora Lá”. |
| `invitation-summary` | Leitura vertical; plano vigente precede histórico e contagens. |
| `interest-envelope` | Frase factual inseparável “7 pessoas marcaram Topo ou Tudo bem”, em `{typography.body-strong}` e `{colors.ink-primary}`; sem métrica ampliada, título interrogativo, sombra, barra ou tendência. |
| `primary-action` | Um CTA principal por contexto; foco externo visível. |
| `access-gate-row` | Toda a linha é um controle; o cadeado decorativo usa `aria-hidden`, e o requisito de acesso está escrito no nome do controle. |
| `identity-gate` | Porta de e-mail/código e Nick; não expõe associação entre identidades. |
| `form-field` | Rótulo persistente, ajuda e erro próprios; Data, Hora, Nick e Local usam a mesma anatomia. |
| `validation-summary` | Título factual e links para campos; não depende de cor. |
| `option-card` | Mesma aparência e largura para todas as Opções; adesão, autoria e estado não mudam a proeminência de nenhuma delas. |
| `response-control` | Quatro alternativas com área, tipo e peso equivalentes; seleção usa borda + marca + texto, nunca preenchimento celebratório exclusivo de `Topo`. |
| `top-list` | Lista nominal simples, sem avatar de status, ranking ou contagem por autor. |
| `declaration-panel` | Consequências inline; ações disponíveis a qualquer convidado identificado têm tratamento idêntico. |
| `share-control` | Ação explícita de compartilhar/copiar, sem aparência de publicação automática. |
| `external-route-control` | Nomeia a saída para um serviço externo e usa um indicador externo textual e visual. |
| `operational-history` | Sequência factual por evento; o valor anterior é rotulado como “anterior” ou “substituído”, não apenas tachado. |
| `state-notice` | Estado prioritário por texto e semântica; nunca somente cor. |

## Do's and Don'ts

| Faça | Não faça |
|---|---|
| Mostre o vigente primeiro e mantenha ordem estável de Opções. | Não reordene, destaque ou agrupe por adesão. |
| Dê peso igual às Respostas e aos pontos de partida; preserve a igualdade de poder de ação. | Não crie opção vencedora, quórum, progresso ou autoridade da Pessoa Criadora. |
| Use cadeado decorativo dentro de controle acessível. | Não use “bloqueado” como selo nem ícone como único nome. |
| Mostre autoria como auditoria factual. | Não crie reputação, badges ou o rótulo “mais ativo”; não destaque quem prevaleceu. |
| Use `#F37735` apenas na marca/decoração segura. | Não use o laranja de marca em texto funcional. |
| Respeite reflow e ajustes de espaçamento. | Não fixe altura, esconda overflow ou dependa de hover/animação. |
