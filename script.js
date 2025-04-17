
const form = document.getElementById("formulario-trabajo");
const tabla = document.getElementById("tabla-trabajos").querySelector("tbody");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const cliente = document.getElementById("cliente").value;
  const trabajo = document.getElementById("trabajo").value;
  const fecha = document.getElementById("fecha").value;
  const estado = document.getElementById("estado").value;

  const datos = { cliente, trabajo, fecha, estado };
  guardarTrabajo(datos);
  form.reset();
});

function guardarTrabajo(datos) {
  const trabajos = JSON.parse(localStorage.getItem("trabajos")) || [];
  trabajos.push(datos);
  localStorage.setItem("trabajos", JSON.stringify(trabajos));
  renderTrabajos();
}

function renderTrabajos() {
  const trabajos = JSON.parse(localStorage.getItem("trabajos")) || [];
  tabla.innerHTML = "";
  trabajos.forEach((t, index) => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${t.cliente}</td>
      <td>${t.trabajo}</td>
      <td>${t.fecha}</td>
      <td class="estado-${t.estado.replace(/ /g, "\ ")}">${t.estado}</td>
      <td><button onclick="eliminarTrabajo(${index})">🗑</button></td>
    `;
    tabla.appendChild(fila);
  });
}

function eliminarTrabajo(index) {
  const trabajos = JSON.parse(localStorage.getItem("trabajos")) || [];
  trabajos.splice(index, 1);
  localStorage.setItem("trabajos", JSON.stringify(trabajos));
  renderTrabajos();
}

window.onload = renderTrabajos;


document.getElementById("tabla-trabajos").addEventListener("click", function(e) {
  if (e.target.classList.contains("btn-actualizar")) {
    alert("✅ Funcionalidad de actualizar en desarrollo.");
  }
  if (e.target.classList.contains("btn-nota")) {
    alert("✅ Nota añadida.");
  }
  if (e.target.classList.contains("btn-archivo")) {
    alert("✅ Archivo subido.");
  }
  if (e.target.classList.contains("btn-agenda")) {
    alert("✅ Agenda abierta.");
  }
  if (e.target.classList.contains("btn-pdf")) {
    alert("✅ PDF enviado al cliente.");
  }
});
