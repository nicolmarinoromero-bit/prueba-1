import { Link } from 'react-router-dom';
import logo from '@assets/images/Logo.jpg';
import helpIcon from '@assets/images/Icono.png';

const NavbarLanding = () => {
  return (
    <header>
      <div className="navbar">
        <div className="logo">
          <Link to="/">
            <img src={logo} alt="logo" />
          </Link>
        </div>
        <nav>
          <a href="#">Productos</a>
          <Link to="/sobre">Sobre nosotros</Link>
          <a href="#" className="help-link">
            Ayuda <img src={helpIcon} alt="ayuda" />
          </a>
        </nav>
        <div className="nav-right">
          <Link to="/register">Registrarse</Link>
          <Link to="/login">Iniciar sesión</Link>
        </div>
      </div>
    </header>
  );
};

export default NavbarLanding;