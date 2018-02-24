const express = require('express');
const WebSocket = require('ws');
const http = require('http');
var gpio = require('pigpio').Gpio;

const motor = new gpio(10, { mode: gpio.OUTPUT });

// Web server.
const app = express();
const server = http.createServer(app);
// Websocket server.
const wss = new WebSocket.Server({ server });

// Serve static.
app.use(express.static('public'));

server.listen(3000, () => console.log(`You can find me on port ${server.address().port}!`));

wss.on('connection', function connection(ws) {
    motor.servoWrite(1450);

    ws.on('message', function incoming(message) {
        const normilized = 1 + parseFloat(message);
        const nextValue = 500 + (normilized * 950);

        motor.servoWrite(parseInt(nextValue));    
    });
});
