const translations = {
  pt: {
    headerTitle: "🏆 ARBITRO",
    systemTitle: "Sistema de Competição de Capoeira",
    mainTitle: "Arbitro",
    placeholderArbitro: "Arbitro",
    labelAtleta: "Atleta",
    labelFase: "Fase:",
    placeholderFase: "fase",
    labelCategoria: "Categoria:",
    placeholderCategoria: "Categoria",
    labelRitmo: "Jogo:",
    placeholderRitmo: "Ritmo",
    labelSelecionarAtleta: "Selecionar Atleta",
    optionSelectAthlete: "Selecione um atleta",
    labelNota: "Nota",
    optionSelectScore: "Selecionar nota",
    btnText: "Enviar Nota",
    copyright: "© 2026 Sistema de Pontuação - Voando Alto",
    selectValid: "❌ Selecione um atleta e uma nota válida.",
    confirmSend: (nota, nome, fase, ritmo) => `Deseja realmente enviar a nota ${nota.toFixed(1)} para ${nome} na Fase ${fase} - ${ritmo}?`,
    successSend: (nota, nome) => `✅ Nota ${nota.toFixed(1)} enviada para ${nome}`,
    errorSend: "❌ Erro ao enviar a nota. Verifique o console para mais detalhes (F12).",
    warningCleanupDB4: "Aviso: Falha na remoção do db4.",
    warningCleanupDOM: "Aviso: Falha na limpeza dos campos DOM. A nota foi enviada."
  },
  en: {
    headerTitle: "🏆 REFEREE",
    systemTitle: "Capoeira Competition System",
    mainTitle: "Referee",
    placeholderArbitro: "Referee",
    labelAtleta: "Athlete",
    labelFase: "Stage:",
    placeholderFase: "stage",
    labelCategoria: "Category:",
    placeholderCategoria: "Category",
    labelRitmo: "Game:",
    placeholderRitmo: "Game",
    labelSelecionarAtleta: "Select Athlete",
    optionSelectAthlete: "Select an athlete",
    labelNota: "Score",
    optionSelectScore: "Select score",
    btnText: "Send Score",
    copyright: "© 2026 Scoring System - Flying High",
    selectValid: "❌ Select a valid athlete and score.",
    confirmSend: (nota, nome, fase, ritmo) => `Do you really want to send the score ${nota.toFixed(1)} to ${nome} in Stage ${fase} - ${ritmo}?`,
    successSend: (nota, nome) => `✅ Score ${nota.toFixed(1)} sent to ${nome}`,
    errorSend: "❌ Error sending the score. Check console for details (F12).",
    warningCleanupDB4: "Warning: Failed to remove from db4.",
    warningCleanupDOM: "Warning: Failed to clear DOM fields. The score was sent."
  },
  es: {
    headerTitle: "🏆 ÁRBITRO",
    systemTitle: "Sistema de Competición de Capoeira",
    mainTitle: "Árbitro",
    placeholderArbitro: "Árbitro",
    labelAtleta: "Atleta",
    labelFase: "Fase:",
    placeholderFase: "fase",
    labelCategoria: "Categoría:",
    placeholderCategoria: "Categoría",
    labelRitmo: "Juego:",
    placeholderRitmo: "Ritmo",
    labelSelecionarAtleta: "Seleccionar Atleta",
    optionSelectAthlete: "Selecciona un atleta",
    labelNota: "Puntuación",
    optionSelectScore: "Seleccionar nota",
    btnText: "Enviar Puntuación",
    copyright: "© 2026 Sistema de Puntuación - Volando Alto",
    selectValid: "❌ Seleccione un atleta y uma nota válida.",
    confirmSend: (nota, nome, fase, ritmo) => `¿Desea realmente enviar la nota ${nota.toFixed(1)} para ${nome} en la Fase ${fase} - ${ritmo}?`,
    successSend: (nota, nome) => `✅ Nota ${nota.toFixed(1)} enviada a ${nome}`,
    errorSend: "❌ Error al enviar la nota. Verifique la consola para más detalles (F12).",
    warningCleanupDB4: "Aviso: Falló la eliminación en db4.",
    warningCleanupDOM: "Aviso: Falló la limpeza de los campos DOM. La nota fue enviada."
  },
  fr: {
    headerTitle: "🏆 ARBITRE",
    systemTitle: "Système de Compétition de Capoeira",
    mainTitle: "Arbitre",
    placeholderArbitro: "Arbitre",
    labelAtleta: "Athlète",
    labelFase: "Phase :",
    placeholderFase: "phase",
    labelCategoria: "Catégorie :",
    placeholderCategoria: "Catégorie",
    labelRitmo: "Jeu :",
    placeholderRitmo: "Rythme",
    labelSelecionarAtleta: "Sélectionner un athlète",
    optionSelectAthlete: "Sélectionnez un athlète",
    labelNota: "Note",
    optionSelectScore: "Sélectionner une note",
    btnText: "Envoyer la note",
    copyright: "© 2026 Système de Score - Volant Haut",
    selectValid: "❌ Sélectionnez un athlète et une note valide.",
    confirmSend: (nota, nome, fase, ritmo) => `Voulez-vous vraiment envoyer la note ${nota.toFixed(1)} à ${nome} dans la Phase ${fase} - ${ritmo} ?`,
    successSend: (nota, nome) => `✅ Note ${nota.toFixed(1)} envoyée à ${nome}`,
    errorSend: "❌ Erreur lors de l'envoi de la note. Vérifiez la console pour plus de détails (F12).",
    warningCleanupDB4: "Avertissement : Échec de la suppression de db4.",
    warningCleanupDOM: "Avertissement : Échec du nettoyage des champs DOM. La note a été envoyée."
  }
};

