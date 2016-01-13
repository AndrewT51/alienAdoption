var mongoose = require('mongoose');

var Alien = new mongoose.Schema({
  name: {type:String,required:true},
  age: Number,
  strength: Number,
  blurb: String,
  speed: Number,
  url: String,
  date_added: {type: Date, default: Date.now},
  isAdopted: {type:Boolean, default: false}
})

module.exports = mongoose.model('Alien', Alien);