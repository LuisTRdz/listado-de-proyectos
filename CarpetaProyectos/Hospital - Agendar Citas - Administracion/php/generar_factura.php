<?php
    // Configura la zona horaria
date_default_timezone_set('America/Mexico_City');

    // Función para formatear la fecha y hora actual
function getCurrentDateTime() {
    return date("d/m/Y");
}

$servername = "database-3.cxy6qocq8teq.us-east-2.rds.amazonaws.com";
$username = "admin";
$password = "desarrollocloud";
$dbname = "hospital";

// Constants for deductible and VAT
define("DEDUCTIBLE", 50.00);
define("IVA", 0.16); // Assuming 16% VAT

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Error de conexión a la base de datos: " . $conn->connect_error);
}

$sqlPacientes = "SELECT DISTINCT nombre, apellidoPat, apellidoMat FROM citasatendidas";
$resultPacientes = $conn->query($sqlPacientes);

$sqlTratamientos = "SELECT * FROM tratamientos";
$resultTratamientos = $conn->query($sqlTratamientos);

function getTreatmentData($resultTratamientos) {
    $treatmentData = array();
    while ($row = $resultTratamientos->fetch_assoc()) {
        // Cálculo del IVA con number_format
        $iva = number_format($row['Precio'] * IVA, 2, '.', '');

        $total = $row['Precio'] + DEDUCTIBLE + $iva;
        $treatmentData[$row['IdTratamiento']] = array(
            'Nombre' => $row['Nombre'],
            'Descripcion' => $row['Descripcion'],
            'TipoPrecio' => $row['TipoPrecio'],
            'Precio' => $row['Precio'],
            'Deducible' => DEDUCTIBLE,
            'IVA' => $iva,
            'Total' => $total
        );
    }
    return $treatmentData;
}

$treatmentData = getTreatmentData($resultTratamientos);

$conn->close();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
        die("Error de conexión a la base de datos: " . $conn->connect_error);
    }

    $selectedPaciente = $_POST["paciente"];

    $sqlFactura = "SELECT c.*, t.Nombre as NombreTratamiento, t.Descripcion as DescripcionTratamiento, t.TipoPrecio, t.Precio 
                   FROM citasatendidas c
                   LEFT JOIN tratamientos t ON c.tratamiento = t.IdTratamiento
                   WHERE CONCAT(c.nombre, ' ', c.apellidoPat, ' ', c.apellidoMat) = '$selectedPaciente'";

    $resultFactura = $conn->query($sqlFactura);
    ?>

    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Factura</title>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
        <script>
            var treatmentData = <?php echo json_encode($treatmentData, JSON_PRETTY_PRINT); ?>;
        </script>
        <style>
            body {
        background-color: black;
        margin: 0;
    }

    .encabezado-factura {
        background-color: transparent;
        color: #fff;
        text-align: center;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .encabezado-factura img {
        display: block;
        margin: 0 auto;
        margin-bottom: 10px;
    }

    h2,
    h4 {
        color: #333;
    }

    .custom-table {
        width: 100%;
        margin-bottom: 1rem;
        color: #212529;
        border-collapse: collapse;
        margin-top: 10px;
        border-radius: 10px;
        overflow: hidden;
    }

    .custom-table th,
    .custom-table td {
        padding: 0.75rem;
        vertical-align: top;
        border: 1px solid #dee2e6;
        box-sizing: border-box;
    }

    .custom-table thead th {
        vertical-align: bottom;
        border-bottom: 2px solid #dee2e6;
        background-color: #f8f9fa;
    }

    .custom-table tbody + tbody {
        border-top: 2px solid #dee2e6;
    }

    .form-control {
        width: 200px;
    }

    .btn-primary,
    .btn-success,
    .btn-secondary {
        margin-top: 10px;
    }

    .btn-primary,
    .btn-success {
        margin-right: 20px;
    }

    @media print {
        .encabezado-factura {
            background-color: black; !important;
            color: #fff !important;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1) !important;
            margin-bottom: 0 !important;
            padding-bottom: 10px !important;
        }

        h2 {
            color: #333 !important;
        }

        .container {
            border: none !important;
            box-shadow: none !important;
        }

        #btnImprimirTabla,
        #btnRegresarSeleccion,
        #btnSelect {
            display: none !important;
        }
    }body {
        background-color: #f2f2f2;
        margin: 20px;
    }

    .encabezado-factura {
        background-color: #f2f2f2;
        color: #fff;
        padding: 20px;
        text-align: center;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        margin-bottom: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .encabezado-factura img {
        display: block;
        margin: 0 auto;
        margin-bottom: 10px;
    }

    h2,
    h4 {
        color: #333;
    }

    .custom-table {
        width: 100%;
        margin-bottom: 1rem;
        color: #212529;
        border-collapse: collapse;
        margin-top: 10px;
        border-radius: 10px;
        overflow: hidden;
    }

    .custom-table th,
    .custom-table td {
        padding: 0.75rem;
        vertical-align: top;
        border: 1px solid #dee2e6;
        box-sizing: border-box;
    }

    .custom-table thead th {
        vertical-align: bottom;
        border-bottom: 2px solid #dee2e6;
        background-color: #f8f9fa;
    }

    .custom-table tbody + tbody {
        border-top: 2px solid #dee2e6;
    }

    .form-control {
        width: 200px;
    }

    .btn-primary,
    .btn-success,
    .btn-secondary {
        margin-top: 10px;
    }

    .btn-primary,
    .btn-success {
        margin-right: 20px;
    }

    @media print {
        .encabezado-factura {
            background-color: black; !important;
            color: #fff !important;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1) !important;
            margin-bottom: 0 !important;
            padding-bottom: 10px !important;
        }

        h2 {
            color: #333 !important;
        }

        .container {
            border: none !important;
            box-shadow: none !important;
        }

        #btnImprimirTabla,
        #btnRegresarSeleccion,
        #btnSelect {
            display: none !important;
        }
    }
        </style>
    </head>
    <body class="fondo-transparente" style="text-align: center;">

    <div class="container mt-3" style="margin-left: 20px;">
    <div class="encabezado-factura" style="display: flex; justify-content: space-between; align-items: center;">
        <div style="flex-grow: 1;">
            <h2 class="mt-4">Factura</h2>
        </div>
        <div style="flex-grow: 1; text-align: right;">
            <img src="../img/logo.png" alt="Logo del Hospital" width="250">
        </div>
    </div>
