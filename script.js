document.addEventListener("DOMContentLoaded", () => {
  const tabla = document.getElementById("trabajosBody");
  const addBtn = document.getElementById("addTrabajoBtn");

  addBtn.addEventListener("click", () => {
    const cliente = prompt("Nombre del cliente:");
    const trabajo = prompt("Tipo de trabajo:");
    const entrega = prompt("Fecha de entrega (dd/mm):");
    const estado = prompt("Estado (Pendiente/En proceso/Listo/Entregado):");

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${cliente}</td>
      <td>${trabajo}</td>
      <td>${entrega}</td>
      <td><span class="estado">${estado}</span></td>
      <td><button>Actualizar</button></td>
    `;
    tabla.appendChild(row);
  });
});
