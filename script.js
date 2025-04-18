// ==================== Variables ====================
let trabajos = [];
let notas = {};
let clienteSeleccionado = null;

// ==================== Elementos DOM ====================
const tabla = document.getElementById("tabla-trabajos");
const btnAgregar = document.getElementById("btn-agregar");
const modalAgregar = document.getElementById("modal-agregar");
const modalNota = document.getElementById("modal-nota");
const modalPdf = document.getElementById("modal-pdf");
const clienteInput = document.getElementById("cliente");
const pedidoInput = document.getElementById("pedido");
const entregaInput = document.getElementById("entrega");
const estadoInput = document.getElementById("estado");
const correoInput = document.getElementById("correo");
const notaInput = document.getElementById("nota-texto");
const pdfNotaInput = document.getElementById("pdf-nota");
const pdfClienteSelect = document.getElementById("pdf-cliente");

// ==================== Utilidades ====================
function renderTabla() {
    tabla.innerHTML = "";
    trabajos.forEach((trabajo, index) => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${trabajo.cliente}</td>
            <td>${trabajo.pedido}</td>
            <td>${trabajo.entrega}</td>
            <td class="estado ${trabajo.estado.toLowerCase().replace(" ", "-")}">${trabajo.estado}</td>
            <td>${notas[trabajo.cliente] || ""}</td>
            <td>${trabajo.correo}</td>
            <td><button class="btn-editar" onclick="editar(${index})">Editar</button></td>
        `;
        tabla.appendChild(fila);
    });

    actualizarClientesPdf();
}

function resetModal() {
    clienteInput.value = "";
    pedidoInput.value = "";
    entregaInput.value = "";
    estadoInput.value = "Pendiente";
    correoInput.value = "";
}

function actualizarClientesPdf() {
    pdfClienteSelect.innerHTML = "";
    trabajos.forEach((trabajo, i) => {
        const op = document.createElement("option");
        op.value = i;
        op.textContent = trabajo.cliente;
        pdfClienteSelect.appendChild(op);
    });
}

// ==================== Eventos ====================
btnAgregar.addEventListener("click", () => {
    modalAgregar.style.display = "block";
    resetModal();
});

document.getElementById("cancelar-agregar").addEventListener("click", () => {
    modalAgregar.style.display = "none";
});

document.getElementById("guardar-agregar").addEventListener("click", () => {
    const nuevo = {
        cliente: clienteInput.value,
        pedido: pedidoInput.value,
        entrega: entregaInput.value,
        estado: estadoInput.value,
        correo: correoInput.value
    };
    trabajos.push(nuevo);
    renderTabla();
    modalAgregar.style.display = "none";
});

// ==================== Nota ====================
document.getElementById("btn-nota").addEventListener("click", () => {
    modalNota.style.display = "block";
});

document.getElementById("guardar-nota").addEventListener("click", () => {
    const nota = notaInput.value;
    if (trabajos.length > 0) {
        const index = trabajos.length - 1;
        const nombre = trabajos[index].cliente;
        notas[nombre] = nota;
        renderTabla();
        modalNota.style.display = "none";
    }
});

document.getElementById("cancelar-nota").addEventListener("click", () => {
    modalNota.style.display = "none";
});

// ==================== PDF ====================
document.getElementById("btn-pdf").addEventListener("click", () => {
    modalPdf.style.display = "block";
});

document.getElementById("cancelar-pdf").addEventListener("click", () => {
    modalPdf.style.display = "none";
});

document.getElementById("enviar-pdf").addEventListener("click", () => {
    const index = pdfClienteSelect.value;
    const cliente = trabajos[index];
    const notasAdicionales = pdfNotaInput.value;

    fetch("https://hm-produccion-api.render.com/enviar-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            cliente: cliente.cliente,
            pedido: cliente.pedido,
            entrega: cliente.entrega,
            notas: notasAdicionales,
            correo: cliente.correo
        })
    })
    .then(res => {
        if (res.ok) {
            alert("PDF enviado correctamente al cliente.");
            modalPdf.style.display = "none";
        } else {
            alert("Hubo un error al enviar el PDF.");
        }
    })
    .catch(() => {
        alert("Error de red al enviar PDF.");
    });
});

// ==================== Editar ====================
function editar(index) {
    const trabajo = trabajos[index];
    clienteInput.value = trabajo.cliente;
    pedidoInput.value = trabajo.pedido;
    entregaInput.value = trabajo.entrega;
    estadoInput.value = trabajo.estado;
    correoInput.value = trabajo.correo;
    modalAgregar.style.display = "block";

    document.getElementById("guardar-agregar").onclick = () => {
        trabajos[index] = {
            cliente: clienteInput.value,
            pedido: pedidoInput.value,
            entrega: entregaInput.value,
            estado: estadoInput.value,
            correo: correoInput.value
        };
        renderTabla();
        modalAgregar.style.display = "none";
    };
}

// ==================== Agenda ====================
document.getElementById("btn-agenda").addEventListener("click", () => {
    window.location.href = "calendario.ics"; // o usar webcal:// si lo alojas como calendario
});

// ==================== Inicial ====================
renderTabla();
