var myApp = angular.module('myApp')
.service('userService', function ($http, $state) {
  this.login = function (data,url1,url2) {
    return $http.post(url1 + '/' + url2, data)
  }
  this.findState = function ($scope){
    $scope.state = $state.current.controller;
    $scope.$emit('status', $scope.state)
  }
  this.seeMarket = function(){
    thing = localStorage.token ? JSON.parse(localStorage.token):"";
    return $http({
      method: 'GET',
      url: 'aliens/market',
      headers:{
        "Authorization": "Bearer " + thing.data
      },
      "X-testing": "testing"
    })
  }
})