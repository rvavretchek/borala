---
name: Revisão de tecnologia atual — arquitetura do Bora Lá
type: architecture-review
reviewer: current-technology
status: complete
created: '2026-08-07'
updated: '2026-08-07'
rerun: 1
scope:
  - ../ARCHITECTURE-SPINE.md
  - ../SOLUTION-DESIGN.md
verdict: PASS
---

# Revisão de tecnologia atual

## Veredito

**PASS.** O rerun confirmou o fechamento de TECH-01 a TECH-08. Os artefatos agora tratam a versão major do MySQL como controlada pela OCI, testam a major efetiva de produção, exigem TLS fail-closed, usam `mysql2 >= 3.23.2`, completam o toolchain React Router/Vite/Node, encapsulam o Temporal beta e tornam explícitos quota, best effort e desativação do HeatWave analítico.

Permanece somente uma ação normal de bootstrap: materializar no primeiro `package-lock.json` os pins já determinados e as dependências auxiliares (`@testing-library/dom`, `axe-core` e integração Cypress escolhida). Isso não é incompatibilidade arquitetural nem bloqueia o gate.

## Resumo de severidade

| Severidade | Quantidade |
|---|---:|
| Alta aberta | 0 |
| Média aberta | 0 |
| Baixa aberta | 0 |
| Ação de bootstrap | 1 |

## Resultado do rerun

| Achado | Estado | Evidência de fechamento nos artefatos atuais |
|---|---|---|
| TECH-01 | **Fechado** | Spine AD-5/Stack e Solution 11.4 tornam a versão efetiva controlada pela OCI, preservam 8.4 apenas como baseline, capturam `SELECT VERSION()` e exigem lane da major de produção mais ensaio de upgrade/restore antes de major nova. |
| TECH-02 | **Fechado** | Spine AD-18 e Solution 11.4/13.1 exigem `REQUIRE SSL`, CA, `rejectUnauthorized: true`, ausência de fallback, hostname, `VERIFY_CA`/`VERIFY_IDENTITY` e readiness por `Ssl_cipher`. |
| TECH-03 | **Fechado** | Stack fixa `mysql2 3.23.2 ou patch superior aprovado` e Solution fixa `compress: false`. |
| TECH-04 | **Fechado** | Stack inclui React DOM 19.2.7, React Router e `@react-router/dev`/`@react-router/node` 8.3.0, Vite 8.0.16 e servidor Node customizado; RSC experimental está excluído. |
| TECH-05 | **Fechado** | Stack aceita explicitamente o beta; Solution 10 usa adapter único, pin 1.0.2, sem alternância no release, `disambiguation` explícita e testes diferenciais antes de Node 26+. |
| TECH-06 | **Fechado** | Spine AD-22 e Solution 18 tornam RPO/RTO best effort sem SLA, limitam o bucket a 20 GB, medem quota/espaço/multipart, definem alarme a 60%, política sem cobrança silenciosa e ensaio trimestral do caminho cifrado. |
| TECH-07 | **Fechado** | Spine AD-5 e Solution 17 exigem HeatWave cluster/analytics desabilitado no provisioning; Lakehouse e demais analytics ficam fora do contrato. |
| TECH-08 | **Fechado no contrato** | Pins foram tornados exatos (Vitest 4.1.7, RTL 16.3.2, Cypress 15.19.0) e o lock é autoridade obrigatória; `@testing-library/dom` está explicitamente exigido. `axe-core`/adapter Cypress serão materializados no bootstrap. |

## Achados

### TECH-01 — Alta — MySQL 8.4 não é um pin sustentável no Always Free

**Estado no rerun: FECHADO.** O texto abaixo preserva o achado original e sua justificativa; a matriz de rerun registra a correção aceita.

**Evidência no artefato:** Spine Stack fixa `MySQL 8.4 LTS; 8.4.10 seed`; Solution exige integração contra “MySQL 8.4 real” e o deploy apenas “verifica versão”.

