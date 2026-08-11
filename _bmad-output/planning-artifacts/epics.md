---
stepsCompleted:
  - step-01-validate-prerequisites
  - step-02-design-epics
  - step-03-create-stories
  - step-04-final-validation
inputDocuments:
  - prds/prd-borala-2026-08-06/prd.md
  - prds/prd-borala-2026-08-06/addendum.md
  - architecture/architecture-borala-2026-08-07/ARCHITECTURE-SPINE.md
  - architecture/architecture-borala-2026-08-07/SOLUTION-DESIGN.md
  - architecture/architecture-borala-2026-08-07/UML.md
  - ux-designs/ux-borala-2026-08-06/DESIGN.md
  - ux-designs/ux-borala-2026-08-06/EXPERIENCE.md
  - ../specs/spec-borala-mvp/SPEC.md
  - ../specs/spec-borala-mvp/mvp-rules.md
  - ../specs/spec-borala-mvp/state-machines.md
  - ../../CONSTITUTION.md
---

# borala - Epic Breakdown

## Overview

Este documento reúne os requisitos que orientarão a decomposição do Bora Lá em épicos e histórias implementáveis. PRD, UX, arquitetura, SPEC e Constituição são tratados como um contrato único; em caso de conflito, prevalece a hierarquia normativa declarada nesses documentos.

## Requirements Inventory

### Functional Requirements

FR1: Exigir Identidade Verificada e Nick contextual antes de criar um Rolê, sem expor credenciais em superfícies públicas ou de participantes.

FR2: Exibir no Convite público operacional apenas nome, Data, Horário Aproximado, Local quando definido e o agregado de Pessoas Convidadas distintas cujo Interesse Geral vigente é `Tô a fim`, resolvendo estados terminais antes de informações antigas.

FR3: Permitir que uma Pessoa Convidada prove sua identidade, escolha Nick único no Rolê, recupere a mesma identidade em outro aparelho com a mesma credencial e corrija o Nick com auditoria.

FR4: Criar um Rolê pelos pontos de partida equivalentes `Primeiro, quem topa` ou `Já tenho um local`, com Data, Horário Aproximado, nome sugerido editável, `eventId` e Convite únicos.

FR5: Permitir a qualquer Pessoa Convidada compartilhar manualmente uma mensagem que sempre contenha o Convite vivo, sem postagem automática e sem conferir autoridade ao snapshot externo.

FR6: Permitir registrar, alterar ou limpar Interesse Geral enquanto o Local estiver aberto, mantendo-o independente das Respostas sobre Opções.

FR7: Permitir criar Opção manual com nome, endereço ou referência e URLs, congelando os valores originais e exibindo aviso não bloqueante de possível duplicidade.

FR8: Permitir corrigir ou complementar nome, endereço e URLs de uma Opção por registros posteriores auditáveis, preservando originais e valores substituídos.

FR9: Permitir inativar e reativar Opção durante a Organização sem exclusão; ao definir o Local, fechar todas as Opções e preservar dados, Respostas e histórico.

FR10: Manter uma Resposta atual por Pessoa Convidada e Opção entre `Topo`, `Tudo bem`, `Não tenho certeza` e `Não vou nesse`, com contagens atômicas e Nick nominal somente em `Topo`.

FR11: Manter Respostas editáveis durante a Organização e, após a definição, somente até o Horário Aproximado; depois disso, apresentá-las como somente leitura.

FR12: Permitir a qualquer Pessoa Convidada declarar `Vai ter rolê` sem Local, quórum, maioria, ranking ou conversão de Respostas, preservando autoria e momento.

FR13: Permitir a qualquer Pessoa Convidada definir uma Opção ativa como Local do Rolê em um único acionamento, fechando as Opções, registrando autoria/momento e tratando repetição idêntica como idempotente.

FR14: Detectar declarações incompatíveis concorrentes, preservar a primeira confirmação, registrar e exibir o conflito com autorias e nunca inferir legitimidade social.

FR15: Permitir Correção consciente de detalhes factuais do Local declarado, preservando `eventId`, Data, histórico, autoria e a identidade social do Local.

FR16: Permitir criar Outro Rolê quando Local ou Data realmente mudarem, com novo `eventId` e Convite, sem herdar Interesse/Respostas, substituindo atomicamente o anterior.

FR17: Representar `Depois do expediente` sem hora visível ou uma hora como `Por volta das HHh`, calculando a referência móvel no fuso do Rolê e congelando-a ao definir o Local.

FR18: Permitir alterar o Horário Aproximado na mesma Data somente quando `currentTime <= approximateStart - 1h`; mudança de Data oferece Outro Rolê.

FR19: Até o Limite Final, permitir consultar Local vigente, endereço, URLs e rota externa, sempre dando precedência a cancelamento, substituição e valores vigentes.

FR20: Permitir a qualquer Pessoa Convidada estender monotonicamente o Limite Final para um horário posterior e até 07h, enquanto o Convite estiver operacional, registrando autoria e momento sem reabrir janelas encerradas.

FR21: Após o Limite Final, expor pelo Convite somente `Este Rolê terminou.`, sem Nicks, Respostas, Local, URLs, autoria, histórico, recuperação ou reaproveitamento.

FR22: Permitir a qualquer Pessoa Convidada cancelar o Rolê antes ou durante sua realização, com autoria/momento, precedência visual, terminalidade e bloqueio de novas mutações.

### NonFunctional Requirements

NFR1: Nunca expor credenciais ou contatos de autenticação por interface, compartilhamento, URL, telemetria ou resposta de API destinada ao cliente.

NFR2: Validar no servidor Identidade Verificada, participação no Rolê e autorização aplicável em toda mutação.

NFR3: Executar respostas, declarações, correções, inativações, substituição e cancelamento atomicamente, com controle de versão e sem sobrescrita silenciosa.

NFR4: Auditar mutações relevantes com identidade interna, Nick contextual, instante e valores anterior/posterior quando aplicável.

NFR5: Atender WCAG 2.2 AA nos fluxos essenciais, com operação completa por teclado e estados que não dependem apenas de cor.

NFR6: Apresentar o conteúdo principal da prévia pública e do plano vigente em até 2,5 segundos no percentil 75 sob conexão móvel 4G estável.

NFR7: Garantir que ação confirmada reapareça após recarregar o Convite e que falhas preservem estado/entrada e permitam retry idempotente sem duplicidade.

NFR8: Persistir fuso IANA por Rolê e manter Data, Horário Aproximado e Limite Final corretos em virada de dia, gap e overlap de horário civil.

NFR9: Cessar imediatamente o acesso público detalhado após o Limite Final e eliminar dados internos conforme a política de retenção arquitetural.

NFR10: Usar Português do Brasil na interface e documentação e inglês em arquivos e identificadores de código.

### Additional Requirements

- AR1: Inicializar o projeto pelo Structural Seed arquitetural: aplicação React Router Framework Mode SSR, módulos `identity` e `outings`, composition root, migrations, testes, Cypress e diretórios operacionais. Esta é a base obrigatória da primeira história técnica.
- AR2: Usar monólito modular com arquitetura hexagonal; domínio não pode importar HTTP, React, Kysely, MySQL, Resend ou infraestrutura.
- AR3: Usar Node.js 24 LTS, React 19, React Router 8 Framework Mode, Vite 8 e TypeScript 6 com versões efetivas preservadas no `package-lock.json`.
- AR4: Usar MySQL/InnoDB como única fonte transacional, Kysely/mysql2 apenas no adapter, migrations SQL versionadas, `READ COMMITTED`, strict mode, `utf8mb4` e instantes UTC em `DATETIME(6)`.
- AR5: Modelar ownership: `identity` possui Identity, alias, challenge e session; `outings` possui Rolê, Participant, interesse, opções, respostas, declarações, conflitos, auditoria e receipts.
- AR6: Implementar autenticação passwordless por e-mail com link de continuidade e código alternativo, desafio de 10 minutos, máximo de cinco tentativas, respostas neutras e rate limits persistidos.
- AR7: Não persistir e-mail em claro; localizar identidade por HMAC versionado do e-mail e suportar rotação lazy de chaves sem dividir identidades.
- AR8: Persistir sessão opaca somente por digest, em cookie `__Host-borala_session` HttpOnly, Secure e SameSite=Lax, com duração absoluta de 30 dias e revogação server-side.
- AR9: Tratar o Convite como capacidade de descoberta: token aleatório de 192 bits persistido somente por SHA-256; agir exige sessão e Participant.
- AR10: Construir DTOs discriminados e separados por audiência/estado; não serializar entidades e fazer contract tests negativos para campos proibidos.
- AR11: Aplicar `Cache-Control: no-store`, `Referrer-Policy: no-referrer`, ausência de dados protegidos em client storage/service worker e revalidação em cold-load, BFCache, foreground e mutações.
- AR12: Validar CSRF por token HMAC, Origin e Fetch Metadata; aplicar CSP por nonce, HSTS, nosniff, frame-ancestors none e Permissions Policy mínima.
- AR13: Exigir `commandId` nos comandos de `outings`, vinculado a actor, escopo, tipo e fingerprint RFC 8785; replay divergente retorna `IDEMPOTENCY_KEY_REUSED`.
- AR14: Usar CAS/version em Outing, VenueOption, Participant, GeneralInterest e VenueResponse; ausência usa versão esperada zero; transições globais usam locks curtos e ordem canônica.
- AR15: Persistir receipt, estado, auditoria e evidência de conflito na mesma transação; deadlock só pode repetir comando idempotente com limite de tentativas.
- AR16: Impedir referências entre Rolês com FKs compostas e constraints para Participant, Option, Local selecionado e Replacement; testar rejeições cruzadas em MySQL real.
- AR17: Implementar `Clock`, tipos próprios e Temporal para `Instant`, `PlainDate`, `PlainTime` e `ZonedDateTime`; nunca depender de `Date` ou fuso implícito.
- AR18: Implementar `AfterWork`, regra de uma hora, FinalLimit padrão 03h, extensão máxima 07h e bordas 16h29/16h30/meia-noite/DST como políticas puras testáveis.
- AR19: Validar Nick por grapheme clusters e chave contextual normalizada; validar URLs somente HTTPS, sem userinfo, com limite 2.048, sem fetch e com hosts/saída seguros.
- AR20: Implementar alerta determinístico de possível duplicidade por URL canônica, similaridade de nome e rua/número, sempre não bloqueante.
- AR21: Implementar hard-delete do agregado 30 dias após FinalLimit, purge de credenciais efêmeras em até 24h, Identity órfã em 30 dias, logs por 14 dias e backups no máximo 14 dias.
- AR22: Executar maintenance idempotente em lotes, uma transação por Rolê, com lock/revalidação, ordem explícita de deleção, rollback integral e verificação de ausência de órfãos.
- AR23: Implantar como imagem OCI ARM64 única com processos web/maintenance em rootless Podman + Quadlet, Caddy no host, filesystem read-only, usuário dedicado e banco privado com TLS fail-closed.
- AR24: Exigir MySQL TLS com CA, hostname verificado, `REQUIRE SSL`, `compress:false` e readiness que falha sem cipher; nenhuma conexão plaintext ou `PREFERRED`.
- AR25: Produzir logs JSON por allowlist e métricas técnicas de baixa cardinalidade sem Identity, Rolê, Nick, token, e-mail, endereço, URL ou histórico.
- AR26: Cobrir domínio/aplicação com Vitest, adapters/concorrência com MySQL real, UI/jornadas com Cypress e acessibilidade com axe-core, seguindo TDD vermelho-verde-refatoração.
- AR27: Cobrir obrigatoriamente concorrência de declarações, respostas/inserts ausentes, cancelamento, extensões, replacement, timeout pós-commit, reuso de commandId, rotação HMAC e referências cruzadas.
- AR28: Medir LCP público com build de produção, fixture fixa, Lighthouse mobile 4G/cache frio e vinte execuções; gate p75 ≤2,5s e validação posterior por RUM agregado sem identificadores.
- AR29: CI deve bloquear merge em falha de formato, lint, tipos, regra de imports, testes, MySQL integration, Cypress/axe, Lighthouse, build ou scans.
- AR30: Publicar imagem ARM64 por SHA/digest; usar migrations expand/contract e deploy blue-green que só troca Caddy após readiness/smoke, preservando slot saudável para rollback.
- AR31: Implementar backup automático OCI + dump lógico diário cifrado por `age`, sem SQL plaintext, com alvo de sete dias, RPO 24h/RTO 4h best effort e restore trimestral/antes do piloto.
- AR32: Preservar o princípio `organizar sem governar` em regras, projeções, textos, métricas e testes; nenhuma contagem pode gerar decisão ou autoridade.

### UX Design Requirements

UX-DR1: Implementar os tokens de cor, tipografia, raios e espaçamento de `DESIGN.md`, usando `#F37735` somente em marca/decoração e cores funcionais com os pares de contraste documentados.

UX-DR2: Usar Georgia/Cambria para display e system-ui para corpo/controles, com corpo de 16 px e texto informativo essencial nunca abaixo de 13 px.

UX-DR3: Implementar layout mobile-first de uma coluna, breakpoints em 640 px e 1024 px, largura máxima 680 px, sem altura fixa, conteúdo cortado ou rolagem horizontal.

UX-DR4: Implementar foco visível de ao menos 2 CSS px, offset 2 px e contraste ≥3:1, circundando o alvo inteiro sem recorte por contêiner.

