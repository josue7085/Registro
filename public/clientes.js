// Lógica para la gestión de clientes en la pantalla principal

// Datos mock de clientes
window.datosGlobales.clientes = [
  {
    id: 1,
    nombres: "Yury Fehr",
    apellidos: "Apellido1 Apellido2",
    cedula: "16761808",
    telefono: "123456789",
    correo: "yury.fehr@example.com",
    direccion: "Calle Falsa 123",
    ciudad: "Ciudad Ejemplo",
    estadoCliente: "activo",
    rol: "admin",
    planServicioId: "plan123",
    ipAsignada: "192.168.1.2",
    claveHotspot: "clave123",
    contrasenaCliente: "contrasena123",
    notasAdmin: "Nota de ejemplo",
    fechaRegistro: "2023-01-01",
    fechaUltimaModificacion: "2023-10-01",
    fechaVencimientoServicio: "2024-01-01"
  },
  {
    id: 2,
    nombres: "Ana Pérez",
    apellidos: "Apellido3 Apellido4",
    cedula: "12345678",
    telefono: "987654321",
    correo: "ana.perez@example.com",
    direccion: "Avenida Siempre Viva 742",
    ciudad: "Otra Ciudad",
    estadoCliente: "suspendido",
    rol: "usuario",
    planServicioId: "plan456",
    ipAsignada: "192.168.1.10",
    claveHotspot: "clave456",
    contrasenaCliente: "contrasena456",
    notasAdmin: "Otra nota de ejemplo",
    fechaRegistro: "2023-02-01",
    fechaUltimaModificacion: "2023-09-01",
    fechaVencimientoServicio: "2024-02-01"
  }
];

function renderTablaClientes(filtro = '') {
  const tbody = document.getElementById('tabla-clientes-body');
  if (!tbody) return;
  const filtroLower = filtro.trim().toLowerCase();
  const clientes = window.datosGlobales.clientes;
  const filtrados = filtroLower
    ? clientes.filter(c =>
        (c.nombres && c.nombres.toLowerCase().includes(filtroLower)) ||
        (c.cedula && c.cedula.toLowerCase().includes(filtroLower)) ||
        (c.ipAsignada && c.ipAsignada.toLowerCase().includes(filtroLower))
      )
    : clientes;
  tbody.innerHTML = filtrados.map(cliente => `
    <tr>
      <td>${cliente.nombres}</td>
      <td>${cliente.cedula}</td>
      <td>${cliente.ipAsignada}</td>
      <td class="acciones">
        <button class="icon-btn btn-ver" title="Ver" data-id="${cliente.id}"><i class="fa fa-eye"></i></button>
        <button class="icon-btn btn-editar" title="Editar" data-id="${cliente.id}"><i class="fa fa-pen"></i></button>
        <button class="icon-btn btn-estado" title="${cliente.estado === 'activo' ? 'Suspender' : 'Activar'}" data-id="${cliente.id}">
          <i class="fa ${cliente.estado === 'activo' ? 'fa-toggle-on' : 'fa-toggle-off'}"></i>
        </button>
        <span class="estado-label ${cliente.estado === 'activo' ? 'estado-activo' : 'estado-suspendido'}">
          ${cliente.estado === 'activo' ? 'Activo' : 'Suspendido'}
        </span>
      </td>
    </tr>
  `).join('');
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
    <p><b>Plan:</b> ${cliente.planServicioId ? String(cliente.planServicioId) : ''}</p>
    <p><b>IP Asignada:</b> ${cliente.ipAsignada}</p>
    <p><b>Clave Hotspot:</b> ${cliente.claveHotspot}</p>
    <p><b>Contraseña Cliente:</b> ${cliente.contrasenaCliente}</p>
    <p><b>Notas Admin:</b> ${cliente.notasAdmin}</p>
    <p><b>Fecha Registro:</b> ${cliente.fechaRegistro ?? ''}</p>
    <p><b>Última Modificación:</b> ${cliente.fechaUltimaModificacion ?? ''}</p>
    <p><b>Vencimiento Servicio:</b> ${cliente.fechaVencimientoServicio ?? ''}</p>
  `;
}

function editarClienteHTML(cliente) {
  // Usar los planes globales si existen, si no, usar los mock
  const planesDisponibles = (typeof planes !== 'undefined' && Array.isArray(planes)) ? planes : [
    { nombre: 'Básico' },
    { nombre: 'Estándar' },
    { nombre: 'Premium' },
    { nombre: 'Empresarial' }
  ];
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
          ${planesDisponibles.map(p => `<option value='${p.nombre}'${cliente.planServicioId === p.nombre ? ' selected' : ''}>${p.nombre}</option>`).join('')}
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
    const cliente = clientes.find(c => c.id == id);
    if (btn.classList.contains('btn-ver')) {
      mostrarModalCliente('Información de Cliente', infoClienteHTML(cliente));
    }
    if (btn.classList.contains('btn-editar')) {
      mostrarModalCliente('Editar Cliente', editarClienteHTML(cliente));
      document.getElementById('form-editar-cliente').onsubmit = function(ev) {
        ev.preventDefault();
        const data = Object.fromEntries(new FormData(this));
        Object.assign(cliente, data);
        renderTablaClientes(inputBusqueda ? inputBusqueda.value : '');
        document.getElementById('modal-cliente').style.display = 'none';
        // Al modificar clientes:
        window.datosGlobales.clientes = [...clientes];
        document.dispatchEvent(new Event('clientesActualizados'));
      };
    }
    if (btn.classList.contains('btn-estado')) {
      cliente.estado = (cliente.estado === 'activo') ? 'suspendido' : 'activo';
      cliente.estadoCliente = cliente.estado; // Sincroniza ambos campos
      renderTablaClientes(inputBusqueda ? inputBusqueda.value : '');
      // Al modificar clientes:
      window.datosGlobales.clientes = [...clientes];
      document.dispatchEvent(new Event('clientesActualizados'));
    }
  });
});
