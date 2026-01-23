import 'bootstrap/dist/css/bootstrap.css';
import axios from "axios";
import React, { useState, useEffect } from 'react';
import { API_URL } from "../../services/apirest";
import {soloLetras, validarTelefonoBasico} from "../../utils/validaciones"

const Nuevo = ({ TecnicoAEditar, onClose, onGuardar, notificacion }) => {
    // 1. Estado inicial del formulario
    const [form, setForm] = useState({
        usuario_tec: '',
        nombre_tec: '',
        especialidad_tec: '',
        telefono_tec: '',
        contrasenia_tec: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // 2. useEffect: Detectar si estamos en modo EDICIÓN
    useEffect(() => {
        if (TecnicoAEditar) {
            // Si recibimos un cliente, rellenamos el formulario
            setForm({
                usuario_tec: TecnicoAEditar.usuario_tec,
                nombre_tec: TecnicoAEditar.nombre_tec,
                especialidad_tec: TecnicoAEditar.especialidad_tec,
                telefono_tec: TecnicoAEditar.telefono_tec,
                contrasenia_tec: TecnicoAEditar.contrasenia_tec
            });
        } else {
            // Si no hay cliente, limpiamos el formulario (Modo CREAR)
            setForm({
                usuario_tec: '',
                nombre_tec: '',
                especialidad_tec: '',
                telefono_tec: '',
                contrasenia_tec: ''
            });
        }
    }, [TecnicoAEditar]);

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

        if (!soloLetras(form.nombre_tec) ) {
            notificacion('Nombre no valido');
            setLoading(false);
            return;
        }
        if (!soloLetras(form.especialidad_tec) ) {
            notificacion('Especialidad no valido');
            setLoading(false);
            return;
        }
        if (!validarTelefonoBasico(form.telefono_tec) ) {
            notificacion('Agrege un numero de celular correcto');
            setLoading(false);
            return;
        }

        const token = localStorage.getItem('token');

        // Determinar si es POST (crear) o PUT (editar)
        const method = TecnicoAEditar ? 'put' : 'post';
        // Si editamos, agregamos el ID a la URL. Si creamos, usamos la URL base.
        const url = TecnicoAEditar
            ? API_URL + `Tecnicos/${TecnicoAEditar.id_tec}`
            : API_URL + 'Tecnicos';

        try {
            await axios({
                method: method,
                url: url,
                data: form,
                headers: { Authorization: `Bearer ${token}` }
            });

            // Si todo sale bien:
            alert(TecnicoAEditar ? 'Tecnico actualizado' : 'Tecnico registrado');
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
            <h3>{TecnicoAEditar ? 'Editar Tecnico' : 'Nuevo Tecnico'}</h3>

            {error && <p className="alert alert-danger">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="usuario_tec" className="form-label">Usuario</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        id="usuario_tec" 
                        name="usuario_tec" 
                        value={form.usuario_tec}
                        onChange={handleChange} 
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="nombre_tec" className="form-label">Nombre</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        id="nombre_tec" 
                        name="nombre_tec" 
                        value={form.nombre_tec}
                        onChange={handleChange} 
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="especialidad_tec" className="form-label">Especialidad</label>
                    <input 
                        type="text" 
                        className="form-control especialidad_tec" 
                        id="especialidad_tec" 
                        name="especialidad_tec" 
                        value={form.especialidad_tec}
                        onChange={handleChange} 
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="telefono_tec" className="form-label">Telefono</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        id="telefono_tec" 
                        name="telefono_tec" 
                        value={form.telefono_tec}
                        onChange={handleChange} 
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="contrasenia_tec" className="form-label">Contraseña</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        id="contrasenia_tec" 
                        name="contrasenia_tec" 
                        value={form.contrasenia_tec}
                        onChange={handleChange} 
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
export default Nuevo;