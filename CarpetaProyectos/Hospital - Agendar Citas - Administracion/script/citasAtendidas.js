$(document).ready(function () {
    cargarCitas();
});

function eliminarCita(id) {
    var confirmacion = confirm("¿Estás seguro de que deseas eliminar esta cita?");
    
    if (confirmacion) {
        $.ajax({
            url: 'http://localhost/HOSPITAL/php/eliminarCitaAtendida.php',
            type: 'POST',
            data: { id: id },
            success: function (response) {
                cargarCitas();
            },
            error: function (error) {
                console.error('Error al eliminar cita:', error);
            }
        });
    }
}

function cargarCitas() {
    $.ajax({
        url: 'http://localhost/HOSPITAL/php/citaAtendidaShow.php',
        type: 'POST',
        dataType: 'json',
        success: function (data) {
            mostrarCitas(data);
            console.log(data);
        },
        error: function (xhr, status, error) {
    console.error('Error al obtener datos de citas:', status, error);
    console.log('Respuesta del servidor:', xhr.responseText);
}
    });
}

function mostrarCitas(citas) {
    var tablaBody = $('#tablaCitas tbody');
    tablaBody.empty();

    citas.forEach(function (cita) {
        var doctorAsignado = "NO ASIGNADO";

        if (cita.doctorAsignado !== undefined && cita.doctorAsignado !== null) {
            doctorAsignado = cita.doctorAsignado; // No accedas a la propiedad nombre_completo aquí
            doctorAsignado = doctorAsignado.toUpperCase(); // Convertir a mayúsculas
        }

        // Agrega la nueva columna de estado
        var estado = cita.estado !== undefined ? cita.estado.toUpperCase() : "PENDIENTE";

        var fila = $('<tr>');
        fila.append('<td>' + cita.folio + '</td>');
        fila.append('<td>' + cita.apellidoPat + '</td>');
        fila.append('<td>' + cita.apellidoMat + '</td>');
        fila.append('<td>' + cita.nombre + '</td>');
        fila.append('<td>' + cita.telefono + '</td>');
        fila.append('<td>' + cita.curp + '</td>');
        fila.append('<td>' + cita.rfc + '</td>');
        fila.append('<td>' + cita.edad + '</td>');
        fila.append('<td>' + cita.fechaNac + '</td>');
        fila.append('<td>' + cita.fechaCita + '</td>');
        fila.append('<td>' + cita.horaCita + '</td>');
        fila.append('<td>' + cita.domicilio + '</td>');
        fila.append('<td>' + cita.sintomas + '</td>');
        fila.append('<td>' + cita.diagnostico + '</td>');
        fila.append('<td>' + cita.tratamiento + '</td>');
        fila.append('<td>' + doctorAsignado + '</td>');
        fila.append('<td>' + estado + '</td>'); // Nueva columna de estado
        fila.append('<td class="options">' +
            '<span class="btn btn-danger" onclick="eliminarCita(' + cita.folio + ')">Eliminar</span>' +
            '</td>');
        tablaBody.append(fila);
    });
}

// Función para obtener el ID del doctor actual para una cita específica
function obtenerIdDoctorActual(id) {
    // Implementa lógica para obtener el ID del doctor actual para la cita con el ID dado
    // Puedes hacer otra llamada AJAX para obtener esta información si no la tienes disponible
}

// Esta función se llama cada vez que se escribe en la barra de búsqueda
function searchFunction() {
    // Obtener el valor del input de búsqueda
    var input, filter, table, tr, td, i, j, txtValue;
    input = document.getElementById("searchInput");
    filter = input.value.toUpperCase();
    table = document.getElementById("tablaCitas");
    tr = table.getElementsByTagName("tr");

    // Recorrer todas las filas de la tabla
    for (i = 1; i < tr.length; i++) {
        // Mostrar la fila por defecto
        tr[i].style.display = "none";

        // Recorrer todas las celdas de la fila
        for (j = 0; j < tr[i].cells.length; j++) {
            // Obtener la celda
            td = tr[i].cells[j];

            // Si la celda existe
            if (td) {
                // Obtener el texto de la celda y convertirlo a mayúsculas
                txtValue = td.textContent || td.innerText;
                txtValue = txtValue.toUpperCase();

                // Comprobar si el texto de la celda contiene la cadena de búsqueda
                if (txtValue.indexOf(filter) > -1) {
                    // Mostrar la fila si hay coincidencia
                    tr[i].style.display = "";
                    // No es necesario buscar más en esta fila, salir del bucle interno
                    break;
                }
            }
        }
    }
}