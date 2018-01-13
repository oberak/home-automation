/**
# # Shift Register with 8 LED

# Components
    - 74HC595: 8-bit serial-to-parallel shift register
      (https://www.perkin.org.uk/files/images/nodejs-cpu-74hc595-pinout.jpg)
# Connection
    - 74HC595: https://circuitdigest.com/sites/default/files/circuitdiagram_mic/Raspberry-Pi-with-Shift-Register-circuit-diagram.png
        * Q0(15), Q1(1) ~ Q7(7) - (+) of LEDs
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
        * (+) - Q0 ~ Q7 of 74HC595
        * (-) - (If needed 1K Ohm Rigister) - Ground 
# Desc
    - Data Pin (DS): First data is sent bit by bit to this pin. To send 1, we pull-up the DATA pin high and to send 0 we will pull down DATA pin.
    - Clock Pin (SHCP): Every pulse at this pin forces the registers to take in one bit of data from DATA pin and store it.
    - Shift Output (STCP): After receiving 8 bits, we provide pulse this pin to see the output.
*/
function Lamps(five){
    var regValue = 0; // register input value
    var register = new five.ShiftRegister({
        pins: {
            data: "P1-11",
            clock: "P1-15",
            latch: "P1-13"
        }
    });
    register.send(regValue); // clear register

    this.on = function(led){
        regValue |= (1<<led);
        register.send(regValue);
    };
    this.off = function(led){
        regValue &= ~(1<<led);
        register.send(regValue);
    };
    this.toggle = function(led){
        regValue ^= (1<<led);
        register.send(regValue);
    };
    this.read = function(led){
        return (regValue & (1<<led))?true:false;
    };
}
module.exports = Lamps;
