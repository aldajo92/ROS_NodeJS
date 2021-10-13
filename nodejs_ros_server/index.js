// https://joycehong0524.medium.com/simple-android-chatting-app-using-socket-io-all-source-code-provided-7b06bc7b5aff
// https://medium.com/@raj_36650/integrate-socket-io-with-node-js-express-2292ca13d891
const SERVER_PORT = 5170

const app = require('express')()
const server = require('http').Server(app)
const io = require('socket.io')(server)

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
});

server.listen(SERVER_PORT, () => {
  console.log(`listening on *:${SERVER_PORT}`)
})

io.on('connection', (socket) => {
  console.log('A user connected')

  socket.on('disconnect', () => {
    console.log('A user disconnected')
  })

  socket.on('robot-command', (data) => {
    console.log('robot-command triggered')

    const messageData = JSON.parse(data)
    console.log(messageData)
  })
})

const message = {
  velocityEncoder: 0.0,
  input : 0.0
}

setInterval(() => {
  message.velocityEncoder = Math.random() * 100
  message.input = Math.random() * 100
  io.sockets.emit('robot-message', message)
}, 200)

// io.on('connection',function(socket) {

//   //The moment one of your client connected to socket.io server it will obtain socket id
//   //Let's print this out.
//   console.log(`Connection : SocketId = ${socket.id}`)
//   //Since we are going to use userName through whole socket connection, Let's make it global.   
//   var userName = ''

//   socket.on('unsubscribe',function(data) {
//       console.log('unsubscribe trigged')
//       const room_data = JSON.parse(data)
//       const userName = room_data.userName;
//       const roomName = room_data.roomName;

//       console.log(`Username : ${userName} leaved Room Name : ${roomName}`)
//       socket.broadcast.to(`${roomName}`).emit('userLeftChatRoom',userName)
//       socket.leave(`${roomName}`)
//   })

//   //If you want to add typing function you can make it like this.

//   // socket.on('typing',function(roomNumber){ //Only roomNumber is needed here
//   //     console.log('typing triggered')
//   //     socket.broadcast.to(`${roomNumber}`).emit('typing')
//   // })

//   // socket.on('stopTyping',function(roomNumber){ //Only roomNumber is needed here
//   //     console.log('stopTyping triggered')
//   //     socket.broadcast.to(`${roomNumber}`).emit('stopTyping')
//   // })

//   socket.on('disconnect', function () {
//       console.log("One of sockets disconnected from our server.")
//   });
// })


// ROS-NODEJS
if (process.env.ROS_DISTRO == "melodic") {
  const rosnodejs = require('rosnodejs')

  rosnodejs.initNode('/my_node')
    .then(() => {
      // do stuff
    });

  const nh = rosnodejs.nh
  const sub = nh.subscribe('/mockSensor', 'std_msgs/Float32', (msg) => {
    console.log('Got msg on chatter: %j', msg)
    message.value = msg.data
    io.sockets.emit('robot-message', message)
  });


  // const pub = nh.advertise('/chatter', 'std_msgs/String')
  // setInterval(() => {
  //   console.log("publishing")
  //   pub.publish({ data: "hi from nodejs" })
  // }, 1000)
}