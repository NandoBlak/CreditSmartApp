import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

function Simulador() {
  const [creditos, setCreditos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [rangoMonto, setRangoMonto] = useState('todos');
  const [filtroTasa, setFiltroTasa] = useState('todos');
  const [plazo, setPlazo] = useState('');

  useEffect(() => {
    const fetchCredits = async () => {
      try {
        setLoading(true);
        const querySnapshot = await getDocs(collection(db, "products"));
        const creditsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCreditos(creditsList);
      } catch (error) {
        console.error('Error al obtener créditos:', error);
        setCreditos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCredits();
  }, []);

  // Filtrar productos
  const productosFiltrados = creditos
    .filter(producto => {
      // Búsqueda por nombre en tiempo real
      if (busqueda && !producto.nombre.toLowerCase().includes(busqueda.toLowerCase())) {
        return false;
      }
      
      // Filtro por rango de monto
      if (rangoMonto !== 'todos') {
        const montoDesdeNum = parseInt(producto.montoDesde.replace(/\D/g, ''));
        const montoHastaNum = parseInt(producto.montoHasta.replace(/\D/g, ''));
        
        if (rangoMonto === 'bajo' && montoHastaNum > 50000000) {
          return false;
        }
        if (rangoMonto === 'medio' && (montoDesdeNum > 200000000 || montoHastaNum < 50000000)) {
          return false;
        }
        if (rangoMonto === 'alto' && montoDesdeNum < 200000000) {
          return false;
        }
      }
      
      // Filtro por tasa de interés
      if (filtroTasa !== 'todos') {
        const tasa = parseFloat(producto.tasa);
        
        if (filtroTasa === 'baja' && tasa > 8) {
          return false;
        }
        if (filtroTasa === 'media' && (tasa <= 8 || tasa > 12)) {
          return false;
        }
        if (filtroTasa === 'alta' && tasa <= 12) {
          return false;
        }
      }
      
      return true;
    })
    .sort((a, b) => {
      // Ordenar por tasa (menor a mayor)
      const tasaA = parseFloat(a.tasa);
      const tasaB = parseFloat(b.tasa);
      return tasaA - tasaB;
    });

  return (
    <div className="simulador">
      <h1>Simulador de Créditos</h1>
      
      <div className="filtros">
        <div className="input-group">
          <label>Buscar por nombre:</label>
          <input 
            type="text" 
            placeholder="Ej: Vivienda, Vehículo..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Rango de monto:</label>
          <select value={rangoMonto} onChange={(e) => setRangoMonto(e.target.value)}>
            <option value="todos">Todos los rangos</option>
            <option value="bajo">Hasta $50.000.000</option>
            <option value="medio">$50.000.000 - $200.000.000</option>
            <option value="alto">Más de $200.000.000</option>
          </select>
        </div>

        <div className="input-group">
          <label>Tasa de interés:</label>
          <select value={filtroTasa} onChange={(e) => setFiltroTasa(e.target.value)}>
            <option value="todos">Todas las tasas</option>
            <option value="baja">Baja (hasta 8%)</option>
            <option value="media">Media (8% - 12%)</option>
            <option value="alta">Alta (más de 12%)</option>
          </select>
        </div>

        <div className="input-group">
          <label>Plazo deseado (meses):</label>
          <input 
            type="number" 
            placeholder="Ej: 36"
            value={plazo}
            onChange={(e) => setPlazo(e.target.value)}
          />
        </div>
      </div>

      <div className="resultados">
        <h2>Productos disponibles ({productosFiltrados.length})</h2>
        {loading ? (
          <div className="loading">Cargando productos...</div>
        ) : productosFiltrados.length === 0 ? (
          <div className="sin-resultados">
            <p>No hay créditos disponibles</p>
            <p className="sin-resultados-subtitulo">
              Intenta ajustar tus filtros de búsqueda
            </p>
          </div>
        ) : (
          <div className="productos-grid">
            {productosFiltrados.map((producto) => (
              <div key={producto.id} className="producto-card">
                <h3>{producto.nombre}</h3>
                <p><strong>Tasa:</strong> {producto.tasa}</p>
                <p><strong>Monto:</strong> {producto.montoDesde} - {producto.montoHasta}</p>
                <p><strong>Plazo máximo:</strong> {producto.plazoMax}</p>
                <Link to={`/simular/${producto.id}`}>
                  <button>Simular</button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Simulador;
