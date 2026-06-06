import { db3 } from "./firebase.js";
import { ref, get, onValue } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

// 1. Referências dos Elementos
const containerVer = document.getElementById("tabela-secundaria2");
const seletorFaseVer = containerVer.querySelector("#seletor-fase-grupo1");
const seletorCatVer = document.getElementById("seletor-categoria111");
const wrapperTabela = containerVer.querySelector(".scroll-tabela1"); // Onde a mágica acontece

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

// --- PASSO C: RENDERIZAR E DIVIDIR ---
function renderizarTabelaVer(atletasObj) {
    // 1. Limpa o container e aplica o estilo Lado a Lado
    wrapperTabela.innerHTML = "";
    wrapperTabela.style.display = "flex";
    wrapperTabela.style.gap = "20px";
    wrapperTabela.style.alignItems = "flex-start";

    const lista = Object.values(atletasObj).sort((a, b) => parseInt(a.posicao || 0) - parseInt(b.posicao || 0));

    // 2. Divide a lista ao meio
    const meio = Math.ceil(lista.length / 2);
    const parteA = lista.slice(0, meio);
    const parteB = lista.slice(meio);

    // 3. Cria as duas tabelas dinamicamente
    const criarTabela = (dadosAtletas, id) => {
        const div = document.createElement("div");
        div.style.flex = "1";
        div.innerHTML = `
            <table id="${id}" border="1" cellspacing="0" cellpadding="5" style="width:100%; border-collapse: collapse; font-size: 12px;">
                <thead>
                    <tr style="background:#eee;">
                        <th>Foto</th><th>Posição</th><th>Atleta</th><th>Categoria</th><th>1ºJogo</th><th>2ºJogo</th><th>3ºJogo</th><th>4ºJogo</th><th>Final</th><th>Status</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        `;
        const tbody = div.querySelector("tbody");
        
        dadosAtletas.forEach(atleta => {
            const tr = document.createElement("tr");
            const statusClassificado = atleta.classificado || "";
            if (statusClassificado.toLowerCase() === "classificado") {
                tr.style.backgroundColor = "#d4edda"; tr.style.color = "#155724";
            }

            tr.innerHTML = `
                <td style="text-align:center;"><img src="${atleta.foto || ''}" style="width:25px; height:25px; border-radius:50%; object-fit:cover;"></td>
                <td style="text-align:center;">${atleta.posicao ? atleta.posicao + 'º' : '---'}</td>
                <td style="text-align:left; font-weight:bold; padding-left:5px;">${atleta.nome || "---"}</td>
                <td style="text-align:center;">${atleta.categoria || "---"}</td>
                <td style="text-align:center;">${atleta.jogos?.["1º Jogo"] || "0.0"}</td>
                <td style="text-align:center;">${atleta.jogos?.["2º Jogo"] || "0.0"}</td>
                <td style="text-align:center;">${atleta.jogos?.["3º Jogo"] || "0.0"}</td>
                <td style="text-align:center;">${atleta.jogos?.["4º Jogo"] || "0.0"}</td>
                <td style="text-align:center; font-weight:bold; color:red;">${atleta.notaFinal || "0.0"}</td>
                <td style="text-align:center; font-size:10px;">${statusClassificado}</td>
            `;
            tbody.appendChild(tr);
        });
        return div;
    };

    // Adiciona as tabelas ao wrapper
    wrapperTabela.appendChild(criarTabela(parteA, "tab-esquerda"));
    if (parteB.length > 0) {
        wrapperTabela.appendChild(criarTabela(parteB, "tab-direita"));
    }
}