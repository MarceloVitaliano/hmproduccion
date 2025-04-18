document.addEventListener('DOMContentLoaded', () => {
  const clientes = JSON.parse(localStorage.getItem('clientes')) || [];
  const tabla = document.querySelector('#tabla-clientes');
  const modal = document.querySelector('#modal-cliente');
  const btnAbrirModal = document.querySelector('#btn-abrir-modal');
  const btnGuardarCliente = document.querySelector('#guardar-cliente');
  const btnCancelarCliente = document.querySelector('#cancelar-cliente');

  const nombreInput = document.querySelector('#nombre');
  const pedidoInput = document.querySelector('#pedido');
  const fechaInput = document.querySelector('#fecha');
  const estadoInput = document.querySelector('#estado');
  const correoInput = document.querySelector('#correo');

  function guardarClientesLocal() {
    localStorage.setItem('clientes', JSON.stringify(clientes));
  }

  function renderizarClientes() {
    tabla.innerHTML = '';
    clientes.forEach((cliente, index) => {
      if (cliente.estado === 'Entregado') return;

      const fila = document.createElement('tr');
      fila.innerHTML = `
        <td>${cliente.nombre}</td>
        <td>${cliente.pedido}</td>
        <td>${cliente.fecha}</td>
        <td><span class="badge ${colorEstado(cliente.estado)}">${cliente.estado}</span></td>
        <td>${cliente.correo}</td>
        <td><button class="btn-editar" data-index="${index}">Actualizar</button></td>
      `;
      tabla.appendChild(fila);
    });

    // Guardar estado filtrado (sin entregados)
    const clientesFiltrados = clientes.filter(c => c.estado !== 'Entregado');
    localStorage.setItem('clientes', JSON.stringify(clientesFiltrados));

    // Asociar botón de editar
    document.querySelectorAll('.btn-editar').forEach(btn => {
      btn.addEventListener('click', e => {
        const idx = e.target.dataset.index;
        editarCliente(idx);
      });
    });
  }

  function colorEstado(estado) {
    switch (estado) {
      case 'Pendiente': return 'badge-pendiente';
      case 'En proceso': return 'badge-proceso';
      case 'Listo': return 'badge-listo';
      case 'Entregado': return 'badge-entregado';
      default: return '';
    }
  }

  function abrirModal() {
    modal.classList.add('mostrar');
  }

  function cerrarModal() {
    modal.classList.remove('mostrar');
    limpiarFormulario();
  }

  function limpiarFormulario() {
    nombreInput.value = '';
    pedidoInput.value = '';
    fechaInput.value = '';
    estadoInput.value = 'Pendiente';
    correoInput.value = '';
  }

  function agregarCliente() {
    const cliente = {
      nombre: nombreInput.value,
      pedido: pedidoInput.value,
      fecha: fechaInput.value,
      estado: estadoInput.value,
      correo: correoInput.value
    };

    if (!cliente.nombre || !cliente.pedido || !cliente.fecha || !cliente.correo) {
      alert('Por favor, llena todos los campos');
      return;
    }

    clientes.push(cliente);
    guardarClientesLocal();
    renderizarClientes();
    cerrarModal();
  }

  function editarCliente(index) {
    const nuevoEstado = prompt('Nuevo estado para este cliente (Pendiente, En proceso, Listo, Entregado):');
    if (!nuevoEstado) return;

    clientes[index].estado = nuevoEstado;

    if (nuevoEstado === 'Entregado') {
      alert('✅ Cliente eliminado automáticamente al marcarlo como entregado.');
    }

    guardarClientesLocal();
    renderizarClientes();
  }

  // Eventos
  btnAbrirModal.addEventListener('click', abrirModal);
  btnCancelarCliente.addEventListener('click', cerrarModal);
  btnGuardarCliente.addEventListener('click', agregarCliente);

  // Inicial
  renderizarClientes();
});
