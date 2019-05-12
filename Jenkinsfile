pipeline {
  agent any
  stages {
    def remote = [:]
    remote.name = 'centcom-cert'
    remote.allowAnyHosts = true

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
          sh 'scp -r ./* $serverUser@$serverIp:/home/server'
        }
      }
    }
    stage('Start Server') {
      steps {
        withCredentials([
          string(credentialsId: 'bc9956d9-35ac-4302-983e-2a602cd4620d', variable: 'serverIp'),
          string(credentialsId: 'd02f60bc-7c15-44c6-b1e1-470f488ba6bd', variable: 'serverUser'),
        ]) {
          remote.host = '$serverIp'
          remote.user = '$serverUser'

          sshCommand remote: remote, command: "cd /home/server; node dist/bundle"
          sshCommand remote: remote, command: "set +e; screen -r -S centcom_server -X quit 2>/dev/null; set -e"
          sshCommand remote: remote, command: "screen -dmS centcom_server bash -c 'cd /home/server \\&\\& node dist/bundle'"
        }
      }
    }
  }
}