// Datos para el primer gráfico
var dataChart1 = {
    labels: ["Pacientes Felices", "Testimonios de pacientes"],
    datasets: [{
        label: "Pacientes Felices",
        data: [10546546, 0],
        backgroundColor: ["rgba(255, 99, 132, 0.2)"],
        borderColor: ["rgba(255, 99, 132, 1)"],
        borderWidth: 1
    }, {
        label: "Testimonios de pacientes",
        data: [0, 3565656],
        backgroundColor: ["rgba(153, 102, 255, 0.2)"],
        borderColor: ["rgba(153, 102, 255, 1)"],
        borderWidth: 1
    }]
};

// Configuración del primer gráfico
var configChart1 = {
    type: 'bar',
    data: dataChart1,
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
};

// Crear el primer gráfico
var ctxChart1 = document.getElementById('chart1').getContext('2d');
new Chart(ctxChart1, configChart1);

// Datos para el segundo gráfico
var dataChart2 = {
    labels: ["Personal Certificado", "Equipos Médicos", "Habitaciones para estancias médicas", "Cursos de capacitación activos"],
    datasets: [{
        label: "Personal Certificado",
        data: [235, 0, 0, 0],
        backgroundColor: ["rgba(75, 192, 192, 0.2)"],
        borderColor: ["rgba(75, 192, 192, 1)"],
        borderWidth: 1
    }, {
        label: "Equipos Médicos",
        data: [0, 76, 0, 0],
        backgroundColor: ["rgba(255, 205, 86, 0.2)"],
        borderColor: ["rgba(255, 205, 86, 1)"],
        borderWidth: 1
    }, {
        label: "Habitaciones para estancias médicas",
        data: [0, 0, 132, 0],
        backgroundColor: ["rgba(54, 162, 235, 0.2)"],
        borderColor: ["rgba(54, 162, 235, 1)"],
        borderWidth: 1
    }, {
        label: "Cursos de capacitación activos",
        data: [0, 0, 0, 55],
        backgroundColor: ["rgba(255, 159, 64, 0.2)"],
        borderColor: ["rgba(255, 159, 64, 1)"],
        borderWidth: 1
    }]
};

// Configuración del segundo gráfico
var configChart2 = {
    type: 'bar',
    data: dataChart2,
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
};

// Crear el segundo gráfico
var ctxChart2 = document.getElementById('chart2').getContext('2d');
new Chart(ctxChart2, configChart2);