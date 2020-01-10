var express = require('express');
var bodyParser = require('body-parser')
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var path = require('path');

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db/data.json')
const db = low(adapter)

db.defaults({ users: [], messages: []})
  .write()

// CONFIG
app.use('/public', express.static('public'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())


// ROUTING
app.get('/', (req, res) =>{
    res.render('index');
});

app.get('/chat', (req, res) =>{
  sess = req.session;
    res.render('chat');
});

app.get('/login', (req, res) =>{
    res.render('login');
});
app.get('/register', (req, res) =>{
    res.render('register');
});



io.on('connection', function(socket){
  socket.on('register', (data)=>{
    let uniqueID = Math.random().toString(36).slice(2);

    const user = db
    .get('users')
    .find({ username:  data.user })
    .value()

    if(user!=undefined) {
      data.status = 'USER_ALREADY_EXISTS';
    } else {
       db.get('users')
      .push({ id: uniqueID, username: data.user, password: data.password})
      .write();
      
     data = { status: 'USER_CREATED' }
    }
    io.sockets.emit('register', data);
    
});

  socket.on('login', (data)=>{
    const user = db.get('users').find({username: data.user, password: data.password}).value();
    console.log()
    if(user) {
      data = {
        status: 'LOGIN_SUCCESS',
        userId: user.id,
        username: user.username,
        response: 'Conectado con éxito'
      }
    } else {
      data = {
        status: 'LOGIN_ERROR',
        response: 'Usuario o contraseña incorrectos.'
      }
    }
    io.sockets.emit('login', data);
});

socket.on('loadData', (res) => {
  const messages = db.get('messages').value().filter((message) => message.sender_id===res.sender_id); // filter by user id 
  io.sockets.emit('loadData', messages)
})

socket.on("message", (data)=>{
  console.log(data)
  io.sockets.emit('message', data);

  // Add a post
db.get('messages')
  .push({ sender_id: data.sender_id, receiver_id: 1, author: data.author, message: data.message})
  .write();
});

socket.on("typing", (data)=>{
  socket.broadcast.emit('typing', data);
});

socket.on('getConnectedUsers', (data) => {
  const res = {};
  //const res = {users: [{username: 'pepe'},{username: 'pato'},{username: 'juan'}]}
  io.sockets.emit('getConnectedUsers', res);
})


});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
