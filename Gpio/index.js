var five = require('johnny-five');
var Raspi = require('raspi-io');
//var Sound = require('aplay');
var ADC = require('./ADC');
var Lamps = require('./Lamps');
var Buttons = require('./Buttons');
var Motor = require('./Motor');
// var Rfid = require('./Rfid');
var Member = require('../models/member');
var Log = require('../models/log');
var Windows = require('./Windows');
var Display = require('./Display');
var Motions = require('./Motions');
var Dht = require('./Dht');

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
    var security = true;
    var doorStatus = 0;
    // this.rfid = new Rfid(fnCallback);
    this.windows = new Windows(fnCallback);
    this.display = new Display({time:3});
    this.dht = new Dht(fnCallback, {temp:20, humi: 20});

    board.on('ready', function() {
        self.adc = new ADC(five, fnCallback, {gas: 20, flame: 20});
        self.lamps = new Lamps(five);
        self.buttons = new Buttons(five, btnClick);
        self.motions = new Motions(five, fnCallback);
        self.motor = new Motor(five, fnCallback, {time:2});
    });

    this.read = function(){
        var rtn = {};
        rtn.gas = this.adc.read(0);
        rtn.flame = this.adc.read(1);
        rtn.lamps = [];
        for(var i=0; i < 8; i++ ){
            rtn.lamps[i] = this.lamps.read(i);
        }
        rtn.windows = [];
        for(i=0; i < 3; i++ ){
            rtn.windows[i] = this.windows.read(i);
        }
        return rtn;
    };
    this.setSocket = function(socket){
        this.socket = socket;
        console.log(this.socket);
    };
    function btnClick(btnNo){
        if(btnNo == 4){
            // door open/close
             self.motor.toggle();
             setTimeout(close,10000);
            // display info to display
            console.log('door button');
            self.display.print('someone','open? close?');
        }else{
            self.lamps.toggle(btnNo);
            // alarm (all lamp blink)
            fnCallback('LAMPS', btnNo, self.lamps.read(btnNo));
        }
    }
    function fnCallback(type, index, value){
        if(self.socket){

            self.socket.emit('control', {type:type, idx:index, value:value});
        }
        console.log(type, index, value);
        switch (type) {
          case "DOOR":
          doorStatus = value;
          if (value == 0) {
            if(self.lamps.read(7) == true) return;
            self.lamps.on(7);
            self.lamps.off(6);
            self.lamps.off(5);
          }else if (value == 1) {
            if(self.lamps.read(5) == true) return;
            self.lamps.on(5);
            self.lamps.off(6);
            self.lamps.off(7);
          }else {
            if(self.lamps.read(6) == true) return;
            self.lamps.on(6);
            self.lamps.off(5);
            self.lamps.off(7);
          }
            break;
          case "MOTION":
            console.log('doorStatus', doorStatus);
            if(doorStatus < 0) return;
            if (index == 0 && value) {
              if (!security) {
                self.motor.toggle();
                setTimeout(close,10000);
              }
            }
            break;
          default:

        }
    }
    function close() {
      self.motor.toggle();
      console.log('close the DOOR');
    }

    var io = require('socket.io')(server);
    io.on('connection', function(socket) {
        self.socket = socket;
        socket.on('control', function(data) {
            console.log('receive client',data);
            switch (data.type) {
                case 'LAMPS':
                  if(self.lamps.read(data.idx) == data.value) return;
                    if(data.value) self.lamps.on(data.idx);
                    else self.lamps.off(data.idx);
                    break;
                case 'RFID':
                    Member.findOne({rfid:data.falg},function (err,rtn) {
                      if(err)throw err;
                      if(rtn == null){
                        var log = new Log();
                        log.name = "Unknow";
                        log.rfid = data.falg;
                        log.status = "May be thief";
                        log.save(function (err,rtn1) {
                          if(err)throw err;
                          console.log('rtn1:', rtn1);
                          console.log("save to logs", rtn1);
                        //  new Sound().play('/home/pi/home-automation/public/mp3/01.wav');
                        });
                        self.display.print('You Are Not','Family Member');
                      }else{
                        var log = new Log();
                        log.name = rtn.name;
                        log.rfid = rtn.rfid;
                        log.status = rtn.status;
                        log.save(function (err,rtn) {
                          if(err)throw err;
                          console.log("save to logs", rtn);
                        });
                        console.log('rtn.name',rtn.name);
                        self.display.print('Welcome   ',rtn.name);
                        self.motor.toggle();
                        setTimeout(close,10000);
                      }
                    });

                  break;
              case 'DOOR':
                    if (data.value) {
                     self.motor.toggle();
                     setTimeout(close,10000);
                    return;
                    }

                  break;
              case 'SECURITY':
                security =data.value;
                break;
            }
        });
    });
}
module.exports = Gpio;
