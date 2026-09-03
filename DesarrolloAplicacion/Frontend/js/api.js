const API_URL = "http://127.0.0.1:8000";

const charts = {};

async function obtenerDashboard(idDispositivo, entrada) {

    const response = await fetch(
        `${API_URL}/api/dashboard/mediciones/${idDispositivo}/${entrada}`
    );

    if (!response.ok) {
        throw new Error(
            "Error obteniendo información del dispositivo"
        );
    }

    return await response.json();
}

async function cargarDashboard(ctxId, title, sensor) {

    try {

        const data = await obtenerDashboard(
            "WHG-151-001",
            sensor
        );

        //console.log(data);

        mostrarDashboard(
            data,
            ctxId,
            title
        );

    } catch (error) {

        console.error("Error al cargar dashboard:", error);

    }
}

function mostrarDashboard(data, ctxId, title) {

    const ctx = document.getElementById(ctxId);

    if (!ctx) {
        console.error(`No existe el canvas con id: ${ctxId}`);
        return;
    }

    // Preparar datos
    const labels = data.map(item => {
        const fecha = new Date(item.fecha);

        return fecha.toLocaleTimeString("es-GT", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });
    });

    const valores = data.map(item => item.valor);

    // Si ya existe una gráfica para este canvas,
    // destruirla antes de crear la nueva
    if (charts[ctxId]) {
        charts[ctxId].destroy();
    }

    // Crear gráfica
    charts[ctxId] = new Chart(ctx, {
        type: "line",

        data: {
            labels: labels,

            datasets: [{
                label: title,
                data: valores,
                borderWidth: 2,
                tension: 0.3,
                fill: false
            }]
        },

        options: {
            responsive: true,

            scales: {
                x: {
                    title: {
                        display: true,
                        text: "Hora"
                    }
                },

                y: {
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: "Valor"
                    }
                }
            }
        }
    });
}

async function obtenerConteoDispositivos() {
    try {
        const response = await fetch('http://127.0.0.1:8000/api/dispositivos/count');

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();

        document.getElementById('no_dispositivos').textContent =
            data.totalDispositivos;

    } catch (error) {
        console.error('Error al obtener el conteo de dispositivos:', error);
    }
}

async function obtenerNoMonitoreos() {
    try {
        const response = await fetch('http://127.0.0.1:8000/api/monitoreos/count');

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();

        document.getElementById('conteo-registros').textContent =
            data.total_monitoreos;

    } catch (error) {
        console.error('Error al obtener el conteo de monitoreos:', error);
    }
}

async function obtenerDispositivos() {
    try {
        const response = await fetch('http://127.0.0.1:8000/api/dispositivos');

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();

        const selectDispositivos = document.getElementById('select-dispositivos');

        data.forEach(dispositivo => {
            const option = document.createElement('option');
            option.value = dispositivo.IDDispositivo.toLowerCase();
            option.text = dispositivo.IDDispositivo;
            selectDispositivos.appendChild(option);
        });

    } catch (error) {
        console.error('Error al obtener el conteo de monitoreos:', error);
    }
}

async function obtenerConteoPulsaciones(idDispositivo, entrada) {
    try {
        const response = await fetch(`${API_URL}/api/dashboard/pulsos/${idDispositivo}/${entrada}`);

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();

        document.getElementById('conteo-pulsaciones').textContent =
            data.total;

    } catch (error) {
        console.error('Error al obtener el conteo de pulsos:', error);
    }
}

obtenerConteoDispositivos();
obtenerNoMonitoreos();
obtenerDispositivos();
cargarDashboard("myChart", "Voltaje entrada U6", "U6");
cargarDashboard("PulsacionesChart", "Entrada DI3", "DI3");
cargarDashboard("VoltajeX", "Voltaje entrada U7", "U7");
cargarDashboard("VoltajeY", "Voltaje entrada U8", "U8");
obtenerConteoPulsaciones("WHG-151-001", "DI3");

setInterval(obtenerConteoDispositivos, 5000);
setInterval(obtenerNoMonitoreos, 5000);
setInterval(obtenerDispositivos, 5000);
setInterval(() => {
    cargarDashboard("myChart", "Voltaje entrada U6", "U6");
}, 5000);

setInterval(() => {
    cargarDashboard("PulsacionesChart", "Entrada DI3", "DI3");
}, 5000);

setInterval(() => {
    cargarDashboard("VoltajeX", "Voltaje entrada U7", "U7");
}, 5000);

setInterval(() => {
    cargarDashboard("VoltajeY", "Voltaje entrada U8", "U8");
}, 5000);

setInterval(() => {
    obtenerConteoPulsaciones("WHG-151-001", "DI3");
}, 5000);
