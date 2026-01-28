import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../services/apirest";
import FormularioServicio from "./FormularioServicio";
import { confirm } from "../Confirmation";
import Header from "../Servicios/Header";


class Dashboard extends React.Component {
    state = {
        registros: [],
        pagina_actual: 1,
        cadena_busqueda: "",
        token: localStorage.getItem('token'),
        total_paginas: 0,
        mostrarModal: false,
        servicioSeleccionado: null
    };

    componentDidMount = () => {
        this.cargarDatos();
    };

    mostrarModalNuevo = () => {
        this.setState({
            mostrarModal: true,
            servicioSeleccionado: null
        })
    }
    mostrarModalEditar = (id_serv) => {
        this.setState({
            mostrarModal: true,
            servicioSeleccionado: id_serv
            
        })
    }
    cerrarModal = () => {
        this.setState({ mostrarModal: false })
    }
    alGuardar = () => {
        this.cargarDatos()
        this.cerrarModal()
    }


    cargarDatos = () => {
        let url = API_URL + "servicios?page=" +
            this.state.pagina_actual + "&cadena=" + this.state.cadena_busqueda;
        axios
            .get(url, { headers: { 'Authorization': `Bearer ${this.state.token}` } })
            .then(response => {
                this.setState({
                    registros: response.data.data,
                    total_paginas: response.data.totalPage
                });
            })
            .catch((error) => {
                //  const { notificacion } = this.props;
                // notificacion(error);
                console.log("Error de notificación")

            });
    }
    paginaSiguiente = () => {
        if (this.state.pagina_actual < this.state.total_paginas) {
            this.setState(
                { pagina_actual: this.state.pagina_actual + 1 },
                () => { this.cargarDatos(); }
            )
        }
    }
    PaginaAterior = () => {
        if (this.state.pagina_actual> 1) {

            this.setState(
                { pagina_actual: this.state.pagina_actual - 1 },
                () => { this.cargarDatos(); }
            )
        }
    }
    buscarTexto = async e => {
        console.log(e.charCode)
        if (e.charCode === 13) {
            this.setState({
                pagina_actual: 1,
                cadena_busqueda: e.target.value
            }, () => { this.cargarDatos() });
        }
    }

    // Función eliminar
  eliminar = async (id, tipo_serv) => {
    const notificacion = this.props.notificacion;
    if (await confirm(`¿Estás seguro de eliminar el servicio con el siguiente tipo: ${tipo_serv}?`)) {
      let url = API_URL + "servicios/" + id;
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
   irAlDashboard = () => {
    this.props.navigate('/dashboard'); // Ajusta esta ruta según tu configuración
  };

    render() {
        return (
            <div>
                <div className="col-10 position-absolute top-0 start-50 translate-middle-x mt-5">
                    <Header />
                    <h1 className="text-center mb-4">Datos</h1>
                    <button className="btn btn-success" onClick={this.mostrarModalNuevo}>
                        Nuevo </button>
                    <input type="text" placeholder="Buscar " onKeyPress={this.buscarTexto} style={{ marginRight: "10px", marginLeft: "10px", width: "300px" }} />
                    <table className="table table-hover table-bordered shadow-sm">
                        <thead className="table-success text-center">
                            <tr>
                                <th scope="col">id_serv </th>
                                <th scope="col">tipo_serv </th>
                                <th scope="col">descripcion_serv</th>
                                <th scope="col">costo_serv</th>

                            </tr>
                        </thead>
                        <tbody>
                            {this.state.registros.map((value, index) => {
                                return (
                                    <tr key={index} className="text-center align-middle">
                                        <th scope="row">{value.id_serv}</th>
                                        <td>{value.tipo_serv}</td>
                                        <td>{value.descripcion_serv}</td>
                                        <td>{value.costo_serv}</td>

                                        <td>
                                            <span className="me-2" role="button" title="Editar">
                                                <svg
                                                    onClick={() => this.mostrarModalEditar(value)}
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="24"
                                                    height="24"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="#28a745"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
                                                    <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" />
                                                    <path d="M16 5l3 3" />
                                                </svg>
                                            </span>
                                            <span role="button" title="Eliminar">
                                                <svg
                                                    onClick={() => this.eliminar(value.id_serv, value.tipo_serv)}
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="24"
                                                    height="24"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="#dc3545"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <path d="M3 3l18 18" />
                                                    <path d="M19 20h-10.5l-4.21 -4.3a1 1 0 0 1 0 -1.41l5 -4.993m2.009 -2.01l3 -3a1 1 0 0 1 1.41 0l5 5a1 1 0 0 1 0 1.41c-1.417 1.431 -2.406 2.432 -2.97 3m-2.02 2.043l-4.211 4.256" />
                                                    <path d="M18 13.3l-6.3 -6.3" />
                                                </svg>
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    <button type="button" className="btn btn-secondary" onClick={this.PaginaAterior}>Anterior</button>
                    <input type="text" readOnly value={this.state.pagina_actual + " de " + this.state.total_paginas}
                        style={{ marginRigth: "10px", marginLeft: "10px", textAlign: "center", width: "120px" }}></input>
                    <button type="button" className="btn btn-secondary" onClick={this.paginaSiguiente}>Siguiente</button>

                </div>
                {this.state.mostrarModal &&(
                        <div className="modal-overlay" style={modalStyles.Overlay}>
                            <div className="modal-content" style={modalStyles.content}>
                                <FormularioServicio
                                servicioAEditar={this.state.servicioSeleccionado}
                                onClose={this.cerrarModal}
                                onGuardar={this.alGuardar}
                                notificacion= {this.props.notificacion}
                                
                                />
                               
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
const modalStyles = {
    Overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(68, 63, 63, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
    },
    content: {
        backgroundColor: '#ffffffff',
        padding: '20px',
        borderRadius: '8px',
        maxWidth: '500px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto'
    }
}
function ContenedorNavegacion(props) {
    let navigate = useNavigate();
    return <Dashboard {...props} navigate={navigate} />
}

export default ContenedorNavegacion;