import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<h1>Inicio</h1>} />
        <Route path="/productos" element={<h1>Productos</h1>} />
        <Route path="/nosotros" element={<h1>Nosotros</h1>} />
        <Route path="/contacto" element={<h1>Contacto</h1>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
