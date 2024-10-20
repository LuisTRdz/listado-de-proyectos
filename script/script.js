const toggleButton = document.getElementById('toggleSwitch');
        toggleButton.addEventListener('change', () => {
            document.body.classList.toggle('dark-mode');
            document.querySelectorAll('.header, .section, .card').forEach(element => {
                element.classList.toggle('dark-mode');
            });
        });

        // Añadir desplazamiento suave para las secciones
        $(document).ready(function() {
            $('a.nav-link').on('click', function(event) {
                event.preventDefault();
                const target = $(this).attr('href');
                $('html, body').animate({
                    scrollTop: $(target).offset().top - 56 // Ajustar el desplazamiento para la barra fija
                }, 800);
            });
        });