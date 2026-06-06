import { db2 } from './firebase1.js';
import { ref, get } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

// --- VARIÁVEIS DE CONTROLE ---
let atletaQueJogouDobrado = null; 
let dadosDoFirebase = {}; 

const sorteios = {
    s1: {
        fase: document.getElementById("seletor-fase5"),
        cat: document.getElementById("seletor-categoria9"),
        btn: document.getElementById("btn-sortear"),
        tabela: document.querySelector("#tabela-sorteio tbody")
    },
    s2: {
        fase: document.getElementById("seletor-fase6"),
        cat: document.getElementById("seletor-categoria8"),
        btn: document.getElementById("btn-sortear1"),
        tabela: document.querySelector("#tabela-sorteio1 tbody")
    },
    s3: {
        fase: document.getElementById("seletor-fase7"),
        cat: document.getElementById("seletor-categoria10"), // Use categoria10 no HTML para o 3º sorteio
        btn: document.getElementById("btn-sortear2"),
        tabela: document.querySelector("#tabela-sorteio2 tbody")
    }
};

const listaFases = ['selecione', 'classificatória', 'oitavas', 'quartas', 'semi-final', 'final'];

// Inicializa os seletores e eventos de carregamento
Object.values(sorteios).forEach(s => {
    if (!s.fase || !s.cat) return; // Proteção caso o elemento não exista

    listaFases.forEach(f => {
        const opt = document.createElement("option");
        opt.value = f;
        opt.textContent = f.charAt(0).toUpperCase() + f.slice(1);
        s.fase.appendChild(opt);
    });

    s.fase.addEventListener("change", async () => {
        const faseSel = s.fase.value;
        s.cat.innerHTML = '<option value="">Selecione a categoria</option>';
        if (!faseSel) return;

        try {
            const snap = await get(ref(db2, faseSel));
            if (snap.exists()) {
                dadosDoFirebase[faseSel] = snap.val();
                Object.keys(snap.val()).forEach(c => {
                    const opt = document.createElement("option");
                    opt.value = c;
                    opt.textContent = c;
                    s.cat.appendChild(opt);
                });
            }
        } catch (e) { console.error("Erro ao buscar categorias:", e); }
    });
});

// Função para embaralhar
const embaralhar = (arr) => arr.sort(() => Math.random() - 0.5);

// LÓGICA SORTEIO 1
sorteios.s1.btn.onclick = () => {
    const fase = sorteios.s1.fase.value;
    const cat = sorteios.s1.cat.value;
    if (!dadosDoFirebase[fase] || !dadosDoFirebase[fase][cat]) return alert("Selecione os dados do Sorteio 1!");

    let atletas = embaralhar(Object.values(dadosDoFirebase[fase][cat]));
    let pares = [];
    atletaQueJogouDobrado = null;

    for (let i = 0; i < atletas.length; i += 2) {
        if (atletas[i+1]) {
            pares.push([atletas[i], atletas[i+1]]);
        } else {
            pares.push([atletas[i], atletas[0]]); // Regra do ímpar
            atletaQueJogouDobrado = atletas[0].numero;
        }
    }
    renderizar(pares, sorteios.s1.tabela);
};

// LÓGICA SORTEIO 2 (Com regra de quem "descansa")
sorteios.s2.btn.onclick = () => {
    const fase = sorteios.s2.fase.value;
    const cat = sorteios.s2.cat.value;
    if (!dadosDoFirebase[fase] || !dadosDoFirebase[fase][cat]) return alert("Selecione os dados do Sorteio 2!");

    let atletas = Object.values(dadosDoFirebase[fase][cat]);
    if (atletaQueJogouDobrado) {
        atletas = atletas.filter(a => String(a.numero) !== String(atletaQueJogouDobrado));
    }
    
    atletas = embaralhar(atletas);
    let pares = [];
    for (let i = 0; i < atletas.length; i += 2) {
        pares.push([atletas[i], atletas[i+1] || atletas[0]]);
    }
    renderizar(pares, sorteios.s2.tabela);
};

// LÓGICA SORTEIO 3 (Independente)
sorteios.s3.btn.onclick = () => {
    const fase = sorteios.s3.fase.value;
    const cat = sorteios.s3.cat.value;
    if (!dadosDoFirebase[fase] || !dadosDoFirebase[fase][cat]) return alert("Selecione os dados do Sorteio 3!");

    let atletas = embaralhar(Object.values(dadosDoFirebase[fase][cat]));
    let pares = [];
    for (let i = 0; i < atletas.length; i += 2) {
        pares.push([atletas[i], atletas[i+1] || atletas[0]]);
    }
    renderizar(pares, sorteios.s3.tabela);
};