</div>


        <form method="post" action="generar_factura.php">
            <!-- Tabla de Datos del Paciente -->
            <br>
            <h4 class="mt-3">Datos Personales del Paciente</h4>
            <!-- Tabla de Datos Personales del Paciente -->
<table class="table custom-table">
    <thead>
        <tr>
            <th>Folio</th>
            <th>Apellido Paterno</th>
            <th>Apellido Materno</th>
            <th>Nombre</th>
            <th>CURP</th>
            <th>RFC</th>
            <th>Edad</th>
            <th>Fecha de Nacimiento</th>
        </tr>
    </thead>
    <tbody>
        <?php
        // Almacenar los resultados en un array
        $datosPersonales = [];
        while ($row = $resultFactura->fetch_assoc()) {
            $datosPersonales[] = $row;
        }

        // Imprimir la tabla de Datos Personales
        foreach ($datosPersonales as $row) {
            echo "<tr>";
            echo "<td>" . $row['folio'] . "</td>";
            echo "<td>" . $row['apellidoPat'] . "</td>";
            echo "<td>" . $row['apellidoMat'] . "</td>";
            echo "<td>" . $row['nombre'] . "</td>";
            echo "<td>" . $row['curp'] . "</td>";
            echo "<td>" . $row['rfc'] . "</td>";
            echo "<td>" . $row['edad'] . "</td>";
            echo "<td>" . $row['fechaNac'] . "</td>";
            echo "</tr>";
        }
        ?>
    </tbody>
</table>

<!-- Tabla de Datos del Paciente -->
<br>
<h4 class="mt-3">Datos de Contacto del Paciente</h4>
<table class="table custom-table">
    <thead>
        <tr>
            <th>Teléfono</th>
            <th>Domicilio</th>
        </tr>
    </thead>
    <tbody>
        <?php
        // Imprimir la tabla de Datos de Contacto
        foreach ($datosPersonales as $row) {
            echo "<tr>";
            echo "<td>" . $row['telefono'] . "</td>";
            echo "<td>" . $row['domicilio'] . "</td>";
            echo "</tr>";
        }
        ?>
    </tbody>
