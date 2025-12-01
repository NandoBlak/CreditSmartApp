import { productos } from '../data/creditsData.js';

function Home() {
  return (
    <div className="home">
      <h1>Nuestros Productos de Crédito</h1>
      <div className="productos-lista">
        {productos.map((producto) => (
          <div key={producto.id} className="producto-card">
            <h2>{producto.nombre}</h2>
            <p><strong>Tasa:</strong> {producto.tasa}</p>
            <p><strong>Monto:</strong> {producto.montoDesde} - {producto.montoHasta}</p>
            <p><strong>Plazo máximo:</strong> {producto.plazoMax}</p>
            <button>Solicitar</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
