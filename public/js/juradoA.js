import { db4, db3 } from "./firebase.js";
import { ref, onValue, getDatabase, push, get, set } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

// Caminho para o árbitro A
const refArbitroA = ref(db3, 'arbitros/arbitroA');

// Recuperar os dados do Firebase e preencher o campo de texto
onValue(refArbitroA, (snapshot) => {
  const arbitroA = snapshot.val();  // Recupera o valor de arbitroA no Firebase
  if (arbitroA) {
    // Preenche o campo de entrada com o valor de arbitroA
    document.getElementById("arbitro").value = arbitroA;
  } else {
    console.log("Arbitro A não encontrado no Firebase.");
  }
});

// ===== Elementos do DOM =====
const atletaSelect = document.getElementById("atleta");
const categoriaInput = document.getElementById("categoria");
const ritmoInput = document.getElementById("ritmo");
const faseInput = document.getElementById("fase");
const notaSelect = document.getElementById("nota");
const fotoAtleta = document.getElementById("foto-atleta");
const btnEnviar = document.getElementById("enviar");

let dadosAtletas = {};
const JURADO = "A";

// ===== Função para carregar atletas (Com correção da chave única) =====
function carregarAtletas() {
  onValue(ref(db4, `avaliacaodejuradoA`), (snapshot) => {
    const data = snapshot.val();
    if (!data) return;

    atletaSelect.innerHTML = "<option value=''>Selecione um atleta</option>";
    dadosAtletas = {};

    for (const fase in data) {
      for (const ritmo in data[fase]) {
        const juradoData = data[fase][ritmo]?.juradoA || {};
        for (const id in juradoData) {
          const atleta = juradoData[id];

          // Chave única por id/fase/ritmo para permitir duplicatas de nome
          const chave = `${id}||${fase}||${ritmo}`;

          dadosAtletas[chave] = {
            nome: atleta.nome,
            categoria: atleta.categoria,
            ritmo,
            id,
            foto: atleta.foto || "",
            fase,
            numero: atleta.numero,
          };

          const option = document.createElement("option");
          option.value = chave;
          // Mostra apenas Número e Nome para evitar poluição visual
          option.textContent = `${atleta.numero} - ${atleta.nome}`;

          atletaSelect.appendChild(option);
        }
      }
    }
  });
}

const buttons = document.querySelectorAll('.lang-buttons button'); // Seleciona todos os botões

buttons.forEach(button => {
  button.addEventListener('click', function () {
    // Remove a classe 'selected' de todos os botões
    buttons.forEach(btn => btn.classList.remove('selected'));

    // Adiciona a sombra na imagem do botão clicado
    this.classList.add('selected');
  });
});

// ===== Preencher seletor de notas 0.0 → 10.0 =====
function preencherNotas() {
  notaSelect.innerHTML = "<option value=''>Selecionar nota</option>";
  for (let i = 0.0; i <= 10.0; i += 1.0) {
    const option = document.createElement("option");
    option.value = i.toFixed(1);
    option.textContent = i.toFixed(1);
    notaSelect.appendChild(option);
  }
}

// ===== Atualiza categoria/ritmo/fase ao escolher atleta =====
function carregarFase() {
  const chave = atletaSelect.value;
  const dados = dadosAtletas[chave];

  if (dados) {
    categoriaInput.value = dados.categoria;
    ritmoInput.value = dados.ritmo;
    faseInput.value = dados.fase;
  } else {
    categoriaInput.value = "";
    ritmoInput.value = "";
    faseInput.value = "";
  }
}

// ===== Carregar foto do atleta =====
function carregarFotoAtleta() {
  const chave = atletaSelect.value;
  const dados = dadosAtletas[chave];

  const fotoAtletaContainer = document.getElementById("foto-atleta-container");
  const nomeAtletaContainer = document.getElementById("nome-atleta-container");
  const nomeAtleta = document.getElementById("nome-atleta1");

  if (dados && dados.foto) {
    fotoAtleta.src = dados.foto;
    fotoAtletaContainer.style.display = "block";
    nomeAtleta.textContent = dados.nome;
    nomeAtletaContainer.style.display = "block";
  } else {
    fotoAtletaContainer.style.display = "none";
    nomeAtletaContainer.style.display = "none";
  }
}

