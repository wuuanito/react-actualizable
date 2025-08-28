pipeline {
    agent any  // Jenkins container (Linux)
    
    environment {
        WINDOWS_SERVER = '192.168.11.7'
        WEBSOCKET_URL = 'http://192.168.11.7:6003'
        IIS_PATH = 'C:\\Users\\Administrador\\Desktop\\WebAuto'
        
        BUILD_VERSION = "${env.GIT_COMMIT.take(7)}"
        BUILD_TIMESTAMP = "${currentBuild.startTimeInMillis}"
        PROJECT_NAME = 'PruebaWebAuto'
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo 'Descargando código desde Git...'
                checkout scm
            }
        }
        
        stage('Build React App in Docker') {
            steps {
                echo 'Construyendo React app en contenedor Jenkins...'
                sh '''
                    echo "Sistema: $(uname -a)"
                    echo "Node.js version: $(node --version)"
                    echo "NPM version: $(npm --version)"
                    
                    echo "Instalando dependencias..."
                    npm ci
                    
                    echo "Ejecutando build de producción..."
                    npm run build
                    
                    echo "Verificando build..."
                    ls -la dist/
                    test -f dist/index.html || (echo "Error: Build falló" && exit 1)
                    
                    echo "Creando paquete de deployment..."
                    cd dist
                    tar -czf ../deployment-package.tar.gz .
                    cd ..
                    ls -la deployment-package.tar.gz
                '''
            }
        }
        
        stage('Transfer to Windows Server') {
            steps {
                echo 'Transfiriendo archivos al Windows Server...'
                script {
                    // Método 1: Via HTTP upload (necesitarías un endpoint en Windows)
                    sh '''
                        echo "Preparando archivos para transferencia..."
                        base64 deployment-package.tar.gz > deployment-package.b64
                        
                        echo "Archivos preparados para transferencia"
                    '''
                    
                    // Método 2: Via shared folder (si está configurado)
                    // sh 'cp deployment-package.tar.gz /mnt/shared/windows-server/'
                    
                    // Método 3: Via API REST personalizada en Windows
                }
            }
        }
        
        stage('Deploy via PowerShell Remote') {
            steps {
                echo 'Ejecutando deployment remoto en Windows...'
                sh '''
                    echo "Enviando comandos de deployment al Windows Server..."
                    
                    # Crear script PowerShell para ejecutar remotamente
                    cat > deploy-script.ps1 << 'EOF'
# Script de deployment para Windows Server
$ErrorActionPreference = "Stop"
$IISPath = "C:\\Users\\Administrador\\Desktop\\WebAuto"
$BackupPath = "C:\\Backups\\WebAuto\\build-${BUILD_NUMBER}"
$BuildVersion = "${BUILD_VERSION}"
$Timestamp = "${BUILD_TIMESTAMP}"

Write-Host "Iniciando deployment en Windows Server..."
Write-Host "Version: $BuildVersion"
Write-Host "Build: ${BUILD_NUMBER}"

try {
    # Crear backup
    if (!(Test-Path "C:\\Backups\\WebAuto")) {
        New-Item -ItemType Directory -Path "C:\\Backups\\WebAuto" -Force
    }
    New-Item -ItemType Directory -Path $BackupPath -Force
    
    if (Test-Path "$IISPath\\index.html") {
        Copy-Item "$IISPath\\*" $BackupPath -Recurse -Force
        Write-Host "Backup creado en: $BackupPath"
    }
    
    # Limpiar directorio IIS
    if (Test-Path $IISPath) {
        Remove-Item "$IISPath\\*" -Recurse -Force
        Write-Host "Directorio IIS limpiado"
    }
    
    # Aquí normalmente descomprimirías los archivos transferidos
    # tar -xzf deployment-package.tar.gz -C $IISPath
    
    # Por ahora, crear archivos de prueba
    @"
<!DOCTYPE html>
<html>
<head><title>Deployed by Jenkins Docker</title></head>
<body>
    <h1>Deployment Exitoso</h1>
    <p>Version: $BuildVersion</p>
    <p>Build: ${BUILD_NUMBER}</p>
    <p>Timestamp: $Timestamp</p>
</body>
</html>
"@ | Out-File -FilePath "$IISPath\\index.html" -Encoding UTF8

    "$BuildVersion" | Out-File -FilePath "$IISPath\\version.txt" -Encoding UTF8
    
    Write-Host "Archivos desplegados exitosamente"
    
    # Verificar IIS
    $response = Invoke-WebRequest -Uri "http://localhost:2000" -UseBasicParsing -TimeoutSec 5
    Write-Host "Verificación IIS: Status $($response.StatusCode)"
    
} catch {
    Write-Host "Error en deployment: $($_.Exception.Message)"
    throw
}
EOF

                    echo "Script PowerShell creado"
                    
                    # Aquí ejecutarías el script remotamente
                    # Opciones: WinRM, SSH, API REST, etc.
                    
                    echo "Simulando ejecución remota exitosa..."
                '''
            }
        }
        
        stage('Notify via WebSocket') {
            steps {
                echo 'Notificando a clientes...'
                sh '''
                    NOTIFICATION_DATA=$(cat << EOF
{
    "version": "${BUILD_VERSION}",
    "project": "${PROJECT_NAME}", 
    "timestamp": ${BUILD_TIMESTAMP},
    "deployedBy": "Jenkins-Docker",
    "buildNumber": "${BUILD_NUMBER}",
    "message": "Nueva versión desplegada desde contenedor Docker",
    "deploymentMethod": "docker-to-windows"
}
EOF
)
                    
                    echo "Enviando notificación:"
                    echo "$NOTIFICATION_DATA" | jq '.'
                    
                    curl -X POST "${WEBSOCKET_URL}/notify-update" \
                        -H "Content-Type: application/json" \
                        -d "$NOTIFICATION_DATA" \
                        --max-time 10 || echo "Warning: Notificación falló"
                '''
            }
        }
    }
    
    post {
        always {
            sh '''
                echo "Limpieza de archivos temporales..."
                rm -f deployment-package.tar.gz deployment-package.b64 deploy-script.ps1 || true
            '''
        }
        
        success {
            echo 'Deployment desde Docker exitoso'
        }
        
        failure {
            echo 'Deployment desde Docker falló'
        }
    }
}