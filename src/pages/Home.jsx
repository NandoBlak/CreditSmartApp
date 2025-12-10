import { useState, useEffect } from 'react';
import { productos } from '../data/creditsdata.js';
import CreditCard from '../components/creditCard';

function Home() {
  const [creditos, setCreditos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular consulta asíncrona de datos
    const cargarCreditos = async () => {
      try {
        setLoading(true);
        // Simular delay de red
        await new Promise(resolve => setTimeout(resolve, 300));
        setCreditos(productos);
      } catch (error) {
        console.error('Error al cargar créditos:', error);
        setCreditos([]);
      } finally {
        setLoading(false);
      }
    };

    cargarCreditos();
  }, []);

  return (
    <div className="home">
      <div className="hero">
        <h1>Bienvenido a CreditSmart</h1>
        <p>Las mejores opciones de crédito para ti</p>
      </div>
      <h2 className="section-title">Nuestros Productos de Crédito</h2>
      {loading ? (
        <div className="loading">Cargando productos...</div>
      ) : (
        <div className="productos-lista">
          {creditos.map((producto) => (
            <CreditCard key={producto.id} producto={producto} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
