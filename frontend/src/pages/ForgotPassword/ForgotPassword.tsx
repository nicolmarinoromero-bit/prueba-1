import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@services/api';
import NavbarLanding from '@components/layout/NavbarLanding';
import Footer from '@components/layout/Footer';


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
      setMessage('Código enviado. Redirigiendo...');
      setTimeout(() => navigate(`/verify-code?email=${encodeURIComponent(email)}`), 2000);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error al enviar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavbarLanding />
      <div className="forgot-container">
        <form onSubmit={handleSubmit} className="forgot-form">
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
        </form>
      </div>
      <Footer />
    </>
  );
};

export default ForgotPassword;