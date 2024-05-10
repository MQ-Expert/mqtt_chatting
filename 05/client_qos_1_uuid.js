const mqtt = require("mqtt");
const client = mqtt.connect("mqtt://localhost");
const readline = require("readline");
const { v4: uuidv4 } = require('uuid');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '',
});

const user_id = process.argv[2]; //'client1';
const user = { data: { id: user_id, pwd: 'pwd' } };

client.on("connect", () => {
    client.subscribe(['clients/' + user_id + '/login', 'clients/' + user_id + '/talk']);
    client.publish("server/login", JSON.stringify(user));
});

client.on("message", (topic, message) => {
    if (topic.endsWith('/login')) process_login(message);
    else if (topic.endsWith('/talk')) process_talk(message);
});

function process_login(message) {
    let res = JSON.parse(message);
    if (!!res.data) rl.prompt();
    else if (!!res.error) client.end();
}

function process_talk(message) {
    let talk = JSON.parse(message);
    console.log(`${talk.data.from} : ${talk.data.msg}.`);
}

rl.on('line', function (line) {
    if (line === 'exit') rl.close();

    const talk = { data: { talk_id: uuidv4(), from: user_id, room: 'room1', msg: line } };
    client.publish("server/talk", JSON.stringify(talk), { qos: 1 });

    rl.prompt()
});

rl.on('close', function () {
    if (!!client) client.end();
    process.exit();
});