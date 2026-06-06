function atualizarRelogio() {
    const agora = new Date();
    
    // Opções para formatar a data por extenso ou simples
    const opcoesData = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const dataFormatada = agora.toLocaleDateString('pt-BR', opcoesData);
    
    // Formata a hora: minuto: segundo
    const horaFormatada = agora.toLocaleTimeString('pt-BR');
    
    const display = document.getElementById('clock');
    
    if (display) {
        display.innerHTML = `${dataFormatada} | <strong>${horaFormatada}</strong>`;
    }
}

// Executa a função a cada 1 segundo (1000 milissegundos)
setInterval(atualizarRelogio, 1000);

// Chama uma vez ao carregar para não esperar 1 segundo vazio
document.addEventListener('DOMContentLoaded', atualizarRelogio);