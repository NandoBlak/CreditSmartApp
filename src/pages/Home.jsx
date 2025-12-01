import { productos } from '../data/creditsdata.js';
import CreditCard from '../components/creditCard';

function Home() {
  return (
    <div className="home">
      <div className="hero">
        <h1>Bienvenido a CreditSmart</h1>
        <p>Las mejores opciones de crédito para ti</p>
      </div>
      <h2 className="section-title">Nuestros Productos de Crédito</h2>
      <div className="productos-lista">
        {productos.map((producto) => (
          <CreditCard key={producto.id} producto={producto} />
        ))}
      </div>
    </div>
  );
}

export default Home;
