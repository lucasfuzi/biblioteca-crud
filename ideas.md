# Direção visual — Biblioteca CRUD

## Abordagens consideradas

### Abordagem 1 — Arquivo Editorial
**Introdução:** Uma biblioteca digital com atmosfera de arquivo cultural: papel marfim, tinta azul-marinho, coral queimado e tipografia editorial. A interface combina precisão administrativa com o calor de uma estante bem cuidada.
**Probabilidade:** 0.07

### Abordagem 2 — Atlântico Contemporâneo
**Introdução:** Um painel luminoso em azul mineral, areia e verde sálvia, com blocos arejados e uma linguagem de catálogo de museu. O resultado seria sereno, organizado e convidativo.
**Probabilidade:** 0.03

### Abordagem 3 — Oficina Noturna
**Introdução:** Um sistema de acervo mais dramático, com fundo grafite, laranja cobre e detalhes luminosos, evocando uma mesa de restauração de livros à noite. Teria uma presença mais técnica e intensa.
**Probabilidade:** 0.09

## Abordagem escolhida — Arquivo Editorial

### Design Movement
Editorial modernism com referências de bibliotecas de pesquisa, fichários de arquivo e design de informação suíço, reinterpretados em uma interface digital responsiva.

### Core Principles
1. **Conteúdo como protagonista:** os registros de livros e autores terão máxima legibilidade, com hierarquia tipográfica clara e densidade controlada.
2. **Precisão com calor:** elementos administrativos serão objetivos, mas a paleta e as texturas lembrarão papel, tinta e capas de livros.
3. **Assimetria funcional:** a navegação fixa e o painel de boas-vindas formarão uma composição lateral, evitando o dashboard centralizado genérico.
4. **Movimento com intenção:** transições curtas e suaves sinalizarão mudança de estado, sucesso e foco sem distrair da tarefa.

### Color Philosophy
A base marfim reduz o cansaço visual e cria a sensação de página impressa. O azul-marinho funciona como tinta estrutural — confiável e profundo — enquanto o coral queimado é reservado a ações de destaque, como cadastrar, editar ou confirmar. O verde musgo sinaliza saúde do acervo e estados positivos. A cor proprietária da marca será **Coral de Lombada #D96C4B**, inspirada na fita de uma lombada antiga.

### Layout Paradigm
Shell com barra lateral persistente e conteúdo em duas camadas: um cabeçalho editorial com título, contexto e ação primária; abaixo, uma área de trabalho com resumo do acervo, busca e tabela. No mobile, a barra lateral se transforma em navegação superior compacta e os registros viram cartões empilhados.

### Signature Elements
- Pequenas etiquetas de categoria com linguagem de ficha catalográfica.
- Linhas finas, marcadores circulares e numeração discreta para sugerir classificação de arquivo.
- Um painel de destaque com recorte assimétrico e imagem de livros como ponto de respiro visual.

### Interaction Philosophy
Cada interação deve parecer uma ação em um arquivo bem organizado: foco visível, confirmação clara, filtros instantâneos e edição em modal. O hover revela contexto; o clique responde com escala sutil e um toast curto. A interface sempre oferece uma saída segura para cancelar ou fechar.

### Animation
Entradas de página com fade e deslocamento vertical de 12px em até 280ms; linhas e cartões aparecem em cascata de 40ms. Botões usam compressão de 0.97 no clique. Modais entram de 0.96 para 1 com opacidade e easing `cubic-bezier(0.23, 1, 0.32, 1)`. Nunca animar largura, altura ou layout. Respeitar `prefers-reduced-motion`.

### Typography System
- **Display:** `DM Serif Display`, usada em títulos de página e números de destaque, com contraste editorial.
- **Interface:** `Manrope`, usada em navegação, tabelas, formulários e microcopy por sua legibilidade geométrica.
- Hierarquia: títulos de 48/52px no desktop, 34/38px no mobile; subtítulos de 14px em caixa alta com tracking de 0.14em; corpo de 14–16px; metadados de 11–12px.

### Brand Essence
Um arquivo digital para bibliotecas pequenas e médias que precisam cuidar do acervo com clareza, ritmo e personalidade — diferente por unir gestão prática à sensibilidade editorial.

**Personalidade:** catalográfica, acolhedora, precisa.

### Brand Voice
Headlines e CTAs soam como instruções cuidadosas de um bibliotecário experiente: diretas, humanas e sem jargão técnico desnecessário.

- Exemplo de headline: **"Seu acervo, em ordem de leitura."**
- Exemplo de CTA: **"Adicionar à estante"**

### Wordmark & Logo
A marca será representada por um símbolo sem texto: duas lombadas verticais formando uma janela/portal, com um pequeno marcador coral no centro. O símbolo terá geometria robusta, leitura imediata em 24px e aplicação em fundo marfim e azul-marinho.

### Signature Brand Color
**Coral de Lombada — `#D96C4B`**. Usar em ações primárias, marcadores de registro selecionado, pequenos acentos e o favicon; nunca como preenchimento dominante da tela.

## Style Decisions
- Não usar gradientes roxos, layout centralizado genérico, fonte Inter ou excesso de cantos arredondados.
- Usar imagens geradas apenas em pontos de respiro e destaque: painel de boas-vindas, faixa de contexto e símbolo da marca.
- Manter contraste AA, estados de foco visíveis e suporte completo a teclado.
- No desktop, a navegação lateral fixa deve permanecer como a espinha dorsal do workspace.
- A marca gráfica de duas lombadas com marcador coral deve aparecer no cabeçalho lateral e no rodapé.
- Os módulos de dados devem usar referências discretas, linhas finas, metadados catalográficos e controles de busca para equilibrar curadoria e operação.
