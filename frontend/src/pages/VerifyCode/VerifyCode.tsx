import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '@services/api';
import NavbarLanding from '@components/layout/NavbarLanding';
import Footer from '@components/layout/Footer';
import '../../styles/login.css';
import fondoImg from '../../assets/images/Fondo2.png';

const VerifyCode = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  const navigate = useNavigate();
  const [codeDigits, setCodeDigits] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [step, setStep] = useState<'code' | 'password'>('code');
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!email) {
      navigate('/forgot-password');
    }
  }, [email, navigate]);

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newDigits = [...codeDigits];
    newDigits[index] = value;
    setCodeDigits(newDigits);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !codeDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = codeDigits.join('');
    if (code.length !== 6) {
      setError('Ingresa el código de 6 dígitos');
      return;
    }
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
    const code = codeDigits.join('');
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
      <div className="login-container">
        <img src={fondoImg} alt="fondo" style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', top: 0, left: 0, zIndex: -1 }} />
        {step === 'code' ? (
          <form onSubmit={handleVerifyCode} className="login-form">
            <h2>Código de seguridad</h2>
            {message && <div className="success">{message}</div>}
            {error && <div className="error">{error}</div>}
            <div className="otp-container">
              {codeDigits.map((digit, idx) => (
                <input
                  key={idx}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  ref={(el) => (inputRefs.current[idx] = el)}
                  className="otp-input"
                  disabled={loading}
                />
              ))}
            </div>
            <button type="submit" disabled={loading}>
              {loading ? 'Verificando...' : 'Verificar'}
            </button>
            <div className="links single-link">
              <a href="/login">Volver al inicio de sesión</a>
            </div>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="login-form">
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
            <div className="links single-link">
              <a href="/login">Volver al inicio de sesión</a>
            </div>
          </form>
        )}
      </div>
      <Footer compact={true} />
    </>
  );
};

export default VerifyCode;