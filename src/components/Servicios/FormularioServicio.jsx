
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from "../../services/apirest";
import { validarPrecio, validarDescripcion } from '../../utils/validaciones'

const FormularioServicio = ({ servicioAEditar, onClose, onGuardar, notificacion }) => {


  // 1. Estado inicial del formulario
  const [form, setForm] = useState({
    tipo_serv: '',
    descripcion_serv: '',
    costo_serv: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // 2. useEffect: Detectar si estamos en modo EDICIÓN
  useEffect(() => {
    if (servicioAEditar) {
      // Si recibimos un cliente, rellenamos el formulario
      setForm({
        ...servicioAEditar
      });
    } else {
      // Si no hay cliente, limpiamos el formulario (Modo CREAR)
      setForm({
        tipo_serv: '', descripcion_serv: '', costo_serv: ''
      });
    }
  }, [servicioAEditar]);

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

    if (!validarDescripcion(form.tipo_serv)) {
      notificacion("tipo no valido")
      setLoading(false)
      return
    }
    if (!validarDescripcion(form.descripcion_serv)) {
      notificacion("descripcion no valido")
      setLoading(false)
      return

    }
    if (!validarPrecio(form.costo_serv)) {
      notificacion("costo no valido")
      setLoading(false)
      return
    }



    const token = localStorage.getItem('token');

    // Determinar si es POST (crear) o PUT (editar)
    const method = servicioAEditar ? 'put' : 'post';
    // Si editamos, agregamos el ID a la URL. Si creamos, usamos la URL base.
    const url = servicioAEditar
      ? API_URL + `servicios/${servicioAEditar.id_serv}`
      : API_URL + 'servicios';

    try {
      await axios({
        method: method,
        url: url,
        data: form,
        headers: { Authorization: `Bearer ${token}` }
      });

      // Si todo sale bien:
      notificacion(servicioAEditar ? 'servicios actualizado' : 'servicios registrado');
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
      <h3>{servicioAEditar ? 'Editar servicios' : 'Nuevo servicios'}</h3>

      {error && <p className="alert alert-danger">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>tipo_serv:</label>
          <input
            type="text" name="tipo_serv" value={form.tipo_serv} onChange={handleChange}
            required 
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>descripcion_serv:</label>
          <input
            type="text" name="descripcion_serv" value={form.descripcion_serv} onChange={handleChange}
            required
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>costo_serv:</label>
          <input
            type="text" name="costo_serv" value={form.costo_serv} onChange={handleChange}
            required
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

export default FormularioServicio;