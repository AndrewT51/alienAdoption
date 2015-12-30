'use strict';
var express = require('express');
var router = express.Router();
var auth = require('./authMiddleware');
var User = require('../models/user');
var Alien = require('../models/alien');


router.post('/addAlien', function(req,res){
  var alien = new Alien();
  alien.name = req.body.name;
  alien.age = req.body.age;
  alien.speed = req.body.speed;
  alien.strength = req.body.strength;
  alien.url = req.body.url;
  alien.save(function(err, data){
    if(err) res.send(err)
    res.send("Successfully saved")
  });
})

router.post('/adoptAlien/:user',function(req,res){
  Alien.findById(req.body._id, function(err,alien){
    User.findById(req.params.user, function(err,user){
      console.log(req.body)
      alien.isAdopted = true;
      user.pets.push(req.body._id);
      alien.save();
      user.save();
      res.send(user)
    })

  })
})

router.post('/abandonAlien/:user',function(req,res){
  Alien.findById(req.body._id, function(err,alien){
    User.findById(req.params.user, function(err,user){
      console.log(req.body)
      alien.isAdopted = false;
      user.pets.splice(req.body.index,1);
      alien.save();
      user.save();
      res.send(user)
    })

  })
})

router.get('/market',function(req,res){
  Alien.find({isAdopted:false}, function(err,data){
    if(err){res.send(err)}
    res.send(data);
  })
})

module.exports = router;