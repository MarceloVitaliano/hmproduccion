document.addEventListener('DOMContentLoaded', () => {
  const clientList = document.getElementById('client-list');
  const modal = document.getElementById('modal');
  const openModalBtn = document.getElementById('openModal');
  const closeModalBtn = document.getElementById('closeModal');
  const addClientForm = document.getElementById('addClientForm');
  const nameInput = document.getElementById('name');
  const jobInput = document.getElementById('job');
  const dateInput = document.getElementById('delivery');
  const statusInput = document.getElementById('status');
  const emailInput = document.getElementById('email');

  let clients = JSON.parse(localStorage.getItem('clients')) || [];

  const saveClients = () => {
    localStorage.setItem('clients', JSON.stringify(clients));
  };

  const renderClients = () => {
    clientList.innerHTML = '';
    clients.forEach((client, index) => {
      if (client.status === 'Entregado') return;
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${client.name}</td>
        <td>${client.job}</td>
        <td>${client.delivery}</td>
        <td><span class="status ${client.status.toLowerCase().replace(' ', '-')}">${client.status}</span></td>
        <td>${client.email}</td>
        <td><button class="edit-btn" data-index="${index}">Actualizar</button></td>
      `;
      clientList.appendChild(row);
    });
    attachEditListeners();
  };

  const attachEditListeners = () => {
    const editButtons = document.querySelectorAll('.edit-btn');
    editButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const i = e.target.dataset.index;
        const newStatus = prompt('Nuevo estado: Pendiente, En proceso, Listo o Entregado', clients[i].status);
        if (newStatus) {
          clients[i].status = newStatus;
          if (newStatus === 'Entregado') {
            clients.splice(i, 1);
            alert('Cliente eliminado por estado "Entregado".');
          }
          saveClients();
          renderClients();
        }
      });
    });
  };

  openModalBtn.addEventListener('click', () => {
    modal.style.display = 'block';
  });

  closeModalBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    addClientForm.reset();
  });

  addClientForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newClient = {
      name: nameInput.value,
      job: jobInput.value,
      delivery: dateInput.value,
      status: statusInput.value,
      email: emailInput.value
    };
    clients.push(newClient);
    saveClients();
    renderClients();
    addClientForm.reset();
    modal.style.display = 'none';
  });

  renderClients();
});
