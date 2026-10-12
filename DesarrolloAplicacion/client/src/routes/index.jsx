import { createBrowserRouter } from "react-router-dom";
import FormLogin from "../pages/login";
import Administrador from "../pages/Administrador";
import Dashboard from '../pages/Dashboard';
import Historial from '../pages/Historial';
import Dispositivos from '../pages/Dispositivos';
import PolipastoControl from '../pages/PolipastoControl';


export const router = createBrowserRouter([
    /* TODO: Aquí se deben agregar las rutas a los dashboards para cada rol, MFA u otros 
    componentes generales.*/
    {
        path: "/",
        element: <FormLogin/>,
    },
    {
        path: "/dashboardadmin",
        element: <Administrador/>,
        children: [
            { index: true, element: <Dashboard /> },
            { path: 'dispositivos', element: <Dispositivos /> },
            { path: 'historial', element: <Historial /> },
            { path: 'simulador', element: <PolipastoControl /> },
        ]
    }
]);