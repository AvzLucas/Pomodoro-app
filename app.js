const app = require('./server/server')

const http = require('http').Server(app)

const io = require('socket.io')(http)

const route = require('./controller/routing')(io)
// io.on('connection', (socket)=>{
//     console.log('front conectado')
//     socket.emit('listening')
//     socket.on('disconnect', function(){
//         console.log('Desconectado')
//     })
//     socket.on('startTimer',()=> console.log('oi'))
// })



http.listen(80, console.log('The app is live on port 80'))
