import { Link } from 'react-router-dom';
import AdminNavbar from '@components/layout/AdminNavbar';
import Footer from '@components/layout/Footer';
import '../../styles/dashboard-admin.css';
import carritoIcon from '@assets/images/carrito.png';
import ideaIcon from '@assets/images/idea.png';
import herramientasIcon from '@assets/images/herramientas.png';
import horarioIcon from '@assets/images/horario.png';
import perfilIcon from '@assets/images/perfil.png';
import tecnico1Img from '@assets/images/tecnico1.png';
import tecnico2Img from '@assets/images/tecnico2.png';
import fondo2 from '@assets/images/Fondo2.png';

const AdminDashboard = () => {
  return (
    <>
      <AdminNavbar />
      <section className="admin-container" style={{ backgroundImage: `url(${fondo2})` }}>
        <h1>Bienvenido Administrador</h1>
        <div className="grid-top">
          <div className="card">
            <Link to="/ventas" className="btn-arrow">➜</Link>
            <div className="card-content">
              <div className="card-img-box">
                <img src={carritoIcon} alt="ventas" />
              </div>
              <div className="card-text">
                <h3>Ventas del día</h3>
                <p className="big">$ 15.000.000</p>
                <span>✔ Total de 8 ventas</span>
              </div>
            </div>
          </div>
          <div className="card">
            <Link to="/productos" className="btn-arrow">➜</Link>
            <div className="card-content">
              <div className="card-img-box">
                <img src={ideaIcon} alt="productos" />
              </div>
              <div className="card-text">
                <h3>Productos activos</h3>
                <p className="big">24</p>
                <span>Productos en catálogo</span>
              </div>
            </div>
          </div>
          <div className="card">
            <Link to="/agendamientos" className="btn-arrow">➜</Link>
            <div className="card-content">
              <div className="card-img-box">
                <img src={horarioIcon} alt="agendamientos" />
              </div>
              <div className="card-text">
                <h3>Agendamientos</h3>
                <p className="big">5</p>
                <span>Citas agendadas</span>
              </div>
            </div>
          </div>
          <div className="card">
            <Link to="/tecnicos" className="btn-arrow">➜</Link>
            <div className="card-content">
              <div className="card-img-box">
                <img src={herramientasIcon} alt="técnicos" />
              </div>
              <div className="card-text">
                <h3>Técnicos</h3>
                <p className="big">25</p>
                <span>Técnicos activados</span>
              </div>
            </div>
          </div>
        </div>
        <div className="inventario">
          <h2>Inventario</h2>
          <div className="grid-inv">
            <div className="inv-card">
              124 Productos totales
              <Link to="/inventario" className="btn-arrow-inv">➜</Link>
            </div>
            <div className="inv-card">
              35 Productos en stock
              <Link to="/inventario" className="btn-arrow-inv">➜</Link>
            </div>
            <div className="inv-card">
              3 Productos bajo stock
              <Link to="/inventario" className="btn-arrow-inv">➜</Link>
            </div>
          </div>
        </div>
        <aside className="side">
          <h2>Técnicos disponibles</h2>
          <div className="tech">
            <img src={tecnico1Img} alt="técnico" />
            <div>
              <h4>MARIA PEREZ</h4>
              <span>instalación</span>
            </div>
            <Link to="/tecnico/1" className="btn-ver">ver</Link>
          </div>
          <div className="tech">
            <img src={tecnico2Img} alt="técnico" />
            <div>
              <h4>JOSE GONZALES</h4>
              <span>mantenimiento</span>
            </div>
            <Link to="/tecnico/2" className="btn-ver">ver</Link>
          </div>
          <h2>Próximas citas agendadas</h2>
          <div className="citas-linea">
            <div className="cita-linea">
              <span className="hora">4:00 PM</span>
              <span>Instalación</span>
              <span>Adriana Torres</span>
              <span>Calle 123 #45-67</span>
              <span>3001234567</span>
            </div>
            <div className="cita-linea">
              <span className="hora">11:00 PM</span>
              <span>Mantenimiento</span>
              <span>Alejandro Lopez</span>
              <span>Carrera 50 #20-10</span>
              <span>3109876543</span>
            </div>
          </div>
          <Link to="/citas" className="ver-mas">ver mas citas ➜</Link>
        </aside>
      </section>
      <Footer />
    </>
  );
};

export default AdminDashboard;