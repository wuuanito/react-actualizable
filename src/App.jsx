import React, { useState } from 'react';
import useAutoUpdate from './hooks/useAutoUpdate';
import UpdateNotification from './components/UpdateNotification';

function App() {
  const {
    updateAvailable,
    newVersion,
    connectionStatus,
    deploymentHistory,
    lastUpdate,
    forceUpdate,
    dismissUpdate,
    checkForUpdates
  } = useAutoUpdate();

  const [currentTab, setCurrentTab] = useState('home');

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString('es-ES');
  };

  const getConnectionBadge = () => {
    const configs = {
      connected: { color: 'success', icon: 'bi-wifi', text: 'Conectado' },
      disconnected: { color: 'warning', icon: 'bi-wifi-off', text: 'Desconectado' },
      error: { color: 'danger', icon: 'bi-exclamation-triangle', text: 'Error' }
    };
    return configs[connectionStatus] || { color: 'secondary', icon: 'bi-hourglass', text: 'Conectando...' };
  };

  const connectionBadge = getConnectionBadge();

  return (
    <div className="App">
      {/* Notificación de actualización */}
      <UpdateNotification
        updateAvailable={updateAvailable}
        newVersion={newVersion}
        onUpdate={forceUpdate}
        onDismiss={dismissUpdate}
      />

      {/* Navbar mejorada */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow">
        <div className="container">
          <a className="navbar-brand d-flex align-items-center" href="#home">
            <i className="bi bi-rocket me-2 fs-4"></i>
            <span>Mi SI? con Auto-Updates</span>
            <small className="ms-2 opacity-75">v2.0 con Vite</small>
          </a>
          
          <div className="navbar-nav ms-auto">
            <div className="nav-item dropdown">
              <button className="nav-link dropdown-toggle btn btn-link text-white" data-bs-toggle="dropdown">
                <span className={`badge bg-${connectionBadge.color} me-1`}>
                  <i className={`bi ${connectionBadge.icon}`}></i>
                </span>
                {connectionBadge.text}
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <button className="dropdown-item" onClick={checkForUpdates}>
                    <i className="bi bi-arrow-clockwise me-2"></i>
                    Verificar actualizaciones
                  </button>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <span className="dropdown-item-text small">
                    WebSocket: {import.meta.env.VITE_WEBSOCKET_URL}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>

      {/* Pestañas */}
      <div className="container mt-3">
        <ul className="nav nav-pills nav-fill">
          <li className="nav-item">
            <button
              className={`nav-link ${currentTab === 'home' ? 'active' : ''}`}
              onClick={() => setCurrentTab('home')}
            >
              <i className="bi bi-house me-2"></i>Inicio
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${currentTab === 'deployments' ? 'active' : ''}`}
              onClick={() => setCurrentTab('deployments')}
            >
              <i className="bi bi-clock-history me-2"></i>
              Deployments
              {deploymentHistory.length > 0 && (
                <span className="badge bg-secondary ms-1">{deploymentHistory.length}</span>
              )}
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${currentTab === 'test' ? 'active' : ''}`}
              onClick={() => setCurrentTab('test')}
            >
              <i className="bi bi-tools me-2"></i>Pruebas
            </button>
          </li>
        </ul>
      </div>

      {/* Contenido principal */}
      <div className="container mt-4">
        {currentTab === 'home' && (
          <div className="row">
            <div className="col-lg-8">
              <div className="card border-0 shadow">
                <div className="card-body p-4">
                  <h1 className="card-title display-6">
                    <i className="bi bi-house me-3 text-primary"></i>
                    Bienvenido a la App con Auto-Updates
                  </h1>
                  <p className="card-text lead text-muted">
                    Esta aplicación construida con <strong>Vite + React</strong> se actualiza automáticamente cuando Jenkins hace un deploy.
                  </p>
                  <hr />
                  <h5 className="mb-3">
                    <i className="bi bi-gear me-2 text-success"></i>
                    ¿Cómo funciona?
                  </h5>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="d-flex mb-3">
                        <div className="badge bg-primary rounded-pill me-3" style={{ width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>1</div>
                        <div>
                          <h6 className="mb-1">Push al repositorio</h6>
                          <small className="text-muted">Jenkins detecta cambios automáticamente</small>
                        </div>
                      </div>
                      <div className="d-flex mb-3">
                        <div className="badge bg-primary rounded-pill me-3" style={{ width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>2</div>
                        <div>
                          <h6 className="mb-1">Build y Deploy</h6>
                          <small className="text-muted">Construcción con Vite y despliegue</small>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="d-flex mb-3">
                        <div className="badge bg-primary rounded-pill me-3" style={{ width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>3</div>
                        <div>
                          <h6 className="mb-1">Notificación WebSocket</h6>
                          <small className="text-muted">Todos los clientes reciben la notificación</small>
                        </div>
                      </div>
                      <div className="d-flex mb-3">
                        <div className="badge bg-success rounded-pill me-3" style={{ width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>4</div>
                        <div>
                          <h6 className="mb-1">Auto-actualización</h6>
                          <small className="text-muted">Actualización inmediata opcional</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="card border-0 shadow">
                <div className="card-body">
                  <h5 className="card-title">
                    <i className="bi bi-info-circle me-2 text-info"></i>
                    Estado del Sistema
                  </h5>
                  <div className={`alert alert-${connectionBadge.color} border-0`}>
                    <i className={`bi ${connectionBadge.icon} me-2`}></i>
                    <strong>{connectionBadge.text}</strong>
                    {connectionStatus === 'connected' && (
                      <div className="small mt-1">
                        ✅ Recibiendo actualizaciones en tiempo real
                      </div>
                    )}
                  </div>
                  {lastUpdate && (
                    <div className="small text-muted">
                      <i className="bi bi-clock me-1"></i>
                      Última actualización: {lastUpdate.toLocaleTimeString()}
                    </div>
                  )}
                  <hr />
                  <div className="d-grid">
                    <button 
                      className="btn btn-outline-primary btn-sm"
                      onClick={checkForUpdates}
                    >
                      <i className="bi bi-arrow-clockwise me-1"></i>
                      Verificar actualizaciones
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentTab === 'deployments' && (
          <div className="card border-0 shadow">
            <div className="card-header bg-light">
              <h5 className="mb-0">
                <i className="bi bi-clock-history me-2 text-primary"></i>
                Historial de Deployments
              </h5>
            </div>
            <div className="card-body">
              {deploymentHistory.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead className="table-light">
                      <tr>
                        <th><i className="bi bi-tag me-1"></i>Versión</th>
                        <th><i className="bi bi-folder me-1"></i>Proyecto</th>
                        <th><i className="bi bi-calendar me-1"></i>Fecha</th>
                        <th><i className="bi bi-clock me-1"></i>Hora</th>
                      </tr>
                    </thead>
                    <tbody>
                      {deploymentHistory.slice().reverse().map((deploy, index) => (
                        <tr key={index}>
                          <td>
                            <code className="bg-light p-1 rounded">{deploy.version}</code>
                          </td>
                          <td>
                            <span className="badge bg-info">{deploy.project}</span>
                          </td>
                          <td>{new Date(deploy.timestamp).toLocaleDateString()}</td>
                          <td>{new Date(deploy.timestamp).toLocaleTimeString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center text-muted py-5">
                  <i className="bi bi-inbox display-1 mb-3"></i>
                  <h4>No hay deployments registrados</h4>
                  <p>Los deployments aparecerán aquí cuando Jenkins haga el primer deploy</p>
                </div>
              )}
            </div>
          </div>
        )}

        {currentTab === 'test' && (
          <div className="row">
            <div className="col-lg-6">
              <div className="card border-0 shadow">
                <div className="card-header bg-light">
                  <h5 className="mb-0">
                    <i className="bi bi-tools me-2 text-warning"></i>
                    Herramientas de Desarrollo
                  </h5>
                </div>
                <div className="card-body">
                  <p>Herramientas para probar la funcionalidad:</p>
                  
                  <div className="d-grid gap-2">
                    <button 
                      className="btn btn-outline-primary"
                      onClick={() => {
                        console.log('🧪 Estado actual:', { connectionStatus, updateAvailable, deploymentHistory });
                        alert('Revisa la consola para ver el estado actual');
                      }}
                    >
                      <i className="bi bi-bug me-2"></i>
                      Ver estado en consola
                    </button>
                    
                    <button 
                      className="btn btn-outline-info"
                      onClick={() => {
                        window.open(import.meta.env.VITE_WEBSOCKET_URL + '/health', '_blank');
                      }}
                    >
                      <i className="bi bi-heart-pulse me-2"></i>
                      Health Check del WebSocket
                    </button>
                    
                    <button 
                      className="btn btn-outline-success"
                      onClick={checkForUpdates}
                    >
                      <i className="bi bi-arrow-clockwise me-2"></i>
                      Verificar actualizaciones manualmente
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-lg-6">
              <div className="card border-0 shadow">
                <div className="card-header bg-light">
                  <h5 className="mb-0">
                    <i className="bi bi-info-circle me-2 text-info"></i>
                    Información Técnica
                  </h5>
                </div>
                <div className="card-body">
                  <dl className="row">
                    <dt className="col-sm-6">Framework:</dt>
                    <dd className="col-sm-6">React + Vite</dd>
                    
                    <dt className="col-sm-6">WebSocket URL:</dt>
                    <dd className="col-sm-6">
                      <code className="small">{import.meta.env.VITE_WEBSOCKET_URL}</code>
                    </dd>
                    
                    <dt className="col-sm-6">Modo:</dt>
                    <dd className="col-sm-6">
                      <span className={`badge bg-${import.meta.env.DEV ? 'warning' : 'success'}`}>
                        {import.meta.env.DEV ? 'Desarrollo' : 'Producción'}
                      </span>
                    </dd>
                    
                    <dt className="col-sm-6">Hot Reload:</dt>
                    <dd className="col-sm-6">
                      <span className={`badge bg-${import.meta.env.DEV ? 'success' : 'secondary'}`}>
                        {import.meta.env.DEV ? 'Activo' : 'No disponible'}
                      </span>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;