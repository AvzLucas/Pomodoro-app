angular.module('app', [])
angular.module('app').controller('APIctrl', function($scope, $http){



    $scope.qtPomodoro = 0
    $scope.pomodoroCounter = 0
    let pauseBtn = document.querySelector('.pausar')
    let playBtn = document.querySelector('.playBtn')
    const socket = io.connect()

    let minutes = document.querySelector('.minutes')
    let seconds = document.querySelector('.seconds')
    socket.on('message', (data)=>{
        minutes.innerHTML = data.minutes
        seconds.innerHTML = data.seconds
    })

    socket.on('pomodoroFinished', (dado)=>{
        $scope.pomodoroCounter = dado.pomodoroCycle
        $scope.qtPomodoro = dado.totalPomodoro
        console.log(dado)
    
        $scope.sendNotification()
        //show buttons
        $scope.displayButtons('break')
        $scope.displayButtons('postponeBtn')
        //show message
        if($scope.pomodoroCounter == 5){
            $scope.displayMessage('fifthPomodoro')
        }else{
            $scope.displayMessage('pomodoroNotif')
        }  
    })

    socket.on('breakIsOver', ()=>{
        $scope.breakIsOverNotification()
        $scope.displayButtons('resumeWork')
        $scope.displayButtons('quit')
        $scope.displayMessage('breakIsOver')
    })

    $scope.pomodoroStart = ()=>{
        playBtn.classList = 'ui button playBtn center aligned disabled'
        pauseBtn.classList = 'ui button pausar center aligned'

        $scope.resetMessageClasses()
        $scope.resetButtonClasses()
       
         // remover listeners anteriores dos botoes
         pauseBtn.removeEventListener('click',  ()=>{
            pauseBtn.classList = 'ui button pausar center aligned disabled'
            playBtn.classList = 'ui button playBtn center aligned'
            socket.emit('pauseTimer')
        })
        playBtn.removeEventListener('click', ()=>{
            playBtn.classList = 'ui button playBtn center aligned disabled'
            pauseBtn.classList = 'ui button pausar center aligned'
            socket.emit('resumeTimer')
        })

        pauseBtn.addEventListener('click', ()=>{
            pauseBtn.classList = 'ui button pausar center aligned disabled'
            playBtn.classList = 'ui button playBtn center aligned'
            socket.emit('pauseTimer')
        
        })

        playBtn.addEventListener('click', ()=>{
            playBtn.classList = 'ui button playBtn center aligned disabled'
            pauseBtn.classList = 'ui button pausar center aligned'
            socket.emit('resumeTimer')
         
        })
        
        socket.emit('interaction')
        socket.emit('startTimer')
        //dados pro html
        
    }

    $scope.breakStart = ()=>{
        $scope.resetMessageClasses()
        $scope.resetButtonClasses()
        //remove prior event Listeners from buttons
        pauseBtn.removeEventListener('click',  ()=>{
            pauseBtn.classList = 'ui button pausar center aligned disabled'
            playBtn.classList = 'ui button playBtn center aligned'
            socket.emit('pauseTimer')
        })
        playBtn.removeEventListener('click', ()=>{
            playBtn.classList = 'ui button playBtn center aligned disabled'
            pauseBtn.classList = 'ui button pausar center aligned'
            socket.emit('resumeTimer')
        })

        pauseBtn.addEventListener('click', ()=>{
            pauseBtn.classList = 'ui button pausar center aligned disabled'
            playBtn.classList = 'ui button playBtn center aligned'
            socket.emit('pauseTimer')
        })

        playBtn.addEventListener('click', ()=>{
            playBtn.classList = 'ui button playBtn center aligned disabled'
            pauseBtn.classList = 'ui button pausar center aligned'
            socket.emit('resumeTimer')
        })

        socket.emit('interaction')

        socket.emit('break')
        
    }

    $scope.postpone = ()=>{
        $scope.resetMessageClasses()
        $scope.resetButtonClasses()
        socket.emit('interaction')
        socket.emit('postponeBreak')
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
        let fPomodoro = document.querySelector('.fifthPomodoro')

        switch(c){
            case 'pomodoroNotif':
                pomodoroMsg.classList = 'message ui padded segment pomodoroNotif '
                break;
            case 'breakIsOver' :
                breakIsOver.classList = 'message ui padded segment breakIsOver '
                break;
            case 'fifthPomodoro' :
                fPomodoro.classList = 'message ui padded segment fifthPomodoro'    
            }
    }

    $scope.resetMessageClasses = ()=>{
        let pomodoroMsg = document.querySelector('.pomodoroNotif')
        let breakIsOver = document.querySelector('.breakIsOver')
        let fPomodoro = document.querySelector('.fifthPomodoro')
        pomodoroMsg.classList = 'pomodoroNotif hidden'
        breakIsOver.classList = 'breakIsOver hidden'
        fPomodoro.classList = 'message ui padded segment fifthPomodoro hidden'  

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