var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
  name: String,
  age: Number
});

module.exports = mongoose.model('User',User);