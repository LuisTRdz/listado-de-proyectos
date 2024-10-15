$(document).ready(function () {
    $('#rfc, #curp').on('input', function () {
        $(this).val($(this).val().toUpperCase());
    });

    function validarLetrasConAcentos(texto) {
        var regex = /^[A-Za-zÁ-ú\s]+$/;
        return regex.test(texto);
    }

    $('#paterno, #materno, #nombre, #domicilio, #sintomas').on('input', function () {
        var valor = $(this).val().toUpperCase();

        if (!validarLetrasConAcentos(valor)) {
            valor = valor.replace(/[^A-ZÁ-ÚÜÑ]/g, '');
        }

        $(this).val(valor);
    });

    function validarNumeros(telefono) {
        var regex = /^\d+$/;
        return regex.test(telefono);
    }

    // Función para validar números en tiempo real
    $('#telefono').on('input', function () {
        var inputValue = $(this).val();
        var numericValue = inputValue.replace(/\D/g, ''); // Eliminar no números

        // Actualizar el valor del campo solo con números
        $(this).val(numericValue);
    });

    let currentPart = 1;

    function showPart(part) {
        if (part > currentPart) {
            if (!validateFields(currentPart)) {
                return;
            }
        }

        $(`#parte${currentPart}`).hide();
        $(`#parte${part}`).show();
        currentPart = part;

        if (currentPart === 1) {
            $("#siguiente").show();
            $("#anterior").hide();
        } else if (currentPart === 3) {
            $("#siguiente").hide();
            $("#anterior").show();
        } else {
            $("#siguiente").show();
            $("#anterior").show();
        }

        if (currentPart === 3) {
            $("#guardar").show();
        } else {
            $("#guardar").hide();
        }
    }

    // Función para validar campos
    function validateFields(part) {
        if (part === 1) {
            // Validar campos de la parte 1
            const paterno = $("#paterno").val().trim();
            const materno = $("#materno").val().trim();
            const nombre = $("#nombre").val().trim();
            const telefono = $("#telefono").val().trim();

            var regexNombres = /^[A-Za-zÁ-ú\s]+$/;

            if (!regexNombres.test(paterno) || !regexNombres.test(materno) || !regexNombres.test(nombre)) {
                alert('Por favor, ingrese apellidos y nombres válidos.');
                return false;
            }

            var regexTelefono = /^\d{10}$/; // Asumiendo que el número debe tener 10 dígitos

            if (!regexTelefono.test(telefono)) {
                alert('Por favor, ingrese un número de teléfono válido (10 dígitos).');
                return false;
            }
        } else if (part === 2) {
            // Validar campos de la parte 2
            const curp = $("#curp").val().trim();
            const rfc = $("#rfc").val().trim();
            const edad = $("#edad").val().trim();
            const fnac = $("#fnac").val().trim();
            const fechaCita = $("#fecha").val().trim();
            const horaCita = $("#hora").val().trim();

            // Validar CURP con expresión regular para el formato de México
            var regexCurp = /^[A-Za-z]{4}[0-9]{6}[HM]{1}[A-Za-z]{5}[0-9A-Za-z]{2}$/;

            if (!regexCurp.test(curp)) {
                alert("Por favor, ingrese una CURP válida.");
                return false;
            }

            // Validar RFC con expresión regular para el formato de México
            var regexRfc = /^[A-Za-z]{4}[0-9]{6}[A-Za-z0-9]{3}$/;

            if (!regexRfc.test(rfc)) {
                alert("Por favor, ingrese un RFC válido.");
                return false;
            }

            // Validar edad como un número entre 18 y 100
            if (isNaN(edad) || edad < 18 || edad > 100) {
                alert("Por favor, ingrese una edad válida (entre 18 y 100).");
                return false;
            }

            // Obtener la fecha y hora actual
            var fechaActual = new Date();
            var horaActual = fechaActual.getHours();

            // Validar que la fecha de nacimiento no esté vacía y sea una fecha válida
            if (fnac === "" || isNaN(new Date(fnac).getTime())) {
                alert("Fecha de Nacimiento no válida.");
                return false;
            }

            // Validar que la fecha de cita sea mayor o igual a la fecha actual
            if (new Date(fechaCita) < fechaActual || fechaCita === "") {
                alert("Fecha De Cita (No antes / No el mismo día / Fecha Vacía / No disponible)");
                return false;
            }

            // Validar que la hora de cita no esté vacía o sea inválida
            if (horaCita === "" || isNaN(new Date(`1970-01-01T${horaCita}`).getHours())) {
                alert("Hora de cita (Vacía / No disponible)");
                return false;
            }
        }
        return true;
    }

    // Botón de "Siguiente"
    $("#siguiente").click(function () {
        showPart(currentPart + 1);
    });

    // Botón de "Regresar"
    $("#anterior").click(function () {
        showPart(currentPart - 1);
    });

    // Variable para almacenar el FormData
    let formData;

    // Botón para guardar los datos y actualizar la página
    $("#guardar").click(function (event) {
        // Prevenir el comportamiento predeterminado del formulario
        event.preventDefault();

        // Validar campos antes de guardar
        if (!validateFields(currentPart)) {
            return;
        }

        if (currentPart === 3) {
            if (!validatePart3()) {
                return;
            }
        }

        // Inicializar formData dentro del evento click
        formData = $("#citaForm").serializeArray();

        // Enviar el formulario al archivo PHP para procesar los datos
        $.ajax({
            type: "POST",
            url: "http://localhost/HOSPITAL/php/citas.php", // Asegúrate de que la URL sea correcta
            data: formData,
            success: function (response) {
                // Mostrar mensaje de éxito o error
                alert(response);

                // Actualizar la página después de guardar
                location.reload();
            },
            error: function (error) {
                // Manejar el error
                alert("Error al enviar los datos al servidor.");
                console.error(error);
            },
        });
    });

    // Mostrar la primera parte inicialmente
    showPart(1);

    // Función para validar campos de la parte 3
    function validatePart3() {
        const domicilio = sanitizeInput($("#domicilio").val().trim());
        const sintomas = sanitizeInput($("#sintomas").val().trim());

        // Entrada de datos limitada a ciertos caracteres
        var regexNombres = /^[A-Za-zÁ-ú\s]+$/;
        if (!regexNombres.test(domicilio) || !regexNombres.test(sintomas)) {
            alert('Por favor, ingrese datos válidos.');
            return false;
        }

        // Verificar que los campos no estén vacíos
        if (domicilio === "" || sintomas === "") {
            alert("Por favor, complete todos los campos de la parte 3.");
            return false;
        }

        // Verificar que la longitud del domicilio sea mayor a 12 caracteres
        if (domicilio.length < 12) {
            alert("Por favor, ingrese un domicilio válido.");
            return false;
        }

        // Verificar que la longitud de los síntomas sea mayor a 15 caracteres
        if (sintomas.length < 15) {
            alert("Por favor, ingrese síntomas más detallados.");
            return false;
        }

        return true;
    }

    function sanitizeInput(input) {
        // Crear un elemento div y establecer su contenido de texto
        const div = document.createElement('div');
        div.innerText = input;

        // Obtener el contenido del div, ahora solo contiene texto
        const sanitizedInput = div.innerText;
        return sanitizedInput;
    }

    // Agregado: Calcular fecha de nacimiento y edad al perder el foco en el campo RFC
    $('#rfc').blur(function () {
        const rfc = $(this).val().trim();
        const nombres = $('#nombre').val().trim();
        const apellidoPaterno = $('#paterno').val().trim();
        const apellidoMaterno = $('#materno').val().trim();

        if (rfc.length >= 10 && nombres !== '' && apellidoPaterno !== '' && apellidoMaterno !== '') {
            const fechaNacimiento = calcularFechaNacimiento(rfc);
            const edad = calcularEdad(fechaNacimiento);

            $('#fnac').val(fechaNacimiento);
            $('#edad').val(edad);
        } else {
            alert('Por favor, completa todos los campos correctamente.');
        }
    });

    function calcularFechaNacimiento(rfc) {
        let anio;
        if (rfc.substring(4, 6) >= 80) {
            anio = parseInt(rfc.substring(4, 6), 10) + 1900;
        } else {
            anio = parseInt(rfc.substring(4, 6), 10) + 2000;
        }
        const mes = parseInt(rfc.substring(6, 8), 10);
        const dia = parseInt(rfc.substring(8, 10), 10);

        const fecha = new Date(`${anio}-${mes}-${dia}`);
        return fecha.toISOString().split('T')[0];
    }

    function calcularEdad(fechaNacimiento) {
        const fechaNac = new Date(fechaNacimiento);
        const fechaActual = new Date();

        let edad = fechaActual.getFullYear() - fechaNac.getFullYear();

        if (fechaActual.getMonth() < fechaNac.getMonth() ||
            (fechaActual.getMonth() === fechaNac.getMonth() && fechaActual.getDate() < fechaNac.getDate())) {
            edad--;
        }

        return edad;
    }
});