// recibos.js
// Lógica para el panel de recibos: tabla, modales, previsualización, carga de logo/marca de agua/QR


let recibos = window.datosGlobales.recibos;
let empresaInfo = window.datosGlobales.empresaInfo;

// Cargar y guardar info de empresa en localStorage
function cargarEmpresaInfo() {
    const guardado = localStorage.getItem('empresaInfo');
    if (guardado) empresaInfo = JSON.parse(guardado);
    const form = document.getElementById('form-empresa-info');
    if (form) {
        form.nombre.value = empresaInfo.nombre || '';
        form.rif.value = empresaInfo.rif || '';
        form.direccion.value = empresaInfo.direccion || '';
        form.telefono.value = empresaInfo.telefono || '';
        form.email.value = empresaInfo.email || '';
    }
}
function guardarEmpresaInfo(e) {
    e.preventDefault();
    const form = e.target;
    empresaInfo = {
        nombre: form.nombre.value,
        rif: form.rif.value,
        direccion: form.direccion.value,
        telefono: form.telefono.value,
        email: form.email.value
    };
    localStorage.setItem('empresaInfo', JSON.stringify(empresaInfo));
    alert('Información de empresa guardada');
}
document.addEventListener('DOMContentLoaded', function() {
    cargarEmpresaInfo();
    const form = document.getElementById('form-empresa-info');
    if (form) form.onsubmit = guardarEmpresaInfo;
});

