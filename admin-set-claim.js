// admin-set-claim.js
// Script para asignar el claim 'admin: true' a un usuario de Firebase Auth
// Uso: node admin-set-claim.js <UID_DEL_ADMIN>

const admin = require('firebase-admin');

// Inicializa la app con las credenciales por defecto (asegúrate de tener GOOGLE_APPLICATION_CREDENTIALS configurado)
admin.initializeApp({
  credential: admin.credential.applicationDefault()
});

const uid = process.argv[2];

if (!uid) {
  console.error('Debes pasar el UID del usuario admin como argumento. Ejemplo: node admin-set-claim.js <UID>');
  process.exit(1);
}

admin.auth().setCustomUserClaims(uid, { admin: true })
  .then(() => {
    console.log(`¡Claim admin: true asignado al usuario con UID: ${uid}!`);
    process.exit(0);
  })
  .catch(err => {
    console.error('Error al asignar el claim:', err);
    process.exit(1);
  });
