# html-to-figma

Plugin do Figma para capturar/salvar HTML de sites (ou trechos de HTML) e levar esse conteúdo para dentro do Figma, facilitando referência visual, documentação e recriação de telas.

## Objetivo
Permitir que você cole uma URL ou um HTML e gere uma representação dentro do Figma, mantendo o fluxo de trabalho de design mais rápido ao importar conteúdos já existentes.

## Principais recursos
- Importar HTML a partir de uma **URL** (site) ou **código HTML**
- Converter estrutura básica (ex.: textos, imagens e blocos) em elementos no Figma
- Criar frames/páginas automaticamente para organizar o conteúdo importado

## Como usar
1. No Figma, vá em **Plugins → Development → Import plugin from manifest...**
2. Selecione o `manifest.json` deste repositório
3. Execute o plugin em **Plugins → Development → html-to-figma**
4. Informe a **URL** do site ou cole o **HTML**
5. Clique em **Importar/Converter** e aguarde a criação dos elementos

## Requisitos
- Figma Desktop (recomendado para desenvolvimento)
- Permissões de rede podem ser necessárias para buscar HTML via URL (dependendo da implementação)

## Desenvolvimento
> Ajuste conforme a estrutura real do projeto (scripts, build, etc.)

1. Clone o repositório:
   - `git clone https://github.com/fabioeducacross/html-to-figma.git`
2. Abra o projeto e instale dependências (se existir):
   - `npm install` / `pnpm install` / `yarn`
3. Rode o build (se existir):
   - `npm run build`
4. Aponte o `manifest.json` no Figma conforme a seção **Como usar**.

## Limitações / Observações
- Nem todo HTML/CSS é convertível 1:1 para nós do Figma.
- Sites com conteúdo dinâmico podem exigir ajustes (ex.: carregamento via JS).
- A fidelidade depende das regras de conversão implementadas no plugin.

## Roadmap (ideias)
- Melhor suporte a CSS (tipografia, espaçamento, cores)
- Importação de assets com cache
- Modo “selecionar elemento”/importar apenas uma seção da página
- Exportar tokens/estilos para Figma (cores e textos)

## Contribuindo
Pull requests são bem-vindos. Abra uma issue descrevendo o problema/ideia antes, se possível.

## Licença
Defina aqui a licença do projeto (ex.: MIT). Se ainda não houver, adicione um arquivo `LICENSE`.
