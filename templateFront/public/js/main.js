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

  $scope.abandon = function(petId, index){
    userService.abandon(petId, index)
    .then(function(){
      $scope.ownedPets.splice(index,1);
    })

  }
  if($scope.currentUser){
    userService.myPets()
    .then(function successCallback(data){
      $scope.ownedPets = data.data;


    })
  }

})

.controller('petsCtrl', function(userService,$state,$scope,idSvc){
  userService.seeMarket()
  .then(function successCallback(res){

    $scope.picArray= [];
    var counter = 1 // = res.data.length-1;
    res.data.forEach(function(pet,i){
      $scope.picArray.push( {
        url: pet.url,
        name: pet.name,
        blurb:pet.blurb || "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptas quibusdam, tenetur commodi aliquid sequi laudantium ratione officia, animi veniam, vitae libero a corrupti labore id doloribus assumenda perferendis aliquam repellendus mollitia. Repellat rem nulla in tempore ut illum adipisci saepe accusamus, quis animi, repudiandae ducimus ad modi quaerat minus quos",
        strength: pet.strength,
        speed: pet.speed,
        age: pet.age,
        id: pet._id
  
      });
      setTimeout(function() {
     
        counter -= 1;
        if ( counter === 0)
          callback();
      }, pet);
    })

    function callback(){
      console.log(res.data)
      $(".picArray img[src$='"+$scope.picArray[1].url+"']").addClass("focused").removeClass("unfocused")

    }







$scope.adopt = function(index){
  userService.adoptPet($scope.picArray[1].id)
  .then(function successCallback(){
    console.log('done')
    $scope.picArray.splice(1,1);
    callback();


   

      })
}

 
console.log($("img[src$='"+$scope.picArray[2].url+"']"))
$scope.slideRight = function(){
  $("img[src$='"+$scope.picArray[1].url+"']").addClass("unfocused").removeClass("focused")
  $scope.picArray.push($scope.picArray.shift())
  $("img[src$='"+$scope.picArray[1].url+"']").addClass("focused").removeClass("unfocused")
  $("#picHolder>img").addClass("focused").removeClass("unfocused")
}
$scope.slideLeft = function(){
  $("img[src$='"+$scope.picArray[1].url+"']").addClass("unfocused").removeClass("focused")
  $scope.picArray.unshift($scope.picArray.pop())
  $("img[src$='"+$scope.picArray[1].url+"']").addClass("focused").removeClass("unfocused")
  $("#picHolder>img").addClass("focused").removeClass("unfocused")
}

      // $scope.picArray[2].focus=true;
      // console.log($scope.picArray)
    },
    function errorCallback(){
      console.log("Error")
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



