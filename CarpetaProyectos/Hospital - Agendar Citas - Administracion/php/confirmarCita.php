<?php
// confirmarCita.php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// Conectar a la base de datos (ajusta los detalles según tu configuración)
$conexion = new mysqli("database-3.cxy6qocq8teq.us-east-2.rds.amazonaws.com", "admin", "desarrollocloud", "hospital");

// Verificar la conexión
if ($conexion->connect_error) {
    die("Error de conexión: " . $conexion->connect_error);
}

// Obtener datos enviados por POST
$idCita = $_POST['id'];
$idDoctor = $_POST['idDoctor'];
$doctorAsignado = $_POST['doctorAsignado'];  // <-- Agregar esta línea

// Realizar la inserción en la tabla de confirmación de citas
$consulta = "INSERT INTO citasconfirmadas (folio, apellidoPat, apellidoMat, nombre, telefono, curp, rfc, edad, fechaNac, fechaCita, horaCita, domicilio, sintomas, doctorAsignado)
             SELECT folio, apellidoPat, apellidoMat, nombre, telefono, curp, rfc, edad, fechaNac, fechaCita, horaCita, domicilio, sintomas, ?
             FROM citas
             WHERE folio = ?";
$stmt = $conexion->prepare($consulta);
if ($stmt) {
    $stmt->bind_param("si", $doctorAsignado, $idCita);
    $stmt->execute();

    // Puedes realizar alguna acción adicional después de confirmar

    // Eliminar la cita de la tabla de citas pendientes
    $eliminarCitaPendiente = "DELETE FROM citas WHERE folio = ?";
    $stmtEliminar = $conexion->prepare($eliminarCitaPendiente);
    
    if ($stmtEliminar) {
        $stmtEliminar->bind_param("i", $idCita);
        $stmtEliminar->execute();
    } else {
        echo json_encode(array("error" => "Error al eliminar la cita pendiente: " . $conexion->error));
    }

    $stmtEliminar->close();
    $stmt->close();
    echo json_encode(array("success" => "Cita confirmada exitosamente."));
} else {
    echo json_encode(array("error" => "Error al confirmar la cita: " . $conexion->error));
}

// Cerrar la conexión
$conexion->close();
?>