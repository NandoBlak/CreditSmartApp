import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

function Simular() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Estados para los inputs - inicializados con valores por defecto
  const [monto, setMonto] = useState(50000000);
  const [plazo, setPlazo] = useState(36);
  const [mostrarResultados, setMostrarResultados] = useState(false);
  const [resultados, setResultados] = useState(null);
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const productsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // Encontrar el producto por ID o usar el primero
        const selectedProduct = productsList.find(p => p.id === id) || productsList[0];
        setProducto(selectedProduct);
        
        if (selectedProduct) {
          // Actualizar estados con valores del producto
          const montoMin = parseInt(selectedProduct.montoDesde.replace(/\D/g, ''));
          const montoMax = parseInt(selectedProduct.montoHasta.replace(/\D/g, ''));
          const plazoMaximo = parseInt(selectedProduct.plazoMax);
          
          setMonto(Math.round((montoMin + montoMax) / 2 / 10000) * 10000);
          setPlazo(Math.min(Math.round(plazoMaximo / 2), plazoMaximo));
        }
      } catch (error) {
        console.error('Error al cargar productos:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [id]);
  
  if (loading || !producto) {
    return <div className="loading">Cargando producto...</div>;
  }
  
  // Extraer valores numéricos
  const montoMin = parseInt(producto.montoDesde.replace(/\D/g, ''));
  const montoMax = parseInt(producto.montoHasta.replace(/\D/g, ''));
  const plazoMaximo = parseInt(producto.plazoMax);
  const tasaNum = parseFloat(producto.tasa.replace(/[^0-9.,]/g, '').replace(',', '.'));

  // Formato pesos colombianos
  const formatoPesos = (x) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(x);
  };

  // Calcular cuota
  const calcular = () => {
    const P = parseFloat(monto) || 0;
    const n = parseInt(plazo, 10) || 1;
    const tasaAnual = tasaNum / 100;

    if (P <= 0 || n <= 0 || tasaAnual < 0) {
      setMostrarResultados(false);
      return;
    }

    // Convertir tasa efectiva anual a tasa efectiva mensual
    const i = Math.pow(1 + tasaAnual, 1 / 12) - 1;
    
    // Fórmula cuota: P * i / (1 - (1+i)^-n)
    const cuota = i === 0 ? P / n : P * i / (1 - Math.pow(1 + i, -n));
    const totalPagado = cuota * n;
    const totalInteres = totalPagado - P;

    setResultados({
      montoSolicitado: P,
      plazoMeses: n,
      tasaAnual: tasaAnual * 100,
      tasaMensual: i * 100,
      cuotaMensual: Math.round(cuota),
      totalPagado: Math.round(totalPagado),
      totalInteres: Math.round(totalInteres)
    });

    setMostrarResultados(true);
  };

  // Resetear valores
  const resetear = () => {
    setMonto(Math.round((montoMin + montoMax) / 2 / 10000) * 10000);
    setPlazo(Math.min(Math.round(plazoMaximo / 2), plazoMaximo));
    setMostrarResultados(false);
  };

  // Volver atrás
  const volver = () => {
    navigate('/simulador');
  };

  return (
    <div className="simular">
      <div className="simular-container">
        <button onClick={volver} className="btn-volver">
          ← Volver al simulador
        </button>

        <div className="producto-header">
          <h1>{producto.nombre}</h1>
          <p className="producto-detalle">
            <strong>Tasa:</strong> {producto.tasa}
          </p>
          <p className="producto-detalle">
            <strong>Plazo máximo:</strong> {producto.plazoMax}
          </p>
          <p className="producto-detalle">
            <strong>Rango de monto:</strong> {producto.montoDesde} — {producto.montoHasta}
          </p>
        </div>

        <div className="simulacion-form">
          <h2>Configura tu simulación</h2>
          
          <div className="form-group">
            <label htmlFor="monto">
              Monto solicitado: <strong>{formatoPesos(monto)}</strong>
            </label>
            <input
              type="range"
              id="monto"
              min={montoMin}
              max={montoMax}
              step="100000"
              value={monto}
              onChange={(e) => {
                setMonto(e.target.value);
                setMostrarResultados(false);
              }}
            />
            <div className="range-labels">
              <span>{formatoPesos(montoMin)}</span>
              <span>{formatoPesos(montoMax)}</span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="plazo">
              Plazo: <strong>{plazo} meses</strong>
            </label>
            <input
              type="range"
              id="plazo"
              min="1"
              max={plazoMaximo}
              value={plazo}
              onChange={(e) => {
                setPlazo(e.target.value);
                setMostrarResultados(false);
              }}
            />
            <div className="range-labels">
              <span>1 mes</span>
              <span>{plazoMaximo} meses</span>
            </div>
          </div>

          <div className="tasa-info">
            <p>
              <strong>Tasa anual efectiva:</strong> {tasaNum.toFixed(2)}% E.A.
            </p>
          </div>

          <div className="form-actions">
            <button onClick={calcular} className="btn-calcular">
              Calcular
            </button>
            <button onClick={resetear} className="btn-reset">
              Reiniciar
            </button>
          </div>
        </div>

        {mostrarResultados && resultados && (
          <div className="resultados-simulacion">
            <h3>Resultados estimados</h3>
            <div className="resultado-item">
              <span>Monto solicitado:</span>
              <strong>{formatoPesos(resultados.montoSolicitado)}</strong>
            </div>
            <div className="resultado-item">
              <span>Plazo:</span>
              <strong>{resultados.plazoMeses} meses</strong>
            </div>
            <div className="resultado-item">
              <span>Tasa anual efectiva:</span>
              <strong>{resultados.tasaAnual.toFixed(2)}% E.A.</strong>
            </div>
            <div className="resultado-item">
              <span>Tasa mensual equivalente:</span>
              <strong>{resultados.tasaMensual.toFixed(3)}% M.E.</strong>
            </div>
            <div className="resultado-item destacado">
              <span>Cuota mensual aproximada:</span>
              <strong className="cuota-grande">{formatoPesos(resultados.cuotaMensual)}</strong>
            </div>
            <div className="resultado-item">
              <span>Total a pagar:</span>
              <strong>{formatoPesos(resultados.totalPagado)}</strong>
            </div>
            <div className="resultado-item">
              <span>Intereses aproximados:</span>
              <strong>{formatoPesos(resultados.totalInteres)}</strong>
            </div>
            <Link 
              to={`/solicitar/${producto.id}`}
              state={{ monto: resultados.montoSolicitado, plazo: resultados.plazoMeses }}
              className="btn-solicitar-credito"
            >
              Solicitar este crédito
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Simular;
