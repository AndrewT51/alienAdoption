var myApp = angular.module('myApp')
.service('userService', function ($http, $state, idSvc) {
  this.login = function (data,url1,url2) {
    return $http.post(url1 + '/' + url2, data)
  }
  this.findState = function ($scope){
    $scope.state = $state.current.controller;
    $scope.$emit('status', $scope.state)
  }
  this.seeMarket = function(){
    var thing = localStorage.token ? JSON.parse(localStorage.token):"";
    return $http({
      method: 'GET',
      url: 'aliens/market',
      headers:{
        "Authorization": "Bearer " + thing.data
      }
    })
  }

  this.seeUsers = function(){
    var thing = localStorage.token ? JSON.parse(localStorage.token):"";
    var arrayOfUsers = $http({
      method: 'GET',
      url: 'users/show',
      headers:{
        "Authorization": "Bearer " + thing.data
      }
    })
    return arrayOfUsers;
  }

  this.myPets = function(){
    console.log(idSvc.getUserId)
    return $http.get('users/myPets/'+ idSvc.getUserId)
  }
})

.factory('idSvc', function(){
  return {
    getUserId : '',
    setUserId: function(id) {
      this.getUserId = id
    }
  }
})


// return {
//     data: {
//       num:''
//     },
//     update: function(num) {
//       this.data.num = num;  
//     }
//   };