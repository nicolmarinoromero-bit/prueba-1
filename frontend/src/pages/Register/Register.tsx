import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '@services/api';
import NavbarLanding from '@components/layout/NavbarLanding';
import Footer from '@components/layout/Footer';
import '../../styles/register.css';
import FondImg from '../../assets/images/Fondo2.png';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    tipo_documento: 1,
    documento: '',
    telefono: '',
    correo: '',
    direccion: '',
    contraseña: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await api.post('/auth/register/cliente', {
        nombre: formData.nombre,
        apellido: formData.apellido,
        tipo_documento: parseInt(formData.tipo_documento as any),
        documento: parseInt(formData.documento),
        telefono: parseInt(formData.telefono),
        correo: formData.correo,
        direccion: formData.direccion,
        contraseña: formData.contraseña,
      });
      setSuccess('Registro exitoso. Redirigiendo al login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error al registrarse');
    }
  };

  return (
    <>
      <NavbarLanding />
      <div 
        className="register-container" 
        style={{ backgroundImage: `url(${FondImg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <form onSubmit={handleSubmit} className="register-form">
          <h2>Registrarse</h2>
          {error && <div className="error">{error}</div>}
          {success && <div className="success">{success}</div>}
          <div className="form-grid">
            <input name="nombre" placeholder="Nombre" onChange={handleChange} required />
            <input name="apellido" placeholder="Apellido" onChange={handleChange} required />
            <select name="tipo_documento" onChange={handleChange}>
              <option value="1">CC</option>
              <option value="2">CE</option>
            </select>
            <input name="documento" placeholder="Documento" onChange={handleChange} required />
            <input name="telefono" placeholder="Teléfono" onChange={handleChange} required />
            <input name="correo" type="email" placeholder="Correo" onChange={handleChange} required />
            <input name="direccion" placeholder="Dirección" onChange={handleChange} required />
            <input name="contraseña" type="password" placeholder="Contraseña" onChange={handleChange} required />
          </div>
          <button type="submit">Continuar</button>
          <div className="links">
            <Link to="/login">Ya tengo cuenta</Link>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default Register;3