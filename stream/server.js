var LiveCam = require('livecam');
var io = require('socket.io-client');
var config = require('../config');
var Rfid = require('../Gpio/Rfid');
var Omx = require('node-omxplayer');

var serverUrl = 'http://' + config.server.ip + ':' + config.server.port;
var socket = io(serverUrl);

var http = require('http');
var server = http.createServer().listen(config.stream.socketPort);
var serverIo = require('socket.io')(server);

var Gpio = require('onoff').Gpio;
var LED = new Gpio(2,'out');
var fan = new Gpio(17,'out');
var dec = new Gpio(27,'out');
var btn = new Gpio(21, 'in','falling');

btn.watch(function(err, value) {
 console.log('call bell');
 if (err) {
   console.error('There was an error', err);
 return;
 }
 var player =Omx('./public/mp3/bell.wav');
 setTimeout(
     function() {
     player.quit();
 }, 3000);
});

function unexportOnClose() {
 LED.writeSync(0);
 LED.unexport();
 fan.writeSync(0);
 fan.unexport();
}
process.on('SIGINT', unexportOnClose);

var rfid = new Rfid(readRfid);
// var Gpio = require('pigpio').Gpio,
//     button = new Gpio(4, {
//         mode: Gpio.INPUT,
//         pullUpDown: Gpio.PUD_DOWN,
//         edge: Gpio.FALLING_EDGE
//     });
//
// button.on('interrupt', function (level) {
//     console.log("level btn", level);
//     // socket.emit('control', {
//     //     type: DOORBTN,
//     //     no: 0,
//     //     falg: level
//     var player =Omx('./public/mp3/bell.wav');
//     setTimeout(
//         function() {
//         player.quit();
//     }, (data.time) ? data.time * 1000 : 5000);
//
//     });

function readRfid(type, index, value) {
   // send to socket
   console.log(type, index, value);
   socket.emit('control', {
       type: type,
       no: index,
       falg: value
   });
}
serverIo.on('connection', function(socket) {
   socket.on('alarm', function(data) {
       if (data.alarm) {
           var player =Omx('./public/mp3/'+data.type+'.wav');
           setTimeout(
               function() {
               player.quit();
           }, (data.time) ? data.time * 1000 : 5000);
       }

   });
   socket.on('access', function (data) {
     if (data.index == 0) {
       LED.writeSync(LED.readSync() ^ 1);
       return;
       // console.log('call LED');
     }else if (data.index == 1) {
       fan.writeSync(fan.readSync() ^ 1);
     }else if(data.index == 2) {
       dec.writeSync(dec.readSync() ^ 1);
     // console.log('call dec');
   }else {
     console.log('nothing');
   }
   });
});
