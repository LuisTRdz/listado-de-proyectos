<?php
// Archivo para manejar la inserción de datos en la tabla citas

// Inicia o reanuda la sesión
session_start();

// Verificar si la solicitud es del tipo POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Obtener los datos del formulario
    parse_str(file_get_contents("php://input"), $formData);

    // Establecer conexión con la base de datos
    $servername = "database-3.cxy6qocq8teq.us-east-2.rds.amazonaws.com";
    $username = "admin";
    $password = "desarrollocloud";
    $dbname = "hospital";

    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    // Obtener los datos del formulario
    $apellidoPat = $formData['paterno'];
    $apellidoMat = $formData['materno'];
    $nombre = $formData['nombre'];
    $telefono = $formData['telefono'];
    $curp = $formData['curp'];
    $rfc = $formData['rfc'];
    $edad = $formData['edad'];
    $fechaNac = $formData['fnac'];
    $fechaCita = $formData['fecha'];
    $horaCita = $formData['hora'];
    $domicilio = $formData['domicilio'];
    $sintomas = $formData['sintomas'];

    // Preparar la sentencia SQL para la inserción
    $sqlInsert = $conn->prepare("INSERT INTO citas (apellidoPat, apellidoMat, nombre, telefono, curp, rfc, edad, fechaNac, fechaCita, horaCita, domicilio, sintomas) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

    // Vincular parámetros
    $sqlInsert->bind_param("ssssssisssss", $apellidoPat, $apellidoMat, $nombre, $telefono, $curp, $rfc, $edad, $fechaNac, $fechaCita, $horaCita, $domicilio, $sintomas);

    // Ejecutar la consulta
    if ($sqlInsert->execute()) {
        echo "Cita agendada correctamente.";
    } else {
        echo "Error al agendar la cita: " . $sqlInsert->error;
    }

    // Cerrar la conexión a la base de datos
    $sqlInsert->close();
    $conn->close();
} else {
    echo "Acceso no permitido.";
}
?>