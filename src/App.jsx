import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import './App.css';
import { useSelector } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Error404 from './pages/404';

import CrearFactura from './pages/facturas/CrearFactura';
import ListaFacturas from './pages/facturas/ListaFacturas';
import EditarFactura from './pages/facturas/EditarFactura';

import { Login } from './pages/Login';
import Navbar from './components/Navbar';

import { ProtegerRutas } from './components/protegerRutas';

import CrearEmisor from './pages/emisor/CrearEmisor';
import EditarEmisor from './pages/emisor/EditarEmisor';
import ListarEmisores from './pages/emisor/ListarEmisores';

import CrearReceptor from './pages/receptor/CrearReceptor';
import ListarReceptores from './pages/receptor/ListarReceptores';
import EditarReceptor from './pages/receptor/ActualizarReceptor';

function App() {
  const { auth, nombre } = useSelector(state => state.usuario);

  return (
    <BrowserRouter>
      {
        auth && <Navbar nombre={nombre} />
      }
      <Routes>
        <Route index element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* Acá debo obtener de redux, si está o no logueado, y se lo pasamos al proteger rutas */}
        <Route element={<ProtegerRutas auth={auth} />}>

          {/* Ruta inicial al loguearse */}
          <Route index element={<ListaFacturas />} />

          {/* Rutas de facturas */}
          <Route path='/facturas' element={<ListaFacturas />} />
          <Route path='/crear-factura' element={<CrearFactura />} />
          <Route path='/editar-factura/:id' element={<EditarFactura />} />
          <Route path='/ver-factura/:id' element={<EditarFactura soloLectura={true} />} />

          {/* Rutas receptor */}
          <Route path='/receptores' element={<ListarReceptores />} />
          <Route path='/crear-receptor' element={<CrearReceptor />} />
          <Route path='/editar-receptor/:id' element={<EditarReceptor />} />
          <Route path='/ver-receptor/:id' element={<EditarReceptor soloLectura={true} />} />

          {/* Rutas Emisor */}
          <Route path='/emisores' element={<ListarEmisores />} />
          <Route path='/crear-emisor' element={<CrearEmisor />} />
          <Route path='/editar-emisor/:id' element={<EditarEmisor />} />
          <Route path='/ver-emisor/:id' element={<EditarEmisor soloLectura={true} />} />

          <Route path='*' element={<Error404 />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App

