/*
# Read MC-38 Wired door window sensor
# Components
    * MC-38
# Connections
    * (1) - 3.3v
    * (2) - Pins 32, 36, 38, 40(GPIOs 12, 16, 20, 21)
    * (2) - 1K or 220 Ohm - GND
*/

var Gpio = require('onoff').Gpio;
var doors = [
    new Gpio(12, 'in', 'both'),
    new Gpio(16, 'in', 'both'),
    new Gpio(20, 'in', 'both'),
    new Gpio(21, 'in', 'both')
];

function Doors(callback){
    doors[0].watch(function(err, value){
        if(err) throw err;
        callback('DOOR', 0, (value==1));
    });
    doors[1].watch(function(err, value){
        if(err) throw err;
        callback('DOOR', 1, (value==1));
    });
    doors[2].watch(function(err, value){
        if(err) throw err;
        callback('DOOR', 2, (value==1));
    });
    doors[3].watch(function(err, value){
        if(err) throw err;
        callback('DOOR', 3, (value==1));
    });

    this.read = function(idx){
        return (doors[idx].readSync()==1);
    };
}
module.exports = Doors;
