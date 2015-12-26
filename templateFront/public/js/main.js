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
}

})

.controller('petsCtrl', function(userService,$state,$scope,idSvc){
  userService.seeMarket()
  .then(function successCallback(res){

    $scope.picArray= [];
    res.data.forEach(function(pet,i){
      $scope.picArray.push( {
        url: pet.url,
        name: pet.name,
        blurb:pet.blurb,
        strength: pet.strength,
        speed: pet.speed,
        age: pet.age
        // focus: "unfocused",
        // id: i
      })
    })

    // $scope.picArray.forEach(function(item){
    //   console.log(item)
    //   $("#picHolder>*").addClass("focused").removeClass("unfocused")

    // })

    $("img[src$='"+$scope.picArray[1].url+"']").addClass("focused").removeClass("unfocused")
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



