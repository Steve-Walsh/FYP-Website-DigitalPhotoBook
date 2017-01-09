
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
  }])

myApp.controller('MainController', ['$scope' , 'EventsService', 'UsersService' , 'PicturesService', '$location', function($scope, EventsService, UsersService, PicturesService, $location){
   $scope.loggedInUser = UsersService.loggedIn();

   if($scope.loggedInUser == null){
    $location.path('/login');
   }

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
    login($scope.userDetails, $scope.users)
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


myApp.factory('UsersService', ['$http', function($http){

  register = function(newAccount){
    $http.post('api/users/registerNewUser', newAccount);
    console.log(newAccount)
  }

  remove = function(id){
    $http.delete('api/users/' + id);
  }
  var loggedInUser=null

  login = function(userDetails, users){
    console.log(userDetails.email)
    users.forEach(function(user){
    if(user.email == userDetails.email){
        console.log("email is right " + user.email + "  -  " + userDetails.email)
        if(user.password == userDetails.password){
          loggedInUser = user;
          console.log("user has logged in " + user.email)
              }
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
  }
  }
  return api
}])




myApp.controller('EventsController', ['$scope', '$http', '$location' ,'EventsService', 'UsersService', function ($scope, $http, $location , EventsService, UsersService) {
  
  $scope.loggedInUser = UsersService.loggedIn();
  
   if($scope.loggedInUser == null){
    console.log("redirect :",$scope.loggedInUser);
    $location.path('/login');
   }

  EventsService.getAllEvents()
        .success(function(events) {
             $scope.events = events;
        });
  EventsService.getMyEvents($scope.loggedInUser)
        .success(function(myEvents) {
             $scope.myEvents = myEvents;
        });

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


myApp.factory('EventsService', ['$http', function($http){
 
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
           return $http.get('/api/events/')
     },
     
    getMyEvents : function(loggedInUser) {
      return $http.get('/api/events/myEvents/'+loggedInUser._id)

    }
  }
  return api
}])




myApp.controller('PicturesController',   ['$scope', '$http' ,'PicturesService', 'UsersService','$location',function($scope, $http , PicturesService, UsersService, $location) {

  $scope.loggedInUser = UsersService.loggedIn();

    if($scope.loggedInUser == null){
    $location.path('/login');
   }

  PicturesService.getPictures()
        .success(function(pictures) {
             $scope.pictures = pictures;
        });
     $scope.orderProp = 'name';
     $scope.quantity = 5;

  $scope.incrementUpvotes = function(picture) {
 //post.upvotes += 1;
    console.log('picture id : ' + picture._id)
    $http.post('api/pictures/' +picture._id+'/upvotes', picture)

    PicturesService.getPictures()
        .success(function(pictures) {
             $scope.pictures = pictures;
        });
  }

  $scope.addPicture = function(){
    if($scope.loggedInUser != null){
      $scope.newPicture.author = $scope.loggedInUser.name
    }
    console.log("adding picture " + $scope.newPicture)
    addNewPicture($scope.newPicture);
    $scope.newPicture = '';
  }
}])



myApp.factory('PicturesService', ['$http', function($http){
 
     addNewPicture = function(newPicture) {
           $http.post('/api/pictures', newPicture).success(function(res)
          {
         console.log ('worked' )
      })
      .error(function(err){
       console.log('error : ' + err)
         })
     }
     
     addPictureComment = function(post_id, comment) {
          return $http.post('/api/posts/' + post_id + '/comments' ,
                            comment)
     }

  //   deletPost= function(id){
  //     $http.delete('api/posts/' + id);
  // }


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
