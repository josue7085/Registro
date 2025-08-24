// WIFI-FLASH-REGISTRO/script.js
document.addEventListener('DOMContentLoaded', () => {
    const registroForm = document.getElementById('registroForm');
    const btnRegistrar = document.getElementById('btnRegistrar');
    const mensajeError = document.getElementById('mensajeError');

    const nombresInput = document.getElementById('nombres');
    const apellidosInput = document.getElementById('apellidos');
    const cedulaInput = document.getElementById('cedula');
    const telefonoInput = document.getElementById('telefono');
    const correoInput = document.getElementById('correo');
    const contrasenaInput = document.getElementById('contrasena');
    const verificarContrasenaInput = document.getElementById('verificarContrasena');
    const passwordStrengthDiv = document.getElementById('password-strength');

    const formInputs = [
        nombresInput, apellidosInput, cedulaInput, telefonoInput,
        correoInput, contrasenaInput, verificarContrasenaInput
    ];

    function validarFortalezaContrasena(password) {
        const regexMayuscula = /[A-Z]/;
        const regexNumero = /[0-9]/;
        const regexEspecial = /[!@#$%^&*(),.?":{}|<>_+\-=\[\]\\';/`~]/; // Ampliada lista de especiales
        let strength = 0;
        let messages = [];

        if (password.length < 8) {
            messages.push("Mínimo 8 caracteres.");
        } else {
            strength++;
        }
        if (!regexMayuscula.test(password)) {
            messages.push("Debe contener al menos una letra mayúscula.");
        } else {
            strength++;
        }
        if (!regexNumero.test(password)) {
            messages.push("Debe contener al menos un número.");
        } else {
            strength++;
        }
        if (!regexEspecial.test(password)) {
            messages.push("Debe contener al menos un carácter especial (ej: !@#$%).");
        } else {
            strength++;
        }
        
        passwordStrengthDiv.innerHTML = messages.join("<br>");
        if (password.length > 0 && messages.length > 0) {
            passwordStrengthDiv.style.color = 'red';
        } else if (password.length > 0 && messages.length === 0) {
            passwordStrengthDiv.style.color = 'green';
            passwordStrengthDiv.innerHTML = "Contraseña segura.";
        } else {
            passwordStrengthDiv.innerHTML = ""; // Limpiar si el campo está vacío
        }
        return strength === 4 && password.length >= 8;
    }

    function validarCedula(cedula) {
        const regexCedula = /^[0-9]{7,10}$/; // Solo números, entre 7 y 10 dígitos
        return regexCedula.test(cedula);
    }

    function validarTelefono(telefono) {
        const regexTelefono = /^[0-9]{7,15}$/; // Solo números, entre 7 y 15 dígitos
        return regexTelefono.test(telefono);
    }

    function validarFormulario() {
        let todosLlenos = formInputs.every(input => input.value.trim() !== '');
        let contrasenasCoinciden = contrasenaInput.value === verificarContrasenaInput.value;
        let contrasenaFuerte = validarFortalezaContrasena(contrasenaInput.value);
        // Validar solo si el campo tiene algún valor, para no mostrar error en campos vacíos al inicio
        let cedulaValida = cedulaInput.value.trim() === '' || validarCedula(cedulaInput.value.trim());
        let telefonoValido = telefonoInput.value.trim() === '' || validarTelefono(telefonoInput.value.trim());

        let errorMessages = [];

        if (contrasenaInput.value.trim() !== '' && verificarContrasenaInput.value.trim() !== '' && !contrasenasCoinciden) {
            errorMessages.push("Las contraseñas no coinciden.");
        }
        // Mostrar error de fortaleza solo si hay algo escrito y no es fuerte
        if (contrasenaInput.value.trim() !== '' && !contrasenaFuerte) {
             errorMessages.push("La contraseña no cumple los requisitos de seguridad.");
        }
        if (cedulaInput.value.trim() !== '' && !validarCedula(cedulaInput.value.trim())) { // Validar específicamente si hay contenido
            errorMessages.push("La cédula debe contener solo números y tener entre 7 y 10 dígitos.");
        }
        if (telefonoInput.value.trim() !== '' && !validarTelefono(telefonoInput.value.trim())) { // Validar específicamente si hay contenido
            errorMessages.push("El teléfono debe contener solo números y tener entre 7 y 15 dígitos.");
        }

        if (errorMessages.length > 0) {
            mensajeError.innerHTML = errorMessages.join("<br>");
        } else {
            mensajeError.textContent = ""; 
        }

        // El botón se habilita si todos los campos están llenos Y todas las validaciones específicas (con contenido) son correctas
        btnRegistrar.disabled = !(
            todosLlenos &&
            contrasenasCoinciden &&
            contrasenaFuerte &&
            validarCedula(cedulaInput.value.trim()) && // Aquí sí requerimos que sea válido si está lleno
            validarTelefono(telefonoInput.value.trim()) // Aquí sí requerimos que sea válido si está lleno
        );
    }

    formInputs.forEach(input => input.addEventListener('input', validarFormulario));
    contrasenaInput.addEventListener('input', () => {
        validarFortalezaContrasena(contrasenaInput.value); 
        validarFormulario(); 
    });
     verificarContrasenaInput.addEventListener('input', validarFormulario);


    registroForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        // Re-validar todo antes de enviar, por si acaso
        validarFormulario();
        if (btnRegistrar.disabled) {
            // Si el botón está deshabilitado después de la validación, no continuar.
            // Esto puede ocurrir si el usuario manipuló el DOM para habilitar el botón.
            console.warn("Intento de envío con formulario inválido.");
            return;
        }

        mensajeError.textContent = '';
        btnRegistrar.disabled = true;
        btnRegistrar.textContent = 'Registrando...';

        const nombres = nombresInput.value.trim();
        const apellidos = apellidosInput.value.trim();
        const cedula = cedulaInput.value.trim();
        const telefono = telefonoInput.value.trim();
        const correo = correoInput.value.trim();
        const contrasena = contrasenaInput.value; 

        try {
            const userCredential = await auth.createUserWithEmailAndPassword(correo, contrasena);
            const user = userCredential.user;

            await db.collection('usuarios').doc(user.uid).set({
                nombres: nombres,
                apellidos: apellidos,
                cedula: cedula,
                telefono: telefono,
                correo: correo,
                contrasenaCliente: contrasena, 
                fechaRegistro: firebase.firestore.FieldValue.serverTimestamp()
            });

            window.location.href = 'exito.html';

        } catch (error) {
            console.error("Error al registrar:", error);
            mensajeError.textContent = `Error: ${traducirErrorFirebase(error.code)}`;
            // No re-habilitar el botón inmediatamente si el error es por datos inválidos que ya deberían haber sido capturados.
            // Se re-habilitará cuando el usuario corrija los campos y la función validarFormulario lo permita.
            // btnRegistrar.disabled = false; // Considerar si se debe re-habilitar o no aquí.
            validarFormulario(); // Re-evaluar el estado del botón
            btnRegistrar.textContent = 'Registrar Datos';
        }
    });

    function traducirErrorFirebase(errorCode) {
        switch (errorCode) {
            case 'auth/email-already-in-use':
                return 'El correo electrónico ya está en uso por otra cuenta.';
            case 'auth/invalid-email':
                return 'El formato del correo electrónico no es válido.';
            case 'auth/operation-not-allowed':
                return 'El inicio de sesión por correo electrónico y contraseña no está habilitado.';
            case 'auth/weak-password':
                return 'La contraseña es demasiado débil (Firebase la considera débil, incluso si pasa tu validación).';
            default:
                return 'Ocurrió un error inesperado. Inténtalo de nuevo.';
        }
    }
    validarFormulario(); 
});
