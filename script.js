// --- Lógica para dashboard visual tipo app ---
let clientes = JSON.parse(localStorage.getItem("clientes")) || [];
let clienteSeleccionado = null;

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
      <td><span class="${estadoClass}">${cliente.estado}</span></td>
      <td><button class="btn-add" onclick="editarCliente(${index})">Actualizar</button></td>
    `;

    tbody.appendChild(fila);
  });
}

function abrirFormulario() {
  alert("Aquí se abriría el modal para añadir cliente");
}

function editarCliente(index) {
  alert(`Editar cliente: ${clientes[index].nombre}`);
}

function abrirModalNotaIcono() {
  alert("Aquí se abriría el modal de notas");
}

function abrirAgenda() {
  window.location.href = "calshow://";
}

function abrirModalPDFUltimo() {
  const cliente = clientes[clientes.length - 1];
  if (!cliente) {
    alert("No hay clientes para enviar PDF");
    return;
  }
  alert(`Correo enviado exitosamente a ${cliente.nombre}`);
}

mostrarClientes();
