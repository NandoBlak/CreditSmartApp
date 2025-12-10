import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import CreditCard from '../components/creditCard';

function Home() {
  const [creditos, setCreditos] = useState([]);
  const [loading, setLoading] = useState(true);

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
