
var myApp = angular.module('myApp',['ngRoute', 'ui.bootstrap.datetimepicker']);

myApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider
    .when('/', {
    	templateUrl: 'partials/main.html',
      controller: 'MainController'
    })
    .when('/events', {
      templateUrl: 'partials/events.html',
      controller: 'EventsController',
      activetab: 'events'
    })
    .when('/createEvent', {
      templateUrl: 'partials/createEvent.html',
      controller: 'EventsCreateController'

    })
    .when('/myEvents', {
      templateUrl: 'partials/myEvents.html',
      controller: 'MyEventsController'
    })
    .when('/eventDetails/:id', {
      templateUrl: 'partials/eventDetails.html',
      controller: 'EventDetailsController'
    })
    .when('/finishedEvents', {
      templateUrl: 'partials/finishedEvents.html',
      controller: 'FinishedEventsController'
    })
    // .when('/post/:id',
    // {
    //   controller: 'PostsCommentsController',
    //   templateUrl: './partials/postComments.html'
    // })
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

    .when('/face', {
      templateUrl: 'partials/faceDet.html',
      controller: 'faceDetController'
    })

    .when('/logout', {
      controller : 'LogoutController'
    })
    .otherwise({
      redirectTo: '/'
    })
  }]).

run(function($rootScope, $location, UsersService, $route)  {
 $rootScope.$on("$locationChangeStart", function(event, next, current) {

  UsersService.isLoggedInApi();

  if(!$rootScope.loggedInUser){
    if($location.path() != '/signup'){
      if($location.path() != '/login'){
        $location.path('/login');
      }
    }
  }
});
})

myApp.controller('MainController', ['$scope' , 'EventsService', 'UsersService' , 'PicturesService', '$location', function($scope, EventsService, UsersService, PicturesService, $location){


  $scope.loggedInUser = UsersService.getLoggedInUser();
  //$scope.logout = logout()

}])

myApp.controller('LogoutController', ['$scope' , 'EventsService', 'UsersService' , 'PicturesService', '$location', function($scope, UsersService){


  // $scope.loggedInUser = UsersService.getLoggedInUser();
  UsersService.logout()

}])


