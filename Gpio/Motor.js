/*
# MG996R Servo Motor
# Manual http://www.electronicoscaldas.com/datasheet/MG996R_Tower-Pro.pdf
# Connections
    * PMW(Orange) - GPI18(Pin 12)
    * Vcc(Red,+) - 3.3v
    * GND(Brown) - Ground(-)
*/
var Gpio = require('pigpio').Gpio,
    motor = new Gpio(18, {mode: Gpio.OUTPUT}),
    status = 0; // 0: close, 1: open, -1: opening, -2: closing

function Motor(callback, opt){
    this.toggle = function(auto){
        console.log('>>> status:', status);
        if(status < 0) return;
        if(status){ // 1: open
            console.log('>>> closing');
            motor.servoWrite(2500); // 0-1
            status = -2;// closing
        }else{
            console.log('>>>> opening');
            motor.servoWrite(500);
            status = -1;// opening
        }
        callback('DOOR',0, status);
        setTimeout(function(){ // stop
            motor.servoWrite(0);
            console.log('>>> stop');
            status = (status == -1)? 1:0;
            callback('DOOR',0, status);
        }, (opt)?opt.time*1000:2000);
    };
    this.read = function(){
        return status;
    };
}

/*
function Motor(five,callback, opt){
    var servo = new five.Servo({pin: "P1-12", startAt: 0, type: "continuous"});
    var status = 0; // 0: close, 1: open, -1: opening, -2: closing
    var speed = 0.99; // 0-1
    this.toggle = function(){
        console.log('status:', status);
        if(status < 0) return;
        if(status){ // 1: open
            servo.cw(speed); // 0-1
            status = -2;// closing
        }else{
            servo.ccw(speed);
            status = -1;// opening
        }
        callback('DOOR',0, status);
        setTimeout(function(){
            servo.cw(0);
            console.log('stop');
            status = (status == -1)? 1:0;
            callback('DOOR',0, status);
        }, (opt)?opt.time*1000:2000);
    };
    this.close = function(){
        servo.ccw(0.5); // 0-1
        callback('DOOR',0, -1);
        setTimeout(function(){
            callback('DOOR',0, 1);
            servo.stop();
        }, (opt)?opt.time*1000:2000);
    };
}
*/
module.exports = Motor;
