var five = require('johnny-five');
var Raspi = require('raspi-io');

// var ADC = require('./ADC');
var Lamps = require('./Lamps');
var Buttons = require('./Buttons');
// var Motor = require('./Motor');
// var Rfid = require('./Rfid');
// var Windows = require('./Windows');
// var Display = require('./Display');
// var Motions = require('./Motions');
// var Dht = require('./Dht');

var board = new five.Board({
    io: new Raspi()
});

/**
 * GPIO Controller
 *
 * @param       {Function} callback (type, index, value)
 * @constructor
 */
function Gpio(callback){
    var self = this;
    // this.rfid = new Rfid(fnCallback);
    // this.windows = new Windows(fnCallback);
    // this.display = new Display({time:3});
    // this.dht = new Dht(fnCallback, {temp:20, humi: 20});
    // this.motor = new Motor(fnCallback, {time:2});

    board.on('ready', function() {
        // self.adc = new ADC(five, fnCallback, {gas: 20, flame: 20});
        self.lamps = new Lamps(five);
        self.buttons = new Buttons(five, btnClick);
        // self.motions = new Motions(five, fnCallback);
    });

    this.read = function(){
        var rtn = {};
        // rtn.gas = this.adc.read(0);
        // rtn.flame = this.adc.read(1);
        rtn.lamps = [];
        for(var i=0; i < 8; i++ ){
            rtn.lamps[i] = this.lamps.read(i);
        }
        // rtn.windows = [];
        // for(i=0; i < 3; i++ ){
        //     rtn.windows[i] = this.windows.read(i);
        // }
        return rtn;
    };

    function btnClick(btnNo){
        if(btnNo == 0){
            // door open/close
            // self.motor.toggle();
            // display info to display
            console.log('door button');
            // self.display.print('someone','open? close?');
        }else{
            switch(btnNo){
                case 1: // living room
                    self.lamps.toggle(0);
                    self.lamps.toggle(1);
                    break;
                case 2: // room 1
                    self.lamps.toggle(2);
                    break;
                case 3: // room 2
                    self.lamps.toggle(3);
                    break;
            }

            self.lamps.toggle(4); // door lamp
            self.lamps.toggle(5); // door lock (red)
            self.lamps.toggle(6); // door unlock (green)
            self.lamps.toggle(7); // door working (yellow)
            // alarm (all lamp blink)
            fnCallback('LAMPS', btnNo, self.lamps.read(btnNo));
        }
    }
    function fnCallback(type, index, value){

        callback(type, index, value);
    }
}
module.exports = Gpio;
