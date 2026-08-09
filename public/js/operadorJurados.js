import { db4 } from "./firebase.js";
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

// Array com todos os botões de fase para facilitar o gerenciamento
const botoesFase = [btnClassificatoria, btnOitavas, btnQuartas, btnSemifinal, btnFinal];

let dadosAtletas = {}; // 🔹 Agora sim! Armazena info completa, inclusive foto

// 🔄 Variável para controlar o modo atual
let modoAtual = "avaliacoes"; // ou "fase"
let dadosFaseAtual = {}; // 🔹 Armazena todos os dados da fase atual

// 🎯 Função para atualizar botões ativos e indicador de fase
function atualizarFaseAtiva(faseNome, botaoAtivo) {
    // Remove classe active de todos os botões
    botoesFase.forEach(btn => {
        if (btn) btn.classList.remove('active');
    });
    
    // Adiciona classe active ao botão clicado
    if (botaoAtivo) {
        botaoAtivo.classList.add('active');
    }
    
    // Atualiza o indicador de fase
    if (faseAtualNome) {
        faseAtualNome.textContent = faseNome;
    }
}

// 🔁 Função para carregar dados do enviosParaOperador
function carregarEnviosParaOperador() {
  modoAtual = "classificatória";
  atualizarFaseAtiva("classificatória", btnClassificatoria);
  
  onValue(ref(db4, "classificatória"), snap => {
    categoriaSelect.innerHTML = "<option value=''>Selecione</option>";
    atletaSelect.innerHTML = "<option value=''>Selecione</option>";
    dadosAtletas = {};

    if (snap.exists()) {
      const data = snap.val();
      const categorias = Object.keys(data);

      categorias.forEach(categoria => {
        const opt = document.createElement("option");
        opt.value = categoria;
        opt.textContent = categoria;
        categoriaSelect.appendChild(opt);
      });
    }
  });
}

categoriaSelect.addEventListener("change", () => {
  const categoria = categoriaSelect.value;
  atletaSelect.innerHTML = "<option value=''>Selecione</option>"; // Limpa as opções anteriores
  
  if (!categoria) return; // Se não houver categoria selecionada, nada acontece

  dadosAtletas = {}; // Resetar os dados dos atletas ao trocar a categoria

  if (modoAtual === "fases") {
    // 🔹 Carrega atletas da fase classificatória
    const categoriaRef = ref(db4, `fases/${categoria}`);
    
    onValue(categoriaRef, snap => {
      atletaSelect.innerHTML = "<option value=''>Selecione</option>";

      if (snap.exists()) {
        const atletasObj = snap.val();
        for (const id in atletasObj) {
          const atleta = atletasObj[id];
          if (atleta.nome) {
            dadosAtletas[atleta.nome] = {
              id,
              nome: atleta.nome,
              categoria: atleta.categoria || categoria,
              foto: atleta.foto || "",
              numero: atleta.numero || ""
            };

            const opt = document.createElement("option");
            opt.value = atleta.nome;
            opt.textContent = `${atleta.numero || ""} - ${atleta.nome}`;
            atletaSelect.appendChild(opt);
          }
        }
      }
    }, { onlyOnce: true });

  } else {
    // 🔹 Carrega atletas de fases eliminatórias (oitavas, quartas, semifinal, final)
    const categoriaRef = ref(db4, `${modoAtual}/${categoria}`);

    onValue(categoriaRef, snap => {
      atletaSelect.innerHTML = "<option value=''>Selecione</option>";

      if (snap.exists()) {
        const atletasObj = snap.val();
        for (const id in atletasObj) {
          const atleta = atletasObj[id];
          if (atleta && atleta.nome) {
            dadosAtletas[atleta.nome] = {
              id,
              nome: atleta.nome,
              categoria: atleta.categoria || categoria,
              foto: atleta.foto || "",
              numero: atleta.numero || ""
            };

            const opt = document.createElement("option");
            opt.value = atleta.nome;
            opt.textContent = `${atleta.numero || ""} - ${atleta.nome}`;
            atletaSelect.appendChild(opt);
          }
        }
      }
    }, { onlyOnce: true });
  }
});


