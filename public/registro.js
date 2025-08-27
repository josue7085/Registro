// registro.js
// Validaciones y lógica de registro para inter-Flash

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('register-form');
    const passwordInput = document.getElementById('contrasena');
    const passwordStrength = document.getElementById('password-strength');
    const passwordHelp = document.getElementById('password-help');
    const togglePassword = document.getElementById('toggle-password');
    const toggleConfirmPassword = document.getElementById('toggle-confirm-password');
    const confirmarPassword = document.getElementById('confirmar-contrasena');
    const messageDiv = document.getElementById('register-message');

    // Mostrar/ocultar contraseña
    if (togglePassword) {
        togglePassword.addEventListener('click', () => {
            const icon = togglePassword.querySelector('i');
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    }
    // Mostrar/ocultar confirmación de contraseña
    if (toggleConfirmPassword) {
        toggleConfirmPassword.addEventListener('click', () => {
            const icon = toggleConfirmPassword.querySelector('i');
            if (confirmarPassword.type === 'password') {
                confirmarPassword.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                confirmarPassword.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    }

    // Validación en tiempo real de confirmación de contraseña
    confirmarPassword.addEventListener('input', function() {
        if (passwordInput.value !== confirmarPassword.value) {
            confirmarPassword.style.borderColor = '#e53935';
        } else {
            confirmarPassword.style.borderColor = '#43a047';
        }
    });

    // Barra de fuerza de contraseña
    passwordInput.addEventListener('input', function() {
        const val = passwordInput.value;
        let strength = 0;
        if (val.length >= 8) strength++;
        if (/[A-Z]/.test(val)) strength++;
        if (/[0-9]/.test(val)) strength++;
        if (/[^A-Za-z0-9]/.test(val)) strength++; // cualquier caracter especial
        passwordStrength.style.background = [
            '#e53935', // débil
            '#fbc02d', // media
            '#43a047', // fuerte
            '#1976d2'  // muy fuerte
        ][strength] || '#eee';
        passwordStrength.style.width = (strength * 25) + '%';
    });

    // Validación de formulario
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        messageDiv.textContent = '';
        // Validar campos obligatorios
        const nombres = document.getElementById('nombres').value.trim();
        const apellidos = document.getElementById('apellidos').value.trim();
        const tipoCedula = document.getElementById('tipo-cedula').value;
        const cedula = document.getElementById('cedula').value.trim();
        const correo = document.getElementById('correo').value.trim();
        const telefono = document.getElementById('telefono').value.trim();
        const ciudad = document.getElementById('ciudad').value;
        const direccion = document.getElementById('direccion').value.trim();
        const contrasena = passwordInput.value;

        // Validar cédula
        if (!/^[0-9]{6,10}$/.test(cedula)) {
            messageDiv.textContent = 'Cédula inválida.';
            return;
        }
        // Validar correo
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(correo)) {
            messageDiv.textContent = 'Correo electrónico inválido.';
            return;
        }
        // Validar teléfono (solo requerido, sin formato estricto)
        if (!telefono) {
            messageDiv.textContent = 'El teléfono es obligatorio.';
            return;
        }
        // Validar ciudad
        if (!ciudad) {
            messageDiv.textContent = 'Debes seleccionar una ciudad.';
            return;
        }
        // Validar contraseña
        if (contrasena.length < 8 || !/[A-Z]/.test(contrasena) || !/[0-9]/.test(contrasena) || !/[^A-Za-z0-9]/.test(contrasena)) {
            messageDiv.textContent = 'La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un caracter especial.';
            return;
        }
        // Validar confirmación de contraseña
        if (contrasena !== confirmarPassword.value) {
            messageDiv.textContent = 'Las contraseñas no coinciden.';
            return;
        }
        // Registro real en Firebase
        try {
            const cred = await firebase.auth().createUserWithEmailAndPassword(correo, contrasena);
            const user = cred.user;
            await firebase.firestore().collection('usuarios').doc(user.uid).set({
                nombres,
                apellidos,
                tipoCedula,
                cedula,
                correo,
                telefono,
                ciudad,
                direccion,
                rol: 'cliente',
                estado: 'activo',
                fechaRegistro: new Date(),
                uid: user.uid
            });
            form.reset();
            passwordStrength.style.width = '0%';
            messageDiv.style.color = '#43a047';
            messageDiv.innerHTML = '¡Registro exitoso!<br>Gracias por unirte a nuestra gran familia de <b>inter-Flash</b>.<br>Serás redirigido al inicio de sesión.';
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2500);
        } catch (err) {
            messageDiv.style.color = '#e53935';
            messageDiv.textContent = 'Error: ' + (err.message || 'No se pudo registrar.');
        }
    });
    // Botón de volver al login
    const backLoginBtn = document.getElementById('back-login-btn');
    if (backLoginBtn) {
        backLoginBtn.addEventListener('click', function() {
            window.location.href = 'index.html';
        });
    }
});
