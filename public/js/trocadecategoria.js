import { db4 } from './firebase.js';
import { ref, get, remove, set } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

// Função para abrir o modal ao clicar no botão "Trocar de Categoria"
document.getElementById("trocar-categoria").addEventListener("click", function() {
    const modal = document.getElementById("trocar-categoria-container");
    modal.style.display = "block"; // Exibe o modal
    resetSelects(); // Reseta os seletores quando abre o modal
});

// Função para fechar o modal ao clicar no botão "Cancelar"
document.getElementById("cancelar-troca-categoria").addEventListener("click", function() {
    const modal = document.getElementById("trocar-categoria-container");
    modal.style.display = "none"; // Fecha o modal
    resetSelects(); // Limpa os campos ao cancelar
});

// Função para limpar os seletores e resetá-los
function resetSelects() {
    clearSelect('categoria-selection23');
    clearSelect('nova-categoria');
    clearSelect('atleta-selection23');
}

// Carregar categorias com base na fase selecionada
document.getElementById("seletor-fase23").addEventListener("change", function() {
    const faseSelecionada = this.value;
    if (faseSelecionada) {
        console.log(`Fase selecionada: ${faseSelecionada}`);
        loadCategories(faseSelecionada);
        loadCategoriesForMove(faseSelecionada);
    } else {
        clearSelect('categoria-selection23');
        clearSelect('nova-categoria');
    }
});

// Função para carregar as categorias baseadas na fase selecionada
function loadCategories(fase) {
    const categoriaSelect = document.getElementById('categoria-selection23');
    categoriaSelect.innerHTML = '<option value="">Carregando categorias...</option>'; // Limpa e carrega
    const categoriasRef = ref(db4, `${fase}/`); // Acesso direto à fase
    get(categoriasRef).then(snapshot => {
        if (snapshot.exists()) {
            console.log('Categorias carregadas:', snapshot.val());
            let categorias = snapshot.val();
            let options = '<option value="">Selecione uma categoria</option>';
            // Verifica se há categorias e as adiciona
            for (const categoria in categorias) {
                options += `<option value="${categoria}">${categoria}</option>`;
            }
            categoriaSelect.innerHTML = options;
        } else {
            categoriaSelect.innerHTML = '<option value="">Nenhuma categoria encontrada</option>';
        }
    }).catch(error => {
        console.error("Erro ao carregar categorias:", error);
        categoriaSelect.innerHTML = '<option value="">Erro ao carregar categorias</option>';
    });
}

// Função para carregar categorias no seletor "Nova Categoria"
function loadCategoriesForMove(fase) {
    const novaCategoriaSelect = document.getElementById('nova-categoria');
    novaCategoriaSelect.innerHTML = '<option value="">Carregando categorias...</option>'; // Limpa e carrega
    const categoriasRef = ref(db4, `${fase}/`); // Acesso direto à fase
    get(categoriasRef).then(snapshot => {
        if (snapshot.exists()) {
            console.log('Categorias carregadas para mover:', snapshot.val());
            let categorias = snapshot.val();
            let options = '<option value="">Selecione uma categoria</option>';
            // Verifica se há categorias e as adiciona
            for (const categoria in categorias) {
                options += `<option value="${categoria}">${categoria}</option>`;
            }
            novaCategoriaSelect.innerHTML = options;
        } else {
            novaCategoriaSelect.innerHTML = '<option value="">Nenhuma categoria encontrada</option>';
        }
    }).catch(error => {
        console.error("Erro ao carregar categorias:", error);
        novaCategoriaSelect.innerHTML = '<option value="">Erro ao carregar categorias</option>';
    });
}

// Limpar as opções de um select
function clearSelect(selectId) {
    const selectElement = document.getElementById(selectId);
    selectElement.innerHTML = '<option value="">Selecione uma opção</option>';
}

// Carregar os atletas da categoria selecionada
document.getElementById("categoria-selection23").addEventListener("change", function() {
    const categoriaSelecionada = this.value;
    const faseSelecionada = document.getElementById("seletor-fase23").value;
    if (categoriaSelecionada && faseSelecionada) {
        loadAtletas(faseSelecionada, categoriaSelecionada);
    } else {
        clearSelect('atleta-selection23');
    }
});

