$(document).ready(function () {
    $("#loginForm").submit(function (event) {
        event.preventDefault(); // Previene el envío del formulario de la manera tradicional

        var usuario = $("#usuario").val();
        var contrasena = $("#contrasena").val();
        
        // Elimina la validación del usuario
        // var usuarioRegex = /^[A-Z]{2}\d{8}$/;

        if (usuario === "" || contrasena === "") {
            alert("Por favor, ingresa tanto el usuario como la contraseña.");
        } else {
            // Envía el formulario de manera asíncrona (Ajax)
            $.ajax({
                type: "POST",
                url: "../php/loginAdmin.php",
                data: $("#loginForm").serialize(),
                dataType: "text",  // Cambiado de "json" a "text"
                success: function (response) {
                    console.log("Respuesta del servidor:", response);

                    try {
                        var jsonStartIndex = response.indexOf('{');
                        var jsonSubstring = response.substring(jsonStartIndex);
                        var parsedResponse = JSON.parse(jsonSubstring);

                        console.log("Respuesta analizada:", parsedResponse);

                        if (parsedResponse.success && parsedResponse.redirect) {
                            var redirectUrl = new URL(parsedResponse.redirect, window.location.origin);
                            window.location.href = redirectUrl.href;
                        }

                        alert(parsedResponse.message);
                    } catch (error) {
                        console.error("Error al analizar la respuesta JSON:", error);
                        alert("Error al procesar la respuesta del servidor.");
                    }
                },
                error: function (xhr, status, error) {
                    console.error("Error al procesar la solicitud:", error);
                    alert("Error al procesar la solicitud. Consulta la consola para obtener más detalles.");
                }
            });
        }
    });
});