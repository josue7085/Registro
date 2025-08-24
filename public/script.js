// --- Textos multilenguaje ---
const translations = {
	es: {
		company: 'inter-Flash',
		welcome: '¡Bienvenido! Gestiona tu cuenta y pagos de internet de forma fácil y segura.<br>Inicia sesión para continuar.',
		loginEmail: 'Correo',
		loginPassword: 'Contraseña',
		loginBtn: 'Entrar',
		registerInvite: '¿No tienes cuenta? <span id="show-register" class="link">Regístrate aquí.</span>',
		registerTitle: 'Registro',
		registerName: 'Nombre completo',
		registerEmail: 'Correo',
		registerPassword: 'Contraseña',
		registerBtn: 'Registrarse',
		backLogin: '¿Ya tienes cuenta? Inicia sesión'
	},
	en: {
		company: 'inter-Flash',
		welcome: 'Welcome! Manage your account and internet payments easily and securely.<br>Sign in to continue.',
		loginEmail: 'Email',
		loginPassword: 'Password',
		loginBtn: 'Sign In',
		registerInvite: `Don't have an account? <span id="show-register" class="link">Register here.</span>`,
		registerTitle: 'Register',
		registerName: 'Full Name',
		registerEmail: 'Email',
		registerPassword: 'Password',
		registerBtn: 'Register',
		backLogin: 'Already have an account? Sign in'
	},
	pt: {
		company: 'inter-Flash',
		welcome: 'Bem-vindo! Gerencie sua conta e pagamentos de internet de forma fácil e segura.<br>Faça login para continuar.',
		loginEmail: 'E-mail',
		loginPassword: 'Senha',
		loginBtn: 'Entrar',
		registerInvite: 'Não tem uma conta? <span id="show-register" class="link">Cadastre-se aqui.</span>',
		registerTitle: 'Cadastro',
		registerName: 'Nome completo',
		registerEmail: 'E-mail',
		registerPassword: 'Senha',
		registerBtn: 'Cadastrar',
		backLogin: 'Já tem uma conta? Faça login'
	},
	fr: {
		company: 'inter-Flash',
		welcome: 'Bienvenue ! Gérez votre compte et vos paiements Internet facilement et en toute sécurité.<br>Connectez-vous pour continuer.',
		loginEmail: 'E-mail',
		loginPassword: 'Mot de passe',
		loginBtn: 'Se connecter',
		registerInvite: `Vous n'avez pas de compte ? <span id="show-register" class="link">Inscrivez-vous ici.</span>`,
		registerTitle: 'Inscription',
		registerName: 'Nom complet',
		registerEmail: 'E-mail',
		registerPassword: 'Mot de passe',
		registerBtn: 'S\'inscrire',
		backLogin: 'Vous avez déjà un compte ? Connectez-vous'
	},
	ru: {
		company: 'inter-Flash',
		welcome: 'Добро пожаловать! Управляйте своим аккаунтом и платежами за интернет легко и безопасно.<br>Войдите, чтобы продолжить.',
		loginEmail: 'Эл. почта',
		loginPassword: 'Пароль',
		loginBtn: 'Войти',
		registerInvite: 'Нет аккаунта? <span id="show-register" class="link">Зарегистрируйтесь здесь.</span>',
		registerTitle: 'Регистрация',
		registerName: 'Полное имя',
		registerEmail: 'Эл. почта',
		registerPassword: 'Пароль',
		registerBtn: 'Зарегистрироваться',
		backLogin: 'Уже есть аккаунт? Войти'
	},
	zh: {
		company: 'inter-Flash',
		welcome: '欢迎！轻松安全地管理您的账户和互联网支付。<br>请登录以继续。',
		loginEmail: '电子邮件',
		loginPassword: '密码',
		loginBtn: '登录',
		registerInvite: '没有账户？<span id="show-register" class="link">点击注册。</span>',
		registerTitle: '注册',
		registerName: '全名',
		registerEmail: '电子邮件',
		registerPassword: '密码',
		registerBtn: '注册',
		backLogin: '已有账户？请登录'
	},
	de: {
		company: 'inter-Flash',
		welcome: 'Willkommen! Verwalten Sie Ihr Konto und Ihre Internetzahlungen einfach und sicher.<br>Melden Sie sich an, um fortzufahren.',
		loginEmail: 'E-Mail',
		loginPassword: 'Passwort',
		loginBtn: 'Anmelden',
		registerInvite: 'Noch kein Konto? <span id="show-register" class="link">Hier registrieren.</span>',
		registerTitle: 'Registrieren',
		registerName: 'Vollständiger Name',
		registerEmail: 'E-Mail',
		registerPassword: 'Passwort',
		registerBtn: 'Registrieren',
		backLogin: 'Schon registriert? Anmelden'
	}
};

