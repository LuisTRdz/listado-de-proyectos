<?php
// Archivo para manejar la obtención y marcado de citas como "Atendidas"

// Establecer conexión con la base de datos
$servername = "database-3.cxy6qocq8teq.us-east-2.rds.amazonaws.com";
$username = "admin";
$password = "desarrollocloud";
$dbname = "hospital";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (isset($_POST['id'])) {
        $id = $_POST['id'];

        // Obtener los datos de la cita confirmada
        $sqlSelect = "SELECT * FROM citasconfirmadas WHERE folio = $id";
        $result = $conn->query($sqlSelect);

        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();

            // Insertar la cita confirmada en la tabla de citasAtendidas
            $sqlInsert = "INSERT INTO citasatendidas (folio, apellidoPat, apellidoMat, nombre, telefono, curp, rfc, edad, fechaNac, fechaCita, horaCita, domicilio, sintomas, diagnostico, tratamiento, doctorAsignado, estado) VALUES 
            ('".$row['folio']."', '".$row['apellidoPat']."', '".$row['apellidoMat']."', '".$row['nombre']."', '".$row['telefono']."', '".$row['curp']."', '".$row['rfc']."', '".$row['edad']."', '".$row['fechaNac']."', '".$row['fechaCita']."', '".$row['horaCita']."', '".$row['domicilio']."', '".$row['sintomas']."', '".$row['diagnostico']."', '".$row['tratamiento']."', '".$row['doctorAsignado']."', 'Atendida')";

            if ($conn->query($sqlInsert) === TRUE) {
                // Borrar la cita de la tabla citasconfirmadas
                $sqlDelete = "DELETE FROM citasconfirmadas WHERE folio = $id";
                if ($conn->query($sqlDelete) === TRUE) {
                    echo "Cita marcada como atendida y trasladada exitosamente.";
                } else {
                    echo "Error al borrar la cita de citasconfirmadas: " . $conn->error;
                }
            } else {
                echo "Error al insertar la cita en citasAtendidas: " . $conn->error;
            }
        } else {
            echo "No se encontró la cita en citasconfirmadas.";
        }
    } else {
        // Si no se proporcionó un ID de cita, devuelve un mensaje de error
        echo "No se proporcionó un ID de cita válido.";
    }
} else {
    // Si no es una solicitud POST, devuelve un mensaje de error
    echo "Esta página solo admite solicitudes POST.";
}

// Cerrar la conexión a la base de datos
$conn->close();
?>
