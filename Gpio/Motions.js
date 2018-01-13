/*
# Motion detection
# Components
    * 2 x HC-SR501 PIR Motion detector
# Pin
    * VCC - 5V(+)
    * OUT(GPIO) - Pin 12 (GPIO 27)
    * GND: Ground(-)
*/

function Motions(five, callback){
    // Create a new `motion` hardware instance.
    var motions0 = new five.Motion("P1-22");
    var motions1 = new five.Motion("P1-24");

    // "calibrated" occurs once, at the beginning of a session,
    motions0.on("calibrated", function() {
        console.log("Montion sensor 0 calibrated");
    });
    motions1.on("calibrated", function() {
        console.log("Montion sensor 1 calibrated");
    });

    // "motionstart" events are fired when the "calibrated"
    // proximal area is disrupted, generally by some form of movement
    motions0.on("motionstart", function() {
        callback('MOTION', 0, true);
    });
    motions1.on("motionstart", function() {
        callback('MOTION', 1, true);
    });

    // "motionend" events are fired following a "motionstart" event
    // when no movement has occurred in X ms
    motions0.on("motionend", function() {
        callback('MOTION', 0, false);
    });
    motions1.on("motionend", function() {
        callback('MOTION', 1, false);
    });
}
module.exports = Motions;
