import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@contexts/AuthContext';
import logo from '@assets/images/Logo.jpg';
import perfilIcon from '@assets/images/perfil.png';

const TechnicianNavbar = () => {
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
        <nav>
          <Link to="/tecnico">inicio</Link>
          <Link to="/tecnico/citas-realizadas">citas realizadas</Link>
          <Link to="/tecnico/rutas">rutas</Link>
          <Link to="/tecnico/pagos">pagos</Link>
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

export default TechnicianNavbar;