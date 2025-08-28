import React from 'react';
import useAutoUpdate from './hooks/useAutoUpdate';
import UpdateNotification from './components/UpdateNotification';

function App() {
  const {
    updateAvailable,
    newVersion,
    forceUpdate,
    dismissUpdate
  } = useAutoUpdate();

  return (
    <div className="App">
      {/* Notificación de actualización */}
      <UpdateNotification
        updateAvailable={updateAvailable}
        newVersion={newVersion}
        onUpdate={forceUpdate}
        onDismiss={dismissUpdate}
      />

      {/* Contenido principal */}
      <div className="container mt-5">
        <div className="text-center">
          <h1 className="display-1 text-primary">¡Hola Mundo!</h1>
          <p className="lead text-muted">Aplicación con notificaciones automáticas</p>
        </div>
      </div>
    </div>
  );
}

export default App;