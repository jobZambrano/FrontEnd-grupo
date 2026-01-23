import React from 'react';
import './css/App.css'
import 'bootstrap/dist/css/bootstrap.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DatosTecnicos from './components/Tecnicos/DatosTecnicos.jsx';
import Login from './components/Tecnicos/Login.jsx';
import Dashboard from './components/Servicios/Dashboard.jsx';

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
          <Route path='/dashboard' element={<Dashboard/>} />
          <Route path='/datosTecnicos' element={<DatosTecnicos notificacion={this.notificacion } />}/>
        </Routes>
      </Router>
    </div>
  );
}
}
export default App;
