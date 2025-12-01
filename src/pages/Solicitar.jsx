import { useState, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { productos } from '../data/creditsdata.js';

// Array global para almacenar solicitudes (solo en memoria)
const solicitudesEnMemoria = [];

function Solicitar() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const productoSeleccionado = id ? productos.find(p => p.id === id) : null;
  
  // Estados del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    cedula: '',
    monto: location.state?.monto || '',
    plazo: location.state?.plazo || '',
    tipoCredito: productoSeleccionado?.id || ''
  });

  // Estados para validaciones
  const [errores, setErrores] = useState({});
  const [mostrarResumen, setMostrarResumen] = useState(false);
  const [mensajeExito, setMensajeExito] = useState(false);

  // Calcular cuota mensual como valor derivado
  const cuotaMensual = useMemo(() => {
    if (formData.monto && formData.plazo && formData.tipoCredito) {
      const producto = productos.find(p => p.id === formData.tipoCredito);
      if (producto) {
        const capital = parseInt(formData.monto.toString().replace(/\D/g, ''));
        const tasaAnual = parseFloat(producto.tasa) / 100;
        const tasaMensual = Math.pow(1 + tasaAnual, 1 / 12) - 1;
        const numeroPagos = parseInt(formData.plazo);
        
        if (capital > 0 && numeroPagos > 0) {
          const cuota = capital * (tasaMensual * Math.pow(1 + tasaMensual, numeroPagos)) / 
                        (Math.pow(1 + tasaMensual, numeroPagos) - 1);
          return Math.round(cuota);
        }
      }
    }
    return null;
  }, [formData.monto, formData.plazo, formData.tipoCredito]);

  // Validaciones en tiempo real
  const validarCampo = (nombre, valor) => {
    const nuevosErrores = { ...errores };

    switch (nombre) {
      case 'nombre': {
        if (valor.length < 3) {
          nuevosErrores.nombre = 'El nombre debe tener al menos 3 caracteres';
        } else {
          delete nuevosErrores.nombre;
        }
        break;
      }
      
      case 'email': {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(valor)) {
          nuevosErrores.email = 'Email inválido';
        } else {
          delete nuevosErrores.email;
        }
        break;
      }
      
      case 'telefono': {
        const telefonoRegex = /^[0-9]{10}$/;
        if (!telefonoRegex.test(valor)) {
          nuevosErrores.telefono = 'El teléfono debe tener 10 dígitos';
        } else {
          delete nuevosErrores.telefono;
        }
        break;
      }
      
      case 'cedula': {
        if (valor.length < 6 || valor.length > 10) {
          nuevosErrores.cedula = 'La cédula debe tener entre 6 y 10 dígitos';
        } else {
          delete nuevosErrores.cedula;
        }
        break;
      }
      
      case 'monto': {
        const montoNum = parseInt(valor.replace(/\D/g, ''));
        if (isNaN(montoNum) || montoNum < 500000) {
          nuevosErrores.monto = 'El monto mínimo es $500.000';
        } else {
          delete nuevosErrores.monto;
        }
        break;
      }
      
      case 'plazo': {
        if (valor < 1 || valor > 240) {
          nuevosErrores.plazo = 'El plazo debe estar entre 1 y 240 meses';
        } else {
          delete nuevosErrores.plazo;
        }
        break;
      }
      
      default:
        break;
    }

    setErrores(nuevosErrores);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    validarCampo(name, value);
  };

  const formatoPesos = (x) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(x);
  };

  const handleVerResumen = (e) => {
    e.preventDefault();
    if (Object.keys(errores).length === 0) {
      setMostrarResumen(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Agregar solicitud al array en memoria
    const nuevaSolicitud = {
      ...formData,
      id: Date.now(),
      fecha: new Date().toISOString(),
      cuotaMensual: cuotaMensual
    };
    solicitudesEnMemoria.push(nuevaSolicitud);
    
    console.log('Solicitudes en memoria:', solicitudesEnMemoria);
    
    // Mostrar mensaje de éxito
    setMensajeExito(true);
    setMostrarResumen(false);
    
    // Limpiar formulario automáticamente después de 3 segundos
    setTimeout(() => {
      setFormData({
        nombre: '',
        email: '',
        telefono: '',
        cedula: '',
        monto: '',
        plazo: '',
        tipoCredito: ''
      });
      setMensajeExito(false);
      navigate('/');
    }, 3000);
  };

  const productoActual = formData.tipoCredito 
    ? productos.find(p => p.id === formData.tipoCredito) 
    : null;

  if (mensajeExito) {
    return (
      <div className="solicitar">
        <div className="solicitar-container">
          <div className="mensaje-exito">
            <div className="icono-exito">✓</div>
            <h2>¡Solicitud Enviada con Éxito!</h2>
            <p>Nos pondremos en contacto contigo pronto.</p>
            <p className="redireccion">Redirigiendo al inicio...</p>
          </div>
        </div>
      </div>
    );
  }

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

        {!mostrarResumen ? (
          <form onSubmit={handleVerResumen} className="solicitar-form">
            <div className="form-group">
              <label>Nombre completo *</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                placeholder="Juan Pérez"
                className={errores.nombre ? 'input-error' : ''}
              />
              {errores.nombre && <span className="error-text">{errores.nombre}</span>}
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
                className={errores.email ? 'input-error' : ''}
              />
              {errores.email && <span className="error-text">{errores.email}</span>}
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
                className={errores.telefono ? 'input-error' : ''}
              />
              {errores.telefono && <span className="error-text">{errores.telefono}</span>}
            </div>

            <div className="form-group">
              <label>Cédula *</label>
              <input
                type="text"
                name="cedula"
                value={formData.cedula}
                onChange={handleChange}
                required
                placeholder="1234567890"
                className={errores.cedula ? 'input-error' : ''}
              />
              {errores.cedula && <span className="error-text">{errores.cedula}</span>}
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
                className={errores.monto ? 'input-error' : ''}
              />
              {errores.monto && <span className="error-text">{errores.monto}</span>}
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
                className={errores.plazo ? 'input-error' : ''}
              />
              {errores.plazo && <span className="error-text">{errores.plazo}</span>}
            </div>

            {cuotaMensual && (
              <div className="cuota-estimada-form">
                <p><strong>Cuota mensual estimada:</strong></p>
                <p className="cuota-valor-grande">{formatoPesos(cuotaMensual)}</p>
              </div>
            )}

            <button 
              type="submit" 
              className="btn-submit"
              disabled={Object.keys(errores).length > 0}
            >
              Ver Resumen
            </button>
          </form>
        ) : (
          <div className="resumen-solicitud">
            <h2>Resumen de tu Solicitud</h2>
            
            <div className="resumen-seccion">
              <h3>Datos Personales</h3>
              <p><strong>Nombre:</strong> {formData.nombre}</p>
              <p><strong>Email:</strong> {formData.email}</p>
              <p><strong>Teléfono:</strong> {formData.telefono}</p>
              <p><strong>Cédula:</strong> {formData.cedula}</p>
            </div>

            <div className="resumen-seccion">
              <h3>Datos del Crédito</h3>
              <p><strong>Producto:</strong> {productoActual?.nombre}</p>
              <p><strong>Tasa:</strong> {productoActual?.tasa}</p>
              <p><strong>Monto:</strong> {formatoPesos(parseInt(formData.monto.toString().replace(/\D/g, '')))}</p>
              <p><strong>Plazo:</strong> {formData.plazo} meses</p>
              <p className="cuota-destacada">
                <strong>Cuota mensual:</strong> {formatoPesos(cuotaMensual)}
              </p>
            </div>

            <div className="resumen-acciones">
              <button onClick={() => setMostrarResumen(false)} className="btn-editar">
                Editar
              </button>
              <button onClick={handleSubmit} className="btn-confirmar">
                Confirmar y Enviar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Solicitar;
