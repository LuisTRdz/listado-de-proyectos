<?php
// Archivo para manejar la inserción de datos en la tabla doctores

// Verificar si la solicitud es del tipo POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Validar y obtener los datos del formulario
    $nombre = $_POST['nombre'];
    $paterno = $_POST['paterno'];
    $materno = $_POST['materno'];
    $telefono = $_POST['telefono'];
    $especialidad = $_POST['especialidad'];
    $fnac = $_POST['fnac'];
    $usuario = $_POST['usuario'];

    // Establecer conexión con la base de datos
    $servername = "database-3.cxy6qocq8teq.us-east-2.rds.amazonaws.com";
    $username = "admin";
    $password = "desarrollocloud";
    $dbname = "hospital";

    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    // Preparar la sentencia SQL para la inserción
    $sqlInsert = $conn->prepare("INSERT INTO doctores (nombre, paterno, materno, telefono, especialidad, fnac, usuario) VALUES (?, ?, ?, ?, ?, ?, ?)");

    // Vincular parámetros
    $sqlInsert->bind_param("sssssss", $nombre, $paterno, $materno, $telefono, $especialidad, $fnac, $usuario);

    // Ejecutar la consulta
    if ($sqlInsert->execute()) {
        echo "Datos del doctor registrados correctamente.";
    } else {
        echo "Error al registrar los datos del doctor: " . $sqlInsert->error;
    }

    // Cerrar la conexión a la base de datos
    $sqlInsert->close();
    $conn->close();
} else {
    echo "Acceso no permitido.";
}
?>