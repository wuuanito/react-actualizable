import React, { useEffect, useState } from 'react';
import './UpdateNotification.css';

const UpdateNotification = ({ isVisible, message, onUpdate, onDismiss }) => {
  const [countdown, setCountdown] = useState(10);
  const [autoUpdateEnabled, setAutoUpdateEnabled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Detect dark mode preference
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(darkModeQuery.matches);
    
    const handleChange = (e) => setIsDarkMode(e.matches);
    darkModeQuery.addEventListener('change', handleChange);
    
    return () => darkModeQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (!isVisible || !autoUpdateEnabled) return;

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          if (onUpdate) onUpdate();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isVisible, autoUpdateEnabled, onUpdate]);

  if (!isVisible) return null;

  return (
    <div className={`update-notification ${isDarkMode ? 'dark' : 'light'}`}>
      <div className="update-notification-content">
        <div className="update-notification-header">
          <div className="header-content">
            <div className="header-icon">ℹ️</div>
            <h3 className="header-title">Nueva Versión Disponible</h3>
          </div>
          <div className="header-timestamp">
            {new Date().toLocaleString('es-ES', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>

        {message && (
          <div className="version-info">
            <div className="version-grid">
              <div className="version-item">
                <div className="version-label">VERSIÓN</div>
                <div className="version-tag green">
                  {message.version || 'N/A'}
                </div>
              </div>
              <div className="version-item">
                <div className="version-label">COMMIT</div>
                <div className="version-tag blue">
                  {message.commit ? message.commit.substring(0, 8) : 'N/A'}
                </div>
              </div>
            </div>
            <div className="version-item">
              <div className="version-label">PROYECTO</div>
              <div className="version-tag purple">
                {message?.project || 'React App'}
              </div>
            </div>
          </div>
        )}

        <div className="auto-update-section">
          <div className="auto-update-header">
            <div className="auto-update-text">
              <div className="auto-update-title">Actualización Automática</div>
              {autoUpdateEnabled && (
                <div className="countdown-text">
                  🕐 Se actualizará en {countdown} segundos
                </div>
              )}
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={autoUpdateEnabled}
                onChange={(e) => {
                  setAutoUpdateEnabled(e.target.checked);
                  if (e.target.checked) setCountdown(10);
                }}
              />
              <span className="slider"></span>
            </label>
          </div>

          {autoUpdateEnabled && (
            <div className="progress-container">
              <div 
                className="progress-bar"
                style={{ width: `${(11 - countdown) * 10}%` }}
              ></div>
            </div>
          )}
        </div>

        <div className="action-buttons">
          <button
            className="button button-secondary"
            onClick={() => {
              if (onDismiss) onDismiss();
            }}
          >
            ✕ Descartar
          </button>
          <button
            className="button button-primary"
            onClick={() => {
              if (onUpdate) onUpdate();
            }}
          >
            🔄 Actualizar
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateNotification;