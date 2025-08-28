import React, { useState } from 'react';
import { 
  Layout, 
  Card, 
  Button, 
  Switch, 
  Typography, 
  Space, 
  Row, 
  Col, 
  Tag, 
  Steps, 
  Badge,
  ConfigProvider,
  theme
} from 'antd';
import { 
  SunOutlined, 
  MoonOutlined, 
  ReloadOutlined, 
  BarChartOutlined, 
  SettingOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  SyncOutlined
} from '@ant-design/icons';
import useAutoUpdate from './hooks/useAutoUpdate';
import UpdateNotification from './components/UpdateNotification';

const { Header, Content } = Layout;
const { Title, Text } = Typography;
const { Step } = Steps;

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { isUpdateAvailable, updateMessage, checkForUpdates } = useAutoUpdate();

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const processSteps = [
    {
      title: '1. Commit',
      description: 'Push al repositorio',
      icon: '📝'
    },
    {
      title: '2. Build', 
      description: 'Jenkins construye',
      icon: '🔨'
    },
    {
      title: '3. Deploy',
      description: 'Despliegue automático', 
      icon: '🚀'
    },
    {
      title: '4. Notifica',
      description: 'Actualización automática',
      icon: '🔔'
    }
  ];

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      <Layout style={{ minHeight: '100vh' }}>
        <Header style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          padding: '0 24px'
        }}>
          <Title level={3} style={{ color: 'white', margin: 0 }}>
            🚀 Sistema de Actualizaciones Automáticas
          </Title>
          <Space>
            <SunOutlined style={{ color: 'white' }} />
            <Switch 
              checked={isDarkMode}
              onChange={toggleTheme}
              checkedChildren={<MoonOutlined />}
              unCheckedChildren={<SunOutlined />}
            />
            <MoonOutlined style={{ color: 'white' }} />
          </Space>
        </Header>

        <Content style={{ padding: '24px' }}>
          <Row gutter={[24, 24]}>
            {/* Card de bienvenida */}
            <Col xs={24} lg={12}>
              <Card 
                title="¡Hola Mundo!" 
                extra={<Badge status="success" text="Activo" />}
                style={{ height: '100%' }}
              >
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <Text>
                    Bienvenido al sistema de actualizaciones automáticas con Jenkins y WebSockets.
                  </Text>
                  <Space wrap>
                    <Tag color="blue">React</Tag>
                    <Tag color="green">Jenkins</Tag>
                    <Tag color="purple">WebSocket</Tag>
                    <Tag color="orange">Ant Design</Tag>
                  </Space>
                </Space>
              </Card>
            </Col>

            {/* Card de estado del sistema */}
            <Col xs={24} lg={12}>
              <Card title="Estado del Sistema" style={{ height: '100%' }}>
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <Row justify="space-between">
                    <Text>Estado del servidor:</Text>
                    <Badge status="processing" text="Conectado" />
                  </Row>
                  <Row justify="space-between">
                    <Text>Última actualización:</Text>
                    <Text type="secondary">Hace 2 minutos</Text>
                  </Row>
                  <Row justify="space-between">
                    <Text>Versión actual:</Text>
                    <Tag color="green">v1.0.0</Tag>
                  </Row>
                  <Row justify="space-between">
                    <Text>Notificaciones:</Text>
                    <Badge status="success" text="Habilitadas" />
                  </Row>
                </Space>
              </Card>
            </Col>

            {/* Card de acciones */}
            <Col xs={24} lg={8}>
              <Card title="Acciones Rápidas">
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <Button 
                    type="primary" 
                    icon={<ReloadOutlined />} 
                    block
                    onClick={checkForUpdates}
                  >
                    Verificar Actualizaciones
                  </Button>
                  <Button 
                    type="default" 
                    icon={<BarChartOutlined />} 
                    block
                  >
                    Ver Estadísticas
                  </Button>
                  <Button 
                    type="default" 
                    icon={<SettingOutlined />} 
                    block
                  >
                    Configuración
                  </Button>
                </Space>
              </Card>
            </Col>

            {/* Card de proceso */}
            <Col xs={24} lg={16}>
              <Card title="¿Cómo funciona el sistema?">
                <Row gutter={[16, 16]}>
                  {processSteps.map((step, index) => (
                    <Col xs={12} md={6} key={index}>
                      <Card 
                        size="small" 
                        style={{ textAlign: 'center', height: '100%' }}
                        bodyStyle={{ padding: '16px' }}
                      >
                        <div style={{ fontSize: '32px', marginBottom: '8px' }}>
                          {step.icon}
                        </div>
                        <Title level={5} style={{ margin: '8px 0 4px 0' }}>
                          {step.title}
                        </Title>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          {step.description}
                        </Text>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Card>
            </Col>
          </Row>
        </Content>

        <UpdateNotification 
          isVisible={isUpdateAvailable}
          message={updateMessage}
        />
      </Layout>
    </ConfigProvider>
  );
}

export default App;