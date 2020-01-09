var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var path = require('path');

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const messages = new FileSync('db/inbox/messages.json')
let dbmessages = low(messages)
const users = new FileSync('db/users/user.json')
db = low(users)

// Set some defaults (required if your JSON file is empty)
dbmessages.defaults({ messages: []})
  .write()

app.use('/public', express.static('public'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.get('/', function(req, res){
  res.render('index');
});

io.on('connection', function(socket){

  socket.on("message", (data)=>{
    console.log(data)
    io.sockets.emit('message', data);

    // Add a post
  dbmessages.get('messages')
    .push({ id: 1, user_id: 1, author: data.author, message: data.message})
    .write();
  });

   socket.on("typing", (data)=>{
    socket.broadcast.emit('typing', data);
  });

});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
