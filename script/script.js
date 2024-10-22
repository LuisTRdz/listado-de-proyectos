// Cambiar entre modo claro y oscuro
const toggleButton = document.getElementById('toggleSwitch');
toggleButton.addEventListener('change', () => {
    document.body.classList.toggle('dark-mode');
    document.querySelectorAll('.header, .section, .card').forEach(element => {
        element.classList.toggle('dark-mode');
    });
});

// Función para validar y restringir la entrada en tiempo real
document.getElementById('name').addEventListener('input', function() {
    this.value = this.value.replace(/[^A-Za-zÁÉÍÓÚÑáéíóúñ\s]/g, ''); // Solo letras, acentos y espacios
});

// Validar el número de teléfono en tiempo real
document.getElementById('userPhone').addEventListener('input', function() {
    this.value = this.value.replace(/[^0-9]/g, ''); // Solo números
});

// Enviar mensaje a WhatsApp
document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const userPhone = document.getElementById('userPhone').value.trim(); // Número de teléfono del usuario
    const message = document.getElementById('message').value.trim();
    const apikey = document.getElementById('apikey').value; // API key

    // Validaciones
    if (!name) {
        alert("Por favor, ingresa un nombre.");
        return;
    }

    if (!email || !validateEmail(email)) {
        alert("Por favor, ingresa un email válido.");
        return;
    }

    if (!userPhone || userPhone.length !== 10) {
        alert("Por favor, ingresa un número de teléfono válido (10 dígitos).");
        return;
    }

    if (!message) {
        alert("Por favor, ingresa un mensaje.");
        return;
    }

    const text = `Nombre: ${name}\nEmail: ${email}\nTu Número de Teléfono: ${userPhone}\nMensaje: ${message}`; // Incluir el número de teléfono del usuario
    const url = `https://api.callmebot.com/whatsapp.php?phone=521${userPhone}&text=${encodeURIComponent(text)}&apikey=${apikey}`; // Usar el número de teléfono del usuario

    // Abrir la URL en una nueva pestaña
    window.open(url, '_blank');
});

// Función para validar el formato del email
function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Añadir desplazamiento suave para las secciones
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('a.nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const target = this.getAttribute('href');
            const targetElement = document.querySelector(target);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 56, // Ajustar el desplazamiento para la barra fija
                    behavior: 'smooth' // Desplazamiento suave
                });
            }
        });
    });
});