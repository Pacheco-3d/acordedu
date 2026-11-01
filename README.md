# Acorde Studio — HTML, CSS e JavaScript

Site de cifras estático, com identidade visual própria, organizado por álbuns, músicas, artistas e ferramentas. **Não exige Next.js, npm nem compilação.**

## Como abrir

1. Descompacte a pasta.
2. **Abra `acorde-studio-html/index.html` com duplo clique**, usando Chrome, Firefox, Edge ou Opera. A versão corrigida usa JavaScript comum (sem `type="module"`) e não exige servidor para renderizar as páginas. **Não abra dentro do visualizador de ZIP:** primeiro use "Extrair tudo". Mantenha todas as pastas, especialmente `assets`. Alguns navegadores ainda podem limitar o armazenamento local em `file://`; para contornar isso, você pode usar um servidor estático simples:
   ```bash
   python -m http.server 8080
   ```
3. Se optar pelo servidor, acesse `http://localhost:8080`.
4. Publique a pasta completa em qualquer hospedagem estática (Netlify, Cloudflare Pages ou GitHub Pages) para disponibilizar o catálogo demonstrativo.

## Organização

```text
acorde-studio-html/
├── index.html                      Início
├── assets/
│   ├── css/style.css               Identidade visual e responsividade
│   ├── js/app.js                   Interface e navegação
│   ├── js/chords.js                Transposição, ChordPro, detecção harmônica e diagramas
│   ├── js/data.js                  Catálogo e letras demonstrativas autorais
│   ├── js/config.js                Reserva para configuração futura do backend
│   └── img/                        Fotos WebP locais para músicas, álbuns e artistas; ícones SVG
├── login/index.html                 Perfil local de demonstração (sem senha)
├── repertorio/index.html            Favoritos e listas pessoais separados
├── musicas/
│   ├── index.html                  Busca e catálogo
│   └── cifra.html                  Leitor, tom, acordes, rolagem e favoritos
├── artistas/
│   ├── index.html                  Lista de artistas
│   └── perfil.html                 Página de artista
├── gallery/
│   ├── index.html                  Galeria
│   ├── albuns/index.html           Álbuns e faixas
│   └── musicas/index.html          Músicas e referências
├── enviar/index.html              Formulário para enviar cifra
├── admin/index.html               Moderação local e exportação JSON
├── ferramentas/index.html         Metrônomo, nota de referência, detector de tom
├── dados/catalogo-referencia.csv  Metadados de títulos e artistas de fonte pública
└── docs/                          Instruções
```

## Como cadastrar cifras

Use **Enviar cifra**. Digite os acordes entre colchetes antes da sílaba: `[C]Um novo [G]dia [Am]começou [F]agora`. O conteúdo entra como pendente; acesse **Painel → Aprovar** para publicá-lo no navegador atual. É possível exportar um JSON das contribuições. Os álbuns/artistas serão criados automaticamente quando necessário.

Uma cifra pode ser incluída permanentemente editando `assets/js/data.js`, no array `songs`, com `id`, `title`, `artistId`, `albumId`, `key`, `sections` etc.

## Recursos efetivos

- Busca por nome, artista e estilo;
- Mecanismo de transposição de semitons para acordes com sustenido/bemol, extensões e baixos invertidos (ex.: `A/C#`, `F#m7`), com reset;
- Editor de acordes sobre a letra (formato similar a ChordPro);
- Estimativa de tom por progressão de acordes. **Heurística, não IA treinada, não identifica áudio e pode errar**;
- Diagramas ilustrativos para acordes comuns, favoritos locais, ajuste da fonte, impressão e rolagem automática;
- Metrônomo com som e notas de referência para afinação, sem escuta do microfone;
- Cadastro de cifra, prévia, aprovação/rejeição, catálogo e exportação local de dados.

## Limites importantes

**Não é um backend de produção.** O painel não possui autenticação nem proteção contra acesso; o conteúdo enviado e os favoritos ficam somente no armazenamento local daquele navegador, não são sincronizados, não podem ser vistos por outros visitantes e podem desaparecer quando o navegador é limpo. Para um site público multiusuário, é obrigatório incluir banco de dados, login, autorização no servidor, moderação, controle de abusos e backups. `config.js` é apenas um ponto de configuração futura, não conecta Supabase nesta versão.

