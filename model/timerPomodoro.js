module.exports = function(t, fn, go) {
    var timer, tRemaining, tStarted, running;

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