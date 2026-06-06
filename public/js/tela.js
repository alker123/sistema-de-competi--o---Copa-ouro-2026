import { db4, db3 } from "./firebase.js";
import { ref, onValue, getDatabase, remove, push, get, set } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

document.addEventListener('DOMContentLoaded', () => {
    const seletorCategoria = document.getElementById("seletor-categoria5"); // Seletor de categoria
    const inputCategoria = document.getElementById("categoria14"); // Input onde a categoria será exibida

    // Função para buscar as categorias do Firebase
    const buscarCategorias = async () => {
        try {
            const categoriaRef = ref(db3, 'Categoria'); 
            const snapshot = await get(categoriaRef); 

            if (snapshot.exists()) {
                const categorias = snapshot.val(); 
                console.log("Categorias recebidas: ", categorias);

                Object.keys(categorias).forEach(categoriaId => {
                    const option = document.createElement("option");
                    option.value = categoriaId; 
                    option.textContent = categorias[categoriaId]; 
                    seletorCategoria.appendChild(option); 
                });
            } else {
                console.log("Nenhuma categoria encontrada.");
            }
        } catch (error) {
            console.error("Erro ao buscar categorias:", error);
        }
    };

    buscarCategorias();

    seletorCategoria.addEventListener('change', () => {
        const categoriaSelecionada = seletorCategoria.value;
        inputCategoria.value = categoriaSelecionada; 
    });

    // Função para carregar o terceiro lugar
    const carregarTerceiroLugar = async () => {
        const categoriaSelecionada = seletorCategoria.value;

        if (!categoriaSelecionada) {
            alert("Por favor, selecione uma categoria.");
            return;
        }

        try {
            const terceiroLugarRef = ref(db3, `Terceiro-Lugar/${categoriaSelecionada}/atletas`);
            const snapshot = await get(terceiroLugarRef);

            if (snapshot.exists()) {
                const dados = snapshot.val();
                const atletaTerceiro = Object.values(dados).find(atleta => atleta.posicao === "3");

                if (atletaTerceiro) {
                    document.getElementById("foto-atleta3").src = atletaTerceiro.foto || "";
                    document.getElementById("nome3").value = atletaTerceiro.nome || "Nome não disponível";
                    document.getElementById("fase13").value = atletaTerceiro.fase || "";
                    document.getElementById("nota123").value = atletaTerceiro.notaFinal || "0.0";
                    document.getElementById("pocicao13").value = "TERCEIRO";

                    // Ativa a visualização
                    const el = document.getElementById("terceiro");
                    el.style.display = "grid";
                    setTimeout(() => el.classList.add("mostrar"), 50);
                } else {
                    alert("Não há atleta classificado em terceiro lugar.");
                }
            } else {
                alert("Informações do terceiro lugar não encontradas.");
            }
        } catch (error) {
            console.error("Erro ao buscar terceiro lugar:", error);
        }
    };

    // Função genérica para carregar lugar
    const carregarLugar = async (posicao) => {
        const categoriaSelecionada = seletorCategoria.value;

        if (!categoriaSelecionada) return;

        try {
            const lugarRef = ref(db3, `PrimeiroSegundo-Lugar/${categoriaSelecionada}/atletas`);
            const snapshot = await get(lugarRef);

            if (snapshot.exists()) {
                const dados = snapshot.val();
                const atleta = Object.values(dados).find(a => a.posicao === String(posicao));

                if (atleta) {
                    if (posicao === 1) {
                        document.getElementById("foto-atleta1").src = atleta.foto || "";
                        document.getElementById("nome").value = atleta.nome || "";
                        document.getElementById("fase1").value = atleta.fase || "";
                        document.getElementById("nota12").value = atleta.notaFinal || "";
                        document.getElementById("pocicao1").value = "PRIMEIRO";
                        
                        const el = document.getElementById("primeiro");
                        el.style.display = "grid";
                        setTimeout(() => el.classList.add("mostrar"), 50);

                    } else if (posicao === 2) {
                        document.getElementById("foto-atleta2").src = atleta.foto || "";
                        document.getElementById("nome2").value = atleta.nome || "";
                        document.getElementById("fase12").value = atleta.fase || "";
                        document.getElementById("nota122").value = atleta.notaFinal || "";
                        document.getElementById("pocicao12").value = "SEGUNDO";

                        const el = document.getElementById("segundo");
                        el.style.display = "grid";
                        setTimeout(() => el.classList.add("mostrar"), 50);
                    }
                }
            }
        } catch (error) {
            console.error(`Erro ao buscar ${posicao}º lugar:`, error);
        }
    };

    // --- EVENTOS DOS BOTÕES ---

    document.getElementById("segundo4").addEventListener('click', async () => {
        await carregarLugar(1);
        await carregarLugar(2);
    });

    document.getElementById("terceiro4").addEventListener('click', async () => {
        await carregarTerceiroLugar();
    });

    document.getElementById("voltar3").addEventListener('click', () => {
        ["primeiro", "segundo", "terceiro"].forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.classList.remove("mostrar");
                el.style.display = "none";
            }
        });
    });
});
