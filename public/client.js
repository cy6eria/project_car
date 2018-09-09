const uri = 'ws://' + window.location.host;
const canvas = document.getElementById('canvas');
const wsavc = new WSAvcPlayer(canvas, "webgl", 1, 35);
const socket = new WebSocket(uri);

socket.onopen = () => {
    console.log("Соединение установлено.");
    wsavc.connect(socket);
    wsavc.playStream();
    gamepadLoop = setInterval(loop, 50);
};

socket.onclose = () => {
    console.log("Соединение разорвано.");
    clearInterval(gamepadLoop);
};

socket.onmessage = (event) => {
    console.log("Получены данные " + event.data);
};

let gamepadLoop;
let gamepadIndex;
let drive = '0';
let steering = '0';

function loop () {
    if (gamepadIndex >= 0) {
        const currentGamepadState = navigator.getGamepads()[gamepadIndex];

        const currentSteering = currentGamepadState.axes[2].toFixed(1);
        const currentDrive = currentGamepadState.axes[1].toFixed(1);

        if (drive !== currentDrive || steering !== currentSteering) {
            drive = currentDrive;
            steering = currentSteering;

            socket.send(JSON.stringify({
                steering: -1*currentSteering,
                drive: currentDrive*1
            }));
        }
    }
}

window.addEventListener('gamepadconnected', (e) => {
    gamepadIndex = event.gamepad.index;
}, false);
window.addEventListener('gamepaddisconnected', (e) => {
    clearInterval(gamepadLoop);
}, false);
