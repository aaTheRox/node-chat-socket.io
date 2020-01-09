var express = require('express');
var bodyParser = require('body-parser')
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var path = require('path');
const session = require('express-session');

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db/data.json')
const db = low(adapter)

// Set some defaults (required if your JSON file is empty)
db.defaults({ users: [], messages: []})
  .write()

// CONFIG
app.use('/public', express.static('public'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

app.use(session({secret: 'ssshhhhh',saveUninitialized: true,resave: true}));
var sess;
app.get('/', (req, res) =>{
  sess = req.session;
  if(sess.logged) {
    res.render('index');
  } else {
      res.redirect('/login')
  }
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


app.post('/login', (req, res) =>{
    console.log(res.body);
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
      .push({ id: 1, username: data.user, password: data.password})
      .write();
      
      data.status = 'USER_CREATED';
    }
    io.sockets.emit('register', data);
    
});

  socket.on('login', (data)=>{
  console.log('login desde node')

    if(db.get('users').find({username: data.user, password: data.password}).value()) {
      data.status = 'SUCCESS';
      data.response = 'Conectado con éxito';
    } else {
      data.status = 'ERROR';
      data.response = 'Usuario o contraseña incorrectos.';
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
    .push({ sender_id: 2, receiver_id: 1, author: data.author, message: data.message})
    .write();
  });

   socket.on("typing", (data)=>{
    socket.broadcast.emit('typing', data);
  });

});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
