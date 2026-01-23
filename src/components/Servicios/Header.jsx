import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

function Header() {
    return (
        <div style={{ padding: "10px" }}>
            <center>
            <Link to="/datosTecnicos"><Button style={{ marginRight: "10px" }}>Tecnico</Button></Link>
            <Link to="/datosusuarios"> <Button style={{ marginRight: "10px" }}>Cliente</Button></Link>
            <Link to="/datospelicular"><Button style={{ marginRight: "10px" }}>Equipo</Button></Link>
            <Link to="/datospelicular"> <Button style={{ marginRight: "10px" }}>Servicio</Button></Link>
            </center>
        </div>
    )
}

export default Header