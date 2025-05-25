// provider.jsx
import { useReducer } from 'react';
import Contexto from './Contexto.jsx';
import types from './Types.js';
import MiReducer from './MiReducer.jsx';

const inicio = () => {
    const sesion = localStorage.getItem("usuario"); 
    let usuarioParseado = null;
    if (sesion) {
        try {
            usuarioParseado = JSON.parse(sesion); // <--- ¡IMPORTANTE! Parsear el string JSON
        } catch (e) {
            console.error("Error al parsear el usuario de localStorage:", e);
            // Si hay un error al parsear, es mejor limpiar el localStorage o manejarlo.
            localStorage.removeItem("usuario"); 
        }
    }

    return {
        logeado: !!usuarioParseado, // Será true si usuarioParseado no es null
        usuario: usuarioParseado // Ahora usuario será un objeto (o null)
    }
}

const Provider = ({children}) => {
    // Al usar useReducer, si el tercer argumento es una función,
    // se usará para inicializar el estado. No necesitas pasar un objeto vacío como segundo argumento.
    const [estado,dispatch] = useReducer(MiReducer, inicio); // El estado del reducer ahora se llamará 'estado'

    const login = (datos) =>{
        const action = {
            type:types.login,
            usuario: datos // 'datos' ya debería ser el objeto de usuario con el rol
        }
        localStorage.setItem("usuario",JSON.stringify(datos));
        dispatch(action);
    }
    
    const cerrar_sesion = () => {
        const action = {
            type:types.logout,
            usuario: null
        }
        localStorage.removeItem("usuario");
        dispatch(action);
    }
    
    // Aquí es donde expones el 'estado' del reducer, que incluye logeado y usuario.
    // También expones las funciones login y cerrar_sesion.
    return (
        <Contexto.Provider value={{...estado, login, cerrar_sesion}}>
            {children}
        </Contexto.Provider>
    )
}

export default Provider;