UX-DR5: Implementar `brand-signature` com logo aprovado, texto alternativo `Bora Lá` e sem comportamento de link por padrão.

UX-DR6: Implementar `invitation-summary` resolvendo audiência/estado antes dos dados e apresentando Nome → Local → Data/Hora → agregado permitido.

UX-DR7: Implementar `interest-envelope` somente como frase factual `{N} pessoas marcaram Tô a fim.`, derivada exclusivamente de `GeneralInterest.INTERESTED`, em corpo/ink-primary, sem título interrogativo, número ampliado, sombra, tendência, barra ou uso para justificar Declaração.

UX-DR8: Implementar `primary-action` nativo com estado ocupado que evita repetição e confirmação de sucesso somente após persistência.

UX-DR9: Implementar `access-gate-row` como link/botão nativo com requisito de identificação visível no nome, cadeado decorativo `aria-hidden` e preservação da intenção.

UX-DR10: Implementar `identity-gate` por e-mail/código/Nick com mensagens neutras contra enumeração, troca/sair que limpa dados e retorno focado à intenção original.

UX-DR11: Implementar `form-field` com label persistente, ajuda, erro associado, preservação segura do valor e `validation-summary` focável com links para campos inválidos.

UX-DR12: Implementar `option-card` com aparência equivalente, ordem canônica estável, estado textual/programático e aviso de duplicidade sem bloquear, destacar ou reordenar.

UX-DR13: Implementar `response-control` como `fieldset`/`legend` e radios nativos ou ARIA completo, com teclado/setas e quatro respostas de mesmo peso visual.

UX-DR14: Renderizar `top-list` somente depois dos controles de Resposta, como lista semântica de Nicks associados a `Topo`, sem ranking, avatar de status ou estatística por pessoa.

UX-DR15: Implementar `declaration-panel` deixando explícito que qualquer Pessoa Convidada identificada pode agir e que autoria não significa autoridade; contagens ficam fora do painel.

UX-DR16: Implementar `share-control` por gesto explícito com Web Share e fallback de cópia sem leitura do clipboard, confirmação em live region e mensagem sem Nicks/Respostas/autoria.

UX-DR17: Implementar `external-route-control` como `Abrir rota em…`, avisando a divulgação do endereço ao provedor e abrindo link HTTPS com `noopener noreferrer`.

UX-DR18: Implementar `operational-history` cronológico, factual e secundário, com autoria+instante e valor anterior rotulado; sem reputação, badges, agregação por autor ou restauração terminal.

UX-DR19: Implementar `state-notice` com texto e semântica: `status`/polite para sucesso e `alert` único para erro/conflito bloqueante; nunca depender somente de cor.

UX-DR20: Cobrir para cada superfície estados de carregamento, vazio, erro/retry, foco/retorno, indisponível e terminal conforme a matriz de `EXPERIENCE.md`.

UX-DR21: Distinguir offline de erro de servidor; nunca confirmar mutação offline e oferecer retry após reconexão, preservando intenção sem duplicar efeito.

UX-DR22: Montar live regions antes da operação, atualizar apenas conteúdo, usar `aria-atomic=true` para mensagem completa, não duplicar `role=alert` com `aria-live` e não roubar foco em atualização remota.

UX-DR23: Implementar diálogos de identidade, cancelamento e revisão com `role=dialog`, `aria-modal`, título associado, foco inicial, contenção de Tab, Escape quando seguro e retorno ao acionador.

UX-DR24: Atender reflow a 320 CSS px e zoom 400%, WCAG 1.4.12, retrato/paisagem, strings longas, alvos de 44×44 CSS px, reduced motion e ausência de flashes/autoplay.

UX-DR25: Garantir respostas pública e identificada mutuamente exclusivas no HTML/JSON; limpar UI/memória/formulários em logout, troca de identidade, expiração e terminalidade.

UX-DR26: Implementar precedência de renderização Cancelado → Substituído → Encerrado → Em andamento → Definido → Ocorrência declarada → Organização antes do conteúdo normal.

UX-DR27: Implementar Correção × Outro Rolê com ações diretas e consequências explícitas: editar detalhes factuais preserva o Rolê; mudar Local/Data cria Outro Rolê sem heranças.

UX-DR28: Usar voz informal, clara, factual e operacional em Português do Brasil; proibir microcopy de votação, vencedor, maioria, aprovação, urgência ou autoridade da Pessoa Criadora.

### FR Coverage Map

FR1: Epic 1 — Identidade Verificada e Nick para criação.
FR2: Epic 1 — Prévia pública minimizada do Convite.
FR3: Epic 1 — Entrada e recuperação de identidade da Pessoa Convidada.
FR4: Epic 1 — Criação pelos dois pontos de partida.
FR5: Epic 1 — Compartilhamento manual do Convite vivo.
FR6: Epic 2 — Interesse Geral independente.
FR7: Epic 2 — Criação manual de Opções com alerta de duplicidade.
FR8: Epic 2 — Correções e complementos auditáveis de Opção.
FR9: Epic 2 — Inativação, reativação e fechamento de Opções.
FR10: Epic 2 — Quatro Respostas por Opção e visibilidade nominal de Topo.
FR11: Epic 3 — Janela temporal de edição das Respostas após a definição.
FR12: Epic 3 — Declaração de que haverá Rolê.
FR13: Epic 3 — Definição do Local do Rolê.
FR14: Epic 3 — Conflitos de Declarações concorrentes.
FR15: Epic 3 — Correção factual do Local declarado.
FR16: Epic 3 — Criação e vínculo de Outro Rolê.
FR17: Epic 1 — Horário Aproximado humano e referência interna desde a criação.
FR18: Epic 4 — Alteração do Horário Aproximado dentro da janela.
FR19: Epic 4 — Consulta do plano, endereço, URLs e rota.
FR20: Epic 4 — Extensão monotônica do Limite Final.
FR21: Epic 4 — Encerramento e minimização imediata do Convite.
FR22: Epic 4 — Cancelamento excepcional e terminal.

## Epic List

### Epic 1: Criar e compartilhar um Convite vivo

A pessoa consegue provar sua identidade, criar um Rolê por qualquer um dos dois pontos de partida com Data e Horário Aproximado definitivos, abrir sua prévia pública e compartilhar o Convite no canal social.

**FRs covered:** FR1, FR2, FR3, FR4, FR5, FR17

**Boundary commitments:** persistir Data social, fuso IANA, Horário Aproximado e Limite Final padrão desde a criação; suportar `Depois do expediente`, zero Opções e agregado zero; recuperar identidade apenas pela mesma credencial; manter Nick contextual; projetar resposta pública por allowlist sem campos protegidos.

### Epic 2: Organizar interesse, locais e respostas

Pessoas identificadas conseguem registrar Interesse Geral, propor e manter Opções e responder independentemente sobre cada local enquanto o Local permanece aberto, sem votação ou ranking.

**FRs covered:** FR6, FR7, FR8, FR9, FR10

**Boundary commitments:** Interesse Geral funciona com zero, uma ou várias Opções; silêncio não é Resposta; sair de `Topo` remove Nick atomicamente; Resposta concorrente com inativação preserva consistência; Opção inativa conserva dados; alerta de duplicidade nunca bloqueia/funde/reordena; ordem canônica sobrevive a edição e reativação.

### Epic 3: Registrar o combinado e resolver mudanças

Qualquer Pessoa Convidada consegue declarar que haverá encontro, definir o Local, continuar respondendo dentro da janela permitida, compreender conflitos concorrentes, corrigir informações factuais ou criar Outro Rolê quando a decisão social mudar.

**FRs covered:** FR11, FR12, FR13, FR14, FR15, FR16

**Boundary commitments:** seleção serializa contra Resposta em andamento; declaração igual é idempotente e diferente produz conflito; a borda do Horário Aproximado segue a policy canônica; definir Local congela `AfterWork` atomicamente; Correção factual não troca a identidade social; replacement cria destino e substitui origem atomicamente, sem herdar Interesse ou Respostas.

### Epic 4: Acompanhar o Rolê até seu encerramento

As pessoas conseguem alterar o Horário Aproximado dentro das regras, consultar rota e plano vigente, estender o Limite Final, cancelar excepcionalmente e receber a visão terminal minimizada.

**FRs covered:** FR18, FR19, FR20, FR21, FR22

**Boundary commitments:** exatamente uma hora antes ainda permite alteração; extensão concorrente mantém o maior limite; `Clock >= FinalLimit` prevalece sobre qualquer estado; cancelamento concorrente deixa estado terminal único; BFCache não reexpõe dados; tempo cobre 16h29/16h30/meia-noite/03h/DST/fuso inválido; estado terminal precede rota e plano antigo.

### Regras transversais de entrega

1. Cada épico termina em um incremento demonstrável, executável e testado do ponto de vista da pessoa usuária.
2. Infraestrutura, segurança, privacidade, acessibilidade, auditoria e observabilidade entram junto da primeira história que delas necessita; não formam épicos ou fases tardias separados.
3. Nenhuma tabela, port, abstração ou framework é criado sem consumidor real no épico corrente.
4. Cada história declara os FRs, NFRs, ARs e UX-DRs cobertos e usa critérios de aceitação em `Dado`/`Quando`/`Então`/`E`, sempre em Português do Brasil.
5. Cada épico inclui pelo menos uma prova E2E do valor entregue e mantém obrigatória a regressão dos épicos anteriores.
6. Mocks orientam composição; `DESIGN.md` e `EXPERIENCE.md` governam identidade visual, estados, interação, privacidade e acessibilidade.
7. Schema e módulos evoluem por migrations incrementais e forward-compatible, sem antecipar toda a arquitetura.
8. CI mínimo e build reproduzível começam no Epic 1; logs/métricas acompanham os comportamentos; purge entra quando o Limite Final se torna operacional; deploy produtivo e restore devem estar comprovados antes do piloto.

### Anti-patterns proibidos na decomposição de histórias

- Histórias organizadas somente por frontend, backend, banco, infraestrutura ou testes.
- Scaffolding amplo sem comportamento demonstrável para a pessoa usuária.
- História que depende obrigatoriamente de uma história futura para funcionar.
- Segurança, privacidade, acessibilidade, auditoria, observabilidade ou testes adiados para uma etapa de endurecimento.
- DTO completo que carrega dados proibidos e tenta ocultá-los depois na interface.
- Schema, tabela, port, abstração ou dependência criada sem consumidor real na história corrente.
- Mais de uma história com ownership primário do mesmo FR.
- História grande demais para implementação, testes e revisão dentro de um único contexto de desenvolvimento.
- História de testes separada e posterior ao comportamento que deveria provar.
- Critério de aceitação com conectores BDD em inglês (`Given`/`When`/`Then`/`And`) ou qualquer texto documental fora do Português do Brasil.
- Marcar como pronta uma história sem incremento executável, critérios rastreáveis e demonstração do comportamento entregue.

### Checkpoints de feedback e evolução

1. Ao fim do Epic 1, validar que uma pessoa consegue identificar-se, criar, abrir e compartilhar um Convite sem ajuda operacional.
2. Ao fim do Epic 2, validar compreensão de Interesse Geral × Resposta e confirmar que a pessoa responde antes de consultar Nicks.
3. Ao fim do Epic 3, validar quem pode declarar e a compreensão de Correção factual × Outro Rolê.
4. Ao fim do Epic 4, validar localização do plano vigente, rota e compreensão dos estados Cancelado, Substituído e Encerrado.
5. Cada migration é revisada contra invariantes arquiteturais futuros conhecidos, especialmente FKs compostas, versionamento, autoria e retenção, sem antecipar schema sem consumidor.
6. A pirâmide mantém domínio rápido em Vitest, MySQL real somente onde a semântica transacional importa, Cypress para jornadas/contratos de UI e gates operacionais para Lighthouse, backup e restore.
7. `CreateReplacementOuting` reutiliza as políticas e factories do fluxo de criação, acrescentando apenas a transação de vínculo e substituição; não duplica lógica.
8. Toda alteração de história atualiza rastreabilidade FR/NFR/AR/UX-DR e revisa impacto nos épicos seguintes; mudança material de requisito ou sequência usa `bmad-correct-course`.
9. Implementações usam branches `feature/epic-N-story-M-*`, integradas em `dev` somente após testes e revisão; `main` recebe promoção de `dev` por gate de release.

## Epic 1: Criar e compartilhar um Convite vivo

A pessoa consegue provar sua identidade, criar um Rolê por qualquer um dos dois pontos de partida com Data e Horário Aproximado definitivos, abrir sua prévia pública e compartilhar o Convite no canal social.

### História 1.1: Abrir a base executável do Bora Lá

Como pessoa que acessa o Bora Lá,
Quero abrir uma aplicação rápida, acessível e coerente com sua identidade,
Para ter uma base confiável para criar e acompanhar um Rolê.

**Critérios de aceitação:**

**Dado** um clone limpo do repositório
**Quando** as dependências forem instaladas e os comandos de desenvolvimento, teste e build forem executados
**Então** a aplicação React Router Framework Mode deve iniciar por SSR em Node.js e produzir um build de produção reproduzível
**E** as versões devem respeitar a stack aprovada e permanecer fixadas no `package-lock.json`.

