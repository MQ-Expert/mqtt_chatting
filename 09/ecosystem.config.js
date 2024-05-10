module.exports = {
  apps: [{
    name: 'server',
    script: './server.js',
    instances: 'max',
    exec_mode: 'cluster'
  }]
}