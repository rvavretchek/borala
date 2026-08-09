---
id: SPEC-borala-mvp
companions:
  - state-machines.md
  - mvp-rules.md
  - ../../../CONSTITUTION.md
sources:
  - ../../planning-artifacts/briefs/brief-borala-2026-08-06/brief.md
---

> **Contrato canônico.** Esta SPEC e os arquivos em `companions:` formam o contrato completo para construção, teste e validação do MVP.

# Bora Lá — SPEC do MVP

## Why

Grupos recorrentes perdem adesão porque o happy hour permanece incerto enquanto respostas dispersas, preferências conflitantes e confirmações tardias se acumulam. O Bora Lá deve manter um estado compartilhado que torne adesão, opções e declarações visíveis, sem substituir o canal social nem impor como o grupo decide.

## Capabilities

- **CAP-1**
  - **intent:** A pessoa pode provar uma identidade privada e escolher um nick contextual para agir sem expor contato.
  - **success:** A mesma identidade realiza ações autoradas; nenhum participante recebe telefone, e-mail ou credencial de outro.

- **CAP-2**
  - **intent:** A pessoa pode criar um rolê começando pelo interesse das pessoas ou por um local conhecido.
  - **success:** Os dois caminhos produzem um convite com data, referência humana de horário e nome sugerido editável.

- **CAP-3**
  - **intent:** A pessoa pode compartilhar um link universal no canal social escolhido.
  - **success:** Sem identificação, o link mostra nome, data, referência de horário, local quando definido e contagem agregada; após identificação, libera detalhes e ações.

- **CAP-4**
  - **intent:** Pessoas convidadas podem declarar interesse geral e responder independentemente a cada opção de local.
  - **success:** Cada opção aceita `Topo`, `Tudo bem`, `Não tenho certeza` ou `Não vou nesse`; somente `Topo` associa nick publicamente.

- **CAP-5**
  - **intent:** Pessoas convidadas podem sugerir e manter múltiplas opções de local sem apagar histórico.
  - **success:** Sugestões congelam na criação, aceitam correções auditadas, URLs adicionais e alternam entre ativa e inativa sem exclusão.

- **CAP-6**
  - **intent:** Qualquer pessoa convidada e identificada pode registrar decisões produzidas pelo grupo.
  - **success:** `Vai ter rolê` e a definição do local funcionam sem quórum, votação automática, ranking ou autoridade central.

- **CAP-7**
  - **intent:** O sistema pode distinguir correção de registro de substituição real do rolê.
  - **success:** Correção mantém o rolê e o histórico; local ou data diferentes criam outro rolê sem migrar respostas.

- **CAP-8**
  - **intent:** O grupo pode usar horário aproximado sem transformá-lo em compromisso rígido.
  - **success:** `Depois do expediente` permanece linguagem humana; horário informado pode mudar na mesma data somente até uma hora antes do horário vigente.

- **CAP-9**
  - **intent:** Qualquer pessoa convidada e identificada pode cancelar o rolê em situação excepcional.
  - **success:** Cancelamento mostra autoria e horário, pode ocorrer antes ou durante o encontro e encerra o rolê sem restauração.

- **CAP-10**
  - **intent:** Pessoas convidadas podem consultar e redistribuir o plano vigente durante o encontro.
  - **success:** Até o limite final, o link oferece local, endereço, URLs, rota e compartilhamento; mensagens externas sempre apontam para o estado vivo.

- **CAP-11**
  - **intent:** O sistema pode encerrar o acesso detalhado ao fim da janela operacional do rolê.
  - **success:** Após o limite final, o link não revela nomes, respostas, local ou histórico e não oferece reaproveitamento.

## Constraints

- O Bora Lá organiza informações e registra declarações; não determina consenso, maioria, quórum ou legitimidade social.
- A conversa permanece no canal externo; o MVP não contém chat nem postagem automática.
- O contato usado para autenticação é privado; nicks e autorias são contextuais ao rolê.
- O nome público pode repetir; um `eventId` interno e imutável garante unicidade técnica.
- Nick não pode repetir dentro do mesmo rolê. Identidades criadas por métodos diferentes não são fundidas automaticamente.
- A identidade social do rolê definido é local + data. Alterar local ou data cria outro rolê; alterar horário na mesma data não.
- Opções de local existem somente durante a organização. Depois da definição, outro local é outro rolê.
- A sugestão original é imutável. Nome recebe correção estruturada; endereço e URLs recebem revisões auditadas.
- Sugestão nunca é excluída; pode ficar inativa e ser reativada por qualquer pessoa identificada.
- Conflitos concorrentes são mostrados e corrigidos conscientemente; nenhuma declaração coletiva sofre sobrescrita silenciosa.
- `Depois do expediente` usa referência interna móvel, mas a interface não exibe precisão não informada pelo grupo.
- Horário informado só muda enquanto o horário vigente estiver a pelo menos uma hora; a data deve permanecer igual.
- Cancelamento é terminal. Depois do horário aproximado, respostas ficam somente leitura; acesso operacional permanece até o limite final.
- Para rolê noturno iniciado após 18h, o limite final padrão é 03h do dia seguinte. Qualquer pessoa convidada e identificada pode escolher um limite posterior, no máximo até 07h, enquanto o link estiver ativo.
- Comunicação e documentação são em Português do Brasil; nomes de arquivos, classes, funções, variáveis e demais identificadores de código são em inglês.
- Implementação deve cumprir a Constituição do projeto, incluindo TDD, Object Calisthenics, orientação a objetos, SOLID, Lei de Demeter e composição sobre herança.

## Non-goals

- Grupo persistente, point, memória, notas livres ou histórico reutilizável.
- Descoberta assistida, ponto médio, pesquisa de estabelecimentos, mapa embutido ou avaliações agregadas.
- Chat, comentários, notificações automáticas ou integração com WhatsApp, Teams, Slack ou Telegram.
- Reserva, publicidade, assinatura, pagamento ou qualquer monetização.
- Festa, aniversário, modo anfitrião, fotos, registro de desfecho ou comparecimento.
- Moderação social, remoção de participantes ou prevenção de conflitos extremos entre convidados.

## Success signal

Em uma demonstração ponta a ponta, um criador inicia um rolê sem grupo prévio, compartilha o link, convidados identificados respondem a opções concorrentes, alguém declara o local sem regra automática e uma pessoa tardia abre o mesmo link para consultar o plano vigente e a rota. O fluxo permanece compreensível sem abandonar o canal social.

## Open Questions

- Quais métodos de autenticação verificável equilibram melhor cobertura, custo e continuidade entre aparelhos no MVP?
- Qual backend atende melhor o domínio, a privacidade e a concorrência; se Node.js empatar tecnicamente, ele deve ser escolhido.
- Qual prazo técnico de retenção interna será aplicado após o link deixar de expor detalhes?
