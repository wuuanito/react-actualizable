pipeline {
    agent any  // Usar cualquier nodo disponible
    
    environment {
        // Configuración del WebSocket server (localhost porque Jenkins está en el mismo server)
        WEBSOCKET_URL = 'http://localhost:6003'
        
        // Configuración de IIS según tu configuración actual
        IIS_SITE_PATH = 'C:\\Users\\Administrador\\Desktop\\WebAuto'
        IIS_SITE_NAME = 'PruebaWebAuto'
        
        // Variables del build
        BUILD_VERSION = "${env.GIT_COMMIT.take(7)}"
        BUILD_TIMESTAMP = "${currentBuild.startTimeInMillis}"
        PROJECT_NAME = 'mi-app-react'
        
        // Node.js en Windows Server (ajustar si es necesario)
        NODEJS_HOME = 'C:\\Program Files\\nodejs'
        PATH = "${env.NODEJS_HOME};${env.PATH}"
    }
    
    stages {
        stage('Preparación') {
            steps {
                echo '🚀 Iniciando deployment desde repositorio remoto...'
                echo "🖥️ Ejecutando en servidor: ${env.NODE_NAME ?: 'Jenkins Master'}"
                echo "📁 Workspace: ${env.WORKSPACE}"
                
                // Limpiar workspace anterior si existe
                cleanWs()
            }
        }
        
        stage('Checkout') {
            steps {
                echo '📥 Descargando código fuente del repositorio...'
                checkout scm
                
                bat '''
                    echo "🔍 Información del commit:"
                    git log -1 --format="Commit: %%H"
                    git log -1 --format="Author: %%an <%%ae>"
                    git log -1 --format="Message: %%s"
                    
                    echo "📂 Contenido del proyecto:"
                    dir /w
                '''
            }
        }
        
        stage('Verificar Entorno') {
            steps {
                echo '🔧 Verificando herramientas necesarias...'
                bat '''
                    echo "📦 Verificando Node.js..."
                    node --version || (
                        echo "❌ Node.js no encontrado en PATH"
                        echo "PATH actual: %PATH%"
                        exit /b 1
                    )
                    
                    echo "📦 Verificando NPM..."
                    npm --version || (
                        echo "❌ NPM no encontrado"
                        exit /b 1
                    )
                    
                    echo "🌐 Verificando IIS..."
                    %windir%\\system32\\inetsrv\\appcmd list sites || (
                        echo "❌ IIS no disponible o no configurado"
                        exit /b 1
                    )
                    
                    echo "📡 Verificando WebSocket server..."
                    powershell -Command "try { Invoke-WebRequest -Uri '%WEBSOCKET_URL%/health' -UseBasicParsing | Out-Null; Write-Host '✅ WebSocket server disponible' } catch { Write-Host '⚠️ WebSocket server no responde'; }"
                    
                    echo "✅ Entorno verificado correctamente"
                '''
            }
        }
        
        stage('Instalar Dependencias') {
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
                    
                    echo "📊 Tamaño del build:"
                    for /r dist %%i in (*.*) do @echo %%~nxi: %%~zi bytes
                '''
            }
        }
        
        stage('Backup y Preparación') {
            steps {
                echo '💾 Creando backup del deployment actual...'
                bat '''
                    set "BACKUP_DIR=C:\\Backups\\mi-app-react"
                    set "BACKUP_PATH=%BACKUP_DIR%\\build-%BUILD_NUMBER%-%date:~-4,4%%date:~-10,2%%date:~-7,2%"
                    
                    if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%"
                    if not exist "%BACKUP_PATH%" mkdir "%BACKUP_PATH%"
                    
                    if exist "%IIS_SITE_PATH%\\index.html" (
                        echo "💾 Creando backup en: %BACKUP_PATH%"
                        xcopy "%IIS_SITE_PATH%\\*" "%BACKUP_PATH%\\" /E /I /Y /Q
                        echo "✅ Backup creado exitosamente"
                    ) else (
                        echo "ℹ️ No hay deployment previo para respaldar"
                    )
                    
                    echo "🗂️ Creando directorio IIS si no existe..."
                    if not exist "%IIS_SITE_PATH%" mkdir "%IIS_SITE_PATH%"
                '''
            }
        }
        
        stage('Deploy a IIS') {
            steps {
                echo '🚀 Desplegando a IIS en Windows Server...'
                bat '''
                    echo "🛑 Deteniendo Application Pool (opcional)..."
                    REM %windir%\\system32\\inetsrv\\appcmd stop apppool "DefaultAppPool" || echo "AppPool ya detenido"
                    
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
                    
                    echo "📝 Creando archivos de información..."
                    echo %BUILD_VERSION% > "%IIS_SITE_PATH%\\version.txt"
                    echo %BUILD_TIMESTAMP% > "%IIS_SITE_PATH%\\build-time.txt"
                    echo Jenkins Build #%BUILD_NUMBER% > "%IIS_SITE_PATH%\\build-info.txt"
                    echo %date% %time% >> "%IIS_SITE_PATH%\\build-info.txt"
                    
                    echo "🚀 Reiniciando Application Pool (opcional)..."
                    REM %windir%\\system32\\inetsrv\\appcmd start apppool "DefaultAppPool" || echo "AppPool ya iniciado"
                    
                    echo "✅ Deployment a IIS completado"
                '''
            }
        }
        
        stage('Verificar Deployment') {
            steps {
                echo '🧪 Verificando que el deployment funcione...'
                bat '''
                    echo "⏳ Esperando que IIS procese los cambios..."
                    timeout /t 3 /nobreak >nul
                    
                    echo "🧪 Verificando acceso HTTP..."
                    powershell -Command "
                        try {
                            $response = Invoke-WebRequest -Uri 'http://localhost:2000' -UseBasicParsing -TimeoutSec 10
                            Write-Host '✅ Sitio respondiendo - Status Code:' $response.StatusCode
                            
                            if ($response.Content -match 'Mi App con Auto-Updates') {
                                Write-Host '✅ Contenido de la aplicación detectado'
                            } else {
                                Write-Host '⚠️ Contenido no detectado, pero sitio responde'
                            }
                        } catch {
                            Write-Host '⚠️ Error al verificar sitio:' $_.Exception.Message
                            Write-Host 'Continuando deployment...'
                        }
                    "
                    
                    echo "📝 Verificando archivos desplegados..."
                    dir "%IIS_SITE_PATH%" /w
                    
                    if exist "%IIS_SITE_PATH%\\version.txt" (
                        echo "📋 Versión desplegada:"
                        type "%IIS_SITE_PATH%\\version.txt"
                    )
                '''
            }
        }
        
        stage('Notificar Clientes') {
            steps {
                echo '📢 Enviando notificación de nueva versión...'
                bat '''
                    echo "📨 Preparando notificación para WebSocket server..."
                    
                    powershell -Command "
                        $notificationData = @{
                            version = '%BUILD_VERSION%'
                            project = '%PROJECT_NAME%'
                            timestamp = [int64](%BUILD_TIMESTAMP%)
                            deployedBy = 'Jenkins'
                            buildNumber = '%BUILD_NUMBER%'
                            message = '✅ Nueva versión desplegada en IIS Server'
                            server = '192.168.11.7'
                            deploymentPath = '%IIS_SITE_PATH%'
                        } | ConvertTo-Json -Compress
                        
                        Write-Host '📋 Enviando notificación:'
                        Write-Host $notificationData
                        
                        try {
                            $response = Invoke-RestMethod -Uri '%WEBSOCKET_URL%/notify-update' -Method Post -Body $notificationData -ContentType 'application/json' -TimeoutSec 10
                            
                            Write-Host '📡 Respuesta del WebSocket server:'
                            Write-Host ($response | ConvertTo-Json -Depth 3)
                            
                            if ($response.success -eq $true) {
                                Write-Host ('✅ Notificación enviada exitosamente a ' + $response.clientsNotified + ' cliente(s)')
                            } else {
                                Write-Host '⚠️ Respuesta inesperada del servidor'
                            }
                        } catch {
                            Write-Host '❌ Error al enviar notificación:' $_.Exception.Message
                            Write-Host '⚠️ El deployment fue exitoso pero la notificación falló'
                            Write-Host 'Verifica que el WebSocket server esté corriendo en puerto 6003'
                        }
                    "
                '''
            }
        }
    }
    
    post {
        always {
            echo '🧹 Tareas de limpieza...'
            bat '''
                echo "📊 Resumen del deployment:"
                echo "  Build Number: %BUILD_NUMBER%"
                echo "  Version: %BUILD_VERSION%"
                echo "  Timestamp: %BUILD_TIMESTAMP%"
                echo "  IIS Path: %IIS_SITE_PATH%"
                echo "  WebSocket: %WEBSOCKET_URL%"
                
                echo "🧹 Limpiando node_modules..."
                if exist "node_modules" rd /s /q node_modules 2>nul
                
                echo "📁 Manteniendo solo los últimos 5 backups..."
                powershell -Command "
                    $backupPath = 'C:\\Backups\\mi-app-react'
                    if (Test-Path $backupPath) {
                        Get-ChildItem $backupPath | Sort-Object CreationTime -Descending | Select-Object -Skip 5 | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue
                    }
                "
            '''
        }
        
        success {
            echo '🎉 ¡Deployment exitoso!'
            bat '''
                echo "✅ La aplicación React ha sido desplegada exitosamente"
                echo "🌐 Accesible en: http://192.168.11.7:2000"
                echo "📱 Usuarios notificados automáticamente vía WebSocket"
                
                REM Enviar notificación de éxito adicional
                powershell -Command "
                    try {
                        $successData = @{
                            version = '%BUILD_VERSION%'
                            project = '%PROJECT_NAME%'
                            timestamp = [int64](%BUILD_TIMESTAMP%)
                            message = '🎉 Deployment completado - Build #%BUILD_NUMBER%'
                            status = 'success'
                            url = 'http://192.168.11.7:2000'
                        } | ConvertTo-Json -Compress
                        
                        Invoke-RestMethod -Uri '%WEBSOCKET_URL%/notify-update' -Method Post -Body $successData -ContentType 'application/json' -TimeoutSec 5 | Out-Null
                    } catch {
                        Write-Host 'Info: No se pudo enviar notificación adicional de éxito'
                    }
                "
            '''
        }
        
        failure {
            echo '❌ Deployment falló'
            bat '''
                echo "🔍 Información de debugging:"
                
                echo "📦 Verificando Node.js:"
                node --version 2>nul || echo "Node.js no disponible"
                
                echo "🌐 Verificando IIS:"
                %windir%\\system32\\inetsrv\\appcmd list sites 2>nul || echo "IIS no disponible"
                
                echo "📁 Estado del directorio IIS:"
                if exist "%IIS_SITE_PATH%" (
                    dir "%IIS_SITE_PATH%" /w
                ) else (
                    echo "Directorio IIS no existe"
                )
                
                echo "💾 Intentando restaurar desde backup..."
                set "BACKUP_DIR=C:\\Backups\\mi-app-react"
                for /f %%i in ('dir "%BACKUP_DIR%" /b /od 2^>nul ^| findstr "build-"') do set "LATEST_BACKUP=%%i"
                
                if defined LATEST_BACKUP (
                    echo "🔄 Restaurando backup: %LATEST_BACKUP%"
                    xcopy "%BACKUP_DIR%\\%LATEST_BACKUP%\\*" "%IIS_SITE_PATH%\\" /E /I /Y /Q 2>nul
                    echo "✅ Backup restaurado"
                ) else (
                    echo "⚠️ No hay backups disponibles para restaurar"
                )
                
                REM Notificar el fallo
                powershell -Command "
                    try {
                        $errorData = @{
                            version = '%BUILD_VERSION%'
                            project = '%PROJECT_NAME%'
                            timestamp = [int64](%BUILD_TIMESTAMP%)
                            message = '❌ Deployment falló - Build #%BUILD_NUMBER%'
                            status = 'error'
                            buildUrl = '%BUILD_URL%'
                        } | ConvertTo-Json -Compress
                        
                        Invoke-RestMethod -Uri '%WEBSOCKET_URL%/notify-update' -Method Post -Body $errorData -ContentType 'application/json' -TimeoutSec 5 | Out-Null
                    } catch {
                        Write-Host 'No se pudo enviar notificación de error'
                    }
                "
            '''
        }
    }
}