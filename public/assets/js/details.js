const API_URL = "http://localhost:3000/carros";

function formatarPreco(valor) {
    return Number(valor).toLocaleString("pt-br", {
        style: "currency",
        currency: "BRL",
    });
}

/**
 * Lê o parâmetro "id" da URL atual usando URLSearchParams.
 * @returns {string|null} id lido da QueryString (ou null se não existir)
 */
function obterIdDaUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
}

/**
 * Busca um carro específico no JSON Server pelo id.
 * @param {string|number} id
 * @returns {Promise<Object|null>} o carro encontrado, ou null se não existir (404)
 */
async function fetchItemById(id) {
    const resposta = await fetch(`${API_URL}/${id}`);

    if (resposta.status === 404) {
        return null;
    }

    if (!resposta.ok) {
        throw new Error(`Erro ao buscar carro: ${resposta.status}`);
    }

    return resposta.json();
}

/**
 * Busca todos os carros, usada para montar a seção "Outros Carros".
 */
async function fetchItems() {
    const resposta = await fetch(API_URL);

    if (!resposta.ok) {
        throw new Error(`Erro ao buscar carros: ${resposta.status}`);
    }

    return resposta.json();
}

function renderTags(tags) {
    if (!tags || tags.length === 0) return "";

    const chips = tags
        .map((tag) => `<span class="badge text-bg-secondary me-1">${tag}</span>`)
        .join("");

    return `<p class="card-text"><b>Tags:</b><br>${chips}</p>`;
}

function renderDetalheCarro(carro) {
    const div = document.getElementById("detalhes-carro");

    div.innerHTML = `
        <div class="card mb-3">
          <div class="row g-0 div-card-detalhe">
            <div class="col-md-4">
                <img src="${carro.imagem}" class="card-img-top imgDetalhes" alt="${carro.titulo}">
            </div>
            <div class="col-md-8">
              <div class="card-body">
                <span class="badge text-bg-secondary mb-2">${carro.categoria}</span>
                <h5 class="card-title"><b>Modelo: </b>${carro.titulo}</h5>
                <p class="card-text"><b>Marca: </b>${carro.marca}</p>
                <p class="card-text"><b>Ano: </b>${carro.ano}</p>
                <p class="card-text"><b>Km: </b>${carro.quilometragem}</p>
                <p class="card-text"><b>Preço: </b>${formatarPreco(carro.preco)}</p>
                <p class="card-text"><b>Descrição: </b>${carro.descricaoCompleta}</p>
                <p class="card-text"><b>Ar Condicionado: </b>${carro.arcondicionado ? "Tem" : "Não tem"}</p>
                <p class="card-text"><b>Vidro Elétrico: </b>${carro.vidroEletrico ? "Tem" : "Não tem"}</p>
                ${renderTags(carro.tags)}
              </div>
            </div>
          </div>
        </div>
    `;
}

function renderOutrosCarros(items, idAtual) {
    const divOutros = document.getElementById("detalhes-outros");
    divOutros.innerHTML = "";

    const carrosDiferentes = items.filter((item) => String(item.id) !== String(idAtual));

    carrosDiferentes.forEach((item) => {
        divOutros.innerHTML += `
            <div class="card" style="width: 18rem;">
                <img src="${item.imagem}" class="card-img-top" alt="${item.titulo}">

                <div class="card-body">
                    <h5 class="card-title">${item.titulo}</h5>
                    <p class="card-text">${item.descricaoCurta}</p>

                    <a href="details.html?id=${item.id}" class="btn btn-primary">
                        Ver Detalhes
                    </a>
                </div>
            </div>
        `;
    });
}

function mostrarMensagem(mensagem) {
    const statusEl = document.getElementById("status-carregamento");
    statusEl.textContent = mensagem;
    statusEl.style.display = "block";
}

async function init() {
    const statusEl = document.getElementById("status-carregamento");
    const id = obterIdDaUrl();

    // Caso 1: não há id na URL
    if (!id) {
        mostrarMensagem("Nenhum carro foi informado na URL. Volte para a Home e escolha um carro.");
        return;
    }

    try {
        const carro = await fetchItemById(id);

        // Caso 2: item não existe
        if (!carro) {
            mostrarMensagem("Carro não encontrado. Ele pode ter sido removido ou o id informado é inválido.");
            return;
        }

        statusEl.style.display = "none";
        renderDetalheCarro(carro);

        const items = await fetchItems();
        renderOutrosCarros(items, id);
    } catch (erro) {
        console.error(erro);
        mostrarMensagem(
            "Não foi possível carregar os dados do carro. Verifique se o JSON Server está rodando em http://localhost:3000."
        );
    }
}

window.addEventListener("load", init);
