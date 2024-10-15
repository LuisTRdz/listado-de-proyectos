<?php
// Archivo para manejar la actualización de datos en la tabla citas

// Establecer conexión con la base de datos
$servername = "database-3.cxy6qocq8teq.us-east-2.rds.amazonaws.com";
$username = "admin";
$password = "desarrollocloud";
$dbname = "hospital";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Verificar si se recibió un ID y otros datos necesarios para la actualización
if (isset($_POST['id']) && isset($_POST['tratamiento']) && isset($_POST['diagnostico'])) {
    // Obtener los datos del POST
    $id = $_POST['id'];
    $tratamiento = $_POST['tratamiento'];
    $diagnostico = $_POST['diagnostico'];

    // Actualizar la información en la tabla citasconfirmadas
    $sqlUpdate = "UPDATE citasconfirmadas SET tratamiento = '$tratamiento', diagnostico = '$diagnostico' WHERE folio = $id";

    if ($conn->query($sqlUpdate) === TRUE) {
        // Éxito en la actualización
        echo json_encode(["success" => true, "message" => "Datos actualizados con éxito."]);
    } else {
        // Error en la actualización
        echo json_encode(["success" => false, "message" => "Error al actualizar datos: " . $conn->error]);
    }
} else {
    // Datos insuficientes para la actualización
    echo json_encode(["success" => false, "message" => "Falta información para la actualización."]);
}

// Cerrar la conexión a la base de datos
$conn->close();
?>