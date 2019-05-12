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
          sh 'scp -r ./dist/* $serverUser@$serverIp:/home/server'
        }
      }
    }
    stage('Start Server') {
      steps {
        withCredentials([
          string(credentialsId: 'bc9956d9-35ac-4302-983e-2a602cd4620d', variable: 'serverIp'),
          string(credentialsId: 'd02f60bc-7c15-44c6-b1e1-470f488ba6bd', variable: 'serverUser'),
        ]) {
          sh 'ssh $serverUser@$serverIp trap "screen -S centcom_server -X quit" QUIT TERM INT EXIT'
          sh 'ssh $serverUser@$serverIp screen -S centcom_server -d node /home/server/bundle'
        }
      }
    }
  }
}