pipeline {
    agent any 

    stages {
        stage('Fetch Code') {
            steps {
                echo 'Pulling the latest code from GitHub...'
                checkout scm
            }
        }

        stage('Build & Launch') {
            steps {
                echo 'Automating the Docker Compose build...'
                // Try with the hyphen version which is standard on older Linux/Jenkins setups
                sh 'docker-compose down' // Stop any old versions first
                sh 'docker-compose up -d --build'
            }
        }

        stage('Health Check') {
            steps {
                echo 'Verifying the API is actually alive via docker exec...'
                sleep 10
                sh 'docker exec motive_stack_1 curl -s -f http://localhost:8080/api/Courses/recent'
            }
        }
    }

    post {
        success {
            echo '🚀 MOTIVE is live and healthy!'
        }
        failure {
            echo '❌ The build or health check failed. Check the logs!'
        }
    }
}
