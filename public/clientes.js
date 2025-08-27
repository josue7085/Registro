// Lógica para la gestión de clientes en la pantalla principal

// Los datos de clientes ahora se sincronizan desde Firestore colección 'usuarios'
// window.datosGlobales.clientes se llena automáticamente por datos.js

function renderTablaClientes(filtro = '') {
  const tbody = document.getElementById('tabla-clientes-body');
  if (!tbody) return;
  const filtroLower = filtro.trim().toLowerCase();
  let clientes = window.datosGlobales.clientes;
  // Si la URL tiene ?soloUsuarios=1, filtrar solo admin y tecnico
  if (!window._urlParamsClientes) {
    window._urlParamsClientes = new URLSearchParams(window.location.search);
  }
  const urlParams = window._urlParamsClientes;
  if (urlParams.get('soloUsuarios') === '1') {
    clientes = clientes.filter(c => c.rol === 'admin' || c.rol === 'tecnico');
  }
  const filtrados = filtroLower
    ? clientes.filter(c =>
        (c.nombres && c.nombres.toLowerCase().includes(filtroLower)) ||
        (c.cedula && c.cedula.toLowerCase().includes(filtroLower)) ||
        (c.ipAsignada && c.ipAsignada.toLowerCase().includes(filtroLower))
      )
    : clientes;
  // Detectar si el usuario es técnico (solo lectura)
  const esTecnico = urlParams.get('rol') === 'tecnico';
  tbody.innerHTML = filtrados.map(cliente => `
    <tr>
      <td>${cliente.nombres}</td>
      <td>${cliente.apellidos || ''}</td>
      <td>${cliente.cedula}</td>
      <td>${cliente.ipAsignada}</td>
      <td class="acciones">
        <button class="icon-btn btn-ver" title="Ver" data-id="${cliente.id}"><i class="fa fa-eye"></i></button>
        ${!esTecnico ? `<button class="icon-btn btn-editar" title="Editar" data-id="${cliente.id}"><i class="fa fa-pen"></i></button>` : ''}
        ${!esTecnico ? `<button class="icon-btn btn-estado" title="${cliente.estado === 'activo' ? 'Suspender' : 'Activar'}" data-id="${cliente.id}"><i class="fa ${cliente.estado === 'activo' ? 'fa-toggle-on' : 'fa-toggle-off'}"></i></button>` : ''}
        ${!esTecnico ? `<button class="icon-btn btn-eliminar" title="Eliminar" data-id="${cliente.id}"><i class="fa fa-trash"></i></button>` : ''}
        <span class="estado-label ${cliente.estado === 'activo' ? 'estado-activo' : 'estado-suspendido'}">
          ${cliente.estado === 'activo' ? 'Activo' : 'Suspendido'}
        </span>
      </td>
    </tr>
  `).join('');
  // Actualizar contador de clientes
  const contador = document.getElementById('contador-clientes');
  if (contador) contador.textContent = `Total: ${filtrados.length}`;
}

// Modal básico reutilizable
function mostrarModalCliente(titulo, contenido) {
  let modal = document.getElementById('modal-cliente');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'modal-cliente';
    modal.className = 'modal-cliente';
    modal.innerHTML = '<div class="modal-content" id="modal-content"></div>';
    document.body.appendChild(modal);
    modal.addEventListener('click', function(e) {
      if (e.target === modal) modal.style.display = 'none';
    });
  }
  document.getElementById('modal-content').innerHTML = `<h3>${titulo}</h3>${contenido}<div style='text-align:right; margin-top:18px;'><button class='btn-cerrar-modal'>Cerrar</button></div>`;
  modal.style.display = 'flex';
  document.querySelector('.btn-cerrar-modal').onclick = function() {
    modal.style.display = 'none';
  };
}

