/*
# Motion detector
# Pin
    - VCC: 5V(+)
    - OUT: GPIO
    - GND: Ground(-)
*/

var Gpio = require('onoff').Gpio;

var LED = new Gpio(17, 'out');
var motion = new Gpio(21, 'in', 'both');

motion.watch(function(err, value){
    if(err){
        console.error('There was an error!', err);
        return;
    }
    console.log(value);
    LED.writeSync(value);
});

function unexportOnClose(){
    LED.writeSync(0);
    LED.unexport();
    motion.unexport();
}

process.on('SIGNIT', unexportOnClose);
