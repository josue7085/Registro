// Lógica básica para menú hamburguesa y dashboard demo

document.addEventListener('DOMContentLoaded', function() {
    // Menú hamburguesa con animación de giro y fade
    const sidebar = document.getElementById('sidebar');
    const menuToggleHeader = document.getElementById('menu-toggle-header');
    const menuToggleSidebar = document.getElementById('menu-toggle-sidebar');
    const iconHamburguesaHeader = menuToggleHeader ? menuToggleHeader.querySelector('i') : null;
    const iconHamburguesaSidebar = menuToggleSidebar ? menuToggleSidebar.querySelector('i') : null;

    function showSidebar() {
        sidebar.classList.remove('closed');
        sidebar.classList.remove('fade-out');
        sidebar.style.display = 'flex';
        // Forzar reflow para que la animación se aplique correctamente
        void sidebar.offsetWidth;
        sidebar.classList.add('fade-in');
        if (iconHamburguesaHeader) iconHamburguesaHeader.classList.add('rotated');
        if (iconHamburguesaSidebar) iconHamburguesaSidebar.classList.add('rotated');
        document.body.classList.add('sidebar-open');
    }
    function hideSidebar() {
        sidebar.classList.remove('fade-in');
        sidebar.classList.add('fade-out');
        if (iconHamburguesaHeader) iconHamburguesaHeader.classList.remove('rotated');
        if (iconHamburguesaSidebar) iconHamburguesaSidebar.classList.remove('rotated');
        sidebar.addEventListener('animationend', function handler(e) {
            if (e.animationName === 'sidebarFadeOut') {
                sidebar.style.display = 'none';
                sidebar.classList.add('closed');
                sidebar.removeEventListener('animationend', handler);
                document.body.classList.remove('sidebar-open');
            }
        });
    }
    function toggleSidebar() {
        if (sidebar.style.display === 'flex') {
            hideSidebar();
        } else {
            showSidebar();
        }
    }

    if (menuToggleHeader) menuToggleHeader.addEventListener('click', toggleSidebar);
    if (menuToggleSidebar) menuToggleSidebar.addEventListener('click', hideSidebar);

    // Cerrar barra al hacer clic fuera
    document.addEventListener('mousedown', function(e) {
        if (
            sidebar.style.display === 'flex' &&
            !sidebar.contains(e.target) &&
            !menuToggleHeader.contains(e.target)
        ) {
            hideSidebar();
        }
    });

    // Cerrar sesión
    const btnLogout = document.querySelector('.sidebar-logout');
    if (btnLogout) {
        btnLogout.addEventListener('click', function() {
            if (confirm('¿Seguro que deseas cerrar sesión?')) {
                window.location.href = 'index.html';
            }
        });
    }

    // Demo: datos de dashboard
    document.getElementById('clientes-activos').textContent = 128;
    document.getElementById('clientes-suspendidos').textContent = 7;
    document.getElementById('pagos-verificar').textContent = 4;
    document.getElementById('dinero-usd').textContent = '$1,250';
    document.getElementById('dinero-bs').textContent = 'Bs. 45,000';

    // Demo: gráficas con Chart.js
    if (window.Chart) {
        const ctxClientes = document.getElementById('grafica-clientes').getContext('2d');
        new Chart(ctxClientes, {
            type: 'doughnut',
            data: {
                labels: ['Activos', 'Suspendidos'],
                datasets: [{
                    data: [128, 7],
                    backgroundColor: ['#1976d2', '#e53935'],
                }]
            },
            options: {
                plugins: { legend: { position: 'bottom' } },
                cutout: '70%',
                responsive: true
            }
        });
        const ctxPagos = document.getElementById('grafica-pagos').getContext('2d');
        new Chart(ctxPagos, {
            type: 'bar',
            data: {
                labels: ['Enero', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago'],
                datasets: [{
                    label: 'Pagos',
                    data: [12, 19, 8, 15, 10, 17, 14, 20],
                    backgroundColor: '#1976d2',
                }]
            },
            options: {
                plugins: { legend: { display: false } },
                responsive: true
            }
        });
    }

    // Mostrar panel de clientes y ocultar dashboard y planes
    const clientesMenu = document.getElementById('clientes-menu');
    const panelClientes = document.getElementById('panel-clientes');
    const panelPlanes = document.getElementById('panel-planes');
    const dashboardCards = document.querySelector('.dashboard-cards');
    const dashboardGraphs = document.querySelector('.dashboard-graphs');
    if (clientesMenu && panelClientes) {
        clientesMenu.addEventListener('click', function() {
            panelClientes.style.display = 'block';
            if (panelPlanes) panelPlanes.style.display = 'none';
            if (dashboardCards) dashboardCards.style.display = 'none';
            if (dashboardGraphs) dashboardGraphs.style.display = 'none';
        });
    }
    // Mostrar panel de planes y ocultar dashboard y clientes
    const planesMenu = document.querySelector('.sidebar-menu li i.fa-network-wired')?.parentElement;
    if (planesMenu && panelPlanes) {
        planesMenu.addEventListener('click', function() {
            panelPlanes.style.display = 'block';
            if (panelClientes) panelClientes.style.display = 'none';
            if (dashboardCards) dashboardCards.style.display = 'none';
            if (dashboardGraphs) dashboardGraphs.style.display = 'none';
        });
    }
        // Mostrar panel de recibos y ocultar los demás
        const recibosMenu = document.querySelector('.sidebar-menu li i.fa-file-invoice')?.parentElement;
        const panelRecibos = document.getElementById('panel-recibos');
        if (recibosMenu && panelRecibos) {
            recibosMenu.addEventListener('click', function() {
                panelRecibos.style.display = 'block';
                if (panelClientes) panelClientes.style.display = 'none';
                if (panelPlanes) panelPlanes.style.display = 'none';
                if (dashboardCards) dashboardCards.style.display = 'none';
                if (dashboardGraphs) dashboardGraphs.style.display = 'none';
                if (panelPagos) panelPagos.style.display = 'none';
            });
        }
    // Mostrar panel de pagos y ocultar los demás
    const pagosMenu = document.querySelector('.sidebar-menu li i.fa-money-check-dollar')?.parentElement;
    const panelPagos = document.getElementById('panel-pagos');
    if (pagosMenu && panelPagos) {
        pagosMenu.addEventListener('click', function() {
            panelPagos.style.display = 'block';
            if (panelClientes) panelClientes.style.display = 'none';
            if (panelPlanes) panelPlanes.style.display = 'none';
            if (panelRecibos) panelRecibos.style.display = 'none';
            if (dashboardCards) dashboardCards.style.display = 'none';
            if (dashboardGraphs) dashboardGraphs.style.display = 'none';
            if (panelNotificaciones) panelNotificaciones.style.display = 'none';
        });
    }
    // Mostrar panel de notificaciones y ocultar los demás
    const notificacionesMenu = document.querySelector('.sidebar-menu li i.fa-bell')?.parentElement;
    const panelNotificaciones = document.getElementById('panel-notificaciones');
    if (notificacionesMenu && panelNotificaciones) {
        notificacionesMenu.addEventListener('click', function() {
            panelNotificaciones.style.display = 'block';
            if (panelClientes) panelClientes.style.display = 'none';
            if (panelPlanes) panelPlanes.style.display = 'none';
            if (panelRecibos) panelRecibos.style.display = 'none';
            if (panelPagos) panelPagos.style.display = 'none';
            if (dashboardCards) dashboardCards.style.display = 'none';
            if (dashboardGraphs) dashboardGraphs.style.display = 'none';
            if (panelChat) panelChat.style.display = 'none';
        });
    }
    // Mostrar panel de chat y ocultar los demás
    const chatMenu = document.querySelector('.sidebar-menu li i.fa-comments')?.parentElement;
    const panelChat = document.getElementById('panel-chat');
    if (chatMenu && panelChat) {
        chatMenu.addEventListener('click', function() {
            panelChat.style.display = 'block';
            if (panelClientes) panelClientes.style.display = 'none';
            if (panelPlanes) panelPlanes.style.display = 'none';
            if (panelRecibos) panelRecibos.style.display = 'none';
            if (panelPagos) panelPagos.style.display = 'none';
            if (panelNotificaciones) panelNotificaciones.style.display = 'none';
            if (dashboardCards) dashboardCards.style.display = 'none';
            if (dashboardGraphs) dashboardGraphs.style.display = 'none';
        });
    }
    // Mostrar dashboard y ocultar paneles al hacer clic en 'Inicio'
    const inicioMenu = document.querySelector('.sidebar-menu li i.fa-house')?.parentElement;
    if (inicioMenu) {
        inicioMenu.addEventListener('click', function() {
            if (panelClientes) panelClientes.style.display = 'none';
            if (panelPlanes) panelPlanes.style.display = 'none';
            if (dashboardCards) dashboardCards.style.display = '';
            if (dashboardGraphs) dashboardGraphs.style.display = '';
        });
    }

    // Sidebar navigation
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    const panels = {
        dashboard: document.getElementById('dashboard'),
        clientes: document.getElementById('panel-clientes'),
        planes: document.getElementById('panel-planes'),
        recibos: document.getElementById('panel-recibos')
    };

    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('data-target');
            Object.values(panels).forEach(panel => panel.style.display = 'none');
            if (panels[target]) panels[target].style.display = 'block';
        });
    });
});