function infoClienteHTML(cliente) {
  // Buscar el nombre del plan por el id
  let nombrePlan = '';
  if (cliente.planServicioId && window.datosGlobales && Array.isArray(window.datosGlobales.planes)) {
    const plan = window.datosGlobales.planes.find(p => p.id === cliente.planServicioId);
    nombrePlan = plan ? plan.nombre : cliente.planServicioId;
  }
  // Fecha de vencimiento: usar la fecha de corte del plan asignado si existe
  let fechaVencimiento = cliente.fechaVencimientoServicio || '';
  if (!fechaVencimiento && cliente.planServicioId && window.datosGlobales && Array.isArray(window.datosGlobales.planes)) {
    const plan = window.datosGlobales.planes.find(p => p.id === cliente.planServicioId);
    if (plan && plan.fechaCorte) {
      fechaVencimiento = plan.fechaCorte;
    }
  }
  return `
    <p><b>Nombres:</b> ${cliente.nombres}</p>
    <p><b>Apellidos:</b> ${cliente.apellidos}</p>
    <p><b>Cédula:</b> ${cliente.cedula}</p>
    <p><b>Teléfono:</b> ${cliente.telefono}</p>
    <p><b>Correo:</b> ${cliente.correo}</p>
    <p><b>Dirección:</b> ${cliente.direccion}</p>
    <p><b>Ciudad:</b> ${cliente.ciudad}</p>
    <p><b>Estado:</b> ${cliente.estadoCliente ?? cliente.estado}</p>
    <p><b>Rol:</b> ${cliente.rol}</p>
    <p><b>Plan:</b> ${nombrePlan}</p>
    <p><b>IP Asignada:</b> ${cliente.ipAsignada}</p>
    <p><b>Clave Hotspot:</b> ${cliente.claveHotspot}</p>
    <p><b>Contraseña Cliente:</b> ${cliente.contrasenaCliente}</p>
    <p><b>Notas Admin:</b> ${cliente.notasAdmin}</p>
    <p><b>Fecha Registro:</b> ${cliente.fechaRegistro ?? ''}</p>
    <p><b>Última Modificación:</b> ${cliente.fechaUltimaModificacion ?? ''}</p>
    <p><b>Vencimiento Servicio:</b> ${fechaVencimiento}</p>
  `;
}

function editarClienteHTML(cliente) {
  // Usar los planes globales sincronizados desde Firestore
  const planesDisponibles = (window.datosGlobales && Array.isArray(window.datosGlobales.planes)) ? window.datosGlobales.planes : [];
  const roles = ['cliente', 'admin', 'tecnico'];
  return `
    <form id='form-editar-cliente'>
      <label>Nombres:<br><input name='nombres' value='${cliente.nombres || ''}' required></label><br><br>
      <label>Apellidos:<br><input name='apellidos' value='${cliente.apellidos || ''}' required></label><br><br>
      <label>Cédula:<br><input name='cedula' value='${cliente.cedula || ''}' required></label><br><br>
      <label>Teléfono:<br><input name='telefono' value='${cliente.telefono || ''}'></label><br><br>
      <label>Correo:<br><input name='correo' value='${cliente.correo || ''}'></label><br><br>
      <label>Dirección:<br><input name='direccion' value='${cliente.direccion || ''}'></label><br><br>
      <label>Ciudad:<br><input name='ciudad' value='${cliente.ciudad || ''}'></label><br><br>
      <label>Rol:<br>
        <select name='rol' class='select-custom' style='width: 98%;'>
          ${roles.map(r => `<option value='${r}'${cliente.rol === r ? ' selected' : ''}>${r.charAt(0).toUpperCase() + r.slice(1)}</option>`).join('')}
        </select>
      </label><br><br>
      <label>Plan:<br>
        <select name='planServicioId' class='select-custom' style='width: 98%;'>
          <option value=''>Sin plan</option>
          ${planesDisponibles.map(p => `<option value='${p.id}'${cliente.planServicioId === p.id ? ' selected' : ''}>${p.nombre}</option>`).join('')}
        </select>
      </label><br><br>
      <label>IP Asignada:<br><input name='ipAsignada' value='${cliente.ipAsignada || ''}'></label><br><br>
      <label>Clave Hotspot:<br><input name='claveHotspot' value='${cliente.claveHotspot || ''}'></label><br><br>
      <label>Contraseña Cliente:<br><input name='contrasenaCliente' value='${cliente.contrasenaCliente || ''}'></label><br><br>
      <label>Notas Admin:<br><input name='notasAdmin' value='${cliente.notasAdmin || ''}'></label><br><br>
      <label>Estado:<br><input name='estadoCliente' value='${cliente.estadoCliente || cliente.estado || ''}'></label><br><br>
      <label>Fecha Registro:<br><input name='fechaRegistro' value='${cliente.fechaRegistro || ''}'></label><br><br>
      <label>Última Modificación:<br><input name='fechaUltimaModificacion' value='${cliente.fechaUltimaModificacion || ''}'></label><br><br>
      <label>Vencimiento Servicio:<br><input name='fechaVencimientoServicio' value='${cliente.fechaVencimientoServicio || ''}'></label><br><br>
      <button type='submit' class='btn-guardar'>Guardar</button>
    </form>
  `;
}

