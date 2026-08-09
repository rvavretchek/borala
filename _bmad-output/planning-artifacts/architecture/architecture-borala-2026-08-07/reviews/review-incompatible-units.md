# Terceiro passe adversarial — unidades incompatíveis

**Escopo:** versões atuais de `ARCHITECTURE-SPINE.md`, `SOLUTION-DESIGN.md` e `UML.md`  
**Lente:** regressão de INC-01..12, NEW-01..03 e busca por novas divergências implementáveis  
**Veredito final:** **PASS**

Os três achados do rerun anterior foram corrigidos de forma convergente entre spine, Solution Design e UML. Os protocolos sobreviveram aos cenários adversariais de concorrência, rotação, falha parcial, reboot e derivação independente por agentes. Não permanece achado crítico, alto ou médio que permita construir unidades incompatíveis.

## Resultado consolidado

| Grupo | Resultado |
|---|---|
| INC-01..12 | **12 resolvidos** |
| NEW-01 — ponte challenge/Identity durante rekey | **Resolvido** |
| NEW-02 — `GENERAL_INTERESTS` sem `outing_id` no ER | **Resolvido** |
| NEW-03 — storage temporário do backup em runtime read-only | **Resolvido** |
| Novas incompatibilidades críticas/altas/médias | **Nenhuma encontrada** |

## Revalidação das correções finais

### NEW-01 — Resolvido — `IdentityEmailAlias` preserva continuidade entre challenges e versões

**Evidência atual**

- AD-8 torna `IdentityEmailAlias` o lookup versionado e permite que ele exista antes da `Identity`.
- `SOLUTION-DESIGN.md:187-197` fixa matriz de derivação, FK estável `login_challenges.email_alias_id`, pesquisa multi-versão, criação/UPSERT do alias corrente, vínculo atômico no primeiro consumo, duplicate-key/retry e critérios de remoção/aposentadoria.
- `UML.md:92-97`, `:167-168`, `:343-345` e `:365-388` representam a mesma unidade e cardinalidade.

**Tentativas de quebra executadas conceitualmente**

1. **Dois challenges A/B antes da rotação:** ambos apontam para o mesmo alias; A cria/vincula Identity, B bloqueia o alias e reutiliza o vínculo.
2. **A consumido antes de B após promoção de chave:** o alias antigo permanece como ponte; um alias corrente pode ser criado para a mesma Identity sem invalidar B.
3. **Identity ainda inexistente na rotação:** o alias antigo nullable continua sendo o claim; seu primeiro consumo cria uma única Identity. A chave antiga não pode ser aposentada enquanto houver dependência.
4. **Criação concorrente:** unique `(secret_version, email_lookup)`, lock do alias e retry por duplicate key impedem duas claims na mesma versão; rollout em duas fases impede processos discordarem sobre a chave corrente.
5. **Purge/expiração:** aliases referenciados por challenges não são removidos; alias antigo ligado só sai quando não há challenge e existe alias corrente; Identity órfã é removida depois dos aliases.

**Conclusão:** o protocolo não precisa recuperar o e-mail nem transformar HMAC v1 em v2. A ponte estável é o ID do alias; continuidade e privacidade convergem.

### NEW-02 — Resolvido — Interesse Geral usa escopo composto no ER

**Evidência atual**

- `UML.md:348-349` liga `GENERAL_INTERESTS` a Outing e Participant.
- `UML.md:414-419` contém `outing_id PK,FK` e `participant_id PK,FK`.
- `SOLUTION-DESIGN.md:457` e `:470` mantêm uma disposição por Participant/Outing e FKs compostas para entidades pertencentes ao agregado.
- AD-6 continua exigindo FKs compostas contra referências entre Rolês.

**Tentativas de quebra executadas conceitualmente**

- Interesse de Participant de outro Outing é rejeitado pela FK composta.
- Duas linhas para o mesmo Participant no mesmo Outing são rejeitadas pela chave composta.
- CAS de ausência/versão permanece compatível com o shape relacional e com o purge por Outing.

**Conclusão:** migrations, tipos Kysely, repository e UML derivam o mesmo schema.

### NEW-03 — Resolvido — Backup mantém root filesystem read-only e persiste somente ciphertext

**Evidência atual**

- `SOLUTION-DESIGN.md:620` fixa `mysqldump --single-transaction | zstd | age` até arquivo ciphertext.
- `SOLUTION-DESIGN.md:627` fixa o único bind mount gravável `/backup`, origem, modo 0700, UID, flags `noexec,nodev,nosuid`, quota de 18 GB, extensão `.part`, `pipefail`, limpeza por `ExecStopPost` e limpeza no boot.
- `SOLUTION-DESIGN.md:629` fixa restore por stream inverso, testes de disco cheio/interrupção/reboot/chave indisponível e ausência de SQL plaintext em disco.
- AD-17 preserva container rootless/read-only; runtime e DR não exigem exceções implícitas.

**Tentativas de quebra executadas conceitualmente**

1. **Falha de `mysqldump`, `zstd` ou `age`:** `pipefail` impede promoção/upload e remove `.part`.
2. **Disco cheio:** quota limita impacto; falha do pipeline deixa apenas ciphertext parcial, eliminado pelo stop hook/boot.
3. **Reboot/kill:** a extensão `.part` nunca é tratada como backup válido e é removida antes do próximo job.
4. **Upload ambíguo:** checksum/upload confirmado precedem remoção do ciphertext local; lifecycle e quota do bucket têm política explícita.
5. **Restore:** descriptografia e descompressão ocorrem por stream, sem plaintext persistente.

**Conclusão:** agentes de runtime, backup e segurança recebem uma única estratégia compatível.

## Regressão das fronteiras anteriores

- Estados persistidos continuam separados de `InProgress`/`Ended` derivados; purge usa `final_limit_at`.
- `FinalLimit`, Data social, IANA timezone, Temporal, DST e UTC permanecem coerentes.
- `GeneralInterest` não se mistura com `VenueResponse` em domínio, DTO, contagem ou schema.
- DTOs discriminados por audiência/estado excluem plano antigo em cancelado, substituído e encerrado.
- Guards por rota fecham sessão, pre-auth CSRF, Origin/Fetch Metadata, rate limit e GET sem efeito.
- Locks/CAS têm ordem e matriz por comando; versão zero trata ausência sem last-write-wins.
- Receipts vinculam actor, escopo, tipo, payload+precondições e não revelam colisão alheia.
- FKs compostas impedem Participant, Option, Local, autoria ou replacement entre Rolês.
- Purge com `RESTRICT` tem claim, lote, lock, ordem, rollback, retry e pós-condição.
- Podman/Quadlet/Caddy, TLS MySQL, VCN, deploy e rollback estão alinhados entre os três artefatos.
- RPO/RTO são objetivos best effort coerentes com os riscos aceitos do Always Free.
- Diagramas Mermaid têm fences balanceados e não contradizem os contratos textuais revisados.

## Observações não bloqueantes para runbooks

- Fixar no comando real de dump os flags de objetos auxiliares exigidos pelo schema efetivo, caso migrations não sejam a única fonte de routines/events/triggers.
- Documentar rotação e custódia da identidade `age`, incluindo teste de recuperação da chave, sem registrar material secreto.
- Fazer o teste A/B de aliases validar também promoção de chave durante challenges `DELIVERY_UNKNOWN` ainda válidos.

Essas observações refinam operação e testes, mas não deixam duas unidades escolherem contratos incompatíveis no nível arquitetural atual.

## Veredito

**PASS.** Os artefatos agora formam um contrato convergente para implementação independente nas fronteiras revisadas.
