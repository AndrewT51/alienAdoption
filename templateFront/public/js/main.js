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

   .state('users.test',{
    url:'/test',
    templateUrl: '../templates/test.html',
    controller: 'testCtrl'
  })

})

.controller('navCtrl',function($scope,$state){
  console.log($state.current.name)
  $scope.stateName = $state.current
  $scope.$on('log', function(_,user){
    $scope.currentUser = JSON.parse(atob(user.data.split('.')[1])).name;
    console.log('Look: ', $scope.currentUser)
  })
})

.controller('testCtrl', function(){
  // $scope.currentUser
})

.controller('loginCtrl',function($scope, $http, userService){
  var theUser = $scope.user;
  $scope.submit = function(user){
    // $scope.user = '';
    userService.login(user,'users','login')
    .then(function successCallback(response) {
      localStorage.token = JSON.stringify(response);
    $scope.$emit('log', response);
      console.log(JSON.parse(localStorage.token))
    }, function errorCallback(error) {
      console.log(error)
    });

  }

})



