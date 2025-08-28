pipeline {
    agent {
        label 'windows-deploy'
    }
    
    environment {
        WEBSOCKET_URL = 'http://localhost:6003'
        IIS_SITE_PATH = 'C:\\Users\\Administrador\\Desktop\\WebAuto'
        
        BUILD_VERSION = "${env.GIT_COMMIT.take(7)}"
        BUILD_TIMESTAMP = "${currentBuild.startTimeInMillis}"
        PROJECT_NAME = 'PruebaWebAuto'
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo 'Descargando código fuente...'
                checkout scm
                bat 'git log -1 --format="Commit: %%H"'
            }
        }
        
        stage('Verificar Entorno') {
            steps {
                echo 'Verificando herramientas...'
                bat '''
                    node --version || exit /b 1
                    npm --version || exit /b 1
                    echo "Entorno verificado correctamente"
                '''
            }
        }
        
        stage('Build React App') {
            steps {
                echo 'Construyendo aplicación React...'
                bat '''
                    echo "Instalando dependencias..."
                    npm ci
                    
                    echo "Ejecutando build de Vite..."
                    npm run build
                    
                    echo "Verificando build..."
                    if not exist "dist\\index.html" (
                        echo "ERROR: Build falló - index.html no encontrado"
                        dir dist 2>nul || echo "Directorio dist no existe"
                        exit /b 1
                    )
                    
                    echo "Build exitoso. Contenido de dist:"
                    dir dist
                '''
            }
        }
        
        stage('Deploy to IIS') {
            steps {
                echo 'Desplegando a IIS...'
                bat '''
                    REM Crear backup
                    set "BACKUP_DIR=C:\\Backups\\WebAuto\\build-%BUILD_NUMBER%"
                    if not exist "C:\\Backups\\WebAuto" mkdir "C:\\Backups\\WebAuto"
                    mkdir "%BACKUP_DIR%"
                    
                    REM Backup si existe contenido
                    if exist "%IIS_SITE_PATH%\\index.html" (
                        echo "Creando backup..."
                        xcopy "%IIS_SITE_PATH%\\*" "%BACKUP_DIR%\\" /E /I /Y /Q
                    )
                    
                    REM Crear directorio IIS
                    if not exist "%IIS_SITE_PATH%" mkdir "%IIS_SITE_PATH%"
                    
                    REM Limpiar directorio
                    del /Q "%IIS_SITE_PATH%\\*.*" 2>nul
                    for /d %%i in ("%IIS_SITE_PATH%\\*") do rd /s /q "%%i" 2>nul
                    
                    REM Copiar archivos del build
                    echo "Copiando archivos..."
                    xcopy "dist\\*" "%IIS_SITE_PATH%\\" /E /I /Y
                    
                    if errorlevel 1 (
                        echo "ERROR: No se pudieron copiar los archivos"
                        exit /b 1
                    )
                    
                    REM Crear archivos de info
                    echo %BUILD_VERSION% > "%IIS_SITE_PATH%\\version.txt"
                    echo Build #%BUILD_NUMBER% - %date% %time% > "%IIS_SITE_PATH%\\build-info.txt"
                    
                    echo "Deployment completado exitosamente"
                    dir "%IIS_SITE_PATH%"
                '''
            }
        }
        
        stage('Verificar') {
            steps {
                echo 'Verificando deployment...'
                bat '''
                    echo "Esperando 3 segundos..."
                    timeout /t 3 /nobreak >nul
                    
                    echo "Archivos desplegados:"
                    dir "%IIS_SITE_PATH%"
                    
                    echo "Verificando con PowerShell..."
                    powershell -Command "try { Invoke-WebRequest -Uri 'http://localhost:2000' -UseBasicParsing -TimeoutSec 5 | Out-Null; Write-Host 'Sitio OK' } catch { Write-Host 'Sitio no responde' }"
                '''
            }
        }
        
        stage('Notificar') {
            steps {
                echo 'Enviando notificación...'
                bat '''
                    echo "Enviando notificación WebSocket..."
                    powershell -Command "try { $data = @{version='%BUILD_VERSION%';project='%PROJECT_NAME%';timestamp=[int64]%BUILD_TIMESTAMP%;message='Deploy exitoso'} | ConvertTo-Json; Invoke-RestMethod -Uri '%WEBSOCKET_URL%/notify-update' -Method Post -Body $data -ContentType 'application/json' -TimeoutSec 5 | Out-Null; Write-Host 'Notificación enviada' } catch { Write-Host 'Error en notificación' }"
                '''
            }
        }
    }
    
    post {
        always {
            bat '''
                echo "=== RESUMEN ==="
                echo "Build: %BUILD_NUMBER%"
                echo "Version: %BUILD_VERSION%"
                echo "Sitio: http://192.168.11.7:2000"
                
                REM Limpiar node_modules para ahorrar espacio
                if exist "node_modules" rd /s /q node_modules 2>nul
            '''
        }
        
        success {
            bat '''
                echo "DEPLOYMENT EXITOSO!"
                echo "La app está disponible en: http://192.168.11.7:2000"
            '''
        }
        
        failure {
            bat '''
                echo "DEPLOYMENT FALLÓ"
                echo "Diagnóstico:"
                if exist "dist" (
                    echo "Build OK - dist existe"
                    dir dist
                ) else (
                    echo "Build FALLÓ - dist no existe"
                )
                
                if exist "%IIS_SITE_PATH%" (
                    echo "IIS directorio existe:"
                    dir "%IIS_SITE_PATH%"
                ) else (
                    echo "IIS directorio no existe"
                )
            '''
        }
    }
}