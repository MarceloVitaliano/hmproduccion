document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formulario");
  const tablaBody = document.getElementById("tabla-clientes-body");
  const btnPDF = document.getElementById("btn-pdf");
  const nombreInput = document.getElementById("nombre");
  const pedidoInput = document.getElementById("pedido");
  const entregaInput = document.getElementById("entrega");

  let clientes = JSON.parse(localStorage.getItem("clientes")) || [];

  const guardarClientes = () => {
    localStorage.setItem("clientes", JSON.stringify(clientes));
  };

  const renderClientes = () => {
    tablaBody.innerHTML = "";
    clientes.forEach((cliente, index) => {
      const fila = document.createElement("tr");

      const estadoColor = {
        "Pendiente": "#ff4d4d",
        "En proceso": "#ffd11a",
        "Listo": "#3399ff",
        "Entregado": "#33cc33"
      };

      const tdNombre = `<td>${cliente.nombre}</td>`;
      const tdPedido = `<td>${cliente.pedido}</td>`;
      const tdEntrega = `<td>${cliente.entrega}</td>`;
      const tdNotas = `<td>${cliente.notas || ""}</td>`;
      const tdCorreo = `<td>${cliente.correo || ""}</td>`;

      const tdEstado = `<td style="color: white; background-color: ${estadoColor[cliente.estado] || "gray"}">${cliente.estado}</td>`;

      const tdEditar = `
        <td>
          <button onclick="editarCliente(${index})">Editar</button>
        </td>`;

      fila.innerHTML = tdNombre + tdPedido + tdEntrega + tdNotas + tdCorreo + tdEstado + tdEditar;

      tablaBody.appendChild(fila);

      // Si está entregado, eliminar automáticamente
      if (cliente.estado === "Entregado") {
        setTimeout(() => {
          clientes.splice(index, 1);
          guardarClientes();
          renderClientes();
          alert(`✅ El cliente "${cliente.nombre}" ha sido marcado como entregado y fue eliminado.`);
        }, 300);
      }
    });
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const nombre = nombreInput.value;
    const pedido = pedidoInput.value;
    const entrega = entregaInput.value;

    if (!nombre || !pedido || !entrega) {
      alert("Por favor completa todos los campos.");
      return;
    }

    const nuevoCliente = {
      nombre,
      pedido,
      entrega,
      estado: "Pendiente"
    };

    clientes.push(nuevoCliente);
    guardarClientes();
    renderClientes();
    form.reset();
  });

  window.editarCliente = (index) => {
    const cliente = clientes[index];
    const nuevoEstado = prompt("Nuevo estado (Pendiente, En proceso, Listo, Entregado):", cliente.estado);
    if (nuevoEstado) {
      cliente.estado = nuevoEstado;
      guardarClientes();
      renderClientes();
    }
  };

  // Botón Enviar PDF
  btnPDF.addEventListener("click", async () => {
    const nombreCliente = prompt("Nombre exacto del cliente al que deseas enviar el PDF:");
    const cliente = clientes.find(c => c.nombre.toLowerCase() === nombreCliente.toLowerCase());
    if (!cliente) {
      alert("Cliente no encontrado.");
      return;
    }

    const notas = prompt("Escribe las notas que aparecerán en el PDF:");
    const payload = {
      nombre: cliente.nombre,
      pedido: cliente.pedido,
      entrega: cliente.entrega,
      notas
    };

    try {
      const res = await fetch("https://hmproduccion-backend.onrender.com/enviar-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert("📧 PDF enviado correctamente al cliente.");
      } else {
        alert("❌ Error al enviar el PDF.");
      }
    } catch (err) {
      console.error(err);
      alert("❌ Error de red al intentar enviar el PDF.");
    }
  });

  renderClientes();
});
