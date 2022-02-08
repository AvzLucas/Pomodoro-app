angular.module('app', [])
angular.module('app').controller('APIctrl', function($scope, $http){

    const socket = io.connect()

    socket.on('pomodoroFinished', ()=>{
        $scope.sendNotification()
        //show buttons
        $scope.displayButtons('pausar')
        $scope.displayButtons('postponeBtn')
    })

    socket.on('breakIsOver', ()=>{
        $scope.breakIsOverNotification()
        $scope.displayButtons('resumeWork')
        $scope.displayButtons('quit')
    })

    $scope.pomodoroStart = ()=>{
        $scope.resetButtonClasses()
        socket.emit('interaction')
        socket.emit('startTimer')
        let tm = new easytimer.Timer({countdown: true, startValues : {seconds : 5}, targetValues : {seconds : 0}})
        tm.start()
        //dados pro html
        let minutes = document.querySelector('.minutes')
        let seconds = document.querySelector('.seconds')
        
        tm.addEventListener('secondsUpdated', ()=>{
            minutes.innerHTML = tm.getTimeValues().minutes
            seconds.innerHTML = tm.getTimeValues().seconds
        })
    }

    $scope.breakStart = ()=>{
        $scope.resetButtonClasses()
        socket.emit('interaction')
        socket.emit('break')
        let tm = new easytimer.Timer({countdown: true, startValues : {seconds : 5}, targetValues : {seconds : 0}})
        tm.start()
         //dados pro html
         let minutes = document.querySelector('.minutes')
         let seconds = document.querySelector('.seconds')
         
         tm.addEventListener('secondsUpdated', ()=>{
             minutes.innerHTML = tm.getTimeValues().minutes
             seconds.innerHTML = tm.getTimeValues().seconds
         })
    }

    $scope.postpone = ()=>{
        $scope.resetButtonClasses()
        socket.emit('interaction')
        socket.emit('postponeBreak')
        let tm = new easytimer.Timer({countdown: true, startValues : {seconds : 10}, targetValues : {seconds : 0}})
        tm.start()
          //dados pro html
          let minutes = document.querySelector('.minutes')
          let seconds = document.querySelector('.seconds')
          
          tm.addEventListener('secondsUpdated', ()=>{
              minutes.innerHTML = tm.getTimeValues().minutes
              seconds.innerHTML = tm.getTimeValues().seconds
          })
    }

    //envia notificação para o usuário realizar pausa
    $scope.sendNotification = async ()=>{
        //envia pela primeira vez
        let notif = new Notification('Um pomodoro concluído!',{
            body: 'Vamos fazer uma pausa?'
        })
    }
    $scope.breakIsOverNotification = async ()=>{
        let notif = new Notification('Energias recuperadas!',{
            body : 'Podemos retornar?'
        })
    }

    $scope.displayButtons = (button)=>{
        let postponeBtn = document.querySelector('.postpone')
        let pause = document.querySelector('.pausar')
        let quit = document.querySelector('.quit')
        let resumeWork = document.querySelector('.resumeWork')
        switch(button){
            case 'postponeBtn':
                postponeBtn.classList = 'ui inverted red button postpone'
                break;
            case 'pausar' :
                pause.classList = 'ui inverted green button pausar'
                break;
            case 'quit' : 
                quit.classList = 'ui inverted red button button quit'
                break;
            case 'resumeWork' :
                resumeWork.classList = 'ui inverted green button resumeWork'    
        }
    }

    $scope.resetButtonClasses = ()=>{
        let postponeBtn = document.querySelector('.postpone')
        let pause = document.querySelector('.pausar')
        let quit = document.querySelector('.quit')
        let resumeWork = document.querySelector('.resumeWork')
        postponeBtn.classList = 'ui inverted red button hidden postpone'
        pause.classList = 'ui inverted green button hidden pausar'
        quit.classList = 'ui inverted red button button hidden quit'
        resumeWork.classList = 'ui inverted green button hidden resumeWork'    
    }
})