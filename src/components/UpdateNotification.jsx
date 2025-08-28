import React, { useEffect, useState } from 'react';

const UpdateNotification = ({ updateAvailable, newVersion, onUpdate, onDismiss }) => {
    const [countdown, setCountdown] = useState(10);
    const [autoUpdateEnabled, setAutoUpdateEnabled] = useState(false);

    useEffect(() => {
        if (!updateAvailable || !autoUpdateEnabled) return;

        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    onUpdate();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [updateAvailable, autoUpdateEnabled, onUpdate]);

    if (!updateAvailable || !newVersion) return null;

    return (
        <div className="position-fixed top-0 end-0 m-3" style={{ zIndex: 1050 }}>
            <div className="toast show border-0 shadow-lg" role="alert" style={{ minWidth: '350px' }}>
                <div className="toast-header bg-gradient bg-success text-white">
                    <div className="rounded me-2 bg-white" style={{ width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <i className="bi bi-arrow-clockwise text-success"></i>
                    </div>
                    <strong className="me-auto">Nueva versión disponible</strong>
                    <small>{new Date(newVersion.timestamp).toLocaleTimeString()}</small>
                    <button 
                        type="button" 
                        className="btn-close btn-close-white" 
                        onClick={onDismiss}
                    ></button>
                </div>
                <div className="toast-body">
                    <div className="mb-2">
                        <small className="text-muted">Versión:</small>
                        <br />
                        <code className="bg-light p-1 rounded">{newVersion.version}</code>
                    </div>
                    <div className="mb-3">
                        <small className="text-muted">Proyecto:</small>
                        <br />
                        <span className="badge bg-info">{newVersion.project}</span>
                    </div>
                    
                    {/* Toggle para auto-actualización */}
                    <div className="form-check mb-3">
                        <input 
                            className="form-check-input" 
                            type="checkbox" 
                            id="autoUpdate"
                            checked={autoUpdateEnabled}
                            onChange={(e) => {
                                setAutoUpdateEnabled(e.target.checked);
                                if (e.target.checked) setCountdown(10);
                            }}
                        />
                        <label className="form-check-label small" htmlFor="autoUpdate">
                            Actualizar automáticamente en {countdown}s
                        </label>
                    </div>
                    
                    <div className="d-grid gap-2">
                        <button 
                            className="btn btn-success btn-sm"
                            onClick={onUpdate}
                        >
                            <i className="bi bi-arrow-clockwise me-1"></i>
                            Actualizar ahora
                        </button>
                        {autoUpdateEnabled && (
                            <div className="progress" style={{ height: '4px' }}>
                                <div 
                                    className="progress-bar bg-success" 
                                    style={{ width: `${(11 - countdown) * 10}%` }}
                                ></div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateNotification;