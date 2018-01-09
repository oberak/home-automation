var mongoose = require('mongoose');
var dateformat = require('dateformat');

var Schema = mongoose.Schema;
var MemberSchema = new Schema({
      name: String,
      rfid : String,
      options : String,
      last_login :Date,
      updated: { type: Date, default: Date.now},
      inserted:  { type: Date, default: Date.now},
});
MemberSchema.virtual('updated_date').get(function () {
        return dateformat(this.updated, 'dddd, mmmm dd, yyyy. HH:MM');
});
module.exports = mongoose.model('members', MemberSchema);
