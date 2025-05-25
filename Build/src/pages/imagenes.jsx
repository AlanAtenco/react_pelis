import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { FaTrash, FaCopy } from "react-icons/fa";
import Contexto from "../context/Contexto";

const Imagenes = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadedImages, setUploadedImages] = useState([]);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const { usuario: usuarioAutenticado } = useContext(Contexto);
    const authToken = usuarioAutenticado?.token;
    const userRole = usuarioAutenticado?.rol;
    const isAdmin = userRole === 'admin';
    const isUser = userRole === 'user';

    const API_BASE_URL = "http://localhost:3001";

    const fetchImages = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/imagenes`);
            const data = await res.json();
            setUploadedImages(data.archivos || []);
        } catch (err) {
            console.error("Error al cargar las imágenes:", err);
            setError("Error al cargar las imágenes existentes.");
        }
    };

    useEffect(() => {
        fetchImages();
    }, []);

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
        setMessage("");
        setError("");
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setError("Por favor, selecciona un archivo antes de subir.");
            return;
        }

        if (!isAdmin) {
            alert("No tienes permisos para subir imágenes.");
            return;
        }

        const formData = new FormData();
        formData.append("image", selectedFile);

        try {
            const res = await axios.post(`${API_BASE_URL}/imagen`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": "Back " + authToken
                },
            });

            setMessage(res.data.mensaje || "Imagen subida correctamente.");
            setError("");
            setUploadedImages((prev) => [...prev, res.data.imagen]);
            setSelectedFile(null);
        } catch (err) {
            console.error("Error al subir la imagen:", err);
            setError(err.response?.data?.msj || "Error al subir la imagen.");
            setMessage("");
        }
    };

    const handleEliminar = async (id) => {
        if (!window.confirm("¿Seguro que quieres eliminar esta imagen?")) return;

        if (!isAdmin) {
            alert("No tienes permisos para eliminar imágenes.");
            return;
        }

        try {
            await axios.delete(`${API_BASE_URL}/imagen/eliminar/${id}`, {
                headers: {
                    "Authorization": "Back " + authToken
                }
            });
            setUploadedImages((prev) => prev.filter((img) => img._id !== id));
            setMessage("Imagen eliminada correctamente.");
            setTimeout(() => setMessage(""), 2000);
        } catch (err) {
            console.error("Error al eliminar la imagen:", err);
            setError("No se pudo eliminar la imagen.");
            setTimeout(() => setError(""), 2000);
        }
    };

    const handleCopiar = (ruta) => {
        if (!isAdmin && !isUser) {
            alert("Necesitas iniciar sesión para copiar URLs de imágenes.");
            return;
        }

        const url = `${API_BASE_URL}${ruta}`;
        navigator.clipboard
            .writeText(url)
            .then(() => {
                setMessage("URL copiada al portapapeles.");
                setTimeout(() => setMessage(""), 2000);
            })
            .catch(() => {
                setError("No se pudo copiar la URL.");
                setTimeout(() => setError(""), 2000);
            });
    };

    return (
        <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto", color: "#fff", backgroundColor: "#141414", minHeight: "100vh" }}>
            <h1 style={{ marginBottom: "20px", fontSize: "2rem" }}>Galería de Imágenes</h1>

            {isAdmin && (
                <div style={{
                    marginBottom: "20px",
                    backgroundColor: "#222",
                    padding: "15px",
                    borderRadius: "8px",
                }}>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        style={{ marginRight: "10px" }}
                    />
                    <button
                        onClick={handleUpload}
                        disabled={!selectedFile}
                        style={{
                            backgroundColor: "#e50914",
                            color: "white",
                            padding: "10px 20px",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            opacity: selectedFile ? 1 : 0.6,
                        }}
                    >
                        Subir Imagen
                    </button>
                </div>
            )}

            {message && <p style={{ color: "lightgreen" }}>{message}</p>}
            {error && <p style={{ color: "salmon" }}>{error}</p>}

            {selectedFile && (
                <div
                    style={{
                        marginBottom: "10px",
                        padding: "10px",
                        border: "1px dashed #e50914",
                        color: "#ccc",
                    }}
                >
                    <strong>Archivo seleccionado:</strong> {selectedFile.name}
                </div>
            )}

            <h2 style={{ marginTop: "30px" }}>Imágenes Subidas</h2>

            {uploadedImages.length === 0 ? (
                <p>No hay imágenes subidas aún.</p>
            ) : (
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                        gap: "16px",
                        paddingTop: "20px"
                    }}
                >
                    {uploadedImages.map((image) => (
                        <div
                            key={image._id}
                            style={{
                                backgroundColor: "#1c1c1c",
                                padding: "10px",
                                borderRadius: "8px",
                                textAlign: "center",
                                boxShadow: "0 2px 6px rgba(0,0,0,0.5)"
                            }}
                        >
                            <img
                                src={`${API_BASE_URL}${image.ruta}`}
                                alt={image.nombre}
                                style={{
                                    width: "100%",
                                    height: "200px",
                                    objectFit: "cover",
                                    borderRadius: "8px",
                                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.4)",
                                    transition: "transform 0.3s ease-in-out",
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                                onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "https://via.placeholder.com/200x300?text=No+Disponible";
                                }}
                            />
                            <p style={{ marginTop: "10px", fontSize: "0.9rem", color: "#ccc", wordBreak: "break-word" }}>
                                {image.nombre.length > 25 ? image.nombre.slice(0, 22) + "..." : image.nombre}
                            </p>

                            {userRole && (
                                <div
                                    style={{
                                        marginTop: "8px",
                                        display: "flex",
                                        justifyContent: "center",
                                        gap: "15px",
                                        fontSize: "1.2rem",
                                    }}
                                >
                                    {isAdmin && (
                                        <FaTrash
                                            style={{ cursor: "pointer", color: "#e50914" }}
                                            title="Eliminar imagen"
                                            onClick={() => handleEliminar(image._id)}
                                        />
                                    )}
                                    {(isAdmin || isUser) && (
                                        <FaCopy
                                            style={{ cursor: "pointer", color: "#46d369" }}
                                            title="Copiar URL"
                                            onClick={() => handleCopiar(image.ruta)}
                                        />
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Imagenes;
