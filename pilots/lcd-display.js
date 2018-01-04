/*
# 16x2 Display Output
# Components
    -
# Connections
    * (1) VSS - Ground
    * (2) VDD - 5v (not 3.3v)
    * (3) VO - 5K Ohm - Ground
      - Contrast adjustment from potentiometer
    * (4) RS(Register Select) - GPIO12 (Pin 32)
      - RS=0: Command, RS=1: Data
    * (5) RW(Read/Write) - Ground
      - R/W=0: Write, R/W=1: Read (we won't use this pin)
    * (6) E(Enable) -  GPIO16 (Pin 40)
      - Clock. Falling edge triggered
    * (7) D0 - Bit 0 (Not used in 4-bit operation)
    * (8) D1 - Bit 1 (Not used in 4-bit operation)
    * (9) D2 - Bit 2 (Not used in 4-bit operation)
    * (10) D3 - Bit 3 (Not used in 4-bit operation)
    * (11) D4(Bit 4) - GPIO5 (Pin 16)
    * (12) D5(Bit 5) - GPIO6 (Pin 11)
    * (13) D6(Bit 6) - GPIO13 (Pin 12)
    * (14) D7(Bit 7) - GPIO19 (Pin 15)
    * (15) A(Backlight LED Anode. +) - 5V
    * (16) K(Backlight LED Cathode. -) - Ground
 */

var Lcd = require('lcd'),
  lcd = new Lcd({rs: 12, e: 16, data: [5, 6, 13, 19], cols: 16, rows: 2});

lcd.on('ready', function () {
  setInterval(function () {

    lcd.setCursor(0, 0);                         // col 0, row 0
    lcd.print(new Date().toLocaleTimeString());
    console.log(new Date().toLocaleTimeString());

    lcd.once('printed', function () {
      lcd.setCursor(0, 1);                         // col 0, row 1

      var d = new Date();
      lcd.print( d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() );
    });

  }, 1000);
});
