var mongoose = require('mongoose');
var dateformat = require('dateformat');

var Schema = mongoose.Schema;
var LogSchema = new Schema({
      name: String,
      rfid : String,
      status: String,
      login: { type: Date, default: Date.now},

});
LogSchema.virtual('updated_login').get(function () {
        return dateformat(this.login, 'dddd, mmmm dd, yyyy. HH:MM');
});
module.exports = mongoose.model('logs', LogSchema);
