import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../services/apirest";
import Nuevo from "./FormularioTecnico";
import Header from "../Servicios/Header";
import { confirm } from "../../components/Confirmation";

class DatosTecnicos extends React.Component {
  //codigo javasctit
  state = {
    registros: [],
    paginaActual: 1,
    cadenaDeBusqueda: "",
    token: localStorage.getItem('token'),
    total_paginas: 0,
    mostrarModal: false,
    tecnicoSeleccionado: null
  };
  componentDidMount = () => {
    this.cargarDatos();
  }
  mostrarModalNuevo = () => {
    this.setState({
      mostrarModal: true,
      tecnicoSeleccionado: null
    });
  }
  mostrarModalEditar = (id_tec) => {
    this.setState({
      mostrarModal: true,
      tecnicoSeleccionado: id_tec
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
    let url = API_URL + "tecnicos?page=" + this.state.paginaActual + "&cadena=" + this.state.cadenaDeBusqueda;

    axios
      .get(url, { headers: { 'Authorization': `Bearer ${this.state.token}` } })
      .then((response) => {
        this.setState({
          registros: response.data.data,
          total_paginas: response.data.totalPages
        });
      })
      .catch((error) => {
      });
  };
  paginaSiguiente = () => {
    if (this.state.paginaActual < this.state.total_paginas) {
      this.setState(
        { paginaActual: this.state.paginaActual + 1 },
        () => { this.cargarDatos(); }
      )
    }

  }
  paginaAnterior = () => {
    if (this.state.paginaActual > 1) {

      this.setState(
        { paginaActual: this.state.paginaActual - 1 },
        () => { this.cargarDatos(); }
      )
    }

  }
  buscarTexto = async e => {
    if (e.charCode === 13) {
      this.setState({
        paginaActual: 1,
        cadenaDeBusqueda: e.target.value
      }, () => { this.cargarDatos() });
    }
  }
  // Función eliminar
  eliminar = async (id_tec, nombre_tec) => {
    const notificacion = this.props.notificacion;
    if (await confirm(`¿Estás seguro de eliminar el técnico con nombre: ${nombre_tec}?`)) {
      let url = API_URL + "tecnicos/" + id_tec;
      axios
        .delete(url, { headers: { 'Authorization': `Bearer ${this.state.token}` } })
        .then(() => {
          this.cargarDatos(); // Recargar la tabla tras borrar
          if (notificacion) {
            notificacion("Técnico eliminado correctamente", "success");
          }
        })
        .catch((error) => {
          notificacion(error.response.data.error || 'Error al eliminar: ' + error);
        });
    }
  };

  irAlDashboard = () => {
    this.props.navigate('/dashboard'); // Ajusta esta ruta según tu configuración
  };
  render() {
    return (
      <div>

        <div className="col-10 position-absolute top-30 start-50 translate-middle-x">
          <Header />
          <h1 style={{ padding: "10px" }}>Datos de tecnicos</h1>
          <button className="btn btn-success " onClick={this.mostrarModalNuevo}>Nuevo registro</button>
          <input type="text" placeholder="Busqueda por nombre"
            onKeyPress={this.buscarTexto}
            style={{ marginLeft: "10px" }} />
          <table className="table">
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Usuario</th>
                <th scope="col">Nombre</th>
                <th scope="col">Especialidad</th>
                <th scope="col">Telefono</th>
              </tr>
            </thead>
            <tbody>
              {this.state.registros.map((value, index) => {
                //Recorrer los registros
                return (
                  <tr key={index}>
                    <th scope="row">{value.id_tec}</th>
                    <td>{value.usuario_tec}</td>
                    <td>{value.nombre_tec}</td>
                    <td>{value.especialidad_tec}</td>
                    <td>{value.telefono_tec}</td>
                    <td>
                      <svg
                        onClick={() => this.mostrarModalEditar(value)}
                        xmlns="http://www.w3.org/2000/svg"
                        width="28"
                        height="28"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#007aff"
                        strokeWidth="1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
                        <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" />
                        <path d="M16 5l3 3" />
                      </svg>

                      <svg
                        onClick={() => this.eliminar(value.id_tec, value.nombre_tec)}
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
          <button type="button" className="btn btn-secondary" onClick={this.paginaAnterior} >Anterior</button>
          <input type="text" readOnly value={this.state.paginaActual + " de " + this.state.total_paginas} style={{ marginRight: "10px", marginLeft: "10px", textAlign: "center", width: "120px" }}
          />
          <button type="button" className="btn btn-secondary" onClick={this.paginaSiguiente} >Siguiente</button>
        </div>
        {this.state.mostrarModal && (
          <div className="modal-overlay" style={modalStyles.overlay}>
            <div className="modal-content" style={modalStyles.content}>
              <Nuevo TecnicoAEditar={this.state.tecnicoSeleccionado} onClose={this.cerrarModal}
                onGuardar={this.alGuardar} notificacion={this.props.notificacion} />
            </div>

          </div>
        )}
        <button
          className="btn btn-outline-primary d-flex align-items-center"
          onClick={this.irAlDashboard}
          style={{
            padding: "8px 16px",
            borderRadius: "8px",
            fontWeight: "500",
            transition: "all 0.3s ease"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#007bff";
            e.currentTarget.style.color = "white";
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = "#007bff";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ marginRight: "8px" }}
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Volver al Dashboard
        </button>
      </div>
    );
  }
}
// estilo  para ventana modal  
const modalStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0, 
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.1)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center', 
    zIndex: 1000 
  },
  content: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    maxWidth: '500px',
    width: '100%',
    maxHeight: '90vh',
    overflowY: 'auto' , 
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  }
}
function ContenedorNavegacion(props) {
  let navigate = useNavigate();
  return <DatosTecnicos {...props} navigate={navigate} />;
}
export default ContenedorNavegacion;
