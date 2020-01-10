var socket = io();
window.onload = () => {
    socket.emit('getConnectedUsers');
}
socket.on('getConnectedUsers', (data) => {
    console.log(data);
})