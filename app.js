// Inicializa o banco IndexedDB
let db;
const request = indexedDB.open("fichasCCB", 1);

request.onupgradeneeded = function (event) {
  db = event.target.result;
  const store = db.createObjectStore("fichas", { keyPath: "id", autoIncrement: true });
  store.createIndex("nome", "nome", { unique: false });
};

request.onsuccess = function (event) {
  db = event.target.result;
};

request.onerror = function (event) {
  alert("Erro ao abrir banco de dados: " + event.target.errorCode);
};

// Captura o formulário
const form = document.getElementById("fichaForm");

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const data = Object.fromEntries(new FormData(form));

  const tx = db.transaction(["fichas"], "readwrite");
  const store = tx.objectStore("fichas");
  store.add(data);

  alert("Ficha salva com sucesso!");
  form.reset();
});

// Imprimir ficha
function imprimirFicha() {
  const data = Object.fromEntries(new FormData(form));

  // Preenche área de impressão
  document.getElementById("pNome").innerText = data.nome;
  document.getElementById("pIdade").innerText = data.idade;
  document.getElementById("pEstadoCivil").innerText = data.estadoCivil;
  document.getElementById("pTempoBatizado").innerText = data.tempoBatizado;
  document.getElementById("pInvalidez").innerText = data.invalidez;
  document.getElementById("pComum").innerText = data.comum;
  document.getElementById("pCargoAtual").innerText = data.cargoAtual;
  document.getElementById("pConjugeCargo").innerText = data.conjugeCargo;
  document.getElementById("pAnciao").innerText = data.anciao;
  document.getElementById("pDiacono").innerText = data.diacono;
  document.getElementById("pCooperador").innerText = data.cooperador;
  document.getElementById("pAdministracao").innerText = data.administracao;
  document.getElementById("pDataConsideracao").innerText = data.dataConsideracao;

  // Exibe somente a área de impressão
  const printContents = document.getElementById("printArea").innerHTML;
  const originalContents = document.body.innerHTML;

  document.body.innerHTML = printContents;
  window.print();
  document.body.innerHTML = originalContents;
  location.reload(); // recarrega o app após impressão
}


// Abrir histórico
function abrirHistorico() {
  const nomeBusca = prompt("Digite parte do nome para buscar:");
  if (!nomeBusca) return;

  const tx = db.transaction(["fichas"], "readonly");
  const store = tx.objectStore("fichas");

  store.getAll().onsuccess = function (e) {
    const todas = e.target.result;
    const filtradas = todas.filter(f => f.nome.toLowerCase().includes(nomeBusca.toLowerCase()));

    if (filtradas.length === 0) {
      alert("Nenhuma ficha encontrada.");
      return;
    }

    let menu = "Fichas encontradas:\n\n";
    filtradas.forEach((ficha, i) => {
      menu += `${i + 1}. ID: ${ficha.id}, Nome: ${ficha.nome}, Idade: ${ficha.idade}\n`;
    });

    const escolha = prompt(menu + "\nDigite o número da ficha para imprimir:");
    const index = parseInt(escolha) - 1;

    if (!filtradas[index]) {
      alert("Opção inválida.");
      return;
    }

    preencherFichaParaImpressao(filtradas[index]);
    setTimeout(() => imprimirFicha(), 300);
  };
}

function preencherFichaParaImpressao(data) {
  document.getElementById("pNome").innerText = data.nome;
  document.getElementById("pIdade").innerText = data.idade;
  document.getElementById("pEstadoCivil").innerText = data.estadoCivil;
  document.getElementById("pTempoBatizado").innerText = data.tempoBatizado;
  document.getElementById("pInvalidez").innerText = data.invalidez;
  document.getElementById("pComum").innerText = data.comum;
  document.getElementById("pCargoAtual").innerText = data.cargoAtual;
  document.getElementById("pConjugeCargo").innerText = data.conjugeCargo;
  document.getElementById("pAnciao").innerText = data.anciao;
  document.getElementById("pDiacono").innerText = data.diacono;
  document.getElementById("pCooperador").innerText = data.cooperador;
  document.getElementById("pAdministracao").innerText = data.administracao;
  document.getElementById("pDataConsideracao").innerText = data.dataConsideracao;
}

