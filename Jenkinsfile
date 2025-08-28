pipeline {
    agent any

    environment {
        DEPLOY_DIR = "C:\\Users\\Administrador\\Desktop\\WebAuto"
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Descargando código fuente...'
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: '*/main']],
                    userRemoteConfigs: [[
                        url: 'https://github.com/wuuanito/react-actualizable.git',
                        credentialsId: 'REGISTRY_CREDS'
                    ]]
                ])
                bat 'git log -1 --format="Commit: %%H"'
            }
        }

        stage('Verificar Entorno') {
            steps {
                echo 'Verificando herramientas...'
                bat 'node --version || exit /b 1'
                bat 'npm --version || exit /b 1'
            }
        }

        stage('Instalar Dependencias') {
            steps {
                echo 'Instalando dependencias...'
                bat 'npm ci'
            }
        }

        stage('Build React App') {
            steps {
                echo 'Construyendo aplicación React...'
                bat '''
                    echo "Compilando build de producción..."
                    npm run build || exit /b 1
                '''
            }
        }

        stage('Deploy to IIS') {
            steps {
                echo 'Desplegando a IIS...'

                // Crear directorio de despliegue si no existe
                bat 'if not exist "%DEPLOY_DIR%" mkdir "%DEPLOY_DIR%"'

                // Limpiar contenido previo
                bat 'del /Q "%DEPLOY_DIR%\\*.*" 2>nul'
                bat 'for /D %%i in ("%DEPLOY_DIR%\\*") do rd /s /q "%%i" 2>nul'

                // Copiar nuevo contenido desde dist
                bat '''
                    echo "Copiando archivos de dist..."
                    xcopy "E:\\jenkins-agent\\workspace\\react-auto-deploy\\dist\\*" "%DEPLOY_DIR%\\" /E /I /Y
                    if errorlevel 1 (
                        echo "ERROR: No se pudieron copiar los archivos"
                        exit /b 1
                    )
                '''
            }
        }

        stage('Verificar') {
            steps {
                echo 'Verificando despliegue...'
                bat '''
                    if exist "E:\\jenkins-agent\\workspace\\react-auto-deploy\\dist" (
                        echo "Build OK - dist existe"
                    ) else (
                        echo "Build FALLÓ - dist no existe"
                        exit /b 1
                    )

                    if exist "%DEPLOY_DIR%" (
                        echo "IIS directorio existe:"
                        dir "%DEPLOY_DIR%"
                    ) else (
                        echo "ERROR: IIS directorio no existe"
                        exit /b 1
                    )
                '''
            }
        }
    }

    post {
        success {
            echo "=== DEPLOYMENT EXITOSO ==="
            echo "Build: ${BUILD_NUMBER}"
            echo "Versión: ${GIT_COMMIT}"
            echo "Sitio: http://192.168.11.7:2000"
            
            // Notificar al servidor WebSocket sobre el nuevo deployment
            script {
                try {
                    echo "📡 Enviando notificación de actualización..."
                    
                    def notificationPayload = [
                        buildNumber: "${BUILD_NUMBER}",
                        gitCommit: "${GIT_COMMIT}",
                        project: "react-actualizable",
                        status: "success",
                        deployUrl: "http://192.168.11.7:2000",
                        timestamp: new Date().format("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
                    ]
                    
                    def jsonPayload = groovy.json.JsonBuilder(notificationPayload).toString()
                    
                    // Enviar notificación usando PowerShell
                    bat """
                        powershell -Command "
                        try {
                            \$headers = @{'Content-Type' = 'application/json'}
                            \$body = '${jsonPayload}'
                            \$response = Invoke-RestMethod -Uri 'http://192.168.11.7:6003/notify-deployment' -Method Post -Headers \$headers -Body \$body -TimeoutSec 10
                            Write-Host '✅ Notificación enviada correctamente'
                            Write-Host \$response
                        } catch {
                            Write-Host '⚠️ Error enviando notificación:' \$_.Exception.Message
                            Write-Host 'El deployment fue exitoso pero la notificación falló'
                        }
                        "
                    """
                    
                    echo "🎉 Notificación de actualización enviada"
                    echo "📱 Los usuarios conectados recibirán la notificación automáticamente"
                    
                } catch (Exception e) {
                    echo "⚠️ Error enviando notificación: ${e.getMessage()}"
                    echo "El deployment fue exitoso pero la notificación falló"
                }
            }
        }
        failure {
            echo "=== DEPLOYMENT FALLÓ ==="
            echo "Revisar logs y verificar la etapa de build."
            
            // Opcional: notificar fallo al servidor WebSocket
            script {
                try {
                    def notificationPayload = [
                        buildNumber: "${BUILD_NUMBER}",
                        gitCommit: "${GIT_COMMIT}",
                        project: "react-actualizable",
                        status: "failure",
                        deployUrl: "http://192.168.11.7:2000",
                        timestamp: new Date().format("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
                    ]
                    
                    def jsonPayload = groovy.json.JsonBuilder(notificationPayload).toString()
                    
                    bat """
                        powershell -Command "
                        try {
                            \$headers = @{'Content-Type' = 'application/json'}
                            \$body = '${jsonPayload}'
                            Invoke-RestMethod -Uri 'http://192.168.11.7:6003/notify-deployment' -Method Post -Headers \$headers -Body \$body -TimeoutSec 5
                        } catch {
                            Write-Host 'No se pudo notificar el fallo'
                        }
                        "
                    """
                } catch (Exception e) {
                    // Ignorar errores de notificación en caso de fallo
                }
            }
        }
        always {
            bat 'if exist "node_modules" rd /s /q node_modules 2>nul'
        }
    }
}
