import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

function Header() {
    return (
        <div style={{ padding: "10px" }}>
            <center>
                <Link to="/datosTecnicos" style={{ textDecoration: 'none' }}>
  <Button variant="primary" size="lg" style={{ marginRight: "10px" }}>Tecnico</Button>
</Link>
<Link to="/datosClientes" style={{ textDecoration: 'none' }}>
  <Button variant="success" size="lg" style={{ marginRight: "10px" }}>Cliente</Button>
</Link>
<Link to="/datosEquipos" style={{ textDecoration: 'none' }}>
  <Button variant="warning" size="lg" style={{ marginRight: "10px" }}>Equipo</Button>
</Link>
<Link to="/datosServicios" style={{ textDecoration: 'none' }}>
  <Button variant="danger" size="lg" style={{ marginRight: "10px" }}>Servicio</Button>
</Link>
           </center>
        </div>
    )
}

export default Header