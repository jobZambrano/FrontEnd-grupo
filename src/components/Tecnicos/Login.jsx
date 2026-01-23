import React from "react";
import "../../css/Login.css";
import { API_URL } from "../../services/apirest";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

class Login extends React.Component {
    state = {
        form: {
            usuario_tec: "",
            contrasenia_tec: ""
        },
        error: "",
        errorMsg: ""
    };

    manejadorOnChange = async e => {
        this.setState({
            form: {
                ...this.state.form,
                [e.target.name]: e.target.value
            }
        });
        console.log(this.state.form);

    }
    manejadorLogin = () => {
        let url = API_URL + "auth/Login";
        axios
            .post(url, this.state.form)
            .then((response) => {
                if (response.data.message === "Logueo exitoso ") {
                    localStorage.setItem("token", response.data.token)
                    this.props.navigate("/dashboard");
                } else {
                    this.setState({
                        error: true,
                        errorMsg: response.data.message || "Usuario o contraseña incorrectos"
                    });
                }
            })
            .catch((error) => {
                if (error.response) {
                    this.setState({
                        error: true,
                        errorMsg: error.response.data.message,
                    });
                } else {
                    this.setState({
                        error: true,
                        errorMsg: "Error de conexion con el servidor",
                    });
                }
            });
    };
    render() {
        return (
            <React.Fragment>
                <section className="vh-100">
                    <div className="container-fluid h-custom">
                        <div className="row d-flex justify-content-center align-items-center h-100">
                            <div className="col-md-9 col-lg-6 col-xl-5">
                                <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
                                    className="img-fluid" alt="Imagen de ejemplo" />
                            </div>
                            <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
                                <form>
                                    <div className="d-flex flex-row align-items-center justify-content-center justify-content-lg-start">
                                        <p className="lead fw-normal mb-0 me-3">Iniciar sesión con</p>
                                        <button type="button" className="btn btn-primary btn-floating mx-1">
                                            <i className="fab fa-facebook-f"></i>
                                        </button>

                                        <button type="button" className="btn btn-primary btn-floating mx-1">
                                            <i className="fab fa-twitter"></i>
                                        </button>

                                        <button type="button" className="btn btn-primary btn-floating mx-1">
                                            <i className="fab fa-linkedin-in"></i>
                                        </button>
                                    </div>

                                    <div className="divider d-flex align-items-center my-4">
                                        <p className="text-center fw-bold mx-3 mb-0">O</p>
                                    </div>


                                    <div className="form-outline mb-4">
                                        <input type="text" id="form3Example3" className="form-control form-control-lg" name="usuario_tec"
                                            placeholder="Ingresa el usuario" onChange={this.manejadorOnChange} />
                                        <label className="form-label" htmlFor="form3Example3">Usuario</label>
                                    </div>


                                    <div className="form-outline mb-3">
                                        <input type="password" id="form3Example4" className="form-control form-control-lg" name="contrasenia_tec"
                                            placeholder="Ingresa tu contraseña" onChange={this.manejadorOnChange} />
                                        <label className="form-label" htmlFor="form3Example4">Contraseña</label>
                                    </div>

                                    <div className="d-flex justify-content-between align-items-center">

                                        <div className="form-check mb-0">
                                            <input className="form-check-input me-2" type="checkbox" value="" id="form2Example3" />
                                            <label className="form-check-label" htmlFor="form2Example3">
                                                Recordarme
                                            </label>
                                        </div>
                                        <a href="#!" className="text-body">¿Olvidaste tu contraseña?</a>
                                    </div>

                                    <div className="text-center text-lg-start mt-4 pt-2">
                                        <button type="button" className="btn btn-primary btn-lg" onClick={this.manejadorLogin}> Iniciar Sesión</button>
                                        <p className="small fw-bold mt-2 pt-1 mb-0">
                                            ¿No tienes una cuenta? <a href="#!" className="link-danger">Regístrate</a>
                                        </p>
                                    </div>
                                </form>
                                {this.state.error === true && (
                                    <div className="alert alert-danger" role="alert">
                                        {this.state.errorMsg}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>


                    <div className="d-flex flex-column flex-md-row text-center text-md-start justify-content-between py-4 px-4 px-xl-5 bg-primary">

                        <div className="text-white mb-3 mb-md-0">
                            Derechos de autor © 2020. Todos los derechos reservados.
                        </div>



                        <div>
                            <a href="#!" className="text-white me-4">
                                <i className="fab fa-facebook-f"></i>
                            </a>
                            <a href="#!" className="text-white me-4">
                                <i className="fab fa-twitter"></i>
                            </a>
                            <a href="#!" className="text-white me-4">
                                <i className="fab fa-google"></i>
                            </a>
                            <a href="#!" className="text-white">
                                <i className="fab fa-linkedin-in"></i>
                            </a>
                        </div>
                    </div>
                </section>
            </React.Fragment>
        );
    };
}
function ContenedorNavegacion(props) {
    const navigate = useNavigate();
    return <Login {...props} navigate={navigate} />;
}

export default ContenedorNavegacion;