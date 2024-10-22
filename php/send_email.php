<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Captura los datos del formulario
    $name = htmlspecialchars($_POST['name']);
    $email = htmlspecialchars($_POST['email']);
    $message = htmlspecialchars($_POST['message']);

    // Aquí pones tu dirección de correo electrónico
    $to = "luistrsiul@gmail.com";
    $subject = "Nuevo comentario de $name";
    $body = "Nombre: $name\nEmail: $email\nMensaje:\n$message";
    $headers = "From: $email";

    // Envía el correo
    if (mail($to, $subject, $body, $headers)) {
        echo "Mensaje enviado correctamente.";
    } else {
        echo "Error al enviar el mensaje.";
    }
}
?>