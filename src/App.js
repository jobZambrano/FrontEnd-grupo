import React from 'react';
import './css/App.css'
import 'bootstrap/dist/css/bootstrap.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DatosTecnicos from './components/Tecnicos/DatosTecnicos.jsx';
import DatosServicios from'./components/Servicios/Dashboard.jsx';
import DatosEquipos from'./components/Equipos/DatosEquipos.jsx';
import DatosClientes from'./components/Clientes/DatosClientes.jsx';
import Login from './components/Tecnicos/Login.jsx';
import Dashboard1 from './components/Servicios/Dashboard1.jsx';

class App extends React.Component{
  
  notificacion = (mensaje) => {
    const parrafo = document.createElement('p');//crea un parrafo
    parrafo.textContent = mensaje;
    parrafo.style.backgroundColor = '#61dafb';
    parrafo.style.border = '1px solid #ddd';
    document.querySelector('.notificacion').appendChild(parrafo);
    setTimeout(() => {
      parrafo.remove();
    }, 3000);

  }
  render(){
  return (
    <div className="App">
      <div className='notificacion'></div>
      <Router>
        <Routes>
          <Route path='/' element={<Login/>} />
          <Route path='/dashboard' element={<Dashboard1/>} />
          <Route path='/datosTecnicos' element={<DatosTecnicos notificacion={this.notificacion } />}/>
          <Route path='/datosServicios' element={<DatosServicios notificacion={this.notificacion } />}/>
          <Route path='/datosEquipos' element={<DatosEquipos notificacion={this.notificacion } />}/>
          <Route path='/datosClientes' element={<DatosClientes notificacion={this.notificacion } />}/>
        </Routes>
      </Router>
    </div>
  );
}
}
export default App;
