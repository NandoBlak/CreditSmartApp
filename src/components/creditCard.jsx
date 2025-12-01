import { Link } from 'react-router-dom';

function CreditCard({ producto }) {
  return (
    <div className="producto-card">
      <h3>{producto.nombre}</h3>
      <p><strong>Tasa:</strong> {producto.tasa}</p>
      <p><strong>Monto:</strong> {producto.montoDesde} - {producto.montoHasta}</p>
      <p><strong>Plazo máximo:</strong> {producto.plazoMax}</p>
      <Link to={`/solicitar/${producto.id}`}>
        <button>Solicitar</button>
      </Link>
    </div>
  );
}

export default CreditCard;
