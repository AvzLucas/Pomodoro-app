angular.module('app', [])
angular.module('app').controller('APIctrl', function($scope, $http){
    $scope.pomodoroCounter = 0
    $scope.qtPomodoro = 0
    let tm = new easytimer.Timer()
    let pauseBtn = document.querySelector('.pausar')
    let playBtn = document.querySelector('.playBtn')
    const socket = io.connect()

    socket.on('pomodoroFinished', ()=>{
        $scope.pomodoroCounter++
        $scope.qtPomodoro++
        $scope.sendNotification()
        //show buttons
        $scope.displayButtons('break')
        $scope.displayButtons('postponeBtn')
        //show message
        $scope.displayMessage('pomodoroNotif')
    })

    socket.on('breakIsOver', ()=>{
        $scope.breakIsOverNotification()
        $scope.displayButtons('resumeWork')
        $scope.displayButtons('quit')
        $scope.displayMessage('breakIsOver')
    })

    $scope.pomodoroStart = ()=>{
        $scope.resetMessageClasses()
        $scope.resetButtonClasses()
        
        // remover listeners anteriores dos botoes
        pauseBtn.removeEventListener('click',  ()=>{
            pauseBtn.classList = 'ui button pausar center aligned disabled'
            playBtn.classList = 'ui button playBtn center aligned'
            socket.emit('pauseTimer')
            tm.pause()
        })
        playBtn.removeEventListener('click', ()=>{
            playBtn.classList = 'ui button playBtn center aligned disabled'
            pauseBtn.classList = 'ui button pausar center aligned'
            socket.emit('resumeTimer')
            tm.start()
        })
        
        socket.emit('interaction')
        socket.emit('startTimer')
    
        tm.start({countdown: true, startValues : {minutes : 25}, targetValues : {seconds : 0}})

        pauseBtn.addEventListener('click', ()=>{
            pauseBtn.classList = 'ui button pausar center aligned disabled'
            playBtn.classList = 'ui button playBtn center aligned'
            socket.emit('pauseTimer')
            tm.pause()
        })

        playBtn.addEventListener('click', ()=>{
            playBtn.classList = 'ui button playBtn center aligned disabled'
            pauseBtn.classList = 'ui button pausar center aligned'
            socket.emit('resumeTimer')
            tm.start()
        })

        //dados pro html
        let minutes = document.querySelector('.minutes')
        let seconds = document.querySelector('.seconds')
        
        tm.addEventListener('secondsUpdated', ()=>{
            minutes.innerHTML = tm.getTimeValues().minutes
            seconds.innerHTML = tm.getTimeValues().seconds
        })
    }

    $scope.breakStart = ()=>{
        $scope.resetMessageClasses()
        $scope.resetButtonClasses()
        // remove prior event Listeners from buttons
        pauseBtn.removeEventListener('click',  ()=>{
            pauseBtn.classList = 'ui button pausar center aligned disabled'
            playBtn.classList = 'ui button playBtn center aligned'
            socket.emit('pauseTimer')
            tm.pause()
        })
        playBtn.removeEventListener('click', ()=>{
            playBtn.classList = 'ui button playBtn center aligned disabled'
            pauseBtn.classList = 'ui button pausar center aligned'
            socket.emit('resumeTimer')
            tm.start()
        })

        socket.emit('interaction')
        socket.emit('break')
        if($scope.pomodoroCounter == 5){
            tm.start({countdown: true, startValues : {minutes : 15}, targetValues : {seconds : 0}})
            $scope.pomodoroCounter = 0
        }else{
            tm.start({countdown: true, startValues : {minutes : 5}, targetValues : {seconds : 0}})
        }

        pauseBtn.addEventListener('click', ()=>{
            pauseBtn.classList = 'ui button pausar center aligned disabled'
            playBtn.classList = 'ui button playBtn center aligned'
            socket.emit('pauseTimer')
            tm.pause()
        })

        playBtn.addEventListener('click', ()=>{
            playBtn.classList = 'ui button playBtn center aligned disabled'
            pauseBtn.classList = 'ui button pausar center aligned'
            socket.emit('resumeTimer')
            tm.start()
        })
        
         //dados pro html
         let minutes = document.querySelector('.minutes')
         let seconds = document.querySelector('.seconds')
         
         tm.addEventListener('secondsUpdated', ()=>{
             minutes.innerHTML = tm.getTimeValues().minutes
             seconds.innerHTML = tm.getTimeValues().seconds
         })
    }

    $scope.postpone = ()=>{
        $scope.resetMessageClasses()
        $scope.resetButtonClasses()
        socket.emit('interaction')
        socket.emit('postponeBreak')
        tm.start({countdown: true, startValues : {minutes : 10}, targetValues : {seconds : 0}})
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
        let pause = document.querySelector('.break')
        let quit = document.querySelector('.quit')
        let resumeWork = document.querySelector('.resumeWork')
        switch(button){
            case 'postponeBtn':
                postponeBtn.classList = 'ui inverted red button postpone'
                break;
            case 'break' :
                pause.classList = 'ui inverted green button break'
                break;
            case 'quit' : 
                quit.classList = 'ui inverted red button button quit'
                break;
            case 'resumeWork' :
                resumeWork.classList = 'ui inverted green button resumeWork'    
        }
    }

    $scope.displayMessage = (c) => {
        let pomodoroMsg = document.querySelector('.pomodoroNotif')
        let breakIsOver = document.querySelector('.breakIsOver')

        switch(c){
            case 'pomodoroNotif':
                pomodoroMsg.classList = 'message ui padded segment pomodoroNotif '
                break;
            case 'breakIsOver' :
                breakIsOver.classList = 'message ui padded segment breakIsOver '
                break;
            }
    }

    $scope.resetMessageClasses = ()=>{
        let pomodoroMsg = document.querySelector('.pomodoroNotif')
        let breakIsOver = document.querySelector('.breakIsOver')

        pomodoroMsg.classList = 'pomodoroNotif hidden'
        breakIsOver.classList = 'breakIsOver hidden'
    }

    $scope.resetButtonClasses = () => {
        let postponeBtn = document.querySelector('.postpone')
        let pause = document.querySelector('.break')
        let quit = document.querySelector('.quit')
        let resumeWork = document.querySelector('.resumeWork')
        postponeBtn.classList = 'ui inverted red button hidden postpone'
        pause.classList = 'ui inverted green button hidden break'
        quit.classList = 'ui inverted red button button hidden quit'
        resumeWork.classList = 'ui inverted green button hidden resumeWork'    
    }

})