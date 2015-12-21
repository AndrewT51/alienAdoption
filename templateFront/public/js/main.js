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

})

.controller('navCtrl',function($scope,$state){
  var namePortion = function(user){
    return JSON.parse(atob(user.data.split('.')[1]));
  }
  $scope.goToUsers = function(page){
    $scope.$broadcast('change', page)
  }
  if(!$scope.currentUser && localStorage.token){
    $scope.currentUser = namePortion(JSON.parse(localStorage.token)).name;
    $scope.profilePic = "http://gravatar.com/avatar/" + namePortion(JSON.parse(localStorage.token)).picUrl;
    console.log(JSON.stringify(localStorage.token))
  }
  $scope.signUpVisible = false;
  $scope.signUpButton = function (){
    $scope.signUpVisible = !$scope.signUpVisible;
  }
  $scope.$on('status', function(_,status){
    $scope.status = status
  })
  $scope.$on('log', function(_,user){
    // $scope.currentUser = JSON.parse(atob(user.data.split('.')[1])).name;
    $scope.currentUser = namePortion(user).name;
    $scope.profilePic = "http://gravatar.com/avatar/" + namePortion(user).picUrl;
    // debugger;
    console.log('Look: ', $scope.currentUser)
  })
  $scope.logout = function(){
    console.log('logout')
    delete localStorage.token;
    $scope.currentUser = null;
    $scope.profilePic = null;
    $state.go('home')
  }
})

.controller('petsCtrl', function(userService,$state,$scope){
  userService.seeMarket()
  .then(function successCallback(res){
    console.log(res);
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
  $scope.$on('change',function(change){
    $state.go('users.users')
  })


})

.controller('loginCtrl',function($scope, $http, userService, $state){
  userService.findState($scope);
  $scope.submit = function(user){
    var loginOrSignup = user.hasOwnProperty("email") ? "addUser": "login";
    userService.login(user,'users',loginOrSignup)
    .then(function successCallback(response) {
      localStorage.token = JSON.stringify(response);
      $scope.$emit('log', response);
      console.log(JSON.parse(localStorage.token))
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



