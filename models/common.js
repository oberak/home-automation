var mongoose = require('mongoose');
var dateformat = require('dateformat');

var Schema = mongoose.Schema;
var CommonSchema = new Schema({
      name: String,
      email: String,
      address : String,
      phone : String,
      password: String,
      last_login :Date,
      updated: { type: Date, default: Date.now},
      inserted:  { type: Date, default: Date.now},
});
CommonSchema.virtual('updated_date').get(function () {
        return dateformat(this.updated, 'dddd, mmmm dd, yyyy. HH:MM');
});
module.exports = mongoose.model('Commons', CommonSchema);
