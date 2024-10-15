<?php
// Archivo para manejar la obtención de datos de la tabla citas

// Establecer conexión con la base de datos
$servername = "database-3.cxy6qocq8teq.us-east-2.rds.amazonaws.com";
$username = "admin";
$password = "desarrollocloud";
$dbname = "hospital";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Obtener datos de la tabla citas
$sqlSelect = "SELECT apellidoPat, folio, apellidoMat, nombre, telefono, curp, rfc, edad, fechaNac, fechaCita, horaCita, domicilio, sintomas, diagnostico, tratamiento, doctorAsignado, estado FROM citasatendidas";
$result = $conn->query($sqlSelect);

$citas = array();

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $citas[] = $row;
    }
}

// Cerrar la conexión a la base de datos
$conn->close();

// Devolver los datos en formato JSON
echo json_encode($citas);
?>