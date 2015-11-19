var myApp = angular.module('myApp',['ui.router'])

.config(function($urlRouterProvider, $stateProvider){
  $urlRouterProvider.otherwise('/home');

  $stateProvider
  .state('home',{
    url:'/home',
    templateUrl: '../templates/index.html',
    controller: 'homeCtrl'
  })
})

.controller('homeCtrl',function($scope){
  console.log('hello')
})