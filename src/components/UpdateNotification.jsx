import React, { useEffect, useState } from 'react';
import { 
  Button, 
  Space, 
  Typography, 
  Tag, 
  Switch, 
  Progress, 
  Card,
  App,
  Divider,
  Row,
  Col
} from 'antd';
import { 
  ReloadOutlined, 
  CloseOutlined, 
  CheckCircleOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';

const { Text } = Typography;

const UpdateNotification = ({ isVisible, message, onUpdate, onDismiss }) => {
  const [countdown, setCountdown] = useState(10);
  const [autoUpdateEnabled, setAutoUpdateEnabled] = useState(false);
  const [notificationInstance, setNotificationInstance] = useState(null);
  const { notification } = App.useApp();

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
        <div style={{
          width: '100%',
          maxWidth: 400,
          padding: '20px',
          background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
          borderRadius: 12,
          boxShadow: '0 6px 20px rgba(0, 0, 0, 0.12)',
          border: '1px solid #e8e8e8'
        }}>
          <Space direction="vertical" size="medium" style={{ width: '100%' }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <Space align="center" size="small">
                <InfoCircleOutlined style={{ color: '#1890ff', fontSize: '18px' }} />
                <Text strong style={{ fontSize: '16px', color: '#262626' }}>
                  Nueva Versión Disponible
                </Text>
              </Space>
              <br />
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {new Date().toLocaleString('es-ES', {
                  day: '2-digit',
                  month: '2-digit', 
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </Text>
            </div>
            
            {/* Version Information */}
            {message && (
              <div style={{ 
                background: '#fafafa', 
                padding: '12px', 
                borderRadius: 8,
                border: '1px solid #f0f0f0'
              }}>
                <Row gutter={[12, 8]}>
                  <Col span={12}>
                    <Text type="secondary" style={{ fontSize: '11px', fontWeight: 600 }}>
                      VERSIÓN
                    </Text>
                    <br />
                    <Tag color="green" style={{ fontSize: '12px', fontFamily: 'monospace' }}>
                      {message.version || 'N/A'}
                    </Tag>
                  </Col>
                  <Col span={12}>
                    <Text type="secondary" style={{ fontSize: '11px', fontWeight: 600 }}>
                      COMMIT
                    </Text>
                    <br />
                    <Tag color="blue" style={{ fontSize: '11px', fontFamily: 'monospace' }}>
                      {message.commit ? message.commit.substring(0, 8) : 'N/A'}
                    </Tag>
                  </Col>
                </Row>
                <div style={{ marginTop: 8 }}>
                  <Text type="secondary" style={{ fontSize: '11px', fontWeight: 600 }}>
                    PROYECTO
                  </Text>
                  <br />
                  <Tag color="purple" style={{ fontSize: '12px' }}>
                    {message?.project || 'React App'}
                  </Tag>
                </div>
              </div>
            )}
            
            {/* Auto-update Toggle */}
            <div style={{
              background: '#f0f2f5',
              padding: '12px',
              borderRadius: 8,
              border: '1px solid #d9d9d9'
            }}>
              <Row align="middle" justify="space-between">
                <Col>
                  <Text style={{ fontSize: '13px', fontWeight: 500 }}>
                    Actualización Automática
                  </Text>
                  {autoUpdateEnabled && (
                    <div>
                      <Text type="secondary" style={{ fontSize: '11px' }}>
                        Se actualizará en {countdown} segundos
                      </Text>
                    </div>
                  )}
                </Col>
                <Col>
                  <Switch 
                    checked={autoUpdateEnabled}
                    onChange={(checked) => {
                      setAutoUpdateEnabled(checked);
                      if (checked) setCountdown(10);
                    }}
                  />
                </Col>
              </Row>
              
              {autoUpdateEnabled && (
                <Progress 
                  percent={(11 - countdown) * 10} 
                  size="small" 
                  status="active"
                  showInfo={false}
                  style={{ marginTop: 8 }}
                  strokeColor={{
                    '0%': '#108ee9',
                    '100%': '#87d068',
                  }}
                />
              )}
            </div>
            
            {/* Action Buttons */}
            <Row gutter={8} style={{ width: '100%', marginTop: 8 }}>
              <Col span={12}>
                <Button 
                  block
                  onClick={() => {
                    notification.close(key);
                    if (onDismiss) onDismiss();
                  }}
                  style={{ 
                    height: 36,
                    borderRadius: 6,
                    fontWeight: 500
                  }}
                >
                  Descartar
                </Button>
              </Col>
              <Col span={12}>
                <Button 
                  type="primary" 
                  block
                  icon={<ReloadOutlined />}
                  onClick={() => {
                    notification.close(key);
                    if (onUpdate) onUpdate();
                  }}
                  style={{ 
                    height: 36,
                    borderRadius: 6,
                    fontWeight: 500,
                    background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
                    border: 'none'
                  }}
                >
                  Actualizar
                </Button>
              </Col>
            </Row>
          </Space>
        </div>
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