import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import Navbar from './components/Navbar';
import Departamentos from './components/Departamentos';
import { useAuth } from './contexts/AuthContext';
import Login from './components/Login';

function App() {
  const { isAuthenticated, loading, user } = useAuth();
  const [currentSection, setCurrentSection] = useState('inicio');

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  // Si no está autenticado, mostrar página de login
  if (!isAuthenticated) {
    return <Login />;
  }

  const renderContent = () => {
    switch (currentSection) {
      case 'departamentos':
        return <Departamentos />;
      case 'captura':
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Captura de Datos
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Módulo de captura de datos en desarrollo...
            </Typography>
          </Box>
        );
      case 'configuracion':
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Configuración
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Módulo de configuración en desarrollo...
            </Typography>
          </Box>
        );
      case 'inicio':
      default:
        return <SimpleExample user={user} />;
    }
  };

  // Si está autenticado, mostrar la aplicación principal
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Navbar currentSection={currentSection} onSectionChange={setCurrentSection} />
      {renderContent()}
    </Box>
  );
}

// Componente de ejemplo simple
function SimpleExample({ user }) {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        ¡Bienvenido, {user?.firstName || user?.usuario}!
      </Typography>
      <Typography variant="h6" color="text.secondary" gutterBottom>
        Departamento: {user?.departamento}
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Rol: {user?.rol}
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Email: {user?.email}
      </Typography>
      
      <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
        Ejemplo Simple
      </Typography>
      
      <Box 
        sx={{
          maxWidth: 600,
          width: '100%',
          display: 'flex',
          gap: '20px',
          mt: 3,
          mx: 'auto',
          padding: 2
        }}
      >
        {/* Elemento 1 */}
        <Box
          sx={{
            width: 180,
            height: 180,
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#3b82f6',
            color: 'white',
            fontSize: '24px',
            fontWeight: 'bold'
          }}
        >
          <Typography variant="h4" component="div" sx={{ fontSize: 'inherit', color: 'inherit' }}>
            Elemento 1
          </Typography>
        </Box>

        {/* Elemento 2 */}
        <Box
          sx={{
            width: 180,
            height: 180,
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#ef4444',
            color: 'white',
            fontSize: '24px',
            fontWeight: 'bold'
          }}
        >
          <Typography variant="h4" component="div" sx={{ fontSize: 'inherit', color: 'inherit' }}>
            Elemento 2
          </Typography>
        </Box>

        {/* Elemento 3 */}
        <Box
          sx={{
            width: 180,
            height: 180,
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#10b981',
            color: 'white',
            fontSize: '24px',
            fontWeight: 'bold'
          }}
        >
          <Typography variant="h4" component="div" sx={{ fontSize: 'inherit', color: 'inherit' }}>
            Elemento 3
          </Typography>
        </Box>
      </Box>
      
      <Box sx={{ mt: 3, p: 2, borderRadius: 2, backgroundColor: 'action.hover', textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          ✨ Ejemplo simple sin funcionalidad de arrastre
        </Typography>
      </Box>
    </Box>
  );
}

export default App