// Login.jsx

import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/style/login.css";
import { useForm } from "react-hook-form";
import Contexto from "../context/Contexto";

const Login = () => {
    const { login } = useContext(Contexto);
    const navegacion = useNavigate();

    const validaciones = {
        usuario: {
            required: "El campo usuario es requerido",
            pattern: {
                value: /^[a-zA-Z0-9]+$/,
                message: "El usuario solo puede contener letras y números",
            },
        },
        password: {
            required: "La contraseña es requerida",
            pattern: {
                value: /^[a-zA-Z0-9]+$/,
                message: "La contraseña solo puede contener letras y números",
            },
        },
    };

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = (data) => {
        fetch("http://localhost:3001/login", {
            headers: { "Content-Type": "application/json" },
            method: "POST",
            body: JSON.stringify({
                usuario: data.usuario,
                password: data.password,
            }),
        })
        .then((respuesta) => {
            if (!respuesta.ok) {
                return respuesta.json().then(errorData => {
                    throw new Error(errorData.msj || 'Error desconocido en el inicio de sesión');
                });
            }
            return respuesta.json();
        })
        .then((respuesta) => {
            // --- ¡AGREGA ESTO PARA DEPURAR! ---
            console.log("Respuesta completa del servidor:", respuesta);
            // --- FIN DEPURACIÓN ---

            if (respuesta.token && respuesta.usuario) {
                alert("Inicio de sesión válido");
                login({ token: respuesta.token, ...respuesta.usuario });
                navegacion("/inicio", { replace: true });
            } else {
                alert("Credenciales no válidas o datos incompletos recibidos.");
                console.error("Respuesta del servidor incompleta:", respuesta);
            }
        })
        .catch((error) => {
            console.error("Error en el inicio de sesión (catch):", error); // Cambia el mensaje para diferenciar
            alert(error.message);
        });
    };

    return (
        <div className="login-wrapper">
            <div className="login-box">
                <div className="login-header">
                    <i className="bi bi-person-circle login-icon"></i>
                    <h2>Iniciar Sesión</h2>
                    <p>Accede a tu cuenta de manera segura</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="login-form">
                    <div className="form-group mb-4">
                        <label htmlFor="usuario">Usuario</label>
                        {errors.usuario && (
                            <p className="text-danger">{errors.usuario.message}</p>
                        )}
                        <input
                            {...register("usuario", validaciones.usuario)}
                            type="text"
                            className="form-control"
                            id="usuario"
                            placeholder="Ingresa tu usuario"
                        />
                    </div>

                    <div className="form-group mb-4">
                        <label htmlFor="contrasena">Contraseña</label>
                        {errors.password && (
                            <p className="text-danger">{errors.password.message}</p>
                        )}
                        <input
                            {...register("password", validaciones.password)}
                            type="password"
                            className="form-control"
                            id="contrasena"
                            placeholder="Ingresa tu contraseña"
                        />
                    </div>

                    <button type="submit" className="btn btn-login w-100 mb-3">
                        Iniciar Sesión
                    </button>

                    <button
                        type="button"
                        className="btn btn-register w-100 mb-3"
                        onClick={() => alert("Funcionalidad de registro no implementada")}
                    >
                        Registrar
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;