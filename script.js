let clientes = [];
let clienteEditando = null;
let notasPorCliente = {};

// 🎯 Pintar tabla
function actualizarTabla() {
  const cuerpo = document.getElementById("cuerpo-tabla");
  cuerpo.innerHTML = "";
  clientes.forEach((c, i) => {
    const fila = document.createElement("tr");

    const estadoColor = {
      "Pendiente": "estado-rojo",
      "En proceso": "estado-amarillo",
      "Listo": "estado-azul",
      "Entregado": "estado-verde"
    };

    fila.innerHTML = `
      <td>${c.nombre}</td>
      <td>${c.pedido}</td>
      <td>${c.entrega}</td>
      <td><span class="${estadoColor[c.estado]}">${c.estado}</span></td>
      <td>${notasPorCliente[c.nombre] || ""}</td>
      <td>${c.correo}</td>
      <td><button onclick="editarCliente(${i})">Editar</button></td>
    `;
    cuerpo.appendChild(fila);
  });

  actualizarListaPDF();
}

// ➕ Modal agregar cliente
function abrirModalAgregar() {
  clienteEditando = null;
  document.getElementById("nuevo-nombre").value = "";
  document.getElementById("nuevo-pedido").value = "";
  document.getElementById("nueva-entrega").value = "";
  document.getElementById("nuevo-estado").value = "Pendiente";
  document.getElementById("nuevo-correo").value = "";
  document.getElementById("modal-agregar").style.display = "flex";
}

function cerrarModal(id) {
  document.getElementById(id).style.display = "none";
}

// 💾 Guardar cliente (nuevo o editado)
function guardarCliente() {
  const nombre = document.getElementById("nuevo-nombre").value;
  const pedido = document.getElementById("nuevo-pedido").value;
  const entrega = document.getElementById("nueva-entrega").value;
  const estado = document.getElementById("nuevo-estado").value;
  const correo = document.getElementById("nuevo-correo").value;

  if (!nombre || !pedido || !entrega || !correo) {
    alert("Completa todos los campos");
    return;
  }

  const cliente = { nombre, pedido, entrega, estado, correo };

  if (clienteEditando !== null) {
    clientes[clienteEditando] = cliente;
  } else {
    clientes.push(cliente);
  }

  cerrarModal("modal-agregar");
  actualizarTabla();
}

// ✏️ Editar cliente
function editarCliente(i) {
  const c = clientes[i];
  clienteEditando = i;
  document.getElementById("nuevo-nombre").value = c.nombre;
  document.getElementById("nuevo-pedido").value = c.pedido;
  document.getElementById("nueva-entrega").value = c.entrega;
  document.getElementById("nuevo-estado").value = c.estado;
  document.getElementById("nuevo-correo").value = c.correo;
  document.getElementById("modal-agregar").style.display = "flex";
}

// 📝 Notas por cliente
function abrirModalNota() {
  const nombres = clientes.map(c => c.nombre);
  if (nombres.length === 0) return alert("Primero agrega al menos un cliente");
  const nombre = prompt("¿A qué cliente quieres agregarle la nota?");
  if (!nombres.includes(nombre)) return alert("Ese cliente no existe");
  const nota = prompt("Escribe la nota:");
  if (nota) {
    notasPorCliente[nombre] = nota;
    actualizarTabla();
  }
}

// 🗓️ Agenda
function abrirAgenda() {
  window.open("https://calendar.google.com", "_blank");
}

// 📤 PDF
function abrirModalPDF() {
  document.getElementById("modal-pdf").style.display = "flex";
}

function actualizarListaPDF() {
  const select = document.getElementById("cliente-pdf");
  if (!select) return;
  select.innerHTML = "";
  clientes.forEach((c, i) => {
    const option = document.createElement("option");
    option.value = i;
    option.innerText = c.nombre;
    select.appendChild(option);
  });
}

async function enviarPDF() {
  const clienteIndex = document.getElementById("cliente-pdf").value;
  const notaManual = document.getElementById("notas-pdf").value;
  const cliente = clientes[clienteIndex];
  if (!cliente) return alert("Cliente no válido");

  const datos = {
    nombre: cliente.nombre,
    pedido: cliente.pedido,
    entrega: cliente.entrega,
    notas: notaManual,
    correo: cliente.correo
  };

  try {
    const res = await fetch("https://hmproduccion-backend.onrender.com/send-pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos)
    });
    if (res.ok) {
      alert("✅ PDF enviado correctamente");
      cerrarModal("modal-pdf");
    } else {
      alert("❌ Hubo un error al enviar el PDF");
    }
  } catch (err) {
    alert("❌ No se pudo conectar al backend");
  }
}
