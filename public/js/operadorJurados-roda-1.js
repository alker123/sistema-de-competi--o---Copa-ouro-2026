import { db4 as db } from "./firebase.js";
import { ref, onValue, push, get, set } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";


// 📌 Elementos HTML
const atletaSelect = document.getElementById("atleta-selection");
const categoriaSelect = document.getElementById("categoria-selection");
const ritmoSelect = document.getElementById("ritmo-selection");
const btnEnviar = document.getElementById("enviar-jurados");
const btnEnviar2 = document.getElementById("enviar-jurados-2");
const faseAtualNome = document.getElementById("fase-atual-nome");
const roda1 = document.getElementById("roda1");
const roda2 = document.getElementById("roda2");

// Botões das fases com IDs únicos
const btnClassificatoria = document.getElementById("btn-classificatoria");
const btnOitavas = document.getElementById("btn-oitavas");
const btnQuartas = document.getElementById("btn-quartas");
const btnSemifinal = document.getElementById("btn-semifinal");
const btnFinal = document.getElementById("btn-final");

// Enviar para Jurados
btnEnviar.addEventListener("click", async () => { // ⬅️ OBRIGATÓRIO: AGORA É ASYNC

    // Obtém os atletas selecionados, categoria, ritmo e fase
    const atletasSelecionados = Array.from(atletaSelect.selectedOptions).map(opt => opt.value);
    const categoria = categoriaSelect.value;
    const ritmo = ritmoSelect.value;
    const faseSelecionada = faseAtualNome.textContent;

    // 1. Verifica se todos os campos necessários estão preenchidos
    if (!atletasSelecionados.length || !categoria || !ritmo || !faseSelecionada) {
        alert("⚠️ Selecione um atleta, uma categoria, o ritmo e a fase.");
        return;
    }

    // Definindo os jurados e seus caminhos
    const jurados = [
        { raiz: "avaliacaodejuradoA", nome: "juradoA" },
        { raiz: "avaliacaodejuradoB", nome: "juradoB" },
        { raiz: "avaliacaodejuradoC", nome: "juradoC" }
    ];

    const atletasEnviadosComSucesso = [];

    // ➡️ MUDANÇA CRÍTICA: USA FOR...OF para permitir o 'await'
    for (const atletaComNumero of atletasSelecionados) {
        
        // Ajuste de Nome (Ex: "1 - sanzão" -> "sanzão")
        const partes = atletaComNumero.split(' - ');
        // Seu código carrega os dados em `dadosAtletas[nome]` onde `nome` é o atleta.nome
        // O valor do select é o atleta.nome. Vamos usar o atleta.nome diretamente para ser consistente.
        const nomeAtleta = partes.length > 1 ? partes[1].trim() : atletaComNumero.trim();

        const info = dadosAtletas[nomeAtleta]; // Usa a chave correta
        
        if (!info) {
            console.warn(`⚠️ Dados do atleta "${nomeAtleta}" não encontrados. A chave usada foi: ${nomeAtleta}`);
            continue; 
        }

        // Caminho de VERIFICAÇÃO/RASTREAMENTO: jogos/fase/categoria/ritmo/atleta
        const caminhoVerificacao = `jogos/${faseSelecionada}/${categoria}/${ritmo}/${nomeAtleta}`;

        try {
            // ===============================================
            // 🔍 1. VERIFICAÇÃO NO CAMINHO "jogos"
            // ===============================================
            const snapshot = await get(ref(db, caminhoVerificacao));
            let deveEnviar = true;
            
            if (snapshot.exists()) {
                const confirmacao = confirm(
                    `⚠️ O atleta ${nomeAtleta} já foi cadastrado no jogo "${ritmo}" da fase "${faseSelecionada}". Deseja **reenviar** para os jurados?`
                );

                if (!confirmacao) {
                    console.log(`❌ Reenvio cancelado para o atleta ${nomeAtleta}`);
                    deveEnviar = false;
                }
            }
            
            if (!deveEnviar) {
                continue; 
            }

            // Monta os dados
            const dados = {
                nome: info.nome,
                categoria: info.categoria,
                ritmo: ritmo,
                foto: info.foto || "",
                numero: info.numero || "",
                fase: faseSelecionada
            };
            
            const promessasEnvio = [];
            
            // ===============================================
            // 💾 2. SALVAMENTO NOS CAMINHOS DOS JURADOS
            // ===============================================
            jurados.forEach(({ raiz, nome }) => {
                // Caminho dos Jurados: avaliacaodejuradoX/fase/ritmo/nome
                const caminhoJurado = `${raiz}/${faseSelecionada}/${ritmo}/${nome}`;

                // SEU CÓDIGO ORIGINAL DE SALVAMENTO: push(ref(db, caminho), dados)
                const promessa = push(ref(db, caminhoJurado), dados)
                    .then(() => {
                        console.log(`✅ Enviado para ${caminhoJurado}`);
                    })
                    .catch(err => {
                        console.error(`❌ Erro ao enviar para ${caminhoJurado}:`, err);
                        throw err; // Lança o erro para que Promise.all falhe
                    });
                promessasEnvio.push(promessa);
            });

            // Espera que todos os envios para os jurados terminem
            await Promise.all(promessasEnvio);
            
            // ===============================================
            // 📝 3. CRIA O REGISTRO DE ENVIO EM "jogos"
            // ===============================================
            // Usa 'set' para criar o registro no caminho de verificação
            await set(ref(db, caminhoVerificacao), {
                nome: info.nome,
                enviadoEm: new Date().toISOString(),
                categoria: info.categoria
            });
            
            atletasEnviadosComSucesso.push(nomeAtleta);

        } catch (err) {
            console.error(`❌ Erro no processamento/envio do atleta ${nomeAtleta}:`, err);
        }

    } // Fim do for...of

    // Feedback final
    if (atletasEnviadosComSucesso.length > 0) {
        alert("✅ Dados enviados para os jurados!");
    } else {
        // Se esta mensagem aparecer, algo no loop ou nas permissões falhou
        alert("⚠️ Nenhum atleta foi enviado. Verifique os logs do console para mais detalhes.");
    }

    // Limpar selects após envio
    //...
});