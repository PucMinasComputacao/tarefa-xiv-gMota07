// URL base da API servida pelo JSON Server
const API_URL = "http://localhost:3000/carros";

/**
 * Busca todos os carros no JSON Server.
 * @returns {Promise<Array>} array de carros
 */
async function fetchItems() {
    const resposta = await fetch(API_URL);

    if (!resposta.ok) {
        throw new Error(`Erro ao buscar carros: ${resposta.status}`);
    }

    const itens = await resposta.json();
    return itens;
}

/**
 * Cria o elemento (card) de um carro a partir dos dados vindos da API.
 * @param {Object} item - carro retornado pela API
 * @returns {HTMLElement} elemento do card já preenchido
 */
function createCard(item) {
    const card = document.createElement("div");
    card.className = "card bg-dark text-light";
    card.style.width = "18rem";

    card.innerHTML = `
        <img src="${item.imagem}" class="card-img-top bg-light" alt="${item.titulo}">

        <div class="card-body">
            <span class="badge text-bg-secondary mb-2">${item.categoria}</span>

            <h5 class="card-title" id="card-titulo">${item.titulo}</h5>

            <p class="card-text">${item.descricaoCurta}</p>

            <p class="card-text">
                <b>Preço:</b> ${formatarPreco(item.preco)}
            </p>

            <a href="details.html?id=${item.id}" class="btn btn-primary">
                Ver Detalhes
            </a>
        </div>
    `;

    return card;
}

/**
 * Limpa a lista de cards na tela e renderiza os cards recebidos.
 * @param {Array} items - lista de carros a renderizar
 */
function renderCards(items) {
    const todosCarros = document.querySelector(".todos-carros");
    todosCarros.innerHTML = "";

    if (!items || items.length === 0) {
        todosCarros.innerHTML = `<p class="text-muted">Nenhum carro encontrado.</p>`;
        return;
    }

    items.forEach((item) => {
        const card = createCard(item);
        todosCarros.appendChild(card);
    });
}

function formatarPreco(valor) {
    return Number(valor).toLocaleString("pt-br", {
        style: "currency",
        currency: "BRL",
    });
}

function createDestaque(carro) {
    const carouselInner = document.querySelector(".carousel-inner");

    const novoItem = document.createElement("div");
    novoItem.classList.add("carousel-item");

    // deixa o primeiro ativo
    if (carouselInner.children.length === 0) {
        novoItem.classList.add("active");
    }

    novoItem.innerHTML = `
        <a href="details.html?id=${carro.id}"><img
            src="${carro.imagem}"
            class="d-block w-100 rounded"
            alt="${carro.titulo}"
        >
        </a>
    `;

    carouselInner.appendChild(novoItem);
}

function renderDestaques(items) {
    const carrosDestaque = items.filter((item) => item.destaque === true);
    carrosDestaque.forEach((carro) => createDestaque(carro));
}

function configurarPesquisa(items) {
    const campo = document.getElementById("txtPesquisa");

    campo.addEventListener("input", () => {
        const termoBusca = campo.value.toLowerCase().trim();

        const itensFiltrados = items.filter((item) =>
            item.titulo.toLowerCase().includes(termoBusca)
        );

        renderCards(itensFiltrados);
    });
}

/**
 * Ponto de entrada da Home: busca os itens no servidor e renderiza tudo.
 */
async function init() {
    const statusEl = document.getElementById("status-carregamento");

    try {
        const items = await fetchItems();

        statusEl.style.display = "none";

        renderCards(items);
        renderDestaques(items);
        configurarPesquisa(items);
    } catch (erro) {
        console.error(erro);
        statusEl.textContent =
            "Não foi possível carregar os carros. Verifique se o JSON Server está rodando em http://localhost:3000.";
    }
}

window.addEventListener("load", init);
