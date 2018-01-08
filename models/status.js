var mongoose = require('mongoose');


var Schema = mongoose.Schema;
var StatusSchema = new Schema({
  lamps: [Boolean],
  windows:[Boolean],
  temp: Number,
  humidity: Number,
  door: {
    status: Number, // 0 close, 1 openning,  2 open
    isLock: Boolean
  },
  security:{
    isSet: Boolean,
    isDetected: Boolean
  },
  fire:{
    alarm: Boolean,
    gas: Number,
    flame: Number
  },
  key:String,

});

module.exports = mongoose.model('status', StatusSchema);
