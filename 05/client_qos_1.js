const mqtt = require("mqtt");
const client = mqtt.connect("mqtt://localhost");

const user = { id: 'client1', pwd: 'pwd' };

client.on("connect", () => {
    client.subscribe("clients/client1");
    client.publish("server/payload", 'hi', { qos: 1 }, (err, res) => {
        if (err) console.log('err', err);
        else console.dir(res);

        client.end();
    });
});


