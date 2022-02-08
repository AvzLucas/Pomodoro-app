const timer = require('easytimer.js')

module.exports = function(io){
    let pomodoroCycle = 0;
    console.log(pomodoroCycle)
    let tm = new timer.Timer()
    
    io.on('connection', (socket)=>{
        console.log('front conectado')
              
        socket.emit('listening')

        socket.on('disconnect', function(){
            console.log('Desconectado')
        })

        socket.on('startTimer',()=> {
            console.log('ouvi o evento')
            tm.start({countdown: true, startValues : {seconds : 5}, targetValues : {seconds : 0}})
            tm.addEventListener('targetAchieved',()=>{
                console.log('target achieved')
                socket.emit('pomodoroFinished')
                pomodoroCycle++
                tm.removeAllEventListeners()
            })
        })

        socket.on('postponeBreak', ()=>{
            console.log('adiar a pausa em 10min')
            tm.start({countdown: true, startValues : {seconds : 10}, targetValues : {seconds : 0}})
            tm.addEventListener('targetAchieved',()=>{
                console.log('target achieved')
                socket.emit('pomodoroFinished')
                pomodoroCycle++
                tm.removeAllEventListeners()
            })

        })

        socket.on('break', ()=>{
            console.log('iniciando uma pausa')
            tm.start({countdown: true, startValues : {seconds : 5}, targetValues : {seconds : 0}})        
            tm.addEventListener('targetAchieved', ()=>{
                socket.emit('breakIsOver')
                console.log('pausa encerrada')
                tm.removeAllEventListeners()
            })
        })
    })
}