import React, { useState, useEffect} from 'react';
import DashboardNavbar from "../components/DashboardNavbar";
import Header from "../components/Header";
import Service from '../services/Service';
import { Outlet } from 'react-router-dom';

import { Bounce, toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Administrador() {   
    //usuario en local estorage
   // const usuarioLogueado = JSON.parse(localStorage.getItem('usuario') || '{}');
    const [status, setStatus] = useState(0);

   useEffect(() => {
    const fetchStatus = async () => {
        try {
        const estado = await Service.is_connected();

        setStatus(estado);
        toast.success("Sistema activado exitósamente", { position: "top-right", });
        } catch (error) {
        console.error("Error al verificar salud de la API", error);
        toast.error(`Error: El sistema no está disponible.`, { position: 'top-right' });
        }
    }

    fetchStatus()
    }, []);

    // Condición para mostrar el botón: en 'storage' o en 'default'

    return (
        <main className="content">

            <Header status={status} />
        
            <Outlet /> 
            <ToastContainer 
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
                transition={Bounce}
            />
        </main>
    );
}
