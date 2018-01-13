/*
# 16x2 Display Output
# Components
    -
# Connections
    * (1) VSS - Ground
    * (2) VDD - 3.3v
    * (3) VO - 2K Ohm(or 1K x 2) - Ground
      - Contrast adjustment from potentiometer
    * (4) RS(Register Select) - GPIO23 (Pin 16)
      - RS=0: Command, RS=1: Data
    * (5) RW(Read/Write) - Ground
      - R/W=0: Write, R/W=1: Read (we won't use this pin)
    * (6) E(Enable) -  GPIO24 (Pin 18)
      - Clock. Falling edge triggered
    * (7) D0 - Bit 0 (Not used in 4-bit operation)
    * (8) D1 - Bit 1 (Not used in 4-bit operation)
    * (9) D2 - Bit 2 (Not used in 4-bit operation)
    * (10) D3 - Bit 3 (Not used in 4-bit operation)
    * (11) D4(Bit 4) - GPIO12 (Pin 32)
    * (12) D5(Bit 5) - GPIO16 (Pin 36)
    * (13) D6(Bit 6) - GPIO20 (Pin 38)
    * (14) D7(Bit 7) - GPIO21 (Pin 40)
    * (15) A(Backlight LED Anode. +) - 3.3v
    * (16) K(Backlight LED Cathode. -) - Ground
 */

var Lcd = require('lcd'),
    lcd = new Lcd({rs: 23, e: 24, data: [12, 16, 20, 21], cols: 16, rows: 2});

function Display(opt){
    if(!opt){
        opt = { time: 3};
    }
    var isMessage = false;
    var clockInterval;
    lcd.on('ready', function () {
        clockInterval = setInterval(dispClock, 1000);
    });
    this.print = function(msg1, msg2, time){
        if(isMessage) return;
        isMessage = true;
        var dispTime = ( (time)?time:opt.time ) * 1000;
        clock(false);
        disp(msg1, msg2);
        setTimeout(function(){
            clock(true);
            isMessage = false;
        }, dispTime);
    };
    function clock(status){
        if(status){
            clockInterval = setInterval(dispClock, 1000);
        }else{
            clearInterval(clockInterval);
        }
    }
    function disp(msg1, msg2){
        //console.log('disp',msg1, msg2);
        lcd.setCursor(0, 0);
        lcd.print(msg1.padEnd(16));
        lcd.once('printed', function () {
            lcd.setCursor(0, 1);                         // col 0, row 1
            lcd.print( msg2.padEnd(16) );
        });
    }
    function dispClock(){
        var d = new Date();
        var dt = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
        disp(new Date().toLocaleTimeString(), dt);
    }
}

module.exports = Display;
