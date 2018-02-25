const express = require('express');
const WebSocket = require('ws');
const http = require('http');
var gpio = require('pigpio').Gpio;

const steering = new gpio(10, { mode: gpio.OUTPUT });
const drive = new gpio(25, {mode: gpio.OUTPUT});
const in1 = new gpio(23, { mode: gpio.OUTPUT });
const in2 = new gpio(24, { mode: gpio.OUTPUT });

// Web server.
const app = express();
const server = http.createServer(app);
// Websocket server.
const wss = new WebSocket.Server({ server });

// Serve static.
app.use(express.static('public'));

server.listen(3000, () => console.log(`You can find me on port ${server.address().port}!`));

// Websocket connection have been established.
wss.on('connection', function connection(ws) {
    // Setting the steering control in the middle position.
    steering.servoWrite(1450);
    // Setting the transmission to the neutral position.
    in1.digitalWrite(0);
    in2.digitalWrite(0);
    // drive.pwmFrequency(50);
    drive.pwmWrite(0);

    ws.on('message', function incoming(message) {
        const params = JSON.parse(message);

        // Setting a next state of the steering.
        const normilized = 1 + parseFloat(params.steering);
        const nextValue = 500 + (normilized * 950);

        steering.servoWrite(parseInt(nextValue));
        
        // Setting a next state of the drive.
        if (params.drive > 0.1) {
            in1.digitalWrite(1);
            in2.digitalWrite(0);
        } else if (params.drive < -0.1) {
            in1.digitalWrite(0);
            in2.digitalWrite(1);
        } else {
            in1.digitalWrite(0);
            in2.digitalWrite(0);
        }

        const valueWithoutSign = `${params.drive}`.replace('-', '');
        const nextDriveValue = parseInt(255 * parseFloat(valueWithoutSign));

        drive.pwmWrite(nextDriveValue);
    });
});
