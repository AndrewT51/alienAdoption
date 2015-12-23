var myApp = angular.module('myApp',['ui.router'])

.config(function($urlRouterProvider, $stateProvider){
  $urlRouterProvider.otherwise('/')

  $stateProvider
  .state('home',{
    url:'/',
    templateUrl: '../templates/home.html',
    controller: 'navCtrl'
  })

  .state('users', { 
    abstract: true, 
    templateUrl: '/templates/home.html',
    controller: 'navCtrl'
  })

  .state('users.login',{
    url:'/login',
    templateUrl: '../templates/login.html',
    controller: 'loginCtrl'
  })

  .state('users.pets',{
    url:'/pets',
    templateUrl: '../templates/pets.html',
    controller: 'petsCtrl'
  })
  
  .state('users.users',{
    url:'/users',
    templateUrl: '../templates/users.html',
    controller: 'usersCtrl'
  })
   .state('users.myPets',{
    url:'/usersPets',
    templateUrl: '../templates/usersPets.html',
    controller: 'usersPetsCtrl'
  })

})

.controller('navCtrl',function($scope,$state,userService,idSvc){
  var namePortion = function(user){
    return JSON.parse(atob(user.data.split('.')[1]));
  }

  if(!$scope.currentUser && localStorage.token){
    $scope.currentUser = namePortion(JSON.parse(localStorage.token)).name;
    $scope.profilePic = "http://gravatar.com/avatar/" + namePortion(JSON.parse(localStorage.token)).picUrl;
    idSvc.setUserId(JSON.parse(atob(JSON.parse(localStorage.token).data.split('.')[1]))._id);
  }
  $scope.signUpVisible = false;
  $scope.signUpButton = function (){
    $scope.signUpVisible = !$scope.signUpVisible;
  }
  $scope.$on('status', function(_,status){
    $scope.status = status
  })
  $scope.$on('log', function(_,user){
    $scope.currentUser = namePortion(user).name;
    $scope.profilePic = "http://gravatar.com/avatar/" + namePortion(user).picUrl;
  })
  $scope.logout = function(){
    delete localStorage.token;
    $scope.currentUser = null;
    $scope.profilePic = null;
    idSvc.setUserId('');
    $state.go('home')
  }
})

.controller('usersPetsCtrl', function($scope, userService){
  // debugger;
  if($scope.currentUser){
    userService.myPets()
  .then(function successCallback(data){
    $scope.ownedPets = data.data
  // debugger;
  })

function activateThumb(no) {
  $("#carouselThumb li").removeClass("active");
  $("#carouselThumb li:eq("+no+")").addClass("active");
}
function bigSlideControl(arg) {
  var oBigController = arg;
  var currentItem = oBigController.getCurrentID();
  activateThumb(currentItem);
  if(currentItem==0) {
    $("#imgLeftBig").css({opacity:0.4});
  } else {
    $("#imgLeftBig").css({opacity:1});
  }
  
  //console.debug("currentItem "+currentItem)
  if(thumbs!=undefined) {
    thumbs.goto(parseInt(currentItem));
  } 
//  alert(currentItem);
}
function thumbSlideControl(arg) {
  var oController = arg;
  var currentItem = oController.getCurrentID();
  if(currentItem==0) {
    $("#imgLeftThumb").css({opacity:0.4});
  } else {
      $("#imgLeftThumb").css({opacity:1})
  }
}

// autoSlide:2000, 
var oBigController = $("#carouselBig").msCarousel({width:900, height:369,callback:bigSlideControl, showMessage:true, messageOpacity:1}).data("msCarousel");
var thumbs = $("#carouselThumb").msCarousel({boxClass:'li', width:900, height:78, callback:thumbSlideControl, scrollSpeed:500}).data("msCarousel");

//big button click
$("#imgRightBig").click(function() {
  oBigController.next();
});
$("#imgLeftBig").click(function() {
  oBigController.previous();
})

//thumb click
$("#imgRightThumb").click(function() {
  thumbs.next();
});
$("#imgLeftThumb").click(function() {
  thumbs.previous();
})

//add click event
$("#carouselThumb li").click(function(arg) {
  var target = this;
  var counter = $("#carouselThumb li").index(target);
  oBigController.goto(parseInt(counter));
})
  //no use
  $("#ver").html("v"+oBigController.getVersion());  
}



})

.controller('petsCtrl', function(userService,$state,$scope,idSvc){
  userService.seeMarket()
  .then(function successCallback(res){

    $scope.picArray= [];
    res.data.forEach(function(pet){
      $scope.picArray.push( {
        url: pet.url,
        name: pet.name,
        strength: pet.strength,
        speed: pet.speed,
        age: pet.age
      })

    },
    function errorCallback(){
      console.log("Error")
    })

  })
})

.controller('loginCtrl',function($scope, $http, userService, $state, idSvc){
  userService.findState($scope);
  $scope.submit = function(user){
    var loginOrSignup = user.hasOwnProperty("email") ? "addUser": "login";
    userService.login(user,'users',loginOrSignup)
    .then(function successCallback(response) {
      localStorage.token = JSON.stringify(response);
      idSvc.setUserId(JSON.parse(atob(JSON.parse(localStorage.token).data.split('.')[1]))._id)
      $scope.$emit('log', response);
      $state.go('users.pets')

    }, function errorCallback(error) {
      console.log(error)
    });
  }
})

.controller('usersCtrl',function($scope, userService){
  userService.seeUsers()
  .then(function successCallback(res){
    $scope.users = [];
    res.data.forEach(function(person){
      if(person.name !== $scope.currentUser) $scope.users.push(person);
    })
  })
})

.directive('alienCard', function(){
  return {
    templateUrl: "/templates/test.html"
  }
})

.directive('memberCard', function(){
  return {
    templateUrl: "/templates/userDetailsCard.html"
  }
})

// .directive('outerHeight', function(){
//   return{
//     restrict:'A',
//     link: function(scope, element){
//        //using outerHeight() assumes you have jQuery
//        //use Asok's method in comments if not using jQuery
//        console.log(element.outerHeight()); 
//     }
//   };
// });



