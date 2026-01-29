import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../services/apirest";
import FormularioCliente from "./FormularioCliente";
import { confirm } from "../Confirmation";

class DatosClientes extends React.Component {
    //codigo javasctit
    state = {
        registros: [],
        paginaActual: 1,
        cadenaDeBusqueda: "",
        token: localStorage.getItem('token'),
        totalPaginas: 0,
        mostrarModal: false,
        clienteSeleccionado: null
    };
    componentDidMount = () => {
        this.cargarDatos();
    }
    mostrarModalNuevo = () => {
        this.setState({
            mostrarModal: true,
            clienteSeleccionado: null
        });
    }
    mostrarModalEditar = (id_cli) => {
        this.setState({
            mostrarModal: true,
            clienteSeleccionado: id_cli
        });
    }
    cerrarmodal = () => {
        this.setState({
            mostrarModal: false,
            clienteSeleccionado: null
        });
        this.cargarDatos();
    }
    alGuardar = () => {
        this.cargarDatos();//recargar datos
        this.cerrarmodal();//cerrar la ventana modal
    }

    cargarDatos = () => {
        let url = API_URL + "clientes?page=" + this.state.paginaActual + "&cadena=" + this.state.cadenaDeBusqueda;
        axios
            .get(url, { headers: { 'Authorization': `Bearer ${this.state.token}` } })
            .then((response) => {
                this.setState({
                    registros: response.data.data,
                    totalPaginas: response.data.totalPages,
                });
            })
            .catch((error) => {
                //const { notificacion } = this.props;
                //notificacion(error);
            });
    };
    paginaSiguiente = () => {
        if (this.state.paginaActual < this.state.totalPaginas) {
            this.setState(
                { paginaActual: this.state.paginaActual + 1 },
                () => { this.cargarDatos(); }
            );
        }
    };

    paginaAnterior = () => {
        if (this.state.paginaActual > 1) {
            this.setState(
                { paginaActual: this.state.paginaActual - 1 },
                () => { this.cargarDatos(); }
            );
        }
    };

    buscarTexto = (e) => {
        if (e.key === 'Enter') {
            this.setState({ paginaActual: 1 }, () => { this.cargarDatos(); });
        }
    };

    manejadorBusqueda = (e) => {
        this.setState({ cadenaDeBusqueda: e.target.value });
    };

    eliminar = async (id, nombre) => {
        // 1. Definimos la notificación desde los props (igual que en la imagen)
        const notificacion = this.props.notificacion;

        if (await confirm(`¿Estás seguro de eliminar el cliente: ${nombre}?`)) {
            // 2. Usamos tu variable API_URL
            let url = API_URL + "clientes/" + id;

            axios
                .delete(url, { headers: { 'Authorization': `Bearer ${this.state.token}` } })
                .then(() => {
                    this.cargarDatos(); // Recargar la tabla tras borrar
                    // Si deseas mostrar mensaje de éxito también, descomenta la siguiente línea:
                    // notificacion('Cliente eliminado exitosamente');
                })
                .catch((error) => {
                    // 3. Reemplazamos alert por notificacion, manteniendo tu manejo de errores seguro
                    notificacion(error.response?.data?.error || 'Error al eliminar: ' + error);
                });
        }
    };
   
    render() {
        return (
            <div>
                <div className="col-10 position-absolute top-30 start-50 translate-middle-x">
                    <h1>Datos de Clientes</h1>
                    <button className="btn btn-success" onClick={this.mostrarModalNuevo}>
                        Nuevo registro
                    </button>

                    <input type="text" style={{
                        margin: "20px",
                        marginLeft: "20px",
                        textAlign: "center",
                        width: "20%",
                    }}

                        onKeyPress={this.buscarTexto}
                        placeholder="Ingrese texto a buscar"
                        onChange={this.manejadorBusqueda}></input>

                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">ID</th>
                                <th scope="col">Usuario</th>
                                <th scope="col">correo</th>
                                <th scope="col">telefono</th>
                                <th scope="col">direccion</th>

                            </tr>
                        </thead>
                        <tbody>
                            {this.state.registros.map((value, index) => {
                                //Recorrer los registros
                                return (
                                    <tr key={index}>
                                        <th scope="row">{value.id_cli}</th>
                                        <td>{value.nombre_cli}</td>
                                        <td>{value.email_cli}</td>
                                        <td>{value.telefono_cli}</td>
                                        <td>{value.direccion_cli}</td>
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
                                                onClick={() => this.eliminar(value.id_cli, value.nombre_cli)}
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
                    <button type="button" className="btn btn-primary" onClick={this.paginaAnterior}> anterior </button>
                    <input type="text" readOnly value={this.state.paginaActual + " de " + this.state.totalPaginas} style={{ width: "60px", textAlign: "center" }} />
                    <button type="button" className="btn btn-primary" onClick={this.paginaSiguiente}> siguiente </button>
                </div>

                {this.state.mostrarModal && (
                    <div className="Modal-overlay" style={modalstyle.overlay}>
                        <div className="Modal-content" style={modalstyle.content}>
                            <FormularioCliente
                                clienteAEditar={this.state.clienteSeleccionado}
                                onClose={this.cerrarmodal}
                                onSave={this.alGuardar}
                            />
                        </div>
                    </div>
                )}
            </div>
        );
    }
}
//Estilo para ventana modal
const modalstyle = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
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
        maxHeight: '90vh',
        overflowY: 'auto'
    }
}

function ContenedorNavegacion(props) {
    let navigate = useNavigate();
    return <DatosClientes {...props} navigate={navigate} />;
}
export default ContenedorNavegacion;


