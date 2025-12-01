import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/navbar'
import Home from './pages/Home'
import Simulador from './pages/Simulador'
import Solicitar from './pages/Solicitar'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/simulador" element={<Simulador />} />
        <Route path="/solicitar" element={<Solicitar />} />
        <Route path="/solicitar/:id" element={<Solicitar />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
