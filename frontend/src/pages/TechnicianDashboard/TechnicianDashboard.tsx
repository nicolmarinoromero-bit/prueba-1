import { useAuth } from '@contexts/AuthContext';
import Navbar from '@components/layout/Navbar';
import Footer from '@components/layout/Footer';

const TechnicianDashboard = () => {
  const { user } = useAuth();
  return (
    <>
      <Navbar />
      <div className="dashboard">
        <h1>Panel de Técnico</h1>
        <p>Bienvenido, {user?.nombre}</p>
        <p>Rol: {user?.rol}</p>
      </div>
      <Footer />
    </>
  );
};

export default TechnicianDashboard;