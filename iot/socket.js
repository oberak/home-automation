var Gpio = require('./Gpio');

exports.init = function(server) {
    var io = require('socket.io')(server);
    io.on('connection', function(socket) { // WebSocket Connection
        console.log('socket connected..');
        var gpio = new Gpio(callback);
        socket.on('control', function(data) { // receive data from client
            switch (data.type) {
                case 'lamp':
                    gpio.lamps.toggle(data.no);
                    break;
                case 'door':
                    if (data.no == 0) {
                        console.log(' Door On is  ', data.flag);
                    } else {
                        console.log('Door lock is ', data.flag);
                    }
                    break;
                case 'security':
                    console.log('Security is ', data.flag);
                    break;
                case 'alert':
                    console.log('Alert is ', data.flag);
                    break;
            }
        });
        /**
         * Gpio callback function
         * @param  {[type]}   type  [description]
         * @param  {[type]}   index index of array
         * @param  {[type]}   value [description]
         */
        function callback(type, index, value){
            console.log('callback:', type, index, value);
        }
    });
};
