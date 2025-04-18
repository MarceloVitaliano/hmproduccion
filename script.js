// -----------------------------
// Variables globales
// -----------------------------
let clientes = JSON.parse(localStorage.getItem("clientes")) || [];
let clienteSeleccionadoIndex = null;

// -----------------------------
// DOM
// -----------------------------
const abrirFormulario = document.getElementById("abrirFormulario");
const formularioEmergente = document.getElementById("formularioEmergente");
const cerrarFormulario = document.getElementById("cerrarFormulario");
const guardarCliente = document.getElementById("guardarCliente");
const cuerpoTabla = document.getElementById("cuerpoTabla");
const btnNota = document.getElementById("btnNota");
const btnAgenda = document.getElementById("btnAgenda");
const btnEnviarPDF = document.getElementById("btnEnviarPDF");
const modalNota = document.getElementById("modalNota");
const guardarNota = document.getElementById("guardarNota");
const notaTexto = document.getElementById("notaTexto");
const modalPDF = document.getElementById("modalPDF");
const clienteSeleccionado = document.getElementById("clienteSeleccionado");
const notasPDF = document.getElementById("notasPDF");
const enviarPDF = document.getElementById("enviarPDF");

// -----------------------------
// Eventos principales
// -----------------------------
abrirFormulario.onclick = () => formularioEmergente.style.display = "flex";
cerrarFormulario.onclick = () => formularioEmergente.style.display = "none";

guardarCliente.onclick = () => {
  const nombre = document.getElementById("nombre").value;
  const correo = document.getElementById("correo").value;
  const pedido = document.getElementById("pedido").value;
  const fecha = document.getElementById("fecha").value;
  const estado = document.getElementById("estado").value;

  if (!nombre || !pedido || !fecha || !estado || !correo) return alert("Llena todos los campos");

  const cliente = { nombre, correo, pedido, fecha, estado, notas: "" };
  clientes.push(cliente);
  localStorage.setItem("clientes", JSON.stringify(clientes));

  document.getElementById("nombre").value = "";
  document.getElementById("correo").value = "";
  document.getElementById("pedido").value = "";
  document.getElementById("fecha").value = "";
  document.getElementById("estado").value = "Pendiente";

  formularioEmergente.style.display = "none";
  renderizarClientes();
};

// -----------------------------
// Renderizar tabla
// -----------------------------
function renderizarClientes() {
  cuerpoTabla.innerHTML = "";
  clienteSeleccionado.innerHTML = "";

  clientes.forEach((cliente, index) => {
    const fila = document.createElement("tr");

    // Colores por estado
    let color = "";
    if (cliente.estado === "Pendiente") color = "rojo";
    else if (cliente.estado === "En proceso") color = "amarillo";
    else if (cliente.estado === "Listo") color = "azul";
    else if (cliente.estado === "Entregado") {
      clientes.splice(index, 1);
      localStorage.setItem("clientes", JSON.stringify(clientes));
      renderizarClientes();
      alert("✅ Pedido marcado como ENTREGADO. Eliminado del dashboard.");
      return;
    }

    fila.innerHTML = `
      <td>${cliente.nombre}</td>
      <td>${cliente.correo}</td>
      <td>${cliente.pedido}</td>
      <td>${cliente.fecha}</td>
      <td class="${color}">
        <select onchange="actualizarEstado(${index}, this.value)">
          <option ${cliente.estado === "Pendiente" ? "selected" : ""}>Pendiente</option>
          <option ${cliente.estado === "En proceso" ? "selected" : ""}>En proceso</option>
          <option ${cliente.estado === "Listo" ? "selected" : ""}>Listo</option>
          <option ${cliente.estado === "Entregado" ? "selected" : ""}>Entregado</option>
        </select>
      </td>
      <td>${cliente.notas || "—"}</td>
      <td><button onclick="editarCliente(${index})">Editar</button></td>
    `;

    cuerpoTabla.appendChild(fila);

    const option = document.createElement("option");
    option.value = index;
    option.textContent = cliente.nombre;
    clienteSeleccionado.appendChild(option);
  });
}

// -----------------------------
// Actualizar estado
// -----------------------------
function actualizarEstado(index, nuevoEstado) {
  clientes[index].estado = nuevoEstado;
  localStorage.setItem("clientes", JSON.stringify(clientes));
  renderizarClientes();
}

// -----------------------------
// Editar cliente (solo nombre, correo, pedido y fecha)
function editarCliente(index) {
  const c = clientes[index];
  document.getElementById("nombre").value = c.nombre;
  document.getElementById("correo").value = c.correo;
  document.getElementById("pedido").value = c.pedido;
  document.getElementById("fecha").value = c.fecha;
  document.getElementById("estado").value = c.estado;
  clienteSeleccionadoIndex = index;
  formularioEmergente.style.display = "flex";

  guardarCliente.onclick = () => {
    clientes[clienteSeleccionadoIndex] = {
      nombre: document.getElementById("nombre").value,
      correo: document.getElementById("correo").value,
      pedido: document.getElementById("pedido").value,
      fecha: document.getElementById("fecha").value,
      estado: document.getElementById("estado").value,
      notas: clientes[clienteSeleccionadoIndex].notas || ""
    };
    localStorage.setItem("clientes", JSON.stringify(clientes));
    renderizarClientes();
    formularioEmergente.style.display = "none";
  };
}

// -----------------------------
// Botón "Añadir nota"
btnNota.onclick = () => {
  if (clientes.length === 0) return alert("No hay clientes disponibles");
  modalNota.style.display = "flex";
};

guardarNota.onclick = () => {
  const index = clienteSeleccionado.value;
  clientes[index].notas = notaTexto.value;
  localStorage.setItem("clientes", JSON.stringify(clientes));
  notaTexto.value = "";
  modalNota.style.display = "none";
  renderizarClientes();
};

// -----------------------------
// Botón "Agenda"
btnAgenda.onclick = () => {
  window.open("calshow://", "_blank");
};

// -----------------------------
// Botón "Enviar PDF al cliente"
btnEnviarPDF.onclick = () => {
  if (clientes.length === 0) return alert("No hay clientes disponibles");
  modalPDF.style.display = "flex";
};

enviarPDF.onclick = () => {
  const index = clienteSeleccionado.value;
  const cliente = clientes[index];
  const notas = notasPDF.value;
  const datos = {
    to: cliente.correo,
    subject: "Actualización de su pedido | HM Encuadernaciones",
    nombre: cliente.nombre,
    pedido: cliente.pedido,
    entrega: cliente.fecha,
    notas
  };

  fetch("https://hmproduccion-backend.onrender.com/enviar-pdf", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos)
  }).then(res => {
    if (res.ok) {
      alert("✅ PDF enviado correctamente al cliente.");
      modalPDF.style.display = "none";
    } else {
      alert("❌ Hubo un error al enviar el PDF.");
    }
  });
};

// -----------------------------
// Cerrar modal genérico
function cerrarModal(id) {
  document.getElementById(id).style.display = "none";
}

// -----------------------------
// Cargar clientes al inicio
renderizarClientes();
