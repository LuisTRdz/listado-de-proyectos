$(document).ready(function () {
      cargarTabla('citas', 'tablaPendientes');
      cargarTabla('citasconfirmadas', 'tablaConfirmadas');
      cargarTabla('citasatendidas', 'tablaAtendidas');

      // Manejador de eventos para cambiar de pestaña
      $('#myTabs a').on('shown.bs.tab', function (e) {
        var targetTab = $(e.target).attr('href').substring(1);
        cargarTabla(targetTab, 'tabla' + targetTab.charAt(0).toUpperCase() + targetTab.slice(1));
      });
    });

    // Función para cargar datos en una tabla
    function cargarTabla(tipo, tablaId) {
      $.ajax({
        url: 'http://localhost/HOSPITAL/php/informe.php',
        type: 'POST',
        data: { tipo: tipo },
        dataType: 'json',
        success: function (data) {
          mostrarCitas(data, tablaId);
        },
        error: function (error) {
          console.error('Error al obtener datos de citas:', error);
        }
      });
    }

    // Función para mostrar citas en una tabla específica
    function mostrarCitas(citas, tablaId) {
      var tablaBody = $('#' + tablaId);
      tablaBody.empty();

      // Agrega cabecera de la tabla
      var cabecera = '<thead class="thead-dark"><tr>';
      cabecera += '<th>Folio</th>';
      cabecera += '<th>Apellido Paterno</th>';
      cabecera += '<th>Apellido Materno</th>';
      cabecera += '<th>Nombre(s)</th>';
      cabecera += '<th>Teléfono</th>';
      cabecera += '<th>CURP</th>';
      cabecera += '<th>RFC</th>';
      cabecera += '<th>Edad</th>';
      cabecera += '<th>Fecha de Nacimiento</th>';
      cabecera += '<th>Fecha de Cita</th>';
      cabecera += '<th>Hora de Cita</th>';
      cabecera += '<th>Domicilio</th>';
      cabecera += '<th>Síntomas</th>';
      cabecera += '<th>Diagnóstico</th>';
      cabecera += '<th>Tratamiento</th>';
      cabecera += '<th>Doctor asignado</th>';
      
      // Agrega columna de estado si es la tabla de citas atendidas
      if (tablaId === 'tablaAtendidas') {
        cabecera += '<th>Estado de Asistencia</th>';
      }
      
      cabecera += '</tr></thead>';
      tablaBody.append(cabecera);

      // Agrega cuerpo de la tabla
      var cuerpo = '<tbody>';
      citas.forEach(function (cita) {
        var doctorAsignado = cita.doctorAsignado !== undefined && cita.doctorAsignado !== null ? cita.doctorAsignado.toUpperCase() : "NO ASIGNADO";
        
        // Agrega la nueva columna de estado si es la tabla de citas atendidas
        var estado = tablaId === 'tablaAtendidas' && cita.estado !== undefined ? cita.estado.toUpperCase() : "PENDIENTE";
        
        cuerpo += '<tr>';
        cuerpo += '<td>' + cita.folio + '</td>';
        cuerpo += '<td>' + cita.apellidoPat + '</td>';
        cuerpo += '<td>' + cita.apellidoMat + '</td>';
        cuerpo += '<td>' + cita.nombre + '</td>';
        cuerpo += '<td>' + cita.telefono + '</td>';
        cuerpo += '<td>' + cita.curp + '</td>';
        cuerpo += '<td>' + cita.rfc + '</td>';
        cuerpo += '<td>' + cita.edad + '</td>';
        cuerpo += '<td>' + cita.fechaNac + '</td>';
        cuerpo += '<td>' + cita.fechaCita + '</td>';
        cuerpo += '<td>' + cita.horaCita + '</td>';
        cuerpo += '<td>' + cita.domicilio + '</td>';
        cuerpo += '<td>' + cita.sintomas + '</td>';
        cuerpo += '<td>' + cita.diagnostico + '</td>';
        cuerpo += '<td>' + cita.tratamiento + '</td>';
        cuerpo += '<td>' + doctorAsignado + '</td>';
        
        // Agrega la nueva columna de estado si es la tabla de citas atendidas
        if (tablaId === 'tablaAtendidas') {
          cuerpo += '<td>' + estado + '</td>';
        }
        
        cuerpo += '</tr>';
      });
      cuerpo += '</tbody>';
      tablaBody.append(cuerpo);
    }