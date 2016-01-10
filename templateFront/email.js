module.exports = function(req){
  return {
    greeting: "<h3>Hello " + req.body.recipient.name + ",</h3>",
    paragraph: "<p>One of our users is interested in swapping one of the pets he owns for one of yours. "
    + req.body.sender + " would like to ask you if you'd like to swap:</p><br>",
    pictures: '<img src="http://img05.deviantart.net/dd46/i/2008/186/8/4/bloodmark_mentor_by_daveallsop.jpg" style="width:200px;height:auto;"> for '
    + '<img src="' + req.body.pet.url +'" style="width:200px;height:auto;">'
  }
}