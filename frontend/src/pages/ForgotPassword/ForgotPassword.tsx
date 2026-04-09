import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@services/api';
import NavbarLanding from '@components/layout/NavbarLanding';
import Footer from '@components/layout/Footer';
import '../../styles/login.css';
import fondoImg from '../../assets/images/Fondo2.png';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    try {
      await api.post('/auth/forgot-password', { email });
      console.log('Código enviado, redirigiendo a verify-code');
      navigate(`/verify-code?email=${encodeURIComponent(email)}`);
    } catch (err: any) {
      console.error('Error al enviar:', err);
      setError(err.response?.data?.detail || 'Error al enviar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavbarLanding />
      <div className="login-container">
        <img src={fondoImg} alt="fondo" style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', top: 0, left: 0, zIndex: -1 }} />
        <form onSubmit={handleSubmit} className="login-form">
          <h2>Recuperar contraseña</h2>
          {message && <div className="success">{message}</div>}
          {error && <div className="error">{error}</div>}
          <input
            type="email"
            placeholder="Tu correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar código'}
          </button>
          <div className="links single-link">
            <a href="/login">Volver al inicio de sesión</a>
          </div>
        </form>
      </div>
      <Footer compact={true} />
    </>
  );
};

export default ForgotPassword;