// ===== Enviar nota (Corrigido para exibir sucesso antes da limpeza) =====
async function enviarNota() {
  const chave = atletaSelect.value;
  const dados = dadosAtletas[chave];
  const faseSelecionada = faseInput.value;
  const nota = parseFloat(notaSelect.value);

  if (!dados || !faseSelecionada || isNaN(nota)) {
    alert("❌ Selecione um atleta e uma nota válida.");
    return;
  }

  const confirmar = confirm(
    `Deseja realmente enviar a nota ${nota.toFixed(1)} para ${dados.nome} na Fase ${dados.fase} - ${dados.ritmo}?`
  );
  if (!confirmar) return;

  const dadosNota = {
    atleta: dados.nome,
    categoria: dados.categoria,
    foto: dados.foto || "",
    numero: dados.numero || "",
    jurado: JURADO,
    nota: nota.toFixed(1),
    ritmo: dados.ritmo,
    fase: faseSelecionada,
  };

  const chavePadrao = `${dados.nome}_${dados.categoria}_${dados.ritmo}`
    .toLowerCase()
    .replace(/\s+/g, "_");

  try {
    // 1. TENTA ENVIAR A NOTA (Ação Crítica 1)
    console.log("Tentando enviar nota para o db3...");
    await set(
      ref(db3, `${faseSelecionada}${JURADO}/${dados.ritmo}/${chavePadrao}`),
      dadosNota
    );

    // 2. TENTA MARCAR COMO AVALIADO (Ação Crítica 2)
    console.log("Tentando marcar como avaliado no db3...");
    await set(ref(db3, `avaliado${JURADO}/${dados.ritmo}/${chavePadrao}`), true);

    // 3. ✅ EXIBE MENSAGEM DE SUCESSO. O sucesso está confirmado.
    alert(`✅ Nota ${nota.toFixed(1)} enviada para ${dados.nome}`);
    console.log(`Sucesso! Nota ${nota.toFixed(1)} enviada. Iniciando limpeza...`);

    // 4. INICIA AS ETAPAS DE LIMPEZA (Colocadas APÓS o sucesso)

    // Limpeza Firebase (db4) - Isolada
    try {
      await set(
        ref(
          db4,
          `avaliacaodejurado${JURADO}/${faseSelecionada}/${dados.ritmo}/jurado${JURADO}/${dados.id}`
        ),
        null
      );
    } catch (limpezaError) {
      console.warn("Aviso: Falha na remoção do db4.", limpezaError);
    }

    // 🎯 CORREÇÃO FINAL: Limpeza DOM e Local - Isolada para evitar que qualquer erro dispare o catch crítico
    try {
      delete dadosAtletas[chave];
      atletaSelect.querySelector(`option[value="${chave}"]`)?.remove();

      notaSelect.value = "";
      categoriaInput.value = "";
      ritmoInput.value = "";
      faseInput.value = "";
      document.getElementById("foto-atleta-container").style.display = "none";
      document.getElementById("nome-atleta-container").style.display = "none";
    } catch (domError) {
      console.warn("Aviso: Falha na limpeza dos campos DOM. A nota foi enviada.", domError);
    }


  } catch (error) {
    // ❌ ESTE CATCH SÓ DEVE SER ACIONADO SE HOUVER FALHA CRÍTICA NO ENVIO DA NOTA (DB3).
    console.error("==========================================");
    console.error("❌ ERRO CRÍTICO NO ENVIO DA NOTA (DB3):", error);
    console.error("==========================================");
    alert("❌ Erro ao enviar a nota. Verifique o console para mais detalhes (F12).");
  }
}
// ===== Eventos =====
atletaSelect.addEventListener("change", () => {
  carregarFase();
  carregarFotoAtleta();
});

// Envio ao clicar no botão
btnEnviar.addEventListener("click", enviarNota);

// ===== Inicialização =====
carregarAtletas();
preencherNotas();