function renderizar(pares, body) {
    body.innerHTML = "";
    pares.forEach(p => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${p[0].numero} - ${p[0].nome}</td>
            <td><img src="${p[0].foto}" width="45" height="45" style="border-radius:50%; object-fit:cover;"></td>
            <td style="font-weight:bold; color:gold;"> VS </td>
            <td>${p[1].numero} - ${p[1].nome}</td>
            <td><img src="${p[1].foto}" width="45" height="45" style="border-radius:50%; object-fit:cover;"></td>
        `;
        body.appendChild(tr);
    });
}

// --- FUNÇÃO PDF COM ASSINATURA E CAMPO DE DATA ---
window.baixarPDF3 = function () {
  const { jsPDF } = window.jspdf || {};
  if (!jsPDF) {
    alert('Erro: Biblioteca jsPDF não encontrada.');
    return;
  }

  const doc = new jsPDF({ orientation: 'p', unit: 'pt', format: 'a4' });
  const agora = new Date();
  const dataStr = agora.toLocaleDateString('pt-BR');
  const horaStr = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  // Configuração padrão das tabelas
  const configurarEstilo = (htmlId) => ({
    html: htmlId,
    theme: 'grid',
    styles: { 
      halign: 'center', 
      valign: 'middle', 
      fontSize: 10,
      minCellHeight: 25 // Aumenta o espaço para escrita manual da nota
    },
    headStyles: { fillColor: [184, 134, 11], textColor: 255 }, 
    didParseCell: function (data) {
      // Muda cabeçalho para "Nota"
      if (data.section === 'head' && (data.column.index === 1 || data.column.index === 4)) {
        data.cell.text = ['Nota'];
      }
      // Deixa o corpo em branco para as notas
      if (data.section === 'body' && (data.column.index === 1 || data.column.index === 4)) {
        data.cell.text = ['']; 
      }
    }
  });

  // --- JOGO 1 ---
  doc.setFontSize(14);
  doc.text('Resultado do Sorteio - Jogo 1', 40, 40);
  doc.setFontSize(10);
  const f1 = document.getElementById("seletor-fase5")?.value || "N/A";
  const c1 = document.getElementById("seletor-categoria9")?.value || "N/A";
  doc.text(`Fase: ${f1} | Categoria: ${c1}`, 40, 60);
  
  doc.autoTable({ ...configurarEstilo('#tabela-sorteio'), startY: 80 });

  // --- JOGO 2 ---
  let finalY = doc.lastAutoTable.finalY + 40;
  doc.setFontSize(14);
  doc.text('Resultado do Sorteio - Jogo 2', 40, finalY);
  doc.setFontSize(10);
  const f2 = document.getElementById("seletor-fase6")?.value || "N/A";
  const c2 = document.getElementById("seletor-categoria8")?.value || "N/A";
  doc.text(`Fase: ${f2} | Categoria: ${c2}`, 40, finalY + 20);

  doc.autoTable({ ...configurarEstilo('#tabela-sorteio1'), startY: finalY + 30 });

  // --- JOGO 3 ---
  finalY = doc.lastAutoTable.finalY + 40;
  if (finalY > 700) { doc.addPage(); finalY = 40; }

  doc.setFontSize(14);
  doc.text('Resultado do Sorteio - Jogo 3', 40, finalY);
  doc.setFontSize(10);
  const f3 = document.getElementById("seletor-fase7")?.value || "N/A";
  const c3 = document.getElementById("seletor-categoria10")?.value || "N/A";
  doc.text(`Fase: ${f3} | Categoria: ${c3}`, 40, finalY + 20);

  doc.autoTable({ ...configurarEstilo('#tabela-sorteio2'), startY: finalY + 30 });

  // --- BLOCO DE ASSINATURA E DATA ---
  finalY = doc.lastAutoTable.finalY + 60;
  if (finalY > 750) { doc.addPage(); finalY = 60; }

  doc.setDrawColor(0);
  doc.setLineWidth(1);
  
  // Linha da Data
   
  doc.setFontSize(10);
  doc.text('Data: ____/____/______', 40, finalY + 15);

  // Linha da Assinatura do Árbitro
  doc.line(350, finalY, 550, finalY);
  doc.text('Assinatura do Árbitro', 390, finalY + 15);

  // Rodapé (Paginação)
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    const h = doc.internal.pageSize.getHeight();
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(`Sistema de Competição de Capoeira - Gerado em ${dataStr} às ${horaStr}`, 40, h - 20);
    doc.text(`Página ${i} de ${pageCount}`, 520, h - 20);
  }

  // Nome do arquivo (Fase 1 e Categoria 1)
  const dataArquivo = dataStr.replace(/\//g, '-');
  doc.save(`resultado_sorteio_${f1}_${c1}_${dataArquivo}.pdf`);
};

// --- FUNÇÃO IMPRIMIR APENAS A DIV DE SORTEIO ---
// --- FUNÇÃO IMPRIMIR COM FASE, CATEGORIA E ESPAÇO PARA NOTAS ---
window.imprimir = function () {
    const conteudoOriginal = document.getElementById('sorteio');
    
    if (!conteudoOriginal) {
        alert('Erro: Área de sorteio não encontrada.');
        return;
    }

    // Captura os valores atuais dos seletores para exibir na impressão
    const info1 = `Fase: ${document.getElementById("seletor-fase5")?.value || "N/A"} | Categoria: ${document.getElementById("seletor-categoria9")?.value || "N/A"}`;
    const info2 = `Fase: ${document.getElementById("seletor-fase6")?.value || "N/A"} | Categoria: ${document.getElementById("seletor-categoria8")?.value || "N/A"}`;
    const info3 = `Fase: ${document.getElementById("seletor-fase7")?.value || "N/A"} | Categoria: ${document.getElementById("seletor-categoria10")?.value || "N/A"}`;

    const cloneSorteio = conteudoOriginal.cloneNode(true);
    const grupos = cloneSorteio.querySelectorAll('.grupo-sorteio');

    // Inserir as informações de Fase/Categoria acima de cada tabela no clone
    const infos = [info1, info2, info3];
    grupos.forEach((grupo, i) => {
        const spanInfo = document.createElement('div');
        spanInfo.style.textAlign = 'center';
        spanInfo.style.fontWeight = 'bold';
        spanInfo.style.marginBottom = '10px';
        spanInfo.innerText = infos[i];
        
        // Insere antes da tabela
        const tabela = grupo.querySelector('table');
        if (tabela) {
            grupo.insertBefore(spanInfo, tabela);

            // Ajustar Cabeçalho: Foto -> Nota
            const ths = tabela.querySelectorAll('thead th');
            ths.forEach((th, idx) => {
                if (idx === 1 || idx === 4) th.innerText = 'Nota';
            });

            // Limpar Fotos para deixar em branco
            const trs = tabela.querySelectorAll('tbody tr');
            trs.forEach(tr => {
                const tds = tr.querySelectorAll('td');
                tds.forEach((td, idx) => {
                    if (idx === 1 || idx === 4) td.innerHTML = ''; 
                });
            });
        }
    });

    const janelaImpressao = window.open('', '', 'width=900,height=700');
    janelaImpressao.document.write('<html><head><title>Sorteio Oficial - Capoeira</title>');
    janelaImpressao.document.write(`
        <style>
            body { font-family: Arial, sans-serif; padding: 30px; background: #fff; color: #000; }
            h2, h3 { text-align: center; text-transform: uppercase; margin-top: 20px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            th, td { border: 1px solid #000; padding: 8px; text-align: center; font-size: 11pt; }
            th { background-color: #f2f2f2 !important; -webkit-print-color-adjust: exact; }
            button, select, label { display: none !important; }
            .rodape-assinatura { margin-top: 50px; display: flex; justify-content: space-between; align-items: flex-end; }
            .linha { border-top: 1px solid #000; width: 220px; text-align: center; padding-top: 5px; }
        </style>
    `);
    
    janelaImpressao.document.write('</head><body>');
    janelaImpressao.document.write(cloneSorteio.innerHTML);
    janelaImpressao.document.write(`
        <div class="rodape-assinatura">
            <div>Data: ____/____/______</div>
            <div class="linha">Assinatura do Árbitro</div>
        </div>
    `);
    janelaImpressao.document.write('</body></html>');
    janelaImpressao.document.close();
    
    setTimeout(() => {
        janelaImpressao.print();
        janelaImpressao.close();
    }, 500);
};