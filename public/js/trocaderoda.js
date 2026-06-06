// 1. Pegar as referências dos botões e do seletor
const btnEnviar = document.getElementById("enviar-jurados");
const btnEnviar2 = document.getElementById("enviar-jurados-2");
const rodaSelection = document.getElementById("roda-selection");
const btnTrocarRoda = document.getElementById("trocar-roda");
const seletorRodaDiv = document.getElementById("seletor-roda");

// 2. Função para alternar a visibilidade dos botões
function alternarBotoes(rodaId) {
    if (rodaId === "roda1") {
        btnEnviar.style.display = "block";  // Mostra botão 1
        btnEnviar2.style.display = "none";   // Esconde botão 2
    } else {
        btnEnviar.style.display = "none";    // Esconde botão 1
        btnEnviar2.style.display = "block";   // Mostra botão 2
    }
}

// 3. Escutar a mudança no select
if (rodaSelection) {
    rodaSelection.addEventListener("change", (e) => {
        alternarBotoes(e.target.value);
    });
}

// 4. Mostrar/Esconder o menu ao clicar no botão "Trocar de Roda"
if (btnTrocarRoda) {
    btnTrocarRoda.onclick = () => {
        seletorRodaDiv.style.display = (seletorRodaDiv.style.display === "none") ? "block" : "none";
    };
}

// 5. Inicializar ao carregar a página
window.onload = () => {
    // Verifica qual roda está selecionada no momento e ajusta os botões
    alternarBotoes(rodaSelection.value || "roda1");
};

//
//
//

