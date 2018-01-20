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
    var doorLock = false;
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
        self.motor = new Motor(five, fnCallback, {time:4.8});
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
        rtn.temperature = self.dht.read(0);
        rtn.humidity = self.dht.read(1);
        return rtn;
    };
    this.setSocket = function(socket){
        this.socket = socket;
    };
    function btnClick(btnNo){
        if(btnNo == 4){
            // door open/close
            //  self.motor.toggle();
            //  setTimeout(close,10000);
            // console.log('door button');
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
            setDoorLamp(7,6,5);
          }else if (value == 1) {
            setDoorLamp(5,6,7);
          }else {
            setDoorLamp(6,7,5);
          }
            break;
          case "MOTION":
            console.log('doorStatus', doorStatus);
            if(doorStatus < 0) return;
            switch (index) {
                case 0:
                if (value) {
                  if (!security) {
                    self.motor.toggle();
                    setTimeout(close,10000);
                    saveLog("Door",type,index, value,"Open the door by inner motion","Hardware");
                }
            }
                    break;
                case 1:
                if (value) {
                    if(doorLock){
                        self.motor.toggle();
                        setTimeout(close,10000);
                        saveLog("Door",type,index, value,"Open the door by outer motion","Hardware");
                        console.log('Opening door');
                    }
                }
                    break;
                default:

            }


            
            break;
            case "ADC":
                saveLog("Data",type,index, value,"Flame And Gas","Hardware");
              break;
            case "DHT":
                saveLog("Data",type,index, value,"Humidity And Temperature","Hardware");
              break;
            case "LAMPS":
                saveLog("SWITCH",type,index, value,"Lamps ON/OFF","Hardware");
                break;
          default:

        }
    }
    function close() {
      self.motor.toggle();
      console.log('close the DOOR');
    }
    function setDoorLamp(i,o,f){
      if(self.lamps.read(i) == true) return;
      self.lamps.on(i);
      self.lamps.off(o);
      self.lamps.off(f);
    }
    function saveLog(events,type,index,value,dec,src){
      var log = new Log();
      log.events = events;
      log.type = type;
      log.index = index;
      log.value = value;
      log.dec = dec;
      log.src = src;
      log.time = Date.now();
      log.save(function (err,rtn) {
        if(err)throw err;
        console.log("save to logs", rtn);
      });
    }


    var io = require('socket.io')(server);
    io.on('connection', function(socket) {
        self.socket = socket;
        socket.on('control', function(data) {
            console.log('receive client',data);
            switch (data.type) {
              case 'ALL':
              self.socket.emit('control', { type:'ALL', init: self.read()});

                case 'LAMPS':
                  if(self.lamps.read(data.idx) == data.value) return;
                    if(data.value) self.lamps.on(data.idx);
                    else self.lamps.off(data.idx);
                    saveLog("SWITCH",data.type,data.idx, data.value,"Lamps ON/OFF","Website");
                    break;
                case 'RFID':
                    Member.findOne({rfid:data.falg},function (err,rtn) {
                      if(err)throw err;
                      if(rtn == null){
                        saveLog("Door",data.type,data.idx, data.falg,"Open door by RFID(Not Register Member)","Client");
                        //saveRfidLog("RFID","Unknow",data.falg,"Not Register Member");
                        //  new Sound().play('/home/pi/home-automation/public/mp3/01.wav');
                        self.display.print('You Are Not','Family Member');
                      }else{
                        if (rtn.options == "use") {
                        saveLog("Door",data.type,data.idx, data.falg,"Open door by RFID(Family Member)","Client");
                          //saveRfidLog("RFID",rtn.name,data.falg,"Family Member");
                          self.display.print('Welcome   ',rtn.name);
                          self.motor.toggle();
                          setTimeout(close,10000);
                        }else {
                            saveLog("Door",data.type,data.idx, data.falg,"Open door by RFID(Inactive Family Member)","Client");
                         // saveRfidLog("RFID",rtn.name,data.falg,"Inactive Family Member");
                          self.display.print('You Are Inactive ','Family Member');
                        }

                      }
                    });

                  break;
              case 'DOOR':
                    if (data.idx == 1) {
                        console.log("DOOR Unlock Set Data", data.type,data.idx,data.value);
                        doorLock = data.value;
                        saveLog("Door",data.type,data.idx, data.falg,"Switch motion by doorLock","Website");
                    }else {
                        if (data.value) {
                        saveLog("Door",data.type,data.idx, data.falg,"Open door by user","Website");
                         self.motor.toggle();
                         setTimeout(close,10000);
                        return;
                        }
                    }


                  break;
              case 'SECURITY':
                security =data.value;
                saveLog("Data",data.type,data.idx, data.falg,"Security set","Website");
                break;
            }
        });
    });
}
module.exports = Gpio;
