import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from "../../services/apirest";
//import { SoloLetras, SoloNumeros, AlfanumericoGuion } from '../../utils/validaciones';

const FormularioEquipos = ({ EquipoAEditar, onClose, onGuardar, notificacion }) => {
  
  // 1. Estado inicial del formulario
  const [form, setForm] = useState({
    tipo_equ: '',
    marca_equ: '',
    modelo_equ: '',
    serie_equ: '',
    id_cli: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // 2. useEffect: Detectar si estamos en modo EDICIÓN
  useEffect(() => {
    if (EquipoAEditar) {
      // Si recibimos un Equipo, rellenamos el formulario
      setForm({
        ...EquipoAEditar,
      });
    } else {
      // Si no hay Equipo, limpiamos el formulario (Modo CREAR)
      setForm({
        tipo_equ: '', marca_equ: '', modelo_equ: '', 
        serie_equ: '', id_cli: ''
      });
    }
  }, [EquipoAEditar]);

  // 3. Manejador de cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value
    });
  };

  // 4. Envío del formulario (Create o Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

   /* if (SoloLetras(form.tipo_equ)){ 
      notificacion("Tipo no valido");
      setLoading (false);
      return
    }
    if (SoloLetras(form.marca_equ)){ 
      notificacion("Modelo no valido");
      setLoading (false);
      return
    }
    if (AlfanumericoGuion(form.modelo_equ)){ 
      notificacion("Modelo no valido");
      setLoading (false);
      return
    }
    if (AlfanumericoGuion(form.serie_equ)){ 
      notificacion("Serie no valido");
      setLoading (false);
      return
    }
    if (SoloNumeros(form.id_cli)){ 
      notificacion("ID no valido");
      setLoading (false);
      return
    }*/

    const token = localStorage.getItem('token');
    
    // Determinar si es POST (crear) o PUT (editar)
    const method = EquipoAEditar ? 'put' : 'post';
    // Si editamos, agregamos el ID a la URL. Si creamos, usamos la URL base.
    const url = EquipoAEditar 
      ? API_URL + `equipos/${EquipoAEditar.id_equ}` 
      : API_URL + 'equipos';
        
    try {
      await axios({
        method: method,
        url: url,
        data: form,
        headers: { Authorization: `Bearer ${token}` }
      });

      // Si todo sale bien:
      alert(EquipoAEditar ? 'Equipo actualizado' : 'Equipo registrado');
      onGuardar(); // Llamamos a la función del padre para recargar la tabla
      onClose();   // Cerramos el modal

    } catch (err) {
      // Manejo de errores (ej: Cédula duplicada 409, Error servidor 500)
      if (err.response && err.response.data) {
        setError(err.response.data.message || 'Error al guardar');
      } else {
        setError('Ocurrió un error inesperado');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="formulario-container">
      <h3>{EquipoAEditar ? 'Editar Equipo' : 'Nuevo Equipo'}</h3>
      
      {error && <p className="alert alert-danger">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Tipo de Equipo:</label>
          <input 
            type="text" name="tipo_equ" value={form.tipo_equ} onChange={handleChange} 
            required maxLength="10" 
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Marca de Equipo:</label>
          <input 
            type="text" name="marca_equ" value={form.marca_equ} onChange={handleChange} 
            required 
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Modelo de equipo:</label>
          <input 
            type="text" name="modelo_equ" value={form.modelo_equ} onChange={handleChange} 
            required 
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Serie de equipo:</label>
          <input 
            type="text" name="serie_equ" value={form.serie_equ} onChange={handleChange} 
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>ID del Cliente:</label>
          <input 
            type="text" name="id_cli" value={form.id_cli} onChange={handleChange} 
            required 
            className="form-control"
          />
        </div>

        <div className="d-flex justify-content-end gap-2 mt-4" style={{ marginTop: '15px' }}>
          <button type="submit" disabled={loading} className="btn btn-primary px-4">
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
          <button type="button" onClick={onClose} className="btn btn-secondary me-2" style={{ marginLeft: '10px' }}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormularioEquipos;