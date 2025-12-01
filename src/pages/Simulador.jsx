import { useState } from 'react';
import { productos } from '../data/creditsData.js';

function Simulador() {
  const [monto, setMonto] = useState('');
  const [plazo, setPlazo] = useState('');
  const [tipoCredito, setTipoCredito] = useState('todos');
  const [ordenar, setOrdenar] = useState('nombre');

  // Filtrar productos
  const productosFiltrados = productos
    .filter(producto => {
      // Filtrar por tipo de crédito
      if (tipoCredito !== 'todos' && producto.tipo !== tipoCredito) {
        return false;
      }
      // Filtrar por monto (si se ingresó)
      if (monto) {
        const montoNum = parseInt(monto.replace(/\D/g, ''));
        const montoDesdeNum = parseInt(producto.montoDesde.replace(/\D/g, ''));
        const montoHastaNum = parseInt(producto.montoHasta.replace(/\D/g, ''));
        if (montoNum < montoDesdeNum || montoNum > montoHastaNum) {
          return false;
        }
      }
      return true;
    })
    .sort((a, b) => {
      // Ordenar productos
      if (ordenar === 'nombre') {
        return a.nombre.localeCompare(b.nombre);
      }
      if (ordenar === 'tasa') {
        const tasaA = parseFloat(a.tasa);
        const tasaB = parseFloat(b.tasa);
        return tasaA - tasaB;
      }
      if (ordenar === 'plazo') {
        const plazoA = parseInt(a.plazoMax);
        const plazoB = parseInt(b.plazoMax);
        return plazoB - plazoA;
      }
      return 0;
    });

  // Calcular cuota aproximada
  const calcularCuota = (producto) => {
    if (!monto || !plazo) return null;
    const capital = parseInt(monto.replace(/\D/g, ''));
    const tasaMensual = parseFloat(producto.tasa) / 100 / 12;
    const numeroPagos = parseInt(plazo);
    
    const cuota = capital * (tasaMensual * Math.pow(1 + tasaMensual, numeroPagos)) / 
                  (Math.pow(1 + tasaMensual, numeroPagos) - 1);
    
    return cuota.toLocaleString('es-CO', { style: 'currency', currency: 'COP' });
  };

  return (
    <div className="simulador">
      <h1>Simulador de Créditos</h1>
      
      <div className="filtros">
        <div className="input-group">
          <label>Monto deseado:</label>
          <input 
            type="text" 
            placeholder="Ej: $10.000.000"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Plazo (meses):</label>
          <input 
            type="number" 
            placeholder="Ej: 36"
            value={plazo}
            onChange={(e) => setPlazo(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Tipo de crédito:</label>
          <select value={tipoCredito} onChange={(e) => setTipoCredito(e.target.value)}>
            <option value="todos">Todos</option>
            <option value="libre">Libre Inversión</option>
            <option value="vehiculo">Vehículo</option>
            <option value="vivienda">Vivienda</option>
            <option value="educativo">Educativo</option>
            <option value="empresarial">Empresarial</option>
          </select>
        </div>

        <div className="input-group">
          <label>Ordenar por:</label>
          <select value={ordenar} onChange={(e) => setOrdenar(e.target.value)}>
            <option value="nombre">Nombre</option>
            <option value="tasa">Tasa (menor a mayor)</option>
            <option value="plazo">Plazo (mayor a menor)</option>
          </select>
        </div>
      </div>

      <div className="resultados">
        <h2>Productos disponibles ({productosFiltrados.length})</h2>
        <div className="productos-grid">
          {productosFiltrados.map((producto) => (
            <div key={producto.id} className="producto-card">
              <h3>{producto.nombre}</h3>
              <p><strong>Tasa:</strong> {producto.tasa}</p>
              <p><strong>Monto:</strong> {producto.montoDesde} - {producto.montoHasta}</p>
              <p><strong>Plazo máximo:</strong> {producto.plazoMax}</p>
              {monto && plazo && (
                <div className="cuota-estimada">
                  <p><strong>Cuota estimada:</strong></p>
                  <p className="cuota-valor">{calcularCuota(producto)}</p>
                </div>
              )}
              <button>Solicitar</button>
            </div>
          ))}
        </div>
        
        {productosFiltrados.length === 0 && (
          <p className="sin-resultados">
            No hay productos que coincidan con tus criterios de búsqueda.
          </p>
        )}
      </div>
    </div>
  );
}

export default Simulador;
