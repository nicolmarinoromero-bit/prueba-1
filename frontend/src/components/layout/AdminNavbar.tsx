import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@contexts/AuthContext';
import logo from '@assets/images/Logo.jpg';
import perfilImg from '@assets/images/perfil.png';

const AdminNavbar = () => {
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
            <img src={logo} alt="logo" />
          </Link>
        </div>
        <nav>
          <Link to="/admin">inicio</Link>
          <Link to="/ventas">ventas</Link>
          <Link to="/inventario">inventario</Link>
          <Link to="/pagos">pagos</Link>
        </nav>
        <div className="nav-right">
          <Link to="/perfil" className="perfil-link">
            <span>Mi perfil</span>
            <img src={perfilImg} alt="perfil" className="perfil-avatar" />
          </Link>
          <button onClick={handleLogout} className="btn-logout">Cerrar sesión</button>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;