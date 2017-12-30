/*
# RFID-RC522
# Pin
    - (1)SDA: (24)GPIO8 (CE0)
    - (2)SCK: (23)GPIO11 (SCKL)
    - (3)MOSI: (19)GPIO10 (MOSI)
    - (4)MISO: (21)GPIO9 (MISO)
    - (5)IRQ: (Not Connected) GPIO24
    - (6)GND: (25)Ground
    - (7)RST: (22)GPIO25
    - (8)3.3V: (1)3.3V
# needed: BCM 2835 library
# needed: sudo node rfid.js
*/

var rc522 = require("rc522");

console.log('Ready!!!');

rc522(function(rfidSerialNumber){
    console.log(rfidSerialNumber);
});
