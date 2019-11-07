const http = require('http')
const express = require('express')

const path = require('path')

const fs = require('fs');

const util = require('util')

const app = express()
//app.use(express.static('public'))
app.use(express.static(__dirname + '/'));

app.set('port', '3000')

const server = http.createServer(app)
server.on('listening', () => {
 console.log('Listening on port 3000')
})

var connections = [];


app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname,'/index.html'), function(err) {
    if (err) {
      res.status(500).send(err)
    }
  })
})
app.get('/type', function(req, res) {
  res.sendFile(path.join(__dirname,'/type.html'), function(err) {
    if (err) {
      res.status(500).send(err)
    }
  })
})
// Web sockets
const io = require('socket.io')(server)

io.on('connection', (socket) => {
  connections.push(socket.id);
  console.log('Client connected: ' + socket.id)
  console.log('Total clients: '+ connections.length);
  //console.log(io.sockets.clients())
  
  //listen on online_users
  socket.broadcast.emit('online_users', {new_user: socket.id});
  
  
  //fs.writeFile('myjsonfile.json', JSON.stringify(util.inspect(connections)), 'utf8', callback);

  socket.on('mouse', (data) => socket.broadcast.emit('mouse', data))
  
  socket.on('online_users_feedback', (data) => {
    console.log(data);
    io.to(data.to).emit('online_users_feedback_single', data);
  })

  socket.on('show_WPM', (data) => {
    console.log(data);
    socket.broadcast.emit('show_WPM_feedback', {data: data});  
  })

	socket.on('disconnect', () => {
    let connectionIndex = connections.indexOf(socket);
    connections.splice(connectionIndex, 1)
    console.log('Client has disconnected')
    console.log('Total clients: '+ connections.length);
    socket.broadcast.emit('disconnect_user', {id : socket.id})
  })
})

server.listen(process.env.PORT || 3000);