**Dado** uma pessoa abrindo a rota inicial
**Quando** o servidor responder
**Então** deve renderizar uma página em Português do Brasil com a marca Bora Lá e uma explicação factual do propósito do produto
**E** o conteúdo principal deve existir no HTML SSR sem depender de hidratação ou JavaScript do cliente.

**Dado** a estrutura inicial do código
**Quando** um implementador inspecionar suas dependências
**Então** as rotas devem obter comportamento pelo composition root
**E** nenhuma regra de domínio deve depender de React, HTTP, Kysely, MySQL ou adapters
**E** somente diretórios e abstrações consumidos pela história devem existir.

**Dado** a identidade visual aprovada
**Quando** a página inicial for renderizada
**Então** deve usar os tokens fundamentais de cor, tipografia, espaçamento, raios e foco de `DESIGN.md`
**E** o laranja `#F37735` deve permanecer restrito à marca ou decoração segura
**E** textos funcionais devem usar os pares de contraste documentados.

**Dado** um viewport de 320 CSS px, zoom de 400%, teclado ou ajustes de espaçamento de texto
**Quando** a pessoa navegar pela página
**Então** não deve haver perda de conteúdo, rolagem horizontal, altura fixa ou foco recortado
**E** todos os controles devem ser operáveis por teclado, com foco visível.

**Dado** qualquer resposta HTML da aplicação
**Quando** os cabeçalhos forem inspecionados
**Então** devem estar presentes CSP por nonce, `X-Content-Type-Options: nosniff`, `Referrer-Policy: no-referrer`, proteção contra framing e Permissions Policy mínima
**E** nenhum cabeçalho ou log deve incluir dado pessoal ou token sensível.

**Dado** uma pull request
**Quando** a integração contínua for executada
**Então** deve bloquear o merge em falha de formatação, lint, TypeScript, regra de imports, testes ou build
**E** deve executar ao menos um teste automatizado do shell SSR e uma verificação de acessibilidade da superfície inicial.

**Dado** o código produzido nesta história
**Quando** a implementação for revisada
**Então** deve haver rastreabilidade para AR1–AR3, AR12, AR26, AR29, NFR5, NFR10, UX-DR1–UX-DR5, UX-DR19 e UX-DR24
**E** a história não deve criar tabelas, autenticação, Convites ou abstrações sem consumidor.

### História 1.2: Solicitar acesso por e-mail com resposta neutra

Como pessoa que quer participar de um Rolê,
Quero solicitar um acesso privado pelo meu e-mail,
Para receber uma forma segura de continuar sem expor se já possuo identidade no Bora Lá.

**Critérios de aceitação:**

**Dado** uma pessoa sem sessão válida na porta de identificação
**Quando** ela informar um e-mail válido e solicitar acesso
**Então** o sistema deve responder com a mesma confirmação neutra, independentemente de a identidade já existir
**E** deve preservar a intenção que levou a pessoa até a identificação
**E** o e-mail nunca deve aparecer para outros participantes.

**Dado** o e-mail informado
**Quando** o caso de uso de emissão for executado
**Então** o e-mail normalizado deve existir apenas em memória durante lookup e entrega
**E** a persistência deve usar `IdentityEmailAlias` com HMAC versionado
**E** nenhum e-mail em claro deve ser gravado no banco, em logs, auditoria, telemetria ou URL.

**Dado** uma emissão aceita
**Quando** o desafio for criado
**Então** deve possuir link aleatório de 32 bytes e código decimal de seis dígitos, persistidos somente como digests HMAC distintos e vinculados ao `challengeId`
**E** deve expirar em dez minutos
**E** deve aceitar no máximo cinco tentativas na etapa de verificação.

**Dado** o formulário público de solicitação
**Quando** ele for enviado
**Então** a action deve validar o campo com Zod, o nonce CSRF pré-autenticação, `Origin` e Fetch Metadata
**E** mensagens de validação devem preservar o e-mail digitado somente na resposta segura da mesma interação
**E** o resumo de validação deve receber foco e ligar-se ao campo inválido.

**Dado** tentativas repetidas de emissão
**Quando** os limites forem avaliados
**Então** devem ser aplicados buckets persistidos por lookup de e-mail e digest diário de IP
**E** os padrões iniciais devem limitar três desafios por e-mail a cada 15 minutos, dez por dia, vinte por IP a cada 15 minutos e cem por dia
**E** no máximo três desafios simultaneamente válidos devem existir por e-mail
**E** um novo envio só deve ser aceito após 60 segundos.

**Dado** um desafio persistido como `PENDING`
**Quando** a transação for confirmada
**Então** o adapter de e-mail deve receber a solicitação com timeout de cinco segundos
**E** entrega confirmada deve registrar `SENT`
**E** rejeição explícita deve registrar `DELIVERY_FAILED` e expirar o desafio
**E** timeout ambíguo deve registrar `DELIVERY_UNKNOWN` e manter o desafio válido
**E** não deve existir retry automático capaz de duplicar a mensagem.

**Dado** um desafio emitido
**Quando** a mensagem for construída
**Então** deve conter o botão `Continuar no Bora Lá`, o código alternativo, a validade de dez minutos e a orientação para ignorar solicitações não iniciadas
**E** todo o conteúdo deve estar em Português do Brasil
**E** nenhum dado de outro Rolê ou identidade deve integrar a mensagem.

**Dado** sucesso, limitação, falha explícita ou entrega incerta
**Quando** a resposta for renderizada
**Então** texto, status HTTP observável e duração não devem permitir inferir se a identidade existia
**E** a confirmação deve usar região `status` com anúncio completo e sem roubar foco.

**Dado** a implementação da solicitação de acesso
**Quando** os testes forem executados
**Então** devem cobrir e-mail válido e inválido, identidade existente e inexistente, limites por e-mail/IP, cooldown, três desafios simultâneos e estados de entrega
**E** contract tests devem comprovar ausência de e-mail em claro no schema persistido, logs e resposta pública
**E** testes de interface devem cobrir teclado, foco, mensagens e reflow.

**Dado** o código produzido nesta história
**Quando** a rastreabilidade for revisada
**Então** deve cobrir parcialmente FR1 e FR3 e integralmente NFR1, AR6, AR7, AR12, AR25, UX-DR9–UX-DR11, UX-DR19, UX-DR22 e UX-DR25
**E** não deve criar Session, Participant, Outing ou tabelas de domínio ainda sem consumidor.

### História 1.3: Confirmar o acesso e estabelecer uma sessão privada

Como pessoa que recebeu um acesso do Bora Lá,
Quero confirmar o link ou o código recebido,
Para continuar minha intenção original em uma sessão privada e segura.

**Critérios de aceitação:**

**Dado** um link de acesso válido aberto a partir do e-mail
**Quando** o navegador executar o `GET` de continuidade
**Então** o sistema deve apresentar uma confirmação em Português do Brasil sem consumir o desafio
**E** nenhum scanner ou pré-visualizador de e-mail deve conseguir autenticar a pessoa apenas ao abrir o link
**E** o consumo deve exigir uma ação `POST` explícita protegida por CSRF pré-autenticação.

**Dado** um código alternativo válido
**Quando** a pessoa enviá-lo pelo formulário de confirmação
**Então** o sistema deve localizar e validar o desafio pelo digest HMAC contextual
**E** link e código devem convergir para o mesmo caso de uso de consumo
**E** o código nunca deve aparecer em URL, log, telemetria ou resposta posterior.

**Dado** um desafio não expirado e ainda não consumido
**Quando** a confirmação correta for processada
**Então** consumo do desafio, criação ou recuperação da `Identity` e emissão da `Session` devem ocorrer na mesma transação
**E** o mesmo desafio não deve produzir duas sessões por consumo concorrente
**E** a resposta só deve indicar sucesso depois do commit.

**Dado** um `IdentityEmailAlias` ainda sem `Identity` vinculada
**Quando** dois desafios válidos forem consumidos concorrentemente
**Então** o primeiro consumo deve criar e vincular a `Identity` atomicamente
**E** o segundo deve reutilizar a mesma `Identity`
**E** constraints e retries por chave duplicada não devem criar identidades separadas.

**Dado** um código incorreto
**Quando** uma tentativa for registrada
**Então** o contador persistido deve aumentar atomicamente
**E** a mensagem deve permanecer neutra
**E** após cinco tentativas o desafio deve recusar novos consumos
**E** os limites de cinquenta verificações por IP a cada 15 minutos devem ser aplicados.

**Dado** um desafio expirado, consumido, com entrega falha ou acima do limite
**Quando** a pessoa tentar confirmar o acesso
**Então** o sistema deve recusar a autenticação sem revelar se existe uma identidade
**E** deve oferecer uma nova solicitação quando o cooldown permitir
**E** nenhum estado parcial de Identity ou Session deve ser persistido.

**Dado** uma autenticação confirmada
**Quando** a sessão for emitida
**Então** o token deve possuir 32 bytes aleatórios e ser persistido somente como SHA-256
**E** o cookie deve chamar-se `__Host-borala_session`, usar `Path=/`, `HttpOnly`, `Secure` e `SameSite=Lax`
**E** a sessão deve ter duração absoluta de 30 dias
**E** autenticação e eventos de risco devem rotacionar o token.

**Dado** uma sessão válida
**Quando** uma requisição autenticada for processada
**Então** o servidor deve recuperar apenas a `Identity` correspondente
**E** o módulo `outings` deve receber somente `identityId`, nunca e-mail, alias ou dados do challenge
**E** a sessão deve poder ser revogada no servidor e deixar de autorizar requisições imediatamente após a revogação.

**Dado** uma intenção preservada antes da autenticação
**Quando** a sessão for estabelecida
**Então** a pessoa deve retornar ao mesmo Convite, criação ou ação protegida
**E** o foco deve ir ao destino restaurado ou ao próximo controle necessário
**E** a navegação não deve depender de parâmetros sensíveis em query string.

**Dado** rotação da chave HMAC de lookup ou de challenge
**Quando** aliases e desafios de versões anteriores ainda forem válidos
**Então** a leitura deve aceitar as versões configuradas
**E** criar o alias corrente para a mesma Identity quando o e-mail estiver novamente disponível em memória
**E** uma chave só deve ser aposentada quando não houver aliases ou desafios dependentes.

**Dado** a implementação da confirmação de acesso
**Quando** os testes forem executados
**Então** devem cobrir link com `GET` não consumível, confirmação `POST`, código válido/inválido, expiração, cinco tentativas, consumo concorrente, recuperação da mesma Identity, cookie seguro, rotação de chave e ausência de segredos nos logs
**E** testes de interface devem cobrir teclado, foco, erro, reflow e retorno à intenção.

**Dado** o código produzido nesta história
**Quando** a rastreabilidade for revisada
**Então** deve cobrir parcialmente FR1 e FR3 e integralmente AR6–AR8, AR11–AR12, NFR1, NFR2, NFR7, UX-DR10, UX-DR19, UX-DR22, UX-DR23 e UX-DR25
**E** não deve criar Participant, Outing ou Convite antes de uma história que os consuma.

### História 1.4: Criar um Rolê começando pelas pessoas

Como pessoa autenticada,
Quero criar um Rolê começando por quem pode participar,
Para obter um Convite vivo antes de decidir o local.

**Critérios de aceitação:**

**Dado** que possuo uma sessão válida
**Quando** acesso o fluxo “Começar pelas pessoas”
**Então** vejo um formulário SSR para informar meu Nick contextual, o nome do Rolê inicialmente preenchido como “Rolê”, a data social, o fuso horário IANA e o início aproximado como “Depois do trabalho” ou horário explícito
**E** o fluxo não apresenta local obrigatório, opção desabilitada ou promessa de funcionalidade futura.

**Dado** que envio dados válidos
**Quando** o comando de criação é processado
**Então** o sistema cria atomicamente o Rolê no estado `ORGANIZING`, minha participação contextual e o endereço público permanente do Convite
**E** nenhuma opção de local ou Interesse Geral é criada antecipadamente.

**Dado** que escolho “Depois do trabalho”
**Quando** o horário interno de referência é calculado
**Então** o formulário não exibe uma hora artificial
**E** o cálculo usa o fuso do Rolê e a regra `máximo entre 18h e agora arredondado para 30 minutos + 2 horas`
**E** respeita o limite das 03h do dia seguinte.

**Dado** que informo um horário explícito
**Quando** o Rolê é criado
**Então** esse horário é interpretado no fuso informado
**E** o limite final continua sendo 03h do dia seguinte.

**Dado** que informo meu Nick
**Quando** o valor é validado
**Então** ele aceita de 1 a 32 grafemas após normalização dos espaços
**E** rejeita caracteres de controle, bidirecionais ou invisíveis não permitidos
**E** sua chave de comparação usa NFKC e minúsculas sem remover acentos
**E** o Nick permanece único dentro do Rolê.

**Dado** que a mesma criação é reenviada com o mesmo `commandId` e o mesmo conteúdo
**Quando** o servidor recebe a repetição
**Então** ele retorna o mesmo resultado mínimo sem duplicar o Rolê ou a participação.

**Dado** que o mesmo `commandId` é reutilizado com conteúdo diferente
**Quando** o servidor valida a impressão digital do comando
**Então** rejeita a operação com `IDEMPOTENCY_KEY_REUSED`.

**Dado** que dois envios concorrentes tentam criar o mesmo Rolê
**Quando** ambos são processados
**Então** somente um conjunto de registros é persistido
**E** ambos convergem para o mesmo resultado seguro.

