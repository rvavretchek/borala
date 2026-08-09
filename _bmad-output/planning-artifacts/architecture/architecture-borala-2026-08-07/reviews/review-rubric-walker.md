---
name: Reviewer gate — rubric walker
type: architecture-review
reviewer: rubric-walker
status: final
created: '2026-08-07'
updated: '2026-08-07'
verdict: PASS
reviewed:
  - ../ARCHITECTURE-SPINE.md
  - ../SOLUTION-DESIGN.md
  - ../UML.md
---

# Reviewer gate — rubric walker — veredito final

## Veredito

**PASS.** O terceiro passe não encontrou divergência crítica, alta ou média capaz de separar implementações por agentes. Os quatro achados residuais do passe anterior foram resolvidos e os três artefatos convergem em autoridade, invariantes, capacidades, estado, persistência, segurança e operação. O linter determinístico passou com zero achados.

## Resumo final

- Críticos: 0.
- Altos: 0.
- Médios: 0.
- Baixos: 1 observação editorial não bloqueante.

## Validação dos quatro achados residuais

### 1. Rekey/challenges — resolvido

`IdentityEmailAlias` é agora a ponte estável entre o HMAC versionado, a Identity nullable e todos os challenges emitidos com aquele alias. Challenges antigos continuam apontando para o alias antigo mesmo depois que um alias corrente é criado; o primeiro consumo liga atomicamente uma claim órfã à Identity e consumos concorrentes reutilizam o mesmo vínculo. Retirada de chave depende de zero aliases/challenges, e purge/testes cobrem pré-rotação, consumo posterior e concorrência.

Evidência convergente:

- AD-8 define alias versionado e vínculo atômico;
- Solution Design 6.1 fixa lookup, emissão, consumo, rotação e eliminação;
- schema lógico contém `identity_email_aliases` e `login_challenges.email_alias_id`;
- UML de domínio e ER representam a mesma ponte.

### 2. Escopo de `commandId`/audit — resolvido

AD-7 e `Consistency Conventions` limitam receipt, autoria e audit aos comandos de `outings`. A matriz HTTP exclui autenticação/sessão, e Observabilidade diz explicitamente que auth usa IDs técnicos próprios e nunca `AuditEvent` de domínio. Não há instrução remanescente para criar receipt/audit de challenge ou logout.

### 3. `GENERAL_INTERESTS` composto — resolvido

O UML inclui `outing_id` + `participant_id` como chave/FK, e as relações com Outing e Participant espelham a regra canônica de FK composta do Solution Design. A defesa contra referência cruzada entre Rolês é única nos companions.

### 4. Scratch do backup — resolvido

O maintenance read-only recebe somente `/backup` como bind gravável dedicado, com origem, modo, UID, flags e quota definidos. O pipeline grava apenas ciphertext `.sql.zst.age.part`, elimina parciais em falha/reboot e remove o arquivo após checksum/upload. Restore também faz stream sem SQL plaintext em disco. O contrato agora é executável por Quadlet sem abrir escrita geral no container.

## Rechecagem completa da good-spine checklist

| Critério | Resultado | Evidência |
|---|---|---|
| Autoridade | Passa | Constituição/SPEC/PRD prevalecem; decisões diretas estão adjudicadas; fontes históricas não vinculam. |
| `Binds`/`Prevents`/`Rule` | Passa | Todos os ADs são completos, únicos e materialmente enforceable. |
| Divergências do nível abaixo | Passa | Módulos, comandos, locks/CAS, DTOs, identidade, tempo, schema e runtime possuem eixo único. |
| Cobertura da SPEC | Passa | CAP-1 a CAP-11 estão mapeadas; gates cobrem FR-1 a FR-22 e NFR-1 a NFR-10. |
| Consistência entre companions | Passa | Spine, Solution Design e UML usam os mesmos estados, aliases, FKs, políticas e implantação. |
| Stack atual/pinada | Passa | Dependências de cold-start têm versão; OCI/Podman/MySQL efetivos são registrados e testados por compatibilidade. |
| Segurança e privacidade | Passa | Audiência/tempo, HMAC/aliases, sessão, CSRF, idempotência, TLS e retenção são explícitos. |
| Operação/ambientes | Passa | OCI Always Free, rootless Podman/Quadlet, Caddy host, blue-green, backup/restore e riscos best effort estão fechados. |
| Deferred | Passa | Cada item tem gatilho e não permite bifurcação silenciosa no MVP. |
| Leanness | Passa | O spine retém decisões de convergência; detalhes executáveis ficam nos companions. |

## Observação baixa não bloqueante

No ER do UML, `identity_email_aliases.email_lookup` aparece marcado como `UK`, enquanto o texto canônico define a unicidade composta `(email_lookup_secret_version, email_lookup)`; o campo `identity_id` também é nullable no texto, mas a notação Mermaid não evidencia nullability. A migrations SQL e o Solution Design já são inequívocos. Uma nota curta sob o diagrama eliminaria essa pequena ambiguidade visual, sem impedir o handoff.

## Conclusão de gate

O Architecture Spine está apto a passar de `draft` para `final` após a rotina de finalização do workflow. Não há decisão humana pendente neste reviewer gate.
