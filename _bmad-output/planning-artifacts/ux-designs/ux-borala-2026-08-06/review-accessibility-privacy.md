# Revalidação — Acessibilidade e privacidade

**Escopo:** `DESIGN.md`, `EXPERIENCE.md` e os quatro mocks promovidos em `mockups/`.

**Lente:** WCAG 2.2 AA comportamental, teclado, foco, leitor de tela, toque, zoom/reflow, contraste, acesso progressivo, identidade contextual, autoria e estados prioritários.

**Executado em:** 2026-08-09.

## Veredito

**PASS.** Os dois achados altos e os sete achados médios do parecer anterior foram incorporados aos contratos normativos. Os três bloqueadores residuais de `mockups/convite.html` também foram resolvidos. Não há achado crítico ou alto aberto nesta lente.

O gate aprova os artefatos para handoff sob acessibilidade e privacidade. As observações residuais abaixo são melhorias de fidelidade dos mocks, não bloqueadores; os spines já definem o comportamento exigido para produção e vencem os mocks em caso de conflito.

## Revalidação dos bloqueadores do Convite

### 1. Reflow e corte de conteúdo — resolvido

- A altura fixa de 738 px foi substituída por `min-height` e o `overflow:hidden` foi removido de `mockups/convite.html`.
- O media query não reinstala altura fixa.
- `DESIGN.md` proíbe altura fixa, corte e rolagem horizontal; `EXPERIENCE.md` exige reflow a 320 CSS px, zoom de 400%, orientação retrato/paisagem, strings longas e ajustes de espaçamento de texto.

### 2. Texto informativo essencial — resolvido

- `brand-caption`, rótulos de fatos e aviso de acesso usam 13 px ou mais.
- A frase agregada usa 16 px e deixou de separar a explicação essencial em texto reduzido.
- `DESIGN.md` mantém 13 px como piso para texto informativo essencial e 16 px para corpo.

### 3. Separação público × identificado — resolvido

- A variante identificada e o Nick “Bia” foram removidos do mock público.
- O Convite público não contém Nick, autoria, momento detalhado nem histórico.
- `EXPERIENCE.md` torna as respostas pública e identificada mutuamente exclusivas e exige verificar a ausência de dados protegidos no HTML/JSON, não apenas no CSS.

## Contratos aprovados

### Contraste e foco

- O laranja de marca `#F37735` ficou restrito a marca e decoração; texto funcional usa `#A6400F`, com pares documentados acima de 4,5:1.
- O foco tem espessura mínima de 2 CSS px, offset de 2 px, contraste mínimo de 3:1, circunda o alvo inteiro e não pode ser recortado.
- Estados e seleção não dependem apenas de cor.

### Semântica e nomes acessíveis

- Linhas protegidas são controles nativos; o requisito de identificação está visível no texto e o cadeado é decorativo com `aria-hidden`.
- Respostas usam `fieldset`, `legend` e radios nativos, com as quatro alternativas estruturalmente equivalentes.
- Lista de Nicks e histórico têm estrutura de lista; valor anterior recebe rótulo textual em vez de depender de tachado.
- Alvos interativos seguem 44 × 44 CSS px como requisito do produto, com piso normativo e espaçamento de WCAG 2.5.8 quando a exceção for necessária.

### Foco, regiões vivas e erros

- Sucessos assíncronos e confirmação de cópia/persistência usam `status`/polite; conflito ou erro bloqueante usa um único `alert`.
- Regiões são montadas antes da operação, recebem atualização de conteúdo e usam `aria-atomic=true` para mensagens completas.
- Submit inválido leva foco a um resumo com links para os campos; diálogos têm nome, modalidade, foco inicial, ciclo de Tab, Escape quando seguro e retorno ao acionador.
- Atualização remota anuncia o resumo sem roubar foco e oferece atualização consciente.

### Privacidade, autoria e estados

- A matriz de audiência e tempo separa explicitamente público, identificado antes do Limite Final e expirado.
- Cancelado público mostra somente `Rolê cancelado.`; autoria e momento aparecem apenas para pessoa identificada antes do limite; após o limite, aparece somente `Este Rolê terminou.`.
- Substituído público não revela autoria; conflito e correção nunca são públicos.
- Autorização e precedência são revalidadas em cold-load, `pageshow`/BFCache, foreground, restauração de aba e antes de mutações.
- Conteúdo protegido usa `no-store`, não é persistido por service worker ou storage do cliente e é limpo em logout, troca de identidade, expiração e terminalidade.
- Saída para mapa e compartilhamento é explícita, informa divulgação ao terceiro quando necessário e não transmite Nicks ou Respostas.

## Observações residuais não bloqueantes

### O1. Chassi decorativo ainda usa `overflow:hidden` em dois mocks — informativo

`criar-role.html` e `plano-conflito.html` ainda aplicam `overflow:hidden` ao chassi `.phone`. Eles não têm altura fixa, os controles possuem recuo suficiente e nenhum foco é recortado no layout demonstrado. Trata-se apenas da moldura visual do aparelho, não de um padrão autorizado para produção. `organizacao.html` já removeu essa máscara, assim como `convite.html`.

### O2. Nomes contextuais em `organizacao.html` — resolvido

Os dois botões visíveis “Detalhes do Local” agora usam `aria-labelledby` para compor o rótulo visível com o título da respectiva Opção. Os nomes resultantes distinguem `Bar do Zeca` de `Esquina do Pastel` e preservam o texto visível, em conformidade com WCAG 2.5.3. Em `plano-conflito.html`, cada “Editar detalhes” está dentro de uma variação independente e possui contexto de título imediatamente anterior; não há ambiguidade bloqueante na prancha.

### O3. Estados dinâmicos são spine-only — informativo

Os mocks são pranchas estáticas e não demonstram resumo de validação, live regions, diálogos, sessão expirada ou transições de cache. Isso não constitui lacuna de contrato: `EXPERIENCE.md` especifica esses estados. A implementação deve cobri-los com testes de teclado, leitor de tela, reflow, retorno por BFCache e inspeção do payload público.

## Evidência normativa

- WCAG 2.2: 1.4.3 Contraste mínimo, 1.4.10 Reflow, 1.4.12 Espaçamento de texto, 2.4.11 Foco não obscurecido, 2.5.8 Tamanho do alvo e 4.1.3 Mensagens de status — <https://www.w3.org/TR/WCAG22/>.
- WAI — contraste mínimo: <https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum>.
- WAI — reflow: <https://www.w3.org/WAI/WCAG22/Understanding/reflow>.
- WAI — tamanho mínimo do alvo: <https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum>.
- APG — grupo de radios: <https://www.w3.org/WAI/ARIA/apg/patterns/radio/>.
- APG — diálogo modal: <https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/>.

## Gate final da lente

**PASS — acessibilidade e privacidade aprovadas para handoff, sem achados residuais de severidade baixa ou superior.**

Condição para a implementação: preservar a precedência dos spines e transformar os contratos de contraste, foco, semântica, audiência, cache e estados dinâmicos em critérios automatizados e testes manuais de aceitação.
