pipeline {
    agent any

    options {
        disableConcurrentBuilds()
        timestamps()
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    triggers {
        pollSCM('H/5 * * * *')
    }

    tools {
        jdk 'JDK17'
        maven 'Maven3'
        nodejs 'NodeJS20'
    }

    parameters {
        booleanParam(
            name: 'PUSH_DOCKER_IMAGES',
            defaultValue: false,
            description: 'Push the four application images to Docker Hub.'
        )
    }

    environment {
        SONAR_SCANNER_HOME = tool 'SonarScanner'
        COMPOSE_PROJECT_NAME = 'homefixr-ci'
        DOCKERHUB_NAMESPACE = 'hansaniekanayaka'
        IMAGE_TAG = "${BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Backend Build and Tests') {
            steps {
                bat 'mvn -B -ntp -f Backend/pom.xml clean verify'
            }

            post {
                always {
                    junit(
                        allowEmptyResults: true,
                        testResults: 'Backend/**/target/surefire-reports/*.xml'
                    )
                }
            }
        }

        stage('Frontend Build') {
            steps {
                dir('FrontendDesign') {
                    bat 'npm ci'
                    bat 'npm run build'
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    bat '"%SONAR_SCANNER_HOME%\\bin\\sonar-scanner.bat"'
                }
            }
        }

        stage('Docker Compose Build') {
            steps {
                bat 'docker compose build --pull'
            }
        }

        stage('Integration Smoke Test') {
            steps {
                bat 'docker compose up -d'
                powershell '.\\ci\\smoke-test.ps1'
            }
        }

        stage('Push Docker Images') {
            when {
                expression {
                    return params.PUSH_DOCKER_IMAGES
                }
            }

            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub-credentials',
                        usernameVariable: 'DOCKERHUB_USERNAME',
                        passwordVariable: 'DOCKERHUB_PASSWORD'
                    )
                               ]) {
                    bat '''
                        @echo off

                        docker logout >nul 2>&1

                        echo %DOCKERHUB_PASSWORD%| docker login --username %DOCKERHUB_USERNAME% --password-stdin

                        if errorlevel 1 (
                            echo Docker Hub login failed.
                            exit /b 1
                        )
                    '''

                    powershell '''
                        $ErrorActionPreference = "Stop"

                        function Invoke-Docker {
                            param(
                                [string[]]$DockerArguments
                            )

                            & docker @DockerArguments

                            if ($LASTEXITCODE -ne 0) {
                                $command = $DockerArguments -join " "
                                throw "Docker command failed: docker $command"
                            }
                        }

                        $services = @(
                            "booking-service",
                            "provider-service",
                            "notification-service",
                            "frontend"
                        )

                        foreach ($service in $services) {
                            $localImage =
                                "homefixr-ci-${service}:latest"

                            $versionedImage =
                                "$env:DOCKERHUB_NAMESPACE/homefixr-${service}:$env:IMAGE_TAG"

                            $latestImage =
                                "$env:DOCKERHUB_NAMESPACE/homefixr-${service}:latest"

                            Invoke-Docker @(
                                                               "tag",
                                $localImage,
                                $versionedImage
                            )

                            Invoke-Docker @(
                                "tag",
                                $localImage,
                                $latestImage
                            )

                            Invoke-Docker @(
                                "push",
                                $versionedImage
                            )

                            Invoke-Docker @(
                                "push",
                                $latestImage
                            )
                        }
                    '''
                }
            }
        }
    }

    post {
        always {
            bat 'docker compose down -v --remove-orphans || exit /b 0'

            archiveArtifacts(
                artifacts: 'Backend/**/target/*.jar, FrontendDesign/dist/**',
                allowEmptyArchive: true,
                fingerprint: true
            )
        }

        success {
            echo 'CI/CD pipeline completed successfully.'
        }

        failure {
            echo 'Pipeline failed. Open the failed stage and read its first red error.'
        }

        cleanup {
            script {
                if (params.PUSH_DOCKER_IMAGES) {
                    bat 'docker logout || exit /b 0'
                }
            }
        }
    }
}