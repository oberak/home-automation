var mongoose = require('mongoose');
var dateformat = require('dateformat');

var Schema = mongoose.Schema;
var LogSchema = new Schema({
      events: String,
      type : String,
      index: Number,
      value:String,
      dec:String,
      src:String,
      time: Date,
});

LogSchema.virtual('updated_time').get(function () {
        return dateformat(this.time, 'dddd, mmmm dd, yyyy. HH:MM');
});
LogSchema.virtual('graph_time').get(function () {
        return dateformat(this.time, 'h:MM TT');
});
module.exports = mongoose.model('logs', LogSchema);
