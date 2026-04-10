import { useState } from 'react';
import { useAuth } from '@contexts/AuthContext';
import api from '@services/api';
import Navbar from '@components/layout/NavbarLanding';
import Footer from '@components/layout/Footer';

const ChangePassword = () => {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const validatePassword = (pwd: string): string | null => {
    if (pwd.length < 8) return 'La contraseña debe tener al menos 8 caracteres.';
    if (!/[A-Z]/.test(pwd)) return 'La contraseña debe contener al menos una letra mayúscula.';
    if (!/[a-z]/.test(pwd)) return 'La contraseña debe contener al menos una letra minúscula.';
    if (!/[0-9]/.test(pwd)) return 'La contraseña debe contener al menos un número.';
    if (!/[!#$%&?@.]/.test(pwd)) return 'La contraseña debe contener al menos un símbolo especial (# $ . @ ! % & ?).';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Las nuevas contraseñas no coinciden');
      return;
    }

    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    try {
      await api.post('/auth/change-password', {
        current_password: currentPassword,
        new_password: newPassword,
      });
      setMessage('Contraseña actualizada correctamente');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error al cambiar contraseña');
    }
  };

  return (
    <>
      <Navbar />
      <div className="change-password-container">
        <form onSubmit={handleSubmit} className="change-password-form">
          <h2>Cambiar contraseña</h2>
          {message && <div className="success">{message}</div>}
          {error && <div className="error">{error}</div>}
          <input
            type="password"
            placeholder="Contraseña actual"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Nueva contraseña"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirmar nueva contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit">Actualizar</button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default ChangePassword;