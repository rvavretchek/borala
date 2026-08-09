# Constituição do Bora Lá

## Princípios fundamentais

### I. Design First e autonomia humana

Toda funcionalidade deve partir de comportamento observado, necessidade de usuário e hipótese testável. O Bora Lá organiza informações e registra decisões, mas não determina como grupos devem decidir. Consenso, maioria, quórum, influência e legitimidade permanecem sociais, salvo requisito futuro explicitamente validado.

### II. Orientação a objetos com simplicidade

O código deve aplicar Clean Code, Object Calisthenics, SOLID, Lei de Demeter, composição sobre herança, encapsulamento e padrões de projeto somente quando reduzirem acoplamento ou tornarem uma intenção mais explícita. Entidades e objetos de valor devem proteger invariantes; camadas, abstrações e herança sem valor demonstrável são proibidas.

### III. TDD como método de desenvolvimento

Toda mudança de comportamento deve seguir vermelho, verde e refatoração. Testes devem nascer antes ou junto da implementação, provar regras de domínio e permanecer determinísticos. Nenhuma entrega é considerada pronta com testes falhando, ignorados sem justificativa ou dependentes de ordem. Cypress é o padrão para testes E2E do frontend.

### IV. Privacidade, consentimento e transparência

Dados pessoais devem ser mínimos, privados por padrão e usados apenas para finalidade comunicada. Contatos de autenticação nunca são expostos. Autoria de ações coletivas deve ser visível quando necessária para confiança. Memória, reutilização, localização e qualquer compartilhamento futuro exigem consentimento proporcional, explícito e revogável.

### V. Evolução sem especulação

O produto deve entregar a menor fatia funcional que valide valor. Funcionalidades futuras não justificam frameworks vazios, generalizações prematuras ou dependências sem uso atual. Decisões reversíveis permanecem simples; decisões caras ou irreversíveis exigem evidência, alternativas e registro de trade-offs.

## Padrões de produto e engenharia

- Toda comunicação com o responsável pelo produto e toda documentação são em Português do Brasil.
- Arquivos, classes, funções, variáveis, tipos, eventos e demais identificadores de código são em inglês.
- O frontend utiliza React.js. Bibliotecas TanStack — Start, Router, Query, DB, Table, Charts, Form, HotKeys e outras — só entram quando trouxerem padronização ou ganho real demonstrável.
- O backend será escolhido em sessão específica de planejamento. Em empate técnico entre Node.js e outra alternativa, Node.js vence.
- Diagramas de fluxo, estado e arquitetura devem usar Mermaid quando isso melhorar materialmente a compreensão.
- Estados coletivos e transições concorrentes exigem operações atômicas, histórico auditável e nenhuma sobrescrita silenciosa.
- Integrações externas devem permanecer isoladas do domínio e só serão construídas quando pertencerem ao escopo vigente.
- Requisitos, SPEC, testes e implementação devem usar terminologia consistente e manter rastreabilidade suficiente para revisão.

## Qualidade e definição de pronto

Uma mudança só pode ser concluída quando:

1. satisfaz critérios de aceitação rastreáveis;
2. possui testes automatizados adequados ao risco;
3. mantém toda a suíte relevante aprovada;
4. preserva os invariantes do domínio;
5. não amplia escopo sem decisão explícita;
6. atualiza documentação quando altera comportamento ou decisão;
7. respeita privacidade, acessibilidade e segurança aplicáveis;
8. passa por revisão de código e, nos fluxos principais, por teste E2E.

## Governança

- Esta Constituição prevalece sobre convenções locais, atalhos de implementação e documentos anteriores conflitantes.
- Alterações exigem justificativa, impacto esperado, atualização de versão e data, além de revisão dos artefatos afetados.
- Mudanças incompatíveis nos princípios fundamentais exigem versão principal; inclusão material compatível exige versão secundária; correções editoriais usam versão de patch.
- Exceções temporárias devem ser explícitas, possuir responsável, motivo e prazo de remoção.
- O Product Brief define direção; a SPEC e seus companions definem o contrato do MVP; decisões de arquitetura definem implementação sem contrariar os dois.

**Version**: 1.0.0 | **Ratified**: 2026-08-06 | **Last Amended**: 2026-08-06
