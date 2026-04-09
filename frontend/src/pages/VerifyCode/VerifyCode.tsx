import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '@services/api';
import NavbarLanding from '@components/layout/NavbarLanding';
import Footer from '@components/layout/Footer';
import '../../styles/verify.css';

const VerifyCode = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [step, setStep] = useState<'code' | 'password'>('code');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!email) {
      navigate('/forgot-password');
    }
  }, [email, navigate]);

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/verify-code', { email, code });
      setMessage('Código correcto. Ahora ingresa tu nueva contraseña.');
      setStep('password');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Código inválido');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    setLoading(true);
    try {
      await api.post('/auth/reset-password', { email, code, new_password: newPassword });
      setMessage('Contraseña actualizada. Redirigiendo al login...');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error al restablecer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavbarLanding />
      <div className="verify-container">
        {step === 'code' ? (
          <form onSubmit={handleVerifyCode} className="verify-form">
            <h2>Verificar código</h2>
            {message && <div className="success">{message}</div>}
            {error && <div className="error">{error}</div>}
            <input
              type="text"
              placeholder="Código de 6 dígitos"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              disabled={loading}
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Verificando...' : 'Verificar'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="reset-form">
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
        )}
      </div>
      <Footer />
    </>
  );
};

export default VerifyCode;