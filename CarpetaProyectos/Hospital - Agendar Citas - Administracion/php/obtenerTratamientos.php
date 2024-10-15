<?php
// obtenerDoctores.php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// Conectar a la base de datos (ajusta los detalles según tu configuración)
$conexion = new mysqli("database-3.cxy6qocq8teq.us-east-2.rds.amazonaws.com", "admin", "desarrollocloud", "hospital");

// Verificar la conexión
if ($conexion->connect_error) {
    die("Error de conexión: " . $conexion->connect_error);
}

// Consulta para obtener la lista de doctores con la concatenación de "paterno", "materno", "nombre" y "especialidad"
$consulta = "SELECT IdTratamiento, CONCAT(Nombre, ' - ', Descripcion) AS nombre_completo FROM tratamientos";
$resultado = $conexion->query($consulta);

// Crear un array para almacenar los resultados
$tratamientos = array();

// Obtener los resultados en formato de array
while ($fila = $resultado->fetch_assoc()) {
    $tratamientos[] = $fila;
}

// Devolver la lista de doctores en formato JSON
echo json_encode($tratamientos);

// Cerrar la conexión
$conexion->close();
?>