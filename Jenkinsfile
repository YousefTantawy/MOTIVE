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
                // We use -d so Jenkins doesn't hang waiting for logs
                sh 'docker compose up -d --build'
            }
        }

        stage('Health Check') {
            steps {
                echo 'Verifying the API is actually alive...'
                // This is the exact curl command you just ran!
                // We give it a few seconds to boot up first.
                sh 'sleep 10 && curl http://localhost:5168/api/Courses/recent'
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
