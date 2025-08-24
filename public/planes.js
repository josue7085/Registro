// Datos mock de planes de servicio
window.datosGlobales.planes = [
  { id: 1, nombre: "Básico", velocidad: "10 Mbps", precio: "$10" },
  { id: 2, nombre: "Premium", velocidad: "50 Mbps", precio: "$25" }
];

function renderTablaPlanes() {
  const tbody = document.getElementById('tabla-planes-body');
  if (!tbody) return;
  const planes = window.datosGlobales.planes;
  tbody.innerHTML = planes.map(plan => `
    <tr>
      <td>${plan.nombre}</td>
      <td>${plan.velocidad}</td>
      <td>${plan.precio}</td>
      <td class="acciones">
        <button class="icon-btn btn-ver-plan" title="Ver" data-id="${plan.id}"><i class="fa fa-eye"></i></button>
        <button class="icon-btn btn-editar-plan" title="Editar" data-id="${plan.id}"><i class="fa fa-pen"></i></button>
        <button class="icon-btn btn-eliminar-plan" title="Eliminar" data-id="${plan.id}"><i class="fa fa-trash"></i></button>
      </td>
    </tr>
  `).join('');
}

document.addEventListener('DOMContentLoaded', function() {
  renderTablaPlanes();
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
    const plan = planes.find(p => p.id == id);
    if (btn.classList.contains('btn-ver-plan')) {
      mostrarModalPlan('Información de Plan', infoPlanHTML(plan));
    }
    if (btn.classList.contains('btn-editar-plan')) {
      mostrarModalPlan('Editar Plan', editarPlanHTML(plan));
      document.getElementById('form-editar-plan').onsubmit = function(ev) {
        ev.preventDefault();
        const data = Object.fromEntries(new FormData(this));
        Object.assign(plan, data);
        renderTablaPlanes();
        document.getElementById('modal-plan').style.display = 'none';
      };
    }
    if (btn.classList.contains('btn-eliminar-plan')) {
      if (confirm('¿Seguro que deseas eliminar este plan?')) {
        const idx = planes.findIndex(p => p.id == id);
        if (idx !== -1) planes.splice(idx, 1);
        renderTablaPlanes();
      }
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
      data.id = Date.now();
      planes.push(data);
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
  `;
}

function editarPlanHTML(plan) {
  return `
    <form id='form-editar-plan'>
      <label>Nombre:<br><input name='nombre' value='${plan.nombre || ''}' required></label><br><br>
      <label>Velocidad:<br><input name='velocidad' value='${plan.velocidad || ''}' required></label><br><br>
      <label>Precio:<br><input name='precio' value='${plan.precio || ''}' required></label><br><br>
      <button type='submit' class='btn-guardar'>Guardar</button>
    </form>
  `;
}
