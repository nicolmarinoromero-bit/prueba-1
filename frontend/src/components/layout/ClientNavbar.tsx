import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@contexts/AuthContext';
import logo from '@assets/images/Logo.jpg';
import helpIcon from '@assets/images/Icono.png';
import perfilIcon from '@assets/images/perfil.png';  // importa la imagen
import '../../styles/navbarc.css';

const ClientNavbar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header>
      <div className="navbar">
        <div className="logo">
          <Link to="/">
            <img src={logo} alt="Logo Neodomus" />
          </Link>
        </div>
        <nav className="menu">
          <Link to="/cliente/productos">Productos</Link>
          <Link to="/cliente/tecnicos">Técnicos</Link>
          <Link to="/cliente/citas">Citas</Link>
          <Link to="/cliente/agendar-cita">Agendar Cita</Link>
          <Link to="/cliente/mis-compras">Mis Compras</Link>
          <Link to="/cliente/ayuda" className="icon-link">
            Ayuda <img src={helpIcon} alt="ayuda" />
          </Link>
        </nav>
        <div className="nav-right">
          <Link to="/perfil" className="perfil-link">
            <span>Mi perfil</span>
            <img src={perfilIcon} alt="perfil" />
          </Link>
          <button onClick={handleLogout} className="btn-logout">Cerrar sesión</button>
        </div>
      </div>
    </header>
  );
};

export default ClientNavbar;