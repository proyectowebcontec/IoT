import axios from "axios";

// Instancia para la conexión con el backend
const connection = axios.create({
    baseURL: "http://127.0.0.1:8000/api",
    headers: {
        "Content-type": "application/json"
    }
});

connection.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

connection.interceptors.response.use(
    (r) => r,
    (error) => {
        if (error.response?.status === 401 && !error.config.url.includes("/auth/login")) {
            localStorage.removeItem("token");
            window.location.href = "/";     // ajusta a tu ruta
        }
        return Promise.reject(error);
    }
);

export const is_connected = async() => {
    try {
        const response = await connection.get('/health');

        return response.data;
    } catch (error) {
        console.error("Error al verificar la salud de la API", error);
        throw error.response ? error.response.data : 'Error desconocido';
    }
}

export const Login = async (data) => {
    try {
        const response = await connection.post("/auth/login", data);

        return response.data;
    } catch (error) {
        console.error("Error iniciando sesion:", error);
        throw error.response.data;  
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

export const obtenerNoMonitoreos = async (empresa_id, sucursal_id = null, area_id = null, nave_id = null, id_dispositivo = null, estado = "online") => {
    try {
        const response = await connection.get('/monitoreos/count', {
            params: { empresa_id, sucursal_id, area_id, nave_id, estado, id_dispositivo }
        });

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

export const obtenerDispositivosAbsolutos = async (empresa_id, sucursal_id = null, area_id = null, nave_id = null) => {
    try {
        const response = await connection.get('/dispositivos', {
            params: { empresa_id, sucursal_id, area_id, nave_id,}
        });

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

export const obtenerMonitoreosAbsolutos = async (idDispositivo, fechaInicio, fechaFin) => {
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

export const obtenerPromedioVariableTR = async (idDispositivo) => {
    try {
        const response = await connection.get(`/dashboard/promedios/${idDispositivo}`);

        return response.data
    } catch (error) {
        if (error.response?.status === 404) {
            console.error(`No se encontraron registros para calcular el promedio del dispositivo ${idDispositivo} en TR.`);
            return;
        } else if (error.response?.status === 400) {
            console.error(error.response.data.error);
            return;
        }
        console.error(`Error al calculr el promedio del dispositivo ${idDispositivo} en TR.`, error);
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

export const obtenerPromedioVariable = async (idDispositivo, fechaInicio, fechaFin) => {
    try {
        const response = await connection.get(`/dashboard/promedio/${idDispositivo}/${fechaInicio}/${fechaFin}`);

        return response.data
    } catch (error) {
        console.log("----------------------------------", error.response)
        if (error.response?.status === 404) {
            console.error(`No se encontraron registros para calcular el promedio la entrada ${entrada} del dispositivo ${idDispositivo}.`);
            return [];
        } else if (error.response?.status === 400) {
            console.error(error.response.data.error);
            return [];
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

export const obtener_monitoreos_por_rango = async (idDispositivo, fechaInicio, fechaFin) => {
    try {
        const response = await connection.get(`/monitoreos/${idDispositivo}/${fechaInicio}/${fechaFin}`, {"limite": 3000});

        return response.data
    } catch (error) {
        if (error.response?.status === 404) {
            console.error(`No se encontraron registros de monitoreo para el dispositivo ${idDispositivo}.`);
            return [];
        } else if (error.response?.status === 400) {
            console.error(error.response.data.error);
            return [];
        }
        console.error(`Error al buscar registros para la entrada ${entrada} del dispositivo ${idDispositivo}.`, error);
        throw error.response ? error.response.data.error : 'Error desconocido';
    }
}

export const obtener_ultimos_monitoreos = async (idDispositivo) => {
    try {
        const response = await connection.get(`/monitoreos/${idDispositivo}`);

        return response.data
    } catch (error) {
        if (error.response?.status === 404) {
            console.error(`No se encontraron registros de monitoreo para el dispositivo ${idDispositivo}.`);
            return [];
        } else if (error.response?.status === 400) {
            console.error(error.response.data.error);
            return [];
        }
        console.error(`Error al buscar registros para la entrada ${entrada} del dispositivo ${idDispositivo}.`, error);
        throw error.response ? error.response.data.error : 'Error desconocido';
    }
}

export const obtener_arbol_empresas = async () => {
    try {
        const response = await connection.get(`/empresas/arbol`);

        return response.data
    } catch (error) {
        if (error.response?.status === 404) {
            console.error(`No se encontraron empresas registradas.`);
            return [];
        } else if (error.response?.status === 400) {
            console.error(error.response.data.error);
            return [];
        }
        console.error(`Error al buscar empresas registradas.`, error);
        throw error.response ? error.response.data.error : 'Error desconocido';
    }
}

export const obtener_conteo_ubicacion = async (
    empresa_id, sucursal_id = null, area_id = null, nave_id = null, estado = "online"
) => {
    try {
        const response = await connection.get(`/dispositivos/ubicacion/count`, {
            params: { empresa_id, sucursal_id, area_id, nave_id, estado }
        });

        return response.data;
    } catch (error) {
        if (error.response?.status === 404) {
            console.error(`No se encontraron dispositivos registrados.`);
            return { total_dispositivos: 0 };
        }
        console.error(`Error al buscar dispositivos registrados.`, error);
        throw error.response?.data?.detail ?? error.response?.data?.error ?? 'Error desconocido';
    }
}

export const obtener_dispositivos_resumen = async (empresa_id, sucursal_id = null, area_id = null, nave_id = null, estado = "online") => {
    try {
        const response = await connection.get(`/dispositivos/resumen`, {
            params: { empresa_id, sucursal_id, area_id, nave_id, estado }
        });

        return response.data
    } catch (error) {
        if (error.response?.status === 404) {
            console.error(`No se encontraron las ubicaciones para dispositivos registradas.`);
            return [];
        } else if (error.response?.status === 400) {
            console.error(error.response.data.error);
            return [];
        }
        console.error(`Error: No se encontraron las ubicaciones para dispositivos registradas.`, error);
        throw error.response ? error.response.data.error : 'Error desconocido';
    }
}