const mqtt = require("mqtt");

const options = {
    port: 1883,
    host: 'stark',
    username: 'client',
    password: 'pwd'
}

const server = mqtt.connect(options);

server.on("connect", () => {
    server.subscribe("server/login");
});

server.on("message", (topic, message) => {
    var data = JSON.parse(message);
    console.log('fake_server', data);
    var client_topic = 'clients/' + data.id;
    if (data.pwd === 'pwd') {
        var res = { msg: 'login ok' };
        server.publish(client_topic, JSON.stringify(res));
    } else {
        var res = { msg: 'login fail' };
        server.publish(client_topic, JSON.stringify(res));
    }
});
