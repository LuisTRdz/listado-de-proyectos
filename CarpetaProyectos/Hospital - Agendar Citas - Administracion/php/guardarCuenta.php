<?php
// Archivo para manejar la inserción de datos en la tabla doctores

// Verificar si la solicitud es del tipo POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Validar y obtener los datos del formulario
    $usuario = $_POST['usuario'];
    $password = $_POST['password'];

    // Hash de la contraseña
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    // Establecer conexión con la base de datos
    $servername = "database-3.cxy6qocq8teq.us-east-2.rds.amazonaws.com";
    $db_username = "admin";
    $db_password = "desarrollocloud";
    $dbname = "hospital";

    $conn = new mysqli($servername, $db_username, $db_password, $dbname);

    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    // Verificar si el usuario ya existe en la base de datos
    $checkUserQuery = $conn->prepare("SELECT usuario FROM doctoresadmin WHERE usuario = ?");
    $checkUserQuery->bind_param("s", $usuario);
    $checkUserQuery->execute();
    $checkUserQuery->store_result();

    if ($checkUserQuery->num_rows > 0) {
        // El usuario ya existe, manejar el error
        echo "Error: El usuario ya existe en la base de datos.";
    } else {
        // El usuario no existe, proceder con la inserción
        $checkUserQuery->close();

        // Preparar la sentencia SQL para la inserción
        $sqlInsert = $conn->prepare("INSERT INTO doctoresadmin (usuario, password) VALUES (?, ?)");

        // Vincular parámetros
        $sqlInsert->bind_param("ss", $usuario, $hashed_password);

        // Ejecutar la consulta
        if ($sqlInsert->execute()) {
            echo "Datos del doctor registrados correctamente.";
        } else {
            echo "Error al registrar los datos del doctor: " . $sqlInsert->error;
        }

        // Cerrar la conexión a la base de datos
        $sqlInsert->close();
    }

    $conn->close();
} else {
    echo "Acceso no permitido.";
}
?>