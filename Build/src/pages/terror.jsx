import React, { useState, useEffect, useContext } from "react";
import Contexto from "../context/Contexto";

const Terror = () => {
    const [terror, setTerror] = useState([]);
    const [pelicula, setPelicula] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [fecha, setFecha] = useState("");
    const [imagenUrl, setImagenUrl] = useState("");
    const [editando, setEditando] = useState(null);

    // Obtén el objeto de usuario completo del contexto
    const { usuario: usuarioAutenticado } = useContext(Contexto);

    // Extrae el token y el rol del usuario autenticado
    const authToken = usuarioAutenticado?.token;
    const userRole = usuarioAutenticado?.rol;

    // Determina si el usuario es un administrador
    const isAdmin = userRole === 'admin';

    const URL = "http://localhost:3001/terror"; // Ruta para Terror

    useEffect(() => {
        obtenerTerror();
    }, []);

    const obtenerTerror = async () => {
        try {
            const res = await fetch(URL);
            const data = await res.json();
            if (res.ok) {
                setTerror(data);
            } else {
                console.error("Error al obtener películas de terror:", data);
            }
        } catch (error) {
            console.error("Error al obtener películas de terror:", error);
        }
    };

    const agregarTerror = async () => {
        if (!pelicula || !descripcion || !fecha || !imagenUrl) {
            alert("Todos los campos (incluyendo la URL de la imagen) son obligatorios");
            return;
        }

        if (!authToken) {
            alert("No estás autenticado. Por favor, inicia sesión.");
            return;
        }

        const fechaFormateada = formatearFechaGuardado(fecha);
        const nuevaTerror = { pelicula, descripcion, fecha: fechaFormateada, imagenUrl };

        try {
            const res = await fetch(`${URL}/insercion`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Back " + authToken
                },
                body: JSON.stringify(nuevaTerror),
            });

            if (res.ok) {
                obtenerTerror();
                limpiarFormulario();
            } else {
                const errorData = await res.json();
                console.error("Error al agregar película de terror:", errorData);
                alert(`Error al agregar: ${errorData.msj || 'Error desconocido'}`);
            }
        } catch (error) {
            console.error("Error al agregar película de terror:", error);
            alert("Error de conexión al agregar película de terror.");
        }
    };

    const eliminarTerror = async (_id) => {
        if (!window.confirm("¿Seguro que quieres eliminar esta película?")) return;

        if (!authToken) {
            alert("No estás autenticado. Por favor, inicia sesión.");
            return;
        }

        try {
            const res = await fetch(`${URL}/eliminar/${_id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": "Back " + authToken
                }
            });

            if (res.ok) {
                obtenerTerror();
            } else {
                const errorData = await res.json();
                console.error("Error al eliminar película de terror:", errorData);
                alert(`Error al eliminar: ${errorData.msj || 'Error desconocido'}`);
            }
        } catch (error) {
            console.error("Error al eliminar película de terror:", error);
            alert("Error de conexión al eliminar película de terror.");
        }
    };

    const cargarParaEditar = (item) => {
        setEditando(item._id);
        setPelicula(item.pelicula);
        setDescripcion(item.descripcion);
        setFecha(formatearFechaInput(item.fecha));
        setImagenUrl(item.imagenUrl || "");
    };

    const editarTerror = async () => {
        if (!pelicula || !descripcion || !fecha || !imagenUrl) {
            alert("Todos los campos (incluyendo la URL de la imagen) son obligatorios");
            return;
        }

        if (!authToken) {
            alert("No estás autenticado. Por favor, inicia sesión.");
            return;
        }

        const fechaFormateada = formatearFechaGuardado(fecha);
        const terrorActualizado = { pelicula, descripcion, fecha: fechaFormateada, imagenUrl };

        try {
            const res = await fetch(`${URL}/actualizar/${editando}`, {
                method: "PUT",
                headers: {
                    "Authorization": "Back " + authToken,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(terrorActualizado),
            });

            if (res.ok) {
                obtenerTerror();
                limpiarFormulario();
            } else {
                const errorData = await res.json();
                console.error("Error al actualizar película de terror:", errorData);
                alert(`Error al actualizar: ${errorData.msj || 'Error desconocido'}`);
            }
        } catch (error) {
            console.error("Error al actualizar película de terror:", error);
            alert("Error de conexión al actualizar película de terror.");
        }
    };

    const limpiarFormulario = () => {
        setPelicula("");
        setDescripcion("");
        setFecha("");
        setImagenUrl("");
        setEditando(null);
    };

    const formatearFechaInput = (fechaTexto) => {
        const [dia, mesTexto, anio] = fechaTexto.split("-");
        const meses = {
            enero: "01", febrero: "02", marzo: "03", abril: "04",
            mayo: "05", junio: "06", julio: "07", agosto: "08",
            septiembre: "09", octubre: "10", noviembre: "11", diciembre: "12"
        };
        const mesNumero = meses[mesTexto.toLowerCase()];
        if (!mesNumero) {
            console.warn("Mes no reconocido:", mesTexto);
            return fechaTexto;
        }
        return `${anio}-${mesNumero}-${dia.padStart(2, "0")}`;
    };

    const formatearFechaGuardado = (fechaISO) => {
        const [anio, mes, dia] = fechaISO.split("-");
        const meses = [
            "enero", "febrero", "marzo", "abril", "mayo", "junio",
            "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
        ];
        const mesIndex = parseInt(mes, 10) - 1;
        if (mesIndex < 0 || mesIndex >= meses.length) {
            console.warn("Índice de mes no válido:", mes);
            return fechaISO;
        }
        return `${dia}-${meses[mesIndex]}-${anio}`;
    };

    return (
        <div className="container">
            {/* Solo muestra el formulario de agregar/editar si el usuario es admin */}
            {isAdmin && (
                <>
                    <h2>{editando ? "Editar Película de Terror" : "Agregar Nueva Película de Terror"}</h2>
                    <input
                        type="text"
                        placeholder="Película"
                        value={pelicula}
                        onChange={(e) => setPelicula(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Descripción"
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                    />
                    <input
                        type="date"
                        value={fecha}
                        onChange={(e) => setFecha(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="URL de la Imagen"
                        value={imagenUrl}
                        onChange={(e) => setImagenUrl(e.target.value)}
                    />
                    <button onClick={editando ? editarTerror : agregarTerror}>
                        {editando ? "Guardar Cambios" : "Agregar"}
                    </button>
                    {editando && <button onClick={limpiarFormulario}>Cancelar</button>}
                </>
            )}

            <div className="contentPistas">
                <ul>
                    {terror.map((item) => (
                        <li key={item._id}>
                            <h3>{item.pelicula}</h3>
                            {item.imagenUrl && (
                                <img src={item.imagenUrl} alt={item.pelicula} style={{ maxWidth: '150px', maxHeight: '150px', objectFit: 'cover' }} />
                            )}
                            <p>{item.descripcion}</p>
                            <small>{item.fecha}</small>
                            {/* Solo muestra los botones de Editar y Eliminar si el usuario es admin */}
                            {isAdmin && (
                                <div>
                                    <button onClick={() => cargarParaEditar(item)}>Editar</button>
                                    <button onClick={() => eliminarTerror(item._id)}>Eliminar</button>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Terror;