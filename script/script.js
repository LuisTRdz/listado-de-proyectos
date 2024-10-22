// Cambiar entre modo claro y oscuro
const toggleButton = document.getElementById('toggleSwitch');
toggleButton.addEventListener('change', () => {
    document.body.classList.toggle('dark-mode');
    document.querySelectorAll('.header, .section, .card').forEach(element => {
        element.classList.toggle('dark-mode');
    });
});

// Función para validar y restringir la entrada en tiempo real
document.getElementById('name').addEventListener('input', function () {
    this.value = this.value.replace(/[^A-Za-zÁÉÍÓÚÑáéíóúñ\s]/g, ''); // Solo letras, acentos y espacios
});

// Validar el número de teléfono en tiempo real
document.getElementById('userPhone').addEventListener('input', function () {
    this.value = this.value.replace(/[^0-9]/g, ''); // Solo números
    if (this.value.length > 10) {
        this.value = this.value.slice(0, 10); // Limitar a 10 dígitos
    }
});

// Enviar mensaje a WhatsApp
document.getElementById('contactForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const userPhone = document.getElementById('userPhone').value.trim(); // Solo para información, no se usa en el enlace
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

    if (userPhone.length !== 10) {
        alert("Por favor, ingresa un número de teléfono válido (10 dígitos).");
        return;
    }

    if (!message) {
        alert("Por favor, ingresa un mensaje.");
        return;
    }

    const text = `Nombre: ${name}\nEmail: ${email}\nTu Número de Teléfono: ${userPhone}\nMensaje: ${message}`;
    const fixedPhoneNumber = '5218341488987'; // Tu número fijo
    const url = `https://api.callmebot.com/whatsapp.php?phone=${fixedPhoneNumber}&text=${encodeURIComponent(text)}&apikey=${apikey}`; // Usar tu número fijo

    // Mostrar el modal
    $('#messageModal').modal('show');

    // Enviar el mensaje a la API sin abrir el enlace
    fetch(url)
        .then(response => {
            if (response.ok) {
                console.log('Mensaje enviado correctamente');
            } else {
                console.error('Error al enviar el mensaje');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });

    // Limpiar el campo del mensaje, pero no los demás
    document.getElementById('message').value = '';
});

// Manejo del botón "Enviar Otro Mensaje"
document.getElementById('sendAnother').addEventListener('click', function () {
    // Limpiar el campo del mensaje
    document.getElementById('message').value = '';

    // Deshabilitar campos de nombre, email y teléfono
    document.getElementById('name').disabled = true;
    document.getElementById('email').disabled = true;
    document.getElementById('userPhone').disabled = true;

    $('#messageModal').modal('hide'); // Cerrar el modal
});

// Manejo del botón "Cerrar"
document.getElementById('closeModal').addEventListener('click', function () {
    // Limpiar todos los campos
    document.getElementById('contactForm').reset();

    // Habilitar campos de nombre, email y teléfono
    document.getElementById('name').disabled = false;
    document.getElementById('email').disabled = false;
    document.getElementById('userPhone').disabled = false;

    $('#messageModal').modal('hide'); // Cerrar el modal
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
        link.addEventListener('click', function (event) {
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
