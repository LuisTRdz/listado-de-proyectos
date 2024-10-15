$(document).ready(function () {
    // Deshabilitar el campo de usuario al cargar la página
    $("#usuario").prop("disabled", true);

    // Evento de cambio en los campos necesarios para generar el usuario
    $("#paterno, #fnac, #telefono").on("input", function () {
        validarYGenerarUsuario();
    });

    // Botón para guardar los datos y actualizar la página
    $("#guardar").click(function (event) {
        // Prevenir el comportamiento predeterminado del formulario
        event.preventDefault();

        // Realizar todas las validaciones antes de guardar
        if (validarFormulario()) {
            // Inicializar formData dentro del evento click
            var formData = $("#doctorForm").serializeArray();

            // Enviar el formulario al archivo PHP para procesar los datos
            $.ajax({
                type: "POST",
                url: "http://localhost/HOSPITAL/php/agregarDoctores.php", // Asegúrate de que la URL sea correcta
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
        }
    });

    // Función para generar el usuario
    function generarUsuario() {
        var apellidoPaterno = $("#paterno").val().substring(0, 2).toUpperCase();
        var diaNacimiento = ("0" + $("#fnac").val().split("-")[2]).slice(-2);
        var mesNacimiento = ("0" + $("#fnac").val().split("-")[1]).slice(-2);
        var diaRegistro = ("0" + new Date().getDate()).slice(-2);
        var mesRegistro = ("0" + (new Date().getMonth() + 1)).slice(-2);

        var usuarioGenerado = apellidoPaterno + diaNacimiento + mesNacimiento + diaRegistro + mesRegistro;
        $("#usuario").val(usuarioGenerado);
    }

    // Función para calcular la edad a partir de la fecha de nacimiento
    function calcularEdad(fechaNacimiento) {
        var hoy = new Date();
        var fechaNac = new Date(fechaNacimiento);
        var edad = hoy.getFullYear() - fechaNac.getFullYear();
        var m = hoy.getMonth() - fechaNac.getMonth();

        if (m < 0 || (m === 0 && hoy.getDate() < fechaNac.getDate())) {
            edad--;
        }

        return edad;
    }

    // Función para validar los campos y generar el usuario
    function validarYGenerarUsuario() {
        var paterno = $("#paterno").val();
        var fnac = $("#fnac").val();
        var telefono = $("#telefono").val();

        // Validar que los campos estén completos
        if (paterno.trim() !== "" && fnac.trim() !== "" && telefono.trim() !== "") {
            // Validación de la edad (mayor de 18 años)
            if (calcularEdad(fnac) < 18) {
                alert("Debe ser mayor de 18 años para registrarse.");
            } else {
                // Validación del teléfono (solo números)
                if (!/^\d+$/.test(telefono)) {
                    alert("El teléfono debe contener solo números.");
                } else {
                    // Generar el usuario si los campos son válidos
                    generarUsuario();
                    $("#usuario").prop("disabled", false);
                }
            }
        }
    }

    // Función para validar todo el formulario
    function validarFormulario() {
        // Realiza todas las validaciones necesarias aquí
        // Por ejemplo, puedes agregar más validaciones antes de guardar

        // Ejemplo de validación: asegurarse de que el usuario esté habilitado
        if ($("#usuario").prop("disabled")) {
            alert("Debe generar un usuario válido antes de guardar.");
            return false;
        }

        // Agrega más validaciones según sea necesario

        // Si todas las validaciones pasan, devuelve true
        return true;
    }

    // Genera un código CAPTCHA y muestra en el contenedor
    function generateCaptcha() {
        var captcha = Math.random().toString(36).substr(2, 6).toUpperCase(); // Genera un código de 6 caracteres
        $("#captchaContainer").text(captcha);
    }

    // Validación del formulario al hacer clic en el botón "Guardar Cuenta"
    $("#guardarCuenta").click(function (event) {
        // Prevenir el comportamiento predeterminado del formulario
        event.preventDefault();

        var inputCaptcha = $("#captchaInput").val().toUpperCase();
        var displayedCaptcha = $("#captchaContainer").text();
        var password = $("#password").val();
        var confirmPassword = $("#confirmPassword").val();

        if ($("#cuentaForm")[0].checkValidity()) {
            if (inputCaptcha === displayedCaptcha) {
                // Formulario válido y CAPTCHA correcto

                // Comparación de contraseñas
                if (password !== confirmPassword) {
                    alert("Las contraseñas no coinciden. Por favor, inténtalo de nuevo.");
                    return; // No continuar si las contraseñas no coinciden
                }

                // Inicializar formData dentro del evento click
$("#usuario2").prop("disabled", false);  // Enable the usuario field
var formData = $("#cuentaForm").serialize();  // Serialize the form data
$("#usuario2").prop("disabled", true);  // Disable the usuario field again

// Enviar el formulario al archivo PHP para procesar los datos
$.ajax({
    type: "POST",
    url: "http://localhost/HOSPITAL/php/guardarCuenta.php",
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
            } else {
                // CAPTCHA incorrecto
                alert("Código CAPTCHA incorrecto. Por favor, inténtalo de nuevo.");
                generateCaptcha(); // Regenera el CAPTCHA
            }
        } else {
            // Formulario inválido
            alert("Por favor, completa correctamente todos los campos.");
        }
    });

    // Al cargar la página, obtener la lista de doctores y llenar el select
    $.ajax({
        type: "GET",
        url: "http://localhost/HOSPITAL/php/obtenerDoctores2.php", // Asegúrate de que la URL sea correcta
        dataType: "json",
        success: function (data) {
            // Limpiar las opciones actuales del select
            $("#doctorList").empty();

            // Iterar sobre la lista de doctores y agregar opciones al select
            for (var i = 0; i < data.length; i++) {
                var doctor = data[i];
                var optionText = doctor.nombre_completo;
                var optionValue = doctor.ncontrol; // O el campo que identifica de manera única al doctor

                // Agregar la opción al select
                $("#doctorList").append('<option value="' + optionValue + '">' + optionText + '</option>');
            }
        },
        error: function (error) {
            // Manejar el error
            console.error(error);
        },
    });

    // Al cambiar la opción en la lista desplegable
$("#doctorList").change(function () {
    // Obtener el valor seleccionado
    var selectedDoctor = $("#doctorList option:selected").text();

    // Obtener la parte después del guion y sin espacios en blanco
    var usuarioParteFinal = selectedDoctor.split('-')[1].trim();

    // Asignar el valor al campo de usuario
    $("#usuario2").val(usuarioParteFinal);
});

function cargarDoctores() {
    $.ajax({
        url: 'http://localhost/HOSPITAL/php/doctoresAdminShow.php',
        type: 'POST',
        dataType: 'json',
        success: function (data) {
            mostrarDoctores(data);
            console.log(data);
        },
        error: function (xhr, status, error) {
            console.error('Error al obtener datos de doctores:', status, error);
            console.log('Respuesta del servidor:', xhr.responseText);
        }
    });
}

function mostrarDoctores(doctores) {
    var tablaBody = $('#doctoresTable tbody');
    tablaBody.empty();

    doctores.forEach(function (doctor) {
        var fila = $('<tr>');
        fila.append('<td>' + doctor.nombre + '</td>');
        fila.append('<td>' + doctor.paterno + '</td>');
        fila.append('<td>' + doctor.materno + '</td>');
        fila.append('<td>' + doctor.usuario + '</td>');
        // Agregar más columnas según sea necesario

        tablaBody.append(fila);
    });
}

function searchFunction() {
    var input, filter, table, tr, td, i, j, txtValue;
    input = document.getElementById("searchInput");
    filter = input.value.toUpperCase();
    table = document.getElementById("doctoresTable");
    tr = table.getElementsByTagName("tr");

    for (i = 0; i < tr.length; i++) {
        // Skip the header row (i=0)
        if (i === 0) continue;

        tr[i].style.display = "none";

        for (j = 0; j < tr[i].cells.length; j++) {
            td = tr[i].cells[j];

            if (td) {
                txtValue = td.textContent || td.innerText;
                txtValue = txtValue.toUpperCase();

                if (txtValue.indexOf(filter) > -1) {
                    tr[i].style.display = "";
                    break;
                }
            }
        }
    }
}

// Llama a la función cargarDoctores al cargar la página
$(document).ready(function () {
    cargarDoctores();
});

    // Genera el primer CAPTCHA al cargar la página
    generateCaptcha();

    // Llama a la función de búsqueda cuando se ingresa texto en el campo de búsqueda
    $("#searchInput").on("input", function () {
        searchFunction();
    });
});