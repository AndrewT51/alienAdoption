var mongoose = require('mongoose');

var Alien = new mongoose.Schema({
  name: String,
  age: Number,
  strength: Number,
  speed: Number,
  url: String,
  date_added: String,
  isAdopted: Boolean
})

module.exports = mongoose.model('Alien', Alien);