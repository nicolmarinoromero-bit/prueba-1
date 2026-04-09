import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@contexts/AuthContext';
import logo from '@assets/images/Logo.jpg';

const Navbar = () => {
  const { rol, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header>
      <div className="navbar-auth">
        <div className="logo">
          <Link to="/">
            <img src={logo} alt="Logo Neodomus" />
          </Link>
        </div>
        <ul className="menu">
          {rol === 'cliente' && (
            <>
              <li><Link to="/cliente">Panel</Link></li>
              <li><Link to="/productos">Productos</Link></li>
              <li><Link to="/tecnicos">Técnicos</Link></li>
            </>
          )}
          {rol === 'administrador' && (
            <>
              <li><Link to="/admin">Panel</Link></li>
              <li><Link to="/users">Usuarios</Link></li>
              <li><Link to="/clients">Clientes</Link></li>
            </>
          )}
          {(rol === 'tecnico de instalador' || rol === 'tecnico de soporte' || rol === 'analista qa' || rol === 'desarrollador backend' || rol === 'coordinador de proyectos') && (
            <>
              <li><Link to="/tecnico">Panel</Link></li>
              <li><Link to="/rutas">Mis Rutas</Link></li>
              <li><Link to="/novedades">Novedades</Link></li>
            </>
          )}
          <li><Link to="/cambiar-password">Cambiar contraseña</Link></li>
        </ul>
        <div className="sobre">
          <Link to="/sobre">Sobre nosotros</Link>
        </div>
        <button className="btn-logout" onClick={handleLogout}>Cerrar sesión</button>
      </div>
    </header>
  );
};

export default Navbar;