**Dado** que há erros de validação
**Quando** o formulário retorna
**Então** os valores seguros são preservados
**E** um resumo focável aponta para os campos inválidos
**E** os campos usam mensagens associadas e `aria-invalid`.

**Dado** que a criação termina com sucesso
**Quando** recebo a confirmação
**Então** vejo o Rolê criado e seu endereço permanente
**E** posso continuar na área autenticada sem depender da implementação de histórias posteriores.

**Dado** a implementação desta história
**Quando** os testes e a rastreabilidade forem revisados
**Então** devem cobrir proteção de sessão e CSRF, geração criptográfica do token do Convite com persistência somente do hash, fronteiras temporais, idempotência e concorrência
**E** devem comprovar cobertura de FR1, FR4 e FR17, além dos requisitos não funcionais, arquiteturais e de UX relacionados.

### História 1.5: Criar um Rolê começando por um local

Como pessoa autenticada,
Quero criar um Rolê já informando uma opção de local,
Para iniciar a organização a partir de uma ideia concreta sem torná-la vencedora ou definitiva.

**Critérios de aceitação:**

**Dado** que possuo uma sessão válida
**Quando** acesso a criação de um Rolê
**Então** vejo “Primeiro, quem topa” e “Já tenho um local” com o mesmo peso visual e sem recomendação
**E** consigo operar os dois pontos de partida por teclado e tecnologias assistivas.

**Dado** que escolho “Já tenho um local”
**Quando** o formulário é atualizado
**Então** posso informar o nome do local, endereço ou referência e URLs opcionais
**E** o nome sugerido do Rolê passa a ser `Rolê no {local}`
**E** continuo podendo editar livremente esse nome.

**Dado** que preencho os dados obrigatórios
**Quando** confirmo a criação
**Então** o sistema cria atomicamente o Rolê no estado `ORGANIZING`, minha participação contextual, a primeira Opção de local e o endereço público permanente do Convite
**E** a Opção inicial permanece aberta à organização
**E** ela não é definida automaticamente como Local do Rolê.

**Dado** que a primeira Opção é criada
**Quando** seus dados são persistidos
**Então** ela utiliza o mesmo modelo e as mesmas validações das Opções criadas posteriormente
**E** seus valores originais são preservados para futuras correções auditáveis
**E** nenhuma estrutura paralela de “local inicial” é criada.

**Dado** que informo somente nome, somente endereço ou referência, ou ambos
**Quando** o formulário é validado
**Então** ao menos uma descrição útil do local deve existir
**E** a interface explica claramente quais combinações são aceitas.

**Dado** que informo uma URL
**Quando** o servidor a valida
**Então** aceita somente HTTPS, sem credenciais embutidas e com até 2.048 caracteres
**E** não acessa a URL durante a validação
**E** preserva somente o valor necessário para apresentação e abertura segura.

**Dado** que altero o ponto de partida antes de enviar o formulário
**Quando** volto para “Primeiro, quem topa”
**Então** os dados específicos do local deixam de integrar o comando
**E** nenhum dado oculto de Opção é persistido acidentalmente.

**Dado** que a criação é repetida com o mesmo `commandId` e conteúdo
**Quando** o servidor processa o comando novamente
**Então** retorna o mesmo Rolê e a mesma Opção sem duplicação.

**Dado** que a transação falha em qualquer etapa
**Quando** o servidor devolve o erro
**Então** nenhum Rolê, participação, Opção ou recibo parcial permanece persistido
**E** a entrada segura é preservada para uma nova tentativa idempotente.

**Dado** que a criação termina com sucesso
**Quando** a confirmação é apresentada
**Então** vejo o Rolê e a Opção inicial registrados
**E** o texto deixa claro que criar o Rolê ou sugerir o primeiro local não confere autoridade adicional.

**Dado** a implementação desta história
**Quando** os testes e a rastreabilidade forem revisados
**Então** devem cobrir os dois pontos de partida, atomicidade, idempotência, alternância do formulário, validação de URLs, ausência de seleção automática e igualdade visual
**E** devem comprovar a cobertura de FR4 e a fundação necessária para FR7, além de AR13, AR14, AR19, AR20, AR32, UX-DR11, UX-DR12, UX-DR20, UX-DR24 e UX-DR28.

### História 1.6: Abrir a prévia pública minimizada do Convite

Como pessoa que recebeu um Convite,
Quero consultar uma prévia pública antes de me identificar,
Para entender o básico do Rolê sem expor informações de participantes.

**Critérios de aceitação:**

**Dado** um token de Convite válido para um Rolê em organização
**Quando** acesso seu endereço público sem sessão
**Então** vejo somente nome do Rolê, data social, Horário Aproximado, Local apenas quando já estiver definido e agregado público permitido quando disponível
**E** não vejo Nicks, respostas individuais, autoria, histórico, endereço detalhado, URLs, credenciais ou dados de autenticação.

**Dado** um Rolê criado com “Depois do trabalho”
**Quando** a prévia pública é renderizada
**Então** vejo “Depois do expediente” sem hora visível
**E** a referência móvel interna não é serializada para o cliente.

**Dado** um Rolê criado com horário explícito
**Quando** a prévia é renderizada
**Então** vejo `Por volta das HHh` em Português do Brasil
**E** a data e o horário são calculados no fuso IANA do Rolê, sem depender do fuso do servidor ou navegador.

**Dado** que existe um agregado público permitido
**Quando** ele é apresentado
**Então** utiliza somente a frase factual `{N} pessoas marcaram Tô a fim.`
**E** aparece em tipografia de corpo e cor de texto principal
**E** não usa pergunta, número ampliado, laranja funcional, tendência, barra, ranking, maioria ou recomendação.

**Dado** que ainda não existem respostas consideradas no agregado
**Quando** a prévia é aberta
**Então** a interface não interpreta o silêncio como rejeição
**E** apresenta um estado vazio factual ou omite o agregado conforme o contrato da projeção.

**Dado** que a pessoa ainda não se identificou no Rolê
**Quando** a prévia é entregue
**Então** nenhum dado identificado existe no HTML, JSON, scripts, atributos, metadados ou cache da resposta
**E** controles protegidos exibem visivelmente que exigem identificação.

**Dado** que o token do Convite é inválido, desconhecido ou malformado
**Quando** a rota pública é acessada
**Então** a resposta não revela se um `eventId`, pessoa ou Rolê específico existe
**E** apresenta uma mensagem segura em Português do Brasil.

**Dado** que a página pública é carregada, restaurada pelo BFCache ou trazida novamente ao primeiro plano
**Quando** seu estado precisa ser confirmado
**Então** o cliente revalida a projeção com o servidor
**E** não mantém dados protegidos em armazenamento local, service worker ou cache compartilhado.

**Dado** que a resposta pública é enviada
**Quando** seus cabeçalhos são inspecionados
**Então** inclui `Cache-Control: no-store`, `Referrer-Policy: no-referrer` e as políticas de segurança definidas pela arquitetura
**E** o token bruto do Convite não aparece em logs, métricas ou telemetria.

**Dado** uma conexão móvel 4G estável
**Quando** a prévia pública é medida com build de produção e cache frio
**Então** o conteúdo principal atende ao objetivo de LCP no percentil 75 de até 2,5 segundos.

**Dado** qualquer largura a partir de 320 CSS px ou zoom de 400%
**Quando** a página é utilizada
**Então** o conteúdo reflui sem corte ou rolagem horizontal
**E** os controles permanecem acessíveis por teclado, com foco visível e alvos adequados.

**Dado** a implementação desta história
**Quando** os contratos e testes forem executados
**Então** testes negativos comprovam a ausência de campos proibidos nas respostas públicas
**E** testes cobrem token válido e inválido, dois modos de horário, estado vazio, agregado factual, BFCache, acessibilidade e desempenho nos estados alcançáveis pelo Epic 1
**E** a rastreabilidade comprova FR2 e parte de FR17, além de NFR1, NFR5, NFR6, AR9–AR12, AR17, AR25, AR28 e UX-DR3–UX-DR9, UX-DR19–UX-DR26 e UX-DR28.

### História 1.7: Entrar em um Rolê com Nick contextual

Como pessoa convidada,
Quero me identificar e escolher um Nick específico para o Rolê,
Para participar sem expor minha credencial de acesso às outras pessoas.

**Critérios de aceitação:**

**Dado** que abro um Convite público e aciono uma função protegida
**Quando** ainda não possuo sessão válida
**Então** o sistema inicia o fluxo de acesso por e-mail
**E** preserva o Rolê, a ação pretendida e o ponto de retorno sem colocar dados sensíveis na URL.

**Dado** que concluo a autenticação
**Quando** ainda não participo daquele Rolê
**Então** vejo um diálogo ou formulário para escolher meu Nick contextual
**E** o título, a exigência de identificação e a finalidade do Nick são apresentados visivelmente em Português do Brasil.

**Dado** que informo um Nick válido e disponível
**Quando** confirmo minha entrada
**Então** uma participação é criada associando minha `Identity` ao Rolê
**E** somente o Nick contextual fica disponível às projeções identificadas permitidas
**E** e-mail, aliases, desafios e dados de sessão nunca atravessam para o módulo ou DTO do Rolê.

**Dado** que o Nick contém espaços Unicode repetidos ou nas extremidades
**Quando** ele é normalizado
**Então** os espaços são aparados e colapsados antes da validação
**E** o valor final contém entre 1 e 32 grafemas.

**Dado** que o Nick contém controles, caracteres bidirecionais ou invisíveis não permitidos
**Quando** tento confirmar
**Então** o servidor rejeita a entrada
**E** apresenta um erro associado ao campo sem ecoar conteúdo perigoso.

**Dado** que outro participante já utiliza uma chave contextual equivalente
**Quando** tento entrar com o mesmo Nick
**Então** o sistema informa que esse Nick já está em uso naquele Rolê
**E** preserva minha entrada segura para correção
**E** não revela qualquer credencial ou identidade global da outra pessoa.

**Dado** que duas pessoas tentam registrar simultaneamente o mesmo Nick
**Quando** as transações são processadas
**Então** a restrição única do banco permite somente uma delas
**E** a outra recebe o mesmo estado recuperável de Nick indisponível
**E** nenhuma participação duplicada ou parcial permanece.

**Dado** que minha `Identity` já possui participação naquele Rolê
**Quando** acesso novamente o Convite
**Então** o sistema recupera a participação existente em vez de criar outra
**E** retorna diretamente à intenção preservada.

**Dado** que a criação da participação é reenviada com o mesmo `commandId` e conteúdo
**Quando** o comando é repetido
**Então** retorna a mesma participação sem duplicidade
**E** a reutilização divergente do identificador retorna `IDEMPOTENCY_KEY_REUSED`.

**Dado** que entro no Rolê com sucesso
**Quando** a projeção identificada é renderizada
**Então** vejo meu Nick atual, os detalhes permitidos do Rolê e as ações disponíveis para seu estado
**E** a resposta identificada substitui integralmente a resposta pública no HTML e no JSON
**E** o foco retorna à ação originalmente solicitada ou ao próximo controle necessário.

**Dado** que a entrada falha por indisponibilidade do servidor ou ausência de conexão
**Quando** a interface apresenta o erro
**Então** distingue falha remota de estado offline
**E** não confirma minha participação antes da persistência
**E** permite repetir a intenção de forma idempotente após a reconexão.

**Dado** que o diálogo de Nick é utilizado
**Quando** navego por teclado
**Então** ele possui título associado, foco inicial interno, contenção de `Tab`, fechamento seguro por `Escape` e retorno ao acionador
**E** o layout reflui a 320 CSS px e zoom de 400%.

**Dado** a implementação desta história
**Quando** os testes e a rastreabilidade forem revisados
**Então** devem cobrir autenticação com retorno, Nick válido e inválido, colisão simples e concorrente, recuperação de participação, idempotência, ausência de credenciais nos DTOs, separação pública/identificada, teclado, foco e reflow
**E** devem comprovar parte de FR1 e FR3, além de NFR1–NFR3, NFR5, NFR7, AR5, AR10–AR16, AR19, AR25–AR27 e UX-DR9–UX-DR11, UX-DR19–UX-DR25 e UX-DR28.

### História 1.8: Recuperar a participação e corrigir o Nick

Como pessoa convidada,
Quero recuperar minha participação em outro aparelho e corrigir meu Nick quando necessário,
Para continuar no mesmo Rolê sem criar outra identidade ou perder o histórico.

**Critérios de aceitação:**

**Dado** que já participo de um Rolê
**Quando** abro o mesmo Convite em outro aparelho e provo a mesma credencial
**Então** o sistema recupera a mesma `Identity` e a mesma participação contextual
**E** não solicita um novo Nick nem cria outra pessoa no Rolê.

**Dado** que a autenticação foi concluída por um novo desafio
**Quando** a participação é localizada
**Então** o vínculo ocorre exclusivamente pela `Identity` interna
**E** e-mail, alias, desafio e dados de sessão não são enviados ao módulo `outings` nem às projeções do Rolê.

**Dado** que possuo participação no Rolê
**Quando** aciono “Corrigir meu Nick”
**Então** vejo o Nick vigente, uma explicação factual da alteração e um campo editável
**E** a interface não sugere que a correção modifica minhas respostas, ações anteriores ou autoridade.

