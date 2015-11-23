var myApp = angular.module('myApp')
.service('userService', function ($http, $state) {
  this.login = function (data,url1,url2) {
    return $http.post(url1 + '/' + url2, data)
    .then(function successCallback(response) {
      localStorage.token = JSON.stringify(response);
      console.log(JSON.parse(localStorage.token))
    }, function errorCallback(error) {
      console.log(error)
    });
  }
})