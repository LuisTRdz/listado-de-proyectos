// =========================================================
// MODO CLARO / OSCURO
// =========================================================
const toggleButton = document.getElementById('toggleSwitch');

if (toggleButton) {
    toggleButton.addEventListener('change', () => {
        document.body.classList.toggle('dark-mode', toggleButton.checked);
        localStorage.setItem('darkMode', toggleButton.checked);
    });

    const darkMode = localStorage.getItem('darkMode') === 'true';
    toggleButton.checked = darkMode;
    document.body.classList.toggle('dark-mode', darkMode);
}


// =========================================================
// VALIDACIONES EN TIEMPO REAL
// =========================================================
const nameInput = document.getElementById('name');
if (nameInput) {
    nameInput.addEventListener('input', function () {
        this.value = this.value.replace(/[^A-Za-zÁÉÍÓÚÑáéíóúñ\s]/g, '');
    });
}

const phoneInput = document.getElementById('userPhone');
if (phoneInput) {
    phoneInput.addEventListener('input', function () {
        this.value = this.value.replace(/[^0-9]/g, '');
        if (this.value.length > 10) {
            this.value = this.value.slice(0, 10);
        }
    });
}


// =========================================================
// CONTACT — LUZ SIGUIENDO AL MOUSE
// =========================================================
const contact = document.querySelector("#contact");

if (contact) {
    contact.addEventListener("mousemove", (event) => {
        const rect = contact.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        contact.style.setProperty("--mouse-x", `${x}px`);
        contact.style.setProperty("--mouse-y", `${y}px`);
    });

    contact.addEventListener("mouseleave", () => {
        contact.style.setProperty("--mouse-x", "50%");
        contact.style.setProperty("--mouse-y", "0%");
    });
}


// =========================================================
// HELPER SEGURO PARA ABRIR Y CERRAR EL MODAL
// =========================================================
function toggleModal(action) {
    const modalEl = document.getElementById('messageModal');
    if (!modalEl) return;

    // Asegura que el modal sea hijo directo del body para evitar conflictos de z-index
    if (modalEl.parentElement !== document.body) {
        document.body.appendChild(modalEl);
    }

    if (action === 'show') {
        $(modalEl).modal('show');
    } else if (action === 'hide') {
        $(modalEl).modal('hide');
    }
}


// =========================================================
// ENVIAR MENSAJE POR CORREO ELECTRÓNICO
// =========================================================
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const userPhone = document.getElementById('userPhone').value.trim();
        const message = document.getElementById('message').value.trim();

        if (!name) return alert("Por favor, ingresa un nombre.");
        if (!email || !validateEmail(email)) return alert("Por favor, ingresa un email válido.");
        if (userPhone.length !== 10) return alert("Por favor, ingresa un número de teléfono válido (10 dígitos).");
        if (!message) return alert("Por favor, ingresa un mensaje.");

        const formData = {
            _subject: '📩 Nuevo mensaje de contacto - Portafolio',
            _replyto: email,
            _template: 'table',
            'Nombre del remitente': name,
            'Correo de contacto': email,
            'Teléfono': userPhone,
            'Mensaje': message
        };

        fetch('https://formsubmit.co/ajax/luistrsiul@gmail.com', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(formData)
        })
            .then(response => response.json())
            .then(data => {
                if (data.success === true || data.success === 'true') {
                    // 1. Limpiar únicamente el campo de mensaje
                    document.getElementById('message').value = '';

                    // 2. Bloquear los campos de datos personales para conservarlos
                    document.getElementById('name').disabled = true;
                    document.getElementById('email').disabled = true;
                    document.getElementById('userPhone').disabled = true;

                    // 3. Abrir modal de confirmación
                    toggleModal('show');
                    console.log('Mensaje enviado correctamente.');
                } else {
                    console.error('Error al enviar el mensaje:', data);
                    alert('No se pudo enviar el mensaje. Por favor, inténtalo nuevamente.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Ocurrió un error al enviar el mensaje. Por favor, inténtalo nuevamente.');
            });
    });
}


// =========================================================
// ACCIONES DE LOS BOTONES DENTRO DEL MODAL
// =========================================================

// Opción 1: Enviar Otro Mensaje (Mantiene datos personales bloqueados y cierra modal)
const sendAnotherBtn = document.getElementById('sendAnother');
if (sendAnotherBtn) {
    sendAnotherBtn.addEventListener('click', (event) => {
        if (event && event.target) event.target.blur(); // Quita el foco para evitar advertencia aria-hidden
        toggleModal('hide');
    });
}

// Opción 2: Cerrar / Cancelar (Limpia todo el formulario y desbloquea los campos)
const closeModalBtn = document.getElementById('closeModal');
if (closeModalBtn) {
    closeModalBtn.addEventListener('click', (event) => {
        if (event && event.target) event.target.blur(); // Quita el foco

        if (contactForm) contactForm.reset();

        // Habilitar campos nuevamente
        const inputs = ['name', 'email', 'userPhone'];
        inputs.forEach(id => {
            const input = document.getElementById(id);
            if (input) input.disabled = false;
        });

        toggleModal('hide');
    });
}


// =========================================================
// FUNCIÓN PARA VALIDAR EMAIL
// =========================================================
function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}


// =========================================================
// DESPLAZAMIENTO SUAVE
// =========================================================
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('a.nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            const target = this.getAttribute('href');

            if (target && target.startsWith('#') && target !== '#') {
                const targetElement = document.querySelector(target);

                if (targetElement) {
                    event.preventDefault();
                    window.scrollTo({
                        top: targetElement.offsetTop - 56,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
});