As capas e retratos em `assets/img/*.webp` são **imagens fotográficas ilustrativas geradas para este projeto** (seis capas de músicas, três capas de álbuns e três retratos fictícios); não representam capas comerciais oficiais nem fotografias reais dos artistas citados em referências externas. Os nomes de artistas e músicas do catálogo `external` e no CSV são referências bibliográficas de índices públicos, **não licenças para usar letras/cifras/capas**. Não incluímos letras completas de terceiros. As letras das seis músicas fictícias no `data.js` são exemplos criados para este projeto.

## Fontes de referências de títulos

- https://www.bananacifras.com/cifra/genre/sertanejo
- https://www.cifras.com.br/mais-acessadas

Para aumentar o acervo: utilize letras próprias, domínio público comprovado, obras autorizadas pelos titulares ou licenças adequadas. Não faça scraping indiscriminado de sites de terceiros.

## Correção da tela branca (versão 1.1)

Removido `type="module"` dos scripts `app.js` nas 11 páginas HTML, pois navegadores como Chrome e Edge restringem o carregamento de módulos locais pelo protocolo `file://`. A estrutura agora utiliza scripts tradicionais compatíveis com execução local. Se aparecer apenas a mensagem "Carregando", verifique se o ZIP foi extraído integralmente (incluindo a pasta `assets`).


## Página inicial estilo portal de cifras

A página inicial tem busca em destaque, cifras mais acessadas do acervo autoral, estilos, lista de artistas, índice A–Z, álbuns e referências a títulos públicos. Não exibe o repertório pessoal entre as músicas públicas.

### Meu repertório / Login

O botão **Meu repertório** leva à página separada `repertorio/index.html`. Sem perfil local, ela convida a acessar `login/index.html`; o usuário informa nome e e-mail e pode salvar favoritos, criar listas e adicionar/remover músicas. **Isto é SOMENTE uma simulação local sem senha e sem segurança**, não um cadastro autenticado: nada é sincronizado ou protegido no servidor. Para disponibilizar contas reais, é necessário implementar uma autenticação segura e banco de dados (por exemplo Supabase Auth + Row Level Security).


## Correção dos hiperlinks e capas (versão 2.1)

Todos os links internos apontam diretamente para arquivos `.html` (por exemplo, `musicas/index.html`), sem depender da resolução de pastas por um servidor. Assim funcionam em `file://` (duplo clique) e após a publicação online. O usuário pode clicar em: cards de músicas, capas de álbuns, retratos de artistas, menus, botões de ações e busca. Os testes automatizados de integridade de rotas verificaram **381 links e 29 referências a imagens** nas 13 páginas/estados do projeto, sem alvos locais ausentes. Não são testes de navegador visual.

As fotos são **locais**, em WebP, e não dependem de internet. A imagem de cada música é configurada no campo `cover` do respectivo objeto em `assets/js/data.js`. Para usar uma capa oficial licenciada, substitua o arquivo correspondente na pasta `assets/img/` ou edite o caminho. Para artistas, use o campo `photo`; para álbuns, o campo `cover`.

A categoria de **músicas e artistas conhecidos** possui páginas internas próprias para cada título e perfil de artista. São metadados de catálogo: músicas sem cifra cadastrada oferecem um formulário de envio para revisão, sem redirecionamento a sites terceiros. Letras e cifras comerciais só são publicadas quando autorizadas.


## NOVO: Músicas Católicas (pacote enviado pelo usuário)

O arquivo `_MUSICAS.zip` fornecido foi integrado à pasta `dados/originais/catolicas` e convertido em cifras navegáveis.

- Página pública: **`categorias/catolica/index.html`** ou clique em **Católicas** no menu.
- As músicas aparecem em `musicas/index.html`, no índice de artistas e nos agrupamentos da galeria.
- Os acordes foram extraídos dos arquivos Word, PDF e RTF (incluindo documentos com tabelas).
- A transposição de tom está disponível pelo leitor da cifra, em `musicas/cifra.html`.
- **Os documentos originais estão preservados**, e o botão *Arquivo original* aparece em cada cifra para conferir formatação, letras e harmonias.
- `dados/catolicas-catalogo.csv`: relação editável das músicas importadas.
- `assets/js/catolicas.js`: registros importados; carregamento automático sem servidor.
- `assets/img/catolicas/`: artes gráficas geradas para distinguir cada música (não são capas oficiais).

