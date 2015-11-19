var express = require('express');
var router = express.Router();
var User = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/addUser', function(req,res){
  User.create({
    name: req.body.name,
    age: req.body.age
  }, function(err,user){
    err ? res.send(err) : res.send(user);
  })
})

module.exports = router;
