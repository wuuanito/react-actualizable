import React, { useEffect, useState } from 'react';
import { 
  notification, 
  Button, 
  Space, 
  Typography, 
  Tag, 
  Switch, 
  Progress, 
  Card 
} from 'antd';
import { 
  ReloadOutlined, 
  CloseOutlined, 
  CheckCircleOutlined 
} from '@ant-design/icons';

const { Text } = Typography;

const UpdateNotification = ({ isVisible, message, onUpdate, onDismiss }) => {
  const [countdown, setCountdown] = useState(10);
  const [autoUpdateEnabled, setAutoUpdateEnabled] = useState(false);
  const [notificationInstance, setNotificationInstance] = useState(null);

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

  useEffect(() => {
    if (isVisible && message) {
      const key = `update-notification-${Date.now()}`;
      
      const notificationContent = (
        <Card 
           size="small" 
           style={{ width: 350, margin: 0 }}
           styles={{ body: { padding: '16px' } }}
         >
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div>
              <Text strong>Nueva versión disponible</Text>
              <br />
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {new Date().toLocaleTimeString()}
              </Text>
            </div>
            
            {message && (
              <div>
                <Text type="secondary" style={{ fontSize: '12px' }}>Mensaje:</Text>
                <br />
                <Text code style={{ fontSize: '12px' }}>{message}</Text>
              </div>
            )}
            
            <div>
              <Text type="secondary" style={{ fontSize: '12px' }}>Proyecto:</Text>
              <br />
              <Tag color="blue">React App</Tag>
            </div>
            
            {/* Toggle para auto-actualización */}
            <Space align="center">
              <Switch 
                size="small"
                checked={autoUpdateEnabled}
                onChange={(checked) => {
                  setAutoUpdateEnabled(checked);
                  if (checked) setCountdown(10);
                }}
              />
              <Text style={{ fontSize: '12px' }}>
                Actualizar automáticamente en {countdown}s
              </Text>
            </Space>
            
            {autoUpdateEnabled && (
              <Progress 
                percent={(11 - countdown) * 10} 
                size="small" 
                status="active"
                showInfo={false}
              />
            )}
            
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button 
                size="small"
                onClick={() => {
                  notification.close(key);
                  if (onDismiss) onDismiss();
                }}
              >
                Descartar
              </Button>
              <Button 
                type="primary" 
                size="small"
                icon={<ReloadOutlined />}
                onClick={() => {
                  notification.close(key);
                  if (onUpdate) onUpdate();
                }}
              >
                Actualizar ahora
              </Button>
            </Space>
          </Space>
        </Card>
      );

      notification.open({
        key,
        message: null,
        description: notificationContent,
        icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
        placement: 'topRight',
        duration: 0, // No auto close
        closable: true,
        onClose: () => {
          if (onDismiss) onDismiss();
        }
      });

      setNotificationInstance(key);
    }

    return () => {
      if (notificationInstance) {
        notification.close(notificationInstance);
      }
    };
  }, [isVisible, message]);

  // Este componente ahora usa las notificaciones de Ant Design
  // No renderiza nada directamente
  return null;
};

export default UpdateNotification;