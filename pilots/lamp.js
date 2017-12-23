var Gpio = require('onoff').Gpio;

var LED = new Gpio(17, 'out');

var blankInterval = setInterval(blankLED, 250);

function blankLED() {
    if(LED.readSync() === 0){
        LED.writeSync(1);
    }else{
        LED.writeSync(0);
    }
}

function endBlink(){
    clearInterval(blankInterval);
    LED.writeSync(0);
    LED.unexport();
}

setTimeout(endBlink, 5000);
