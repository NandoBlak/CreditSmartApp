import { useEffect, useMemo, useState } from "react";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getSolicitudes,
  updateSolicitud,
  deleteSolicitud
} from "../services/firestore";

const emptyProduct = {
  nombre: "",
  tasa: "",
  montoDesde: "",
  montoHasta: "",
  plazoMax: ""
};

function Admin() {
  const [products, setProducts] = useState([]);
  const [solicitudes, setSolicitudes] = useState([]);
  const [productForm, setProductForm] = useState(emptyProduct);
  const [editingProductId, setEditingProductId] = useState(null);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingSolicitudes, setLoadingSolicitudes] = useState(true);
  const [savingProduct, setSavingProduct] = useState(false);
  const [updatingSolicitudId, setUpdatingSolicitudId] = useState(null);

  const loadProducts = async () => {
    setLoadingProducts(true);
    try {
      const list = await getProducts();
      setProducts(list);
    } catch (err) {
      console.error("No se pudieron cargar productos", err);
    } finally {
      setLoadingProducts(false);
    }
  };

  const loadSolicitudes = async () => {
    setLoadingSolicitudes(true);
    try {
      const list = await getSolicitudes();
      setSolicitudes(list);
    } catch (err) {
      console.error("No se pudieron cargar solicitudes", err);
    } finally {
      setLoadingSolicitudes(false);
    }
  };

  useEffect(() => {
    loadProducts();
    loadSolicitudes();
  }, []);

  const handleProductChange = (e) => {
    const { name, value } = e.target;
    setProductForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setSavingProduct(true);
    try {
      if (editingProductId) {
        await updateProduct(editingProductId, productForm);
      } else {
        await createProduct(productForm);
      }
      setProductForm(emptyProduct);
      setEditingProductId(null);
      await loadProducts();
    } catch (err) {
      console.error("Error al guardar producto", err);
    } finally {
      setSavingProduct(false);
    }
  };

  const handleEditProduct = (product) => {
    setProductForm({
      nombre: product.nombre || "",
      tasa: product.tasa || "",
      montoDesde: product.montoDesde || "",
      montoHasta: product.montoHasta || "",
      plazoMax: product.plazoMax || ""
    });
    setEditingProductId(product.id);
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("¿Eliminar este producto?")) return;
    try {
      await deleteProduct(id);
      if (editingProductId === id) {
        setEditingProductId(null);
        setProductForm(emptyProduct);
      }
      await loadProducts();
    } catch (err) {
      console.error("Error al eliminar producto", err);
    }
  };

  const handleSolicitudEstado = async (id, estado) => {
    setUpdatingSolicitudId(id);
    try {
      await updateSolicitud(id, { estado });
      await loadSolicitudes();
    } catch (err) {
      console.error("Error al actualizar solicitud", err);
    } finally {
      setUpdatingSolicitudId(null);
    }
  };

  const handleDeleteSolicitud = async (id) => {
    if (!window.confirm("¿Eliminar esta solicitud?")) return;
    setUpdatingSolicitudId(id);
    try {
      await deleteSolicitud(id);
      await loadSolicitudes();
    } catch (err) {
      console.error("Error al eliminar solicitud", err);
    } finally {
      setUpdatingSolicitudId(null);
    }
  };

  const productosOrdenados = useMemo(() => {
    return [...products].sort((a, b) => a.nombre.localeCompare(b.nombre));
  }, [products]);

  const solicitudesOrdenadas = useMemo(() => {
    return [...solicitudes].sort((a, b) => (b.submissionDate?.seconds || 0) - (a.submissionDate?.seconds || 0));
  }, [solicitudes]);

  const formatoPesos = (x) => {
    if (!x) return "";
    const num = typeof x === "number" ? x : parseInt(x.toString().replace(/\D/g, "")) || 0;
    return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(num);
  };

  return (
    <div className="admin">
      <div className="admin-container">
        <h1>Panel de Administración</h1>

        <section className="admin-section">
          <div className="section-header">
            <h2>Productos crediticios</h2>
            <div className="section-actions">
              <button type="button" onClick={loadProducts} disabled={loadingProducts}>
                {loadingProducts ? "Actualizando..." : "Refrescar"}
              </button>
              {editingProductId && (
                <button type="button" onClick={() => { setEditingProductId(null); setProductForm(emptyProduct); }}>
                  Cancelar edición
                </button>
              )}
            </div>
          </div>

          <form className="card" onSubmit={handleProductSubmit}>
            <div className="grid-two">
              <label>
                Nombre
                <input name="nombre" value={productForm.nombre} onChange={handleProductChange} required />
              </label>
              <label>
                Tasa (% E.A.)
                <input name="tasa" value={productForm.tasa} onChange={handleProductChange} required />
              </label>
              <label>
                Monto desde
                <input name="montoDesde" value={productForm.montoDesde} onChange={handleProductChange} placeholder="$10.000.000" required />
              </label>
              <label>
                Monto hasta
                <input name="montoHasta" value={productForm.montoHasta} onChange={handleProductChange} placeholder="$200.000.000" required />
              </label>
              <label>
                Plazo máximo (meses)
                <input name="plazoMax" value={productForm.plazoMax} onChange={handleProductChange} required />
              </label>
            </div>
            <button type="submit" disabled={savingProduct}>
              {savingProduct ? "Guardando..." : editingProductId ? "Actualizar producto" : "Crear producto"}
            </button>
          </form>

          <div className="card table">
            {loadingProducts ? (
              <p>Cargando productos...</p>
            ) : productosOrdenados.length === 0 ? (
              <p>No hay productos cargados.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Tasa</th>
                    <th>Monto</th>
                    <th>Plazo máx</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {productosOrdenados.map((p) => (
                    <tr key={p.id}>
                      <td>{p.nombre}</td>
                      <td>{p.tasa}</td>
                      <td>{p.montoDesde} - {p.montoHasta}</td>
                      <td>{p.plazoMax}</td>
                      <td>
                        <div className="table-actions">
                          <button type="button" onClick={() => handleEditProduct(p)}>Editar</button>
                          <button type="button" onClick={() => handleDeleteProduct(p.id)}>Eliminar</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

        <section className="admin-section">
          <div className="section-header">
            <h2>Solicitudes de crédito</h2>
            <button type="button" onClick={loadSolicitudes} disabled={loadingSolicitudes}>
              {loadingSolicitudes ? "Actualizando..." : "Refrescar"}
            </button>
          </div>

          <div className="card table">
            {loadingSolicitudes ? (
              <p>Cargando solicitudes...</p>
            ) : solicitudesOrdenadas.length === 0 ? (
              <p>No hay solicitudes registradas.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Producto</th>
                    <th>Monto</th>
                    <th>Plazo</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {solicitudesOrdenadas.map((s) => (
                    <tr key={s.id}>
                      <td>{s.nombre}</td>
                      <td>{s.email}</td>
                      <td>{s.tipoCredito}</td>
                      <td>{formatoPesos(s.monto)}</td>
                      <td>{s.plazo} meses</td>
                      <td>
                        <select
                          value={s.estado || "pendiente"}
                          onChange={(e) => handleSolicitudEstado(s.id, e.target.value)}
                          disabled={updatingSolicitudId === s.id}
                        >
                          <option value="pendiente">Pendiente</option>
                          <option value="en revision">En revisión</option>
                          <option value="aprobada">Aprobada</option>
                          <option value="rechazada">Rechazada</option>
                        </select>
                      </td>
                      <td>
                        <div className="table-actions">
                          <button
                            type="button"
                            onClick={() => handleDeleteSolicitud(s.id)}
                            disabled={updatingSolicitudId === s.id}
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Admin;