</table>

            <br>

            <!-- Tabla de Datos de la Cita -->
<h4 class="mt-3">Datos de la Cita</h4>
<table class="table custom-table">
    <thead>
        <tr>
            <th>Fecha Cita</th>
            <th>Hora Cita</th>
            <th>Síntomas</th>
            <th>Diagnóstico</th>
            <th>Tratamiento</th>
        </tr>
    </thead>
    <tbody>
        <?php
        $resultFactura->data_seek(0);
        while ($row = $resultFactura->fetch_assoc()) {
            // Dividir la cadena del tratamiento antes del guion
            $nombreTratamiento = explode(' - ', $row['tratamiento'])[0];

            echo "<tr>";
            echo "<td>" . $row['fechaCita'] . "</td>";
            echo "<td>" . $row['horaCita'] . "</td>";
            echo "<td>" . $row['sintomas'] . "</td>";
            echo "<td>" . $row['diagnostico'] . "</td>";
            echo "<td>" . $row['tratamiento'] . "</td>";
            echo "</tr>";

            // Ahora puedes usar $nombreTratamiento en el siguiente bucle
            // para mostrarlo en la tabla de Datos del Tratamiento.
        }
        ?>
    </tbody>
</table>

            <br>

            <!-- Tabla de Datos de la Cita -->
            <h4 class="mt-3">Datos del Especialista</h4>
            <table class="table custom-table">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Especialidad</th>
                    </tr>
                </thead>
                <tbody>
                    <?php
$resultFactura->data_seek(0);
while ($row = $resultFactura->fetch_assoc()) {
    // Dividir la cadena en nombre y especialidad
    list($nombreApellido, $especialidad) = explode(' - ', $row['doctorAsignado'], 2);

    // Dividir el nombre en apellidos y nombre
    $nombreApellido = explode(' ', $nombreApellido);
    $apellidos = implode(' ', array_slice($nombreApellido, 0, -1));
    $nombre = end($nombreApellido);

    echo "<tr>";
echo "<td>" . $apellidos . " " . $nombre . "</td>";
echo "<td>" . $especialidad . "</td>";
echo "</tr>";
}
?>
                </tbody>
            </table>

            <br>

            <!-- Tabla de Datos del Tratamiento -->
<h4 class="mt-3">Datos del Tratamiento</h4>
<table class="table custom-table">
    <thead>
        <tr>
            <th>Nombre Tratamiento</th>
            <th>Descripción Tratamiento</th>
            <th>Tipo Precio</th>
            <th>Precio Tratamiento</th>
            <th>Deducible</th>
            <th>IVA Tratamiento</th>
            <th>Total</th>
            <!-- Agrega otras columnas según sea necesario -->
        </tr>
    </thead>
    <tbody>
        <?php
        // Imprimir la tabla de Datos del Tratamiento
        foreach ($datosPersonales as $row) {
            // Obtener el nombre del tratamiento de la fila actual
            $nombreTratamiento = explode(' - ', $row['tratamiento'])[0];

            // Realizar una consulta para obtener los detalles completos del tratamiento
            $sqlDetallesTratamiento = "SELECT * FROM tratamientos WHERE Nombre = '$nombreTratamiento'";
            $resultDetallesTratamiento = $conn->query($sqlDetallesTratamiento);

            // Verificar si se obtuvieron resultados
            if ($resultDetallesTratamiento->num_rows > 0) {
                $detallesTratamiento = $resultDetallesTratamiento->fetch_assoc();

                // Calcular el IVA utilizando la tasa de IVA definida
                $iva = number_format($detallesTratamiento['Precio'] * IVA, 2, '.', '');

                // Utilizar los datos obtenidos para imprimir la fila
                echo "<tr>";
                echo "<td>" . $nombreTratamiento . "</td>";
                echo "<td>" . $detallesTratamiento['Descripcion'] . "</td>";
                echo "<td>" . $detallesTratamiento['TipoPrecio'] . "</td>";
                echo "<td>" . $detallesTratamiento['Precio'] . "</td>";
                echo "<td>" . DEDUCTIBLE . "</td>"; // Usando la constante definida en tu código
                echo "<td>" . $iva . "</td>"; // IVA
                echo "<td>" . ($detallesTratamiento['Precio'] + DEDUCTIBLE + $iva) . "</td>"; // Total
                // Agregar otras columnas según sea necesario
                echo "</tr>";
            }
        }
        ?>
    </tbody>
