const mqtt = require("mqtt");

const options = {
    servers: [{
        host: 'localhost',
        port: 1883
    }, {
        host: 'localhost',
        port: 2883
    }]
};

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

