
angular.module('app', [])
angular.module('app').controller('APIctrl', function($scope, $http){
    //Classe timer para controlar o ciclo pomodoro
    var Timer = function(t, fn, go) {
        var timer, tRemaining, tStarted;
    
        // if (!t || !fn) {
        //     throw new Error("Informe o tempo do timer e a função de callback");
        // }
        tRemaining = t;
    
        this.start = function() {
            if (!timer) {
                console.log('timer startado')
                tStarted = new Date().getTime();
                timer = setTimeout(fn, tRemaining);
            }
        };
    
        this.pause = function() {
            if (timer) {
                clearTimeout(timer);
                timer = null;
                var now = new Date().getTime();
                tRemaining -= now - tStarted;
                if(tRemaining <= 0){
                    tRemaining = t
                }else{
                    tRemaining = tRemaining
                }
                console.log(tRemaining)
            } 
        }
    }
    //guarda resposta do bot
    $scope.notificationResponse = ''
    //guarda
    $scope.idResposta = null
    //guarda quantos ciclos se passaram
    $scope.numeroPomodoros = 0
      //Notifica quando a pausa acabou e pede para o usuário retornar
    $scope.resumeWorkNotify = async ()=>{
        async function breakIsOverNotify(){
            await $http.get('http://192.168.20.62:3005/message/pomodoro/breakIsOver/896068970635997184').then((response)=>{
            console.log(response.data)
            if(response.data == 'noResponse'){
                breakIsOverNotify()
            }
            switch(response.data.customId){
                case 'return' :
                    console.log('um novo pomodoro foi iniciado')
                    $scope.notificationResponse = 'Usuário retornou ao trabalho'
                    $scope.timerPomodoro = null
                    $scope.timerPomodoro = new Timer(15000, ()=>{
                        console.log('um pomodoro acabou')
                        $scope.numeroPomodoros++
                        $scope.timerPomodoro.pause()
                        $scope.sendNotification()
                    })
                    $scope.timerPomodoro.start()
                    break;
                case 'stopWork' : 
                    $scope.notificationResponse = 'Usuário encerrou o dia'
                    break;
                }
            })
        }
        breakIsOverNotify()
    }
    //envia notificação para o usuário realizar pausa
    $scope.sendNotification = async ()=>{
        //envia pela primeira vez
        async function sendNotif(){
            await $http.get('http://192.168.20.62:3005/message/pomodoro/playPauseNotification/896068970635997184')
            .then((response)=>{
                console.log(response.data)
                if(response.data == 'noResponse'){
                    sendNotif()
                }
                $scope.idResposta = response.data.customId
                //set content of div
                switch(response.data.customId){
                    case 'pause' :
                        $scope.notificationResponse = 'Usuário optou por realizar pausa'
                        if($scope.numeroPomodoros == 4){
                            $scope.timerPomodoro = null
                            $scope.timerPomodoro = new Timer(15000, ()=>{
                                console.log('uma pausa de 15 minutos acabou')
                                $scope.timerPomodoro.pause()
                                $scope.resumeWorkNotify()
                            })
                            $scope.timerPomodoro.start()
                            $scope.numeroPomodoros = 0;
                        }else{
                            $scope.timerPomodoro = null
                            $scope.timerPomodoro = new Timer(15000, ()=>{
                                console.log('uma pausa de 5 minutos acabou')
                                $scope.timerPomodoro.pause()
                                $scope.resumeWorkNotify()
                            })
                            $scope.timerPomodoro.start()
                        }
                    break;
                    case 'notYet' : 
                        $scope.notificationResponse = 'Usuário escolheu adiar'
                        $scope.timerPomodoro = null
                        $scope.timerPomodoro = new Timer(15000, ()=>{
                            console.log('acabou o tempo prorrogado.')
                            $scope.timerPomodoro.pause()
                            sendNotif()
                        })
                        $scope.timerPomodoro.start()
                    break;
                    }
                })
            }
        sendNotif()        
    }

   //instancia do timer para um periodo de 30min de trabalho
   $scope.timerPomodoro = new Timer(15000, ()=>{
        console.log('um pomodoro terminou')
        $scope.numeroPomodoros++
        $scope.timerPomodoro.pause()
        $scope.sendNotification()
   })
})

