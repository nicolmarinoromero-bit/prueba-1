import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@contexts/AuthContext';
import Navbar from '@components/layout/Navbar';
import Footer from '@components/layout/Footer';
import '../../styles/login.css';
import fondoImg from '../../assets/images/Fondo2.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      // Obtener el usuario del localStorage (guardado por AuthContext)
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        const rol = user.rol;
        console.log('Rol del usuario:', rol); // Para depuración
        // Redirigir según el rol
        if (rol === 'administrador') {
          navigate('/admin');
        } else if (rol === 'cliente') {
          navigate('/cliente');
        } else if (rol === 'tecnico') {
          navigate('/tecnico');
        } else {
          navigate('/'); // fallback
        }
      } else {
        navigate('/');
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error al iniciar sesión');
    }
  };

  return (
    <>
      <Navbar />
      <div className="login-container" style={{ backgroundImage: `url(${fondoImg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <form onSubmit={handleSubmit} className="login-form">
          <h2>Iniciar sesión</h2>
          {error && <div className="error">{error}</div>}
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Ingresar</button>
          <div className="links">
            <Link to="/forgot-password">¿Olvidaste tu contraseña?</Link>
            <Link to="/register">Registrarse</Link>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default Login;