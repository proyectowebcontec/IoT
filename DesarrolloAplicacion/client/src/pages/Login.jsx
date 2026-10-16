
import { useNavigate } from 'react-router-dom';
import '../styles/FormLogin.css';
import { useState } from 'react';
import Service from '../services/Service';


export default function FormLogin() {
    const navigate = useNavigate();
    const [mensaje, setMensaje] = useState('');
    const [email, setCorreo] = useState('');
    const [password, setContrasenia] = useState('');
    
    // Para más adelante en caso de otros roles y MFA
    /*const openAuthPopup = () => {
        const popup = window.open(
          "/autenticacion", // Ruta del componente emergente
          "Autenticacion", // Nombre de la ventana
          "width=500,height=600,resizable=yes"
        );
        // Manejar mensajes enviados desde la ventana emergente
        window.addEventListener("message", async (event)  => {
          if (event.origin !== window.location.origin) return; // Asegurarse de que proviene del mismo dominio
          if (event.data.fileContent) {
            popup.close();
            const dataSupervisor = localStorage.getItem('userSupervisor');
            const userSupervisor = JSON.parse(dataSupervisor);
            const responsesup = await Service.FactorDeVerificacion(userSupervisor.userId, event.data.fileContent);
            if(responsesup.accesotres === true){
                navigate('/dashboardsupervisor');
            }
          }
        });
      };*/
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = {
                email,
                password,
            };

            const response = await Service.Login(data)
            console.log(response)
            // Guarda el id del usuario en localStorage antes de redirigir
            localStorage.setItem('userId', response.usuario._id)
            // Guardar el token en localstorage
            // No es seguro debería ser en una cookie (queda pendiente para más adelante)
            localStorage.setItem("token", response.access_token)
            navigate('/dashboardadmin');
            
        } catch (err) {
            console.log(err);
            setMensaje(err.detail);
        }
    };

    return (
        <div className="login-body" >
            <div className="login-container">
                <div className="logo-container">
                </div>
                <form onSubmit={handleSubmit}>
                    <h2>Iniciar Sesión</h2>
                    <label>Correo electronico:</label>
                    <input
                        type="text"
                        name="email"
                        value={email}
                        onChange={(e) => setCorreo(e.target.value)}
                        required
                    />
                    <label>Contraseña:</label>
                    <input
                        type="password"
                        name="password"
                        value={password}
                        onChange={(e) => setContrasenia(e.target.value)}
                        required
                    />
                    <button className="btn pulse-effect" >Ingresar</button>
                    
                </form>
                {mensaje && <p className="msg">{mensaje}</p>}
            </div>


        </div>

    )
}