function renderTablaRecibos() {
    const tbody = document.getElementById('tabla-recibos-body');
    tbody.innerHTML = '';
    recibos.forEach((recibo, idx) => {
        const cliente = (window.getClientes && window.getClientes().find(c=>c.id==recibo.clienteId)) || {};
        const plan = (window.getPlanes && window.getPlanes().find(p=>p.id==recibo.planId)) || {};
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${recibo.numero}</td>
            <td>${cliente.nombres ? cliente.nombres + ' ' + cliente.apellidos : ''}</td>
            <td>${plan.nombre || ''}</td>
            <td>${recibo.monto}</td>
            <td>${recibo.fecha}</td>
            <td>
                <button class="btn-editar" onclick="abrirModalRecibo(${idx})"><i class="fas fa-edit"></i></button>
                <button class="btn-eliminar" onclick="eliminarRecibo(${idx})"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}


function abrirModalRecibo(idx = null) {
    const modal = document.getElementById('modal-recibo');
    const content = document.getElementById('modal-content-recibo');
    // Obtener clientes y planes globales
    const clientesList = window.clientes || [];
    const planesList = window.planes || [];
    let recibo = idx !== null ? recibos[idx] : {
        numero: generarNumeroRecibo(), clienteId: '', planId: '', monto: '', fecha: '', info: '', logo: '', marcaAgua: ''
    };
    // Si es edición, obtener cliente y plan actuales
    let clienteActual = clientesList.find(c => c.id == recibo.clienteId) || {};
    let planActual = planesList.find(p => p.id == recibo.planId) || {};
    content.innerHTML = `
        <h3>${idx !== null ? 'Editar' : 'Nuevo'} Recibo</h3>
        <form id="form-recibo">
            <label>N° Recibo
                <input type="text" name="numero" value="${recibo.numero}" readonly style="background:#e3e3e3;">
            </label>
            <label>Cliente
                <select name="clienteId" required>
                    <option value="">Seleccione...</option>
                    ${clientesList.map(c => `<option value="${c.id}" ${c.id==recibo.clienteId?'selected':''}>${c.nombres} ${c.apellidos} (${c.cedula})</option>`).join('')}
                </select>
            </label>
            <label>Plan
                <select name="planId" required>
                    <option value="">Seleccione...</option>
                    ${planesList.map(p => `<option value="${p.id}" ${p.id==recibo.planId?'selected':''}>${p.nombre} - ${p.velocidad} (${p.precio})</option>`).join('')}
                </select>
            </label>
            <label>Monto
                <input type="text" name="monto" value="${planActual.precio||''}" readonly style="background:#e3e3e3;">
            </label>
            <label>Fecha
                <input type="date" name="fecha" value="${recibo.fecha}" required>
            </label>
            <label>Información extra<textarea name="info">${recibo.info || ''}</textarea></label>
            <label>Logo <input type="file" name="logo" accept="image/*"></label>
            <label>Marca de agua <input type="file" name="marcaAgua" accept="image/*"></label>
            <div id="preview-recibo" style="margin:16px 0;"></div>
            <div style="display:flex; gap:8px;">
                <button type="submit" class="btn-guardar">Guardar</button>
                <button type="button" class="btn-cancelar" onclick="cerrarModalRecibo()">Cancelar</button>
            </div>
        </form>
    `;
    modal.style.display = 'block';
    // Actualizar monto al cambiar plan
    content.querySelector('[name=planId]').addEventListener('change', function(e) {
        const plan = planesList.find(p => p.id == this.value);
        content.querySelector('[name=monto]').value = plan ? plan.precio : '';
    });
    document.getElementById('form-recibo').onsubmit = function(e) {
        e.preventDefault();
        const fd = new FormData(this);
        const nuevoRecibo = {
            numero: fd.get('numero'),
            clienteId: fd.get('clienteId'),
            planId: fd.get('planId'),
            monto: fd.get('monto'),
            fecha: fd.get('fecha'),
            info: fd.get('info'),
            logo: recibo.logo,
            marcaAgua: recibo.marcaAgua
        };
        if (idx !== null) recibos[idx] = nuevoRecibo;
        else recibos.push(nuevoRecibo);
        renderTablaRecibos();
        cerrarModalRecibo();
    };
    // Previsualización de recibo
    const preview = document.getElementById('preview-recibo');
    window.previsualizarRecibo = function() {
        const cliente = clientesList.find(c => c.id == (content.querySelector('[name=clienteId]').value));
        const plan = planesList.find(p => p.id == (content.querySelector('[name=planId]').value));
        preview.innerHTML = `
            <div class="recibo-preview">
                <div style="display:flex; align-items:center; gap:8px;">
                    ${recibo.logo ? `<img src="${recibo.logo}" class="logo-preview">` : ''}
                    <strong>Recibo N° ${recibo.numero}</strong>
                </div>
                <div><b>Empresa:</b> ${empresaInfo.nombre} | RIF: ${empresaInfo.rif}</div>
                <div><b>Dirección:</b> ${empresaInfo.direccion}</div>
                <div><b>Tel:</b> ${empresaInfo.telefono} | <b>Email:</b> ${empresaInfo.email}</div>
                <div>Cliente: ${cliente ? cliente.nombres + ' ' + cliente.apellidos : ''} (${cliente ? cliente.cedula : ''})</div>
                <div>Plan: ${plan ? plan.nombre : ''} - ${plan ? plan.velocidad : ''}</div>
                <div>Monto: ${plan ? plan.precio : ''}</div>
                <div>Fecha: ${content.querySelector('[name=fecha]').value}</div>
                <div>${content.querySelector('[name=info]').value || ''}</div>
                ${recibo.marcaAgua ? `<img src="${recibo.marcaAgua}" class="marcaagua-preview">` : ''}
            </div>
        `;
    };
    // Cargar imágenes y actualizar preview
    ['logo','marcaAgua'].forEach(campo => {
        content.querySelector(`[name=${campo}]`).addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(ev) {
                    recibo[campo] = ev.target.result;
                    previsualizarRecibo();
                };
                reader.readAsDataURL(file);
            }
        });
    });
    // Actualizar preview al cambiar cliente, plan, fecha, info
    ['clienteId','planId','fecha','info'].forEach(campo => {
        content.querySelector(`[name=${campo}]`).addEventListener('change', previsualizarRecibo);
        content.querySelector(`[name=${campo}]`).addEventListener('input', previsualizarRecibo);
    });
    previsualizarRecibo();
}

function generarNumeroRecibo() {
    // Simple: consecutivo + fecha
    const base = (recibos.length+1).toString().padStart(4,'0');
    const fecha = new Date().toISOString().slice(0,10).replace(/-/g,'');
    return `${base}-${fecha}`;
}

function cerrarModalRecibo() {
    document.getElementById('modal-recibo').style.display = 'none';
}

function eliminarRecibo(idx) {
    if (confirm('¿Eliminar este recibo?')) {
        recibos.splice(idx, 1);
        renderTablaRecibos();
    }
}

document.getElementById('btn-nuevo-recibo').onclick = () => abrirModalRecibo();

// Inicializar tabla
renderTablaRecibos();
