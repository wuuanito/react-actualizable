import { useState, useEffect } from 'react'
import './App.css'
import UpdateNotification from './components/UpdateNotification'
import useAutoUpdate from './hooks/useAutoUpdate'

function App() {
  const [isUpdating, setIsUpdating] = useState(false)
  const [updateProgress, setUpdateProgress] = useState(0)
  const [currentVersion, setCurrentVersion] = useState('1.0.0')

  // Usar el hook de auto-actualización
  const {
    updateAvailable,
    newVersion,
    connectionStatus,
    deploymentHistory,
    lastUpdate,
    forceUpdate,
    dismissUpdate,
    checkForUpdates
  } = useAutoUpdate()

  // Simular proceso de actualización con progreso
  const startUpdate = async () => {
    setIsUpdating(true)
    setUpdateProgress(0)
    
    // Simular progreso de actualización
    const interval = setInterval(() => {
      setUpdateProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUpdating(false)
          // Llamar a la función real de actualización
          forceUpdate()
          return 100
        }
        return prev + 10
      })
    }, 500)
  }

  return (
    <div className="app">
      <div className="container">
        {/* Header */}
        <header className="header">
          <h1 className="title">Aplicación Actualizable</h1>
          <p className="subtitle">Sistema de gestión con actualizaciones automáticas</p>
        </header>

        {/* Main Content */}
        <main className="grid">
          {/* Estado de la Aplicación */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">📊 Estado de la Aplicación</h2>
            </div>
            <div className="card-body">
              <div className="status-list">
                <div className="status-item">
                  <span className="status-label">Versión Actual:</span>
                  <span className="status status-info">{currentVersion}</span>
                </div>
                <div className="status-item">
                  <span className="status-label">Conexión WebSocket:</span>
                  <span className={`status ${
                    connectionStatus === 'connected' ? 'status-success' : 
                    connectionStatus === 'error' ? 'status-error' : 'status-warning'
                  }`}>
                    {connectionStatus === 'connected' ? 'Conectado' : 
                     connectionStatus === 'error' ? 'Error' : 'Desconectado'}
                  </span>
                </div>
                <div className="status-item">
                  <span className="status-label">Última Verificación:</span>
                  <span className="status-label">
                    {lastUpdate ? lastUpdate.toLocaleTimeString() : 'Nunca'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Gestión de Actualizaciones */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">🔄 Gestión de Actualizaciones</h2>
            </div>
            <div className="card-body">
              <div className="form-group">
                <button 
                  className="button button-primary w-full mb-2"
                  onClick={checkForUpdates}
                  disabled={isUpdating}
                >
                  Verificar Actualizaciones
                </button>
                
                {updateAvailable && (
                  <button 
                    className="button button-success w-full"
                    onClick={startUpdate}
                    disabled={isUpdating}
                  >
                    {isUpdating ? 'Actualizando...' : 'Instalar Actualización'}
                  </button>
                )}
              </div>
              
              {isUpdating && (
                <div className="form-group">
                  <label className="label">Progreso de Actualización:</label>
                  <div className="progress">
                    <div 
                      className="progress-bar" 
                      style={{ width: `${updateProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-center mt-2">{updateProgress}%</p>
                </div>
              )}
            </div>
          </div>

          {/* Información del Sistema */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">⚙️ Información del Sistema</h2>
            </div>
            <div className="card-body">
              <div className="status-list">
                <div className="status-item">
                  <span className="status-label">Plataforma:</span>
                  <span className="status status-info">Web</span>
                </div>
                <div className="status-item">
                  <span className="status-label">Navegador:</span>
                  <span className="status-label">{navigator.userAgent.split(' ')[0]}</span>
                </div>
                <div className="status-item">
                  <span className="status-label">Conexión:</span>
                  <span className="status status-success">Estable</span>
                </div>
              </div>
            </div>
          </div>

          {/* Configuración */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">🛠️ Configuración</h2>
            </div>
            <div className="card-body">
              <div className="form-group">
                <label className="label">Actualizaciones Automáticas:</label>
                <button className="button button-secondary w-full mb-2">
                  Habilitado
                </button>
              </div>
              
              <div className="form-group">
                <label className="label">Notificaciones:</label>
                <button className="button button-secondary w-full mb-2">
                  Activadas
                </button>
              </div>
              
              <div className="form-group">
                <label className="label">Canal de Actualizaciones:</label>
                <button className="button button-secondary w-full">
                  Estable
                </button>
              </div>
            </div>
          </div>

          {/* Historial de Actualizaciones */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">📋 Historial de Actualizaciones</h2>
            </div>
            <div className="card-body">
              <div className="update-history">
                <div className="update-item mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-weight-600">v1.0.0</span>
                    <span className="status status-success">Instalada</span>
                  </div>
                  <p className="text-sm text-gray-600">Versión inicial de la aplicación</p>
                  <p className="text-xs text-gray-500 mt-1">Instalada: Hoy</p>
                </div>
              </div>
            </div>
          </div>

          {/* Acciones Rápidas */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">⚡ Acciones Rápidas</h2>
            </div>
            <div className="card-body">
              <div className="button-list">
                <button className="button button-primary mb-2">
                  🔄 Reiniciar Aplicación
                </button>
                <button className="button button-secondary mb-2">
                  🧹 Limpiar Caché
                </button>
                <button className="button button-secondary mb-2">
                  📊 Ver Logs
                </button>
                <button className="button button-danger">
                  🔧 Restablecer Configuración
                </button>
              </div>
            </div>
          </div>
        </main>

        {/* Componente de Notificación de Actualización */}
        <UpdateNotification 
          isVisible={updateAvailable && !isUpdating}
          message={newVersion}
          onUpdate={startUpdate}
          onDismiss={dismissUpdate}
        />
      </div>
    </div>
  )
}

export default App