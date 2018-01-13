/*
# MG996R Servo Motor
# Manual http://www.electronicoscaldas.com/datasheet/MG996R_Tower-Pro.pdf
# Connections
    * PMW(Orange) - GPI18(Pin 12)
    * Vcc(Red,+) - 5v
    * GND(Brown) - Ground(-)
*/
function Motor(five,callback, opt){
    var servo = new five.Servo({pin: "P1-12", startAt: 0, type: "continuous"});
    var status = 0; // 0: close, 1: open, -1: opening, -2: closing
    var speed = 0.99; // 0-1
    this.toggle = function(){
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

module.exports = Motor;