**Evidência primária:** a documentação do Always Free afirma que o DB System é criado com a **latest version** e atualizado para a latest version em cada manutenção. A documentação de manutenção é ainda mais explícita: no Always Free, a manutenção “will always upgrade the database version to the highest version available”. Em 16/06/2026, a OCI passou a suportar simultaneamente MySQL 9.7.1 e 8.4.10. A própria Oracle documenta 8.4 → 9.7 como major upgrade, sem downgrade.

- [OCI — Features of MySQL HeatWave Service](https://docs.oracle.com/en-us/iaas/mysql-database/doc/features-mysql-heatwave-service.html)
- [OCI — Overview of Maintenance](https://docs.oracle.com/en-us/iaas/mysql-database/doc/overview-maintenance.html)
- [OCI — DB System Upgrade](https://docs.oracle.com/en-us/iaas/mysql-database/doc/mysql-server-upgrades.html)
- [OCI — Major Version Upgrade](https://docs.oracle.com/en-us/iaas/mysql-database/doc/major-version-upgrade.html)
- [OCI — release notes: 9.7.1 e 8.4.10](https://docs.oracle.com/en-us/iaas/releasenotes/services/mysql-database/)

**Risco:** um cold-start pode receber 9.7 LTS, e um DB System 8.4 existente pode ser elevado pelo provedor. CI em 8.4 deixa de representar produção; reserved words, autenticação, migrations e restore podem divergir. “Trocar o adapter se 8.4 deixar de existir” não resolve uma atualização automática do mesmo serviço.

**Correção:** substituir o pin de produção por “versão entregue pelo `MySQL.Free`, atualmente controlada pela OCI, com 8.4 como baseline mínimo testado”. O provisioning deve capturar a versão efetiva e o CI deve executar migrations, repositories, concorrência, dump/restore e smoke contra a mesma família major de produção. Uma mudança de major deve bloquear deploy da aplicação até passar por ensaio de upgrade/restore. Se 8.4 exato for uma invariante irrenunciável, o Always Free gerenciado não satisfaz a arquitetura.

### TECH-02 — Alta — TLS do MySQL não é obrigatório nem validado

**Estado no rerun: FECHADO.**

**Evidência no artefato:** Spine AD-18 limita 3306 à NSG; Solution 13.1 repete a restrição de rede, mas não exige TLS no DB user, não configura CA no `mysql2` e não verifica cifra/peer no readiness. Caddy TLS protege HTTP, não a conexão aplicação–banco.

**Evidência primária:** a OCI oferece TLS para conexões MySQL e permite torná-lo obrigatório por usuário. O manual MySQL alerta que o default pode cair para conexão sem criptografia e recomenda `VERIFY_CA`/`VERIFY_IDENTITY` em vez de preferência oportunista. O `mysql2` aceita configuração SSL com CA no pool.

- [OCI — Data Security / encryption in transit](https://docs.oracle.com/en-us/iaas/mysql-database/doc/features-mysql-heatwave-service.html)
- [MySQL 8.4 — encrypted connections](https://dev.mysql.com/doc/refman/8.4/en/using-encrypted-connections.html)
- [mysql2 — pool com SSL](https://sidorares.github.io/node-mysql2/docs/examples/connections/create-pool)

**Risco:** configuração acidental do client ou do usuário pode trafegar credenciais e dados em claro dentro da VCN; NSG reduz exposição, mas não autentica o servidor nem substitui criptografia em trânsito.

**Correção:** criar o usuário da aplicação com `REQUIRE SSL`; configurar o pool `mysql2` com CA confiável e validação fail-closed, preferindo identidade do host quando o certificado/endereço permitirem; impedir fallback; fazer readiness falhar se `Ssl_cipher` estiver vazio; usar o mesmo contrato em maintenance, migration, dump e restore.

### TECH-03 — Média — `mysql2@3.22.4` antecede correção de segurança

**Estado no rerun: FECHADO.**

**Evidência no artefato:** Spine fixa `mysql2 3.22.4`.

**Evidência primária:** o changelog oficial registra `3.23.1` como correção de segurança para descompressão ilimitada de pacotes comprimidos enviados pelo servidor, e `3.23.2` como release posterior disponível em 27/07/2026.

- [mysql2 — changelog oficial](https://github.com/sidorares/node-mysql2/blob/master/Changelog.md)

**Risco:** consumo não limitado de memória se compressão de protocolo for habilitada ou introduzida. Mesmo com servidor privado confiável, o pin conhecido será reprovado por scanners e reduz margem de defesa após comprometimento do DB endpoint.

**Correção:** iniciar em `mysql2 >= 3.23.2`, manter `compress: false` salvo justificativa e testar pool/TLS/Kysely. O `package-lock.json` deve preservar o patch aprovado.

### TECH-04 — Média — Framework Mode depende de Vite e adapter Node não presentes no stack

**Estado no rerun: FECHADO.**

**Evidência no artefato:** React Router Framework Mode está fixado, mas Vite, `react-dom`, `@react-router/dev` e o adapter de produção (`@react-router/node`, `@react-router/serve` ou servidor customizado) não aparecem na Stack.

**Evidência primária:** Framework Mode é implementado pelo plugin Vite. React Router 8 exige Node 22.22+, React/React DOM 19.2.7+ e Vite 7+. O projeto está em Node 24.18 e React 19.2.7, portanto atende aos mínimos; Vite 8 é suportado por React Router e está estável.

- [React Router 8 — baseline support](https://reactrouter.com/home/changelog)
- [React Router — Framework Mode](https://reactrouter.com/start/modes)
- [React Router — deploy Node/Docker](https://reactrouter.com/start/framework/deploying)
- [Vite 8](https://vite.dev/blog/announcing-vite8)

**Risco:** agentes escolhem versões e servidor diferentes; build, SSR, health endpoints e graceful shutdown podem divergir.

**Correção:** adicionar `react-dom 19.2.7`, `vite 8.0.x`, `@react-router/dev 8.3.0` e declarar o adapter Node escolhido. Se usar Vite 8, não habilitar o plugin RSC instável; o MVP precisa apenas do Framework Mode SSR estável.

### TECH-05 — Média — `temporal-polyfill` é beta em uma regra central do domínio

**Estado no rerun: FECHADO COM RISCO ACEITO E CONTROLES.**

**Evidência no artefato:** `temporal-polyfill 1.0.2` sustenta todas as decisões de Data, Horário Aproximado e Limite Final em Node 24.

**Evidência primária:** Temporal alcançou Stage 4, mas a implementação nativa chegou ao Node somente no 26. O catálogo do TC39 ainda classifica `temporal-polyfill` como beta; o pacote 1.0.2 existe e se declara spec-compliant.

- [TC39 Temporal — status e implementações](https://github.com/tc39/proposal-temporal)
- [temporal-polyfill 1.0.2](https://www.npmjs.com/package/temporal-polyfill)

**Risco:** erro ou mudança de implementação afeta diretamente janelas terminais e retenção. Migrar automaticamente para Temporal nativo também pode introduzir diferença de comportamento entre browser e servidor.

**Correção:** manter a API atrás dos value objects já previstos, importar explicitamente uma única implementação em server e testes, fixar 1.0.2 no lock e executar testes diferenciais contra Node 26 Temporal antes de remover o polyfill. Não alternar silenciosamente entre implementações durante a vida de um release.

### TECH-06 — Média — DR pode romper o custo zero e o RTO não é garantível

**Estado no rerun: FECHADO COM LIMITAÇÃO OPERACIONAL EXPLÍCITA.**

**Evidência no artefato:** sete dumps diários completos ficam no Object Storage; RTO alvo é 4h; restore cria DB System limpo.

**Evidência primária:** Object Storage Always Free totaliza 20 GB. O Always Free MySQL não possui SLA ou Oracle Support, limita backup automático a um dia, desabilita PITR e backup manual e está sujeito a `OutOfHostCapacity`. MySQL Shell suporta dump lógico em Object Storage; lifecycle pode eliminar objetos, mas roda de forma assíncrona/best-effort.

- [OCI — Always Free Object Storage](https://docs.oracle.com/en-us/iaas/Content/FreeTier/freetier_topic-Always_Free_Resources.htm)
- [OCI — Always Free MySQL restrictions](https://docs.oracle.com/en-us/iaas/mysql-database/doc/features-mysql-heatwave-service.html)
- [OCI — creating an Always Free DB System](https://docs.oracle.com/en-us/iaas/mysql-database/doc/creating-always-free-db-system.html)
- [MySQL Shell — dump utilities](https://dev.mysql.com/doc/mysql-shell/8.4/en/mysql-shell-utilities-dump-instance-schema.html)
- [OCI — lifecycle behavior](https://docs.oracle.com/en-us/iaas/Content/Object/Tasks/usinglifecyclepolicies.htm)

**Risco:** sete dumps comprimidos podem ultrapassar 20 GB antes de o banco chegar ao limite de 50 GB; restore pode não conseguir nova capacidade dentro de quatro horas. Cifrar “antes do Object Storage” exige dump local/streaming e espaço temporário que o documento não dimensiona.

**Correção:** declarar RTO 4h como objetivo sem garantia; medir e alertar bytes totais do bucket e espaço temporário; abortar com alarme antes de custo; excluir versões anteriores e multipart uploads; ensaiar o caminho exato `dump local/stream → compressão → cifra autenticada → upload → loadDump`. Definir o que fazer se sete gerações não couberem nos 20 GB gratuitos.

### TECH-07 — Média — HeatWave analítico vem habilitado por padrão no template Always Free

**Estado no rerun: FECHADO.**

**Evidência no artefato:** AD-5 declara “somente MySQL DB System/InnoDB”; a arquitetura não usa analytics.

**Evidência primária:** na criação Always Free, o cluster `HeatWave.Free` aparece habilitado por padrão e deve ser desmarcado para criar somente o DB System.

- [OCI — Creating an Always Free DB System](https://docs.oracle.com/en-us/iaas/mysql-database/doc/creating-always-free-db-system.html)

**Risco:** provisioning manual/agêntico cria componente não usado, amplia superfície operacional e contradiz o contrato, ainda que o nó também seja gratuito.

**Correção:** tornar `Enable HeatWave cluster = disabled` um assertion do provisioning e do runbook; não habilitar Lakehouse, AutoML, Studio ou endpoints REST.

### TECH-08 — Baixa — Alguns ranges de teste não são reproduzíveis no primeiro bootstrap

**Estado no rerun: FECHADO NO CONTRATO; MATERIALIZAÇÃO NO PRIMEIRO LOCK.**

**Evidência no artefato:** Vitest `4.x` e React Testing Library `16.x` são ranges, e `axe-core`/integração Cypress não têm pacote/versionamento no stack.

**Evidência primária:** Vitest 4 exige Node 20+ e Vite 6+, portanto é compatível. React Testing Library 16 requer `@testing-library/dom` como peer dependency. Cypress 15.19 existe e suporta Node 24.

- [Vitest 4 — requisitos](https://vitest.dev/guide/migration)
- [React Testing Library — instalação e peer dependency](https://github.com/testing-library/react-testing-library)
- [Cypress 15.19 changelog](https://docs.cypress.io/app/references/changelog)
- [Cypress 15 — Node suportado](https://docs.cypress.io/app/references/migration-guide)

**Risco:** pequenas diferenças entre agentes e falha de instalação por peer dependency ausente.

**Correção:** usar seeds exatos no bootstrap (`Vitest 4.1.x`, RTL 16.3.2, `@testing-library/dom`, `axe-core` e adapter Cypress escolhido) e depois delegar patches ao `package-lock.json`/Dependabot.

## Itens verificados sem achado bloqueante

| Item | Resultado | Fonte |
|---|---|---|
| Node.js 24.18.0 | Existe, é LTS e supera o mínimo do React Router 8. | [Node releases](https://nodejs.org/en/about/previous-releases) |
| React 19.2.7 | Existe e é exatamente o baseline do React Router 8. | [React versions](https://react.dev/versions) |
| React Router 8.3.0 | Existe; Framework Mode SSR é estável. | [React Router changelog](https://reactrouter.com/start/start/changelog) |
| TypeScript 6.0 | Existe e é compatível com o stack ESM moderno; defaults mudaram e devem ser explicitados no `tsconfig`. | [TypeScript 6.0](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-6-0.html) |
| MySQL 8.4.10 | Existe e é LTS; o problema é o controle da versão no Always Free, não o release. | [MySQL 8.4 release notes](https://dev.mysql.com/doc/relnotes/mysql/8.4/en/) |
| InnoDB/READ COMMITTED/locking reads/CHECK | Recursos existem no MySQL 8.4; a estratégia é tecnicamente válida. | [MySQL locking reads](https://dev.mysql.com/doc/refman/8.4/en/innodb-locking-reads.html), [CHECK](https://dev.mysql.com/doc/refman/8.4/en/create-table-check-constraints.html) |
| Kysely 0.29.2 | Release existe; `MysqlDialect` + `mysql2` é combinação suportada pelo projeto. | [Kysely](https://github.com/kysely-org/kysely) |
| Caddy 2.11.4 | Release existe; TLS automático e reverse proxy são adequados ao runtime. | [Caddy releases](https://github.com/caddyserver/caddy/releases) |
| Cypress 15.19.0 | Release existe, suporta Node 24 e corrige problemas de memória relevantes a CI. | [Cypress changelog](https://docs.cypress.io/app/references/changelog) |
| Argon2id futuro | `m=19456 KiB`, `t=2`, `p=1`, salt único e pepper fora do DB coincidem com o piso OWASP. | [OWASP Password Storage](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html) |
| Sessão | 256 bits aleatórios, token opaco, hash server-side e cookie `__Host-`, Secure, HttpOnly, SameSite=Lax superam o piso de entropia; Lax é aceito pela OWASP. | [OWASP Session Management](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html) |
| Challenge e CSRF | Token single-use/expirável, resposta neutra, rate limit, GET sem consumo, no-referrer, synchronizer token, Origin e Fetch Metadata formam defesa coerente. | [OWASP Forgot Password](https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html), [OWASP CSRF](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html) |
| OCI VM | O envelope atual de Ampere A1 Always Free é 2 OCPUs/12 GB no total da tenancy, como documentado. | [OCI Free Tier](https://docs.oracle.com/en-us/iaas/Content/FreeTier/freetier.htm) |
| OCI MySQL.Free | 2 ECPUs, 8 GB, 50 GiB, sem HA/PITR/manual backup e com backup de um dia estão descritos corretamente. | [OCI supported shapes](https://docs.oracle.com/en-us/iaas/mysql-database/doc/supported-shapes.html), [Always Free features](https://docs.oracle.com/en-us/iaas/mysql-database/doc/features-mysql-heatwave-service.html) |

## Resultado do gate

As cinco condições do primeiro passe foram atendidas. O gate de tecnologia fica em **PASS**, condicionado apenas ao cumprimento normal do próprio contrato no bootstrap: gerar e revisar o `package-lock.json`, verificar a versão/major efetiva do MySQL.Free e executar as lanes de integração, TLS, dump/restore e smoke antes do primeiro deploy.
