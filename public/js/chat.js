var typing = false;
var socket = io();
let author = getValue('author'),
    message = getValue('message'),
    messageContainer = document.getElementById('msg-container')

window.onload = () => {
    document.getElementById('message').focus();
    document.getElementById('author').value = getCookie('username'); // to change later
    socket.emit('loadData', {
        sender_id: getCookie('user_id')
    });

}

socket.on('loadData', (data) => {
    data.map((msg) => {
        messageContainer.innerHTML += `<p><strong>${escapeHTML(msg.author)}</strong>: ${escapeHTML(msg.message)}</p>`;
    })
})

socket.on('connect', () => {
    document.getElementById('loading').remove();
})

document.getElementById('message').addEventListener('keyup', (e) => {
    typing = true;
    socket.emit('typing', {
        author: getValue('author')
    })
    timeout = setTimeout(clearTyping, 2000);
});

document.getElementById('message').addEventListener('keypress', (e) => {
    if (e.keyCode == 13 || e.which == 13) {
        e.preventDefault();
        if (getValue('message') != '') {
            socket.emit('message', {
                author: getValue('author'),
                message: getValue('message'),
                sender_id: getCookie('user_id'),
                received_id: 1
            })
            document.getElementById('message').value = '';
        } else {
            if (getValue('message') == '') {
                document.getElementById('message').focus();
            }
        }

        let content = document.getElementById('content');
        content.scrollTop = content.scrollHeight + 200;
    }
})


socket.on('message', (data) => {
    messageContainer.innerHTML += `<p><strong>${escapeHTML(data.author)}</strong>: ${escapeHTML(data.message)}</p>`;
    document.getElementById('message').focus();
});

function clearTyping() {
    typing = false;
    socket.emit("typing", false);
}
socket.on('typing', (data) => {
    if (data && data.author != '') {
        document.getElementById('typing').innerHTML = `<p><strong>${data.author}</strong> está escribiendo...</p>`;
    } else {
        document.getElementById('typing').innerHTML = ``;
    }
})