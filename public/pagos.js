// Actualizar tabla automáticamente cuando los pagos cambian en Firestore
document.addEventListener('pagosActualizados', renderTablaPagos);
// pagos.js
// Lógica para el panel de pagos: tabla, modales, añadir/editar/detalle



function renderTablaPagos() {
    const tbody = document.getElementById('tabla-pagos-body');
    if (!tbody) return;
    tbody.innerHTML = '';
    // Log para depuración: mostrar todos los pagos que llegan
    const pagos = window.datosGlobales.pagos;
    console.log('Pagos recibidos en admin:', pagos);
    pagos.forEach((pago, idx) => {
        const cliente = (window.getClientes && window.getClientes().find(c=>c.id==pago.clienteId));
        const estadoPago = pago.estado ? pago.estado.toLowerCase() : '';
        tbody.innerHTML += `
            <tr>
                <td>${pago.numero}</td>
                <td>${cliente ? cliente.nombres + ' ' + cliente.apellidos : ''}</td>
                <td>${pago.monto}</td>
                <td>${pago.fecha}</td>
                <td>${pago.metodo}</td>
                <td>${pago.estado}</td>
                <td>
                    ${estadoPago==='pendiente' ? `
                        <button class="btn-verificar" onclick="marcarPago(${idx},'Verificado')">Verificar</button>
                        <button class="btn-rechazar" onclick="abrirModalRechazo(${idx})">Rechazar</button>
                    ` : ''}
                </td>
            </tr>
        `;
    });
}

// ...existing code...
// Modal de rechazo de pago
let idxRechazoActual = null;
function abrirModalRechazo(idx) {
    idxRechazoActual = idx;
    document.getElementById('motivo-rechazo-input').value = '';
    document.getElementById('modal-rechazo-pago').style.display = 'block';
}
document.addEventListener('DOMContentLoaded', function() {
    const btnConfirmar = document.getElementById('btn-confirmar-rechazo');
    const btnCancelar = document.getElementById('btn-cancelar-rechazo');
    if (btnConfirmar && btnCancelar) {
        btnConfirmar.onclick = function() {
            const motivo = document.getElementById('motivo-rechazo-input').value.trim();
            if (!motivo) {
                alert('Debes ingresar un motivo para rechazar el pago.');
                return;
            }
            marcarPago(idxRechazoActual, 'Rechazado', motivo);
            document.getElementById('modal-rechazo-pago').style.display = 'none';
        };
        btnCancelar.onclick = function() {
            document.getElementById('modal-rechazo-pago').style.display = 'none';
            idxRechazoActual = null;
        };
    }
});
// ...existing code...
// ...existing code...

function abrirModalPago(idx = null) {
    const pagos = window.datosGlobales.pagos;
    const modal = document.getElementById('modal-pago');
    const content = document.getElementById('modal-content-pago');
    const clientesList = window.getClientes ? window.getClientes() : [];
    let pago = idx !== null ? pagos[idx] : {
        numero: generarNumeroPago(), clienteId: '', monto: '', fecha: '', metodo: '', estado: 'Pendiente'
    };
    content.innerHTML = `
        <h3>${idx !== null ? 'Editar' : 'Nuevo'} Pago</h3>
        <form id="form-pago">
            <label>N° Pago<input type="text" name="numero" value="${pago.numero}" readonly style="background:#e3e3e3;"></label>
            <label>Cliente
                <select name="clienteId" required>
                    <option value="">Seleccione...</option>
                    ${clientesList.map(c => `<option value="${c.id}" ${c.id==pago.clienteId?'selected':''}>${c.nombres} ${c.apellidos} (${c.cedula})</option>`).join('')}
                </select>
            </label>
            <label>Monto<input type="number" name="monto" value="${pago.monto}" required></label>
            <label>Fecha<input type="date" name="fecha" value="${pago.fecha}" required></label>
            <label>Método
                <select name="metodo" required>
                    <option value="">Seleccione...</option>
                    <option value="Transferencia" ${pago.metodo=="Transferencia"?'selected':''}>Transferencia</option>
                    <option value="Pago móvil" ${pago.metodo=="Pago móvil"?'selected':''}>Pago móvil</option>
                    <option value="Efectivo" ${pago.metodo=="Efectivo"?'selected':''}>Efectivo</option>
                    <option value="Zelle" ${pago.metodo=="Zelle"?'selected':''}>Zelle</option>
                </select>
            </label>
            <div style="display:flex; gap:8px;">
                <button type="submit" class="btn-guardar">Guardar</button>
                <button type="button" class="btn-cancelar" onclick="cerrarModalPago()">Cancelar</button>
            </div>
        </form>
    `;
    modal.style.display = 'block';
    document.getElementById('form-pago').onsubmit = function(e) {
        e.preventDefault();
        const fd = new FormData(this);
        const nuevoPago = {
            numero: fd.get('numero'),
            clienteId: fd.get('clienteId'),
            monto: fd.get('monto'),
            fecha: fd.get('fecha'),
            metodo: fd.get('metodo'),
            estado: 'Pendiente'
        };
        if (idx !== null) {
            pagos[idx] = nuevoPago;
            editarPago(pago.id, nuevoPago); // Actualizar en Firestore
        } else {
            pagos.push(nuevoPago);
            agregarPago(nuevoPago); // Añadir a Firestore
        }
        renderTablaPagos();
        cerrarModalPago();
    };
}

