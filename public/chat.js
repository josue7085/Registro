// chat.js
// Lógica básica para el panel de chat (demo local, no en tiempo real)

let mensajesChat = window.datosGlobales.mensajesChat;

function renderClientesChat() {
    const select = document.getElementById('chat-cliente-select');
    if (!select) return;
    const clientesList = window.getClientes ? window.getClientes() : [];
    // Solo mostrar clientes con mensajes o todos si no hay mensajes
    const clientesConMensajes = [...new Set(mensajesChat.map(m => m.clienteId))];
    select.innerHTML = clientesList.map(c =>
        `<option value="${c.id}" ${clientesConMensajes.includes(c.id)?'':'style="color:#aaa;"'}>${c.nombres} ${c.apellidos} (${c.cedula})</option>`
    ).join('');
    // Seleccionar el primero con mensajes por defecto
    if (clientesConMensajes.length && !select.value) select.value = clientesConMensajes[0];
}

function renderMensajesChat() {
    const cont = document.getElementById('chat-mensajes');
    const select = document.getElementById('chat-cliente-select');
    if (!cont || !select) return;
    const clienteId = parseInt(select.value);
    const mensajes = mensajesChat.filter(m => m.clienteId === clienteId);
    cont.innerHTML = mensajes.map(m => `
        <div class="chat-msg ${m.tipo}">
            <span class="chat-nombre">${m.tipo==='admin'?'Admin':(window.getClientes && window.getClientes().find(c=>c.id==m.clienteId)?.nombres || m.nombre)}:</span> <span>${m.texto}</span>
            <span class="chat-hora">${m.hora}</span>
        </div>
    `).join('');
    cont.scrollTop = cont.scrollHeight;
}

document.getElementById('chat-cliente-select').addEventListener('change', renderMensajesChat);

document.getElementById('form-chat').onsubmit = function(e) {
    e.preventDefault();
    const input = document.getElementById('input-chat');
    const select = document.getElementById('chat-cliente-select');
    const texto = input.value.trim();
    if (!texto) return;
    const hora = new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});
    mensajesChat.push({clienteId: parseInt(select.value), nombre:'Admin', texto, hora, tipo:'admin'});
    renderMensajesChat();
    input.value = '';
};

document.addEventListener('DOMContentLoaded', function() {
    renderClientesChat();
    renderMensajesChat();
});

// CRUD Firestore para chat
function agregarMensajeChat(data) {
  window.firestoreCRUD.add('mensajesChat', data)
    .catch(err => alert('Error al enviar mensaje: ' + err.message));
}
function eliminarMensajeChat(id) {
  if (!confirm('¿Seguro que deseas eliminar este mensaje?')) return;
  window.firestoreCRUD.delete('mensajesChat', id)
    .catch(err => alert('Error al eliminar mensaje: ' + err.message));
}
