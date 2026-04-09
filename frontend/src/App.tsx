import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@contexts/AuthContext';
import PrivateRoute from '@components/layout/PrivateRoute';
import Home from '@pages/Home/Home';
import Login from '@pages/Login/Login';
import Register from '@pages/Register/Register';
import ForgotPassword from '@pages/ForgotPassword/ForgotPassword';
import VerifyCode from '@pages/VerifyCode/VerifyCode';
import ChangePassword from '@pages/ChangePassword/ChangePassword';
import ClientDashboard from '@pages/ClientDashboard/ClientDashboard';
import AdminDashboard from '@pages/AdminDashboard/AdminDashboard';
import TechnicianDashboard from '@pages/TechnicianDashboard/TechnicianDashboard';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Rutas públicas (sin autenticación) */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-code" element={<VerifyCode />} />

          {/* Rutas protegidas según rol */}
          <Route
            path="/cliente/*"
            element={<PrivateRoute allowedRoles={['cliente']} element={<ClientDashboard />} />}
          />
          <Route
            path="/admin/*"
            element={<PrivateRoute allowedRoles={['administrador']} element={<AdminDashboard />} />}
          />
          <Route
            path="/tecnico/*"
            element={<PrivateRoute allowedRoles={['tecnico']} element={<TechnicianDashboard />} />}
          />
          {/* Ruta protegida para cualquier usuario autenticado (cambiar contraseña) */}
          <Route
            path="/cambiar-password"
            element={<PrivateRoute element={<ChangePassword />} />}
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;