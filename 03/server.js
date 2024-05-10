const mqtt = require("mqtt");
const server = mqtt.connect("mqtt://localhost");
const rooms = { 'room1': ['client1', 'client2', 'client3'] };

server.on("connect", () => {
    server.subscribe(["server/login", "server/talk", "server/die"]);
});

// login인지, talk인지 구분
server.on("message", (topic, message) => {
    console.log('received: ', topic, JSON.parse(message));
    if (topic.endsWith('/login')) process_login(message);
    else if (topic.endsWith('/talk')) process_talk(message);
    else if (topic.endsWith('/die')) process_die(message);
});

// login 처리
function process_login(message) {
    let json = JSON.parse(message);
    let client_topic = 'clients/' + json.data.id + '/login';
    if (json.data.pwd === 'pwd') {
        let res = { data: { msg: 'login ok' } };
        server.publish(client_topic, JSON.stringify(res));
    } else {
        let res = { error: { code: 404, msg: 'pwd mismatch' } };
        server.publish(client_topic, JSON.stringify(res));
    }
}

// talk 처리
function process_talk(message) {
    let talk = JSON.parse(message);
    let room = rooms[talk.data.room];
    room.forEach(client => {
        if (talk.data.from === client) return false;
        let client_topic = 'clients/' + client + '/talk';
        server.publish(client_topic, message);
    });
}

function process_die(message) {
    let json = JSON.parse(message);
    // set_user_state_on_db(json.data.user_id,'inactive');
}
