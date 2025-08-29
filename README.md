# React App con Auto-Actualización 🚀

Aplicación React con sistema de notificaciones automáticas que informa a los usuarios cuando hay una nueva versión disponible después de cada deployment de Jenkins.

## 🎯 Características Principales

- ✅ **Auto-actualización en tiempo real**: Los usuarios reciben notificaciones instantáneas
- ✅ **Integración con Jenkins**: Deploy automático con notificaciones
- ✅ **WebSocket en tiempo real**: Comunicación bidireccional
- ✅ **Historial de deployments**: Seguimiento de todas las actualizaciones
- ✅ **UI moderna**: Interfaz Bootstrap con notificaciones elegantes
- ✅ **Servicio de Windows**: Servidor que se ejecuta automáticamente

## 🔄 Flujo de Funcionamiento

1. **Desarrollador hace commit/push** → Código enviado al repositorio
2. **Jenkins detecta cambios** → Ejecuta pipeline automáticamente
3. **Build y Deploy exitoso** → Aplicación actualizada en servidor
4. **Jenkins notifica al WebSocket** → Envía información de nueva versión
5. **Servidor WebSocket distribuye** → Notifica a todos los clientes conectados
6. **Usuarios ven notificación** → "Nueva versión disponible, ¡actualizar página!"
7. **Usuario actualiza** → Obtiene la nueva versión inmediatamente

## 🏗️ Arquitectura del Sistema

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Desarrollador │───▶│     Jenkins     │───▶│   Servidor IIS  │
│   (Git Push)    │    │   (CI/CD)       │    │   (React App)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │ WebSocket Server│
                       │  (Notificaciones)│
                       └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │ Usuarios React  │
                       │ (Notificaciones)│
                       └─────────────────┘
```

## 🚀 Instalación y Configuración

### 1. Configurar la Aplicación React

```bash
# Clonar repositorio
git clone https://github.com/wuuanito/react-actualizable.git
cd react-actualizable

# Instalar dependencias
npm install

# Configurar variables de entorno
# Editar .env con la URL del WebSocket
VITE_WEBSOCKET_URL=ws://192.168.11.7:8000/ws

# Ejecutar en desarrollo
npm run dev

# Build para producción
npm run build
```

### 2. Configurar el Servidor WebSocket

```bash
# Ir al directorio del servidor
cd websocket-server

# Ejecutar configuración automática
setup.bat

# O instalación manual:
npm install
npm start

# Instalar como servicio de Windows (requiere admin)
npm run install-service
```

### 3. Configurar Jenkins

El `Jenkinsfile` ya está configurado para:
- Hacer build de la aplicación React
- Deployar en IIS (directorio: `C:\Users\Administrador\Desktop\WebAuto`)
- Enviar notificaciones al WebSocket server

**Requisitos de Jenkins:**
- Acceso al repositorio Git
- Node.js instalado en el agente
- Conectividad de red al servidor WebSocket

## 🔧 Configuración de Red

### Puertos Utilizados
- **React App**: Puerto 2000 (http://192.168.11.7:2000)
- **WebSocket Server**: Puerto 6003 (http://192.168.11.7:6003)
- **Jenkins**: Puerto por defecto (configurado en Jenkins)

### Firewall
Asegúrate de que estos puertos estén abiertos:
```bash
# Abrir puerto 6003 para WebSocket
netsh advfirewall firewall add rule name="WebSocket Server" dir=in action=allow protocol=TCP localport=6003
```

## 🧪 Pruebas y Verificación

### Probar el Servidor WebSocket
```bash
cd websocket-server
npm test
```

### Verificar Conectividad
```bash
# Verificar servidor activo
curl http://192.168.11.7:6003/health

# Ver estadísticas
curl http://192.168.11.7:6003/stats

# Probar notificación manual
curl -X POST http://192.168.11.7:6003/notify-deployment \
  -H "Content-Type: application/json" \
  -d '{"buildNumber":"test-123","gitCommit":"abc123","status":"success"}'
```

## 📱 Uso de la Aplicación

### Para Usuarios
1. Abrir la aplicación en el navegador
2. La aplicación se conecta automáticamente al WebSocket
3. Cuando hay una nueva versión, aparece una notificación
4. Hacer clic en "Actualizar" para obtener la nueva versión

### Para Desarrolladores
1. Hacer cambios en el código
2. Commit y push al repositorio
3. Jenkins ejecuta automáticamente el pipeline
4. Los usuarios conectados reciben la notificación automáticamente

## 🔍 Monitoreo y Logs

### Logs del WebSocket Server
- **Modo desarrollo**: Logs en consola
- **Servicio Windows**: Visor de eventos → Aplicaciones y servicios

### Logs de Jenkins
- Ver en la interfaz web de Jenkins
- Buscar mensajes de notificación en la sección "post"

### Logs de la App React
- Consola del navegador (F12)
- Buscar mensajes de WebSocket y actualizaciones

## 🛠️ Solución de Problemas

### Los usuarios no reciben notificaciones
1. Verificar que el WebSocket server esté ejecutándose
2. Comprobar la URL en `.env`
3. Revisar la consola del navegador
4. Verificar conectividad de red

### Jenkins no puede notificar
1. Verificar conectividad: `curl http://192.168.11.7:6003/health`
2. Revisar logs del pipeline de Jenkins
3. Comprobar configuración de firewall

### El servidor WebSocket no inicia
1. Verificar que Node.js esté instalado
2. Comprobar que el puerto 6003 esté libre
3. Revisar permisos de firewall

## 📁 Estructura del Proyecto

```
react-actualizable/
├── src/
│   ├── components/
│   │   └── UpdateNotification.jsx    # Componente de notificación
│   ├── hooks/
│   │   └── useAutoUpdate.js          # Hook para WebSocket
│   └── App.jsx                       # Aplicación principal
├── websocket-server/
│   ├── server.js                     # Servidor WebSocket
│   ├── package.json                  # Dependencias del servidor
│   ├── setup.bat                     # Script de configuración
│   └── README.md                     # Documentación del servidor
├── Jenkinsfile                       # Pipeline de CI/CD
├── .env                             # Variables de entorno
└── README.md                        # Esta documentación
```

## 🚀 Tecnologías Utilizadas

- **Frontend**: React 18 + Vite + Bootstrap 5
- **WebSocket**: Socket.IO (cliente y servidor)
- **Backend**: Node.js + Express
- **CI/CD**: Jenkins
- **Servidor Web**: IIS (Windows)
- **Servicio**: node-windows

## 🎯 Próximos Pasos

1. **Configurar el servidor WebSocket**:
   ```bash
   cd websocket-server
   setup.bat
   npm run install-service
   ```

2. **Hacer un commit de prueba**:
   ```bash
   git add .
   git commit -m "feat: sistema de notificaciones automáticas"
   git push
   ```

3. **Verificar el funcionamiento**:
   - Jenkins ejecuta el pipeline
   - La aplicación se actualiza
   - Los usuarios reciben notificaciones

¡El sistema está listo para funcionar! 🎉

## 📞 Soporte

Si tienes problemas:
1. Revisar la sección de solución de problemas
2. Verificar logs del servidor y Jenkins
3. Probar conectividad de red
4. Consultar la documentación del servidor WebSocket

---

**Desarrollado por Juan** - Sistema de auto-actualización para aplicaciones React
