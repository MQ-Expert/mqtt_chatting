const mqtt = require("mqtt");

const options = {
    port: 1883,
    host: 'stark',
    username: 'client',
    password: 'pwd'
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

