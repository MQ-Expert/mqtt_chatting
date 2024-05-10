const mqtt = require("mqtt");
const client = mqtt.connect("mqtt://localhost");

const user = { id: 'client1', pwd: 'pwd' };

client.on("connect", () => {
    client.subscribe("clients/client1");
    client.publish("server/login", JSON.stringify(user));
});

client.on("message", (topic, message) => {
    console.log(message.toString());
    client.end();
});

