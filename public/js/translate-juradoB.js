const translations = {
  pt: {
    headerTitle: "🏆 ARBITRO",
    systemTitle: "Sistema de Competição de Capoeira",
    mainTitle: "Arbitro",
    labelCategoria: "Categoria:",
    labelRitmo: "Jogo:",
    labelFase: "Fase:",
    labelAtleta: "Selecionar Atleta",
    optionSelect: "Selecione um atleta",
    labelNota: "Nota",
    labelVantagem: "Vantagem",
    btnText: "📤 Enviar Nota",
    successMessage: "✅ Nota enviada com sucesso!",
    errorMessage: "❌ Erro ao enviar a nota.",
    athleteNotFound: "❌ Atleta não encontrado."
  },
  en: {
    headerTitle: "🏆 REFEREE",
    systemTitle: "Capoeira Competition System",
    mainTitle: "Referee",
    labelFase: "phase:",
    labelCategoria: "Category:",
    labelRitmo: "Game:",
    labelAtleta: "Select Athlete",
    optionSelect: "Select an athlete",
    labelNota: "Score",
    labelVantagem: "Advantage",
    btnText: "📤 Send Score",
    successMessage: "✅ Score submitted successfully!",
    errorMessage: "❌ Error submitting the score.",
    athleteNotFound: "❌ Athlete not found."
  },
  es: {
    headerTitle: "🏆 ÁRBITRO",
    systemTitle: "Sistema de Competición de Capoeira",
    mainTitle: "Árbitro",
    labelCategoria: "Categoría:",
    labelRitmo: "Juego:",
    labelFase: "Fase:",
    labelAtleta: "Seleccionar Atleta",
    optionSelect: "Selecciona un atleta",
    labelNota: "Puntuación",
    labelVantagem: "Ventaja",
    btnText: "📤 Enviar Puntuación",
    successMessage: "✅ ¡Puntuación enviada con éxito!",
    errorMessage: "❌ Error al enviar la puntuación.",
    athleteNotFound: "❌ Atleta no encontrado."
  },
  fr: {
    headerTitle: "🏆 ARBITRE",
    systemTitle: "Système de Compétition de Capoeira",
    mainTitle: "Arbitre",
    labelFase: "Phase :",
    labelCategoria: "Catégorie :",
    labelRitmo: "Jeu :",
    labelAtleta: "Sélectionner un athlète",
    optionSelect: "Sélectionnez un athlète",
    labelNota: "Note",
    labelVantagem: "Avantage",
    btnText: "📤 Envoyer la note",
    successMessage: "✅ Note envoyée avec succès !",
    errorMessage: "❌ Erreur lors de l'envoi de la note.",
    athleteNotFound: "❌ Athlète introuvable."
}
};

