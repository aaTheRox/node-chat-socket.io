var typing = false;
var socket = io();
window.onload = () => {
    document.getElementById('login').addEventListener('submit', login);
};

function login() {
    console.log('login')
    socket.emit('login', {
        user: document.getElementById('user').value,
        password: document.getElementById('pass').value
    })
    event.preventDefault();
}

socket.on('login', (data) => {
    console.log(data)
    if(data.status=='LOGIN_SUCCESS') {
        window.location = '/chat';
        document.cookie = `username=${data.username}`;
        document.cookie = `user_id=${data.userId}`;
    } else {
        notification('response', 'login', data.response)
    }
});