function setLangTexts(lang) {
	const t = translations[lang] || translations['es'];
	document.getElementById('company-name').textContent = t.company;
	document.getElementById('welcome-text').innerHTML = t.welcome;
	document.getElementById('login-email').placeholder = t.loginEmail;
	document.getElementById('login-password').placeholder = t.loginPassword;
	document.getElementById('login-btn').textContent = t.loginBtn;
	document.getElementById('register-invite').innerHTML = t.registerInvite;
	document.getElementById('register-title').textContent = t.registerTitle;
	document.getElementById('register-nombre').placeholder = t.registerName;
	document.getElementById('register-email').placeholder = t.registerEmail;
	document.getElementById('register-password').placeholder = t.registerPassword;
	document.getElementById('register-btn').textContent = t.registerBtn;
	document.getElementById('back-login').textContent = t.backLogin;
}

// Guardar y cargar preferencia de idioma



// Al cargar la página, aplicar idioma del navegador (o español por defecto)
window.addEventListener('DOMContentLoaded', () => {
	let lang = (navigator.language || navigator.userLanguage || 'es').slice(0,2);
	if (!translations[lang]) lang = 'es';
	setLangTexts(lang);
});
// --- Cambiar color de texto según el fondo (solo blanco o negro) ---
function getAverageRGB(imgEl, x, y, w, h) {
	// Crea un canvas temporal para analizar el área bajo el container
	var blockSize = 5, // tamaño de bloque para muestreo
		defaultRGB = {r:255,g:255,b:255},
		canvas = document.createElement('canvas'),
		context = canvas.getContext && canvas.getContext('2d'),
		data, width, height, i = -4, length,
		rgb = {r:0,g:0,b:0}, count = 0;
	if (!context) return defaultRGB;
	width = canvas.width = w;
	height = canvas.height = h;
	context.drawImage(imgEl, x, y, w, h, 0, 0, w, h);
	try {
		data = context.getImageData(0, 0, width, height);
	} catch(e) {
		return defaultRGB;
	}
	length = data.data.length;
	while ((i += blockSize * 4) < length) {
		++count;
		rgb.r += data.data[i];
		rgb.g += data.data[i+1];
		rgb.b += data.data[i+2];
	}
	rgb.r = ~~(rgb.r/count);
	rgb.g = ~~(rgb.g/count);
	rgb.b = ~~(rgb.b/count);
	return rgb;
}

function setContainerTextColor() {
	const container = document.querySelector('.container');
	const bgImg = document.body.style.backgroundImage.match(/url\(["']?([^"')]+)["']?\)/);
	if (!container || !bgImg) return;
	const img = new window.Image();
	img.crossOrigin = "Anonymous";
	img.src = bgImg[1];
	img.onload = function() {
		// Calcula el área del container en relación a la ventana
		const rect = container.getBoundingClientRect();
		// Toma el área central del container para muestreo
		const avg = getAverageRGB(img, rect.left, rect.top, rect.width, rect.height);
		// Luminancia relativa
		const luminance = (0.299*avg.r + 0.587*avg.g + 0.114*avg.b)/255;
		container.classList.remove('text-white','text-black');
		if (luminance < 0.5) {
			container.classList.add('text-white');
		} else {
			container.classList.add('text-black');
		}
	};
}

window.addEventListener('DOMContentLoaded', setContainerTextColor);
window.addEventListener('resize', setContainerTextColor);
// Mostrar/ocultar contraseña en registro
const registerPassword = document.getElementById('register-password');
const toggleRegisterPassword = document.getElementById('toggle-register-password');
toggleRegisterPassword.addEventListener('click', () => {
	if (registerPassword.type === 'password') {
		registerPassword.type = 'text';
		toggleRegisterPassword.querySelector('img').src = 'eye-off.svg';
		toggleRegisterPassword.querySelector('img').alt = 'Ocultar';
	} else {
		registerPassword.type = 'password';
		toggleRegisterPassword.querySelector('img').src = 'eye.svg';
		toggleRegisterPassword.querySelector('img').alt = 'Mostrar';
	}
});
// Mostrar/ocultar contraseña en login
const loginPassword = document.getElementById('login-password');
const toggleLoginPassword = document.getElementById('toggle-login-password');
toggleLoginPassword.addEventListener('click', () => {
	if (loginPassword.type === 'password') {
		loginPassword.type = 'text';
		toggleLoginPassword.querySelector('img').src = 'eye-off.svg';
		toggleLoginPassword.querySelector('img').alt = 'Ocultar';
	} else {
		loginPassword.type = 'password';
		toggleLoginPassword.querySelector('img').src = 'eye.svg';
		toggleLoginPassword.querySelector('img').alt = 'Mostrar';
	}
});


// Elementos
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const showRegister = document.getElementById('show-register');
const backLogin = document.getElementById('back-login');
const langSelect = document.getElementById('lang-select');


// Delegación de eventos para el enlace de registro (por si se re-renderiza)
document.addEventListener('click', function(e) {
	const target = e.target.closest('#show-register');
	if (target) {
		e.preventDefault();
		window.location.href = 'registro.html';
	}
});

// Volver a login desde registro
backLogin.addEventListener('click', () => {
	registerForm.classList.add('hidden');
	loginForm.classList.remove('hidden');
});

// Selector de idioma (solo visual por ahora)
langSelect.addEventListener('change', (e) => {
	// Aquí podrías cambiar los textos según el idioma seleccionado
	alert('Funcionalidad de cambio de idioma próximamente');
});
