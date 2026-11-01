# Página inicial pública e área pessoal

- `index.html`: portal público com busca, ranking de cifras, gêneros, artistas, A-Z, álbuns e referências de catálogo.
- `musicas/`: todas as cifras cadastradas, inclusive as demonstrativas com transposição.
- `repertorio/`: espaço pessoal separado da página inicial. É possível criar listas e usar favoritos.
- `login/`: perfil local de demonstração. Não é autenticação segura; não usar para contas reais em produção.
- `enviar/` e `admin/`: cadastros e moderação locais de demonstração.

## Funcionamento offline

Extraia TODO o ZIP e abra `index.html` por duplo clique. Não use apenas o arquivo HTML fora da pasta. Fontes externas exigem conexão; se offline, fontes alternativas são usadas.

## Para publicar o login real

Instalar autenticação de servidor com e-mail e senha ou social login, regras de acesso por usuário e banco de dados. Os dados em localStorage não são privados ou sincronizados.

## Direitos de conteúdo

Capas e letras de músicas comerciais não foram copiadas; as referências externas apresentam metadados e links de origem.
