pipeline {
    agent {
        label 'windows-deploy'
    }
    
    environment {
        WEBSOCKET_URL = 'http://localhost:6003'
        IIS_SITE_PATH = 'C:\\Users\\Administrador\\Desktop\\WebAuto'
        IIS_SITE_NAME = 'PruebaWebAuto'
        
        BUILD_VERSION = "${env.GIT_COMMIT.take(7)}"
        BUILD_TIMESTAMP = "${currentBuild.startTimeInMillis}"
        PROJECT_NAME = 'PruebaWebAuto'
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo 'Descargando código fuente...'
                checkout scm
                
                bat '''
                    echo "Información del commit:"
                    git log -1 --format="Commit: %%H"
                    git log -1 --format="Author: %%an <%%ae>"
                    git log -1 --format="Message: %%s"
                    dir
                '''
            }
        }
        
        stage('Verificar Entorno') {
            steps {
                echo 'Verificando herramientas en Windows...'
                bat '''
                    echo "Sistema:"
                    systeminfo | findstr "OS Name"
                    echo "Usuario: %USERNAME%"
                    echo "Directorio: %CD%"
                    
                    echo "Node.js:"
                    node --version || (
                        echo "Node.js no encontrado"
                        exit /b 1
                    )
                    
                    echo "NPM:"
                    npm --version || (
                        echo "NPM no encontrado"
                        exit /b 1
                    )
                    
                    echo "Git:"
                    git --version || (
                        echo "Git no encontrado"
                        exit /b 1
                    )
                    
                    echo "PowerShell:"
                    powershell -Command "Write-Host 'PowerShell disponible'"
                '''
            }
        }
        
        stage('Build React App') {
            steps {
                echo 'Construyendo aplicación React...'
                bat '''
                    echo "Instalando dependencias..."
                    npm ci
                    
                    if errorlevel 1 (
                        echo "Error al instalar dependencias"
                        exit /b 1
                    )
                    
                    echo "Ejecutando build..."
                    npm run build
                    
                    if errorlevel 1 (
                        echo "Error en el build"
                        exit /b 1
                    )
                    
                    echo "Verificando build..."
                    if not exist "dist\\index.html" (
                        echo "Error: index.html no encontrado en dist/"
                        exit /b 1
                    )
                    
                    echo "Build completado. Contenido:"
                    dir dist
                '''
            }
        }
        
        stage('Backup y Deploy') {
            steps {
                echo 'Creando backup y desplegando...'
                bat '''
                    REM Crear directorio de backups
                    set "BACKUP_DIR=C:\\Backups\\WebAuto"
                    set "BACKUP_PATH=%BACKUP_DIR%\\build-%BUILD_NUMBER%"
                    
                    if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%"
                    if not exist "%BACKUP_PATH%" mkdir "%BACKUP_PATH%"
                    
                    REM Crear backup si existe contenido previo
                    if exist "%IIS_SITE_PATH%\\index.html" (
                        echo "Creando backup..."
                        xcopy "%IIS_SITE_PATH%\\*" "%BACKUP_PATH%\\" /E /I /Y /Q
                        echo "Backup creado en: %BACKUP_PATH%"
                    ) else (
                        echo "No hay contenido previo para respaldar"
                    )
                    
                    REM Crear directorio IIS si no existe
                    if not exist "%IIS_SITE_PATH%" mkdir "%IIS_SITE_PATH%"
                    
                    REM Limpiar directorio IIS
                    echo "Limpiando directorio IIS..."
                    if exist "%IIS_SITE_PATH%\\*.*" (
                        del /Q "%IIS_SITE_PATH%\\*.*" 2>nul
                        for /d %%i in ("%IIS_SITE_PATH%\\*") do rd /s /q "%%i" 2>nul
                    )
                    
                    REM Copiar archivos del build
                    echo "Copiando archivos nuevos..."
                    xcopy "dist\\*" "%IIS_SITE_PATH%\\" /E /I /Y
                    
                    if errorlevel 1 (
                        echo "Error al copiar archivos"
                        exit /b 1
                    )
                    
                    REM Crear archivos de información
                    echo %BUILD_VERSION% > "%IIS_SITE_PATH%\\version.txt"
                    echo %BUILD_TIMESTAMP% > "%IIS_SITE_PATH%\\build-time.txt"
                    echo Jenkins Build #%BUILD_NUMBER% > "%IIS_SITE_PATH%\\build-info.txt"
                    echo %date% %time% >> "%IIS_SITE_PATH%\\build-info.txt"
                    
                    echo "Deployment completado exitosamente"
                '''
            }
        }
        
        stage('Verificar Deployment') {
            steps {
                echo 'Verificando que el sitio funcione...'
                bat '''
                    echo "Esperando que IIS procese los cambios..."
                    timeout /t 5 /nobreak >nul
                    
                    echo "Verificando archivos desplegados:"
                    dir "%IIS_SITE_PATH%"
                    
                    echo "Verificando acceso HTTP..."
                    powershell -Command "
                        try {
                            $response = Invoke-WebRequest -Uri 'http://localhost:2000' -UseBasicParsing -TimeoutSec 10
                            Write-Host 'Sitio respondiendo - Status Code:' $response.StatusCode
                            if ($response.Content -match 'Mi App con Auto-Updates') {
                                Write-Host 'Contenido React detectado correctamente'
                            }
                        } catch {
                            Write-Host 'Advertencia: Error al verificar sitio HTTP:' $_.Exception.Message
                        }
                    "
                '''
            }
        }
        
        stage('Notificar Clientes') {
            steps {
                echo 'Enviando notificación vía WebSocket...'
                bat '''
                    echo "Preparando notificación..."
                    
                    powershell -Command "
                        $notificationData = @{
                            version = '%BUILD_VERSION%'
                            project = '%PROJECT_NAME%'
                            timestamp = [int64](%BUILD_TIMESTAMP%)
                            deployedBy = 'Jenkins-Windows'
                            buildNumber = '%BUILD_NUMBER%'
                            message = 'Nueva versión desplegada desde agente Windows'
                            server = '192.168.11.7'
                            port = 2000
                        } | ConvertTo-Json -Compress
                        
                        Write-Host 'Enviando notificación al WebSocket...'
                        try {
                            $response = Invoke-RestMethod -Uri '%WEBSOCKET_URL%/notify-update' -Method Post -Body $notificationData -ContentType 'application/json' -TimeoutSec 10
                            
                            Write-Host 'Respuesta del WebSocket:'
                            Write-Host ($response | ConvertTo-Json -Depth 2)
                            
                            if ($response.success -eq $true) {
                                Write-Host ('Notificación enviada exitosamente a ' + $response.clientsNotified + ' cliente(s)')
                            }
                        } catch {
                            Write-Host 'Error al enviar notificación:' $_.Exception.Message
                            Write-Host 'El deployment fue exitoso pero la notificación falló'
                        }
                    "
                '''
            }
        }
    }
    
    post {
        always {
            bat '''
                echo "Resumen del deployment:"
                echo "  Build Number: %BUILD_NUMBER%"
                echo "  Version: %BUILD_VERSION%"
                echo "  Timestamp: %BUILD_TIMESTAMP%"
                echo "  Sitio: http://192.168.11.7:2000"
                echo "  WebSocket: %WEBSOCKET_URL%"
                
                echo "Limpiando archivos temporales..."
                if exist "node_modules" rd /s /q node_modules 2>nul
                
                echo "Manteniendo últimos 5 backups..."
                powershell -Command "
                    $backupPath = 'C:\\Backups\\WebAuto'
                    if (Test-Path $backupPath) {
                        Get-ChildItem $backupPath | Sort-Object CreationTime -Descending | Select-Object -Skip 5 | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue
                        Write-Host 'Backups antiguos limpiados'
                    }
                "
            '''
        }
        
        success {
            bat '''
                echo "DEPLOYMENT EXITOSO"
                echo "La aplicación React está disponible en: http://192.168.11.7:2000"
                echo "Todos los clientes han sido notificados automáticamente"
                
                REM Notificación adicional de éxito
                powershell -Command "
                    try {
                        $successData = @{
                            version = '%BUILD_VERSION%'
                            project = '%PROJECT_NAME%'
                            timestamp = [int64](%BUILD_TIMESTAMP%)
                            message = 'Deployment completado exitosamente - Build #%BUILD_NUMBER%'
                            status = 'success'
                            url = 'http://192.168.11.7:2000'
                        } | ConvertTo-Json -Compress
                        
                        Invoke-RestMethod -Uri '%WEBSOCKET_URL%/notify-update' -Method Post -Body $successData -ContentType 'application/json' -TimeoutSec 5 | Out-Null
                    } catch {
                        Write-Host 'Info: No se pudo enviar notificación adicional'
                    }
                "
            '''
        }
        
        failure {
            bat '''
                echo "DEPLOYMENT FALLÓ"
                echo "Información de debugging:"
                
                echo "Node.js:"
                node --version 2>nul || echo "No disponible"
                
                echo "Estado del directorio IIS:"
                if exist "%IIS_SITE_PATH%" (
                    dir "%IIS_SITE_PATH%"
                ) else (
                    echo "Directorio no existe"
                )
                
                echo "Intentando restaurar backup más reciente..."
                powershell -Command "
                    $backupPath = 'C:\\Backups\\WebAuto'
                    if (Test-Path $backupPath) {
                        $latestBackup = Get-ChildItem $backupPath | Sort-Object CreationTime -Descending | Select-Object -First 1
                        if ($latestBackup) {
                            Write-Host ('Restaurando backup: ' + $latestBackup.Name)
                            Copy-Item ($latestBackup.FullName + '\\*') '%IIS_SITE_PATH%\\' -Recurse -Force -ErrorAction SilentlyContinue
                            Write-Host 'Backup restaurado'
                        } else {
                            Write-Host 'No hay backups disponibles'
                        }
                    }
                "
                
                REM Notificar el error
                powershell -Command "
                    try {
                        $errorData = @{
                            version = '%BUILD_VERSION%'
                            project = '%PROJECT_NAME%'
                            timestamp = [int64](%BUILD_TIMESTAMP%)
                            message = 'Deployment falló - Build #%BUILD_NUMBER%'
                            status = 'error'
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