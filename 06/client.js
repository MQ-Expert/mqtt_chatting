const mqtt = require("mqtt");

const fs = require('fs')
const path = require('path')
const KEY = fs.readFileSync(path.join(__dirname, '/tls/client.key'))
const CERT = fs.readFileSync(path.join(__dirname, '/tls/client.crt'))
const TRUSTED_CA_LIST = fs.readFileSync(path.join(__dirname, '/tls/ca.crt'))

const options = {
    port: 1883,
    host: 'stark',
    username: 'client',
    password: 'pwd',
    key: KEY,
    cert: CERT,
    rejectUnauthorized: true,
    ca: TRUSTED_CA_LIST,
    protocol: 'mqtts'
}


const client = mqtt.connect(options);

const user = { id: 'client1', pwd: 'pwd' };

client.on("connect", () => {
    client.subscribe("clients/client1");
    client.publish("server/login", JSON.stringify(user));
});

client.on("message", (topic, message) => {
    console.log(message.toString());
    client.end();
});

