var mongoose = require('mongoose');

var Alien = new mongoose.Schema({
  name: String,
  age: Number,
  strength: Number,
  blurb: String,
  speed: Number,
  url: String,
  date_added: String,
  isAdopted: {type:Boolean, default: false}
})

module.exports = mongoose.model('Alien', Alien);