// 📌 Função para carregar dados de uma fase específica
function carregarDadosDaFase(caminho) {
    modoAtual = "fase";
    console.log(`🔍 Carregando dados da fase: ${caminho}`);
    
    const faseRef = ref(db4, caminho);

    onValue(faseRef, snapshot => {
        const dados = snapshot.val();
        console.log(`📊 Dados recebidos de ${caminho}:`, dados);

        // Limpar selects
        atletaSelect.innerHTML = '<option value="">Selecione um Atleta</option>';
        categoriaSelect.innerHTML = '<option value="">Selecione uma Categoria</option>';
        dadosAtletas = {}; // Resetar dados
        dadosFaseAtual = {}; // Resetar dados da fase

        if (!dados) {
            console.log(`⚠️ Nenhum dado encontrado em ${caminho}`);
            return;
        }

        // Salvar todos os dados da fase
        dadosFaseAtual = dados;
        
        // Coletar todas as categorias únicas
        const categoriasSet = new Set();

        for (const id in dados) {
            const entry = dados[id];
            console.log(`🔍 Processando entrada ${id}:`, entry);
            
            if (!entry || !entry.categoria) {
                console.log(`⚠️ Entrada sem categoria ${id}:`, entry);
                continue;
            }

            // Adicionar categoria ao set (evita duplicatas)
            categoriasSet.add(entry.categoria);
        }

        // Adicionar categorias ao select
        categoriasSet.forEach(categoria => {
            const optCategoria = document.createElement("option");
            optCategoria.value = categoria;
            optCategoria.textContent = categoria;
            categoriaSelect.appendChild(optCategoria);
        });
        
        console.log(`✅ Carregadas ${categoriasSet.size} categorias: ${Array.from(categoriasSet).join(', ')}`);
        console.log(`📋 Agora selecione uma categoria para ver os atletas`);
    });
}

// 🚀 Inicializar com dados do enviosParaOperador
carregarEnviosParaOperador();

// Evento do botão Classificatória
btnClassificatoria.addEventListener("click", () => {
    console.log("🔘 Botão classificatória clicado");
    atualizarFaseAtiva("classificatória", btnClassificatoria);
    carregarDadosDaFase("classificatória");
    carregarEnviosParaOperador();
});

// Eventos dos botões
btnOitavas.addEventListener("click", () => {
    console.log("🔘 Botão Oitavas clicado");
    atualizarFaseAtiva("oitavas", btnOitavas);
    carregarDadosDaFase("oitavas");
    carregarEnviosParaOperador1();
});

btnQuartas.addEventListener("click", () => {
    console.log("🔘 Botão Quartas clicado");
    atualizarFaseAtiva("quartas", btnQuartas);
    carregarDadosDaFase("quartas");
    carregarEnviosParaOperador2();
});

btnSemifinal.addEventListener("click", () => {
    console.log("🔘 Botão Semifinal clicado");
    atualizarFaseAtiva("semi-final", btnSemifinal);
    carregarDadosDaFase("semifinal");
    carregarEnviosParaOperador3();
});

btnFinal.addEventListener("click", () => {
    console.log("🔘 Botão Final clicado");
    atualizarFaseAtiva("final", btnFinal);
    carregarDadosDaFase("final");
    carregarEnviosParaOperador4();
});

// Função para marcar o checkbox visualmente
function marcarCheckbox(nomeAtleta, ritmo) {
    const ritmoLimpo = ritmo.replace("º", "").replace(/\s+/g, "").toLowerCase();
    const checkboxes = document.querySelectorAll(`input[type="checkbox"]`);

    checkboxes.forEach(checkbox => {
        const atletaVal = checkbox.value;
        const ritmoVal = checkbox.getAttribute("data-ritmo");

        if (atletaVal === nomeAtleta && (ritmoVal === ritmo || ritmoVal === ritmoLimpo)) {
            checkbox.checked = true;
            if (checkbox.parentElement) {
                checkbox.parentElement.classList.add("visto-azul");
            }
        }
    });
}

// Ouvinte que monitora as pastas de jogos
function monitorarJogosRealtime() {
    const categoria = categoriaSelect.value;
    const fase = faseAtualNome.textContent;
    const ritmoOriginal = ritmoSelect.value; // Ex: "1º Jogo"
    const ritmoLimpo = ritmoOriginal.replace("º", "").replace(/\s+/g, "").toLowerCase(); // Ex: "1jogo"

    if (!categoria || !fase || !ritmoOriginal) return;

    // Monitora a pasta do Botão 1 (Ex: jogos/oitavas/Mirim/1º Jogo)
    onValue(ref(db4, `jogos/${fase}/${categoria}/${ritmoOriginal}`), (snapshot) => {
        if (snapshot.exists()) {
            const dados = snapshot.val();
            Object.keys(dados).forEach(nome => marcarCheckbox(nome, ritmoOriginal));
        }
    });

    // Monitora a pasta do Botão 2 (Ex: jogos/oitavas/Mirim/1jogo)
    onValue(ref(db4, `jogos/${fase}/${categoria}/${ritmoLimpo}`), (snapshot) => {
        if (snapshot.exists()) {
            const dados = snapshot.val();
            // No Botão 2 usamos push, então o nome está dentro do objeto
            Object.values(dados).forEach(obj => {
                if (obj.nome) marcarCheckbox(obj.nome, ritmoLimpo);
            });
        }
    });
}

