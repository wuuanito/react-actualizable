pipeline {
    agent any

    environment {
        // Credenciales para GitHub o Docker si fuera necesario
        REGISTRY_CREDS = credentials('REGISTRY_CREDS')
        BACKUP_DIR = "C:\\Backups\\WebAuto\\build-${BUILD_NUMBER}"
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
        bat('git log -1 --format="Commit: %%H"')
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

                // Crear carpeta de backup si no existe
                bat 'if not exist "C:\\Backups\\WebAuto" mkdir "C:\\Backups\\WebAuto"'
                bat 'mkdir "${BACKUP_DIR}"'

                // Si hay contenido previo, hacer backup
                bat '''
                    if exist "${DEPLOY_DIR}\\index.html" (
                        echo "Creando backup..."
                        xcopy "${DEPLOY_DIR}\\*" "${BACKUP_DIR}\\" /E /I /Y /Q
                    )
                '''

                // Crear directorio de despliegue si no existe
                bat 'if not exist "${DEPLOY_DIR}" mkdir "${DEPLOY_DIR}"'

                // Limpiar contenido previo
                bat 'del /Q "${DEPLOY_DIR}\\*.*" 2>nul'
                bat 'for /D %%i in ("${DEPLOY_DIR}\\*") do rd /s /q "%%i" 2>nul'

                // Copiar nuevo contenido desde dist
                bat '''
                    echo "Copiando archivos de dist..."
                    xcopy "dist\\*" "${DEPLOY_DIR}\\" /E /I /Y
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
                    if exist "dist" (
                        echo "Build OK - dist existe"
                    ) else (
                        echo "Build FALLÓ - dist no existe"
                        exit /b 1
                    )

                    if exist "${DEPLOY_DIR}" (
                        echo "IIS directorio existe:"
                        dir "${DEPLOY_DIR}"
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
            echo "Version: ${GIT_COMMIT}"
            echo "Sitio: http://192.168.11.7:2000"
        }
        failure {
            echo "=== DEPLOYMENT FALLÓ ==="
            echo "Revisar logs y verificar la etapa de build."
        }
        always {
            // Liberar espacio en el agente
            bat 'if exist "node_modules" rd /s /q node_modules 2>nul'
        }
    }
}
