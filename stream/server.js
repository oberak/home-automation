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
var deco = new Gpio(3,'out');
  LED.writeSync(LED.readSync() ^ 1);
  socket.emit('access',{type:'ACCESSORIES',no:0,falg:LED.readSync()^1});

  fan.writeSync(fan.readSync() ^ 1);
  socket.emit('access',{type:'ACCESSORIES',no:1,falg:fan.readSync()^1});

  deco.writeSync(deco.readSync() ^ 1);
  socket.emit('access',{type:'ACCESSORIES',no:2,falg:deco.readSync()^1});

function unexportOnClose() {
  LED.writeSync(0);
  LED.unexport();
  fan.writeSync(0);
  fan.unexport();
  deco.writeSync(0);
  deco.unexport();
};
process.on('SIGINT', unexportOnClose);

var rfid = new Rfid(readRfid);
var Gpio = require('onoff').Gpio,
    button = new Gpio(4, 'in', 'rising');
    button.watch(function (err, value) {
      if (err) {
        throw err;
      }
      console.log("level btn", value);
      if(!value) return;
          var player =Omx('./public/mp3/bell.wav');
          setTimeout(
              function() {
              player.quit();
          }, 5000);
    });
// var Gpio = require('pigpio').Gpio,
//     button = new Gpio(4, {
//         mode: Gpio.INPUT,
//         pullUpDown: Gpio.PUD_DOWN,
//         edge: Gpio.FALLING_EDGE
//     });
//
// button.on('interrupt', function (level) {
//     console.log("level btn", level);
//     socket.emit('control', {
//         type: DOORBTN,
//         no: 0,
//         falg: level
//     });
// });
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
    socket.on('access',function (data) {
      console.log('received from server',data);
      if(data.index == 0){
        LED.writeSync((data.value)? 0:1);
      }else if (data.index == 1) {
          fan.writeSync((data.value)? 0:1);
      }else{
        deco.writeSync((data.value)? 0:1);
      }
    });
});
// livecam
var webcam_server = new LiveCam({
    // address and port of the webcam UI
    'ui_addr': config.stream.ip,
    'ui_port': config.stream.port,

    // address and port of the webcam Socket.IO server
    // this server broadcasts GStreamer's video frames
    // for consumption in browser side.
    'broadcast_addr': config.stream.ip,
    // 'broadcast_port' : 12000,

    // address and port of GStreamer's tcp sink
    // 'gst_tcp_addr' : 127.0.0.1,
    // 'gst_tcp_port' : 10000,

    // callback function called when server starts
    'start': function() {
        console.log('WebCam server started!');
    },

    // webcam object holds configuration of webcam frames
    'webcam': {
        // should frames be converted to grayscale (default : false)
        //'grayscale' : true,

        // should width of the frame be resized (default : 0)
        // provide 0 to match webcam input
        'width': 0, // 640, 1024,

        // should height of the frame be resized (default : 0)
        // provide 0 to match webcam input
        'height': 0, //360,//768,

        // should a fake source be used instead of an actual webcam
        // suitable for debugging and development (default : false)
        'fake': false,

        // framerate of the feed (default : 0)
        // provide 0 to match webcam input
        'framerate': 25
    }
});
webcam_server.broadcast();
