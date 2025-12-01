import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productos } from '../data/creditsdata.js';

function Solicitar() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const productoSeleccionado = id ? productos.find(p => p.id === id) : null;
  
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    monto: '',
    plazo: '',
    tipoCredito: productoSeleccionado?.id || ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Solicitud enviada:', formData);
    alert('¡Solicitud enviada con éxito! Nos pondremos en contacto pronto.');
    navigate('/');
  };

  return (
    <div className="solicitar">
      <div className="solicitar-container">
        <h1>Solicitar Crédito</h1>
        
        {productoSeleccionado && (
          <div className="producto-seleccionado">
            <h2>Producto: {productoSeleccionado.nombre}</h2>
            <p>Tasa: {productoSeleccionado.tasa}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="solicitar-form">
          <div className="form-group">
            <label>Nombre completo *</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              placeholder="Juan Pérez"
            />
          </div>

          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="juan@example.com"
            />
          </div>

          <div className="form-group">
            <label>Teléfono *</label>
            <input
              type="tel"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              required
              placeholder="3001234567"
            />
          </div>

          <div className="form-group">
            <label>Tipo de crédito *</label>
            <select
              name="tipoCredito"
              value={formData.tipoCredito}
              onChange={handleChange}
              required
              disabled={!!productoSeleccionado}
            >
              <option value="">Seleccione un producto</option>
              {productos.map(producto => (
                <option key={producto.id} value={producto.id}>
                  {producto.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Monto solicitado *</label>
            <input
              type="text"
              name="monto"
              value={formData.monto}
              onChange={handleChange}
              required
              placeholder="$10.000.000"
            />
          </div>

          <div className="form-group">
            <label>Plazo (meses) *</label>
            <input
              type="number"
              name="plazo"
              value={formData.plazo}
              onChange={handleChange}
              required
              placeholder="36"
              min="1"
              max="240"
            />
          </div>

          <button type="submit" className="btn-submit">
            Enviar Solicitud
          </button>
        </form>
      </div>
    </div>
  );
}

export default Solicitar;
