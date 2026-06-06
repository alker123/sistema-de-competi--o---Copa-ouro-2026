// firebase.js
import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

// 🔧 Configuração do Banco 1
const configBanco3 = {
  databaseURL: "https://copaouro1-9a123-default-rtdb.firebaseio.com/"
};

// 🔧 Configuração do Banco 2
const configBanco2 = {
  databaseURL: "https://aulas1-9044b-default-rtdb.firebaseio.com/"
};

// ✅ Inicializa dois apps (usa getApps para evitar duplicações)
const app3 = getApps().find(app => app.name === 'banco1') || initializeApp(configBanco3, 'banco1');
const app2 = getApps().find(app => app.name === 'banco2') || initializeApp(configBanco2, 'banco2');

// 📦 Exporta os dois bancos
const db5 = getDatabase(app3); // dados-teste
const db6 = getDatabase(app2); // testes2

export { db5, db6 };