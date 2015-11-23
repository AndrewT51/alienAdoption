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

})

.controller('navCtrl',function($scope,$state){
  console.log($state.current.name)
  $scope.stateName = $state.current
})

.controller('loginCtrl',function($scope, $http, userService){
  var theUser = $scope.user;
  $scope.submit = function(user){
    $scope.user = '';
    userService.login(user,'users','login')
  }

})



