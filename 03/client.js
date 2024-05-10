const mqtt = require("mqtt");
const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '',
});

const user_id = process.argv[2]; //'client1';
const user = { data: { id: user_id, pwd: 'pwd' } };

const client = mqtt.connect({
    host: 'localhost',
    will: {
        topic: 'server/die',
        payload: JSON.stringify({ data: { id: user_id } })
    }
});

client.on("connect", () => {
    client.subscribe(['clients/' + user_id + '/login', 'clients/' + user_id + '/talk']);
    client.publish("server/login", JSON.stringify(user));
});

// login인지, talk인지 구분
client.on("message", (topic, message) => {
    if (topic.endsWith('/login')) process_login(message);
    else if (topic.endsWith('/talk')) process_talk(message);
});

// login 처리
function process_login(message) {
    let res = JSON.parse(message);
    if (!!res.data) rl.prompt();
    else if (!!res.error) client.end();
}

// talk 처리
function process_talk(message) {
    let talk = JSON.parse(message);
    console.log(`${talk.data.from} : ${talk.data.msg}.`);
}

// 화면에서 메세지 받아 톡을 보낸다.
rl.on('line', function (line) {
    if (line === 'exit') rl.close();

    const talk = { data: { from: user_id, room: 'room1', msg: line } };
    client.publish("server/talk", JSON.stringify(talk));

    rl.prompt()
});

// 화면에서 'exit' 라고 입력하면 끝낸다.
rl.on('close', function () {
    if (!!client) client.end();
    process.exit();
});