// Objeto de mensagens traduzidas
const messages = {
  pt: {
    selectValid: "❌ Selecione um atleta e uma nota válida.",
    confirmSend: (nota, nome, fase, ritmo) => `Deseja realmente enviar a nota ${nota.toFixed(1)} para ${nome} na Fase ${fase} - ${ritmo}?`,
    successSend: (nota, nome) => `✅ Nota ${nota.toFixed(1)} enviada para ${nome}`,
    athleteNotFound: "❌ Atleta não encontrado.",
    errorSend: "❌ Erro ao enviar a nota. Verifique o console para mais detalhes (F12).",
    warningCleanupDB4: "Aviso: Falha na remoção do db4.",
    warningCleanupDOM: "Aviso: Falha na limpeza dos campos DOM. A nota foi enviada."
  },
  en: {
    selectValid: "❌ Select a valid athlete and score.",
    confirmSend: (nota, nome, fase, ritmo) => `Do you really want to send the score ${nota.toFixed(1)} to ${nome} in Stage ${fase} - ${ritmo}?`,
    successSend: (nota, nome) => `✅ Score ${nota.toFixed(1)} sent to ${nome}`,
    athleteNotFound: "❌ Athlete not found.",
    errorSend: "❌ Error sending the score. Check console for details (F12).",
    warningCleanupDB4: "Warning: Failed to remove from db4.",
    warningCleanupDOM: "Warning: Failed to clear DOM fields. The score was sent."
  },
  es: {
    selectValid: "❌ Seleccione un atleta y una nota válida.",
    confirmSend: (nota, nome, fase, ritmo) => `¿Desea realmente enviar la nota ${nota.toFixed(1)} para ${nome} en la Fase ${fase} - ${ritmo}?`,
    successSend: (nota, nome) => `✅ Nota ${nota.toFixed(1)} enviada a ${nome}`,
    athleteNotFound: "❌ Atleta no encontrado.",
    errorSend: "❌ Error al enviar la nota. Verifique la consola para más detalles (F12).",
    warningCleanupDB4: "Aviso: Falló la eliminación en db4.",
    warningCleanupDOM: "Aviso: Falló la limpieza de los campos DOM. La nota fue enviada."
  },
  fr: {
    selectValid: "❌ Sélectionnez un athlète et une note valide.",
    confirmSend: (nota, nome, fase, ritmo) => `Voulez-vous vraiment envoyer la note ${nota.toFixed(1)} à ${nome} dans la Phase ${fase} - ${ritmo} ?`,
    successSend: (nota, nome) => `✅ Note ${nota.toFixed(1)} envoyée à ${nome}`,
    athleteNotFound: "❌ Athlète introuvable.",
    errorSend: "❌ Erreur lors de l'envoi de la note. Vérifiez la console pour plus de détails (F12).",
    warningCleanupDB4: "Avertissement : Échec de la suppression de db4.",
    warningCleanupDOM: "Avertissement : Échec du nettoyage des champs DOM. La note a été envoyée."
  }
};

let currentLang = 'pt';

function updateTexts() {
  const t = translations[currentLang];

  const h1Logo = document.querySelector(".logo h1");
  if (h1Logo) h1Logo.textContent = t.headerTitle;

  const pLogo = document.querySelector(".logo p");
  if (pLogo) pLogo.textContent = t.systemTitle;

  const mainTitle = document.querySelector(".avaliacao-box h1");
  if (mainTitle) mainTitle.textContent = t.mainTitle;

   const labelFase = document.querySelector('label[for="fase"]');
  if (labelFase) labelFase.textContent = t.labelFase;

  const labelCategoria = document.querySelector('label[for="categoria"]');
  if (labelCategoria) labelCategoria.textContent = t.labelCategoria;

  const labelRitmo = document.querySelector('label[for="ritmo"]');
  if (labelRitmo) labelRitmo.textContent = t.labelRitmo;

  const labelAtleta = document.querySelector('label[for="atleta"]');
  if (labelAtleta) labelAtleta.textContent = t.labelAtleta;

  const optionDefault = document.querySelector('#atleta option');
  if (optionDefault) optionDefault.textContent = t.optionSelect;

  const notaLabels = document.querySelectorAll('label[for="nota"]');
  notaLabels.forEach(label => label.textContent = t.labelNota);

  const vantagemLabels = document.querySelectorAll('label[for="vantagem"]');
  vantagemLabels.forEach(label => label.textContent = t.labelVantagem);

  const btn = document.querySelector('#enviar');
  if (btn) btn.textContent = t.btnText;
}

function changeLanguage(lang) {
  currentLang = lang;
  document.querySelectorAll('.lang-buttons').forEach(btn => btn.classList.remove('active'));
  const activeBtn = document.getElementById(lang);
  if (activeBtn) activeBtn.classList.add('active');
  localStorage.setItem('judgeLanguage', lang);
  updateTexts();
}

