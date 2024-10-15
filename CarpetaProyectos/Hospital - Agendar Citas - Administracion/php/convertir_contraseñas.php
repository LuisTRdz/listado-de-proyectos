<?php
$servername = "database-3.cxy6qocq8teq.us-east-2.rds.amazonaws.com";
$username = "admin";
$password = "desarrollocloud";
$dbname = "hospital";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$result = $conn->query("SELECT usuario, password FROM administradores");

while ($row = $result->fetch_assoc()) {
    $usuario = $row['usuario'];
    $hashed_password = password_hash($row['password'], PASSWORD_DEFAULT);

    // Actualiza la contraseña en la base de datos
    $conn->query("UPDATE administradores SET password = '$hashed_password' WHERE usuario = '$usuario'");
}

$conn->close();
?>