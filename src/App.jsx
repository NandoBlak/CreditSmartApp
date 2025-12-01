// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
// ... Importa Simulador y Solicitar

function App() {
  return (
    <BrowserRouter>
      <Navbar /> {/* Componente Reutilizable  */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/simulador" element={/* Componente Simulador */} />
        <Route path="/solicitar" element={/* Componente Solicitar */} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;