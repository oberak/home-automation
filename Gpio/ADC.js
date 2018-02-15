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
    * MQ-2
      * VCC - 5v
      * G - Ground
      * AO - AIN0 of PCF8591
    * IR Flame sensor
      * + - 5v
      * G - Ground
      * AO - AIN1 of PCF8591
# Pre work
    * npm install --save pcf8591
    * https://www.npmjs.com/package/pcf8591
*/
/**
 * AD Converter controller for gas, flame
 * @param       {[type]}   five     johnny-five
 * @param       {Function} callback function return {type, index, value}
 * @param       {[type]}   opt      interval {gas: 60, flame: 60, gasLevel: 600, flameLevel: 900} (seconds, level)
 * @constructor
 */
function ADC(five, callback, opt){
    if(!opt){
        opt = { gas: 5, flame: 5, alarm:20, gasLevel: 600, flameLevel: 700};
    }
    var onGasAlarm = false;
    var onFlameAlarm = false;
    var alarmTime = (opt.alarm)?opt.alarm:60;
    // AD Converter
    var ADConverter = new five.Board.Virtual(
        new five.Expander("PCF8591")
    );
    var gas = new five.Sensor({
        pin: "A0",
        board: ADConverter
    });
    var flame = new five.Sensor({
        pin: "A1",
        board: ADConverter
    });

    gas.on("change", function() { // Gas
        callback('ADC', 0, this.value);
        var gasLevel = (opt.gasLevel)?opt.gasLevel:700;
        if(this.value!=null && this.value > gasLevel && !onGasAlarm){
            onGasAlarm = true;
            callback('ALARM', 0, this.value); //300ppm to 1000 ppm  or gas.scaleTo(0, 100)
            setTimeout(function(){
                onGasAlarm = false;
            }, alarmTime * 1000);
        }
    });
    flame.on("change", function() { // Flame
        var flameLevel = (opt.flameLevel)?opt.flameLevel:700;
        // console.log('flame level', opt.flameLevel);
        callback('ADC', 1, this.value);
        if(this.value!=null && this.value < flameLevel && !onFlameAlarm){
            console.log('Alarm on', alarmTime);
            onFlameAlarm = true;
            callback('ALARM', 1, this.value); // 760nm to 1100nm or flame.scaleTo(0, 100)
            setTimeout(function(){
                onFlameAlarm = false;
                console.log('alarm off');
            }, alarmTime * 1000);
        }
    });
    this.read = function(idx){
        switch (idx) {
            case 0:
                return gas.value;
            case 1:
                return flame.value;
            default:
                return -1;
        }
    };
}

module.exports = ADC;
