'use strict';
var express = require('express');
var router = express.Router();
var User = require('../models/user');
var atob = require('atob');
var auth = require('./authMiddleware');
var crypto = require('crypto');



/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/addUser', function(req,res){
  var user = new User();
  user.age= req.body.age;
  user.name= req.body.name;
  user.email= req.body.email;
  user.fullName= req.body.fullName;
  user.setPassword(req.body.password);
  user.picUrl =   crypto.createHash('md5')
                  .update(req.body.email)
                  .digest("hex");
  user.pets = [];
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

router.get('/show', function(req,res){
  User.find({},'name picUrl', function(err, user){
    err ? res.send(err) : res.send(user);
  })
})

router.get('/mypets/:pets',function(req,res){
  User.findById(req.params.pets,'pets', function(err,user){
    res.send(user)

  })
})

router.get('/hello', auth, function(req,res){
  res.send('yippee')
})


module.exports = router;
