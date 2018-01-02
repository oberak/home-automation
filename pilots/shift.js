/**
# Shift Register with 8 LED

# Components
    - 74HC595: 8-bit serial-to-parallel shift register
      (https://www.perkin.org.uk/files/images/nodejs-cpu-74hc595-pinout.jpg)
    - LED x 8
    - 1K Ohm Regisiter x 6
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
var Gpio = require('onoff').Gpio;

var srData = new Gpio(17, 'out'); // DS
var srShift = new Gpio(27, 'out'); // STCP
var srClock = new Gpio(22, 'out'); // SHCP

var srIn = [0,0,0,0,0,0,0,0];

var srClear = function(){
    for(var i=0 ; i < srIn.length ; i++){
        srData.writeSync(srIn[i]);
        srClock.writeSync(1);
        srClock.writeSync(0);
    }
    srShift.writeSync(1);
    srShift.writeSync(0);
};

var srSet = function(num, isOn){
    srIn[7-num] = (isOn)?1:0;
    for(var i=0 ; i < srIn.length ; i++){
        srData.writeSync(srIn[i]); // pull up the data pin for every bit
        srClock.writeSync(1); // pull Clock high
        srClock.writeSync(0);// pull Clock down, to send a rising edge
    }
    srShift.writeSync(1); // pull the SHIFT pin high to put the 8 bit data out parallel
    srShift.writeSync(0); //pull down the SHIFT pin
};

// TEST
srClear(); // init
for(var i=0; i < 8; i++){
    srSet(i, true);
}

setTimeout(function(){
    srSet(0, false);
    srSet(2, false);
    srSet(4, false);
    srSet(6, false);
    setTimeout(function(){
        srSet(1, false);
        srSet(3, false);
        srSet(5, false);
        srSet(7, false);
    }, 1500);
}, 1500);
