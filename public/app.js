
var myApp = angular.module('myApp',['ngRoute']);






myApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider
    .when('/', {
    	templateUrl: 'partials/main.html',
      controller: 'MainController'
    	})
    .when('/events', {
      templateUrl: 'partials/events.html',
      controller: 'EventsController'
    })
     .when('/createEvent', {
      templateUrl: 'partials/createEvent.html',
      controller: 'EventsController'
    })
    .when('/myEvents', {
      templateUrl: 'partials/myEvents.html',
      controller: 'EventsController'
    })
    .when('/post/:id',
    {
      controller: 'PostsCommentsController',
      templateUrl: './partials/postComments.html'
    })
    .when('/pictures',{
      templateUrl : 'partials/pictures.html',
      controller : 'PicturesController' 
    })

    .when('/picture/:id', {
        templateUrl: 'partials/picture-details.html',
        controller: 'PicutresDetailCtrl'
      })
    .when('/login',{
      templateUrl : 'partials/login.html',
      controller :'UsersController'
    })
    .when('/signup',{
      templateUrl : 'partials/signup.html',
      controller :'UsersController'
    })
    .when('/users',{
      templateUrl : 'partials/users.html',
      controller : 'UsersController'
    })
    .otherwise({
      redirectTo: '/'
    })
  }]).

run(function($rootScope, $location, UsersService)  {
    $rootScope.$on('$routeChangeStart', function(event, nextRoute, currentRoute) {
      UsersService.isLoggedInApi();
      console.log("outside if")
      console.log($location.path())
      if ($location.path() != "/login")
        if($location.path() != "/signup")
        {
          console.log("inside first if", $location.path())
          if(!$rootScope.loggedInUser) {
            $location.path('/login');
        }
      }
    });
})

myApp.controller('MainController', ['$scope' , 'EventsService', 'UsersService' , 'PicturesService', '$location', function($scope, EventsService, UsersService, PicturesService, $location){


    // EventsService.getAllEvents()
    //     .success(function(events) {
    //          $scope.events = events;
    //     });
    // EventsService.getMyEvents()
    //     .success(function(myEvents) {
    //          $scope.myEvents = myEvents;
    //     });

    // PicturesService.getPictures()
    //     .success(function(pictures) {
    //          $scope.pictures = pictures;
    //     });
  
}])



myApp.controller('UsersController', ['$scope','$http','$location', 'UsersService' , 
    function($scope, $http, $location , UsersService){
  UsersService.getUsers()
        .success(function(users) {
             $scope.users = users;
        });

    $scope.orderProp = '+name';

    $scope.quantity = 5;

  $scope.register = function(newAccount){
    register($scope.newAccount);
    $scope.newAccount = '';
  }
  var loggedInUser =null;

  $scope.login = function(userDetails){
    login($scope.userDetails)
    $location.path('/')
    $scope.userDetails = '';
  }
  
  $scope.remove = function(id) {
    console.log(id);
    $http.delete('/api/users/' + id);
    $location.path('/users')
    console.log($location.path())
        
    };

  $scope.editUser = function(user) {
       $http.put('/api/user/' + user._id, user)
      }
  
  
}])


myApp.factory('UsersService', ['$http', '$window' , '$rootScope', function($http, $window, $rootScope){

  var saveToken = function (token) {
      $window.localStorage['mean-token'] = token;
  };


  var getToken = function () {
      return $window.localStorage['mean-token'];
  };

  logout = function() {
      $window.localStorage.removeItem('mean-token');
  };

  isLoggedIn = function() {
    var token = getToken();
    var payload;

    if(token !=null){
      payload = token.split('.')[1];
      payload = $window.atob(payload);
      payload = JSON.parse(payload);


      return payload;
    } else {
      return false;
    }
  };

  var currentUser = function() {
    if(isLoggedIn()){
      var token = getToken();
      var payload = token.split('.')[1];
      payload = $window.atob(payload);
      payload = JSON.parse(payload);
      return {
        email : payload.email,
        name : payload.name
      };
    }
  };




  register = function(newAccount){
    $http.post('api/users/registerNewUser', newAccount).then(function(res){
      console.log(res)
    })
   // console.log(newAccount)
  }

  remove = function(id){
    $http.delete('api/users/' + id);
  }
  

  login = function(userDetails){

    $http.post('/authenticate', userDetails).then(function(res)
    {
      if(res.success = true){

        saveToken(res.data.token)

      }else
      {
        logout();
      }
    
  })


  }

  loggedIn = function(){
    return loggedInUser;
  }

  
  var api = {
    getUsers : function() {
           return $http.get('/api/users')
     },

    loggedIn : function(){
    return loggedInUser;
  },
    getTokenApi : function(){
      getToken();
    },
    isLoggedInApi : function (){
      $rootScope.loggedInUser = isLoggedIn();
      isLoggedIn();
    }
  }
  return api
}])




