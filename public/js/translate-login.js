const translations = {
    pt: {
        title: "Login",
        headerTitle: "Login",
        headerSubtitle: "Acesse sua conta",
        userInput: "Digite seu usuário ou email",
        passInput: "Digite sua senha",
        loginBtn: "Entrar",
        footer: "© 2026 Sistema de Autenticação"
    },
    en: {
        title: "Login",
        headerTitle: "Login",
        headerSubtitle: "Access your account",
        userInput: "Enter your username or email",
        passInput: "Enter your password",
        loginBtn: "Login",
        footer: "© 2026 Authentication System"
    },
    es: {
        title: "Iniciar Sesión",
        headerTitle: "Login",
        headerSubtitle: "Accede a tu cuenta",
        userInput: "Ingrese su usuario o correo",
        passInput: "Ingrese su contraseña",
        loginBtn: "Entrar",
        footer: "© 2026 Sistema de Autenticación"
    }
};

function applyTranslation(lang) {
    const t = translations[lang];
    
    // 1. Título da aba
    document.title = t.title;
    
    // 2. Títulos do cabeçalho
    // No seu HTML: h1:last-child é onde está escrito "Login"
    const loginTitle = document.querySelector('.login-header h1:last-child');
    if(loginTitle) loginTitle.innerText = t.headerTitle;
    
    const loginSubtitle = document.querySelector('.login-header p');
    if(loginSubtitle) loginSubtitle.innerText = t.headerSubtitle;

    // 3. Placeholders dos inputs (IDs corretas: user e pass)
    const userField = document.getElementById('user');
    const passField = document.getElementById('pass');
    if(userField) userField.placeholder = t.userInput;
    if(passField) passField.placeholder = t.passInput;

    // 4. Botão de Login
    const loginBtn = document.getElementById('btnLogin');
    if(loginBtn) loginBtn.innerHTML = `<i class="fas fa-sign-in-alt"></i> ${t.loginBtn}`;

    // 5. Rodapé
    const footerText = document.querySelector('.footer p');
    if(footerText) footerText.innerText = t.footer;

    // Gerenciar classes dos botões
    document.querySelectorAll('.lang-buttons button').forEach(btn => btn.classList.remove('active'));
    document.getElementById(lang).classList.add('active');
    
    localStorage.setItem('preferredLang', lang);
}

// Adicionar os eventos de clique
document.addEventListener('DOMContentLoaded', () => {
    const btnPt = document.getElementById('pt');
    const btnEn = document.getElementById('en');
    const btnEs = document.getElementById('es');

    if(btnPt) btnPt.onclick = () => applyTranslation('pt');
    if(btnEn) btnEn.onclick = () => applyTranslation('en');
    if(btnEs) btnEs.onclick = () => applyTranslation('es');

    // Carregar idioma salvo
    const saved = localStorage.getItem('preferredLang') || 'pt';
    applyTranslation(saved);
});