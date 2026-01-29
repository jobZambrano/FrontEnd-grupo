import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../services/apirest";
import FormularioEquipos from "./FormularioEquipos";
import { confirm } from "../Confirmation";
import Header from "../Servicios/Header";

class DatosEquipos extends React.Component {
  //codigo javasctit
  state = {
    registros: [],
    paginaActual: 1,
    cadenaDeBusqueda: "",
    token: localStorage.getItem('token'),
    total_paginas: 0,
    mostrarModal: false,
    EquipoSeleccionado: null
  };
  componentDidMount = () => {
    this.cargarDatos();
  }

  mostrarModalNuevo = () => {
    this.setState({
      mostrarModal: true,
      EquipoSeleccionado: null
    });
  }

  mostrarModalEditar = (value) => {
    const {EditarVariable} = this.props;
    EditarVariable(value.id_cli,value.nombre_cli);
    this.setState({
      mostrarModal: true,
      EquipoSeleccionado: value
    });
  }

  cerrarModal = () => {
    this.setState({ mostrarModal: false });
  }

  alGuardar = () => {
    this.cargarDatos();
    this.cerrarModal();
  }

  cargarDatos = () => {
    let url = API_URL + "equipos?page=" + this.state.paginaActual + "&cadena=" + this.state.cadenaDeBusqueda;
    axios
      .get(url, { headers: { 'Authorization': `Bearer ${this.state.token}` } })
      .then((response) => {
        this.setState({
          registros: response.data.data,
          total_paginas: response.data.totalPages
        });
      })
      .catch((error) => {
        //const { notificacion } = this.props;
        //notificacion(error);
        console.error("Error de notificacion");
      });
  };

  // Función eliminar
  eliminar = async (id, serie) => {
    const notificacion = this.props.notificacion;
    if (await confirm(`¿Estás seguro de eliminar el equipo con serie: ${serie}?`)) {
      let url = API_URL + "equipos/" + id;
      axios
        .delete(url, { headers: { 'Authorization': `Bearer ${this.state.token}` } })
        .then(() => {
          this.cargarDatos(); // Recargar la tabla tras borrar
        })
        .catch((error) => {
          notificacion( error.response.data.error || 'Error al eliminar: ' + error );
        });
    }
  };
  
  PaginasSiguiente = () => {
    if (this.state.paginaActual < this.state.total_paginas) {
      this.setState({
        paginaActual: this.state.paginaActual + 1,
      }, () => {
        this.cargarDatos();
      })
    }
  }
  PaginasAnterior = () => {
    if (this.state.paginaActual> 1) {
            this.setState(
                { paginaActual: this.state.paginaActual - 1 },
                () => { this.cargarDatos(); }
            )
        }
  }

  buscarTexto = async (e) => {
    console.log(e.charCode)
        if (e.charCode === 13) {
            this.setState({
                paginaActual: 1,
                cadenaDeBusqueda: e.target.value
            }, () => { this.cargarDatos() });
        }
    }

  render() {
    return (
      <div>
        <div className="col-10 position-absolute top-0 start-50 translate-middle-x mt-5">
          <Header />
          <h1 className="text-center mb-4">Datos de Equipos</h1>
          <button className="btn btn-success" onClick={this.mostrarModalNuevo}>
            Nuevo registro
          </button>
          <input
            type="text"
            placeholder="Buscar"
            onKeyPress={this.buscarTexto}
            style={{ marginRigth: "10px", marginLeft: "10px", width: "300px" }}/>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">ID EQUIPO</th>
                <th scope="col">Tipo</th>
                <th scope="col">Marca</th>
                <th scope="col">Modelo</th>
                <th scope="col">Serie</th>
                <th scope="col">ID Cliente</th>
              </tr>
            </thead>
            <tbody>
              {this.state.registros.map((value, index) => {
                //Recorrer los registros
                return (
                  <tr key={index}>
                    <th scope="row">{value.id_equ}</th>
                    <td>{value.tipo_equ}</td>
                    <td>{value.marca_equ}</td>
                    <td>{value.modelo_equ}</td>
                    <td>{value.serie_equ}</td>
                    <td>{value.nombre_cli}</td>
                    <td>
                      <svg
                        onClick={() => this.mostrarModalEditar(value)}
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#007aff"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
                        <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" />
                        <path d="M16 5l3 3" />
                      </svg>

                      <svg
                        onClick={() => this.eliminar(value.id_equ, value.serie_equ)}
                        xmlns="http://www.w3.org/2000/svg"
                        width="28"
                        height="28"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#ff2d55"
                        strokeWidth="1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M4 7l16 0" />
                        <path d="M10 11l0 6" />
                        <path d="M14 11l0 6" />
                        <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                        <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                      </svg>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <button type="button" className="btn btn-secondary" onClick={this.PaginasAnterior}>Anterior</button>
          <input type="text" readOnly value={this.state.paginaActual + " de " + this.state.total_paginas}
            style={{ marginRigth: "10px", marginLeft: "10px", textAlign: "center", width: "120px" }} />
          <button type="button" className="btn btn-secondary" onClick={this.PaginasSiguiente} >Siguiente</button>
        </div>
        {this.state.mostrarModal && (
          <div className="modal-overlay" style={modalStyles.Overlay}>
            <div className="modal-content" style={modalStyles.content}>
              <FormularioEquipos
                EquipoAEditar={this.state.EquipoSeleccionado}
                onClose={this.cerrarModal}
                onGuardar={this.alGuardar}
                notificacion={this.props.notificacion}

              />
            </div>
          </div>
        )}
      </div>
    );
  }
}

const modalStyles = {
    Overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0, // Corregido de 'botton' a 'bottom'
        backgroundColor: 'rgba(0, 0, 0, 0.7)', // Un gris casi negro para aislar el fondo
        display: 'flex',
        justifyContent: 'center', // Centra horizontalmente
        alignItems: 'center',     // Centra verticalmente
        zIndex: 2000,             // Aumentado para asegurar que esté por encima de todo
        backdropFilter: 'blur(3px)' // Efecto opcional de desenfoque al fondo
    },
    content: {
        backgroundColor: '#ffffff',
        padding: '30px',          // Más espacio interno
        borderRadius: '12px',     // Bordes más redondeados
        maxWidth: '500px',
        width: '90%',             // Mejor respuesta en móviles
        maxHeight: '85vh',
        overflowY: 'auto',
        boxShadow: '0px 10px 25px rgba(0,0,0,0.5)', // Sombra para dar profundidad
        position: 'relative'
    }
};

function ContenedorNavegacion(props) {
  let navigate = useNavigate();
  return <DatosEquipos {...props} navigate={navigate} />;
}
export default ContenedorNavegacion;
