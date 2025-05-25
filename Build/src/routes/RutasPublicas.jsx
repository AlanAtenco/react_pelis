import Contexto from "../context/Contexto";
import { useContext } from "react";
import { Navigate } from "react-router-dom";

const RutasPublicas = ({ children }) => {
    const {usuario} = useContext(Contexto);
    return(!usuario) ? children : <Navigate to="/inicio"></Navigate>;
}
export default RutasPublicas;