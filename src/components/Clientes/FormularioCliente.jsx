import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from "../../services/apirest";

const FormularioCliente = ({ clienteAEditar, onClose, onGuardar }) => {
  
  // 1. Estado inicial del formulario
  const [form, setForm] = useState({
   nombre_cli: '',
    email_cli: '',
    telefono_cli: '',
    direccion_cli: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // 2. useEffect: Detectar si estamos en modo EDICIÓN
  useEffect(() => {
    if (clienteAEditar) {
      // Si recibimos un cliente, rellenamos el formulario
      setForm({
        ...clienteAEditar,
      });
    } else {
      // Si no hay cliente, limpiamos el formulario (Modo CREAR)
      setForm({
        nombre_cli: '', email_cli: '', telefono_cli: '', direccion_cli: '' 
      });
    }
  }, [clienteAEditar]);

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

    const token = localStorage.getItem('token');
    
    // Determinar si es POST (crear) o PUT (editar)
    const method = clienteAEditar ? 'put' : 'post';
    // Si editamos, agregamos el ID a la URL. Si creamos, usamos la URL base.
    const url = clienteAEditar 
        ? API_URL +`clientes/${clienteAEditar.id_cli}`
        : API_URL+'clientes';

    try {
      await axios({
        method: method,
        url: url,
        data: form,
        headers: { Authorization: `Bearer ${token}` }
      });

      // Si todo sale bien:
      alert(clienteAEditar ? 'Cliente actualizado' : 'Cliente registrado');
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
      <h3>{clienteAEditar ? 'Editar Cliente' : 'Nuevo Cliente'}</h3>
      
      {error && <p className="alert alert-danger">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nombre:</label>
          <input 
            type="text" name="nombre_cli" value={form.nombre_cli} onChange={handleChange} 
            //required maxLength="10" 
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input 
            type="text" name="email_cli" value={form.email_cli} onChange={handleChange} 
            required 
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Telefono:</label>
          <input 
            type="text" name="telefono_cli" value={form.telefono_cli} onChange={handleChange} 
            required 
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Direccion:</label>
          <input 
            type="text" name="direccion_cli" value={form.direccion_cli} onChange={handleChange} 
            className="form-control"
          />
        </div>

        <div className="botones-accion" style={{ marginTop: '15px' }}>
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
          <button type="button" onClick={onClose} className="btn btn-secondary" style={{ marginLeft: '10px' }}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormularioCliente;