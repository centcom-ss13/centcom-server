def remote = [:]
remote.name = 'centcom-cert'
remote.allowAnyHosts = true
remote.host = '134.209.42.179'
remote.user = 'jenkins'

pipeline {
  agent any
  stages {

    stage('Install') {
      steps {
        nodejs('main') {
          sh 'npm ci'
        }
      }
    }
    stage('Test') {
      steps {
        nodejs('main') {
          sh 'npm run test'
        }

      }
    }
    stage('Build') {
      steps {
        nodejs('main') {
          sh 'npm run build'
        }
      }
    }
    stage('Archive') {
      steps {
        archiveArtifacts 'dist/'
      }
    }
    stage('Upload') {
      steps {
        withCredentials([
          string(credentialsId: 'bc9956d9-35ac-4302-983e-2a602cd4620d', variable: 'serverIp'),
          string(credentialsId: 'd02f60bc-7c15-44c6-b1e1-470f488ba6bd', variable: 'serverUser'),
        ]) {
          sh 'scp -r ./config ./database.json ./dist ./package-lock.json ./package.json ./src ./webpack.config.js ./babel.config.js $serverUser@$serverIp:/home/server'
        }
      }
    }
    stage('Start Server') {
      steps {
        withCredentials([
          string(credentialsId: 'bc9956d9-35ac-4302-983e-2a602cd4620d', variable: 'serverIp'),
          string(credentialsId: 'd02f60bc-7c15-44c6-b1e1-470f488ba6bd', variable: 'serverUser'),
        ]) {
          sshCommand remote: remote, command: "cd /home/server; npm ci; npm run build"
          sshCommand remote: remote, command: "set +e; screen -r -S centcom_server -X quit 2>/dev/null; set -e"
          sshCommand remote: remote, command: "screen -dmS centcom_server bash -c 'cd /home/server \\&\\& node dist/bundle'"
        }
      }
    }
  }
}