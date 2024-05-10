const mqtt = require("mqtt");
const server = mqtt.connect("mqtt://localhost");

server.on("connect", () => {
    // server.subscribe("server/login");
    server.subscribe("$share/GroupA/server/login");
});

server.on("message", (topic, message) => {
    console.log(process.pid, '가 반응하였음.');
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