**Dado** que informo um novo Nick válido e disponível
**Quando** confirmo a correção
**Então** o Nick atual da participação é atualizado atomicamente
**E** a alteração registra identidade interna, Nick anterior, Nick posterior e instante
**E** minhas respostas e demais vínculos continuam associados à mesma participação.

**Dado** que informo um Nick cuja chave normalizada é igual à atual
**Quando** confirmo a correção
**Então** o comando é tratado como repetição sem efeito
**E** não cria registro de auditoria enganoso.

**Dado** que o novo Nick já pertence a outra pessoa no mesmo Rolê
**Quando** a correção é processada
**Então** ela é recusada sem alterar o Nick vigente
**E** a interface informa que o Nick está indisponível e permite nova tentativa.

**Dado** que duas correções concorrentes disputam o mesmo Nick
**Quando** as transações são processadas
**Então** a restrição contextual permite somente uma alteração
**E** a outra recebe um conflito recuperável sem sobrescrita silenciosa.

**Dado** que duas correções concorrentes partem da mesma versão da minha participação
**Quando** ambas tentam salvar valores diferentes
**Então** somente a primeira alteração confirmada prevalece
**E** a segunda recebe o estado vigente e uma mensagem de conflito
**E** nenhuma delas é apresentada como socialmente mais legítima.

**Dado** que o mesmo `commandId` e conteúdo são reenviados
**Quando** o servidor recebe a repetição
**Então** devolve o resultado já confirmado sem nova auditoria
**E** a reutilização divergente retorna `IDEMPOTENCY_KEY_REUSED`.

**Dado** que uma correção foi confirmada
**Quando** recarrego o Convite ou acesso por outro aparelho
**Então** vejo o novo Nick
**E** os registros históricos permitidos preservam o Nick capturado no momento de cada ação, sem reescrever retroativamente a história.

**Dado** que a operação falha ou o aparelho fica offline
**Quando** tento corrigir o Nick
**Então** a interface não anuncia sucesso antes da persistência
**E** preserva a intenção segura e permite repetição idempotente após reconexão.

**Dado** que troco de identidade, encerro a sessão ou ela expira
**Quando** a interface volta ao estado público
**Então** remove da memória e do HTML os dados identificados e valores de formulário
**E** exige nova prova de identidade antes de restaurar a participação.

**Dado** a implementação desta história
**Quando** os testes e a rastreabilidade forem revisados
**Então** devem cobrir recuperação em outro aparelho, ausência de duplicação, correção válida, normalização equivalente, colisões, concorrência por versão, idempotência, auditoria, recarga e limpeza de dados
**E** devem comprovar FR3, além de NFR1–NFR5, NFR7, AR5, AR7–AR8, AR10–AR15, AR19, AR25–AR27 e UX-DR10–UX-DR11, UX-DR18–UX-DR25 e UX-DR28.

### História 1.9: Compartilhar manualmente o Convite vivo

Como pessoa convidada,
Quero compartilhar o Convite por uma ação explícita,
Para chamar outras pessoas sem transformar a mensagem compartilhada em fonte definitiva do Rolê.

**Critérios de aceitação:**

**Dado** que participo de um Rolê operacional
**Quando** aciono “Compartilhar Convite”
**Então** o sistema prepara uma mensagem curta em Português do Brasil
**E** a mensagem sempre contém o endereço permanente do Convite vivo.

**Dado** que a mensagem é construída
**Quando** seu conteúdo é inspecionado
**Então** ela pode conter somente nome, data e Horário Aproximado vigentes
**E** não contém Nicks, respostas, contagens nominais, autoria, histórico, credenciais, endereço detalhado ou URLs de terceiros.

**Dado** que o Rolê utiliza “Depois do trabalho”
**Quando** a mensagem é preparada
**Então** utiliza a expressão “Depois do expediente” sem revelar a referência móvel interna.

**Dado** que o Rolê possui horário explícito
**Quando** a mensagem é preparada
**Então** utiliza `Por volta das HHh` no fuso do Rolê.

**Dado** que a mensagem menciona informações vigentes
**Quando** outra pessoa a lê posteriormente
**Então** o texto deixa claro que os detalhes atualizados estão no Convite
**E** não apresenta o conteúdo compartilhado como confirmação, decisão oficial ou snapshot autoritativo.

**Dado** que o navegador oferece Web Share
**Quando** confirmo a ação de compartilhamento
**Então** o sistema abre a interface nativa somente após meu gesto explícito
**E** não seleciona destinatários, publica ou envia conteúdo automaticamente.

**Dado** que Web Share não está disponível ou é cancelado
**Quando** escolho copiar o Convite
**Então** o sistema copia a mensagem preparada sem tentar ler o conteúdo anterior da área de transferência
**E** anuncia o sucesso em uma região `status` previamente montada e com mensagem completa.

**Dado** que a cópia ou o compartilhamento falha
**Quando** a interface recebe o resultado
**Então** apresenta uma mensagem factual e permite nova tentativa
**E** não informa sucesso antes da confirmação da operação disponível no navegador.

**Dado** que o Rolê mudou desde a abertura da página
**Quando** aciono o compartilhamento
**Então** a mensagem é construída a partir da projeção vigente revalidada
**E** cancelamento, substituição ou encerramento têm precedência sobre dados antigos.

**Dado** que outra pessoa abre o endereço recebido
**Quando** o Convite é carregado
**Então** o servidor resolve o estado atual do Rolê
**E** a mensagem externa não concede autoridade, participação ou acesso identificado a quem a enviou ou recebeu.

**Dado** que navego somente por teclado ou uso tecnologia assistiva
**Quando** utilizo o controle de compartilhamento
**Então** o acionador possui nome acessível claro, foco visível e alvo de pelo menos 44×44 CSS px
**E** os estados de sucesso e erro não dependem apenas de cor.

**Dado** a implementação desta história
**Quando** os testes e a rastreabilidade forem revisados
**Então** devem cobrir Web Share, fallback de cópia, cancelamento da interface nativa, falha, ausência de leitura do clipboard, conteúdo permitido, revalidação e abertura do Convite vigente nos estados do Epic 1
**E** testes negativos comprovam a ausência de dados identificados e linguagem de autoridade
**E** a rastreabilidade comprova FR5 e completa o fluxo do Epic 1, além de NFR1, NFR5–NFR7, AR10–AR12, AR25, AR32, UX-DR16, UX-DR19–UX-DR22, UX-DR24–UX-DR26 e UX-DR28.

## Epic 2: Organizar interesse, locais e respostas

Pessoas identificadas conseguem registrar Interesse Geral, propor e manter Opções e responder independentemente sobre cada local enquanto o Local permanece aberto, sem votação ou ranking.

### História 2.1: Registrar e alterar o Interesse Geral

Como pessoa convidada,
Quero registrar minha disposição geral para participar,
Para sinalizar interesse sem escolher um local específico.

**Critérios de aceitação:**

**Dado** um Rolê em `ORGANIZING` ou `OCCURRENCE_DECLARED`
**Quando** acesso a área identificada
**Então** posso marcar `INTERESTED`, marcar `UNSURE` ou limpar minha disposição
**E** a interface apresenta o Interesse Geral separado das respostas sobre Opções.

**Dado** que altero meu Interesse Geral
**Quando** o comando é confirmado
**Então** somente minha disposição vigente é alterada atomicamente
**E** o resultado reaparece após recarregar o Convite.

**Dado** que marco `INTERESTED`
**Quando** o agregado público é recalculado
**Então** sou contado uma única vez em `interestedCount`, independentemente da quantidade ou do estado das Opções.

**Dado** que marco `UNSURE` ou limpo minha disposição
**Quando** o agregado é recalculado
**Então** deixo de integrar `interestedCount`
**E** o silêncio não é interpretado como resposta negativa.

**Dado** que possuo respostas sobre locais
**Quando** altero o Interesse Geral
**Então** nenhuma `VenueResponse` é criada, alterada ou removida
**E** o Interesse Geral não seleciona, ordena ou legitima uma Opção.

**Dado** que a mesma alteração é repetida ou ocorre conflito de versão
**Quando** o servidor processa o comando
**Então** aplica idempotência e CAS sem duplicar auditoria
**E** um conflito devolve o estado vigente sem sobrescrita silenciosa.

**Dado** a implementação desta história
**Quando** os testes forem executados
**Então** devem cobrir definir, trocar, limpar, recarregar, concorrência, agregado com zero ou várias Opções e separação de `VenueResponse` durante a Organização
**E** a rastreabilidade comprova FR6, NFR2–NFR4, NFR7, AR13–AR15, AR32 e UX-DR7, UX-DR19–UX-DR22 e UX-DR28.

### História 2.2: Propor uma Opção de local

Como pessoa convidada,
Quero propor uma Opção de local,
Para registrar uma possibilidade sem transformá-la em escolha do grupo.

**Critérios de aceitação:**

**Dado** um Rolê em Organização
**Quando** aciono “Adicionar uma Opção”
**Então** posso informar nome, endereço ou referência e URLs opcionais
**E** ao menos uma descrição útil do local é obrigatória.

**Dado** que informo URLs
**Quando** o servidor as valida
**Então** aceita apenas HTTPS, sem credenciais embutidas e com até 2.048 caracteres
**E** não acessa os endereços durante a validação.

**Dado** dados válidos
**Quando** confirmo a proposta
**Então** a Opção é criada ativa, com autoria, instante e valores originais congelados
**E** aparece após as existentes pela ordem `createdAt`, com desempate por `optionId`.

**Dado** uma URL canônica igual, nome semelhante ou rua e número próximos
**Quando** a possível duplicidade é calculada
**Então** vejo um aviso determinístico e não bloqueante antes da confirmação
**E** posso prosseguir sem que o sistema una, destaque ou selecione Opções.

**Dado** que as respostas ou a atividade mudam
**Quando** a lista é renderizada novamente
**Então** sua ordem permanece canônica
**E** não há ranking, indicação de vencedor ou recomendação.

**Dado** que duas criações iguais ou concorrentes são enviadas
**Quando** `commandId`, fingerprint e versões são verificados
**Então** repetição idêntica converge para a mesma Opção
**E** reutilização divergente retorna `IDEMPOTENCY_KEY_REUSED`.

**Dado** que o Rolê deixou a Organização antes do commit
**Quando** a criação tenta concluir
**Então** a transação é recusada sem persistir Opção parcial.

**Dado** a implementação desta história
**Quando** os testes forem executados
**Então** devem cobrir campos aceitos, URLs inválidas, duplicidade, concorrência, ordem estável, recarga e ausência de seleção automática
**E** a rastreabilidade comprova FR7, NFR2–NFR5, NFR7, AR13–AR16, AR19–AR20, AR26–AR27, AR32, UX-DR11–UX-DR12 e UX-DR19–UX-DR28.

### História 2.3: Corrigir ou complementar uma Opção

Como pessoa convidada,
Quero corrigir ou complementar os detalhes de uma Opção,
Para manter informações úteis sem apagar o que havia sido registrado.

**Critérios de aceitação:**

**Dado** uma Opção existente durante a Organização
**Quando** aciono “Editar detalhes”
**Então** vejo os valores vigentes e posso corrigir nome, endereço ou referência e adicionar URLs
**E** o nome acessível do controle identifica a respectiva Opção.

**Dado** que confirmo uma alteração factual
**Quando** o comando é persistido
**Então** uma revisão append-only registra valores anteriores e posteriores, autoria e instante
**E** os valores originais permanecem imutáveis.

**Dado** que adiciono uma URL
**Quando** a revisão é aplicada
**Então** URLs vigentes anteriores permanecem válidas
**E** o complemento não invalida dados que não foram substituídos.

**Dado** que substituo nome ou endereço
**Quando** o histórico é exibido
**Então** o valor anterior aparece como substituído, com autoria e momento
**E** o valor vigente tem precedência na visualização principal.

**Dado** que a correção produz possível duplicidade
**Quando** os valores são avaliados
**Então** o sistema mostra aviso não bloqueante
**E** não mescla nem reordena Opções.

**Dado** que duas pessoas editam a mesma versão
**Quando** os comandos concorrentes são processados
**Então** somente a primeira revisão compatível é confirmada
**E** a segunda recebe os valores vigentes para revisão consciente.

**Dado** que não há mudança efetiva
**Quando** confirmo valores equivalentes aos vigentes
**Então** nenhuma revisão ou auditoria enganosa é criada.

**Dado** a implementação desta história
**Quando** os testes forem executados
**Então** devem cobrir correção, complemento, ausência de alteração, validação, histórico, conflito, idempotência e recarga
**E** a rastreabilidade comprova FR8, NFR2–NFR4, NFR7, AR13–AR15, AR19–AR20, AR26–AR27, UX-DR12, UX-DR18–UX-DR22, UX-DR24 e UX-DR28.

### História 2.4: Inativar e reativar uma Opção

Como pessoa convidada,
Quero inativar ou reativar uma Opção durante a Organização,
Para refletir sua disponibilidade sem excluir respostas ou histórico.

**Critérios de aceitação:**

**Dado** uma Opção ativa durante a Organização
**Quando** confirmo sua inativação
**Então** ela passa ao estado inativo com autoria e instante
**E** não é excluída nem perde respostas, revisões ou posição na ordem canônica.

