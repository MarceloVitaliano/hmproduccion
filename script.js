let trabajos = JSON.parse(localStorage.getItem("trabajos")) || [];

function guardarEnLocalStorage() {
  localStorage.setItem("trabajos", JSON.stringify(trabajos));
}

function actualizarTabla() {
  const tabla = document.getElementById("tabla-trabajos");
  tabla.innerHTML = "";
  trabajos.forEach((trabajo, index) => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${trabajo.cliente}</td>
      <td>${trabajo.pedido}</td>
      <td>${trabajo.entrega}</td>
      <td class="estado ${trabajo.estado.toLowerCase().replace(" ", "-")}">${trabajo.estado}</td>
      <td>${trabajo.nota || ""}</td>
      <td>${trabajo.correo}</td>
      <td><button onclick="editarTrabajo(${index})">✏️</button></td>
    `;
    tabla.appendChild(fila);
  });
}

function guardarTrabajo() {
  const cliente = document.getElementById("cliente").value;
  const pedido = document.getElementById("pedido").value;
  const entrega = document.getElementById("entrega").value;
  const estado = document.getElementById("estado").value;
  const correo = document.getElementById("correo").value;

  if (!cliente || !pedido || !entrega || !correo) {
    alert("Por favor, completa todos los campos.");
    return;
  }

  trabajos.push({ cliente, pedido, entrega, estado, correo });
  guardarEnLocalStorage();
  actualizarTabla();
  cerrarModal();

  // Limpiar campos
  document.getElementById("cliente").value = "";
  document.getElementById("pedido").value = "";
  document.getElementById("entrega").value = "";
  document.getElementById("estado").value = "Pendiente";
  document.getElementById("correo").value = "";
}

function editarTrabajo(index) {
  const trabajo = trabajos[index];
  document.getElementById("cliente").value = trabajo.cliente;
  document.getElementById("pedido").value = trabajo.pedido;
  document.getElementById("entrega").value = trabajo.entrega;
  document.getElementById("estado").value = trabajo.estado;
  document.getElementById("correo").value = trabajo.correo;
  abrirModal();

  // Eliminar el trabajo actual para re-guardarlo
  trabajos.splice(index, 1);
}

function abrirModal() {
  document.getElementById("modal").style.display = "block";
}

function cerrarModal() {
  document.getElementById("modal").style.display = "none";
}

function abrirNota() {
  document.getElementById("modalNota").style.display = "block";
}

function cerrarNota() {
  document.getElementById("modalNota").style.display = "none";
}

function guardarNota() {
  const nota = document.getElementById("notaTexto").value;
  if (trabajos.length === 0) {
    alert("Primero debes capturar un trabajo.");
    return;
  }

  // Aplica nota al último trabajo agregado
  trabajos[trabajos.length - 1].nota = nota;
  guardarEnLocalStorage();
  actualizarTabla();
  cerrarNota();
  document.getElementById("notaTexto").value = "";
}

function abrirEnvioPDF() {
  const select = document.getElementById("clienteSeleccionado");
  select.innerHTML = "";
  trabajos.forEach((t, i) => {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = `${t.cliente} - ${t.pedido}`;
    select.appendChild(option);
  });
  document.getElementById("modalPDF").style.display = "block";
}

function cerrarEnvioPDF() {
  document.getElementById("modalPDF").style.display = "none";
  document.getElementById("notasPDF").value = "";
}

function enviarPDF() {
  const index = document.getElementById("clienteSeleccionado").value;
  const notas = document.getElementById("notasPDF").value;
  const trabajo = trabajos[index];

  fetch("https://hmproduccion-backend.onrender.com/enviar-pdf", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      cliente: trabajo.cliente,
      pedido: trabajo.pedido,
      entrega: trabajo.entrega,
      notas,
      correo: trabajo.correo
    })
  })
    .then(res => res.ok ? alert("✅ PDF enviado correctamente.") : alert("❌ Error al enviar PDF."))
    .catch(() => alert("❌ Fallo la conexión con el servidor."));
    
  cerrarEnvioPDF();
}

window.onload = actualizarTabla;
