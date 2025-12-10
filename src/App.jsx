import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/navbar'
import Home from './pages/home'
import Simulador from './pages/Simulador'
import Simular from './pages/Simular'
import Solicitar from './pages/Solicitar'
import Admin from './pages/Admin'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/simulador" element={<Simulador />} />
        <Route path="/simular/:id" element={<Simular />} />
        <Route path="/solicitar" element={<Solicitar />} />
        <Route path="/solicitar/:id" element={<Solicitar />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
