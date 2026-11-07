# Guia rápido para editar o seu site

## Mudar cores e fontes

Abra `assets/css/style.css`. No início, edite as variáveis `--bg`, `--ink`, `--accent`, `--purple` e `--navy`. As fontes são importadas em cada HTML pelo Google Fonts: Space Grotesk (títulos), DM Sans (textos), DM Mono (acordes).

## Trocar capas e imagens

Coloque suas imagens **com direitos de uso** em `assets/img/` e altere o caminho `cover` de cada álbum no `assets/js/data.js`. As capas SVG atuais são só ilustrações.

## Atualizar artistas e álbuns

Abra `assets/js/data.js` e edite os arrays `artists` e `albums`. Cada artista tem `id`, `name`, `genre`, `description` e `photo`. Os álbuns têm `id`, `title`, `artistId`, `year` e `cover`.

## Cadastrar uma cifra no código

Em `assets/js/data.js`, array `songs`, adicione:

```js
{
  id: 'minha-cancao', title: 'Minha Canção', artistId: 'meu-artista',
  albumId: 'meu-album', genre: 'MPB', level: 'Fácil',
  key: 'C', bpm: 95, capo: 0,
  sections: [
    { name: 'Verso', lines: [
      '[C]Minha canção [G]começa aqui',
      '[Am]O dia clareia [F]pra mim'
    ] }
  ]
}
```

É um exemplo original inventado apenas para demonstrar a estrutura.

## Publicar online

A pasta toda pode ser hospedada como site estático. Para que visitantes se cadastrem e enviem cifras de verdade, precisamos conectar um serviço de autenticação e dados (como Supabase) e implantar regras de segurança no servidor antes de abrir a moderação ao público.

## Observação sobre direitos

Títulos e nomes de artistas podem ser referenciados no catálogo, mas letras e cifras extraídas de sites como Cifras.com.br e Banana Cifras não devem ser reproduzidas integralmente sem permissão. Conteúdos licenciados podem ser inseridos através do painel/editor.