**Dado** uma Opção inativa
**Quando** confirmo sua reativação durante a Organização
**Então** ela volta ao estado ativo com autoria e instante
**E** recupera sua posição original, sem ser movida para o fim.

**Dado** que uma Opção está inativa
**Quando** a área identificada é renderizada
**Então** seu estado é comunicado por texto e semântica, não apenas por cor
**E** suas respostas preservadas não são apresentadas como novas.

**Dado** que aplico um filtro explícito de visibilidade
**Quando** oculto ou mostro Opções inativas
**Então** o filtro não altera a ordem canônica nem os dados persistidos.

**Dado** que uma resposta e uma inativação ocorrem concorrentemente
**Quando** as transações são serializadas
**Então** não há perda de respostas
**E** a pessoa recebe o estado vigente caso sua operação não seja mais permitida.

**Dado** que a mesma ação é repetida
**Quando** o comando idempotente é processado
**Então** retorna o estado confirmado sem duplicar eventos
**E** uma intenção divergente exige outro `commandId`.

**Dado** a implementação desta história
**Quando** os testes forem executados
**Então** devem cobrir inativação, reativação, posição original, filtros, concorrência durante a Organização, auditoria e recarga
**E** a rastreabilidade comprova FR9, NFR2–NFR4, NFR7, AR13–AR16, AR26–AR27, AR32, UX-DR12 e UX-DR18–UX-DR28.

### História 2.5: Responder sobre cada Opção

Como pessoa convidada,
Quero manter uma resposta independente para cada Opção,
Para expressar minha disposição sobre os locais sem que o sistema decida pelo grupo.

**Critérios de aceitação:**

**Dado** uma Opção ativa durante a Organização
**Quando** acesso seus controles de resposta
**Então** posso escolher `Topo`, `Tudo bem`, `Não tenho certeza` ou `Não vou nesse`
**E** as quatro respostas possuem o mesmo tamanho, peso visual e ordem neutra.

**Dado** que seleciono uma resposta pela primeira vez
**Quando** o comando é confirmado
**Então** uma única `VenueResponse` vigente é criada para minha participação e aquela Opção
**E** minha seleção reaparece após recarregar o Convite.

**Dado** que altero minha resposta
**Quando** a transação é concluída
**Então** a resposta vigente, as contagens e a lista nominal permitida são atualizadas atomicamente
**E** nenhuma contagem intermediária é exposta.

**Dado** que minha resposta vigente é `Topo`
**Quando** a Opção é renderizada
**Então** meu Nick pode aparecer na lista nominal de `Topo`
**E** essa lista aparece somente depois dos controles de resposta.

**Dado** que altero de `Topo` para outra resposta
**Quando** a operação é confirmada
**Então** meu Nick é removido da lista nominal na mesma transação
**E** as outras respostas exibem somente contagens, nunca Nicks.

**Dado** que ainda não respondi a uma Opção
**Quando** ela é exibida
**Então** meu silêncio não integra nenhuma contagem
**E** não é interpretado como recusa ou indecisão.

**Dado** que respondo a várias Opções
**Quando** as respostas são persistidas
**Então** cada uma permanece independente
**E** elas não alteram o Interesse Geral nem `interestedCount`.

**Dado** que duas respostas partem da mesma versão
**Quando** são processadas concorrentemente
**Então** CAS e unicidade preservam uma única resposta vigente
**E** a operação conflitante recebe o estado atual sem sobrescrita silenciosa.

**Dado** que uma resposta disputa com a inativação da Opção
**Quando** a transação obtém os locks canônicos
**Então** somente ações ainda permitidas são confirmadas
**E** respostas já persistidas nunca são excluídas.

**Dado** que as contagens mudam
**Quando** a lista de Opções é renderizada
**Então** a ordem continua sendo `createdAt` e `optionId`
**E** nenhuma Opção recebe destaque, celebração, ranking ou aparência de vencedora.

**Dado** que utilizo teclado ou tecnologia assistiva
**Quando** interajo com as respostas
**Então** cada conjunto usa `fieldset` e `legend`, com radios nativos ou semântica equivalente completa
**E** seleção, foco e estado não dependem apenas de cor.

**Dado** a implementação desta história
**Quando** os testes forem executados
**Então** devem cobrir inserção ausente, troca entre todos os valores, remoção nominal ao sair de `Topo`, múltiplas Opções, concorrência, inativação simultânea, ordem, teclado e reflow durante a Organização
**E** a rastreabilidade comprova FR10 e completa FR6–FR10 do Epic 2, além de NFR2–NFR5, NFR7, AR13–AR16, AR26–AR27, AR32 e UX-DR12–UX-DR14, UX-DR19–UX-DR25 e UX-DR28.

## Epic 3: Registrar o combinado e resolver mudanças

Qualquer Pessoa Convidada consegue declarar que haverá encontro, definir o Local, continuar respondendo dentro da janela permitida, compreender conflitos concorrentes, corrigir informações factuais ou criar Outro Rolê quando a decisão social mudar.

### História 3.1: Declarar que vai ter Rolê

Como pessoa convidada,
Quero declarar que o encontro vai acontecer,
Para registrar o combinado social mesmo antes de existir um Local definido.

**Critérios de aceitação:**

**Dado** um Rolê em `ORGANIZING` no qual participo
**Quando** aciono “Vai ter Rolê”
**Então** a interface explica que qualquer pessoa convidada pode fazer essa declaração
**E** não exige Local, justificativa, quórum, maioria ou confirmação de outras pessoas.

**Dado** que confirmo a declaração
**Quando** a transação é concluída
**Então** o Rolê passa para `OCCURRENCE_DECLARED`
**E** autoria, Nick contextual, instante e versão resultante são registrados atomicamente.

**Dado** que existem Interesse Geral, Opções ou Respostas
**Quando** a ocorrência é declarada
**Então** esses registros permanecem inalterados e editáveis conforme suas próprias regras
**E** nenhuma resposta é convertida em decisão.

**Dado** que a declaração é exibida
**Quando** uma pessoa identificada consulta o Rolê
**Então** vê o fato, autoria e momento
**E** a interface esclarece que autoria não representa autoridade.

**Dado** que o mesmo comando é repetido
**Quando** o Rolê já está em `OCCURRENCE_DECLARED` pela mesma declaração
**Então** a operação é idempotente e não duplica auditoria.

**Dado** que duas declarações disputam a mesma versão
**Quando** são processadas concorrentemente
**Então** a raiz do Rolê é bloqueada durante cada transação
**E** nenhuma decisão é inferida a partir de contagens ou ordem de chegada.

**Dado** que o Rolê já está definido ou terminal
**Quando** tento declarar sua ocorrência
**Então** o servidor recusa a mutação sem alterar o estado.

**Dado** a implementação desta história
**Quando** os testes forem executados
**Então** devem cobrir declaração sem Local, preservação dos dados, repetição, concorrência, autoria, recarga e estados inválidos
**E** a rastreabilidade comprova FR12, NFR2–NFR4, NFR7, AR13–AR16, AR26–AR27, AR32, UX-DR15, UX-DR18–UX-DR22, UX-DR24, UX-DR26 e UX-DR28.

### História 3.2: Definir uma Opção como Local do Rolê

Como pessoa convidada,
Quero definir uma Opção ativa como Local do Rolê,
Para registrar diretamente o plano vigente do encontro.

**Critérios de aceitação:**

**Dado** um Rolê em `ORGANIZING` ou `OCCURRENCE_DECLARED`
**Quando** consulto uma Opção ativa
**Então** posso acionar “Definir como Local do Rolê”
**E** a interface informa que qualquer pessoa convidada identificada pode agir.

**Dado** que confirmo uma Opção ativa pertencente ao Rolê
**Quando** o comando é processado
**Então** ela se torna o Local vigente
**E** todas as Opções são fechadas sem exclusão
**E** autoria, momento, estado e recibo são persistidos atomicamente.

**Dado** que o horário é `AfterWork`
**Quando** o Local é definido
**Então** a referência móvel é calculada e congelada na mesma transação
**E** usa o fuso IANA e a política temporal canônica.

**Dado** que o horário é explícito
**Quando** o Local é definido
**Então** seu instante permanece inalterado
**E** o Limite Final continua derivado da Data social no fuso do Rolê.

**Dado** que existem respostas ou Interesse Geral em processamento
**Quando** a definição obtém o lock da raiz
**Então** aguarda as operações anteriores e fecha as janelas de forma serializada
**E** nenhum dado confirmado é perdido.

**Dado** que uma Resposta disputa com a definição do Local
**Quando** as transações seguem a ordem canônica de locks
**Então** somente ações ainda permitidas são confirmadas
**E** a Resposta confirmada antes da definição é preservada sem impedir o fechamento.

**Dado** que o Local foi definido
**Quando** alguém tenta inativar ou reativar uma das Opções fechadas
**Então** o servidor rejeita a mutação
**E** todas as Opções permanecem fechadas com dados, Respostas e histórico preservados.

**Dado** que o Local foi definido
**Quando** alguém tenta alterar ou limpar o Interesse Geral
**Então** o valor aparece somente para leitura
**E** o servidor rejeita a mutação sem modificar o estado.

**Dado** que o mesmo Local é definido novamente com intenção equivalente
**Quando** o comando é repetido
**Então** retorna o resultado vigente sem duplicar declaração ou auditoria.

**Dado** que a Opção está inativa, pertence a outro Rolê ou o estado mudou
**Quando** a definição é validada
**Então** o servidor recusa a operação
**E** constraints compostas impedem referências cruzadas.

**Dado** que o Local é exibido
**Quando** a projeção identificada ou pública permitida é renderizada
**Então** o plano vigente aparece antes das Opções fechadas
**E** contagens não aparecem como justificativa da definição.

**Dado** a implementação desta história
**Quando** os testes forem executados
**Então** devem cobrir os dois estados de origem, Opção ativa e inativa, referência `AfterWork`, horário explícito, locks, repetição, fechamento do Interesse Geral e referências cruzadas
**E** a rastreabilidade comprova FR13 e parte de FR17, além de NFR2–NFR4, NFR7–NFR8, AR13–AR18, AR26–AR27, AR32, UX-DR6, UX-DR12, UX-DR15 e UX-DR18–UX-DR28.

### História 3.3: Responder durante a janela permitida

Como pessoa convidada,
Quero continuar ajustando minha resposta após a definição do Local,
Para manter minha posição atualizada até o Horário Aproximado.

**Critérios de aceitação:**

**Dado** um Rolê com Local definido
**Quando** `Clock <= approximateStart`
**Então** posso responder somente sobre a Opção escolhida
**E** as demais Opções fechadas aparecem somente para leitura.

**Dado** que o relógio está exatamente no Horário Aproximado
**Quando** envio uma resposta válida
**Então** a operação ainda é permitida conforme a borda inclusiva da política.

**Dado** que `Clock > approximateStart`
**Quando** tento criar ou alterar uma resposta
**Então** o servidor recusa a mutação
**E** a interface apresenta todas as respostas como somente leitura.

**Dado** que uma resposta começou antes da definição ou do fechamento da janela
**Quando** a transação disputa o lock com a mudança global
**Então** a ordem de aquisição dos locks determina um estado consistente
**E** nenhuma confirmação é exibida antes do commit.

**Dado** que altero minha resposta para `Topo` ou deixo `Topo`
**Quando** a operação é confirmada
**Então** contagem e lista nominal são atualizadas atomicamente
**E** Nicks continuam proibidos nas outras três respostas.

**Dado** que o horário atravessa meia-noite, gap ou overlap civil
**Quando** a janela é avaliada
**Então** a comparação usa `Instant`, `Clock`, Temporal e o fuso persistido
**E** nunca depende do relógio ou fuso do navegador.

**Dado** que a página permanece aberta enquanto a janela termina
**Quando** tento responder
**Então** o servidor decide pela hora vigente
**E** a interface revalida e substitui os controles pelo estado somente leitura.

**Dado** a implementação desta história
**Quando** os testes forem executados
**Então** devem cobrir antes, exatamente e depois do Horário Aproximado, Opção selecionada e fechadas, concorrência, `AfterWork`, meia-noite e DST
**E** a rastreabilidade comprova FR11, NFR2–NFR5, NFR7–NFR8, AR13–AR18, AR26–AR27, UX-DR13–UX-DR14 e UX-DR19–UX-DR28.

### História 3.4: Tornar visível um conflito concorrente

Como pessoa convidada,
Quero compreender quando duas declarações incompatíveis concorrem,
Para resolver a divergência com o grupo sem o sistema escolher quem tem razão.

**Critérios de aceitação:**

**Dado** duas declarações diferentes baseadas na mesma versão do Rolê
**Quando** são processadas concorrentemente
**Então** a primeira confirmação persistida permanece vigente
**E** a tentativa incompatível não altera o Local ou o estado confirmado.

**Dado** uma tentativa incompatível
**Quando** sua transação é concluída
**Então** o conflito append-only registra alvo tentado, versão observada, declaração vigente, ambas as autorias contextuais e instante
**E** conflito, recibo e evidência são persistidos atomicamente.

**Dado** que recarrego o Convite após o conflito
**Quando** acesso a projeção identificada
**Então** vejo o plano vigente e um aviso de divergência
**E** ambas as intenções e autorias aparecem de forma factual.