myApp.controller('EventsController', ['$scope', '$http', '$location' ,'EventsService', 'UsersService', function ($scope, $http, $location , EventsService, UsersService) {

  

  EventsService.getAllEvents()
        .success(function(events) {
             $scope.events = events;
        });
   if($scope.loggedInUser != null){
  EventsService.getMyEvents($scope.loggedInUser)
        .success(function(myEvents) {
             $scope.myEvents = myEvents;
        });
   }

  $scope.quantity = 5;

  $scope.addEvent = function(){
    $scope.newEvent.admin = $scope.loggedInUser.name
    $scope.newEvent.adminId = $scope.loggedInUser._id
    console.log("adding event " + $scope.newEvent.title)
    addNewEvent($scope.newEvent);
    $scope.newEvent = '';
  }

    $scope.quantity = 5;

  $scope.joinEvent = function(event){
    var newAttender = $scope.loggedInUser
    addPersonToEvent(newAttender, event._id)

    console.log("adding event " + newAttender, "     ", event._id)
  }
}])


myApp.factory('EventsService', ['$http' , 'UsersService', function($http, UsersService){
 
     addNewEvent = function(newEvent) {
        console.log('in new event')
           $http.post('/api/events/', newEvent).success(function(res)
          {
         console.log ('worked' )
      })
      .error(function(err){
       console.log('error : ' + err)
         })
     }
     addPersonToEvent = function(newAttender, eventId){
        $http.post('/api/events/joinEvent/'+eventId, newAttender).success(function(res)
          {
         console.log ('added to event app.js' )
      })
      .error(function(err){
       console.log('error : ' + err)
         })
     }


   var api = {
     getAllEvents : function() {
           return $http.get('/api/events/' , {headers: {
        Authorization: 'Bearer '+ UsersService.getTokenApi()
      }
    })
     },
     
    getMyEvents : function(loggedInUser) {
      return $http.get('/api/events/myEvents/'+loggedInUser._id)

    }
  }
  return api
}])




myApp.controller('PicturesController',   ['$scope', '$http' ,'PicturesService', 'UsersService','$location',function($scope, $http , PicturesService, UsersService, $location) {


    if($scope.loggedInUser == null){
    $location.path('/login');
   }

  PicturesService.getPictures()
        .success(function(pictures) {
             $scope.pictures = pictures;
        });
     $scope.orderProp = 'name';
     $scope.quantity = 5;
}])



myApp.factory('PicturesService', ['$http', function($http){
 


   var api = {
     getPictures : function() {
           return $http.get('/api/pictures')
     }
  }
  return api
}])


myApp.controller('PicutresDetailCtrl', 
   ['$scope', '$routeParams', '$http', 'UsersService', 'PicturesService', 
   function($scope, $routeParams, $http , UsersService ,PicturesService) {

    $scope.loggedInUser = UsersService.loggedIn();

    $http.get('/api/pictures/picture/' + $routeParams.id)
        .success(function(picture) {
             $scope.picture = picture[0]
             console.log(picture.title)
        });

 $scope.addComment = function(){
    if($scope.loggedInUser != null){
      $scope.newComment.author = $scope.loggedInUser.name
    }

  addPictureComment($scope.picture._id, $scope.newComment)
    $scope.newComment=''
  $http.get('/api/pictures/picture/' + $routeParams.id)
        .success(function(picture) {
             $scope.picture = picture[0]
             console.log(picture.title)
        });
  }
  }])
