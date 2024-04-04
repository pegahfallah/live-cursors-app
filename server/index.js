const http = require('http');
const { WebSocketServer } = require('ws');
const { v4: uuidv4 } = require('uuid');
const url = require('url');

const server = http.createServer(); // Fixed: no argument needed
const wsServer = new WebSocketServer({ server });

const port = 8000;
const connections = {};
const users = {};

// broadcast to any connected client 
const broadcast = () => {
    Object.keys(connections).forEach(uuid => {
        const connection = connections[uuid];
        const message = JSON.stringify(users);
        connection.send(message);
    });
};

const handleMessage = (bytes, uuid) => {
    const message = JSON.parse(bytes.toString());
    const user = users[uuid];
    user.state = message;

    broadcast();

    console.log(message);
};

const handleClose = uuid => {
    return () => { 
        delete connections[uuid]; 
        delete users[uuid]; 
        broadcast(); 
    };
};

wsServer.on("connection", (connection, request) => {
    const { username } = url.parse(request.url, true).query;
    const uuid = uuidv4();

    console.log(uuid);
    console.log(username);

    connections[uuid] = connection;
    users[uuid] = {
        username: username,
        state: {}
    };

    connection.on("message", message => handleMessage(message, uuid));
    connection.on("close", handleClose(uuid));
});

server.listen(port, () => {
    console.log(`WS running on ${port}`);
});
