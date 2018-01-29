/*
# Sensor: DHT11 BASIC TEMPERATURE-HUMIDITY SENSOR
    https://akizukidenshi.com/download/ds/aosong/DHT11.pdf
# Connect
    - pin1: VCC - 5v(+)
    - pin2: data - GPIO 5(Pin 29), data - resistor(4.7K or 10K) - 5v
    - pin3: not use
    - pin4: GND - Ground(-)
*/
var sensor = require('rpi-dht-sensor');
var dht = new sensor.DHT11(4);
function Dht(callback, opt){
    var self = this;
    if(!opt) opt = {temp: 5, humi: 5};

    this.read = function(idx){
        var curr = dht.read();
        //console.log('DHT read:',  curr);
        switch (idx) {
            case 0:
                return curr.temperature;
            case 1:
                return curr.humidity;
            default:
                return -1;
        }
    };
    function readTemp(){
        callback('DHT', 0, self.read(0));
    }
    function readHumi(){
        callback('DHT', 1, self.read(1));
    }
    var tempInterval = setInterval(readTemp, opt.temp*1000);
    var humiInterval = setInterval(readHumi, opt.humi*1000);
    this.set = function(opt){
        clearInterval(tempInterval);
        clearInterval(humiInterval);
        tempInterval = setInterval(readTemp, opt.temp*1000);
        humiInterval = setInterval(readHumi, opt.humi*1000);
    };
}

module.exports = Dht;
