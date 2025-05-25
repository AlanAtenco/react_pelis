import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './login.jsx';
import Navbar from '../components/nanvar.jsx'; 
import Error from './error.jsx';
import Registro from './registro.jsx';
import Inicio from './inicio.jsx';
import Estreno from './estreno.jsx';
import Caricatura from './caricatura.jsx';
import Terror from './terror.jsx';
import Imagenes from './imagenes.jsx';
import RutasPrivadas from '../routes/RutasPrivadas.jsx';
import RutasPublicas from '../routes/RutasPublicas.jsx';
import Usuarios from '../pages/usuarios.jsx';



const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Rutas públicas (accesibles solo si NO estás logeado) */}
        <Route path="/login" element={
          <RutasPublicas>
            <Login />
          </RutasPublicas>
        } />
        <Route path="/registro" element={
          <RutasPublicas>
            <Registro />
          </RutasPublicas>
        } />

        {/* Rutas privadas (accesibles solo si estás logeado) */}
        <Route path="/inicio" element={
          <RutasPrivadas>
            <Inicio />
          </RutasPrivadas>
        } />
        <Route path="/estreno" element={
          <RutasPrivadas>
            <Estreno />
          </RutasPrivadas>
        } />
        <Route path="/caricatura" element={
          <RutasPrivadas>
            <Caricatura />
          </RutasPrivadas>
        } />
        <Route path="/terror" element={
          <RutasPrivadas>
            <Terror />
          </RutasPrivadas>
        } />
        <Route path="/archivos" element={
          <RutasPrivadas>
            <Imagenes />
          </RutasPrivadas>
        } />
        <Route path="/usuarios" element={
          <RutasPrivadas>
            <Usuarios />
          </RutasPrivadas>
        } />

        {/* Ruta de error para páginas no encontradas */}
        <Route path="*" element={<Error />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
