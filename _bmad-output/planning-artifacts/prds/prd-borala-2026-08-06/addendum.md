---
title: "Adendo técnico e de produto — PRD Bora Lá"
created: 2026-08-06
updated: 2026-08-06
---

# Adendo técnico e de produto — Bora Lá

Este adendo preserva decisões que orientam os workflows posteriores, mas não são requisitos funcionais do produto.

## Premissas obrigatórias de engenharia

- Desenvolvimento orientado a objetos com Clean Code, Object Calisthenics, SOLID, Lei de Demeter, encapsulamento e composição sobre herança.
- Padrões de projeto somente quando reduzirem acoplamento ou tornarem a intenção mais explícita.
- TDD em vermelho, verde e refatoração para toda mudança de comportamento.
- Cypress como padrão dos testes E2E.
- React.js no frontend.
- Bibliotecas TanStack devem ser avaliadas individualmente; entram apenas quando trouxerem padronização ou ganho real demonstrável.
- O backend será escolhido em planejamento de arquitetura. Em empate técnico com outra alternativa, Node.js será escolhido.
- Documentação e comunicação em Português do Brasil; arquivos e identificadores de código em inglês.

## Decisões de design com consequência arquitetural

- O domínio deve distinguir `eventId` da identidade social Local do Rolê + Data.
- Estados coletivos exigem controle de concorrência, idempotência, transições atômicas e histórico auditável.
- Valores originais de Opção são imutáveis; correções e complementos são registros posteriores.
- A credencial de autenticação é privada e separada do Nick contextual.
- O Convite é a fonte viva; mensagens compartilhadas são snapshots sem autoridade sobre o estado.
- A referência interna móvel de `Depois do expediente` é mecanismo do sistema e não deve vazar como precisão visual.
- A extensão do Limite Final é uma operação monotônica e concorrente: qualquer Pessoa Convidada pode escolher um horário posterior, limitado a 07h.
- Expiração pública e retenção interna são conceitos diferentes.

## Alternativas deliberadamente rejeitadas no MVP

- Votação automática, ranking, quórum ou regra de maioria: governariam uma dinâmica que varia por grupo.
- Chat ou várias notas livres da mesma pessoa: recriariam uma conversa mais pobre dentro do produto.
- Uma nota livre por pessoa e memória histórica: têm valor futuro, mas exigem grupo persistente e consentimento explícito.
- Remoção de participante e moderação: complexidade desproporcional para o happy hour espontâneo.
- Bloqueio de Opção duplicada: similaridade pode indicar duplicidade ou apenas locais próximos; aviso é suficiente.
- Prazo público de sete dias após o Rolê: só faria sentido com memória/reaproveitamento, ausentes no MVP.
- Integração com WhatsApp: hipótese futura a ser priorizada somente com evidência de uso do núcleo gratuito.

## Handoffs esperados

- **UX:** detalhar arquitetura de informação, conteúdo, acesso progressivo, estados e prevenção de confusão entre Correção e Outro Rolê.
- **Arquitetura:** decidir autenticação, backend, persistência, concorrência, fuso, expiração e retenção.
- **Épicos e histórias:** decompor FRs mantendo IDs e consequências testáveis.
- **Estratégia de testes:** derivar testes de domínio e Cypress E2E das jornadas e máquinas de estado.
