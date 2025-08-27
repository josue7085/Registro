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

// --- FIRESTORE SYNC ---
window.firestoreSync = {
    listeners: {},
    listenCollection: function (col, setter) {
        if (!window.db) return;
        if (this.listeners[col]) this.listeners[col](); // Detener listener anterior
        this.listeners[col] = db.collection(col).onSnapshot(snap => {
            const arr = [];
            snap.forEach(doc => arr.push({ id: doc.id, ...doc.data() }));
            setter(arr);
            document.dispatchEvent(new Event(col + 'Actualizados'));
        });
    },
    stopAll: function () {
        Object.values(this.listeners).forEach(unsub => unsub && unsub());
        this.listeners = {};
    }
};

// Sincronización en tiempo real con Firestore
window.addEventListener('DOMContentLoaded', function() {
    window.firestoreSync.listenCollection('usuarios', setClientes);
    window.firestoreSync.listenCollection('planes', setPlanes);
    window.firestoreSync.listenCollection('recibos', setRecibos);
    window.firestoreSync.listenCollection('pagos', setPagos);
    window.firestoreSync.listenCollection('notificaciones', setNotificaciones);
    window.firestoreSync.listenCollection('mensajesChat', setMensajesChat);
    window.firestoreSync.listenCollection('empresaInfo', arr => setEmpresaInfo(arr[0]||{}));
});

// --- FIRESTORE CRUD UTILS ---
window.firestoreCRUD = {
    add: (col, data) => db.collection(col).add(data),
    set: (col, id, data) => db.collection(col).doc(id).set(data),
    update: (col, id, data) => db.collection(col).doc(id).update(data),
    delete: (col, id) => db.collection(col).doc(id).delete()
};

// Ejemplo de uso:
// window.firestoreCRUD.add('clientes', {nombres: 'Nuevo', ...})
// window.firestoreCRUD.set('clientes', id, {...})
// window.firestoreCRUD.update('clientes', id, {campo: valor})
// window.firestoreCRUD.delete('clientes', id)
