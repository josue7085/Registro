// WIFI-FLASH-REGISTRO/firebase-config.js

const firebaseConfig = {
  apiKey: "AIzaSyBH3986L1bhFZtFJLWER6X8cGnnr0Py53k",
  authDomain: "formulario-wifi-flash.firebaseapp.com",
  projectId: "formulario-wifi-flash",
  storageBucket: "formulario-wifi-flash.appspot.com", // Corregí esto, usualmente es .appspot.com para storageBucket
  messagingSenderId: "1081925680281",
  appId: "1:1081925680281:web:a2925a71daf96d2ea40c08"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
