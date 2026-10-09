import axios from "axios";

// Instancia para la conexión con el backend
const connection = axios.create({
    baseURL: "http://127.0.0.1:8000/api",
    headers: {
        "Content-type": "application/json"
    }
});

export const is_connected = async() => {
    try {
        const response = await connection.get('/health');

        return response.data;
    } catch (error) {
        console.error("#####################################################Error al verificar la salud de la API", error);
        console.error("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$", error.response.data)
        throw error.response ? error.response.data : 'Error desconocido';
    }
}


export const obtenerConteoDispositivos = async () => {
    try {
        // const response = await connection.get('/usuarios/', { params: { buscar: termino } });
        const response = await connection.get('/dispositivos/count');

        return response.data;

    } catch (error) {
        if (error.response?.status === 404) {
            console.error("No se encontraron dispositivos para contar.");
            return;
        } else if (error.response?.status === 400) {
            console.error(error.response.data.error);
            return;
        }
        console.log("----------------------------------", error.response)
        console.error("Error al contar dispositivos", error);
        throw error.response ? error.response.data.error : 'Error desconocido';
    }
};

export const obtenerNoMonitoreos = async () => {
    try {
        const response = await connection.get('/monitoreos/count');

        return response.data;

    } catch (error) {
        if (error.response?.status === 404) {
            console.error("No se encontraron monitoreos registrados.");
            return;
        } else if (error.response?.status === 400) {
            console.error(error.response.data.error);
            return;
        }
        console.error("Error al contar la cantidad total de monitoreos", error);
        throw error.response ? error.response.data.error : 'Error desconocido';
    }
};

export const obtenerDispositivos = async () => {
    try {
        const response = await connection.get('/dispositivos');

        return response.data;
    } catch (error) {
        if (error.response?.status === 404) {
            console.error("No se encontraron dispositivos registrados.");
            return;
        } else if (error.response?.status === 400) {
            console.error(error.response.data.error);
            return;
        }
        console.error("Error al buscar dispositivos registrados", error);
        throw error.response ? error.response.data.error : 'Error desconocido';
    }

};

export const obtenerMonitoreos = async (idDispositivo, fechaInicio, fechaFin) => {
    try {
        const response = await connection.get(`/monitoreos/${idDispositivo}/${fechaInicio}/${fechaFin}`);

        return response.data
    } catch (error) {
        if (error.response?.status === 404) {
            console.error(`No se encontraron registros del dispositivo ${idDispositivo}.`);
            return [];
        } else if (error.response?.status === 400) {
            console.error(error.response.data.error);
            return [];
        }
        console.error(`Error al buscar registros del dispositivo ${idDispositivo}.`, error);
        throw error.response ? error.response.data.error : 'Error desconocido';
    }
};

export const obtenerConteoPulsaciones = async (idDispositivo, entrada, fechaInicio, fechaFin) => {
    try {
        const response = await connection.get(`/dashboard/pulsos/${idDispositivo}/${entrada}/${fechaInicio}/${fechaFin}`);

        return response.data;
    } catch (error) {
        if (error.response?.status === 404) {
            console.error(`No se encontraron pulsaciones para la entrada ${entrada} del dispositivo ${idDispositivo}.`);
            return;
        } else if (error.response?.status === 400) {
            console.error(error.response.data.error);
            return;
        }
        console.error(`Error al buscar pulsaciones para la entrada ${entrada} del dispositivo ${idDispositivo}.`, error);
        throw error.response ? error.response?.data.error : 'Error desconocido';
    }
};

export const obtenerDashboard = async (idDispositivo, entrada, fechaInicio, fechaFin) => {
    try {
        const response = await connection.get(`/dashboard/mediciones/${idDispositivo}/${entrada}/${fechaInicio}/${fechaFin}`);

        return response.data
    } catch (error) {
        if (error.response?.status === 404) {
            console.error(`No se encontraron registros para la entrada ${entrada} del dispositivo ${idDispositivo}.`);
            return [];
        } else if (error.response?.status === 400) {
            console.error(error.response.data.error);
            return [];
        }
        console.error(`Error al buscar registros para la entrada ${entrada} del dispositivo ${idDispositivo}.`, error);
        throw error.response ? error.response.data.error : 'Error desconocido';
    }
};

