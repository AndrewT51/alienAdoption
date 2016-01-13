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
  .state('users.swap',{
    url:'/usersSwap',
    templateUrl: '../templates/usersSwap.html',
    controller: 'usersSwapCtrl'
  })
   .state('users.addPet',{
    url:'/addPet',
    templateUrl: '../templates/addPet.html',
    controller: 'addPetCtrl'
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
    // $scope._id = namePortion(JSON.parse(localStorage.token))._id;
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
    // $scope._id = namePortion(user)._id;
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

  $scope.abandon = function(petId, index){
    userService.abandon(petId, index)
    .then(function(){
      $scope.ownedPets.splice(index,1);
    })

  }
  if($scope.currentUser){
    userService.myPets()
    .then(function successCallback(data){
      $scope.ownedPets = data.data;

    })
  }

})

.controller('petsCtrl', function(userService,$state,$scope,idSvc){
  userService.seeMarket()
  .then(function successCallback(res){

    $scope.picArray= [];
    var counter = 1 

    res.data.forEach(function(pet,i){
      $scope.picArray.push( {
        url: pet.url,
        name: pet.name,
        blurb:pet.blurb || "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptas quibusdam, tenetur commodi aliquid sequi laudantium ratione officia, animi veniam, vitae libero a corrupti labore id doloribus assumenda perferendis aliquam repellendus mollitia. Repellat rem nulla in tempore ut illum adipisci saepe accusamus, quis animi, repudiandae ducimus ad modi quaerat minus quos",
        strength: pet.strength,
        speed: pet.speed,
        age: pet.age,
        id: pet._id

      });
      setTimeout(function() {

        counter -= 1;
        if ( counter === 0)
          callback();
      }, pet);
    })

    function callback(){
      $(".picArray img[src$='"+$scope.picArray[1].url+"']").addClass("focused").removeClass("unfocused")
      if(!$scope.currentUser){
        randomPicPlacer();
      }

    }

    function randomPicPlacer(){
      var cloneOfArray = $scope.picArray.slice();
      $scope.disorderedArray = [];
      while(cloneOfArray.length){
        var chosenElement = Math.floor(Math.random() * cloneOfArray.length);
        $scope.disorderedArray.push(cloneOfArray[chosenElement]);
        cloneOfArray.splice(chosenElement,1)



      }
      for (var i = 0; i < $scope.picArray.length || i < 3; i ++){

        var xCoord = Math.floor(Math.random() * 70) + 10;
        var yCoord = Math.floor(Math.random() * 70) + 10;
        var picSize = Math.floor(Math.random() * -5)+ 13;
        var randRatio = Math.floor(Math.random()*(-1)) + 1;
        var randRotate = Math.floor(Math.random()*44) -22;
        var height = picSize/randRatio;



        $('#picDisplayBoard').append("<a ><img src='"+$scope.disorderedArray[i].url+"' data-id='"+i+"' class='rotatedPics'></a>")
        $('[data-id="'+i+'"]').css({display: 'inline-block',margin: picSize+'px '+ xCoord + 'px', top: xCoord+'%',left:yCoord + '%',width: picSize+'%', height:height+'%', margin:'5px',transform: 'rotateZ('+randRotate+'deg)', border:'1px black solid'}).css('background-color','#4f4545')
        // $('[data-id="'+i+'"]').css({transform: 'rotateZ('+randRotate+'deg)'})
        // $('.viewContainer').css('background-color','#4f4545');
      }
      

    }

    $scope.adopt = function(index){
      userService.adoptPet($scope.picArray[1].id)
      .then(function successCallback(){
        console.log('done')
        $scope.picArray.splice(1,1);
        callback();


      })
    }


    console.log($("img[src$='"+$scope.picArray[2].url+"']"))
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

  },
  function errorCallback(){
    console.log("Error")
  })

})

.controller('loginCtrl',function($scope, $http, userService, $state, idSvc){
  // userService.findState($scope);
  $scope.redoLoginDetails = false;
  $scope.submit = function(user){
    var loginOrSignup = user.hasOwnProperty("email") ? "addUser": "login";
    userService.login(user,'users',loginOrSignup)
    .then(function successCallback(response) {
      console.log(response)
      localStorage.token = JSON.stringify(response);
      idSvc.setUserId(JSON.parse(atob(JSON.parse(localStorage.token).data.split('.')[1]))._id)
      $scope.$emit('log', response);
      $state.go('users.pets')

    }, function errorCallback(error) {

      console.log(error)
      $scope.redoLoginDetails = true;
      // $state.go('home')
    });
  }
})

.controller('usersCtrl',function($scope, userService,$filter,idSvc){
  userService.seeUsers()
  .then(function successCallback(res){
    $scope.users = [];
    res.data.forEach(function(person){
      if(person.name !== $scope.currentUser) $scope.users.push(person);
    })
    $scope.users = $filter('orderBy')($scope.users, "pets.length", true)


    $scope.action = function(index){
      $scope.visibleUser = index;
    }


    $scope.swapPet = function(pet, user){
      $scope.thisPet = pet;
      userService.myPets()
      .then(function successCallback(res){
        $scope.pets = res.data
      })
      $('#myModal').modal('show')
      $scope.swapChoice = function(petToSwap){
        console.log(petToSwap)
        $('#myModal').modal('hide')
        userService.sendmail(user, $scope.currentUser, pet, petToSwap)
        .then(function successCallback(response){
          console.log("mail sent to "+ user.email)

        })

      }



    }
  })

})

.controller('addPetCtrl', function($scope, userService){
  console.log('add pet controller')
  $scope.submit = function(){
    userService.addPet($scope.pet)
    .then(function successCallback(response){
          console.log(response);
          $scope.pet = '';

        })

  }

})

// .controller('usersSwapCtrl', function($scope,userService){
//   userService.seeUsers()
//   .then(function successCallback(res){
//     $scope.users = [];
//     res.data.forEach(function(person){
//       if(person.name !== $scope.currentUser) $scope.users.push(person);
//     })
//     $scope.users = $filter('orderBy')($scope.users, "pets.length", true)
//     $scope.swapPet = function(pet){
//       console.log(pet)

//     }

//   })

//   console.log('swapping')

// })

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





