/*
# Analog to Digital converter

# Components
    * PCF8591 D/A, A/D Converter
    * MQ-2 Gas sensor
    * IR Flame sensor
# Connections
    * PCF8591
      * SCL - SDA1(GPIO 3, pin 5)
      * SDA - SCL1(GPIO 2, pin 3)
      * GND - Ground
      * VCC - 3.3v
      * AIN0 - AO of MQ-2
      * AIN1 - AO of Flame sensor
# Pre work
    * npm install --save pcf8591
    * https://www.npmjs.com/package/pcf8591
 */

var five = require("johnny-five");
var Raspi = require("raspi-io");
var board = new five.Board({
    io: new Raspi()
});

board.on("ready", function() {
    var virtual = new five.Board.Virtual(
        new five.Expander("PCF8591")
    );

    var gas = new five.Sensor({
        pin: "A0",
        board: virtual
    });

    gas.on("change", function() {
        if(this.value > 500){
            console.log("Gas is detected!!", this.value);
        }else{
            console.log('gas level:', this.value);
        }

    });

    var flame = new five.Sensor({
        pin: "A1",
        board: virtual
    });

    flame.on("change", function() {
        if(this.value < 900){
            console.log('Flame detected!!', this.value);
        }else{
            console.log('flame level:', this.value);
        }
    });
});
