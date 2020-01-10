var typing = false;
var socket = io();
window.onload = () => {
    document.getElementById('register').addEventListener('submit', register);
};

function register() {
    console.log('register')
    if(document.getElementById('user').value !== '' && document.getElementById('pass').value !== ''){
        socket.emit('register', {
            user: document.getElementById('user').value,
            password: document.getElementById('pass').value
        })
    } else {
        notification('response', 'register', 'Indica un usuario y contraseña')
    }
    event.preventDefault();
}
socket.on('register', (data) => {
    console.log(data)
    if(data.status=='USER_CREATED') {
        window.location = '/chat';
        document.cookie('username', data.username)

    } else {
        notification('response', 'register', data)
        console.log(data)
    }
});