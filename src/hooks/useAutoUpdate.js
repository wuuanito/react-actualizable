import { useEffect, useState, useCallback } from 'react';
import io from 'socket.io-client';

// Configuración de endpoints usando variables de Vite
const API_URL = import.meta.env.VITE_API_URL || 'http://192.168.11.7:3010/api';
// Socket.IO requiere URL HTTP base del servidor
const SOCKETIO_URL = import.meta.env.VITE_SOCKETIO_URL || 'http://192.168.11.7:3010';
// Endpoints específicos
const HEALTH_ENDPOINT = `${API_URL}/websocket/v1/health`;
const STATS_ENDPOINT = `${API_URL}/websocket/v1/stats`;
const LATEST_VERSION_ENDPOINT = `${API_URL}/websocket/v1/latest-version`;

const useAutoUpdate = () => {
    const [updateAvailable, setUpdateAvailable] = useState(false);
    const [newVersion, setNewVersion] = useState(null);
    const [connectionStatus, setConnectionStatus] = useState('disconnected');
    const [deploymentHistory, setDeploymentHistory] = useState([]);
    const [lastUpdate, setLastUpdate] = useState(null);

    // Función para forzar actualización
    const forceUpdate = useCallback(() => {
        console.log('🔄 Forzando actualización...');
        
        // Guardar la nueva versión como actual
        if (newVersion && newVersion.version) {
            localStorage.setItem('currentAppVersion', newVersion.version);
        }
        
        // Mostrar indicador de carga
        const loadingToast = document.createElement('div');
        loadingToast.className = 'position-fixed top-50 start-50 translate-middle bg-primary text-white p-3 rounded';
        loadingToast.innerHTML = `
            <div class="d-flex align-items-center">
                <div class="spinner-border spinner-border-sm me-2" role="status"></div>
                Actualizando aplicación...
            </div>
        `;
        loadingToast.style.zIndex = '9999';
        document.body.appendChild(loadingToast);
        
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }, [newVersion]);

    // Función para descartar actualización
    const dismissUpdate = useCallback(() => {
        setUpdateAvailable(false);
        setNewVersion(null);
    }, []);

    // Función para verificar el health del servidor WebSocket
    const checkServerHealth = useCallback(async () => {
        try {
            const response = await fetch(HEALTH_ENDPOINT);
            const data = await response.json();
            console.log('🏥 Health check del servidor:', data);
            return data.status === 'ok';
        } catch (error) {
            console.error('❌ Error en health check:', error);
            return false;
        }
    }, []);

    // Función para verificar versión manualmente
    const checkForUpdates = useCallback(async () => {
        try {
            const response = await fetch(LATEST_VERSION_ENDPOINT);
            const data = await response.json();
            console.log('🔍 Verificando versión:', data);
            
            if (data.latestVersion) {
                console.log('📋 Última versión disponible:', data.latestVersion);
                
                // Obtener versión actual del localStorage o usar una por defecto
                const currentVersion = localStorage.getItem('currentAppVersion') || 'Build #0';
                
                // Comparar versiones y activar notificación si hay una nueva
                if (data.latestVersion.version !== currentVersion) {
                    console.log('🚀 Nueva versión detectada:', data.latestVersion.version, 'vs actual:', currentVersion);
                    setNewVersion(data.latestVersion);
                    setUpdateAvailable(true);
                    setLastUpdate(new Date());
                }
            }
        } catch (error) {
            console.error('❌ Error al verificar actualizaciones:', error);
        }
    }, []);

    useEffect(() => {
        const initializeConnection = async () => {
            // Verificar health del servidor antes de conectar
            const isServerHealthy = await checkServerHealth();
            if (!isServerHealthy) {
                console.warn('⚠️ Servidor no disponible, reintentando en 5 segundos...');
                setConnectionStatus('error');
                setTimeout(initializeConnection, 5000);
                return;
            }

            console.log('🔌 Conectando a Socket.IO:', SOCKETIO_URL);
            
            const socket = io(SOCKETIO_URL, {
                transports: ['websocket', 'polling'],
                timeout: 5000,
                reconnection: true,
                reconnectionDelay: 1000,
                reconnectionDelayMax: 5000,
                reconnectionAttempts: 5,
                maxReconnectionAttempts: 5,
                forceNew: false,
                upgrade: true
            });

        // Eventos de conexión
        socket.on('connect', () => {
            console.log('✅ Conectado al servidor Socket.IO');
            setConnectionStatus('connected');
        });

        socket.on('disconnect', (reason) => {
            console.log('❌ Desconectado del servidor Socket.IO:', reason);
            setConnectionStatus('disconnected');
        });

        socket.on('connect_error', (error) => {
            console.error('❌ Error de conexión Socket.IO:', error);
            setConnectionStatus('error');
        });

        socket.on('reconnect', () => {
            console.log('🔄 Reconectado al servidor Socket.IO');
            setConnectionStatus('connected');
        });

        // Evento principal: nueva actualización disponible
        socket.on('app-updated', (data) => {
            console.log('🚀 Nueva actualización disponible:', data);
            setNewVersion(data);
            setUpdateAvailable(true);
            setLastUpdate(new Date());
            
            // Opcional: reproducir sonido de notificación
            try {
                const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFAlGn+DyvmMaBDWTxvTWhjUGJmnA7eGPQAoDRKnA4fDCn3EBJMvOsLGtqm5g');
                audio.volume = 0.2;
                audio.play().catch(() => {});
            } catch (error) {
                // Ignorar error de audio
            }
        });

        // Recibir historial de deployments
        socket.on('deployment-history', (history) => {
            console.log('📋 Historial de deployments recibido:', history);
            setDeploymentHistory(history);
        });

            // Cleanup al desmontar
            return () => {
                console.log('🧹 Desconectando Socket.IO...');
                socket.disconnect();
            };
        };

        // Inicializar la conexión
        initializeConnection();
    }, [checkServerHealth]);

    // Verificar actualizaciones automáticamente al cargar y periódicamente
    useEffect(() => {
        // Verificar inmediatamente al cargar
        checkForUpdates();
        
        // Verificar cada 10 segundos para mayor tiempo real
        const interval = setInterval(checkForUpdates, 10000);
        
        return () => clearInterval(interval);
    }, [checkForUpdates]);

    return {
        updateAvailable,
        newVersion,
        connectionStatus,
        deploymentHistory,
        lastUpdate,
        forceUpdate,
        dismissUpdate,
        checkForUpdates
    };
};

export default useAutoUpdate;