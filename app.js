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
  window.print();
}

// Abrir histórico
function abrirHistorico() {
  const nomeBusca = prompt("Digite parte do nome para buscar no histórico:");
  if (!nomeBusca) return;

  const tx = db.transaction(["fichas"], "readonly");
  const store = tx.objectStore("fichas");

  const request = store.getAll();
  request.onsuccess = () => {
    const resultados = request.result.filter(ficha =>
      ficha.nome.toLowerCase().includes(nomeBusca.toLowerCase())
    );

    if (resultados.length === 0) {
      alert("Nenhuma ficha encontrada com esse nome.");
    } else {
      let texto = "Resultados encontrados:\n\n";
      resultados.forEach(ficha => {
        texto += `ID: ${ficha.id}\nNome: ${ficha.nome}\nIdade: ${ficha.idade}\nEstado Civil: ${ficha.estadoCivil}\n---\n`;
      });
      alert(texto);
    }
  };
}

