import { db3 } from "./firebase.js";
import { ref, get, onValue } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

// 1. Referências dos Elementos
const containerVer = document.getElementById("tabela-secundaria-cla");
const seletorFaseVer = containerVer.querySelector("#seletor-fase-grupo25");
const seletorCatVer = document.getElementById("seletor-categoria25");
const wrapperTabela = containerVer.querySelector(".scroll-tabela2"); // Onde a mágica acontece

// --- PASSO A: BUSCAR CATEGORIAS ---
seletorFaseVer.addEventListener("change", async () => {
    const fase = seletorFaseVer.value;
    seletorCatVer.innerHTML = '<option value="">Carregando...</option>';
    wrapperTabela.innerHTML = '<p style="padding:10px;">Selecione uma categoria</p>';

    if (!fase || fase === "Selecionar") return;

    try {
        const faseRef = ref(db3, `Fase/${fase}`);
        const snapshot = await get(faseRef);
        if (snapshot.exists()) {
            const categoriasNoBanco = Object.keys(snapshot.val());
            seletorCatVer.innerHTML = '<option value="">-- Escolha a Categoria --</option>';
            categoriasNoBanco.forEach(cat => {
                const opt = document.createElement("option");
                opt.value = cat; opt.textContent = cat;
                seletorCatVer.appendChild(opt);
            });
        } else {
            seletorCatVer.innerHTML = '<option value="">Nenhuma categoria</option>';
        }
    } catch (error) {
        console.error("Erro:", error);
    }
});

// --- PASSO B: BUSCAR ATLETAS ---
seletorCatVer.addEventListener("change", () => {
    const fase = seletorFaseVer.value;
    const categoria = seletorCatVer.value;
    if (!fase || !categoria) return;

    wrapperTabela.innerHTML = '<p style="padding:10px;">Buscando atletas...</p>';

    const caminhoAtletas = `Fase/${fase}/${categoria}/atletas`;
    const atletasRef = ref(db3, caminhoAtletas);

    onValue(atletasRef, (snapshot) => {
        if (snapshot.exists()) {
            renderizarTabelaVer(snapshot.val());
        } else {
            wrapperTabela.innerHTML = '<p style="padding:10px;">Nenhum atleta nesta categoria.</p>';
        }
    });
});

// --- PASSO C: RENDERIZAR E DIVIDIR (APENAS SE > 8 ATLETAS) ---
function renderizarTabelaVer(atletasObj) {
    // 1. Limpa o container
    wrapperTabela.innerHTML = "";

    const lista = Object.values(atletasObj).sort((a, b) => parseInt(a.posicao || 0) - parseInt(b.posicao || 0));

    // 2. Define se haverá divisão (mais de 12 atletas)
    const deveDuplicar = lista.length > 12;

    if (deveDuplicar) {
        wrapperTabela.style.display = "flex";
        wrapperTabela.style.gap = "20px";
        wrapperTabela.style.alignItems = "flex-start";

        const meio = Math.ceil(lista.length / 2);
        const parteA = lista.slice(0, meio);
        const parteB = lista.slice(meio);

        wrapperTabela.appendChild(criarTabela(parteA, "tab-esquerda"));
        wrapperTabela.appendChild(criarTabela(parteB, "tab-direita"));
    } else {
        // Layout normal (uma tabela só)
        wrapperTabela.style.display = "block";
        wrapperTabela.appendChild(criarTabela(lista, "tab-unica"));
    }
}

// Função auxiliar para criar a estrutura da tabela
function criarTabela(dadosAtletas, id) {
    const div = document.createElement("div");
    div.style.flex = "1";
    div.style.marginBottom = "20px";

    div.innerHTML = `
    <table id="${id}" class="tabela-atletas">
        <thead>
            <tr class="thead-atletas">
                <th class="fot1">Foto</th>
                <th class="pos1">Posição</th>
                <th class="atl1">Atleta</th>
                <th class="cate1">Categoria</th>
                <th class="j1">1º Jogo</th>
                <th class="j2">2º Jogo</th>
                <th class="j3">3º Jogo</th>
                <th class="j4">4º Jogo</th>
                <th class="ntf1">Final</th>
                <th class="clas1">Status</th>
            </tr>
        </thead>
        <tbody></tbody>
    </table>
`;

    const tbody = div.querySelector("tbody");

    dadosAtletas.forEach(atleta => {
        const tr = document.createElement("tr");
        const statusClassificado = atleta.classificado || "";

        // Padrão de cores para classificados
        if (statusClassificado.toLowerCase() === "classificado") {
            tr.style.backgroundColor = "#32dd0f";
            tr.style.color = "#142213";
        }

        tr.innerHTML = `
    <td class="fot1"><img src="${atleta.foto || ''}" alt="Foto do Atleta"></td>
    <td class="pos1">${atleta.posicao ? atleta.posicao + 'º' : '---'}</td>
    <td class="atl1">${atleta.nome || "---"}</td>
    <td class="cate1">${atleta.categoria || "---"}</td>
    <td class="j1">${atleta.jogos?.["1º Jogo"] || "0.0"}</td>
    <td class="j2">${atleta.jogos?.["2º Jogo"] || "0.0"}</td>
    <td class="j3">${atleta.jogos?.["3º Jogo"] || "0.0"}</td>
    <td class="j4">${atleta.jogos?.["4º Jogo"] || "0.0"}</td>
    <td class="ntf1">${atleta.notaFinal || "0.0"}</td>
    <td class="clas1">${statusClassificado}</td>
`;
        tbody.appendChild(tr);
    });

    return div;
}