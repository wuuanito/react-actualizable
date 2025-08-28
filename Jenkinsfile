pipeline {
    agent {
        label 'principal' // Usar nodo principal (Windows Server)
    }
    
    environment {
        // Configuración del WebSocket server
        WEBSOCKET_URL = 'http://localhost:6003'
        
        // Configuración de IIS (solo Windows)
        IIS_SITE_PATH = 'C:\\Users\\Administrador\\Desktop\\WebAuto'
        IIS_SITE_NAME = 'PruebaWebAuto'
        
        // Variables del build
        BUILD_VERSION = "${env.GIT_COMMIT.take(7)}"
        BUILD_TIMESTAMP = "${currentBuild.startTimeInMillis}"
        PROJECT_NAME = 'PruebaWebAuto'
    }
    
    stages {
        stage('Verificar Sistema') {
            steps {
                script {
                    // Detectar sistema operativo
                    def isWindows = isUnix() ? false : true
                    
                    echo "🖥️ Sistema operativo detectado: ${isWindows ? 'Windows' : 'Unix/Linux'}"
                    echo "🏷️ Node name: ${env.NODE_NAME}"
                    echo "🏷️ Node labels: ${env.NODE_LABELS}"
                    
                    if (!isWindows) {
                        error("❌ Este pipeline requiere un nodo Windows. Sistema actual: Unix/Linux")
                    }
                    
                    echo "✅ Sistema Windows confirmado - continuando con deployment"
                }
            }
        }
        
        stage('Preparación') {
            when {
                expression { !isUnix() }
            }
            steps {
                echo '🚀 Iniciando deployment desde repositorio remoto...'
                echo "🖥️ Ejecutando en nodo Windows: ${env.NODE_NAME ?: 'Jenkins Master'}"
                echo "📁 Workspace: ${env.WORKSPACE}"
                
                // Limpiar workspace anterior si existe
                cleanWs()
            }
        }
        
        stage('Checkout') {
            when {
                expression { !isUnix() }
            }
            steps {
                echo '📥 Descargando código fuente del repositorio...'
                checkout scm
                
                script {
                    if (isUnix()) {
                        sh '''
                            echo "🔍 Información del commit:"
                            git log -1 --format="Commit: %H"
                            git log -1 --format="Author: %an <%ae>"
                            git log -1 --format="Message: %s"
                            ls -la
                        '''
                    } else {
                        bat '''
                            echo "🔍 Información del commit:"
                            git log -1 --format="Commit: %%H"
                            git log -1 --format="Author: %%an <%%ae>"
                            git log -1 --format="Message: %%s"
                            dir /w
                        '''
                    }
                }
            }
        }
        
        stage('Verificar Entorno Windows') {
            when {
                expression { !isUnix() }
            }
            steps {
                echo '🔧 Verificando herramientas necesarias en Windows...'
                bat '''
                    echo "📦 Verificando Node.js..."
                    node --version || (
                        echo "❌ Node.js no encontrado"
                        exit /b 1
                    )
                    
                    echo "📦 Verificando NPM..."
                    npm --version || (
                        echo "❌ NPM no encontrado"
                        exit /b 1
                    )
                    
                    echo "🌐 Verificando IIS..."
                    %windir%\\system32\\inetsrv\\appcmd list sites || (
                        echo "❌ IIS no disponible"
                        exit /b 1
                    )
                    
                    echo "📡 Verificando WebSocket server..."
                    powershell -Command "try { Invoke-WebRequest -Uri '%WEBSOCKET_URL%/health' -UseBasicParsing -TimeoutSec 5 | Out-Null; Write-Host '✅ WebSocket server disponible' } catch { Write-Host '⚠️ WebSocket server no responde' }"
                    
                    echo "✅ Entorno Windows verificado correctamente"
                '''
            }
        }
        
        stage('Instalar Dependencias') {
            when {
                expression { !isUnix() }
            }
            steps {
                echo '📦 Instalando dependencias de Node.js...'
                bat '''
                    echo "📦 Ejecutando npm ci..."
                    npm ci
                    
                    if errorlevel 1 (
                        echo "❌ Error al instalar dependencias"
                        exit /b 1
                    )
                    
                    echo "✅ Dependencias instaladas correctamente"
                '''
            }
        }
        
        stage('Build React App') {
            when {
                expression { !isUnix() }
            }
            steps {
                echo '⚛️ Construyendo aplicación React con Vite...'
                bat '''
                    echo "🏗️ Ejecutando build de producción..."
                    npm run build
                    
                    if errorlevel 1 (
                        echo "❌ Error en el build"
                        exit /b 1
                    )
                    
                    echo "✅ Verificando build..."
                    if not exist "dist\\index.html" (
                        echo "❌ Error: index.html no encontrado en dist/"
                        exit /b 1
                    )
                    
                    echo "📁 Contenido del build:"
                    dir dist /w
                '''
            }
        }
        
        stage('Backup y Deploy a IIS') {
            when {
                expression { !isUnix() }
            }
            steps {
                echo '🚀 Creando backup y desplegando a IIS...'
                bat '''
                    REM Crear backup
                    set "BACKUP_DIR=C:\\Backups\\WebAuto"
                    set "BACKUP_PATH=%BACKUP_DIR%\\build-%BUILD_NUMBER%-%date:~-4,4%%date:~-10,2%%date:~-7,2%"
                    
                    if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%"
                    if not exist "%BACKUP_PATH%" mkdir "%BACKUP_PATH%"
                    
                    if exist "%IIS_SITE_PATH%\\index.html" (
                        echo "💾 Creando backup en: %BACKUP_PATH%"
                        xcopy "%IIS_SITE_PATH%\\*" "%BACKUP_PATH%\\" /E /I /Y /Q
                    )
                    
                    REM Limpiar y copiar archivos nuevos
                    echo "🗑️ Limpiando directorio IIS..."
                    if exist "%IIS_SITE_PATH%\\*.*" (
                        del /Q "%IIS_SITE_PATH%\\*.*"
                        for /d %%i in ("%IIS_SITE_PATH%\\*") do rd /s /q "%%i" 2>nul
                    )
                    
                    echo "📁 Copiando nuevos archivos..."
                    xcopy "dist\\*" "%IIS_SITE_PATH%\\" /E /I /Y
                    
                    if errorlevel 1 (
                        echo "❌ Error al copiar archivos a IIS"
                        exit /b 1
                    )
                    
                    REM Crear archivos de información
                    echo %BUILD_VERSION% > "%IIS_SITE_PATH%\\version.txt"
                    echo %BUILD_TIMESTAMP% > "%IIS_SITE_PATH%\\build-time.txt"
                    echo Jenkins Build #%BUILD_NUMBER% > "%IIS_SITE_PATH%\\build-info.txt"
                    
                    echo "✅ Deployment a IIS completado"
                '''
            }
        }
        
        stage('Verificar y Notificar') {
            when {
                expression { !isUnix() }
            }
            steps {
                echo '🧪 Verificando deployment y notificando clientes...'
                bat '''
                    REM Verificar deployment
                    timeout /t 3 /nobreak >nul
                    
                    powershell -Command "
                        try {
                            $response = Invoke-WebRequest -Uri 'http://localhost:2000' -UseBasicParsing -TimeoutSec 10
                            Write-Host '✅ Sitio respondiendo - Status Code:' $response.StatusCode
                        } catch {
                            Write-Host '⚠️ Error al verificar sitio:' $_.Exception.Message
                        }
                        
                        # Enviar notificación
                        try {
                            $notificationData = @{
                                version = '%BUILD_VERSION%'
                                project = '%PROJECT_NAME%'
                                timestamp = [int64](%BUILD_TIMESTAMP%)
                                deployedBy = 'Jenkins'
                                buildNumber = '%BUILD_NUMBER%'
                                message = '✅ Nueva versión desplegada en IIS Server'
                                server = '192.168.11.7'
                                port = 2000
                            } | ConvertTo-Json -Compress
                            
                            Write-Host '📡 Enviando notificación...'
                            $response = Invoke-RestMethod -Uri '%WEBSOCKET_URL%/notify-update' -Method Post -Body $notificationData -ContentType 'application/json' -TimeoutSec 10
                            Write-Host ('✅ Notificación enviada a ' + $response.clientsNotified + ' cliente(s)')
                        } catch {
                            Write-Host '⚠️ Error al enviar notificación:' $_.Exception.Message
                        }
                    "
                '''
            }
        }
    }
    
    post {
        always {
            script {
                if (!isUnix()) {
                    bat '''
                        echo "📊 Resumen del deployment:"
                        echo "  Build Number: %BUILD_NUMBER%"
                        echo "  Version: %BUILD_VERSION%"
                        echo "  Sistema: Windows"
                        echo "  Sitio: http://192.168.11.7:2000"
                    '''
                } else {
                    echo "❌ Pipeline ejecutado en sistema no compatible (Unix/Linux)"
                }
            }
        }
        
        success {
            script {
                if (!isUnix()) {
                    echo '🎉 ¡Deployment exitoso en Windows!'
                    bat '''
                        echo "✅ Aplicación desplegada en: http://192.168.11.7:2000"
                        echo "📱 Usuarios notificados automáticamente"
                    '''
                } else {
                    echo "⚠️ Pipeline completado pero en sistema incorrecto"
                }
            }
        }
        
        failure {
            script {
                if (!isUnix()) {
                    echo '❌ Deployment falló en Windows'
                    bat '''
                        echo "🔍 Verificando estado del sistema..."
                        echo "Node.js:" && node --version 2>nul || echo "No disponible"
                        echo "IIS:" && %windir%\\system32\\inetsrv\\appcmd list sites 2>nul || echo "No disponible"
                    '''
                } else {
                    echo "❌ Pipeline falló - Sistema incorrecto (requiere Windows)"
                }
            }
        }
    }
}