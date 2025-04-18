document.addEventListener('DOMContentLoaded', () => {
  const addClientBtn = document.getElementById('addClientBtn');
  const clientModal = document.getElementById('clientModal');
  const guardarBtn = document.getElementById('guardarBtn');
  const cancelarBtn = document.getElementById('cancelarBtn');
  const clientList = document.getElementById('clientList');

  const addNoteBtn = document.getElementById('addNoteBtn');
  const notaModal = document.getElementById('notaModal');
  const guardarNotaBtn = document.getElementById('guardarNotaBtn');
  const cancelarNotaBtn = document.getElementById('cancelarNotaBtn');

  const sendPdfBtn = document.getElementById('sendPdfBtn');
  const pdfModal = document.getElementById('pdfModal');
  const cancelarPDF = document.getElementById('cancelarPDF');

  // Mostrar modal de agregar cliente
  addClientBtn.onclick = () => clientModal.style.display = 'block';
  cancelarBtn.onclick = () => clientModal.style.display = 'none';

  // Agregar cliente a la tabla
  guardarBtn.onclick = () => {
    const cliente = document.getElementById('cliente').value;
    const pedido = document.getElementById('pedido').value;
    const entrega = document.getElementById('entrega').value;
    const estado = document.getElementById('estado').value;
    const correo = document.getElementById('correo').value;

    if (cliente && pedido && entrega && estado && correo) {
      const fila = document.createElement('tr');
      fila.innerHTML = `
        <td>${cliente}</td>
        <td>${pedido}</td>
        <td>${formatearFecha(entrega)}</td>
        <td class="${estadoColor(estado)}">${estado}</td>
        <td>${correo}</td>
        <td><button class="editarBtn">Actualizar</button></td>
      `;
      clientList.appendChild(fila);
      clientModal.style.display = 'none';
      limpiarCampos();
      actualizarClientesPDF();
    }
  };

  // Modal de nota
  addNoteBtn.onclick = () => notaModal.style.display = 'block';
  cancelarNotaBtn.onclick = () => notaModal.style.display = 'none';
  guardarNotaBtn.onclick = () => {
    notaModal.style.display = 'none';
    alert('Nota guardada correctamente.');
  };

  // Modal PDF
  sendPdfBtn.onclick = () => {
    pdfModal.style.display = 'block';
    actualizarClientesPDF();
  };
  cancelarPDF.onclick = () => pdfModal.style.display = 'none';

  // Enviar PDF
  document.getElementById('enviarPDF').onclick = () => {
    const clienteSelect = document.getElementById('clienteSelect');
    const notas = document.getElementById('notasPDF').value;
    const clienteNombre = clienteSelect.value;

    const fila = [...clientList.children].find(tr => tr.children[0].textContent === clienteNombre);
    const pedido = fila?.children[1].textContent;
    const entrega = fila?.children[2].textContent;
    const correo = fila?.children[4].textContent;

    if (clienteNombre && pedido && entrega && correo) {
      alert(`PDF enviado a ${correo} con:
Pedido: ${pedido}
Entrega: ${entrega}
Notas: ${notas}`);
      pdfModal.style.display = 'none';
    } else {
      alert('Faltan datos para enviar el PDF');
    }
  };

  // Actualizar selector de clientes
  function actualizarClientesPDF() {
    const select = document.getElementById('clienteSelect');
    select.innerHTML = '';
    [...clientList.children].forEach(row => {
      const cliente = row.children[0].textContent;
      const option = document.createElement('option');
      option.value = cliente;
      option.textContent = cliente;
      select.appendChild(option);
    });
  }

  function limpiarCampos() {
    document.getElementById('cliente').value = '';
    document.getElementById('pedido').value = '';
    document.getElementById('entrega').value = '';
    document.getElementById('estado').value = 'Pendiente';
    document.getElementById('correo').value = '';
  }

  function estadoColor(estado) {
    switch (estado) {
      case 'Pendiente': return 'rojo';
      case 'En proceso': return 'amarillo';
      case 'Listo': return 'azul';
      case 'Entregado': return 'verde';
      default: return '';
    }
  }

  function formatearFecha(fecha) {
    const d = new Date(fecha);
    const opciones = { day: '2-digit', month: 'short' };
    return d.toLocaleDateString('es-MX', opciones);
  }
});
