let clientes = JSON.parse(localStorage.getItem("clientes")) || [];
let clienteSeleccionado = null;

// --- Funciones para mostrar clientes ---
function mostrarClientes() {
  const tbody = document.getElementById("tabla-clientes");
  tbody.innerHTML = "";

  clientes.forEach((cliente, index) => {
    const fila = document.createElement("tr");

    const estadoClass = cliente.estado === "Pendiente"
      ? "estado-pendiente"
      : cliente.estado === "En proceso"
      ? "estado-proceso"
      : cliente.estado === "Listo"
      ? "estado-listo"
      : "estado-entregado";

    fila.innerHTML = `
      <td>${cliente.nombre}</td>
      <td>${cliente.pedido}</td>
      <td>${cliente.fecha}</td>
      <td>${cliente.notas || ""}</td>
      <td>${cliente.correo}</td>
      <td>
        <select onchange="cambiarEstado(${index}, this.value)" class="${estadoClass}">
          <option value="Pendiente" ${cliente.estado === "Pendiente" ? "selected" : ""}>Pendiente</option>
          <option value="En proceso" ${cliente.estado === "En proceso" ? "selected" : ""}>En proceso</option>
          <option value="Listo" ${cliente.estado === "Listo" ? "selected" : ""}>Listo</option>
          <option value="Entregado" ${cliente.estado === "Entregado" ? "selected" : ""}>Entregado</option>
        </select>
      </td>
      <td><button class="btn-primary" onclick="editarCliente(${index})">Editar</button></td>
      <td><button class="btn-nota" onclick="abrirModalNota(${index})">+Nota</button></td>
      <td><button class="btn-disabled" disabled>Subir archivo</button></td>
      <td><button class="btn-agenda" onclick="abrirAgenda()">Agenda</button></td>
      <td><button class="btn-pdf" onclick="abrirModalPDF(${index})">Enviar PDF</button></td>
    `;

    tbody.appendChild(fila);
  });
}

// --- Añadir cliente ---
function abrirFormulario() {
  document.getElementById("modal-formulario").style.display = "block";
}

function cerrarFormulario() {
  document.getElementById("modal-formulario").style.display = "none";
  limpiarFormulario();
}

function guardarCliente() {
  const nombre = document.getElementById("nombre").value.trim();
  const pedido = document.getElementById("pedido").value.trim();
  const fecha = document.getElementById("fecha").value;
  const correo = document.getElementById("correo").value.trim();

  if (!nombre || !pedido || !fecha || !correo) {
    alert("Por favor llena todos los campos.");
    return;
  }

  clientes.push({ nombre, pedido, fecha, correo, estado: "Pendiente", notas: "" });
  localStorage.setItem("clientes", JSON.stringify(clientes));
  cerrarFormulario();
  mostrarClientes();
}

function limpiarFormulario() {
  document.getElementById("nombre").value = "";
  document.getElementById("pedido").value = "";
  document.getElementById("fecha").value = "";
  document.getElementById("correo").value = "";
}

// --- Editar cliente ---
function editarCliente(index) {
  const cliente = clientes[index];
  document.getElementById("nombre").value = cliente.nombre;
  document.getElementById("pedido").value = cliente.pedido;
  document.getElementById("fecha").value = cliente.fecha;
  document.getElementById("correo").value = cliente.correo;
  clientes.splice(index, 1);
  abrirFormulario();
}

// --- Cambiar estado ---
function cambiarEstado(index, nuevoEstado) {
  clientes[index].estado = nuevoEstado;

  if (nuevoEstado === "Entregado") {
    clientes.splice(index, 1);
  }

  localStorage.setItem("clientes", JSON.stringify(clientes));
  mostrarClientes();
}

// --- Modal de nota ---
function abrirModalNota(index) {
  clienteSeleccionado = index;
  document.getElementById("modal-nota").style.display = "block";
  document.getElementById("nueva-nota").value = "";
}

function cerrarModalNota() {
  document.getElementById("modal-nota").style.display = "none";
}

function guardarNota() {
  const nota = document.getElementById("nueva-nota").value.trim();
  if (nota && clienteSeleccionado !== null) {
    if (clientes[clienteSeleccionado].notas) {
      clientes[clienteSeleccionado].notas += " | " + nota;
    } else {
      clientes[clienteSeleccionado].notas = nota;
    }

    localStorage.setItem("clientes", JSON.stringify(clientes));
    cerrarModalNota();
    mostrarClientes();
  }
}

// --- Agenda (abre calendario) ---
function abrirAgenda() {
  window.location.href = "calshow://";
}

// --- Modal PDF ---
function abrirModalPDF(index) {
  clienteSeleccionado = index;
  const cliente = clientes[index];
  document.getElementById("pdf-nombre").textContent = cliente.nombre;
  document.getElementById("pdf-pedido").textContent = cliente.pedido;
  document.getElementById("pdf-fecha").textContent = cliente.fecha;
  document.getElementById("pdf-nota").value = "";
  document.getElementById("modal-pdf").style.display = "block";
}

function cerrarModalPDF() {
  document.getElementById("modal-pdf").style.display = "none";
}

function enviarPDF() {
  const cliente = clientes[clienteSeleccionado];
  const nota = document.getElementById("pdf-nota").value.trim();
  const asunto = `Actualización de su pedido | HM Encuadernaciones`;
  const cuerpo = `
    Estimado(a) ${cliente.nombre},\n
    Le enviamos una actualización sobre su pedido:\n
    Pedido: ${cliente.pedido}\n
    Fecha estimada de entrega: ${cliente.fecha}\n
    Nota adicional: ${nota || "Ninguna"}\n
    ¡Gracias por confiar en HM Encuadernaciones!
  `;

  const mailto = `mailto:${cliente.correo}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`;
  window.location.href = mailto;
  cerrarModalPDF();
}

// --- Cerrar modales al hacer clic fuera ---
window.onclick = function(event) {
  if (event.target.classList.contains("modal")) {
    event.target.style.display = "none";
  }
}

// --- Inicializar ---
mostrarClientes();