document.addEventListener('DOMContentLoaded', function() {
  renderTablaClientes();
  // Evento de búsqueda
  const inputBusqueda = document.getElementById('busqueda-clientes');
  if (inputBusqueda) {
    inputBusqueda.addEventListener('input', function() {
      renderTablaClientes(this.value);
    });
  }
  // Asignar eventos a los iconos
  document.getElementById('tabla-clientes-body').addEventListener('click', function(e) {
    const btn = e.target.closest('button');
    if (!btn) return;
    const id = btn.dataset.id;
    const cliente = window.datosGlobales.clientes.find(c => c.id == id);
    if (btn.classList.contains('btn-ver')) {
      mostrarModalCliente('Información de Cliente', infoClienteHTML(cliente));
    }
    if (btn.classList.contains('btn-editar')) {
      mostrarModalCliente('Editar Cliente', editarClienteHTML(cliente));
      document.getElementById('form-editar-cliente').onsubmit = function(ev) {
        ev.preventDefault();
        const data = Object.fromEntries(new FormData(this));
        // Actualizar fecha de última modificación automáticamente (YYYY-MM-DD)
        const hoy = new Date();
        data.fechaUltimaModificacion = hoy.toISOString().slice(0, 10);
        Object.assign(cliente, data);
        renderTablaClientes(inputBusqueda ? inputBusqueda.value : '');
        document.getElementById('modal-cliente').style.display = 'none';
        editarCliente(cliente.id, data);
      };
    }
    if (btn.classList.contains('btn-estado')) {
      cliente.estado = (cliente.estado === 'activo') ? 'suspendido' : 'activo';
      cliente.estadoCliente = cliente.estado;
      renderTablaClientes(inputBusqueda ? inputBusqueda.value : '');
      editarCliente(cliente.id, { estado: cliente.estado, estadoCliente: cliente.estado });
    }
    if (btn.classList.contains('btn-eliminar')) {
      eliminarCliente(cliente.id);
    }
  });

  // Botón añadir cliente
  const btnNuevo = document.getElementById('btn-nuevo-cliente');
  if (btnNuevo) {
    btnNuevo.addEventListener('click', function() {
      mostrarModalCliente('Añadir Cliente', editarClienteHTML({}));
      document.getElementById('form-editar-cliente').onsubmit = function(ev) {
        ev.preventDefault();
        const data = Object.fromEntries(new FormData(this));
        // Por defecto, estado activo
        data.estado = 'activo';
        data.estadoCliente = 'activo';
        // Fecha de registro automática (YYYY-MM-DD)
        const hoy = new Date();
        data.fechaRegistro = hoy.toISOString().slice(0, 10);
        // Vencimiento se deja vacío, se calculará luego según el plan
        data.fechaVencimientoServicio = '';
        agregarCliente(data);
        document.getElementById('modal-cliente').style.display = 'none';
      };
    });
  }
});

// Añadir cliente
function agregarCliente(data) {
  window.firestoreCRUD.add('usuarios', data)
    .then(() => alert('Cliente añadido correctamente'))
    .catch(err => alert('Error al añadir cliente: ' + err.message));
}

function editarCliente(id, data) {
  window.firestoreCRUD.update('usuarios', id, data)
    .then(() => alert('Cliente actualizado'))
    .catch(err => alert('Error al actualizar cliente: ' + err.message));
}

function eliminarCliente(id) {
  if (!confirm('¿Seguro que deseas eliminar este cliente?')) return;
  window.firestoreCRUD.delete('usuarios', id)
    .then(() => alert('Cliente eliminado'))
    .catch(err => alert('Error al eliminar cliente: ' + err.message));
}

// Ejemplo de uso en el panel (ajusta según tu UI):
// agregarCliente({nombres: 'Nuevo', ...})
// editarCliente(id, {nombres: 'Editado', ...})
// eliminarCliente(id)
