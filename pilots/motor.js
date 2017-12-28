/*
# MG996R Servo Motor
# Manual http://www.electronicoscaldas.com/datasheet/MG996R_Tower-Pro.pdf
# Connection
    - PMW: Orange
    - Vcc: Red (+)
    - GND(Ground): Brown (-)
*/
var Gpio = require('pigpio').Gpio,
    motor = new Gpio(18, {mode: Gpio.OUTPUT}),
    button = new Gpio(4, {
        mode: Gpio.INPUT,
        pullUpDown: Gpio.PUD_DOWN,
        edge: Gpio.FALLING_EDGE
    }),
    isOpen = false;

button.on('interrupt', function (level) {
    console.log('is open?', isOpen, level);
    if(isOpen){
        motor.servoWrite(500);
    }else{
        motor.servoWrite(2500);
    }
    isOpen = !isOpen;
    setTimeout(stopMotor, 2000);
});

function stopMotor(){
    motor.servoWrite(0);
}
