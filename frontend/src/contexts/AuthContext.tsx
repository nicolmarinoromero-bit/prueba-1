import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import api from '@services/api';
import { LoginResponse, User } from '@types/index';

interface AuthContextType {
  user: User | null;
  rol: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [rol, setRol] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setRol(parsedUser.rol || null);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await api.post<LoginResponse>('/auth/login', { correo: email, contraseña: password });
    const { access_token, rol, nombre } = response.data;
    localStorage.setItem('access_token', access_token);
    const userData: User = {
      id: 0,
      nombre: nombre.split(' ')[0],
      apellido: nombre.split(' ').slice(1).join(' ') || '',
      correo: email,
      rol: rol,
      tipo: rol === 'cliente' ? 'cliente' : 'usuario',
    };
    setUser(userData);
    setRol(rol);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    setUser(null);
    setRol(null);
  };

  return (
    <AuthContext.Provider value={{ user, rol, loading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};