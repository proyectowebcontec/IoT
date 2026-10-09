import { createBrowserRouter } from "react-router-dom";
import FormLogin from "../pages/login";
import Dashboard from "../pages/Dashboard";


export const router = createBrowserRouter([
    {
        path: "/",
        element: <FormLogin/>,
    },
    {
        path: "/dashboard",
        element: <Dashboard/>
    }
]);