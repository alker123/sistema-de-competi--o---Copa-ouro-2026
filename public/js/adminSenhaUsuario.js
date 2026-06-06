import { db4 } from "./firebase.js";
import { ref, get, set } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

document.addEventListener("DOMContentLoaded", function () {
    // --- 1. Mostrar/ocultar senha ---
    const mostrarSenhaCheckbox = document.getElementById("mostrar-senha");
    const senhaInput = document.getElementById("novo-user-senha");

    mostrarSenhaCheckbox.addEventListener("change", function () {
        senhaInput.type = mostrarSenhaCheckbox.checked ? "text" : "password";
    });

    // --- 2. Botão de cadastro ---
    document.getElementById("cadastrar-usuario-btn").addEventListener("click", async () => {
        const nomeUsuario = document.getElementById("novo-user-nome").value.trim();
        const password = document.getElementById("novo-user-senha").value.trim();
        const email = document.getElementById("novo-user-email").value.trim();
        const rota = document.getElementById("rota-html").value;

        if (!nomeUsuario || !password || !email || !rota) {
            alert("⚠️ Todos os campos são obrigatórios.");
            return;
        }

        try {
            const userRef = ref(db4, "usuarios/" + nomeUsuario);
            const snapshot = await get(userRef);

            if (snapshot.exists()) {
                alert("⚠️ Usuário já existe.");
                return;
            }

            await set(userRef, {
                username: nomeUsuario,
                password: password,
                email: email,
                rota: rota,
                dataCriacao: new Date().toISOString()
            });

            alert("✅ Usuário cadastrado com sucesso!");
            limparCampos();

        } catch (error) {
            console.error("Erro ao cadastrar usuário:", error);
            alert("❌ Erro ao cadastrar usuário.");
        }
    });

    // --- 3. Limpar campos após cadastro ---
    function limparCampos() {
        document.getElementById("novo-user-nome").value = "";
        document.getElementById("novo-user-senha").value = "";
        document.getElementById("novo-user-email").value = "";
        document.getElementById("rota-html").value = "";
        mostrarSenhaCheckbox.checked = false;
        senhaInput.type = "password";
    }
});