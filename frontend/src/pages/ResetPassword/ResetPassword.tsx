import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '@services/api';
import NavbarLanding from '@components/layout/NavbarLanding';
import Footer from '@components/layout/Footer';
import '../../styles/login.css';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) setError('Token no válido');
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    setLoading(true);
    try {
      await api.post('/auth/reset-password', { token, new_password: newPassword });
      setMessage('Contraseña actualizada correctamente. Redirigiendo al login...');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error al restablecer la contraseña');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <>
        <NavbarLanding />
        <div className="reset-container">
          <div className="error">Token inválido o expirado</div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <NavbarLanding />
      <div className="reset-container">
        <form onSubmit={handleSubmit} className="reset-form">
          <h2>Nueva contraseña</h2>
          {message && <div className="success">{message}</div>}
          {error && <div className="error">{error}</div>}
          <input
            type="password"
            placeholder="Nueva contraseña"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Confirmar contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={loading}
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Actualizando...' : 'Restablecer'}
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default ResetPassword;