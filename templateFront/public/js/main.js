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

})

.controller('navCtrl',function($scope,$state){
  $scope.signUpVisible = false;
  $scope.signUpButton = function (){
    $scope.signUpVisible = !$scope.signUpVisible;
  }
  $scope.$on('status', function(_,status){
    $scope.status = status
  })
  $scope.$on('log', function(_,user){
    $scope.currentUser = JSON.parse(atob(user.data.split('.')[1])).name;
    console.log('Look: ', $scope.currentUser)
  })
})

.controller('petsCtrl', function(userService,$state,$scope){
  userService.findState($scope);
  $scope.picArray = [
    {
      url:'/images/alien1.jpg',
      name: "Roger"
    },
    {
      url:'/images/alien2.jpg',
      name: "Bobby"
    },
    {
      url:'/images/alien3.jpg',
      name: "Davis"
    },
    {
      url:'/images/alien4.jpg',
      name: "Steven"
    }];


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

.directive('alienCard', function(){
  return {
    template: "<h1 class='cardHeading'>{{pic.name}}</h1><br><img src='{{pic.url}}'>"
  }
})



