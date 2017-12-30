/**
# Shift Register

# Components
    - 74HC595N: 8-bit serial-to-parallel shift register
      (https://www.perkin.org.uk/files/images/nodejs-cpu-74hc595-pinout.jpg)
    - Buttons x 4EA
    - Register 220 Ohm for Buttons
    - LEDs x 8EA
    - Register 89 Ohm for LED
# Connection
    - 74HC595N
        * Q0(15), Q1(1) ~ Q7(7) - LEDs
        * GND(8) - Ground
        * VCC(16) - 3.3V
        * DS(14) - GPIO 17(11)
        * OE(13) - Ground
        * STCP(12) - GPIO 18(12)
        * SHCP(11) - STCP
        * MR(10) - 3.3V
        * Q7S(9) - Not connected
    - Buttons
        * 89Ohm - Ground
        * 3.3V
        * GPIO 6(31), 13(33), 19(35), 26(37)
 */

 var rpio = require('rpio');

 var pinDS = 11;
 var pinClk = 12;

 rpio.open(pinDS, rpio.OUTPUT);
 rpio.open(pinClk, rpio.OUTPUT);

 // Start with the clock pin low
 rpio.write(pinClk, 0);

 /*
  * This is what we want to send through the shift register - start with
  * all zeros to clear the buffer, then insert 10110111, with a final bit
  * to clock in the storage register.
  */
 var input = [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 1, 1, 0];

 /*
 * Configure the speed in Hz.  setInterval() and setTimeout have a maximum
 * resolution of 1ms, and we need a regular clock, so with each 'tick' and
 * 'tock' at a max of 1ms intervals our theoretical top speed is 500Hz.
 *
 * The 74HC595 is rated to 52MHz so we are in no danger of overclocking ;)
 */
var speed = 1;

setInterval(function clock() {

	/*
	 * Pop the first bit of input into DS.  If there is no more
	 * input then exit.
	 */
	if (input.length)
		rpio.write(pinDS, input.shift());
	else
		process.exit(0);

	/*
	 * Then cycle the clock at regular intervals, starting by setting it
	 * high then setting a timeout for half way until the next interval
	 * when we set it low.
	 */
        rpio.write(pinClk, 1);

        setTimeout(function clocklow() {
                rpio.write(pinClk, 0);
        }, parseInt(1000 / speed / 2));

}, parseInt(1000 / speed));

rpio.open(26, rpio.INPUT, rpio.PULL_DOWN);
console.log('Pin 26 is currently set ' + (rpio.read(26) ? 'high' : 'low'));
function pollcb(pin)
{
        /*
         * Interrupts aren't supported by the underlying hardware, so events
         * may be missed during the 1ms poll window.  The best we can do is to
         * print the current state after a event is detected.
         */
        var state = rpio.read(pin) ? 'pressed' : 'released';
        console.log('Button event on P%d (button currently %s)', pin, state);
}

rpio.poll(15, pollcb);
