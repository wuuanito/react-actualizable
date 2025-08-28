import { useEffect, useState, useCallback } from 'react';
import io from 'socket.io-client';

// Configuración del WebSocket usando variables de Vite
const WEBSOCKET_URL = import.meta.env.VITE_WEBSOCKET_URL || 'http://192.168.11.7:6003';

const useAutoUpdate = () => {
    const [updateAvailable, setUpdateAvailable] = useState(false);
    const [newVersion, setNewVersion] = useState(null);
    const [connectionStatus, setConnectionStatus] = useState('disconnected');
    const [deploymentHistory, setDeploymentHistory] = useState([]);
    const [lastUpdate, setLastUpdate] = useState(null);

    // Función para forzar actualización
    const forceUpdate = useCallback(() => {
        console.log('🔄 Forzando actualización...');
        
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
    }, []);

    // Función para descartar actualización
    const dismissUpdate = useCallback(() => {
        setUpdateAvailable(false);
        setNewVersion(null);
    }, []);

    // Función para verificar versión manualmente
    const checkForUpdates = useCallback(async () => {
        try {
            const response = await fetch(`${WEBSOCKET_URL}/latest-version`);
            const data = await response.json();
            console.log('🔍 Verificando versión:', data);
            
            if (data.latestVersion) {
                // Aquí podrías comparar con la versión actual si la tienes guardada
                console.log('📋 Última versión disponible:', data.latestVersion);
            }
        } catch (error) {
            console.error('❌ Error al verificar actualizaciones:', error);
        }
    }, []);

    useEffect(() => {
        console.log('🔌 Conectando a WebSocket:', WEBSOCKET_URL);
        
        const socket = io(WEBSOCKET_URL, {
            transports: ['websocket', 'polling'],
            timeout: 5000,
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionAttempts: 5
        });

        // Eventos de conexión
        socket.on('connect', () => {
            console.log('✅ Conectado al servidor WebSocket');
            setConnectionStatus('connected');
        });

        socket.on('disconnect', (reason) => {
            console.log('❌ Desconectado del servidor WebSocket:', reason);
            setConnectionStatus('disconnected');
        });

        socket.on('connect_error', (error) => {
            console.error('❌ Error de conexión:', error);
            setConnectionStatus('error');
        });

        socket.on('reconnect', () => {
            console.log('🔄 Reconectado al servidor WebSocket');
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
            console.log('🧹 Desconectando WebSocket...');
            socket.disconnect();
        };
    }, []);

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