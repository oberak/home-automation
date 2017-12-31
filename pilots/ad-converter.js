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
        console.log('gas level:', this.value);
    });

    var flame = new five.Sensor({
        pin: "A1",
        board: virtual
    });

    flame.on("change", function() {
        console.log('flame level:', this.value);
    });
});
 /*
var PCF8591 = require('pcf8591');

// Constructor: PCF8591(device, slaveAddress, controlByte),
// defaults to: '/dev/i2c-1', 0x48, 0x00.
var pcf8591 = new PCF8591();

// Reconfigure control register following the Datasheet.
pcf8591.configure(0x45);

// Discard first reading after POR or read mode change.
pcf8591.read(function(error, sample) {
    console.log('Discarded sample: 0x' + sample.toString(16));
});
pcf8591.readBytes(4, function(error, buffer) {
    console.log('Discarded samples: ' +
                '0x' + buffer[0].toString(16) + ' ' +
                '0x' + buffer[1].toString(16) + ' ' +
                '0x' + buffer[2].toString(16) + ' ' +
                '0x' + buffer[3].toString(16)
               );
});
/*
var output = 0x00;
setInterval(function() {
    // Toggle output.
    output ^= 0xff;
    pcf8591.write(output);
    // Read all channels at once.
    pcf8591.readBytes(4, function(error, buffer) {
        console.log('0x' + buffer[0].toString(16) + ' ' +
                    '0x' + buffer[1].toString(16) + ' ' +
                    '0x' + buffer[2].toString(16) + ' ' +
                    '0x' + buffer[3].toString(16)
                   );
    });
}, 500);
*/
