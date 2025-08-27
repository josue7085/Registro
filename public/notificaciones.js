// notificaciones.js
// Lógica para el panel de notificaciones: tabla, modales, añadir/editar/detalle

let notificaciones = window.datosGlobales.notificaciones;

function renderTablaNotificaciones() {
    const tbody = document.getElementById('tabla-notificaciones-body');
    if (!tbody) return;
    tbody.innerHTML = '';
    notificaciones.forEach((notif, idx) => {
        let destinatario = notif.destinatario;
        const clientes = window.getClientes ? window.getClientes() : [];
        if (destinatario && destinatario !== 'Todos') {
            const c = clientes.find(c=>c.id==destinatario);
            destinatario = c ? c.nombres + ' ' + c.apellidos : destinatario;
        }
        tbody.innerHTML += `
            <tr>
                <td>${notif.titulo}</td>
                <td>${notif.mensaje}</td>
                <td>${notif.fecha}</td>
                <td>${destinatario}</td>
                <td>
                    <button class="btn-editar" onclick="abrirModalNotificacion(${idx})"><i class="fas fa-edit"></i></button>
                    <button class="btn-eliminar" onclick="eliminarNotificacion(${idx})"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `;
    });
}

function abrirModalNotificacion(idx = null) {
    const modal = document.getElementById('modal-notificacion');
    const content = document.getElementById('modal-content-notificacion');
    let notif = idx !== null ? notificaciones[idx] : {
        titulo: '', mensaje: '', fecha: new Date().toISOString().slice(0,10), destinatario: ''
    };
    content.innerHTML = `
        <h3>${idx !== null ? 'Editar' : 'Nueva'} Notificación</h3>
        <form id="form-notificacion">
            <label>Título<input type="text" name="titulo" value="${notif.titulo}" required></label>
            <label>Mensaje<textarea name="mensaje" required>${notif.mensaje}</textarea></label>
            <label>Fecha<input type="date" name="fecha" value="${notif.fecha}" required></label>
            <label>Destinatario<input type="text" name="destinatario" value="${notif.destinatario}" required></label>
            <div style="display:flex; gap:8px;">
                <button type="submit" class="btn-guardar">Guardar</button>
                <button type="button" class="btn-cancelar" onclick="cerrarModalNotificacion()">Cancelar</button>
            </div>
        </form>
    `;
    modal.style.display = 'block';
    document.getElementById('form-notificacion').onsubmit = function(e) {
        e.preventDefault();
        const fd = new FormData(this);
        const nuevaNotif = {
            titulo: fd.get('titulo'),
            mensaje: fd.get('mensaje'),
            fecha: fd.get('fecha'),
            destinatario: fd.get('destinatario')
        };
        if (idx !== null) {
            notificaciones[idx] = nuevaNotif;
            editarNotificacion(notificaciones[idx].id, nuevaNotif);
        }
        else {
            notificaciones.push(nuevaNotif);
            agregarNotificacion(nuevaNotif);
        }
        renderTablaNotificaciones();
        cerrarModalNotificacion();
    };
}

function cerrarModalNotificacion() {
    document.getElementById('modal-notificacion').style.display = 'none';
}

function eliminarNotificacion(idx) {
    if (confirm('¿Eliminar esta notificación?')) {
        const id = notificaciones[idx].id;
        notificaciones.splice(idx, 1);
        renderTablaNotificaciones();
        eliminarNotificacion(id);
    }
}

document.getElementById('btn-nueva-notificacion').onclick = () => abrirModalNotificacion();

// Inicializar tabla
renderTablaNotificaciones();

// CRUD Firestore para notificaciones
function agregarNotificacion(data) {
  window.firestoreCRUD.add('notificaciones', data)
    .then(() => alert('Notificación añadida correctamente'))
    .catch(err => alert('Error al añadir notificación: ' + err.message));
}
function editarNotificacion(id, data) {
  window.firestoreCRUD.update('notificaciones', id, data)
    .then(() => alert('Notificación actualizada'))
    .catch(err => alert('Error al actualizar notificación: ' + err.message));
}
function eliminarNotificacion(id) {
  if (!confirm('¿Seguro que deseas eliminar esta notificación?')) return;
  window.firestoreCRUD.delete('notificaciones', id)
    .then(() => alert('Notificación eliminada'))
    .catch(err => alert('Error al eliminar notificación: ' + err.message));
}
