'use strict';
var express = require('express');
var router = express.Router();
var auth = require('./authMiddleware')

var Alien = require('../models/alien')


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

router.get('/market', auth,function(req,res){
  Alien.find({}, function(err,data){
    if(err){res.send(err)}
    res.send(data);
  })
})

module.exports = router;