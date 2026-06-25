# Auto Seminovos — Home com cards e página de detalhes com JSON Server

## Informações Gerais

- **Nome:** Gabriel Mota Valério
- **Matrícula:** 918995
- **Turno:** Noite

## Sobre o projeto

Catálogo de carros seminovos. A Home busca os carros no JSON Server via `fetch` e
renderiza os cards dinamicamente. Ao clicar em "Ver Detalhes", o usuário é levado
para `details.html?id=<ID>`, que lê o `id` da URL com `URLSearchParams` e busca o
item correspondente direto na API.

## Estrutura de arquivos

```
db.json                    -> "banco de dados" do JSON Server
package.json                -> script para rodar o JSON Server
public/
  index.html                -> Home
  details.html               -> Página de detalhes
  assets/
    css/style.css
    img/
    js/
      app.js                -> lógica da Home (fetchItems, createCard, renderCards, init)
      details.js             -> lógica dos detalhes (URLSearchParams + fetch por id)
images/                      -> prints da aplicação (ver seção "Imagens" abaixo)
```

## Estrutura do db.json

O `db.json` tem 3 coleções:

- **`carros`** (coleção principal): é o item que vira card na Home. Tem 12 carros
  cadastrados, distribuídos em 5 categorias (`Sedan`, `SUV`, `Esportivo`, `Hatch`,
  `Elétrico`).
- **`categorias`**: lista simples com o nome de cada categoria de carro existente.
- **`avaliacoes`**: notas e comentários de alguns carros, relacionados pelo campo
  `carroId`. Ainda não tem tela própria, mas a estrutura já existe para uma
  evolução futura (ex.: mostrar nota média na página de detalhes).

### Exemplo de 1 item da coleção `carros`

```json
{
  "id": 1,
  "titulo": "Mustang GT",
  "marca": "Ford",
  "ano": 2020,
  "descricaoCurta": "Motor V8 5.0 potente com câmbio automático e acabamento esportivo.",
  "descricaoCompleta": "Motor V8 5.0 potente, câmbio automático, bancos em couro premium, central multimídia com Apple CarPlay, escapamento esportivo, modos de condução e excelente desempenho na estrada.",
  "imagem": "assets/img/mustang.png",
  "categoria": "Esportivo",
  "preco": 289900,
  "quilometragem": "42.000km",
  "tags": ["V8", "automático", "couro", "esportivo"],
  "arcondicionado": true,
  "vidroEletrico": true,
  "destaque": true
}
```

## Como rodar o projeto

1. Instale as dependências (json-server):
   ```
   npm install
   ```
2. Suba o servidor (ele serve tanto a API quanto os arquivos da pasta `public`):
   ```
   npm start
   ```
3. Abra no navegador:
   - Home: http://localhost:3000/index.html
   - API de carros: http://localhost:3000/carros
   - Um carro específico: http://localhost:3000/carros/1

> Se preferir, também é possível abrir `public/index.html` direto no navegador
> (sem usar `--static`), desde que o JSON Server esteja rodando em
> `http://localhost:3000` para responder as requisições de `fetch`.

## Funcionalidades

- **Home (`index.html` + `app.js`)**
  - `fetchItems()`: busca todos os carros em `GET http://localhost:3000/carros`.
  - `createCard(item)`: monta o elemento do card (imagem, título, descrição curta,
    categoria e preço).
  - `renderCards(items)`: limpa a lista e insere os cards na tela.
  - `init()`: chama `fetchItems()` e depois `renderCards()`, e é disparada
    automaticamente no `load` da página.
  - Carrossel de destaques com os carros que têm `destaque: true`.
  - Campo de busca por título.

- **Detalhes (`details.html` + `details.js`)**
  - Lê o `id` da URL com `URLSearchParams`.
  - Busca o item em `GET http://localhost:3000/carros/<id>`.
  - Mostra imagem, título, categoria, preço, descrição completa e tags (em chips).
  - Lista os demais carros como sugestão ("Outros Carros").
  - Trata erro quando não há `id` na URL e quando o carro não é encontrado (404).

## Imagens

Adicione aqui os prints pedidos na atividade (salve os arquivos em `images/` e
mantenha os nomes abaixo, ou ajuste o caminho conforme o nome que usar):

### Home com os cards

![Home](images/home.png)

### Página de detalhes

![Detalhes](images/detalhes.png)