</table>

        <br>

        <!-- Tabla de Datos del Pago -->
<br>
<h4 class="mt-3">Datos del Pago</h4>
<table class="table custom-table">
    <thead>
        <tr>
            <th>Método de Pago</th>
            <th>Fecha del Pago</th>
            <th>Estado del Pago</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
                <select>
                    <option value="Tarjeta de Crédito" selected>Tarjeta de Crédito</option>
                    <option value="Transferencia Bancaria">Transferencia Bancaria</option>
                    <option value="PayPal">PayPal</option>
                    <option value="Efectivo">Efectivo</option>
                    <option value="Cheque">Cheque</option>
                    <!-- Agrega más opciones según sea necesario -->
                </select>
            </td>
            <td id="fechaPago1" contenteditable="true">01/01/2023</td>
            <td>
                <select>
                    <option value="Pendiente" selected>Pendiente</option>
                    <option value="Pagado">Pagado</option>
                    <!-- Agrega más opciones según sea necesario -->
                </select>
            </td>
        </tr>
    </tbody>
</table>
        <br><br>

            <div style="margin-top: 10px; display: flex;">
                <div>
                    <button type="submit" class="btn btn-primary" id="btnGenerarFactura">Generar Factura</button>
                    <button type="button" class="btn btn-success" id="btnImprimirTabla" style="display: none; margin-right: 20px;" onclick="imprimirTabla()">Imprimir Factura</button>
                </div>
                <a href="generar_factura.php" class="btn btn-secondary" id="btnRegresarSeleccion">Regresar</a>
            </div>

            <p>Fecha: <?php echo getCurrentDateTime(); ?></p>
        </form>
    </div>

    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.5.3/dist/umd/popper.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>

    <script>
    function imprimirTabla() {
            window.print();
    }

    document.addEventListener("DOMContentLoaded", function () {
        var btnGenerarFactura = document.getElementById('btnGenerarFactura');
        var btnImprimirTabla = document.getElementById('btnImprimirTabla');

        if (<?php echo $resultFactura->num_rows; ?> > 0) {
            btnGenerarFactura.style.display = 'none';
            btnImprimirTabla.style.display = 'block';
        }
    });

    // Obtener la fecha actual en formato DD/MM/YYYY
    function obtenerFechaActual() {
        const fechaActual = new Date();
        const dia = fechaActual.getDate().toString().padStart(2, '0');
        const mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0');
        const anio = fechaActual.getFullYear();
        return `${dia}/${mes}/${anio}`;
    }

    // Actualizar la fecha del pago con la fecha actual
    document.getElementById('fechaPago1').innerText = obtenerFechaActual();
    document.getElementById('fechaPago2').innerText = obtenerFechaActual();
    </script>
    </body>
    </html>
    <?php
    exit;
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generar Factura</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">

    <style>
    body.fondo-transparente {
        background-color: rgba(255, 255, 255, 0.7); /* Fondo blanco transparente */
        margin: 0;
        font-family: 'Arial', sans-serif;
        overflow-x: hidden;
    }
</style>
</head>
<body class="fondo-transparente">

<div class="container-fluid">
    <div class="row">
        <div class="col-md-3" style="padding-left: 50px;">
            <!-- Contenido siempre a la izquierda -->
            <br>
            <h1 class="mb-4">Seleccionar Paciente</h1>

            <form method="post" action="generar_factura.php" class="mb-4">
                <div class="form-group">
                    <label for="paciente">Seleccione un paciente:</label>
                    <select name="paciente" id="paciente" class="form-control">
                        <?php
                        while ($row = $resultPacientes->fetch_assoc()) {
                            $nombreCompleto = $row['nombre'] . ' ' . $row['apellidoPat'] . ' ' . $row['apellidoMat'];
                            echo "<option value=\"$nombreCompleto\">$nombreCompleto</option>";
                        }
                        ?>
                    </select>
                </div>
                <button type="submit" class="btn btn-primary">Generar Factura</button>
            </form>
        </div>
    </div>
</div>

<script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.5.3/dist/umd/popper.min.js"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
</body>
</html>