// Função para carregar os atletas com base na fase e categoria selecionada
function loadAtletas(fase, categoria) {
    const atletaSelect = document.getElementById('atleta-selection23');
    atletaSelect.innerHTML = '<option value="">Carregando atletas...</option>'; // Limpa e carrega
    const atletasRef = ref(db4, `${fase}/${categoria}/`); // Acesso direto aos atletas na categoria
    get(atletasRef).then(snapshot => {
        if (snapshot.exists()) {
            console.log('Atletas carregados:', snapshot.val());
            let atletas = snapshot.val();
            let options = '<option value="">Selecione um atleta</option>';
            // Verifica se há atletas e os adiciona
            for (const atletaId in atletas) {
                const atleta = atletas[atletaId];
                options += `<option value="${atletaId}">${atleta.nome} - ${atleta.numero}</option>`;
            }
            atletaSelect.innerHTML = options;
        } else {
            atletaSelect.innerHTML = '<option value="">Nenhum atleta encontrado</option>';
        }
    }).catch(error => {
        console.error("Erro ao carregar atletas:", error);
        atletaSelect.innerHTML = '<option value="">Erro ao carregar atletas</option>';
    });
}

// Ao clicar em "Confirmar", mover o atleta selecionado para a nova categoria
document.getElementById("confirmar-troca-categoria").addEventListener("click", function() {
    const faseSelecionada = document.getElementById("seletor-fase23").value;
    const categoriaSelecionada = document.getElementById("categoria-selection23").value;
    const atletaSelecionadoId = document.getElementById("atleta-selection23").value;
    const novaCategoria = document.getElementById("nova-categoria").value;
    if (faseSelecionada && categoriaSelecionada && atletaSelecionadoId && novaCategoria) {
        // Acesse os dados do atleta
        const atletaRef = ref(db4, `${faseSelecionada}/${categoriaSelecionada}/${atletaSelecionadoId}`);
        get(atletaRef).then(snapshot => {
            if (snapshot.exists()) {
                const atleta = snapshot.val();
                // Remover o atleta da categoria original
                remove(atletaRef).then(() => {
                    // Adicionar o atleta à nova categoria
                    const novaCategoriaRef = ref(db4, `${faseSelecionada}/${novaCategoria}/${atletaSelecionadoId}`);
                    set(novaCategoriaRef, atleta)
                    .then(() => {
                        console.log("Atleta movido com sucesso!");
                        alert("Atleta movido para a nova categoria!");
                        // Fechar o modal
                        const modal = document.getElementById("trocar-categoria-container");
                        modal.style.display = "none"; // Fecha o modal
                        resetSelects(); // Limpa os seletores após mover
                    })
                    .catch(error => {
                        console.error("Erro ao mover atleta:", error);
                        alert("Erro ao mover atleta.");
                    });
                });
            } else {
                console.log("Atleta não encontrado!");
                alert("Erro: Atleta não encontrado.");
            }
        }).catch(error => {
            console.error("Erro ao acessar os dados do atleta:", error);
        });
    } else {
        alert("Por favor, preencha todos os campos.");
    }
});

// Ao clicar em "Excluir", excluir o atleta selecionado
document.getElementById("excluirAtleta").addEventListener("click", function() {
    const faseSelecionada = document.getElementById("seletor-fase23").value;
    const categoriaSelecionada = document.getElementById("categoria-selection23").value;
    const atletaSelecionadoId = document.getElementById("atleta-selection23").value;
    if (faseSelecionada && categoriaSelecionada && atletaSelecionadoId) {
        const atletaRef = ref(db4, `${faseSelecionada}/${categoriaSelecionada}/${atletaSelecionadoId}`);
        // Remover o atleta
        remove(atletaRef)
        .then(() => {
            console.log("Atleta excluído com sucesso!");
            alert("Atleta excluído da categoria.");
            // Atualiza a lista de atletas após exclusão
            loadAtletas(faseSelecionada, categoriaSelecionada);
            resetSelects(); // Limpa os campos após excluir
        })
        .catch(error => {
            console.error("Erro ao excluir atleta:", error);
            alert("Erro ao excluir atleta.");
        });
    } else {
        alert("Por favor, selecione um atleta para excluir.");
    }
});