document.getElementById("pt")?.addEventListener("click", () => changeLanguage("pt"));
document.getElementById("en")?.addEventListener("click", () => changeLanguage("en"));
document.getElementById("es")?.addEventListener("click", () => changeLanguage("es"));
document.getElementById("fr")?.addEventListener("click", () => changeLanguage("fr"));

const savedLang = localStorage.getItem("judgeLanguage");
if (savedLang && translations[savedLang]) {
  changeLanguage(savedLang);
} else {
  updateTexts();
}

// Handle button click events to show success or error messages
document.getElementById("enviar").addEventListener("click", async () => {
  const chave = atletaSelect.value;
  const dados = dadosAtletas[chave];
  if (!dados) {
    alert(translations[currentLang].athleteNotFound);
    return;
  }

  const nome = dados.nome;
  const categoria = dados.categoria;
  const ritmo = dados.ritmo;
  const id = dados.id;
  nota = parseFloat(notaInput.value);
  vantagem = parseFloat(vantagemInput.value);
  const notaFinal = (nota + vantagem).toFixed(1);

  const dadosNota = {
    atleta: nome,
    categoria,
    foto: dados.foto || "",
    jurado: JURADO,
    nota,
    notaFinal,
    ritmo,
    vantagem
  };

  const chavePadrao = `${nome}_${categoria}_${ritmo}`.toLowerCase().replace(/\s+/g, "_");

  try {
    await set(ref(dbEscrita, `avaliacoes${JURADO}/${ritmo}/${chavePadrao}`), dadosNota);
    await set(ref(dbEscrita, `avaliado${JURADO}/${ritmo}/${chavePadrao}`), true);
    await set(ref(dbLeitura, `avaliacaodejurado${JURADO}/${ritmo}/jurado${JURADO}/${id}`), null);

    const snapshot = await get(ref(dbLeitura, `avaliacaodejurado${JURADO}/${ritmo}/jurado${JURADO}`));
    if (!snapshot.exists()) {
      await set(ref(dbLeitura, `avaliacaodejurado${JURADO}/${ritmo}`), null);
    }

    alert(translations[currentLang].successMessage);

    nota = 9.0;
    vantagem = 0.0;
    notaInput.value = nota.toFixed(1);
    vantagemInput.value = vantagem.toFixed(1);
    carregarAtletas();

  } catch (error) {
    console.error("Erro ao enviar a nota:", error);
    alert(translations[currentLang].errorMessage);
  }
});

async function enviarNota() {
  const chave = atletaSelect.value;
  const dados = dadosAtletas[chave];
  const faseSelecionada = faseInput.value;
  const nota = parseFloat(notaSelect.value);

  if (!dados || !faseSelecionada || isNaN(nota)) {
    alert(messages[currentLang].selectValid);
    return;
  }

  const confirmar = confirm(
    messages[currentLang].confirmSend(nota, dados.nome, dados.fase, dados.ritmo)
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

  const chavePadrao = `${dados.nome}_${dados.categoria}_${dados.ritmo}`.toLowerCase().replace(/\s+/g, "_");

  try {
    await set(ref(db3, `${faseSelecionada}${JURADO}/${dados.ritmo}/${chavePadrao}`), dadosNota);
    await set(ref(db3, `avaliado${JURADO}/${dados.ritmo}/${chavePadrao}`), true);
    await set(ref(db4, `avaliacaodejurado${JURADO}/${faseSelecionada}/${dados.ritmo}/jurado${JURADO}/${dados.id}`), null);

    alert(messages[currentLang].successSend(nota, dados.nome));

    // Limpeza do DOM
    delete dadosAtletas[chave];
    atletaSelect.querySelector(`option[value="${chave}"]`)?.remove();
    notaSelect.value = "";
    categoriaInput.value = "";
    ritmoInput.value = "";
    faseInput.value = "";
    document.getElementById("foto-atleta-container").style.display = "none";
    document.getElementById("nome-atleta-container").style.display = "none";

  } catch (error) {
    console.error(error);
    alert(messages[currentLang].errorSend);
  }
}
