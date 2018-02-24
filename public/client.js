const socket = new WebSocket("ws://192.168.1.106:3000");

socket.onopen = () => {
    console.log("Соединение установлено.");
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

function loop () {
    const currentGamepadState = navigator.getGamepads()[gamepadIndex];
    document.getElementById('a').innerHTML = currentGamepadState.axes[0];
    document.getElementById('b').innerHTML = currentGamepadState.axes[1];
    document.getElementById('c').innerHTML = currentGamepadState.axes[2];
    document.getElementById('d').innerHTML = currentGamepadState.axes[3];

    socket.send(currentGamepadState.axes[0]);
}

window.addEventListener('gamepadconnected', (e) => {
    gamepadIndex = event.gamepad.index;
}, false);
window.addEventListener('gamepaddisconnected', (e) => {
    clearInterval(gamepadLoop);
}, false);