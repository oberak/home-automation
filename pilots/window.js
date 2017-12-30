/*
# Read MC-38 Wired door window sensor
# Components
    * MC-38
# Connections
    * (1) - 3.3v
    * (2) - GPIO 27
    * (2) - 1K Ohm - GND
*/

var Gpio = require('onoff').Gpio;
var door = new Gpio(27, 'in', 'both');

console.log('The door is '+ (door.readSync()?'closed':'opened') );
door.watch(function(err, value){
    if(err){
        console.error('There was an error!', err);
        return;
    }
    if(value){
        console.log('The door is closed');
    }else {
        console.log('The door is opened');
    }
});

// run on exit
process.on('SIGNIT', function(){
    door.unexport();
});
