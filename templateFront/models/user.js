'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var jwt = require('jsonwebtoken');
var crypto = require('crypto');

var User = new Schema({
  name: String,
  age: Number,
  hash:String,
  salt:String,
  email: String,
  fullName: String,
  picUrl:String,
  pets:[{type: mongoose.Schema.ObjectId, ref: 'Alien' }]
});

User.methods.setPassword = function(password){
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password,this.salt,1000,64).toString('hex');
};

User.methods.validPassword = function(password){
  console.log(typeof password)
  var hash = crypto.pbkdf2Sync(password,this.salt,1000,64).toString('hex');
  return this.hash === hash;
};

User.methods.generateJWT = function(){
  var today = new Date();
  var exp = new Date(today);
  exp.setDate(today.getDate() + 60);

  return jwt.sign({
    _id: this._id,
    name: this.name,
    picUrl: this.picUrl,
    exp: parseInt(exp.getTime()/1000)
  }, process.env.SECRET);
};

module.exports = mongoose.model('User',User);