// Ativa a vigilância sempre que mudar a categoria ou o ritmo
categoriaSelect.addEventListener("change", monitorarJogosRealtime);
ritmoSelect.addEventListener("change", monitorarJogosRealtime);


// Função para enviar dados para os dois jogos
async function enviarParaJurados(jurados) {
    const atletasSelecionados = Array.from(atletaSelect.selectedOptions).map(opt => opt.value);
    const categoria = categoriaSelect.value;
    const ritmo = ritmoSelect.value;
    const faseSelecionada = faseAtualNome.textContent;
    const timestamp = new Date().getTime(); // Timestamps para registros

    // Verifica se todos os campos necessários estão preenchidos
    if (!atletasSelecionados.length || !categoria || !ritmo || !faseSelecionada) {
        alert("⚠️ Selecione um atleta, uma categoria, o ritmo e a fase.");
        return;
    }

    const atletasEnviadosComSucesso = [];

    // ➡️ MUDANÇA CRÍTICA: Usa FOR...OF para permitir o 'await' no loop
    for (const atletaComNumero of atletasSelecionados) {
        const partes = atletaComNumero.split(' - ');
        const nomeAtleta = partes.length > 1 ? partes[1].trim() : atletaComNumero.trim();
        const info = dadosAtletas[nomeAtleta]; 
        
        if (!info) {
            console.warn(`⚠️ Dados do atleta "${nomeAtleta}" não encontrados.`);
            continue; 
        }

        const caminhoVerificacao = `jogos/${faseSelecionada}/${categoria}/${ritmo}/${nomeAtleta}`;

        try {
            const snapshot = await get(ref(db4, caminhoVerificacao));
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

            const dados = {
                nome: info.nome,
                categoria: info.categoria,
                ritmo: ritmo,
                foto: info.foto || "",
                numero: info.numero || "",
                fase: faseSelecionada,
                timestamp: timestamp
            };

            const promessasEnvio = [];

            // Envia para os jurados (conforme o botão pressionado)
            jurados.forEach(({ raiz, nome }) => {
                const caminhoJurado = `${raiz}/${faseSelecionada}/${ritmo}/${nome}`;
                const promessa = push(ref(db4, caminhoJurado), dados)
                    .then(() => {
                        console.log(`✅ Enviado para ${caminhoJurado}`);
                    })
                    .catch(err => {
                        console.error(`❌ Erro ao enviar para ${caminhoJurado}:`, err);
                        throw err;
                    });
                promessasEnvio.push(promessa);
            });

            await Promise.all(promessasEnvio);
            
            // Agora vamos garantir que os dados sejam salvos no caminho correto dos dois jogos (1jogo e 1º Jogo)
            const jogos = ["1jogo", "1º Jogo"];
            for (const jogo of jogos) {
                const caminhoJogo = `jogos/${faseSelecionada}/${categoria}/${jogo}/${nomeAtleta}`;

                if (jogo === "1jogo") {
                    // Em 1jogo, os dados devem ser salvos dentro de uma chave gerada automaticamente (ID)
                    const refJogo = push(ref(db4, caminhoJogo)); // Gera um ID único
                    await set(refJogo, dados); // Salva os dados com o ID gerado
                    console.log(`✅ Enviado para o caminho ${caminhoJogo} (com ID único)`);
                } else {
                    // Em 1º Jogo, os dados são salvos diretamente, sem a necessidade de ID
                    await set(ref(db4, caminhoJogo), dados);
                    console.log(`✅ Enviado para o caminho ${caminhoJogo} (sem ID)`);
                }
            }

            await set(ref(db4, caminhoVerificacao), {
                nome: info.nome,
                enviadoEm: new Date().toISOString(),
                categoria: info.categoria
            });

            atletasEnviadosComSucesso.push(nomeAtleta);

        } catch (err) {
            console.error(`❌ Erro no processamento/envio do atleta ${nomeAtleta}:`, err);
        }
    } 

    if (atletasEnviadosComSucesso.length > 0) {
        alert("✅ Dados enviados para os jurados!");

        // Após o envio, atualiza as checkboxes dependendo do ritmo
        atualizarCheckboxes(atletasSelecionados, ritmo); // Marca as checkboxes de acordo com o ritmo enviado
    } else {
        alert("⚠️ Nenhum atleta foi enviado. Verifique os logs do console para mais detalhes.");
    }

    // Limpar selects após envio
    //...
}

