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
function Gpio(server){
    var self = this;
    // this.rfid = new Rfid(fnCallback);
    // this.windows = new Windows(fnCallback);
    // this.display = new Display({time:3});
    // this.dht = new Dht(fnCallback, {temp:20, humi: 20});

    board.on('ready', function() {
        // self.adc = new ADC(five, fnCallback, {gas: 20, flame: 20});
        self.lamps = new Lamps(five);
        self.buttons = new Buttons(five, btnClick);
        // self.motions = new Motions(five, fnCallback);
        // self.motor = new Motor(five, fnCallback, {time:2});
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
    this.setSocket = function(socket){
        this.socket = socket;
        console.log(this.socket);
    };
    function btnClick(btnNo){
        if(btnNo == 0){
            // door open/close
            // self.motor.toggle();
            // display info to display
            console.log('door button');
            // self.display.print('someone','open? close?');
        }else{
            self.lamps.toggle(btnNo);
            // alarm (all lamp blink)
            fnCallback('LAMPS', btnNo, self.lamps.read(btnNo));
        }
    }
    function fnCallback(type, index, value){
        if(self.socket){
            self.socket.emit('control', {type:type, no:index, flag:value});
        }
        console.log(type, index, value);
    }

    var io = require('socket.io')(server);
    io.on('connection', function(socket) {
        self.socket = socket;
        socket.on('control', function(data) {
            console.log('receive',data);
            switch (data.type) {
                case 'lamp':
                  if(self.lamps.read(data.no) == data.flag) return;
                    if(data.flag) self.lamps.on(data.no);
                    else self.lamps.off(data.no);
                    break;
            }
        });
    });
}
module.exports = Gpio;