function cerrarModalPago() {
    document.getElementById('modal-pago').style.display = 'none';
}

function eliminarPago(idx) {
    if (confirm('¿Eliminar este pago?')) {
        const pago = pagos[idx];
        pagos.splice(idx, 1);
        renderTablaPagos();
        eliminarPago(pago.id); // Eliminar de Firestore
    }
}

document.getElementById('btn-nuevo-pago').onclick = () => abrirModalPago();

function generarNumeroPago() {
    const pagos = window.datosGlobales.pagos;
    const base = (pagos.length+1).toString().padStart(4,'0');
    const fecha = new Date().toISOString().slice(0,10).replace(/-/g,'');
    return `${base}-${fecha}`;
}

function renderTablaHistorialPagos() {
    const tbody = document.getElementById('tabla-historial-pagos-body');
    if (!tbody) return;
    tbody.innerHTML = '';
    const historialPagos = window.datosGlobales.historialPagos;
    historialPagos.forEach(pago => {
        const cliente = (window.getClientes && window.getClientes().find(c=>c.id==pago.clienteId));
        tbody.innerHTML += `
            <tr>
                <td>${pago.numero}</td>
                <td>${cliente ? cliente.nombres + ' ' + cliente.apellidos : ''}</td>
                <td>${pago.monto}</td>
                <td>${pago.fecha}</td>
                <td>${pago.metodo}</td>
                <td>${pago.estado}</td>
            </tr>
        `;
    });
}

// CRUD Firestore para pagos
function agregarPago(data) {
  window.firestoreCRUD.add('pagos', data)
    .then(() => alert('Pago añadido correctamente'))
    .catch(err => alert('Error al añadir pago: ' + err.message));
}
// ...existing code...

// Mover marcarPago al final para asegurar que esta versión se use
function marcarPago(idx, estado, motivoRechazo = '') {
    const pagos = window.datosGlobales.pagos;
    const historialPagos = window.datosGlobales.historialPagos;
    const pago = pagos[idx];
    // Actualizar estado y motivo en Firestore (colección global)
    if (pago.id) {
        const updateData = { estado };
        if (estado.toLowerCase() === 'rechazado') updateData.motivoRechazo = motivoRechazo;
        window.firestoreCRUD.update('pagos', pago.id, updateData);
        // Enviar notificación al cliente si es rechazo
        if (estado.toLowerCase() === 'rechazado' && motivoRechazo) {
            const mensaje = `Su pago número ${pago.numero} de la fecha ${pago.fecha} fue rechazado. Motivo: ${motivoRechazo}`;
            const notificacion = {
                titulo: 'Pago rechazado',
                mensaje,
                fecha: new Date().toISOString().slice(0, 10),
                destinatario: pago.clienteId || '',
                tipo: 'rechazo',
            };
            if (typeof agregarNotificacion === 'function') {
                agregarNotificacion(notificacion);
            } else if (window.firestoreCRUD) {
                window.firestoreCRUD.add('notificaciones', notificacion);
            }
        }
    }
    // Actualizar estado y motivo en subcolección del usuario
    if (pago.clienteId && pago.numero) {
        db.collection('usuarios').doc(pago.clienteId).collection('pagos').where('numero', '==', pago.numero).limit(1).get().then(snap => {
            if (!snap.empty) {
                const pagoDocId = snap.docs[0].id;
                const updateData = { estado };
                if (estado.toLowerCase() === 'rechazado') updateData.motivoRechazo = motivoRechazo;
                db.collection('usuarios').doc(pago.clienteId).collection('pagos').doc(pagoDocId).update(updateData);
            }
        });
    }
    if (estado.toLowerCase() === 'verificado') {
        historialPagos.push({ ...pago, estado: 'Verificado' });
        pagos.splice(idx, 1);
    } else if (estado.toLowerCase() === 'rechazado') {
        pagos.splice(idx, 1);
    }
    renderTablaPagos();
    renderTablaHistorialPagos && renderTablaHistorialPagos();
}
