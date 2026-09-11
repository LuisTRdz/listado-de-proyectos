// Cambiar entre modo claro y oscuro
const toggleButton = document.getElementById('toggleSwitch');

toggleButton.addEventListener('change', () => {
    document.body.classList.toggle('dark-mode', toggleButton.checked);
    localStorage.setItem('darkMode', toggleButton.checked);
});

// Mantener el modo seleccionado al recargar la página
const darkMode = localStorage.getItem('darkMode') === 'true';

toggleButton.checked = darkMode;
document.body.classList.toggle('dark-mode', darkMode);


// Función para validar y restringir la entrada en tiempo real
document.getElementById('name').addEventListener('input', function () {
    this.value = this.value.replace(/[^A-Za-zÁÉÍÓÚÑáéíóúñ\s]/g, '');
});


// Validar el número de teléfono en tiempo real
document.getElementById('userPhone').addEventListener('input', function () {
    this.value = this.value.replace(/[^0-9]/g, '');

    if (this.value.length > 10) {
        this.value = this.value.slice(0, 10);
    }
});


// =========================================================
// ENVIAR MENSAJE POR CORREO ELECTRÓNICO
// =========================================================

document.getElementById('contactForm').addEventListener('submit', function (event) {

    event.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const userPhone = document.getElementById('userPhone').value.trim();
    const message = document.getElementById('message').value.trim();

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

                document.getElementById('message').value = '';

                // Limpiar cualquier backdrop anterior
                $('.modal-backdrop').remove();
                $('body').removeClass('modal-open');
                $('body').css({
                    'padding-right': '',
                    'overflow': ''
                });

                // Mostrar modal correctamente
                $('#messageModal').modal({
                    backdrop: true,
                    keyboard: true,
                    show: true
                });

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


// =========================================================
// LIMPIEZA FORZADA DEL MODAL
// =========================================================

function limpiarModal() {

    $('#messageModal').removeClass('show');
    $('#messageModal').attr('aria-hidden', 'true');
    $('#messageModal').css('display', 'none');

    $('.modal-backdrop').remove();

    $('body')
        .removeClass('modal-open')
        .css({
            'padding-right': '',
            'overflow': ''
        });
}


// =========================================================
// ENVIAR OTRO MENSAJE
// =========================================================

document.getElementById('sendAnother').addEventListener('click', function () {

    document.getElementById('message').value = '';

    document.getElementById('name').disabled = false;
    document.getElementById('email').disabled = false;
    document.getElementById('userPhone').disabled = false;

    $('#messageModal').modal('hide');

    setTimeout(() => {
        limpiarModal();
    }, 400);
});


// =========================================================
// CERRAR MODAL
// =========================================================

document.getElementById('closeModal').addEventListener('click', function () {

    document.getElementById('contactForm').reset();

    document.getElementById('name').disabled = false;
    document.getElementById('email').disabled = false;
    document.getElementById('userPhone').disabled = false;

    $('#messageModal').modal('hide');

    setTimeout(() => {
        limpiarModal();
    }, 400);
});


// =========================================================
// CUALQUIER CIERRE DEL MODAL
// =========================================================

$('#messageModal').on('hidden.bs.modal', function () {

    limpiarModal();

});


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

            event.preventDefault();

            const target = this.getAttribute('href');
            const targetElement = document.querySelector(target);

            if (targetElement) {

                window.scrollTo({
                    top: targetElement.offsetTop - 56,
                    behavior: 'smooth'
                });

            }

        });

    });

});


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