**Dado** que o conflito é apresentado
**Quando** seus textos e estilos são avaliados
**Então** não há vencedor, voto decisivo, legitimidade, culpa ou destaque reputacional
**E** a interface orienta que o grupo resolva a divergência no canal social.

**Dado** uma projeção pública
**Quando** o mesmo Rolê é acessado sem identificação
**Então** conflito, autoria e intenção rejeitada não aparecem no HTML ou JSON
**E** somente o estado público vigente é exibido.

**Dado** que a pessoa tenta repetir a declaração incompatível
**Quando** usa o mesmo `commandId` e conteúdo
**Então** recebe o mesmo resultado sem duplicar a evidência
**E** reutilização divergente retorna `IDEMPOTENCY_KEY_REUSED`.

**Dado** que o aviso recebe atualização remota
**Quando** o conflito chega a uma página aberta
**Então** uma região `alert` anuncia um resumo completo uma única vez
**E** oferece atualização consciente sem substituir silenciosamente o conteúdo ou roubar foco.

**Dado** a implementação desta história
**Quando** os testes forem executados
**Então** devem cobrir concorrência real em MySQL, persistência após recarga, idempotência, duas autorias, projeção pública negativa, foco e anúncio acessível
**E** a rastreabilidade comprova FR14, NFR1–NFR5, NFR7, AR10, AR13–AR16, AR26–AR27, AR32 e UX-DR15, UX-DR18–UX-DR26 e UX-DR28.

### História 3.5: Corrigir detalhes factuais do Local

Como pessoa convidada,
Quero corrigir detalhes factuais do Local definido,
Para manter o plano útil sem transformar a correção em troca de Rolê.

**Critérios de aceitação:**

**Dado** um Rolê definido e ainda operacional
**Quando** aciono “Corrigir detalhes”
**Então** posso editar nome, endereço ou URLs do Local vigente
**E** a interface explica que Local social, Data, `eventId` e Convite serão preservados.

**Dado** que confirmo uma correção válida
**Quando** a transação é concluída
**Então** os valores vigentes são atualizados por uma revisão append-only
**E** valores anteriores, autoria, Nick contextual e instante ficam preservados.

**Dado** que adiciono uma URL
**Quando** a correção é aplicada
**Então** as URLs vigentes não substituídas permanecem disponíveis
**E** todas continuam sujeitas às validações de HTTPS e saída segura.

**Dado** que tento trocar a identidade social do Local ou a Data
**Quando** o servidor avalia a intenção
**Então** a correção é recusada
**E** a interface direciona explicitamente para “Criar Outro Rolê”.

**Dado** que duas correções partem da mesma versão
**Quando** são processadas concorrentemente
**Então** somente a primeira compatível é confirmada
**E** a segunda recebe os valores atuais para revisão consciente.

**Dado** que não existe diferença efetiva
**Quando** confirmo a correção
**Então** nenhum evento de auditoria enganoso é criado.

**Dado** que o Convite é recarregado após a correção
**Quando** o plano é renderizado
**Então** os dados vigentes aparecem primeiro
**E** o histórico secundário mostra claramente os valores substituídos.

**Dado** que o Rolê está cancelado, substituído ou encerrado
**Quando** tento corrigir o Local
**Então** a mutação é bloqueada
**E** nenhum detalhe antigo reaparece por precedência incorreta.

**Dado** a implementação desta história
**Quando** os testes forem executados
**Então** devem cobrir correção e complemento, tentativa de mudar Local/Data, conflito, idempotência, histórico, estados terminais e projeções
**E** a rastreabilidade comprova FR15, NFR2–NFR5, NFR7, AR13–AR16, AR19, AR26–AR27, AR32 e UX-DR17–UX-DR28.

### História 3.6: Criar Outro Rolê para mudar Local ou Data

Como pessoa convidada,
Quero criar Outro Rolê quando o Local ou a Data realmente mudarem,
Para preservar a história anterior sem misturar dois encontros socialmente diferentes.

**Critérios de aceitação:**

**Dado** um Rolê definido e ainda não terminal
**Quando** escolho mudar o Local ou a Data
**Então** a interface oferece “Criar Outro Rolê”
**E** explica que será criado outro `eventId` e outro Convite, sem herdar Interesse ou Respostas.

**Dado** que inicio a substituição
**Quando** reviso a operação
**Então** vejo claramente os dados do Rolê anterior e os dados propostos para o novo
**E** a confirmação exige um gesto consciente em diálogo acessível.

**Dado** que confirmo dados válidos
**Quando** a transação é concluída
**Então** um novo Rolê, nova participação contextual e novo Convite são criados
**E** o anterior passa a `REPLACED` apontando para o destino
**E** criação e substituição ocorrem atomicamente.

**Dado** que o novo Rolê é criado
**Quando** seus dados são inspecionados
**Então** ele não herda Interesse Geral, Opções, Respostas, declarações ou conflitos
**E** preserva somente os valores explicitamente informados na nova criação.

**Dado** que a transação falha em qualquer etapa
**Quando** ocorre rollback
**Então** o Rolê anterior continua operacional e não substituído
**E** nenhum destino parcial ou Convite órfão permanece.

**Dado** que duas substituições concorrem
**Quando** bloqueiam e revalidam a raiz de origem
**Então** somente uma cria o destino vigente
**E** a outra recebe o estado atualizado sem cadeia ou bifurcação silenciosa.

**Dado** que o comando é repetido com o mesmo conteúdo
**Quando** o servidor encontra o recibo confirmado
**Então** retorna o mesmo novo Rolê e Convite
**E** não cria outra substituição.

**Dado** que o Convite anterior é aberto antes do Limite Final
**Quando** a projeção pública é resolvida
**Então** a substituição e o endereço do Convite vigente aparecem antes de qualquer informação antiga
**E** autoria, respostas e histórico permanecem ausentes da resposta pública.

**Dado** que uma Pessoa Convidada compartilha o Convite substituído
**Quando** a mensagem é construída
**Então** contém somente o Convite vivo e o estado factual de substituição
**E** não reutiliza Local, Data, horário ou detalhes operacionais antigos.

**Dado** que uma pessoa abre o novo Convite
**Quando** ainda não participa do novo Rolê
**Então** precisa estabelecer sua participação contextual
**E** nenhuma participação é herdada apenas por ter pertencido ao Rolê anterior.

**Dado** que navego pelo diálogo de revisão
**Quando** utilizo teclado ou tecnologia assistiva
**Então** há título associado, foco inicial, contenção de `Tab`, retorno ao acionador e consequências explícitas
**E** a distinção entre Correção e Outro Rolê não depende apenas de cor.

**Dado** a implementação desta história
**Quando** os testes forem executados
**Então** devem cobrir mudança de Local, mudança de Data, ausência de heranças, rollback, concorrência, idempotência, Convite anterior, compartilhamento factual e entrada no novo Rolê
**E** a rastreabilidade comprova FR16 e completa FR11–FR16 do Epic 3, além de NFR1–NFR5, NFR7, AR9–AR16, AR26–AR27, AR32 e UX-DR19–UX-DR28.

## Epic 4: Acompanhar o Rolê até seu encerramento

Pessoas convidadas conseguem ajustar e consultar o plano vigente, estender seu período operacional, compreender estados terminais e contar com retenção e operação seguras até o encerramento completo do ciclo de vida.

### História 4.1: Alterar o Horário Aproximado dentro da janela

Como pessoa convidada,
Quero alterar o Horário Aproximado enquanto ainda há antecedência,
Para manter o plano atualizado sem mudar a Data social do Rolê.

**Critérios de aceitação:**

**Dado** um Rolê não terminal e ainda não iniciado
**Quando** `Clock <= approximateStart - 1h`
**Então** posso propor outro Horário Aproximado na mesma Data social
**E** a interface informa que qualquer pessoa convidada pode realizar a alteração.

**Dado** que resta exatamente uma hora
**Quando** confirmo o novo horário
**Então** a alteração é permitida.

**Dado** que restam `59m59s` ou menos
**Quando** tento alterar o horário
**Então** o servidor recusa a mutação
**E** apresenta o horário vigente sem sobrescrita.

**Dado** que tento informar outra Data
**Quando** a intenção é validada
**Então** o sistema não altera o Rolê atual
**E** oferece “Criar Outro Rolê” com as consequências explícitas.

**Dado** que o Rolê usava `AfterWork` já congelado
**Quando** altero o Horário Aproximado
**Então** o novo valor passa a ser explícito e persistido como instante
**E** a Data social e o fuso IANA permanecem inalterados.

**Dado** que duas alterações partem da mesma versão
**Quando** são processadas concorrentemente
**Então** somente a primeira compatível é confirmada
**E** a segunda recebe o horário vigente para revisão.

**Dado** que a página permaneceu aberta durante a passagem da janela
**Quando** envio o formulário
**Então** o servidor decide utilizando `Clock`
**E** a interface não anuncia sucesso antes do commit.

**Dado** a implementação desta história
**Quando** os testes forem executados
**Então** devem cobrir exatamente uma hora, `59m59s`, meia-noite, DST, fuso inválido, concorrência, idempotência e tentativa de mudar a Data
**E** a rastreabilidade comprova FR18, NFR2–NFR4, NFR7–NFR8, AR13–AR18, AR26–AR27, UX-DR19–UX-DR24, UX-DR27 e UX-DR28.

### História 4.2: Consultar o plano vigente e abrir uma rota externa

Como pessoa convidada,
Quero consultar os detalhes vigentes do encontro e abrir uma rota,
Para chegar ao Local correto sem depender de mensagens antigas.

**Critérios de aceitação:**

**Dado** um Rolê definido e anterior ao Limite Final
**Quando** acesso sua projeção identificada
**Então** vejo primeiro Local vigente, endereço ou referência, URLs e Horário Aproximado
**E** correções confirmadas substituem visualmente os valores antigos.

**Dado** que o Rolê foi substituído
**Quando** o Convite é aberto
**Então** o aviso vigente aparece antes de qualquer plano anterior
**E** ações incompatíveis deixam de ser oferecidas.

**Dado** que há URLs associadas ao Local
**Quando** elas são apresentadas
**Então** possuem nomes acessíveis contextuais
**E** abrem somente destinos HTTPS validados com `noopener noreferrer`.

**Dado** que existe endereço suficiente para navegação
**Quando** aciono “Abrir rota em…”
**Então** vejo antes um aviso de que o endereço será enviado ao provedor escolhido
**E** somente após meu gesto explícito o link externo é aberto.

**Dado** que não existe endereço suficiente
**Quando** consulto o plano
**Então** o controle de rota não é oferecido
**E** a interface mantém disponíveis os demais detalhes úteis.

**Dado** que o plano muda enquanto a página está aberta
**Quando** a página volta ao primeiro plano ou solicito atualização
**Então** o estado é revalidado
**E** uma atualização remota é anunciada sem substituir silenciosamente o conteúdo.

**Dado** uma conexão móvel 4G estável
**Quando** o plano vigente é medido em produção
**Então** o conteúdo principal atende ao LCP no percentil 75 de até 2,5 segundos.

**Dado** a implementação desta história
**Quando** os testes forem executados
**Então** devem cobrir precedência, valores corrigidos, URLs, rota com consentimento, ausência de endereço, BFCache, teclado, reflow e desempenho
**E** a rastreabilidade comprova FR19, NFR1–NFR7, AR10–AR12, AR19, AR25, AR28, UX-DR6, UX-DR17 e UX-DR19–UX-DR28.

### História 4.3: Estender o Limite Final

Como pessoa convidada,
Quero estender o Limite Final de um Rolê ainda operacional,
Para manter o Convite útil quando o encontro durar mais.

**Critérios de aceitação:**

**Dado** um Rolê operacional antes do Limite Final
**Quando** escolho uma extensão posterior ao limite vigente e até 07h
**Então** posso confirmá-la diretamente
**E** a interface não exige papel de administrador, votação ou justificativa.

**Dado** que confirmo uma extensão válida
**Quando** a transação é concluída
**Então** o novo Limite Final, autoria, Nick contextual e instante são persistidos atomicamente
**E** o resultado reaparece após recarregar.

**Dado** que solicito valor igual ou anterior ao limite vigente
**Quando** o servidor processa o comando
**Então** o limite nunca é reduzido
**E** a operação é recusada ou tratada como repetição sem efeito.

**Dado** que solicito horário posterior às 07h do dia civil do limite
**Quando** a política temporal é aplicada
**Então** a operação é recusada com uma mensagem factual.

**Dado** que duas extensões válidas concorrem
**Quando** são processadas
**Então** o resultado final preserva monotonicamente o maior valor confirmado
**E** nenhuma atualização posterior reduz o limite.

**Dado** que uma janela de respostas ou de alteração de horário já terminou
**Quando** o Limite Final é estendido
**Então** essas janelas não são reabertas
**E** somente a disponibilidade operacional do Convite é prolongada.

**Dado** que `Clock >= finalLimit` ou o Rolê está substituído
**Quando** tento estender o limite
**Então** o servidor rejeita a mutação terminal.

**Dado** a implementação desta história
**Quando** os testes forem executados
**Então** devem cobrir 03h, 07h, valores iguais, menores e maiores, concorrência, meia-noite, DST, terminalidade e não reabertura de janelas
**E** a rastreabilidade comprova FR20, NFR2–NFR4, NFR7–NFR8, AR13–AR18, AR26–AR27, AR32 e UX-DR15, UX-DR18–UX-DR24, UX-DR26 e UX-DR28.