**Importante:** a extração é automática. A posição de alguns acordes pode diferir da diagramação original, e os artistas, tons e títulos devem ser revisados antes de uma publicação oficial. Em arquivos sem tonalidade explícita, a cifra indica `—`; o mecanismo ainda transpõe os acordes. As coleções temáticas não são álbuns oficiais.

## Ajuste de alinhamento e rolagem (novembro/2026)

- As **198 músicas católicas** agora contêm a propriedade `originalLayout`, extraída novamente dos arquivos enviados e renderizada em fonte monoespaçada, respeitando **a ordem das linhas e os espaços das colunas** (sem mover acordes para palavras próximas).
- Para músicas de origem Word, as linhas de acordes são colocadas em **colunas absolutas por caractere**. A transposição altera o nome do acorde sem mudar a coluna onde ele começa.
- Para documentos PDF ou RTF, a extração textual pode ter diferenças em relação à formatação visual: confira pelo link **Arquivo original** na página da música.
- No celular, a cifra mantém o alinhamento e pode ser **deslizada horizontalmente**, em vez de quebrar e desorganizar acordes e versos.
- **Rolagem:** abra uma cifra e clique em `▶ Rolagem`; ela se desloca automaticamente na vertical. Use `Velocidade da rolagem` para regular e `❚❚ Pausar` para parar, podendo retomar do mesmo lugar.
- Não é necessário instalar servidor para testar: extraia o ZIP e abra `index.html`, depois clique em `Músicas Católicas`.

Arquivos centrais desta correção: `assets/js/catolicas.js`, `assets/js/app.js`, `assets/css/style.css`.


## Atualização — links próprios para músicas e artistas conhecidos

- A seção **Músicas e artistas conhecidos** da página inicial, a galeria e a busca de músicas agora usam somente endereços relativos do Acorde Studio.
- Cada referência tem ficha interna em `musicas/referencia.html?id=ref-musica-...`.
- Cada artista conhecido tem um perfil em `artistas/perfil.html?id=ref-artista-...`, com lista de músicas conhecidas ligada às respectivas fichas.
- A busca geral também encontra músicas conhecidas, mesmo sem cifra cadastrada.
- Caso a cifra não esteja disponível, a ficha informa claramente essa condição e oferece **Enviar cifra**, com título e artista já preenchidos. O envio continua sujeito à revisão e aos direitos autorais.
- A imagem dos artistas que aparecem apenas como referências é uma arte genérica `assets/img/artista-referencia.svg`, para não apresentar falsos retratos oficiais.
- Os dados originais dos registros mantêm a proveniência documental, mas nenhum link de saída para Banana Cifras ou Cifras.com.br é exibido aos visitantes.


## Aparência AcordeEDU (referência visual enviada)

Esta versão usa a marca **AcordeEDU** e atualiza as páginas com cabeçalho azul-escuro,
acentos amarelos, menu lateral, busca destacada, seções de capas e índice alfabético.

A área **Top Artistas** é um **carrossel horizontal real**: clique nas setas ‹/›,
arraste/deslize com o dedo no celular ou use as teclas ←/→ com o carrossel selecionado.
Cada retrato abre a página **interna** do artista, e cada capa abre a ficha da música.
Os arquivos das imagens de interface ficam em `assets/img/edu/`.

**Importante sobre imagens:** as imagens pequenas de artistas, faixas e estilos
foram recortadas da referência visual fornecida para reproduzir sua proposta de design;
não constituem fotografias oficiais verificadas dos artistas nem capas oficiais.
Para publicar o site, substitua-as por imagens próprias ou licenciadas.

**Como abrir**: extraia o arquivo ZIP completo e abra `index.html`. Os dados e a navegação
estão organizados para funcionamento local. A autenticação continua sendo
uma demonstração via armazenamento do navegador, não uma conta segura no servidor.
