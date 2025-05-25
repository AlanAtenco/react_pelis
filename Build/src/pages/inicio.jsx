import React from "react";
import '../assets/style/inicio.css';

import tiburonImg from '../assets/img/tiburon.jpg';  
import gokuImg from '../assets/img/goku.jpg';
import anabelImg from '../assets/img/anabel.jpg';
import matrixImg from '../assets/img/matrix.jpg';
import iromanImg from '../assets/img/iroman3.jpg';
import avengerImg from '../assets/img/avenger.jpg';
import venomImg from '../assets/img/venom.jpg';
import maleficaImg from '../assets/img/malefica.jpg';
import leyendaImg from '../assets/img/leyenda.jpg';
import spidermanImg from '../assets/img/spiderman.jpg';
import blackImg from '../assets/img/blackpanter.jpg';
import civilkImg from '../assets/img/civilwarg.jpg';
import deadImg from '../assets/img/deadpool.jpg';
import leonImg from '../assets/img/leon.jpg';
import hieloImg from '../assets/img/hielo.jpg';

const Inicio = () => {
  const peliculas = [
    { titulo: "The Dark Knight", imagen: tiburonImg },
    { titulo: "Dragon Ball", imagen: gokuImg },
    { titulo: "Anabel", imagen: anabelImg },
    { titulo: "The Matrix", imagen: matrixImg },
    { titulo: "Iroman3", imagen: iromanImg },
    { titulo: "Avengers", imagen: avengerImg },
    { titulo: "Venom", imagen: venomImg },
    { titulo: "Malefica", imagen: maleficaImg },
    { titulo: "Soy Leyenda", imagen: leyendaImg },
    { titulo: "Spider Man", imagen: spidermanImg },
    { titulo: "Black Panther", imagen: blackImg },
    { titulo: "Civil War", imagen: civilkImg },
    { titulo: "Deadpool", imagen: deadImg },
    { titulo: "Rey León", imagen: leonImg },
    { titulo: "Era de Hielo", imagen: hieloImg }
  ];

  return (
    <div className="inicio-page">
      <div className="app-container">
        <main className="movie-list">
          <h2>Películas Populares</h2>
          <div className="movies">
            {peliculas.map((pelicula, index) => (
              <div key={index} className="movie-card">
                <img src={pelicula.imagen} alt={pelicula.titulo} />
                <h3>{pelicula.titulo}</h3>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Inicio;
