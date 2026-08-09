# Relatório de Validação — Bora Lá

- **DESIGN.md:** `DESIGN.md`
- **EXPERIENCE.md:** `EXPERIENCE.md`
- **Executado em:** 2026-08-06

## Veredito geral

O par de spines cobre as seis jornadas e preserva explicitamente “organizar sem governar”, mas ainda está **inadequado para handoff**. A composição visual aprovada transforma o agregado em prova social proeminente; a ordem de acesso a `Quem já topou?` pode induzir conformidade; fontes normativas não resolvem; e faltam contratos implementáveis para estados, componentes, privacidade e acessibilidade.

As correções devem preservar a base visual `Assinatura de Brinde`, reduzindo os sinais de placar e tornando a semântica `Topo ou Tudo bem` inseparável do número. A autoria precisa variar entre visão pública e identificada, e o laranja funcional deve ser substituído por um token textual com contraste verificado.

## Vereditos por categoria

- Cobertura de fluxos — **broken**
- Completude de tokens — **adequate**
- Cobertura de componentes — **thin**
- Cobertura de estados — **thin**
- Cobertura de referências visuais — **adequate**
- Bloat e sobre-especificação — **adequate**
- Disciplina de herança — **broken**
- Adequação de forma — **strong**

## Achados por severidade

### Críticos (2)

1. **Organizar sem governar — agregado como prova social principal.** `7 pessoas` combina escala, cor, invólucro e sombra, enquanto a ressalva fica pequena. **Correção:** apresentar `7 pessoas marcaram Topo ou Tudo bem` como unidade, reduzir ao menos um sinal de saliência e testar interpretação de quórum/maioria.
2. **Organizar sem governar — conformidade pela ordem.** `Quem já topou?` aparece antes de `Dar o seu pitaco`. **Correção:** não fixar a lista nominal antes da resposta; adotar ordem neutra/contextual e testar influência percebida.

### Altos (15)

1. **Rubrica — rastreabilidade:** `CAP-1–11`, `FR-1–22` e `NFR-1–10` não se ligam explicitamente a fluxos/passos. Criar matriz compacta requisito → jornada → passo/estado.
2. **Rubrica/Acessibilidade — contraste:** `#F37735` mede 2,80:1 sobre branco e 2,53:1 sobre papel. Criar token laranja textual ≥4,5:1 e matriz de contrastes.
3. **Rubrica — componentes:** campos, resumo de validação, compartilhar/copiar, rota, lista de `Topo` e revisão consciente não têm contratos bilaterais.
4. **Rubrica — estados:** superfícies da IA não possuem matriz explícita de carregamento, vazio, erro, foco e indisponibilidade aplicáveis.
5. **Rubrica — fontes quebradas:** corrigir caminhos da SPEC/companions e Constituição no frontmatter.
6. **Rubrica — FR-13:** remover ambiguidade entre ação direta e confirmação adicional; usar consequência inline no mesmo gesto.
7. **Rubrica — bloqueadores:** autenticação, tipografia, responsividade, contraste e FR-13 não podem permanecer como decisões abertas de UX.
8. **Privacidade — cancelamento público:** antes da identificação, não mostrar Nick/autoria; identificado e antes do Limite pode mostrar autoria; expirado mostra apenas término.
9. **Constituição — ordem das Opções:** fixar algoritmo estável e não social, sem reordenar por Respostas, autoria, correção ou reativação.
10. **Constituição — igualdade de poder:** o painel de Declaração deve dizer que qualquer Pessoa Convidada identificada registra algo combinado fora do produto.
11. **Constituição — linguagem concorrente:** trocar “primeira Declaração válida” por “primeira Declaração persistida”, explicitando que não confere legitimidade.
12. **Constituição — confirmação:** não ritualizar homologação do sistema; definir Local deve ter consequência inline, sem segunda aprovação.
13. **Constituição — compartilhamento:** definir templates factuais por estado, verbos proibidos e fotografia temporal; nunca usar agregado como justificativa.
14. **Constituição — cancelamento:** ação contextual, sem aparência administrativa, com consequência terminal e autoria apenas quando autorizada.
15. **Constituição — Pessoa Criadora:** proibir qualquer badge, posição ou destaque especial em ações coletivas.

### Médios (19)

1. Comprometer fonte final do MVP e escala com zoom/texto ampliado.
2. Corrigir `brand-signature`: “associa visualmente”, não “linka”, salvo se for acionável.
3. Separar offline, erro de servidor, sessão expirada e permissão negada.
4. Promover o mock aprovado para `mockups/` e manter explorações em `.working/`.
5. Substituir repetição de regras do domínio por referências `FR-*`/`CAP-*`.
6. Mapear explicitamente `Propor outro local` para o rótulo canônico `Criar Outro Rolê`.
7. Exigir reflow a 320 CSS px/400%, text spacing e proibir altura fixa/overflow oculto em produção.
8. Definir foco e anúncios: status polite, alertas, resumo de erros, diálogo e retorno da identificação.
9. Usar semântica nativa para linhas protegidas, Respostas, listas, histórico e estados.
10. Tornar o cadeado decorativo (`aria-hidden`) dentro de um único controle com nome completo.
11. Fixar alvos de toque, foco visível, offset e não ocultação por conteúdo fixo.
12. Revalidar autorização/estado em voltar, `pageshow`, foreground e antes de renderizar dados protegidos; limpar UI/cache em logout/expiração.
13. Rotular divulgação a mapas/share; não enviar Nicks/Respostas; proteger janela de origem.
14. Tornar `Topo ou Tudo bem` inseparável de `Quantos tão a fim?` e explicitar escopo.
15. Testar `Dar o seu pitaco`; se mantido, deixar claro que há uma Resposta independente por Opção e que não é voto.
16. Testar a posição do Interesse Geral para evitar âncora de legitimidade.
17. Dar às quatro Respostas tratamento selecionado estruturalmente equivalente, sem verde/check/celebração exclusivos para `Topo`.
18. Explicar Opções inativas como estado operacional com autoria, momento e reativação, não como rejeição coletiva.
19. Em Correção × Outro Rolê, perguntar se o registro estava errado quando feito ou se o grupo mudou depois; o produto não classifica o caso.

### Baixos (6)

1. Registrar as direções visuais rejeitadas como exploração não normativa.
2. Aumentar textos informativos essenciais de 10–11 px para pelo menos 12–14 px.
3. Definir mensagens de autenticação resistentes a enumeração e troca explícita de identidade.
4. Proibir flashes, autoplay, celebração e pulsação de contagens.
5. Em Substituído, usar formulação factual e não atribuir intenção ao grupo.
6. Limitar histórico a eventos factuais, sem estatísticas, badges ou reputação por autor.

## Arquivos dos revisores

- `review-rubric.md`
- `review-accessibility-privacy.md`
- `review-organizar-sem-governar.md`
