<?php
$servername = "database-3.cxy6qocq8teq.us-east-2.rds.amazonaws.com";
$username = "admin";
$password = "desarrollocloud";
$dbname = "hospital";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $usuario = validateInput($_POST["usuario"], 10);
    $contrasena = validateInput($_POST["contrasena"], 100);

    // Mensajes de depuración
    echo "Usuario recibido: $usuario<br>";
    echo "Contraseña recibida: $contrasena<br>";

    $stmt = $conn->prepare("SELECT * FROM doctoresadmin WHERE usuario = ?");

    if (!$stmt) {
        die("Error en la preparación de la consulta: " . $conn->error);
    }

    $stmt->bind_param("s", $usuario);

    $stmt->execute();

    if (!$stmt) {
        die("Error al ejecutar la consulta: " . $stmt->error);
    }

    $result = $stmt->get_result();

    if ($result === false) {
        die("Error al obtener el resultado de la consulta: " . $stmt->error);
    }

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();

        // Mensaje de depuración
        echo "Contraseña almacenada en la base de datos: " . $row['password'] . "<br>";

        if (password_verify($contrasena, $row['password'])) {
            header('Content-Type: application/json');
            echo json_encode(["success" => true, "message" => "Inicio de sesión exitoso", "redirect" => "HOSPITAL/html/InicioPanel.html"]);
        } else {
            // Contraseña incorrecta
            echo json_encode(["success" => false, "message" => "Error de autenticación. Usuario o contraseña incorrectos."]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "Error de autenticación. Usuario o contraseña incorrectos."]);
    }

    if (json_last_error() != JSON_ERROR_NONE) {
        die("Error en la generación de JSON: " . json_last_error_msg());
    }

    $stmt->close();
}

$conn->close();

function validateInput($data, $maxLength)
{
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return substr($data, 0, $maxLength);
}
?>