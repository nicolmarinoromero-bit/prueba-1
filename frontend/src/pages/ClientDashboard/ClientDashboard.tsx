import { useAuth } from '@contexts/AuthContext';
import Navbar from '@components/layout/Navbar';
import Footer from '@components/layout/Footer';

const ClientDashboard = () => {
  const { user } = useAuth();
  return (
    <>
      <Navbar />
      <div className="dashboard">
        <h1>Panel de Cliente</h1>
        <p>Bienvenido, {user?.nombre} {user?.apellido}</p>
      </div>
      <Footer />
    </>
  );
};

export default ClientDashboard;