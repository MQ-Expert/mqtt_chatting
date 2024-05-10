const mqtt = require("mqtt");

const fs = require('fs')
const path = require('path')
const KEY = fs.readFileSync(path.join(__dirname, '/tls/server.key'))
const CERT = fs.readFileSync(path.join(__dirname, '/tls/server.crt'))
const TRUSTED_CA_LIST = fs.readFileSync(path.join(__dirname, '/tls/ca.crt'))

const options = {
    port: 1883,
    host: 'stark',
    username: 'server',
    password: 'pwd',
    key: KEY,
    cert: CERT,
    rejectUnauthorized: true,
    ca: TRUSTED_CA_LIST,
    protocol: 'mqtts'
}

const server = mqtt.connect(options);

server.on("connect", () => {
    server.subscribe("server/login");
});

server.on("message", (topic, message) => {
    var data = JSON.parse(message);
    var client_topic = 'clients/' + data.id;
    if (data.pwd === 'pwd') {
        var res = { msg: 'login ok' };
        server.publish(client_topic, JSON.stringify(res));
    } else {
        var res = { msg: 'login fail' };
        server.publish(client_topic, JSON.stringify(res));
    }
});
