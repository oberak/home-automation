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

var rfid = new Rfid(readRfid);
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
            var player = Omx('./public/mp3/01.mp3');
            setTimeout(
                function() {
                player.quit();
            }, (data.time) ? data.time * 1000 : 5000);
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
