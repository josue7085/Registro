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
            document.getElementById('bandeja-notificaciones')
        ];
        modales.forEach(m => { if (m) m.style.display = 'none'; });
        document.body.style.overflow = '';
    }
    // Notificaciones reales desde Firestore
    let uidCliente = null;
    function getNotificacionesCliente() {
        const todas = window.datosGlobales && Array.isArray(window.datosGlobales.notificaciones)
            ? window.datosGlobales.notificaciones : [];
        // Filtrar solo las del cliente autenticado usando uid
        if (!uidCliente) return [];
        return todas.filter(n => n.destinatario === uidCliente || n.destinatario === 'Todos');
    }
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
        const notificaciones = getNotificacionesCliente();
        if (notificaciones.length === 0) {
            sinBandejaNotif.style.display = 'block';
        } else {
            sinBandejaNotif.style.display = 'none';
            notificaciones.forEach(n => {
                const li = document.createElement('li');
                li.innerHTML = `<i class='fa-solid fa-bell'></i> <b>${n.titulo}:</b> ${n.mensaje}`;
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
            const notificaciones = getNotificacionesCliente();
            notifBadge.style.display = notificaciones.length > 0 ? 'inline-block' : 'none';
            notifBadge.textContent = notificaciones.length;
        }
        if (chatBadge) {
            chatBadge.style.display = 'inline-block';
            chatBadge.textContent = '1'; // Simulación
        }
    }
    actualizarContadorNotif();
    // --- Cargar datos reales del cliente autenticado desde Firestore ---
    let datosCliente = null;
    let pagosCliente = [];
    const pagosDiv = document.getElementById('historial-pagos');
    // Esperar a que Firebase Auth esté listo
    firebase.auth().onAuthStateChanged(async function(user) {
        if (!user) {
            window.location.href = 'index.html';
            return;
        }
        uidCliente = user.uid;
        // Buscar cliente por correo
        const snap = await db.collection('usuarios').where('correo', '==', user.email).limit(1).get();
        if (snap.empty) {
            alert('No se encontró información de cliente.');
            return;
        }
        datosCliente = snap.docs[0].data();

        // Función para mostrar datos del cliente con los planes ya cargados
        function mostrarDatosClienteConPlan() {
            let plan = null;
            if (window.datosGlobales && Array.isArray(window.datosGlobales.planes) && datosCliente.planServicioId) {
                plan = window.datosGlobales.planes.find(p => p.id === datosCliente.planServicioId);
            }
            // Saludo personalizado
            const nombreCompleto = (datosCliente.nombres || '') + ' ' + (datosCliente.apellidos || '');
            document.getElementById('nombre-cliente').textContent = nombreCompleto;
            const bienvenida = document.getElementById('bienvenida-cliente');
            if (bienvenida) bienvenida.innerHTML = `¡Hola, <span id="nombre-cliente">${nombreCompleto}</span>!`;
            document.getElementById('estado-servicio').textContent = (datosCliente.estadoCliente || 'Desconocido').charAt(0).toUpperCase() + (datosCliente.estadoCliente || 'Desconocido').slice(1);
            document.getElementById('plan-servicio').textContent = plan ? plan.nombre : (datosCliente.planServicioNombre || datosCliente.planServicioId || '---');
            document.getElementById('fecha-vencimiento').textContent = plan && plan.fechaCorte ? plan.fechaCorte : (datosCliente.fechaVencimientoServicio || '--/--/----');
            document.getElementById('precio-plan').textContent = plan && plan.precio ? `$ ${plan.precio} / Bs. ${plan.precioBs || '--'}` : (datosCliente.precioDolar && datosCliente.precioBs ? `$ ${datosCliente.precioDolar} / Bs. ${datosCliente.precioBs}` : '$ -- / Bs. --');
            document.getElementById('ciudad-cliente').textContent = datosCliente.ciudad || '';
            document.getElementById('direccion-cliente').textContent = datosCliente.direccion || '';
            // Badge color según estado
            const badge = document.getElementById('estado-servicio');
            badge.className = 'badge ' + (datosCliente.estadoCliente === 'activo' ? 'badge-activo' : 'badge-inactivo');
        }

        // Si los planes ya están cargados, mostrar de una vez
        if (window.datosGlobales && Array.isArray(window.datosGlobales.planes) && window.datosGlobales.planes.length > 0) {
            mostrarDatosClienteConPlan();
        } else {
            // Esperar a que se carguen los planes
            document.addEventListener('planesActualizados', mostrarDatosClienteConPlan, { once: true });
        }

        // Cargar pagos desde subcolección pagos
                                // Escuchar pagos del cliente en la colección global 'pagos'
                                db.collection('pagos').where('clienteId', '==', user.uid).orderBy('fecha', 'desc')
                                    .onSnapshot((snapPagos) => {
                                        pagosCliente = snapPagos.docs.map(d => d.data());
                                        renderPagosCliente();
                                    });
    });

    function renderPagosCliente() {
        // Limpiar solo el contenido, no el nodo
        pagosDiv.innerHTML = '';
        if (!pagosCliente || pagosCliente.length === 0) {
            pagosDiv.innerHTML = '<p style="opacity:0.7;">No hay pagos registrados.</p>';
            return;
        }
        pagosCliente.forEach((pago, idx) => {
            const pagoEl = document.createElement('div');
            pagoEl.className = 'pago-item';
            let estado = pago.estado ? pago.estado.toLowerCase() : '';
            let colorClass = '';
            if (estado === 'rechazado') colorClass = 'badge-rojo';
            else if (estado === 'pendiente') colorClass = 'badge-amarillo';
            else if (estado === 'verificado') colorClass = 'badge-verde';
            let badgeClass = `badge ${colorClass}`;
            let clickable = estado === 'rechazado' ? ` style='cursor:pointer;' data-idx='${idx}'` : '';
            let html = `<b>${pago.fecha || ''}</b> - Bs. ${pago.monto || ''} - Ref: ${pago.referencia || ''} <span class='${badgeClass}'${clickable}>${pago.estado ? pago.estado.charAt(0).toUpperCase() + pago.estado.slice(1) : ''}</span>`;
            if (estado === 'rechazado' && pago.motivoRechazo) {
                html += `<br><span class='motivo-rechazo'><i class='fa-solid fa-circle-exclamation'></i> <b>Motivo:</b> ${pago.motivoRechazo}</span>`;
            }
            pagoEl.innerHTML = html;
            pagosDiv.appendChild(pagoEl);
        });
        // Delegación de eventos para badge 'Rechazado'
        pagosDiv.onclick = function(e) {
            const badge = e.target.closest('.badge-rojo');
            if (badge && badge.hasAttribute('data-idx')) {
                const idx = badge.getAttribute('data-idx');
                // Abrir modal y cargar datos del pago rechazado
                const modal = document.getElementById('modal-correccion');
                const cerrarModal = document.getElementById('cerrar-modal-correccion');
                const formCorreccion = document.getElementById('form-correccion-pago');
                const inputRef = document.getElementById('corregir-referencia');
                const inputMonto = document.getElementById('corregir-monto');
                const inputComp = document.getElementById('corregir-comprobante');
                if (!modal || !formCorreccion || !inputRef || !inputMonto) return;
                // Cargar datos actuales
                inputRef.value = pagosCliente[idx].referencia || '';
                inputMonto.value = pagosCliente[idx].monto || '';
                inputComp.value = '';
                modal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
                // Cerrar modal
                cerrarModal.onclick = function() {
                    modal.style.display = 'none';
                    document.body.style.overflow = '';
                };
                window.addEventListener('keydown', function(e) {
                    if (e.key === 'Escape' && modal.style.display === 'flex') {
                        modal.style.display = 'none';
                        document.body.style.overflow = '';
                    }
                });
                modal.addEventListener('click', function(e) {
                    if (e.target === modal) {
                        modal.style.display = 'none';
                        document.body.style.overflow = '';
                    }
                });
                // Por ahora solo interfaz, sin guardar
                formCorreccion.onsubmit = function(ev) {
                    ev.preventDefault();
                    const nuevaRef = inputRef.value.trim();
                    const nuevoMonto = parseFloat(inputMonto.value);
                    // const comprobante = inputComp.files[0]; // para futura integración
                    if (nuevaRef.length < 4 || isNaN(nuevoMonto) || nuevoMonto <= 0) {
                        alert('Referencia y monto válidos son obligatorios.');
                        return;
                    }
                    // Actualizar en Firestore
                    firebase.auth().onAuthStateChanged(async function(user) {
                        if (!user) return;
                        // Buscar el pago por índice en la consulta actual
                        const pagosSnap = await db.collection('pagos')
                          .where('clienteId', '==', user.uid)
                          .orderBy('fecha', 'desc')
                          .get();
                        const pagoDoc = pagosSnap.docs[idx];
                        if (!pagoDoc) {
                            alert('No se encontró el pago a corregir.');
                            return;
                        }
                        await db.collection('pagos').doc(pagoDoc.id).update({
                            referencia: nuevaRef,
                            monto: nuevoMonto,
                            estado: 'pendiente',
                            motivoRechazo: null
                        });
                        modal.style.display = 'none';
                        document.body.style.overflow = '';
                        alert('¡Corrección enviada y guardada en Firestore!');
                    });
                };
            }
        };
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
        // Mostrar solo los campos del método seleccionado y quitar required de los ocultos
        camposPagoMovil.style.display = this.value === 'pago-movil' ? 'block' : 'none';
        camposTransferencia.style.display = this.value === 'transferencia' ? 'block' : 'none';
        camposEfectivo.style.display = this.value === 'efectivo' ? 'block' : 'none';
        // Quitar required de todos los campos de métodos
        [
            ...camposPagoMovil.querySelectorAll('input,select'),
            ...camposTransferencia.querySelectorAll('input,select'),
            ...camposEfectivo.querySelectorAll('input,select')
        ].forEach(el => el.required = false);
        // Poner required solo a los visibles
        if (this.value === 'pago-movil') {
            camposPagoMovil.querySelectorAll('input,select').forEach(el => el.required = true);
        } else if (this.value === 'transferencia') {
            camposTransferencia.querySelectorAll('input,select').forEach(el => el.required = true);
        } else if (this.value === 'efectivo') {
            camposEfectivo.querySelectorAll('input,select').forEach(el => el.required = true);
        }
    });

    formNuevoPago.addEventListener('submit', function(e) {
        e.preventDefault();
        const metodo = selectMetodo.value;
        // Generar número de pago igual que en admin
        function generarNumeroPago() {
            const fecha = new Date().toISOString().slice(0,10).replace(/-/g,'');
            const random = Math.floor(Math.random()*9000+1000); // 4 dígitos aleatorios
            return `${random}-${fecha}`;
        }
        let pago = {
            numero: generarNumeroPago(),
            fecha: new Date().toISOString().slice(0,10),
            estado: 'Pendiente'
        };
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
        // Guardar el pago en Firestore en la subcolección 'pagos' del usuario y en la colección global 'pagos'
                                firebase.auth().onAuthStateChanged(async function(user) {
                                        if (!user) return;
                                        try {
                                                // Usar siempre el UID real del usuario autenticado
                                                const userId = user.uid;
                                                // Añadir info de usuario al pago para la colección global
                                                const pagoGlobal = Object.assign({}, pago, {
                                                        clienteId: userId,
                                                        clienteCorreo: user.email
                                                });
                                                // Guardar solo en colección global y loguear resultado
                                                await db.collection('pagos').add(pagoGlobal)
                                                    .then(docRef => {
                                                        console.log('Pago guardado en colección global pagos:', docRef.id);
                                                    })
                                                    .catch(err => {
                                                        console.error('Error al guardar en colección global pagos:', err);
                                                        alert('Error al guardar en colección global pagos: ' + err.message);
                                                        throw err;
                                                    });
                                                cerrarModalPago();
                                                alert('Pago registrado correctamente.');
                                        } catch (err) {
                                                alert('Error al registrar el pago: ' + err.message);
                                                console.error('Error completo al registrar el pago:', err);
                                        }
                                });
    });

    // Modal corrección de pago
    // Modal corrección de pago
    // ...eliminado: toda la lógica y modal de corrección de pagos...
});
