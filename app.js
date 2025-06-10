// IndexedDB Setup

let db;
const request = indexedDB.open("fichasCCB", 1);
let fichaEditando = null; // Armazena o ID da ficha sendo editada

request.onupgradeneeded = function (e) {
  db = e.target.result;
  const store = db.createObjectStore("fichas", { keyPath: "id", autoIncrement: true });
  store.createIndex("nome", "nome", { unique: false });
};

request.onsuccess = function (e) {
  db = e.target.result;
  carregarURL();
};

request.onerror = function (e) {
  alert("Erro ao abrir o banco de dados");
};

// Salvar Ficha
document.getElementById("fichaForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target));
  const tx = db.transaction("fichas", "readwrite");
  tx.objectStore("fichas").add(data);
  alert("Ficha salva com sucesso!");
  e.target.reset();
});

// Histórico Visual
function abrirHistorico() {
  const container = document.getElementById("historico");
  container.innerHTML = "<h3>Histórico de Fichas</h3>";

  const tx = db.transaction("fichas", "readonly");
  const store = tx.objectStore("fichas");
  const req = store.getAll();

  req.onsuccess = function () {
    const dados = req.result;
    if (dados.length === 0) {
      container.innerHTML += "<p>Nenhuma ficha salva ainda.</p>";
      return;
    }

    const table = document.createElement("table");
    table.border = 1;
    table.style.width = "100%";
    table.innerHTML = `
      <tr><th>ID</th><th>Nome</th><th>Idade</th><th>Ações</th></tr>
    `;

    dados.forEach(ficha => {
      const linha = document.createElement("tr");
      linha.innerHTML = `
        <td>${ficha.id}</td>
        <td>${ficha.nome}</td>
        <td>${ficha.idade}</td>
        <td>
          <td>
          <button onclick="imprimirFicha(${ficha.id})">🖨️ Imprimir</button>
          <button onclick="editarFicha(${ficha.id})">✏️ Editar</button>
          <button onclick="excluirFicha(${ficha.id})">🗑️ Excluir</button>
          </td>

        </td>
      `;
      table.appendChild(linha);
    });

    container.appendChild(table);
  };
}

// Gerar ficha para impressão
function gerarImpressao(ficha) {
  const area = document.getElementById("printArea");
  area.innerHTML = `
    <div class="print-ficha">
      <h2 style="text-align:center;">CONGREGAÇÃO CRISTÃ NO BRASIL</h2>
      <h3 style="text-align:center;">FICHA DE APRESENTAÇÃO PARA CARGO NA IGREJA</h3>

      <p><strong>Apresentado para:</strong> ____________________________</p>
      <p><strong>Nome Completo:</strong> <span class="linha">${ficha.nome}</span></p>
      <p><strong>Idade:</strong> <span class="linha">${ficha.idade}</span> anos</p>
      <p><strong>Estado Civil:</strong> <span class="linha">${ficha.estadoCivil}</span></p>
      <p><strong>Tempo de Batizado:</strong> <span class="linha">${ficha.tempoBatizado}</span> anos</p>
      <p><strong>Aposentado por Invalidez:</strong> <span class="linha">${ficha.invalidez}</span></p>
      <p><strong>Comum Congregação:</strong> <span class="linha">${ficha.comum}</span></p>
      <p><strong>Cargo Atual:</strong> <span class="linha">${ficha.cargoAtual}</span></p>
      <p><strong>Cônjuge exerce cargo:</strong> <span class="linha">${ficha.conjugeCargo}</span></p>
      <p><strong>Apresentado por:</strong></p>
      <p>Ancião: <span class="linha">${ficha.anciao}</span></p>
      <p>Diácono: <span class="linha">${ficha.diacono}</span></p>
      <p>Cooperador: <span class="linha">${ficha.cooperador}</span></p>
      <p><strong>Administração:</strong> <span class="linha">${ficha.administracao}</span></p>
      <p><strong>Considerado na Data:</strong> <span class="linha">${ficha.dataConsideracao}</span></p>
    </div>
  `;
}

// Imprimir uma ficha
function imprimirFicha(id) {
  const tx = db.transaction("fichas", "readonly");
  const store = tx.objectStore("fichas");
  store.get(id).onsuccess = function (e) {
    const ficha = e.target.result;
    gerarImpressao(ficha);
    setTimeout(() => window.print(), 300);
  };
}

// Excluir ficha
function excluirFicha(id) {
  if (!confirm("Deseja realmente excluir esta ficha?")) return;
  const tx = db.transaction("fichas", "readwrite");
  tx.objectStore("fichas").delete(id).onsuccess = abrirHistorico;
}

// Preencher automaticamente se tiver parâmetros na URL
function carregarURL() {
  const params = new URLSearchParams(window.location.search);
  if (!params.has("nome")) return;

  const ficha = {};
  params.forEach((v, k) => ficha[k] = decodeURIComponent(v));
  const tx = db.transaction("fichas", "readwrite");
  tx.objectStore("fichas").add(ficha);

  gerarImpressao(ficha);
  setTimeout(() => window.print(), 300);
}
