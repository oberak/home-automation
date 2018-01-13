/*
# Read MC-38 Wired door window sensor
# Components
    * MC-38
# Connections
    * (1) - 3.3v
    * (2) - Pins 29, 31, 33(GPIOs 5, 6, 13)
    * (2) - 220(or 1K) Ohm - GND
*/

var Gpio = require('onoff').Gpio;
var windows = [
    new Gpio(10, 'in', 'both'),
    new Gpio(9, 'in', 'both'),
    new Gpio(11, 'in', 'both')
];

function Windows(callback){
    windows[0].watch(function(err, value){
        if(err) throw err;
        callback('WINDOW', 0, (value==1));
    });
    windows[1].watch(function(err, value){
        if(err) throw err;
        callback('WINDOW', 1, (value==1));
    });
    windows[2].watch(function(err, value){
        if(err) throw err;
        callback('WINDOW', 2, (value==1));
    });

    this.read = function(idx){
        return (windows[idx].readSync()==1);
    };
}
module.exports = Windows;
