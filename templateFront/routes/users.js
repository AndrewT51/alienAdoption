'use strict';
var express = require('express');
var router = express.Router();
var User = require('../models/user');
// var jwt = require('jsonwebtoken');
var atob = require('atob');
var auth = require('./authMiddleware');
// var auth = jwt({secret: process.env.SECRET, userProperty: 'payload'});

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/addUser', function(req,res){
  var user = new User();
  user.age= req.body.age;
  user.name= req.body.name;
  user.setPassword(req.body.password);
  user.save(function(err,user){
    if (err){
      res.send(err)
    }else{
      var jwt = user.generateJWT();
      res.send(jwt);
    }
  })
})

router.post('/login', function(req,res){
  console.log(req.body)
  User.findOne({name:req.body.name}, function(err,user){
    if(!user || !user.validPassword(req.body.password)){
      res.send('Invalid login credentials')
    }else{
      console.log('User' + user)
      var jwt = user.generateJWT();
      res.send(jwt)
    }
  })
})

router.get('/hello', auth, function(req,res){
  res.send('yippee')
})


module.exports = router;