// Função para o evento do botão btnEnviar (jurados A, B, C)
btnEnviar.addEventListener("click", () => {
    const jurados = [
        { raiz: "avaliacaodejuradoA", nome: "juradoA" },
        { raiz: "avaliacaodejuradoB", nome: "juradoB" },
        { raiz: "avaliacaodejuradoC", nome: "juradoC" }
    ];
    enviarParaJurados(jurados);
});

// Função para o evento do botão btnEnviar2 (jurados D, E, F)
btnEnviar2.addEventListener("click", () => {
    const jurados = [
        { raiz: "avaliacaodejuradoD", nome: "juradoD" },
        { raiz: "avaliacaodejuradoE", nome: "juradoE" },
        { raiz: "avaliacaodejuradoF", nome: "juradoF" }
    ];
    enviarParaJurados(jurados);
});

// 🔁 Função para carregar dados do enviosParaOperador
function carregarEnviosParaOperador1() {
  modoAtual = "oitavas";
  atualizarFaseAtiva("oitavas", btnOitavas);
  
  onValue(ref(db4, "oitavas"), snap => {
    categoriaSelect.innerHTML = "<option value=''>Selecione</option>";
    atletaSelect.innerHTML = "<option value=''>Selecione</option>";
    dadosAtletas = {};

    if (snap.exists()) {
      const data = snap.val();
      const categorias = Object.keys(data);

      categorias.forEach(categoria => {
        const opt = document.createElement("option");
        opt.value = categoria;
        opt.textContent = categoria;
        categoriaSelect.appendChild(opt);
      });
    }
  });
}

// 🔁 Função para carregar dados do enviosParaOperador
function carregarEnviosParaOperador2() {
  modoAtual = "quartas";
  atualizarFaseAtiva("quartas", btnQuartas);
  
  onValue(ref(db4, "quartas"), snap => {
    categoriaSelect.innerHTML = "<option value=''>Selecione</option>";
    atletaSelect.innerHTML = "<option value=''>Selecione</option>";
    dadosAtletas = {};

    if (snap.exists()) {
      const data = snap.val();
      const categorias = Object.keys(data);

      categorias.forEach(categoria => {
        const opt = document.createElement("option");
        opt.value = categoria;
        opt.textContent = categoria;
        categoriaSelect.appendChild(opt);
      });
    }
  });
}

// 🔁 Função para carregar dados do enviosParaOperador
function carregarEnviosParaOperador3() {
  modoAtual = "semi-final";
  atualizarFaseAtiva("semi-final", btnSemifinal);
  
  onValue(ref(db4, "semi-final"), snap => {
    categoriaSelect.innerHTML = "<option value=''>Selecione</option>";
    atletaSelect.innerHTML = "<option value=''>Selecione</option>";
    dadosAtletas = {};

    if (snap.exists()) {
      const data = snap.val();
      const categorias = Object.keys(data);

      categorias.forEach(categoria => {
        const opt = document.createElement("option");
        opt.value = categoria;
        opt.textContent = categoria;
        categoriaSelect.appendChild(opt);
      });
    }
  });
}

// 🔁 Função para carregar dados do enviosParaOperador
function carregarEnviosParaOperador4() {
  modoAtual = "final";
  atualizarFaseAtiva("final", btnFinal);
  
  onValue(ref(db4, "final"), snap => {
    categoriaSelect.innerHTML = "<option value=''>Selecione</option>";
    atletaSelect.innerHTML = "<option value=''>Selecione</option>";
    dadosAtletas = {};

    if (snap.exists()) {
      const data = snap.val();
      const categorias = Object.keys(data);

      categorias.forEach(categoria => {
        const opt = document.createElement("option");
        opt.value = categoria;
        opt.textContent = categoria;
        categoriaSelect.appendChild(opt);
      });
    }
  });
}

//
//

// 📌 Botão que você quer usar
const btnTrocarRoda = document.getElementById("trocar-roda");
const seletorRodaDiv = document.getElementById("seletor-roda");

// 🎯 Faz o menu aparecer e desaparecer ao clicar no botão
if (btnTrocarRoda && seletorRodaDiv) {
    btnTrocarRoda.onclick = () => {
        if (seletorRodaDiv.style.display === "none" || seletorRodaDiv.style.display === "") {
            seletorRodaDiv.style.display = "block";
        } else {
            seletorRodaDiv.style.display = "none";
        }
    };
}
