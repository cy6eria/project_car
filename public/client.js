const socket = new WebSocket('ws://' + window.location.host);

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

    socket.send(JSON.stringify({
        steering: -1*currentGamepadState.axes[2],
        drive: currentGamepadState.axes[1]
    }));
}

window.addEventListener('gamepadconnected', (e) => {
    gamepadIndex = event.gamepad.index;
}, false);
window.addEventListener('gamepaddisconnected', (e) => {
    clearInterval(gamepadLoop);
}, false);