# Regras detalhadas do MVP

Este companion é parte normativa da [SPEC](./SPEC.md).

## Vocabulário

| Termo | Definição |
|---|---|
| Rolê | Encontro identificado socialmente por local e data depois de definido. |
| Organização | Período anterior à definição do local, com opções e respostas abertas. |
| Opção | Local candidato para a data do rolê em organização. |
| Outro rolê | Resultado de mudar local ou data de um rolê já definido. |
| Correção | Ajuste de um registro errado sem mudar a decisão social que ocorreu. |
| Horário aproximado | Referência operacional frouxa dentro da mesma data. |
| Limite final | Momento até o qual o link oferece consulta operacional do encontro. |

## Identidade e visibilidade

| Situação | Regra |
|---|---|
| Antes da identificação | Mostrar nome, data, horário humano, local quando definido e total agregado de Pessoas Convidadas distintas cujo Interesse Geral vigente é `Tô a fim`. `Ainda não sei`, ausência e Respostas sobre Opções não entram nessa contagem. |
| Depois da identificação | Mostrar nicks, opções, contagens, autorias e ações permitidas. |
| Contato | Nunca expor telefone, e-mail ou credencial. |
| Nick | Exigir unicidade dentro do rolê; permitir correção auditada. |
| Outro aparelho, mesma credencial | Reconhecer a identidade existente. |
| Outro aparelho, outra credencial | Aceitar identidade separada; não tentar fundir. |

## Respostas

| Resposta | Semântica | Visibilidade |
|---|---|---|
| Topo | Iria se esta opção fosse escolhida. | Nick e contagem. |
| Tudo bem | Não é a preferência, mas iria. | Somente contagem. |
| Não tenho certeza | Existe rejeição ou incerteza parcial. | Somente contagem. |
| Não vou nesse | A pessoa não iria a este local. | Somente contagem. |

- Cada pessoa mantém uma resposta atual por opção.
- Trocar de `Topo` remove o nick da lista nominal de forma atômica.
- Enquanto o rolê estiver em organização, opções e respostas permanecem maleáveis sem pressão de prazo.
- Se o rolê for definido antes do horário aproximado, a resposta ao plano vigente pode mudar até esse horário.
- Depois do horário aproximado, respostas ficam somente leitura.
- Respostas nunca migram para outro rolê.

## Sugestões e correções

- Criar uma opção congela nome, endereço e URLs originais.
- O nome original não muda; `Informar nome correto` acrescenta correção estruturada com autoria.
- Corrigir endereço ou URL preserva o valor anterior tachado e marca autor e momento.
- Acrescentar URL mantém as referências existentes ativas.
- Similaridade de nome, rua, número próximo ou URL idêntica gera aviso, nunca bloqueio.
- Opção não é excluída. Qualquer pessoa identificada pode inativá-la ou reativá-la enquanto houver organização.
- Ao definir o rolê, todas as opções fecham e permanecem consultáveis no histórico operacional.

## Declarações

- Qualquer pessoa convidada e identificada pode declarar `Vai ter rolê` ou definir o local.
- Declaração não converte respostas, não presume consenso e não aplica quórum.
- Declarações idênticas são idempotentes.
- Declarações simultâneas de locais diferentes criam conflito visível; a primeira permanece vigente até correção consciente.
- `Corrigir local declarado` mantém o mesmo rolê. `Propor outro local` cria outro rolê.
- Cancelamento pode ocorrer antes ou durante o encontro, é auditado e terminal.

## Tempo

- A data é obrigatória. O nome público é sugerido e editável; `eventId` resolve unicidade.
- `Depois do expediente` aparece sem hora. Internamente, começa com referência de 18h.
- Enquanto o rolê estiver indefinido, a referência interna avança 30 minutos a cada 30 minutos a partir de 16h30, permanecendo duas horas à frente do relógio, sem exibição ou pressão ao grupo.
- A referência interna pode atravessar a meia-noite sem alterar a data social do rolê e para no limite final padrão de 03h.
- Ao definir o local, a referência vigente congela como horário aproximado. Se o rolê permanecer indefinido às 03h, ele encerra sem local definido.
- Quando alguém informa horário, ele aparece como `Por volta das HHh`.
- Horário pode mudar se o horário vigente ainda estiver a pelo menos uma hora e a data permanecer igual. Exatamente uma hora antes ainda é permitido; com menos de uma hora, é bloqueado (`currentTime <= approximateStart - 1h`).
- Depois que o horário chega, ele congela.
- Rolê noturno iniciado após 18h fica consultável até 03h do dia seguinte por padrão.
- Qualquer pessoa convidada e identificada pode estender o limite final enquanto o link estiver ativo, escolhendo diretamente um horário posterior ao limite vigente e não superior a 07h do dia seguinte à data social do rolê.
- Extensões concorrentes são monotônicas: prevalece o maior horário válido, sem redução do limite vigente. A ação preserva autoria e momento.
- Depois do limite final, o link mostra apenas que o rolê terminou; detalhes não ficam acessíveis nem reutilizáveis.

## Compartilhamento

- Qualquer pessoa identificada pode compartilhar o estado vigente.
- O sistema gera mensagem pronta e abre o compartilhamento do aparelho; não publica automaticamente.
- Mensagem externa é fotografia do momento e sempre inclui o link vivo.
- Ao abrir, cancelamento ou substituição aparece antes de endereço, rota ou informações antigas.

## Situações deliberadamente relaxadas

- Não remover participantes; abuso social extremo é tratado cancelando e criando outro rolê.
- Não fundir identidades autenticadas por credenciais distintas.
- Não impedir opções potencialmente duplicadas.
- Não obrigar o Bora Lá a refletir conversas externas que ninguém registrou.
- Não coletar desfecho ou comparecimento.