export const obtenerPromedioVariableTR = async (idDispositivo, entrada) => {
    try {
        const response = await connection.get(`/dashboard/promedio/${idDispositivo}/${entrada}`);

        return response.data
    } catch (error) {
        if (error.response?.status === 404) {
            console.error(`No se encontraron registros para calcular el promedio la entrada ${entrada} del dispositivo ${idDispositivo} en TR.`);
            return;
        } else if (error.response?.status === 400) {
            console.error(error.response.data.error);
            return;
        }
        console.error(`Error al calculr el promedio para la entrada ${entrada} del dispositivo ${idDispositivo} en TR.`, error);
        throw error.response ? error.response.data.error : 'Error desconocido';
    }
}


export const obtenerConteoPulsacionesTR = async (idDispositivo, entrada) => {
    try {
        const response = await connection.get(`/dashboard/pulsos/${idDispositivo}/${entrada}`);
        
        return response.data;
    } catch (error) {
        if (error.response?.status === 404) {
            console.error(`No se encontraron pulsaciones para la entrada ${entrada} del dispositivo ${idDispositivo} en TR.`);
            return;
        } else if (error.response?.status === 400) {
            console.error(error.response.data.error);
            return;
        }
        console.error(`Error al buscar pulsaciones para la entrada ${entrada} del dispositivo ${idDispositivo} en TR.`, error);
        throw error.response ? error.response.data.error : 'Error desconocido';
    }
};

export const obtenerDashboardTR = async (idDispositivo, entrada) => {
    try {
        const response = await connection.get(`/dashboard/mediciones/${idDispositivo}/${entrada}`);

        return response.data
    } catch (error) {
        if (error.response?.status === 404) {
            console.error(`No se encontraron registros para la entrada ${entrada} del dispositivo ${idDispositivo} en TR.`);
            return;
        } else if (error.response?.status === 400) {
            console.error(error.response.data.error);
            return;
        }
        console.error(`Error al buscar registros para la entrada ${entrada} del dispositivo ${idDispositivo} en TR.`, error);
        throw error.response ? error.response.data.error : 'Error desconocido';
    }
};

export const obtenerPromedioVariable = async (idDispositivo, entrada, fechaInicio, fechaFin) => {
    try {
        const response = await connection.get(`/dashboard/promedio/${idDispositivo}/${entrada}/${fechaInicio}/${fechaFin}`);

        return response.data
    } catch (error) {
        console.log("----------------------------------", error.response)
        if (error.response?.status === 404) {
            console.error(`No se encontraron registros para calcular el promedio la entrada ${entrada} del dispositivo ${idDispositivo}.`);
            return;
        } else if (error.response?.status === 400) {
            console.error(error.response.data.error);
            return;
        }
        console.error(`Error al calculr el promedio para la entrada ${entrada} del dispositivo ${idDispositivo}.`, error);
        throw error.response ? error.response.data.error : 'Error desconocido';
    }
}

export const obtenerHistorialMediciones = async (idDispositivo, entrada) => {
    try {
        const response = await connection.get(`/monitoreos/historial/${idDispositivo}/${entrada}`);

        return response.data
    } catch (error) {
        if (error.response?.status === 404) {
            console.error(`No se encontraron registros para la entrada ${entrada} del dispositivo ${idDispositivo} en TR.`);
            return;
        } else if (error.response?.status === 400) {
            console.error(error.response.data.error);
            return;
        }
        console.error(`Error al buscar registros para la entrada ${entrada} del dispositivo ${idDispositivo} en TR.`, error);
        throw error.response ? error.response.data.error : 'Error desconocido';
    }
};

export const enviarSMS = async (telefono) => {
    try {
        const response = await connection.post(`/alarmas/sms/${telefono}`);

        return response.data
    } catch (error) {
        if (error.response?.status === 500) {
            console.error(`No se pudo enviar la alarma al número ${telefono} en TR.`);
            throw error.response;
        } else if (error.response?.status === 400) {
            console.error(error.response.data.error);
            throw error.response.data.error;
        }
        console.error(`Error al enviar mensaje de texto al número ${telefono}.`, error);
        throw error.response ? error.response.data.error : 'Error desconocido';
    }
};