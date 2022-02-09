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
            socket.offAny('pauseTimer',()=>{
                tm.pause()
            })
            socket.offAny('resumeTimer',  ()=>{
                tm.start()
            })
            console.log('ouvi o evento')
            if(pomodoroCycle == 5){
                tm.start({countdown: true, startValues : {seconds : 10}, targetValues : {seconds : 0}})
            }else{
                tm.start({countdown: true, startValues : {seconds : 5}, targetValues : {seconds : 0}})
            }
            // listen for pause and resume
            socket.on('pauseTimer', ()=>{
                tm.pause()
            })

            socket.on('resumeTimer', ()=>{
                tm.start()
            })

            tm.addEventListener('targetAchieved',()=>{
                console.log('target achieved')

                socket.emit('pomodoroFinished')

                let interv = setInterval(()=>{
                    socket.emit('pomodoroFinished')
                }, 10000)

                socket.on('interaction',()=>{
                    clearInterval(interv)
                })

                pomodoroCycle++
                tm.removeAllEventListeners()
            })
        })

        socket.on('postponeBreak', ()=>{
            socket.offAny('pauseTimer',  ()=>{
                tm.pause()
            })
            socket.offAny('resumeTimer', ()=>{
                tm.start()
            })
            console.log('adiar a pausa em 10min')
            tm.start({countdown: true, startValues : {seconds : 10}, targetValues : {seconds : 0}})

            // listen for pause and resume
            socket.on('pauseTimer', ()=>{
                tm.pause()
            })

            socket.on('resumeTimer', ()=>{
                tm.start()
            })


            tm.addEventListener('targetAchieved', ()=>{
                console.log('target achieved')

                socket.emit('pomodoroFinished')

                let interv = setInterval(()=>{
                    socket.emit('pomodoroFinished')
                }, 10000)

                socket.on('interaction',()=>{
                    clearInterval(interv)
                })

                tm.removeAllEventListeners()
            })
        })

        socket.on('break', ()=>{
            socket.offAny('pauseTimer', ()=>{
                tm.pause()
            })
            socket.offAny('resumeTimer', ()=>{
                tm.start()
            })
            console.log('iniciando uma pausa')
            tm.start({countdown: true, startValues : {seconds : 5}, targetValues : {seconds : 0}})     
            // listen for pause and resume timer 
            socket.on('pauseTimer', ()=>{
                tm.pause()
            })

            socket.on('resumeTimer', ()=>{
                tm.start()
            })
  
            tm.addEventListener('targetAchieved', ()=>{
                socket.emit('breakIsOver')
                let interv = setInterval(()=>{
                    socket.emit('breakIsOver')
                }, 10000)

                socket.on('interaction',()=>{
                    clearInterval(interv)
                })

                console.log('pausa encerrada')
                tm.removeAllEventListeners()
            })
        })
    })
}