myApp.controller('UsersController', ['$scope','$http','$location', 'UsersService' , 
  function($scope, $http, $location , UsersService){

    var loggedInUser = UsersService.getLoggedInUser();

    // if($location.path() == '/login'){
    //   if(isLoggedIn != null){
    //     $location.path('/')
    //   }
    // }else if($location.path() == '/signup'){
    //   if(isLoggedIn != null){
    //     $location.path('/')
    //   }
    // }




   //  UsersService.getUsers()
   //  .success(function(users) {
   //   $scope.users = users;
   // });

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


myApp.factory('UsersService', ['$http', '$window' , '$rootScope', '$location', function($http, $window, $rootScope, $location){

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
        name : payload.name,
        id: payload._id
      };
    }
    else{
      return null;
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
      console.log(res.success)

      saveToken(res.data.token)
      $location.path('/')

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
 //  getUsers : function() {
 //   return $http.get('/api/users')
 // },
 loggedIn : function(){
  return loggedInUser;
},
getTokenApi : function(){
  return getToken();
},
isLoggedInApi : function (){
  $rootScope.loggedInUser = isLoggedIn();
},

getLoggedInUser : function (){
  return currentUser();
}
}

return api
}])


// All event contollers and services

myApp.controller('EventsController', ['$scope', '$http', '$location' ,'EventsService', 'UsersService', '$route', function ($scope, $http, $location , EventsService, UsersService, $route) {

  var loggedInUser = UsersService.getLoggedInUser();

  $scope.$route = $route;
  var allEvents = []

  EventsService.getAllEvents()
  .success(function(events) {
   events.forEach(function(event){
     if(event.publicEvent){
      allEvents.push(event)
    }else{
      event.attenders.forEach(function(curEvent){
        console.log(curEvent)
        curEvent.attenders.forEach(function(person){
          if(person.id == loggedInUser.id){
            allEvents.push(event)
          }})
      })
      if(event.adminId == loggedInUser.id){
        allEvents.push(event)
      }
    }
  })

   $scope.events = allEvents;
 });

  $scope.numLimit = 5;


  $scope.joinEvent = function(event){
    var newAttender = $scope.loggedInUser

    addPersonToEvent(newAttender, event._id)

    console.log("adding event " + newAttender._id, "     ", event._id)
  }
}])


myApp.controller('FinishedEventsController', ['$scope', '$http', '$location' ,'EventsService', 'UsersService', '$route', function ($scope, $http, $location , EventsService, UsersService, $route) {

  var loggedInUser = UsersService.getLoggedInUser();
  $scope.$route = $route;
  var finEvents = []

  EventsService.getAllEvents()
  .success(function(events) {
    events.forEach(function(event){
      if(moment(event.endTime) < moment()){
        if(event.publicEvent){
          finEvents.push(event)
        }else{
          event.attenders.forEach(function(curEvent){
            console.log(curEvent)
            curEvent.attenders.forEach(function(person){
              if(person.id == loggedInUser.id){
                finEvents.push(event)
              }})
          })
          if(event.adminId == loggedInUser.id){
            finEvents.push(event)
          }
        }
      }
    })
    $scope.events = finEvents;
  });

  $scope.numLimit = 5;


  // $scope.joinEvent = function(event){
  //   var newAttender = $scope.loggedInUser

  //   addPersonToEvent(newAttender, event._id)

  //   console.log("adding event " + newAttender._id, "     ", event._id)
  // }
}])


myApp.controller('EventsCreateController', ['$scope', '$http', '$location' ,'EventsService', 'UsersService', '$route', function ($scope, $http, $location , EventsService, UsersService, $route) {

  var loggedInUser = UsersService.getLoggedInUser();

  $scope.$route = $route;
  $scope.newEvent = {
    iconPicked: 'photo-camera.png',
  };


  $scope.endDateBeforeRender = endDateBeforeRender
  $scope.endDateOnSetTime = endDateOnSetTime
  $scope.startDateBeforeRender = startDateBeforeRender
  $scope.startDateOnSetTime = startDateOnSetTime

  function startDateOnSetTime () {
    $scope.$broadcast('start-date-changed');
  }

  function endDateOnSetTime () {
    $scope.$broadcast('end-date-changed');
  }

  function startDateBeforeRender ($dates) {
    if ($scope.dateRangeEnd) {
      var activeDate = moment($scope.dateRangeEnd);

      $dates.filter(function (date) {
        return date.localDateValue() >= activeDate.valueOf()
      }).forEach(function (date) {
        date.selectable = false;
      })
    }
  }

  function endDateBeforeRender ($view, $dates) {
    if ($scope.dateRangeStart) {
      var activeDate = moment($scope.dateRangeStart).subtract(1, $view).add(1, 'minute');

      $dates.filter(function (date) {
        return date.localDateValue() <= activeDate.valueOf()
      }).forEach(function (date) {
        date.selectable = false;
      })
    }
  }



  $scope.quantity = 5;

  $scope.addEvent = function(){
    $scope.newEvent.admin = $scope.loggedInUser.name
    $scope.newEvent.adminId = $scope.loggedInUser._id
    $scope.newEvent.released = false;
    $scope.newEvent.publicEvent = true;
    addNewEvent($scope.newEvent);
  }

}])



myApp.controller('MyEventsController', ['$scope', '$http', '$location' ,'EventsService', 'UsersService', function ($scope, $http, $location , EventsService, UsersService) {

  var loggedInUser = UsersService.getLoggedInUser();

  EventsService.getMyEvents($scope.loggedInUser)
  .success(function(myEvents) {
   $scope.myEvents = myEvents;
 });

  $scope.quantity = 5;

}])

myApp.controller('EventDetailsController', ['$scope', '$http', '$routeParams' ,'EventsService', 'UsersService' , '$location', function ($scope, $http, $routeParams , EventsService, UsersService,  $location) {

  var loggedInUser = UsersService.getLoggedInUser();

  $http.get('/api/events/eventDetails/' + $routeParams.id)
  .success(function(res) {
    res.event.member = false;
    if(res.event.adminId != loggedInUser.id){
      if(!res.event.released){
        res.event.pictures = null
      }
    }
    if(moment(res.event.endTime) < moment()){
      es.event.member = true;
    }
    else{
      res.event.attenders.forEach(function(person){
        if(person.id == loggedInUser.id){
          res.event.member = true;
        }
      })
      if(res.event.adminId == loggedInUser.id){
        res.event.member = true;
      }
    }


    $scope.event = res.event
  })

  $scope.releaseImages = function(event){
    if($scope.loggedInUser._id == event.adminId){
      //do soemthing
      releaseImgs(event)
    }
  }

  $scope.joinEvent = function(event){
    //var newAttender = $scope.loggedInUser
    addPersonToEvent($scope.loggedInUser, event._id)
  }

  $scope.changePubilic = function(event){
    //var newAttender = $scope.loggedInUser
    changePublicType(event)
  }

  $scope.removeUser = function(user){
    //var newAttender = $scope.loggedInUser
    console.log($routeParams.id)
    user.eventId = $routeParams.id
    rmUser(user)
  }

}])


myApp.factory('EventsService', ['$http' , 'UsersService', '$location', function($http, UsersService, $location){

 addNewEvent = function(newEvent) {
  console.log('in new event')
  $http.post('/api/events/', newEvent).success(function(res)
  {
   $location.path('/eventDetails/'+res._id)
 })
  .error(function(err){
   console.log('error : ' + err)
 })
}
releaseImgs = function(event) {
  console.log('in new event')
  $http.post('/api/events/releaseImgs', event).success(function(res)
  {
    console.log(res)
  })
  .error(function(err){
   console.log('error : ' + err)
 })
}

changePublicType = function(event) {
  if(event.publicEvent){
    event.publicEvent = false
  }else{
   event.publicEvent = true
 }
 $http.post('/api/events/changePublicType', event).success(function(res)
 {
 })
 .error(function(err){
   console.log('error : ' + err)
 })
}

rmUser = function(user) {
  console.log('in remove user')
  $http.post('/api/events/removeUser', user, {headers: {
    Authorization: 'Bearer '+ UsersService.getTokenApi()
  }}).success(function(res)
  {
    console.log(res)
  })
  .error(function(err){
   console.log('error : ' + err)
 })
}



addPersonToEvent = function(newAttender, eventId){
  var check = false

  $http.get('/api/events/eventDetails/' + eventId)
  .success(function(res) {
    if(res.event.adminId == newAttender._id){
      console.log("admin")
      check = true
    }
    if(res.event.attenders.length >0){
      res.event.attenders.forEach(function(p){
        if(p.id == newAttender._id){
          check = true
          console.log("users")
        }
      })
    }
    console.log("check is ", check)
    if(!check){
      console.log("check")
      $http.post('/api/events/joinEvent/'+eventId, newAttender).success(function(res)
      {
       console.log ('added to event app.js' )
     })
      .error(function(err){
       console.log('error : ' + err)
     })}
    })
}



var api = {
 getAllEvents : function() {
   return $http.get('/api/events/' , {headers: {
    Authorization: 'Bearer '+ UsersService.getTokenApi()
  }})
 }
,

getMyEvents : function(loggedInUser) {
  return $http.get('/api/events/myEvents/'+loggedInUser._id, {headers: {
    Authorization: 'Bearer '+ UsersService.getTokenApi()
  }})

}
}
return api
}])



// All pictures controllers and services


myApp.controller('PicturesController',   ['$scope', '$http' ,'PicturesService', 'UsersService','$location',function($scope, $http , PicturesService, UsersService, $location) {

 var loggedInUser = UsersService.getLoggedInUser();

 PicturesService.getPictures(loggedInUser)
 .success(function(pictures) {
   $scope.pictures = pictures;
 });
 $scope.orderProp = 'name';
 $scope.quantity = 5;
}])



myApp.factory('PicturesService', ['$http', 'UsersService', function($http, UsersService){

 var api = {
   getPictures : function(loggedInUser) {

     return $http.get('/api/pictures', {headers: {
      Authorization: 'Bearer '+ UsersService.getTokenApi()
    }})
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



// Face dection



myApp.controller('faceDetController', 
  ['$scope', '$routeParams', '$http', 'UsersService', 'PicturesService', function($scope, $routeParams, $http , UsersService ,PicturesService) {


   // window.onload = function() {
   //    console.log("laoded")
   //    var img = document.getElementById('img');
   //    var tracker = new tracking.ObjectTracker(['face', 'eye', 'mouth']);
   //    console.log("tracker", tracker)
   //    tracker.setStepSize(1.7);
   //    tracking.track('#img', tracker);
   //    tracker.on('track', function(event) {
   //      event.data.forEach(function(rect) {
   //        window.plot(rect.x, rect.y, rect.width, rect.height);
   //      });
   //    });
   //    window.plot = function(x, y, w, h) {
   //      var rect = document.createElement('div');
   //      document.querySelector('.demo-container').appendChild(rect);
   //      rect.classList.add('rect');
   //      rect.style.width = w + 'px';
   //      rect.style.height = h + 'px';
   //      rect.style.left = (img.offsetLeft + x) + 'px';
   //      rect.style.top = (img.offsetTop + y) + 'px';
   //    };
   //  };

 }])