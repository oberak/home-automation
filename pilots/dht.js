/*
# Sensor: DHT11 BASIC TEMPERATURE-HUMIDITY SENSOR
# Connect
    - pin1: VCC - 5v(+)
    - pin2: data - GPIO 21, data - resistor(4.7K or 10K) - 5v
    - pin3: not use
    - pin4: GND - Ground(-)
*/

var sensor = require('dht-sensor');
var type_dht11 = 11;
var gpio_no = 21;

function readSensor(){
    var curr = sensor.read(11, 21);
    console.log('read:', curr);
}

var readInterval = setInterval(readSensor, 1000);

function endBlink(){
    clearInterval(readInterval);
}

setTimeout(endBlink, 5000);
