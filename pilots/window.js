/*
# Read MC-38 Wired door window sensor
# Components
    * MC-38
# Connections
    * Ground
    * GPIO 27
*/

var Gpio = require('onoff').Gpio;

var door = new Gpio(27, 'in', 'falling');

console.log('The door is '+ (door.readSync()?'opened':'closed') );
door.watch(function(err, value){
    if(err){
        console.error('There was an error!', err);
        return;
    }
    if(value){
        console.log('The door is opened');
    }else {
        console.log('The door is closed');
    }
});

// run on exit
process.on('SIGNIT', function(){
    door.unexport();
});
