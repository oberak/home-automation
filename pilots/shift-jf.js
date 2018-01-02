/**
# # Shift Register with 8 LED

# Components
    - 74HC595: 8-bit serial-to-parallel shift register
      (https://www.perkin.org.uk/files/images/nodejs-cpu-74hc595-pinout.jpg)
# Connection
    - 74HC595: https://circuitdigest.com/sites/default/files/circuitdiagram_mic/Raspberry-Pi-with-Shift-Register-circuit-diagram.png
        * Q0(15), Q1(1) ~ Q7(7) - LED(+)
        * GND(8) - Ground
        * VCC(16) - 3.3V
        * DS(14) - GPIO 17(11)
                 - 1K Ohm - Ground
        * OE(13) - 1K Ohm - Ground
        * STCP(12) - GPIO 27(13)
                 - 1K Ohm - Ground
        * SHCP(11) - GPIO 22(15)
                 - 1K Ohm - Ground
        * MR(10) - 1K Ohm - 3.3V
        * Q7S(9) - Not connected
    - LED 8EA
        * (+) - Q0 ~ Q7 (74HC595)
        * (-) - 1K Ohm - Ground
# Desc
    - Data Pin (DS): First data is sent bit by bit to this pin. To send 1, we pull-up the DATA pin high and to send 0 we will pull down DATA pin.
    - Clock Pin (SHCP): Every pulse at this pin forces the registers to take in one bit of data from DATA pin and store it.
    - Shift Output (STCP): After receiving 8 bits, we provide pulse this pin to see the output.
*/

var five = require("johnny-five");
var Raspi = require("raspi-io");
var board = new five.Board({
    io: new Raspi()
});

var regValue = 0; // register input value
board.on("ready", function() {
    var btnPins = ["P1-29", "P1-31", "P1-33", "P1-35", "P1-37"];
    var register = new five.ShiftRegister({
        pins: {
            data: "P1-11",
            clock: "P1-15",
            latch: "P1-13"
        }
    });
    var buttons = new five.Buttons({
        pins: btnPins
    });

    buttons.on("press", function(button) {
        ledToggle(btnPins.indexOf(button.pin));
    });

    register.send(regValue); // clear register

    /**
     * LED On
     * @param  {int} led no, start with 0
     */
    var ledOn = function(led){
        regValue |= (1<<led);
        register.send(regValue);
    };
    /**
     * LED Off
     * @param  {int} led no, start with 0
     */
    var ledOff = function(led){
        regValue &= ~(1<<led);
        register.send(regValue);
    };
    /**
     * LED Toggle
     * @param  {int} led no, start with 0
     */
    var ledToggle = function(led){
        regValue ^= (1<<led);
        register.send(regValue);
        //console.log(led, isLedOn(led), regValue.toString(2));
    };
    /**
     * Check led is on
     * @param  {int} led no
     * @return {boolean} true if led is on, or false
     */
    var isLedOn = function(led){
        return (regValue & (1<<led))?true:false;
    };
});
