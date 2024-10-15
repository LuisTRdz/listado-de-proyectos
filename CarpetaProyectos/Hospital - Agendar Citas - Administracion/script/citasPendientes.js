$(document).ready(function () {
    cargarCitas();
});

function eliminarCita(id) {
    var confirmacion = confirm("¿Estás seguro de que deseas eliminar esta cita?");
    
    if (confirmacion) {
        $.ajax({
            url: 'http://localhost/HOSPITAL/php/eliminarCitaPendiente.php',
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
    // Obtener la lista de doctores
    $.ajax({
        url: 'http://localhost/HOSPITAL/php/obtenerDoctores.php',
        type: 'GET',
        dataType: 'json',
        success: function (doctores) {
            // Construir la lista desplegable de doctores con paterno, materno, nombre y especialidad
            var listaDoctores = '<select id="selectDoctor">';
            listaDoctores += '<option value="">Asignar Doctor</option>';

            doctores.forEach(function (doctor) {
                listaDoctores += '<option value="' + doctor.ncontrol + '">' + doctor.nombre_completo + '</option>';
            });

            listaDoctores += '</select>';

            // Mostrar la lista desplegable en el contenedor designado
            $('#doctorDropdownContainer').html(listaDoctores);
        },
        error: function (xhr, status, error) {
            console.error('Error al obtener la lista de doctores:', status, error);
            console.log('Respuesta del servidor:', xhr.responseText);
        }
    });

    alert("Modificar cita con ID: " + id);
}

function agendarCita(id) {
    // Obtener el valor seleccionado en la lista de doctores
    var idDoctorSeleccionado = $('#selectDoctor').val();

    if (idDoctorSeleccionado) {
        // Confirmar la acción antes de proceder
        var confirmacion = confirm("¿Estás seguro de confirmar la cita con el doctor seleccionado?");
        
        if (confirmacion) {
            // Obtener la información del doctor seleccionado
            var doctorSeleccionado = $('#selectDoctor option:selected').text();

            // Aquí puedes realizar la acción de guardar los datos en otra tabla
            // Puedes utilizar una llamada AJAX similar a las que ya has utilizado
            // Ajusta la URL y los datos a tu lógica específica
            $.ajax({
                url: 'http://localhost/HOSPITAL/php/confirmarCita.php',
                type: 'POST',
                data: { 
                    id: id,
                    idDoctor: idDoctorSeleccionado,  // <-- Corregir este nombre a idDoctor
                    doctorAsignado: doctorSeleccionado,
                    // ...otros datos que necesites enviar
                },
                success: function (response) {
                    // Puedes realizar alguna acción adicional después de confirmar
                    alert("Cita confirmada exitosamente.");
                    cargarCitas(); // Recargar las citas después de la confirmación
                },
                error: function (xhr, status, error) {
                    console.error('Error al confirmar cita:', status, error);
                    console.log('Respuesta del servidor:', xhr.responseText);
                    alert("Error al confirmar la cita. Verifica la consola para más detalles.");
                }
            });
        }
    } else {
        // Si no hay doctor seleccionado, mostrar un mensaje de alerta
        alert("Selecciona un doctor antes de confirmar la cita.");
    }
}

var valorDoctorActual; // Variable para almacenar el valor actual del "doctorAsignado"

function cargarCitas() {
    $.ajax({
        url: 'http://localhost/HOSPITAL/php/citasPendientes.php',
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
        var doctorAsignado = "NO ASIGNADO";

        if (cita.doctorAsignado !== undefined && cita.doctorAsignado !== null) {
            doctorAsignado = cita.doctorAsignado; // No accedas a la propiedad nombre_completo aquí
            doctorAsignado = doctorAsignado.toUpperCase(); // Convertir a mayúsculas
        }

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
        fila.append('<td>' + doctorAsignado + '</td>');
        fila.append('<td class="options">' +
            '<span class="btn btn-danger" onclick="eliminarCita(' + cita.folio + ')">Eliminar</span>' +
            '<span class="btn btn-success" onclick="modificarCita(' + cita.folio + ')">Modificar</span>' +
            '<span class="btn btn-primary" onclick="agendarCita(' + cita.folio + ')">Confirmar</span>' +
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