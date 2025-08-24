// datos.js
// Centraliza los datos globales y utilidades para todo el admin

// Datos globales (simulados, luego se conectarán a Firestore)
window.datosGlobales = {
    clientes: [],
    planes: [],
    recibos: [],
    pagos: [],
    historialPagos: [],
    notificaciones: [],
    mensajesChat: [],
    empresaInfo: { nombre: '', rif: '', direccion: '', telefono: '', email: '' }
};

// Utilidades para obtener y actualizar datos globales
window.getClientes = () => window.datosGlobales.clientes;
window.getPlanes = () => window.datosGlobales.planes;
window.getRecibos = () => window.datosGlobales.recibos;
window.getPagos = () => window.datosGlobales.pagos;
window.getHistorialPagos = () => window.datosGlobales.historialPagos;
window.getNotificaciones = () => window.datosGlobales.notificaciones;
window.getMensajesChat = () => window.datosGlobales.mensajesChat;
window.getEmpresaInfo = () => window.datosGlobales.empresaInfo;

window.setClientes = arr => window.datosGlobales.clientes = arr;
window.setPlanes = arr => window.datosGlobales.planes = arr;
window.setRecibos = arr => window.datosGlobales.recibos = arr;
window.setPagos = arr => window.datosGlobales.pagos = arr;
window.setHistorialPagos = arr => window.datosGlobales.historialPagos = arr;
window.setNotificaciones = arr => window.datosGlobales.notificaciones = arr;
window.setMensajesChat = arr => window.datosGlobales.mensajesChat = arr;
window.setEmpresaInfo = obj => window.datosGlobales.empresaInfo = obj;

// Utilidad para actualizar selectores cuando cambian clientes o planes
document.addEventListener('clientesActualizados', () => {
    if (typeof renderClientesChat === 'function') renderClientesChat();
    if (typeof renderTablaRecibos === 'function') renderTablaRecibos();
    if (typeof renderTablaPagos === 'function') renderTablaPagos();
});
document.addEventListener('planesActualizados', () => {
    if (typeof renderTablaRecibos === 'function') renderTablaRecibos();
    if (typeof renderTablaClientes === 'function') renderTablaClientes();
});
