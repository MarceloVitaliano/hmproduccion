document.addEventListener("DOMContentLoaded", () => {
  const trabajos = JSON.parse(localStorage.getItem("trabajos")) || [];
  const tablaBody = document.querySelector("#tabla-clientes tbody");
  const formulario = document.getElementById("formulario-trabajo");
  const modal = document.getElementById("modal-formulario");
  const btnNuevo = document.getElementById("btn-nuevo");

  function guardarTrabajos() {
    localStorage.setItem("trabajos", JSON.stringify(trabajos));
  }

  function renderTabla() {
    tablaBody.innerHTML = "";
    trabajos.forEach((trabajo, index) => {
      if (trabajo.estado === "Entregado") return;

      const fila = document.createElement("tr");

      const celdaNombre = document.createElement("td");
      celdaNombre.textContent = trabajo.nombre;

      const celdaPedido = document.createElement("td");
      celdaPedido.textContent = trabajo.pedido;

      const celdaEntrega = document.createElement("td");
      celdaEntrega.textContent = trabajo.entrega;

      const celdaEstado = document.createElement("td");
      celdaEstado.textContent = trabajo.estado;
      celdaEstado.style.fontWeight = "bold";

      // Color según estado
      switch (trabajo.estado) {
        case "Pendiente":
          celdaEstado.style.color = "red";
          break;
        case "En proceso":
          celdaEstado.style.color = "orange";
          break;
        case "Listo":
          celdaEstado.style.color = "blue";
          break;
        case "Entregado":
          celdaEstado.style.color = "green";
          break;
        default:
          celdaEstado.style.color = "black";
      }

      // Si cambia a "Entregado", eliminar automáticamente
      const selectEstado = document.createElement("select");
      ["Pendiente", "En proceso", "Listo", "Entregado"].forEach(opcion => {
        const option = document.createElement("option");
        option.value = opcion;
        option.text = opcion;
        if (opcion === trabajo.estado) option.selected = true;
        selectEstado.appendChild(option);
      });
      selectEstado.addEventListener("change", () => {
        if (selectEstado.value === "Entregado") {
          alert("✅ Pedido entregado. Se eliminará de la lista.");
          trabajos.splice(index, 1);
        } else {
          trabajo.estado = selectEstado.value;
        }
        guardarTrabajos();
        renderTabla();
      });
      celdaEstado.innerHTML = "";
      celdaEstado.appendChild(selectEstado);

      const celdaCorreo = document.createElement("td");
      celdaCorreo.textContent = trabajo.correo || "";

      const celdaAcciones = document.createElement("td");
      const btnEditar = document.createElement("button");
      btnEditar.textContent = "Editar";
      btnEditar.className = "btn-editar";
      btnEditar.onclick = () => {
        document.getElementById("nombre").value = trabajo.nombre;
        document.getElementById("pedido").value = trabajo.pedido;
        document.getElementById("entrega").value = trabajo.entrega;
        document.getElementById("correo").value = trabajo.correo;
        formulario.dataset.editIndex = index;
        modal.style.display = "block";
      };
      celdaAcciones.appendChild(btnEditar);

      fila.appendChild(celdaNombre);
      fila.appendChild(celdaPedido);
      fila.appendChild(celdaEntrega);
      fila.appendChild(celdaEstado);
      fila.appendChild(celdaCorreo);
      fila.appendChild(celdaAcciones);
      tablaBody.appendChild(fila);
    });
  }

  formulario.addEventListener("submit", e => {
    e.preventDefault();
    const nombre = document.getElementById("nombre").value;
    const pedido = document.getElementById("pedido").value;
    const entrega = document.getElementById("entrega").value;
    const correo = document.getElementById("correo").value;
    const nuevoTrabajo = { nombre, pedido, entrega, estado: "Pendiente", correo };

    if (formulario.dataset.editIndex) {
      const index = parseInt(formulario.dataset.editIndex);
      trabajos[index] = nuevoTrabajo;
      delete formulario.dataset.editIndex;
    } else {
      trabajos.push(nuevoTrabajo);
    }

    guardarTrabajos();
    renderTabla();
    formulario.reset();
    modal.style.display = "none";
  });

  btnNuevo.addEventListener("click", () => {
    formulario.reset();
    delete formulario.dataset.editIndex;
    modal.style.display = "block";
  });

  renderTabla();
});
