import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Verificar si hay datos de usuario guardados al cargar la app
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('accessToken');
    
    if (savedUser && savedToken) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error al parsear datos del usuario:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
      }
    }
    setLoading(false);
  }, []);

  const login = async (usuario, password) => {
    try {
      // Usar proxy local para evitar ERR_UNSAFE_PORT
      const apiUrl = '/api/auth/v1/login';
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ usuario, password }),
        mode: 'cors',
      });

      if (!response.ok) {
        throw new Error('Credenciales inválidas');
      }

      const data = await response.json();
      
      // Extraer datos importantes del usuario
      const userData = {
        id: data.user._id,
        usuario: data.user.usuario,
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        email: data.user.email,
        departamento: data.user.departamento,
        rol: data.user.rol,
        isActive: data.user.isActive,
        isEmailVerified: data.user.isEmailVerified
      };

      // Guardar en localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('session', JSON.stringify(data.session));

      // Actualizar estado
      setUser(userData);
      setIsAuthenticated(true);

      return { success: true, data };
    } catch (error) {
      console.error('Error en login:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    // Limpiar localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('session');
    
    // Limpiar estado
    setUser(null);
    setIsAuthenticated(false);
  };

  const getToken = () => {
    return localStorage.getItem('accessToken');
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    getToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;