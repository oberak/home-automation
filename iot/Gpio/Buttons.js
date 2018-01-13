/*
# Control buttons
# Components
    * 5 x Resistor 1k Ohm
    * 5 x Push button
# Connect
    * BUTTON (1) - Pins 31, 33, 35, 37 (Any GPIOs)
             (2) - 5V
             (2) - Resistor 1k Ohm - GND
@ needed: sudo
*/
var btnPins = ["P1-31", "P1-33", "P1-35", "P1-37"];

function Buttons(five, callback){
    var buttons = new five.Buttons({
        pins: btnPins
    });
    buttons.on("press", function(button) {
        callback(btnPins.indexOf(button.pin));
    });
}
module.exports = Buttons;