let currentLang = 'pt';

function updateTexts() {
  const t = translations[currentLang];

  // Tradução dos elementos visuais fixos
  const h1Logo = document.querySelector(".logo h1");
  if (h1Logo) h1Logo.textContent = t.headerTitle;

  const pLogo = document.querySelector(".logo p");
  if (pLogo) pLogo.textContent = t.systemTitle;

  const inputArbitro = document.getElementById("arbitro");
  if (inputArbitro) inputArbitro.placeholder = t.placeholderArbitro;

  const inputFase = document.getElementById("fase");
  if (inputFase) inputFase.placeholder = t.placeholderFase;

  const inputCategoria = document.getElementById("categoria");
  if (inputCategoria) inputCategoria.placeholder = t.placeholderCategoria;

  const inputRitmo = document.getElementById("ritmo");
  if (inputRitmo) inputRitmo.placeholder = t.placeholderRitmo;

  const lf = document.querySelector('label[for="fase"]'); if (lf) lf.textContent = t.labelFase;
  const lc = document.querySelector('label[for="categoria"]'); if (lc) lc.textContent = t.labelCategoria;
  const lr = document.querySelector('label[for="ritmo"]'); if (lr) lr.textContent = t.labelRitmo;
  
  const labelAtletaFoto = document.getElementById("nome-atleta1");
  if (labelAtletaFoto) labelAtletaFoto.textContent = t.labelAtleta;

  const labelSelectAtleta = document.querySelector('label[for="atleta"]');
  if (labelSelectAtleta) labelSelectAtleta.textContent = t.labelSelecionarAtleta;

  const labelNota = document.getElementById("nota1");
  if (labelNota) labelNota.textContent = t.labelNota;

  const btn = document.getElementById('enviar');
  if (btn) btn.textContent = t.btnText;

  const footerText = document.querySelector(".footer p");
  if (footerText) footerText.textContent = t.copyright;

  // Traduz os primeiros itens em branco dos seletores
  const optAtleta = document.querySelector('#atleta option[value=""]');
  if (optAtleta) optAtleta.textContent = t.optionSelectAthlete;

  const optNota = document.querySelector('#nota option[value=""]');
  if (optNota) optNota.textContent = t.optionSelectScore;
  
  window.currentLang = currentLang;
}

function changeLanguage(lang) {
  currentLang = lang;
  const buttons = document.querySelectorAll('.lang-buttons button');
  buttons.forEach(btn => btn.classList.remove('active', 'selected'));
  
  const activeBtn = document.getElementById(lang);
  if (activeBtn) activeBtn.classList.add('active', 'selected');
  
  localStorage.setItem('judgeLanguage', lang);
  updateTexts();
}

document.getElementById("pt")?.addEventListener("click", () => changeLanguage("pt"));
document.getElementById("en")?.addEventListener("click", () => changeLanguage("en"));
document.getElementById("es")?.addEventListener("click", () => changeLanguage("es"));
document.getElementById("fr")?.addEventListener("click", () => changeLanguage("fr"));

document.addEventListener("DOMContentLoaded", () => {
  const savedLang = localStorage.getItem("judgeLanguage");
  if (savedLang && translations[savedLang]) {
    changeLanguage(savedLang);
  } else {
    changeLanguage('pt');
  }
});

// 🔥 O TRUQUE DEFINITIVO: INTERCEPTAÇÃO DOS ALERTAS EM NÍVEL DE NAVEGADOR
// Substitui as funções "alert" e "confirm" globais do navegador. 
// Toda vez que o seu juradoA.js tentar disparar um alert em português padrão, 
// este interceptador traduz a mensagem em tempo real com base no idioma atual!

const nativeAlert = window.alert;
window.alert = function(message) {
  if (currentLang === 'pt') return nativeAlert(message);
  
  const t = translations[currentLang];
  const pt = translations['pt'];

  if (message === pt.selectValid) return nativeAlert(t.selectValid);
  if (message === pt.errorSend) return nativeAlert(t.errorSend);
  if (message.includes("✅ Nota")) {
    // Extrai a nota e o nome da mensagem original em português
    const match = message.match(/Nota\s+([\d.]+)\s+enviada\s+para\s+(.+)/i);
    if (match) {
      const nota = parseFloat(match[1]);
      const nome = match[2];
      return nativeAlert(t.successSend(nota, nome));
    }
  }
  return nativeAlert(message);
};

const nativeConfirm = window.confirm;
window.confirm = function(message) {
  if (currentLang === 'pt') return nativeConfirm(message);
  
  const t = translations[currentLang];
  // Captura se a mensagem disparada foi o texto de confirmação de envio do sistema
  if (message.includes("Deseja realmente enviar")) {
    const atletaSelect = document.getElementById("atleta");
    const notaSelect = document.getElementById("nota");
    const faseInput = document.getElementById("fase");
    const ritmoInput = document.getElementById("ritmo");

    // Coleta as variáveis vivas direto da tela para montar a string perfeitamente traduzida
    if (atletaSelect && notaSelect) {
      const nota = parseFloat(notaSelect.value) || 0;
      const textoAtleta = atletaSelect.options[atletaSelect.selectedIndex]?.text || "";
      const nomeAtleta = textoAtleta.split(" - ")[1] || textoAtleta;
      const fase = faseInput ? faseInput.value : "";
      const ritmo = ritmoInput ? ritmoInput.value : "";

      return nativeConfirm(t.confirmSend(nota, nomeAtleta, fase, ritmo));
    }
  }
  return nativeConfirm(message);
};

// Vinculação extra de retrocompatibilidade
window.translations = translations;