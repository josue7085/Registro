// pagos.js
// Lógica para el panel de pagos: tabla, modales, añadir/editar/detalle

let pagos = window.datosGlobales.pagos;
let historialPagos = window.datosGlobales.historialPagos;

function renderTablaPagos() {
    const tbody = document.getElementById('tabla-pagos-body');
    if (!tbody) return;
    tbody.innerHTML = '';
    pagos.forEach((pago, idx) => {
        const cliente = (window.getClientes && window.getClientes().find(c=>c.id==pago.clienteId));
        tbody.innerHTML += `
            <tr>
                <td>${pago.numero}</td>
                <td>${cliente ? cliente.nombres + ' ' + cliente.apellidos : ''}</td>
                <td>${pago.monto}</td>
                <td>${pago.fecha}</td>
                <td>${pago.metodo}</td>
                <td>${pago.estado}</td>
                <td>
                    ${pago.estado==='Pendiente' ? `
                        <button class="btn-verificar" onclick="marcarPago(${idx},'Verificado')">Verificar</button>
                        <button class="btn-rechazar" onclick="marcarPago(${idx},'Rechazado')">Rechazar</button>
                    ` : ''}
                </td>
            </tr>
        `;
    });
}

function marcarPago(idx, estado) {
    if (estado==='Verificado') {
        historialPagos.push({...pagos[idx], estado:'Verificado'});
        pagos.splice(idx,1);
    } else if (estado==='Rechazado') {
        pagos.splice(idx,1);
    }
    renderTablaPagos();
    renderTablaHistorialPagos && renderTablaHistorialPagos();
}

function abrirModalPago(idx = null) {
    const modal = document.getElementById('modal-pago');
    const content = document.getElementById('modal-content-pago');
    const clientesList = window.clientes || [];
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
        if (idx !== null) pagos[idx] = nuevoPago;
        else pagos.push(nuevoPago);
        renderTablaPagos();
        cerrarModalPago();
    };
}

function cerrarModalPago() {
    document.getElementById('modal-pago').style.display = 'none';
}

function eliminarPago(idx) {
    if (confirm('¿Eliminar este pago?')) {
        pagos.splice(idx, 1);
        renderTablaPagos();
    }
}

document.getElementById('btn-nuevo-pago').onclick = () => abrirModalPago();

function generarNumeroPago() {
    const base = (pagos.length+1).toString().padStart(4,'0');
    const fecha = new Date().toISOString().slice(0,10).replace(/-/g,'');
    return `${base}-${fecha}`;
}

function renderTablaHistorialPagos() {
    const tbody = document.getElementById('tabla-historial-pagos-body');
    if (!tbody) return;
    tbody.innerHTML = '';
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

// Inicializar tabla
renderTablaPagos();
renderTablaHistorialPagos();