### História 4.4: Encerrar e minimizar o Convite

Como pessoa que abre um Convite após seu encerramento,
Quero receber somente a informação de que o Rolê terminou,
Para não acessar dados pessoais ou operacionais que perderam sua finalidade.

**Critérios de aceitação:**

**Dado** que `Clock >= finalLimit`
**Quando** qualquer projeção do Convite é resolvida
**Então** a resposta contém somente `Este Rolê terminou.`
**E** essa regra é aplicada antes da leitura de entidades e campos do Rolê.

**Dado** uma sessão válida ou participação anterior
**Quando** o Convite já terminou
**Então** não vejo Nicks, respostas, Interesse Geral, Local, endereço, URLs, autoria, histórico, conflito ou controles de recuperação.

**Dado** uma resposta pública ou identificada
**Quando** seu HTML e JSON são inspecionados
**Então** nenhum dado proibido está apenas oculto por CSS
**E** o contrato terminal não serializa esses campos.

**Dado** que a página estava aberta ao atravessar o Limite Final
**Quando** volta ao primeiro plano ou tenta realizar uma ação
**Então** o servidor retorna o estado encerrado
**E** a interface limpa dados identificados e substitui a tela pelo aviso terminal.

**Dado** que o Rolê havia sido substituído antes do limite
**Quando** o relógio alcança o Limite Final
**Então** a minimização pós-limite prevalece
**E** a resposta passa a conter somente `Este Rolê terminou.`.

**Dado** que qualquer comando é enviado após o limite
**Quando** a guarda temporal é aplicada
**Então** a mutação é recusada sem criar recibo enganoso ou reabrir estado.

**Dado** que alguém recebeu ou compartilhou anteriormente o endereço do Convite
**Quando** abre esse endereço após o Limite Final
**Então** o servidor resolve somente `Este Rolê terminou.`
**E** a projeção encerrada não oferece controle de compartilhamento com dados operacionais antigos.

**Dado** que o encerramento é apresentado
**Quando** utilizo teclado, leitor de tela, 320 CSS px ou zoom de 400%
**Então** a mensagem permanece clara, focável quando necessário e sem conteúdo cortado.

**Dado** a implementação desta história
**Quando** os testes forem executados
**Então** devem atravessar o limite nos estados já implementados, inspecionar negativamente HTML/JSON/cache e testar ações tardias, Convite compartilhado, BFCache e limpeza de memória
**E** a rastreabilidade comprova FR21, NFR1–NFR3, NFR5, NFR7–NFR9, AR10–AR12, AR17–AR18, AR26–AR27 e UX-DR19–UX-DR26 e UX-DR28.

### História 4.5: Cancelar o Rolê

Como pessoa convidada,
Quero cancelar um Rolê que não deve mais acontecer,
Para interromper novas ações e comunicar esse fato de forma inequívoca.

**Critérios de aceitação:**

**Dado** um Rolê não terminal antes do Limite Final, inclusive em andamento
**Quando** aciono “Cancelar Rolê”
**Então** a ação está disponível independentemente de quem criou o Rolê
**E** a interface não utiliza papel de administrador ou dono.

**Dado** que inicio o cancelamento
**Quando** o diálogo é aberto
**Então** vejo a consequência terminal de forma explícita
**E** preciso confirmar por um gesto consciente.

**Dado** que confirmo o cancelamento
**Quando** a transação é concluída
**Então** estado, autoria, Nick contextual, instante, auditoria e recibo são persistidos atomicamente
**E** todas as novas mutações do Rolê são bloqueadas.

**Dado** que uma resposta, correção ou extensão concorre com o cancelamento
**Quando** as transações obtêm os locks canônicos
**Então** somente operações confirmadas antes do cancelamento permanecem
**E** nenhuma operação posterior reabre ou sobrescreve o estado terminal.

**Dado** que o Convite cancelado é aberto antes do Limite Final
**Quando** a resposta pública é renderizada
**Então** contém somente `Rolê cancelado.`
**E** não expõe autoria, Local, endereço, respostas ou histórico.

**Dado** que uma pessoa identificada abre o Convite cancelado antes do limite
**Quando** a projeção é renderizada
**Então** pode ver a autoria e o momento permitidos pela matriz identificada
**E** não recebe controles capazes de restaurar o Rolê.

**Dado** que o mesmo cancelamento é repetido
**Quando** usa o mesmo `commandId` e conteúdo
**Então** recebe o estado confirmado sem duplicar auditoria
**E** uma intenção divergente é rejeitada.

**Dado** que uma Pessoa Convidada compartilha o Convite cancelado antes do Limite Final
**Quando** a mensagem é construída
**Então** contém somente o Convite vivo e o estado factual de cancelamento
**E** não reutiliza Local, Data, horário ou detalhes operacionais antigos.

**Dado** que `Clock >= finalLimit`
**Quando** o Convite cancelado é consultado
**Então** a minimização apresenta somente `Este Rolê terminou.`.

**Dado** que o diálogo é operado por teclado
**Quando** navego e decido confirmar ou voltar
**Então** há título associado, foco inicial, contenção de `Tab`, `Escape` seguro e retorno ao acionador.

**Dado** a implementação desta história
**Quando** os testes forem executados
**Então** devem cobrir cancelamento em todos os estados operacionais, concorrência, repetição, projeções pública e identificada, compartilhamento factual, pós-limite, foco e impossibilidade de restauração
**E** a rastreabilidade comprova FR22, NFR1–NFR5, NFR7, AR10, AR13–AR18, AR26–AR27, AR32, UX-DR15, UX-DR18–UX-DR28.

### História 4.6: Eliminar dados conforme a política de retenção

Como pessoa que participou de um Rolê,
Quero que seus dados deixem de existir quando perderem sua finalidade,
Para que o Convite não se torne um arquivo permanente da vida social do grupo.

**Critérios de aceitação:**

**Dado** um Rolê cujo Limite Final ocorreu há pelo menos 30 dias
**Quando** o processo de manutenção seleciona o lote
**Então** elimina explicitamente seu agregado de domínio na ordem segura
**E** não depende de cascatas acidentais.

**Dado** challenges, sessões vencidas ou revogadas, buckets sem utilidade ou aliases órfãos elegíveis
**Quando** a manutenção diária é executada
**Então** credenciais efêmeras e vínculos sem finalidade são eliminados em até 24 horas conforme a política
**E** uma `Identity` órfã é eliminada após 30 dias.

**Dado** um lote de manutenção
**Quando** uma exclusão falha
**Então** a transação daquele Rolê sofre rollback integral
**E** os demais lotes podem continuar sem deixar referências órfãs.

**Dado** que dois processos tentam executar o mesmo período
**Quando** consultam `maintenance_runs` e adquirem os locks
**Então** somente uma execução efetiva ocorre
**E** repetição posterior é idempotente.

**Dado** que um Rolê muda de estado ou limite durante a seleção
**Quando** o worker obtém o lock
**Então** revalida a elegibilidade antes de apagar qualquer dado.

**Dado** que a manutenção termina
**Quando** logs e métricas são emitidos
**Então** registram somente job, período, duração, resultado e quantidades agregadas
**E** não contêm Identity, Rolê, Nick, token, endereço, URL ou histórico.

**Dado** os prazos operacionais
**Quando** a retenção é auditada
**Então** logs técnicos não ultrapassam 14 dias
**E** o estado público detalhado já havia cessado imediatamente no Limite Final.

**Dado** a implementação desta história
**Quando** os testes forem executados em MySQL real
**Então** devem cobrir bordas de 24 horas e 30 dias, lotes, retry, concorrência, rollback, revalidação, ausência de órfãos e logs por allowlist
**E** a rastreabilidade comprova NFR1, NFR3–NFR4, NFR9, AR21–AR22, AR25–AR27 e AR32.

### História 4.7: Executar o Bora Lá em runtime seguro

Como pessoa responsável pela operação do Bora Lá,
Quero executar a aplicação e a manutenção em um runtime isolado com conexão segura ao banco,
Para disponibilizar o serviço sem aceitar privilégios ou transporte desnecessários.

**Critérios de aceitação:**

**Dado** um commit aprovado
**Quando** a entrega é produzida
**Então** a CI publica uma imagem OCI ARM64 única e imutável por SHA e digest
**E** a mesma imagem oferece os processos `web` e `maintenance`.

**Dado** o ambiente Oracle Linux 9 ARM64
**Quando** o runtime é provisionado
**Então** executa rootless sob o usuário dedicado `borala`, via Podman e Quadlet
**E** utiliza filesystem read-only, capabilities removidas e somente os bind mounts explicitamente autorizados.

**Dado** os processos `web` e `maintenance`
**Quando** suas unidades são inspecionadas
**Então** não utilizam socket ou daemon privilegiado
**E** publicam o serviço web somente em uma porta de loopback destinada ao slot.

**Dado** qualquer processo que acessa MySQL
**Quando** estabelece a conexão
**Então** exige CA confiável, hostname verificado, `REQUIRE SSL`, `compress:false` e TLS fail-closed
**E** readiness falha quando `Ssl_cipher` está vazio
**E** não existe fallback para `PREFERRED`, plaintext ou validação parcial.

**Dado** o host ou o banco indisponível
**Quando** readiness é executada
**Então** o processo não é anunciado como pronto
**E** logs por allowlist não expõem credenciais, endpoints sensíveis ou conteúdo de domínio.

**Dado** a implementação desta história
**Quando** os gates operacionais forem executados
**Então** devem validar imagem ARM64, execução rootless, filesystem read-only, capabilities, portas locais e TLS fail-closed
**E** a rastreabilidade comprova AR23–AR25, AR29 e os requisitos de segurança operacional relacionados.

### História 4.8: Implantar uma versão com troca segura

Como pessoa responsável pela operação do Bora Lá,
Quero implantar um novo digest em um slot inativo antes de trocar o tráfego,
Para atualizar o serviço com validação e rollback previsíveis.

**Critérios de aceitação:**

**Dado** um digest ARM64 aprovado
**Quando** a implantação é iniciada
**Então** verifica versão efetiva do MySQL, TLS, cipher e migration vigente
**E** grava somente o digest aprovado no Quadlet do slot inativo.

**Dado** o slot inativo atualizado
**Quando** migrations forward-compatible, readiness e smoke são executados
**Então** o Caddy só troca o upstream depois da aprovação de todos os gates
**E** o slot saudável anterior permanece disponível para rollback.

**Dado** uma migration incompatível, readiness ou smoke falho
**Quando** a implantação é avaliada
**Então** o tráfego não é trocado
**E** a falha não interrompe o slot vigente.

**Dado** uma release que remove coluna, constraint ou semântica
**Quando** a estratégia de migration é revisada
**Então** usa expand/contract e elimina leitores ou escritores antigos em release anterior
**E** não depende de downgrade destrutivo.

**Dado** uma reinicialização do host
**Quando** os serviços retornam
**Então** Caddy e o slot ativo são restaurados por systemd e linger
**E** nenhuma imagem `latest` ou atualização automática é puxada.

**Dado** a implementação desta história
**Quando** os testes de implantação forem executados
**Então** devem cobrir sucesso, falha de migration, readiness, smoke, troca Caddy, rollback e reboot
**E** a rastreabilidade comprova AR29–AR30 e os contratos de implantação de AR23–AR24.

### História 4.9: Proteger e restaurar backups

Como pessoa responsável pela operação do Bora Lá,
Quero produzir backups cifrados e comprovar sua restauração,
Para reduzir o risco de perda silenciosa sem armazenar SQL em claro.

**Critérios de aceitação:**

**Dado** o job diário de backup
**Quando** o dump é produzido
**Então** usa `mysqldump --single-transaction` com TLS e transmite por `zstd` e `age`
**E** nenhum SQL em claro é gravado em disco
**E** somente o ciphertext confirmado é enviado ao Object Storage.

**Dado** falha, interrupção, disco cheio ou arquivo `.part` órfão
**Quando** o pipeline encerra ou reinicia
**Então** artefatos incompletos são removidos com segurança
**E** o dump válido mais recente e ao menos duas gerações são priorizados sem cobrança silenciosa.

**Dado** a política de retenção de backup
**Quando** quota e gerações são avaliadas
**Então** busca manter sete dias dentro do envelope gratuito e nunca ultrapassa 14 dias
**E** alerta a 60% da quota antes de remover a geração válida mais antiga.

**Dado** um ensaio trimestral, anterior ao piloto ou posterior a mudança relevante de schema
**Quando** o backup é restaurado em ambiente limpo
**Então** major do banco, TLS, migrations e smoke tests são validados
**E** nenhuma chave privada de restauração reside na VM
**E** a evidência registra checksum, versão, duração e resultado sem conteúdo do banco.

**Dado** os objetivos operacionais
**Quando** continuidade e recuperação são avaliadas
**Então** o processo busca RPO de 24 horas e RTO de quatro horas em regime best effort
**E** o risco de capacidade indisponível do ambiente gratuito permanece documentado e monitorado.

**Dado** a implementação desta história
**Quando** os gates de backup e restauração forem executados
**Então** devem cobrir sucesso, disco cheio, interrupção, reboot com `.part`, chave indisponível, quota e restauração limpa
**E** a rastreabilidade comprova AR24–AR25, AR29, AR31 e os requisitos de retenção e recuperação restantes.
