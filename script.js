document.addEventListener("DOMContentLoaded", () => {
  const trabajos = JSON.parse(localStorage.getItem("trabajos")) || [];
  const tabla = document.getElementById("tabla-trabajos");
  const btnAgregar = document.getElementById("btn-agregar");
  const form = document.getElementById("formulario");
  const campos = form.querySelectorAll("input, select");
  const notasContainer = document.getElementById("notas-container");
  const btnNota = document.getElementById("btn-nota");
  const agendaBtn = document.getElementById("agenda");
  const enviarBtn = document.getElementById("enviar-pdf");
  const notasInput = document.getElementById("notas-pdf");

  const colores = {
    Pendiente: "#f8d7da",
    "En proceso": "#fff3cd",
    Listo: "#d1ecf1",
    Entregado: "#d4edda"
  };

  function renderTabla() {
    tabla.innerHTML = "";
    trabajos.forEach((trabajo, index) => {
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td>${trabajo.cliente}</td>
        <td>${trabajo.pedido}</td>
        <td>${trabajo.entrega}</td>
        <td style="background:${colores[trabajo.estado] || "#fff"}">${trabajo.estado}</td>
        <td>${trabajo.correo}</td>
        <td><button onclick="editar(${index})">Actualizar</button></td>
      `;
      tabla.appendChild(fila);
    });
  }

  window.editar = (index) => {
    const datos = trabajos[index];
    campos[0].value = datos.cliente;
    campos[1].value = datos.pedido;
    campos[2].value = datos.entrega;
    campos[3].value = datos.estado;
    campos[4].value = datos.correo;
    trabajos.splice(index, 1);
    guardar();
  };

  function guardar() {
    const nuevo = {
      cliente: campos[0].value,
      pedido: campos[1].value,
      entrega: campos[2].value,
      estado: campos[3].value,
      correo: campos[4].value
    };
    trabajos.push(nuevo);
    localStorage.setItem("trabajos", JSON.stringify(trabajos));
    renderTabla();
    form.reset();
    form.classList.add("oculto");
  }

  btnAgregar.onclick = () => {
    form.classList.toggle("oculto");
  };

  form.onsubmit = (e) => {
    e.preventDefault();
    guardar();
  };

  btnNota.onclick = () => {
    const nota = prompt("Escribe una nota:");
    if (nota) {
      const p = document.createElement("p");
      p.textContent = nota;
      notasContainer.appendChild(p);
    }
  };

  agendaBtn.onclick = () => {
    window.location.href = "webcal://ical.mac.com/calendar/ical/Apple_Holidays.ics";
  };

  enviarBtn.onclick = () => {
    const index = tabla.rows.length - 1;
    if (index < 0) return alert("No hay cliente seleccionado.");
    const trabajo = trabajos[index];
    fetch("https://hmproduccion-backend.vercel.app/enviar-pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cliente: trabajo.cliente,
        pedido: trabajo.pedido,
        entrega: trabajo.entrega,
        notas: notasInput.value,
        correo: trabajo.correo
      })
    }).then(res => res.ok ? alert("Correo enviado correctamente.") : alert("Error al enviar."));
  };

  renderTabla();
});
