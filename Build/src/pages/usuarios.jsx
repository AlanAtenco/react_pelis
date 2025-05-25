import React, { useState, useEffect, useContext } from "react";
import Contexto from "../context/Contexto";

const Usuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [usuario, setUsuario] = useState("");
    const [password, setPassword] = useState("");
    const [rol, setRol] = useState("");
    const [estado, setEstado] = useState("");
    const [editando, setEditando] = useState(null);
    
    // Renombrado para evitar conflicto de nombres con el estado 'usuario'
    const { usuario: adminUsuarioData } = useContext(Contexto); 
    // Obtener el token del objeto de usuario del contexto
    const authToken = adminUsuarioData?.token; // Usa optional chaining para seguridad

    const URL = "http://localhost:3001/usuarios";

    useEffect(() => {
        obtenerUsuarios();
    }, []);

    const obtenerUsuarios = async () => {
        try {
            const res = await fetch(URL, {
                headers: {
                    "Authorization": "Back " + authToken
                }
            });
            const data = await res.json();
            if (res.ok) {
                setUsuarios(data);
            } else {
                console.error("Error al obtener usuarios:", data);
                alert(`Error al obtener usuarios: ${data.msj || 'Error desconocido'}`);
            }
        } catch (error) {
            console.error("Error al obtener usuarios:", error);
            alert("Error de conexión al obtener usuarios.");
        }
    };

    const eliminarUsuario = async (_id) => {
        if (!window.confirm("¿Seguro que quieres eliminar este usuario?")) return;

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
                obtenerUsuarios();
            } else {
                const errorData = await res.json();
                console.error("Error al eliminar usuario:", errorData);
                alert(`Error al eliminar: ${errorData.msj || 'Error desconocido'}`);
            }
        } catch (error) {
            console.error("Error al eliminar usuario:", error);
            alert("Error de conexión al eliminar usuario.");
        }
    };

    const cargarParaEditar = (item) => {
        setEditando(item._id);
        setUsuario(item.usuario);
        setPassword(""); // Deja el campo de contraseña vacío por seguridad
        setRol(item.rol);
        setEstado(item.estado);
    };

    const editarUsuario = async () => {
        if (!usuario || !rol || !estado) {
            alert("Los campos de usuario, rol y estado son obligatorios");
            return;
        }

        if (!authToken) {
            alert("No estás autenticado. Por favor, inicia sesión.");
            return;
        }

        const usuarioActualizado = { usuario, rol, estado };
        if (password) { 
            usuarioActualizado.password = password;
        }

        try {
            const res = await fetch(`${URL}/actualizar/${editando}`, {
                method: "PUT",
                headers: {
                    "Authorization": "Back " + authToken,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(usuarioActualizado),
            });

            const data = await res.json();
            if (res.ok) {
                obtenerUsuarios();
                limpiarFormulario();
            } else {
                console.error("Error al actualizar usuario:", data);
                alert(`Error al actualizar: ${data.msj || 'Error desconocido'}`);
            }
        } catch (error) {
            console.error("Error al actualizar usuario:", error);
            alert("Error de conexión al actualizar usuario.");
        }
    };

    const limpiarFormulario = () => {
        setUsuario("");
        setPassword("");
        setRol("");
        setEstado("");
        setEditando(null);
    };

    return (
        <div className="container">
            <h2>{editando ? "Editar Usuario" : "Agregar Nuevo Usuario"}</h2>
            <input
                type="text"
                placeholder="Usuario"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
            />
            <input
                type="password"
                placeholder="Contraseña (dejar en blanco para no cambiar)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            {/* Los selectores de Rol y Estado ya están correctos y envían los valores directamente */}
            <select value={rol} onChange={(e) => setRol(e.target.value)}>
                <option value="">Selecciona un Rol</option>
                <option value="admin">Admin</option>
                <option value="usuario">Usuario</option>
            </select>
            <select value={estado} onChange={(e) => setEstado(e.target.value)}>
                <option value="">Selecciona un Estado</option>
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
            </select>

          <button onClick={editarUsuario}>
    Guardar Cambios
</button>
{editando && <button onClick={limpiarFormulario}>Cancelar</button>}

            <div className="contentPistas">
                <ul>
                    {usuarios.map((item) => (
                        <li key={item._id}>
                            <h3>{item.usuario}</h3>
                            <p>Rol: {item.rol}</p>
                            <p>Estado: {item.estado}</p>
                            <div>
                                <button onClick={() => cargarParaEditar(item)}>Editar</button>
                                <button onClick={() => eliminarUsuario(item._id)}>Eliminar</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Usuarios;