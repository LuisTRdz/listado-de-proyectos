$(document).ready(function () {
    cargarCitas();
});

function eliminarCita(id) {
    var confirmacion = confirm("¿Estás seguro de que deseas eliminar esta cita?");
    
    if (confirmacion) {
        $.ajax({
            url: 'http://localhost/HOSPITAL/php/eliminarCitaConfirmada.php',
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

function modificarCita(id) {
    // Obtener la lista de doctores y diagnósticos
    $.ajax({
        url: 'http://localhost/HOSPITAL/php/obtenerTratamientos.php',
        type: 'GET',
        dataType: 'json',
        success: function (tratamientos) {

           // Construir la lista desplegable de doctores con paterno, materno, nombre y especialidad
            var listaTratamientos = '<input style="margin-right: 20px" type="text" id="inputDiagnostico" placeholder="Diagnóstico...">';
            listaTratamientos += '<select id="selectTratamiento">';
            listaTratamientos += '<option value="">Asignar Tratamiento</option>';

            tratamientos.forEach(function (tratamiento) {
                listaTratamientos += '<option value="' + tratamiento.IdTratamiento + '">' + tratamiento.nombre_completo + '</option>';
            });

            listaTratamientos += '</select>';

            // Mostrar la lista desplegable y el input en el contenedor designado
            $('#tratamientoDropdownContainer').html(listaTratamientos);
        },
        error: function (xhr, status, error) {
            console.error('Error al obtener la lista de tratamientos:', status, error);
            console.log('Respuesta del servidor:', xhr.responseText);
        }
    });

    alert("Modificar cita con ID: " + id);
}

function agendarCita(id) {
    // Obtener el valor seleccionado en la lista de doctores y diagnósticos
    var idTratamientoSeleccionado = $('#selectTratamiento').val();
    var diagnosticoSeleccionado = $('#inputDiagnostico').val();

    if (idTratamientoSeleccionado) {
        // Confirmar la acción antes de proceder
        var confirmacion = confirm("¿Estás seguro de el diagnóstico y del tratamiento?");
        
        if (confirmacion) {
            // Obtener la información del doctor y diagnóstico seleccionado
            var tratamientoSeleccionado = $('#selectTratamiento option:selected').text();

            // Aquí puedes realizar la acción de guardar los datos en otra tabla
            // Puedes utilizar una llamada AJAX similar a las que ya has utilizado
            // Ajusta la URL y los datos a tu lógica específica
            $.ajax({
                url: 'http://localhost/HOSPITAL/php/confirmarCita2.php',
                type: 'POST',
                data: { 
                    id: id,
                    IdTratamiento: idTratamientoSeleccionado,
                    tratamiento: tratamientoSeleccionado,
                    diagnostico: diagnosticoSeleccionado,
                    // ...otros datos que necesites enviar
                },
                success: function (response) {
                    // Puedes realizar alguna acción adicional después de confirmar
                    alert("Cita atendida exitosamente.");
                    cargarCitas(); // Recargar las citas después de la confirmación
                },
                error: function (xhr, status, error) {
                    console.error('Error al confirmar cita:', status, error);
                    console.log('Respuesta del servidor:', xhr.responseText);
                    alert("Error al atender la cita. Verifica la consola para más detalles.");
                }
            });
        }
    } else {
        // Si no hay doctor seleccionado, mostrar un mensaje de alerta
        alert("Selecciona un tratamiento antes de confirmar la cita.");
    }
}

var valorTratamientoActual; // Variable para almacenar el valor actual del "doctorAsignado"

function cargarCitas() {
    $.ajax({
        url: 'http://localhost/HOSPITAL/php/citasConfirmadas.php',
        type: 'POST',
        dataType: 'json',
        success: function (data) {
            mostrarCitas(data);
            console.log(data);
        },
        error: function (error) {
            console.error('Error al obtener datos de citas:', error);
        }
    });
}

function mostrarCitas(citas) {
    var tablaBody = $('#tablaCitas tbody');
    tablaBody.empty();

    citas.forEach(function (cita) {

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
        fila.append('<td>' + cita.doctorAsignado + '</td>');
        fila.append('<td class="options">' +
            '<span class="btn btn-danger" onclick="eliminarCita(' + cita.folio + ')">Eliminar</span>' +
            '<span class="btn btn-success" onclick="modificarCita(' + cita.folio + ')">Modificar</span>' +
            '<span class="btn btn-primary" onclick="agendarCita(' + cita.folio + ')">Confirmar</span>' +
            '<span class="btn btn-info" onclick="marcarComoAtendida(' + cita.folio + ')">Atendida</span>' + // Nuevo botón
            '</td>');
        tablaBody.append(fila);
    });
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

// Nueva función para marcar la cita como "Atendida"
function marcarComoAtendida(id) {
    // Obtener el diagnóstico y tratamiento de la cita
    var diagnostico = $('#tablaCitas tbody tr:contains(' + id + ') td:nth-child(14)').text();
    var tratamiento = $('#tablaCitas tbody tr:contains(' + id + ') td:nth-child(15)').text();

    // Validar que haya diagnóstico y tratamiento antes de marcar como atendida
    if (diagnostico.trim() === "" || tratamiento.trim() === "") {
        alert("Agrega un diagnóstico y un tratamiento antes de marcar como atendida.");
        return;
    }

    // Confirmar la acción antes de proceder
    var confirmacion = confirm("¿Estás seguro de marcar esta cita como atendida?");
    
    if (confirmacion) {
        // Implementa lógica para marcar la cita como "Atendida"
        // Puedes utilizar una llamada AJAX similar a las que ya has utilizado
        // Ajusta la URL y los datos a tu lógica específica
        $.ajax({
            url: 'http://localhost/HOSPITAL/php/citasAtendidas.php',
            type: 'POST',
            data: { id: id },
            success: function (response) {
                // Puedes realizar alguna acción adicional después de marcar como "Atendida"
                alert(response); // Mostrar mensaje de éxito o error
                cargarCitas(); // Recargar las citas después de la acción
            },
            error: function (xhr, status, error) {
                console.error('Error al marcar cita como atendida:', status, error);
                console.log('Respuesta del servidor:', xhr.responseText);
                alert("Error al marcar la cita como atendida. Verifica la consola para más detalles.");
            }
        });
    }
}
