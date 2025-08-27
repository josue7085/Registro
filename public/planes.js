

function renderTablaPlanes() {
  const tbody = document.getElementById('tabla-planes-body');
  if (!tbody) return;
  const planes = window.datosGlobales.planes;
  // Detectar si el usuario es técnico (solo lectura)
  const urlParams = new URLSearchParams(window.location.search);
  const esTecnico = urlParams.get('rol') === 'tecnico';
  tbody.innerHTML = planes.map(plan => `
    <tr>
      <td>${plan.nombre}</td>
      <td>${plan.velocidad}</td>
      <td>${plan.precio}</td>
      <td>${plan.fechaCorte || ''}</td>
      <td class="acciones">
        <button class="icon-btn btn-ver-plan" title="Ver" data-id="${plan.id}"><i class="fa fa-eye"></i></button>
        ${!esTecnico ? `<button class="icon-btn btn-editar-plan" title="Editar" data-id="${plan.id}"><i class="fa fa-pen"></i></button>` : ''}
        ${!esTecnico ? `<button class="icon-btn btn-eliminar-plan" title="Eliminar" data-id="${plan.id}"><i class="fa fa-trash"></i></button>` : ''}
      </td>
    </tr>
  `).join('');
}

document.addEventListener('DOMContentLoaded', function() {
  renderTablaPlanes();
  document.addEventListener('planesActualizados', renderTablaPlanes);
  // Evento para añadir nuevo plan
  const btnNuevoPlan = document.getElementById('btn-nuevo-plan');
  if (btnNuevoPlan) {
    btnNuevoPlan.onclick = function() {
      mostrarModalPlan('Añadir Nuevo Plan', editarPlanHTML({nombre:'', velocidad:'', precio:''}), true);
    };
  }
  // Asignar eventos a los iconos
  document.getElementById('tabla-planes-body').addEventListener('click', function(e) {
    const btn = e.target.closest('button');
    if (!btn) return;
    const id = btn.dataset.id;
    const plan = window.datosGlobales.planes.find(p => p.id == id);
    if (btn.classList.contains('btn-ver-plan')) {
      mostrarModalPlan('Información de Plan', infoPlanHTML(plan));
    }
    if (btn.classList.contains('btn-editar-plan')) {
      mostrarModalPlan('Editar Plan', editarPlanHTML(plan));
      document.getElementById('form-editar-plan').onsubmit = function(ev) {
        ev.preventDefault();
        const data = Object.fromEntries(new FormData(this));
        Object.assign(plan, data);
        editarPlan(plan.id, data);
        renderTablaPlanes();
        document.getElementById('modal-plan').style.display = 'none';
      };
    }
    if (btn.classList.contains('btn-eliminar-plan')) {
      eliminarPlan(id);
    }
  });
});

function mostrarModalPlan(titulo, contenido, esNuevo) {
  let modal = document.getElementById('modal-plan');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'modal-plan';
    modal.className = 'modal-cliente';
    modal.innerHTML = '<div class="modal-content" id="modal-content-plan"></div>';
    document.body.appendChild(modal);
    modal.addEventListener('click', function(e) {
      if (e.target === modal) modal.style.display = 'none';
    });
  }
  document.getElementById('modal-content-plan').innerHTML = `<h3>${titulo}</h3>${contenido}<div style='text-align:right; margin-top:18px;'><button class='btn-cerrar-modal-plan'>Cerrar</button></div>`;
  modal.style.display = 'flex';
  document.querySelector('.btn-cerrar-modal-plan').onclick = function() {
    modal.style.display = 'none';
  };
  if (esNuevo) {
    document.getElementById('form-editar-plan').onsubmit = function(ev) {
      ev.preventDefault();
      const data = Object.fromEntries(new FormData(this));
      // No asignar id manual, Firestore lo genera automáticamente
      agregarPlan(data);
      renderTablaPlanes();
      modal.style.display = 'none';
      document.dispatchEvent(new Event('planesActualizados'));
    };
  }
}

function infoPlanHTML(plan) {
  return `
    <p><b>Nombre:</b> ${plan.nombre}</p>
    <p><b>Velocidad:</b> ${plan.velocidad}</p>
    <p><b>Precio:</b> ${plan.precio}</p>
    <p><b>Fecha de corte:</b> ${plan.fechaCorte || ''}</p>
  `;
}

function editarPlanHTML(plan) {
  return `
    <form id='form-editar-plan'>
      <label>Nombre:<br><input name='nombre' value='${plan.nombre || ''}' required></label><br><br>
      <label>Velocidad:<br><input name='velocidad' value='${plan.velocidad || ''}' required></label><br><br>
      <label>Precio:<br><input name='precio' value='${plan.precio || ''}' required></label><br><br>
      <label>Fecha de corte:<br><input type='date' name='fechaCorte' value='${plan.fechaCorte || ''}' required></label><br><br>
      <button type='submit' class='btn-guardar'>Guardar</button>
    </form>
  `;
}

// Al modificar planes:
// window.datosGlobales.planes = [...];
// document.dispatchEvent(new Event('planesActualizados'));

// Añadir plan
function agregarPlan(data) {
  window.firestoreCRUD.add('planes', data)
    .then(() => alert('Plan añadido correctamente'))
    .catch(err => alert('Error al añadir plan: ' + err.message));
}

// Editar plan
function editarPlan(id, data) {
  window.firestoreCRUD.update('planes', id, data)
    .then(() => alert('Plan actualizado'))
    .catch(err => alert('Error al actualizar plan: ' + err.message));
}

// Eliminar plan
function eliminarPlan(id) {
  if (!confirm('¿Seguro que deseas eliminar este plan?')) return;
  window.firestoreCRUD.delete('planes', id)
    .then(() => alert('Plan eliminado'))
    .catch(err => alert('Error al eliminar plan: ' + err.message));
}

// Ejemplo de uso en el panel (ajusta según tu UI):
// agregarPlan({nombre: 'Nuevo', ...})
// editarPlan(id, {nombre: 'Editado', ...})
// eliminarPlan(id)
