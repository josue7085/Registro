document.addEventListener('DOMContentLoaded', function() {
    // --- BANDEJA DE CHAT ---
    const bandejaChat = document.getElementById('bandeja-chat');
    const cerrarBandejaChat = document.getElementById('cerrar-bandeja-chat');
    const listaBandejaChat = document.getElementById('lista-bandeja-chat');
    const sinBandejaChat = document.getElementById('sin-bandeja-chat');
    const iconChat = document.getElementById('icon-chat');
    const formChat = document.getElementById('form-chat');
    const inputChat = document.getElementById('input-chat');

    // Mensajes simulados
    let mensajesChat = [
        { de: 'admin', texto: '¡Hola! ¿En qué podemos ayudarte?' },
        { de: 'yo', texto: 'Tengo una duda sobre mi pago.' }
    ];

    function renderizarChat() {
        listaBandejaChat.innerHTML = '';
        if (mensajesChat.length === 0) {
            sinBandejaChat.style.display = 'block';
        } else {
            sinBandejaChat.style.display = 'none';
            mensajesChat.forEach(m => {
                const li = document.createElement('li');
                li.style.marginBottom = '8px';
                li.style.textAlign = m.de === 'yo' ? 'right' : 'left';
                li.innerHTML = m.de === 'yo'
                    ? `<span style=\"background:#e3f2fd;color:#1976d2;padding:6px 12px;border-radius:12px 12px 2px 12px;display:inline-block;max-width:80%;\">${m.texto}</span>`
                    : `<span style=\"background:#fff3e0;color:#e53935;padding:6px 12px;border-radius:12px 12px 12px 2px;display:inline-block;max-width:80%;\"><i class='fa-solid fa-user-shield'></i> ${m.texto}</span>`;
                listaBandejaChat.appendChild(li);
            });
            listaBandejaChat.scrollTop = listaBandejaChat.scrollHeight;
        }
    }

    function mostrarBandejaChat() {
        cerrarTodosLosModales();
        renderizarChat();
        bandejaChat.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
    function cerrarChat() {
        bandejaChat.style.display = 'none';
        document.body.style.overflow = '';
    }
    setTimeout(() => {
        const iconChat = document.getElementById('icon-chat');
        if (iconChat) iconChat.addEventListener('click', mostrarBandejaChat);
    }, 0);
    if (cerrarBandejaChat) cerrarBandejaChat.addEventListener('click', cerrarChat);
    window.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && bandejaChat && bandejaChat.style.display === 'block') cerrarChat();
    });
    document.addEventListener('mousedown', function(e) {
        if (bandejaChat.style.display === 'block' && !bandejaChat.contains(e.target) && e.target !== iconChat) {
            cerrarChat();
        }
    });
    if (formChat) {
        formChat.addEventListener('submit', function(e) {
            e.preventDefault();
            const texto = inputChat.value.trim();
            if (texto.length > 0) {
                mensajesChat.push({ de: 'yo', texto });
                renderizarChat();
                inputChat.value = '';
            }
        });
    }
    // Función de cerrar sesión
    function cerrarSesion() {
        if (confirm('¿Seguro que deseas cerrar sesión?')) {
            // Aquí puedes limpiar datos de sesión/localStorage si usas autenticación real
            window.location.href = 'index.html'; // Redirige a la página de inicio/login
        }
    }
    // Asignar evento al icono de cerrar sesión
    setTimeout(() => {
        const iconCerrar = document.getElementById('icon-cerrar-sesion');
        if (iconCerrar) {
            iconCerrar.addEventListener('click', cerrarSesion);
        }
    }, 0);
    // Utilidad para cerrar todos los modales
    function cerrarTodosLosModales() {
        const modales = [
            document.getElementById('modal-nuevo-pago'),
            document.getElementById('modal-correccion'),
            document.getElementById('bandeja-notificaciones')
        ];
        modales.forEach(m => { if (m) m.style.display = 'none'; });
        document.body.style.overflow = '';
    }
    // Notificaciones de ejemplo (simulación)
    let notificaciones = [
        { icon: 'fa-bolt', texto: '¡Tu pago de agosto fue aprobado!' },
        { icon: 'fa-exclamation-circle', texto: 'Recuerda que tu servicio vence el 30/09/2025.' }
    ];
    // Insertar iconos de notificación y chat en la esquina superior derecha (declaración única)
    const iconos = `
        <span class="icono-con-contador">
            <i class="fa-regular fa-comments" id="icon-chat" title="Chat con administración"></i>
        </span>
        <span class="icono-con-contador">
            <i class="fa-regular fa-bell" id="icon-notificaciones" title="Notificaciones"></i>
            <span class="contador-notif" id="contador-notif" style="display:none;">1</span>
        </span>
        <span class="icono-con-contador">
            <i class="fa-solid fa-right-from-bracket" id="icon-cerrar-sesion" title="Cerrar sesión" style="color:#111;font-size:1.7em;"></i>
        </span>
    `;
    const iconosEstado = document.getElementById('iconos-estado');
    if (iconosEstado) iconosEstado.innerHTML = iconos;

    // Bandeja de notificaciones
    const bandejaNotif = document.getElementById('bandeja-notificaciones');
    const cerrarBandejaNotif = document.getElementById('cerrar-bandeja-notif');
    const listaBandejaNotif = document.getElementById('lista-bandeja-notif');
    const sinBandejaNotif = document.getElementById('sin-bandeja-notif');
    const campana = document.getElementById('icon-notificaciones');

    function mostrarBandejaNotif() {
        cerrarTodosLosModales();
        // Limpiar lista
        listaBandejaNotif.innerHTML = '';
        if (notificaciones.length === 0) {
            sinBandejaNotif.style.display = 'block';
        } else {
            sinBandejaNotif.style.display = 'none';
            notificaciones.forEach(n => {
                const li = document.createElement('li');
                li.innerHTML = `<i class=\"fa-solid ${n.icon}\"></i> ${n.texto}`;
                listaBandejaNotif.appendChild(li);
            });
        }
        bandejaNotif.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
    function cerrarBandeja() {
        bandejaNotif.style.display = 'none';
        document.body.style.overflow = '';
    }
    if (campana) campana.addEventListener('click', mostrarBandejaNotif);
    if (cerrarBandejaNotif) cerrarBandejaNotif.addEventListener('click', cerrarBandeja);
    window.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && bandejaNotif && bandejaNotif.style.display === 'block') cerrarBandeja();
    });
    document.addEventListener('mousedown', function(e) {
        if (bandejaNotif.style.display === 'block' && !bandejaNotif.contains(e.target) && e.target !== campana) {
            cerrarBandeja();
        }
    });

    // Simulación: mostrar contadores si hay notificaciones o mensajes
    function actualizarContadorNotif() {
        const notifBadge = document.getElementById('contador-notif');
        const chatBadge = document.getElementById('contador-chat');
        if (notifBadge) {
            notifBadge.style.display = notificaciones.length > 0 ? 'inline-block' : 'none';
            notifBadge.textContent = notificaciones.length;
        }
        if (chatBadge) {
            chatBadge.style.display = 'inline-block';
            chatBadge.textContent = '1'; // Simulación
        }
    }
    actualizarContadorNotif();
    // Simulación de datos (luego se conectará a Firebase)
    const datosCliente = {
        nombres: 'Yury',
        apellidos: 'Fehr',
        estadoCliente: 'activo',
        fechaVencimientoServicio: '2025-09-30',
        planServicio: 'Plan 50 Mbps',
        precioDolar: 15,
        precioBs: 540,
        ciudad: 'Colonia Tovar',
        direccion: 'Calle Principal, Casa 12',
        pagos: [
            { fecha: '2025-08-01', monto: 15, referencia: '123456', estado: 'aprobado' },
            { fecha: '2025-07-01', monto: 15, referencia: '654321', estado: 'rechazado', motivoRechazo: 'Referencia inválida. Adjunte comprobante legible.' },
            { fecha: '2025-06-01', monto: 15, referencia: '789012', estado: 'pendiente' }
        ]
    };

    document.getElementById('nombre-cliente').textContent = datosCliente.nombres + ' ' + datosCliente.apellidos;
    document.getElementById('estado-servicio').textContent = datosCliente.estadoCliente.charAt(0).toUpperCase() + datosCliente.estadoCliente.slice(1);
    document.getElementById('fecha-vencimiento').textContent = datosCliente.fechaVencimientoServicio;
    document.getElementById('plan-servicio').textContent = datosCliente.planServicio;
    document.getElementById('precio-plan').textContent = `$ ${datosCliente.precioDolar} / Bs. ${datosCliente.precioBs}`;
    document.getElementById('ciudad-cliente').textContent = datosCliente.ciudad;
    document.getElementById('direccion-cliente').textContent = datosCliente.direccion;

    // Badge color según estado
    const badge = document.getElementById('estado-servicio');
    badge.className = 'badge ' + (datosCliente.estadoCliente === 'activo' ? 'badge-activo' : 'badge-inactivo');

    // Historial de pagos
    const pagosDiv = document.getElementById('historial-pagos');
    if (datosCliente.pagos.length > 0) {
        pagosDiv.innerHTML = '';
        datosCliente.pagos.forEach((pago) => {
            const pagoEl = document.createElement('div');
            pagoEl.className = 'pago-item';
            let html = `<b>${pago.fecha}</b> - Bs. ${pago.monto} - Ref: ${pago.referencia} <span class="badge badge-${pago.estado}">${pago.estado.charAt(0).toUpperCase() + pago.estado.slice(1)}</span>`;
            if (pago.estado === 'rechazado' && pago.motivoRechazo) {
                html += `<br><span class="motivo-rechazo"><i class=\"fa-solid fa-circle-exclamation\"></i> <b>Motivo:</b> ${pago.motivoRechazo}</span>`;
                html += ` <button class="btn-corrige-pago" data-idx="${datosCliente.pagos.indexOf(pago)}">Corregir</button>`;
            }
            pagoEl.innerHTML = html;
            pagosDiv.appendChild(pagoEl);
        });
        // Delegación de eventos para botón corregir
        pagosDiv.addEventListener('click', function(e) {
            const btn = e.target.closest('.btn-corrige-pago');
            if (btn) {
                const idx = btn.getAttribute('data-idx');
                mostrarModalCorreccion(idx);
            }
        });
    }

    // Modal y lógica para registrar nuevo pago con métodos dinámicos
    const modalNuevoPago = document.getElementById('modal-nuevo-pago');
    const cerrarModalNuevoPago = document.getElementById('cerrar-modal-nuevo-pago');
    const formNuevoPago = document.getElementById('form-nuevo-pago');
    const selectMetodo = document.getElementById('nuevo-metodo');
    const camposPagoMovil = document.getElementById('campos-pago-movil');
    const camposTransferencia = document.getElementById('campos-transferencia');
    const camposEfectivo = document.getElementById('campos-efectivo');

    document.getElementById('btn-nuevo-pago').addEventListener('click', function() {
    cerrarTodosLosModales();
    formNuevoPago.reset();
    camposPagoMovil.style.display = 'none';
    camposTransferencia.style.display = 'none';
    camposEfectivo.style.display = 'none';
    modalNuevoPago.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    });
    function cerrarModalPago() {
        modalNuevoPago.style.display = 'none';
        document.body.style.overflow = '';
    }
    cerrarModalNuevoPago.addEventListener('click', cerrarModalPago);
    window.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modalNuevoPago.style.display === 'flex') cerrarModalPago();
    });
    modalNuevoPago.addEventListener('click', function(e) {
        if (e.target === modalNuevoPago) cerrarModalPago();
    });

    selectMetodo.addEventListener('change', function() {
        camposPagoMovil.style.display = this.value === 'pago-movil' ? 'block' : 'none';
        camposTransferencia.style.display = this.value === 'transferencia' ? 'block' : 'none';
        camposEfectivo.style.display = this.value === 'efectivo' ? 'block' : 'none';
    });

    formNuevoPago.addEventListener('submit', function(e) {
        e.preventDefault();
        const metodo = selectMetodo.value;
        let pago = { fecha: new Date().toISOString().slice(0,10), estado: 'pendiente' };
        if (metodo === 'pago-movil') {
            pago.metodo = 'Pago Móvil';
            pago.referencia = document.getElementById('pm-referencia').value.trim();
            pago.telefono = document.getElementById('pm-telefono').value.trim();
            pago.cedula = document.getElementById('pm-tipo-cedula').value + document.getElementById('pm-cedula').value.trim();
            pago.banco = document.getElementById('pm-banco').selectedOptions[0].text;
            pago.monto = parseFloat(document.getElementById('pm-monto').value);
            pago.fechaPago = document.getElementById('pm-fecha').value;
            // comprobante: document.getElementById('pm-comprobante').files[0]
            if (!pago.referencia || !pago.telefono || !pago.cedula || !pago.banco || isNaN(pago.monto) || !pago.fechaPago) {
                alert('Completa todos los campos obligatorios de Pago Móvil.');
                return;
            }
        } else if (metodo === 'transferencia') {
            pago.metodo = 'Transferencia';
            pago.referencia = document.getElementById('tr-referencia').value.trim();
            pago.cedula = document.getElementById('tr-tipo-cedula').value + document.getElementById('tr-cedula').value.trim();
            pago.banco = document.getElementById('tr-banco').selectedOptions[0].text;
            pago.monto = parseFloat(document.getElementById('tr-monto').value);
            pago.fechaPago = document.getElementById('tr-fecha').value;
            // comprobante: document.getElementById('tr-comprobante').files[0]
            if (!pago.referencia || !pago.cedula || !pago.banco || isNaN(pago.monto) || !pago.fechaPago) {
                alert('Completa todos los campos obligatorios de Transferencia.');
                return;
            }
        } else if (metodo === 'efectivo') {
            pago.metodo = 'Efectivo';
            pago.monto = parseFloat(document.getElementById('ef-monto').value);
            pago.entregadoA = document.getElementById('ef-entregado').value.trim();
            pago.fechaPago = document.getElementById('ef-fecha').value;
            if (isNaN(pago.monto) || !pago.entregadoA || !pago.fechaPago) {
                alert('Completa todos los campos obligatorios de Efectivo.');
                return;
            }
        } else {
            alert('Selecciona un método de pago.');
            return;
        }
        pago.nota = document.getElementById('nuevo-nota').value.trim();
        datosCliente.pagos.unshift(pago);
        cerrarModalPago();
        location.reload();
    });

    // Modal corrección de pago
    const modal = document.getElementById('modal-correccion');
    const cerrarModal = document.getElementById('cerrar-modal-correccion');
    const formCorreccion = document.getElementById('form-correccion-pago');
    let idxPagoCorregir = null;

    function mostrarModalCorreccion(idx) {
        cerrarTodosLosModales();
        idxPagoCorregir = idx;
        // Limpiar campos
        formCorreccion.reset();
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
    function cerrarModalCorreccion() {
        modal.style.display = 'none';
        document.body.style.overflow = '';
        idxPagoCorregir = null;
    }
    cerrarModal.addEventListener('click', cerrarModalCorreccion);
    window.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'flex') cerrarModalCorreccion();
    });
    modal.addEventListener('click', function(e) {
        if (e.target === modal) cerrarModalCorreccion();
    });

    formCorreccion.addEventListener('submit', function(e) {
        e.preventDefault();
        // Simulación: actualizar el pago en datosCliente y recargar la vista
        const nuevaRef = document.getElementById('corregir-referencia').value.trim();
        const nota = document.getElementById('corregir-nota').value.trim();
        // (No se sube archivo en la demo)
        if (nuevaRef.length < 4) {
            alert('La referencia debe tener al menos 4 caracteres.');
            return;
        }
        if (idxPagoCorregir !== null) {
            datosCliente.pagos[idxPagoCorregir].referencia = nuevaRef;
            datosCliente.pagos[idxPagoCorregir].estado = 'pendiente';
            datosCliente.pagos[idxPagoCorregir].motivoRechazo = undefined;
            // Podrías guardar la nota en un campo adicional si lo deseas
        }
        cerrarModalCorreccion();
        // Recargar historial
        location.reload();
    });
});
