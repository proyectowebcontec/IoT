import React, { useState} from 'react';
import Dashboard from './Dashboard';
import Historial from './Historial';
import Dispositivos from './Dispositivos';
import PolipastoControl from './PolipastoControl';

export default function DashboardClient() {
    const [selectedSection, setSelectedSection] = useState('default'); // Estado inicial como 'default'
    //usuario en local estorage
    const usuarioLogueado = JSON.parse(localStorage.getItem('usuario') || '{}');


    // Función para renderizar el contenido basado en la sección seleccionada
    const renderContent = () => {
        switch (selectedSection) {
            // primero deben crear el componente de cada una de las opciones
            // luego deben importar el componente y agregarlo a la lista de opciones
            // todo esto debe estar  en la carpeta components
            case 'dashboard':
                return <Dashboard/>;
            case 'historial':
                return <Historial/>;
            case 'dispositivos':
                return <Dispositivos/>;
            case 'polipasto':
                return <PolipastoControl />;
            case 'default':
            default:
                return  null; // Mostrar Storage en el estado por defecto
        }
    };

    // Condición para mostrar el botón: en 'storage' o en 'default'

    return (
        <div className="dashboard-container">
            <Navbar onSelect={setSelectedSection}/>
            <div className="content">
                <div className="card-section">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}
