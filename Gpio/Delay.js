var Gpio = require('onoff').Gpio;
var LED = new Gpio(2,'out');
var lampbtn = new Gpio(3,'in', 'falling');
var fan = new Gpio(17,'out');
var fanbtn = new Gpio(27,'in','falling');

lampbtn.watch(function(err, value) {
  if (err) {
    console.error('There was an error', err);
  return;
  }
  LED.writeSync(LED.readSync() ^ 1);
});

fanbtn.watch(function(err, value) {
  if (err) {
    console.error('There was an error', err);
  return;
  }
  fan.writeSync(fan.readSync() ^ 1);
});
function unexportOnClose() {
  LED.writeSync(0);
  LED.unexport();
  lampbtn.unexport();
  fan.writeSync(0);
  fan.unexport();
  fanbtn.unexport();
};
process.on('SIGINT', unexportOnClose);
