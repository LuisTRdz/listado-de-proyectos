<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Establecer conexión con la base de datos
$servername = "database-3.cxy6qocq8teq.us-east-2.rds.amazonaws.com";
$username = "admin";
$password = "desarrollocloud";
$dbname = "hospital";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Obtener el ID de la cita a eliminar
$folio = $_POST['id'];

// Realizar la eliminación en la base de datos
$sqlDelete = "DELETE FROM citasconfirmadas WHERE folio = $folio";
$result = $conn->query($sqlDelete);

// Cerrar la conexión a la base de datos
$conn->close();

// Devolver una respuesta al cliente (puede ser un mensaje de éxito o error)
echo ($result) ? "Cita eliminada correctamente" : "Error al eliminar la cita";
?>