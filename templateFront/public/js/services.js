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
  this.adoptPet = function(petId){
    var thing = localStorage.token ? JSON.parse(localStorage.token):"";
    return $http({
      method: 'POST',
      url: 'aliens/adoptAlien/' + idSvc.getUserId,
      data: {"_id" : petId},
      headers:{
        "Authorization": "Bearer " + thing.data
      }
    })
  }
  this.abandon = function(petId,index){
      var thing = localStorage.token ? JSON.parse(localStorage.token):"";
      return $http({
      method: 'POST',
      url: 'aliens/abandonAlien/' + idSvc.getUserId,
      data: {"_id" : petId, "index": index},
      headers:{
        "Authorization": "Bearer " + thing.data
      }
    })

  }

  this.sendmail = function(receiver, sender,pet, petToSwap){
    // var myId = idSvc.getUserId;
    var thing = localStorage.token ? JSON.parse(localStorage.token):"";
    // var pet = this.myPets()
    // .then(console.log(pet))
    
    return  $http({
      method: 'POST',
      url: 'users/sendmail',
      data: {"recipient" : receiver , "sender": sender, "pet": pet, "swap":petToSwap},
      // data: {"recipient" : receiver , "sender": sender},
      headers:{
        "Authorization": "Bearer " + thing.data
      }
    })
      
    


  }
  
  // this.detailsById = function(id){
  //   var thing = localStorage.token ? JSON.parse(localStorage.token):"";
  //   var arrayOfUsers = $http({
  //     method: 'GET',
  //     url: 'users/byId/' + id,
  //     headers:{
  //       "Authorization": "Bearer " + thing.data
  //     }
  //   })
  //   return aUser;
  // }



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

  this.myPets = function(petId){
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