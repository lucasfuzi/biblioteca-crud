# Correção do GitHub Pages

- [x] Verificar a estrutura atual do repositório e o processo de build.
- [x] Confirmar a causa do 404 na rota `/biblioteca-crud/`: o GitHub Pages publica a raiz do branch `main`, enquanto o build Vite gera o site em `dist/public` e não existe `index.html` na raiz.
- [x] Ajustar o `base` do Vite e a saída de build para subcaminho do GitHub Pages.
- [x] Adicionar workflow do GitHub Actions para publicar `dist/public` no Pages.
- [x] Validar o build e a existência de `index.html` no artefato publicado.
- [ ] Salvar checkpoint com a correção final.
