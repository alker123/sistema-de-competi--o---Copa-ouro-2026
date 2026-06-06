async function entrar() {
    const userInput = document.getElementById('user').value;
    const passInput = document.getElementById('pass').value;

    if (!userInput || !passInput) {
        alert("Preencha todos os campos!");
        return;
    }

    try {
        const response = await fetch('/index', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                user: userInput, 
                pass: passInput 
            })
        });

        const data = await response.json();

        if (data.success) {
            // O servidor respondeu que o login deu certo
            window.location.href = data.redirect;
        } else {
            alert("Usuário ou senha incorretos.");
        }
    } catch (error) {
        console.error("Erro:", error);
        alert("Erro ao conectar com o servidor.");
    }
}

//document.getElementById("loginForm").addEventListener("keydown", function(event) {
   // if (event.key === "Enter") {
      //  event.preventDefault();
      //  document.getElementById("btnLogin").click();
 //   }
//});

document.getElementById("loginForm").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();

        const loading = document.getElementById("loading");
        const loginContainer = document.querySelector(".login-container");

        // Esconde o formulário inteiro
        loginContainer.style.display = "none";

        // Mostra o loading
        loading.style.display = "block";

        setTimeout(() => {
            entrar();
        }, 2000);
    }
});