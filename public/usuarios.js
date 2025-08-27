// usuarios.js
// Panel de usuarios: muestra solo admin y tecnico

function renderTablaUsuarios(filtro = '') {
    const tbody = document.getElementById('tabla-usuarios-body');
    const contador = document.getElementById('contador-usuarios');
    if (!tbody) return;
    tbody.innerHTML = '';
    let usuarios = (window.getClientes && window.getClientes().filter(u => u.rol === 'admin' || u.rol === 'tecnico')) || [];
    if (filtro.trim()) {
        const f = filtro.trim().toLowerCase();
        usuarios = usuarios.filter(u =>
            (u.nombres && u.nombres.toLowerCase().includes(f)) ||
            (u.apellidos && u.apellidos.toLowerCase().includes(f)) ||
            (u.cedula && u.cedula.toLowerCase().includes(f)) ||
            (u.ipAsignada && u.ipAsignada.toLowerCase().includes(f))
        );
    }
    usuarios.forEach(usuario => {
        tbody.innerHTML += `
            <tr>
                <td>${usuario.nombres}</td>
                <td>${usuario.apellidos}</td>
                <td>${usuario.cedula}</td>
                <td>${usuario.rol}</td>
                <td>${usuario.ipAsignada || ''}</td>
                <td>
                    <button class="btn-editar">Editar</button>
                    <button class="btn-eliminar">Eliminar</button>
                </td>
            </tr>
        `;
    });
    if (contador) contador.textContent = `Total: ${usuarios.length}`;
}

document.addEventListener('DOMContentLoaded', function() {
    const usuariosMenu = document.getElementById('usuarios-menu');
    const panelUsuarios = document.getElementById('panel-usuarios');
    const busquedaInput = document.getElementById('busqueda-usuarios');
    if (usuariosMenu && panelUsuarios) {
        usuariosMenu.addEventListener('click', function() {
            document.querySelectorAll('.admin-panel').forEach(p => p.style.display = 'none');
            panelUsuarios.style.display = 'block';
            renderTablaUsuarios();
        });
    }
    if (busquedaInput) {
        busquedaInput.addEventListener('input', function() {
            renderTablaUsuarios(this.value);
        });
    }
    document.addEventListener('clientesActualizados', function() {
        renderTablaUsuarios(busquedaInput ? busquedaInput.value : '');
    });
});
