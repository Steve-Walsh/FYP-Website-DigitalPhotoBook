var myApp = angular.module('myApp', ['ngRoute', 'ui.bootstrap.datetimepicker']);

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
        .when('/pictures', {
            templateUrl: 'partials/pictures.html',
            controller: 'PicturesController'
        })
        .when('/picture/:id', {
            templateUrl: 'partials/picture-details.html',
            controller: 'PicutresDetailCtrl'
        })
        .when('/login', {
            templateUrl: 'partials/login.html',
            controller: 'UsersController'
        })
        .when('/signup', {
            templateUrl: 'partials/signup.html',
            controller: 'UsersController'
        })
        .when('/users', {
            templateUrl: 'partials/users.html',
            controller: 'UsersController'
        })

        .when('/face/:id', {
            templateUrl: 'partials/faceDet.html',
            controller: 'FaceDetController',
            resolve: {
                pictureDetails: function($http, $route) {
                    return $http.get('/api/pictures/tags/' + $route.current.params.id)
                    .then(function(response) {
                        return response.data;
                    })
                }
            }
        })
        .when('/face2', {
            templateUrl: 'partials/faceDet2.html',
            controller: 'faceDetController'
        })
        .otherwise({
            redirectTo: '/'
        })
    }
    ]).

run(function($rootScope, $location, UsersService, $route) {
    $rootScope.$on("$locationChangeStart", function(event, next, current) {

        UsersService.isLoggedInApi();

        if (!$rootScope.loggedInUser) {
            if ($location.path() != '/signup') {
                if ($location.path() != '/login') {
                    $location.path('/login');
                }
            }
        }
    });
})

myApp.controller('MainController', ['$scope', 'EventsService', 'UsersService', 'PicturesService', '$location', '$window', function($scope, EventsService, UsersService, PicturesService, $location, $window) {


    $scope.loggedInUser = UsersService.getLoggedInUser();
    $scope.logout = function() {
        UsersService.logoutUser()
        $window.location.reload();
    }

}])


myApp.controller('UsersController', ['$scope', '$http', '$location', 'UsersService', '$window',
    function($scope, $http, $location, UsersService, $window) {

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

        $scope.register = function(newAccount) {
            register($scope.newAccount);
            $scope.newAccount = '';
        }
        var loggedInUser = null;

        $scope.login = function(userDetails) {
            login($scope.userDetails)
            loggedInUser = UsersService.getLoggedInUser()
            $location.path('/')
            setTimeout(function() {
                window.location.href = '/'
            }, 250);
        }

        $scope.remove = function(id) {
            $http.delete('/api/users/' + id);
            $location.path('/users')

        };

        $scope.editUser = function(user) {
            $http.put('/api/user/' + user._id, user)
        }


    }
    ])


myApp.factory('UsersService', ['$http', '$window', '$rootScope', '$location', function($http, $window, $rootScope, $location) {

    var saveToken = function(token) {
        $window.localStorage['mean-token'] = token;
    };


    var getToken = function() {
        return $window.localStorage['mean-token'];
    };

    logout = function() {
        $window.localStorage.removeItem('mean-token');
    };

    isLoggedIn = function() {
        var token = getToken();
        var payload;
        if(token === "undefined"){
            console.log("bad token")
            return false
        }
        else if (token != null && token != "") {
            payload = token.split('.')[1];
            payload = $window.atob(payload);
            payload = JSON.parse(payload);

            return payload;
        } else {
            return false;
        }
    };

    var currentUser = function() {
        if (isLoggedIn()) {
            var token = getToken();
            var payload = token.split('.')[1];
            payload = $window.atob(payload);
            payload = JSON.parse(payload);
            return {
                email: payload.email,
                name: payload.name,
                id: payload._id
            };
        } else {
            return null;
        }
    };




    register = function(newAccount) {
        $http.post('api/users/registerNewUser', newAccount).then(function(res) {
            $location.path('/login')
        })
            // console.log(newAccount)
        }

        remove = function(id) {
            $http.delete('api/users/' + id);
        }


        login = function(userDetails) {

            $http.post('/api/users/login', userDetails).then(function(res) {
                console.log(res.data.token)
                if (typeof res.data.token != undefined) {

                    saveToken(res.data.token)

                } else {
                    logout();
                }

            })


        }

        loggedIn = function() {
            return loggedInUser;
        }


        var api = {
        //  getUsers : function() {
        //   return $http.get('/api/users')
        // },
        loggedIn: function() {
            return loggedInUser;
        },
        getTokenApi: function() {
            return getToken();
        },
        isLoggedInApi: function() {
            $rootScope.loggedInUser = isLoggedIn();
        },

        getLoggedInUser: function() {
            return currentUser();
        },
        logoutUser: function() {
            return logout()
        }
    }

    return api
}])


// All event contollers and services

myApp.controller('EventsController', ['$scope', '$http', '$location', 'EventsService', 'UsersService', '$route', function($scope, $http, $location, EventsService, UsersService, $route) {

    var loggedInUser = UsersService.getLoggedInUser();

    $scope.$route = $route;
    var allEvents = []

    EventsService.getAllEvents()
    .success(function(events) {
        events.forEach(function(event) {
            if (event.publicEvent) {
                allEvents.push(event)
            } else {
                event.attenders.forEach(function(curEvent) {
                    curEvent.attenders.forEach(function(person) {
                        if (person.id == loggedInUser.id) {
                            allEvents.push(event)
                        }
                    })
                })
                if (event.adminId == loggedInUser.id) {
                    allEvents.push(event)
                }
            }
        })

        $scope.events = allEvents;
    });

    $scope.numLimit = 5;


    $scope.joinEvent = function(event) {
        var newAttender = $scope.loggedInUser

        addPersonToEvent(newAttender, event._id)

    }
}])


myApp.controller('FinishedEventsController', ['$scope', '$http', '$location', 'EventsService', 'UsersService', '$route', function($scope, $http, $location, EventsService, UsersService, $route) {

    var loggedInUser = UsersService.getLoggedInUser();
    $scope.$route = $route;
    var finEvents = []

    EventsService.getAllEvents()
    .success(function(events) {
        events.forEach(function(event) {
            if (moment(event.endTime) < moment()) {
                if (event.publicEvent) {
                    finEvents.push(event)
                } else {
                    event.attenders.forEach(function(curEvent) {
                        curEvent.attenders.forEach(function(person) {
                            if (person.id == loggedInUser.id) {
                                finEvents.push(event)
                            }
                        })
                    })
                    if (event.adminId == loggedInUser.id) {
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


myApp.controller('EventsCreateController', ['$scope', '$http', '$location', 'EventsService', 'UsersService', '$route', function($scope, $http, $location, EventsService, UsersService, $route) {

    var loggedInUser = UsersService.getLoggedInUser();

    $scope.$route = $route;
    $scope.newEvent = {
        iconPicked: 'photo-camera.png',
    };


    $scope.endDateBeforeRender = endDateBeforeRender
    $scope.endDateOnSetTime = endDateOnSetTime
    $scope.startDateBeforeRender = startDateBeforeRender
    $scope.startDateOnSetTime = startDateOnSetTime

    function startDateOnSetTime() {
        $scope.$broadcast('start-date-changed');
    }

    function endDateOnSetTime() {
        $scope.$broadcast('end-date-changed');
    }

    function startDateBeforeRender($dates) {
        if ($scope.dateRangeEnd) {
            var activeDate = moment($scope.dateRangeEnd);

            $dates.filter(function(date) {
                return date.localDateValue() >= activeDate.valueOf()
            }).forEach(function(date) {
                date.selectable = false;
            })
        }
    }

    function endDateBeforeRender($view, $dates) {
        if ($scope.dateRangeStart) {
            var activeDate = moment($scope.dateRangeStart).subtract(1, $view).add(1, 'minute');

            $dates.filter(function(date) {
                return date.localDateValue() <= activeDate.valueOf()
            }).forEach(function(date) {
                date.selectable = false;
            })
        }
    }



    $scope.quantity = 5;

    $scope.addEvent = function() {
        $scope.newEvent.admin = $scope.loggedInUser.name
        $scope.newEvent.adminId = $scope.loggedInUser._id
        $scope.newEvent.released = false;
        $scope.newEvent.publicEvent = true;
        addNewEvent($scope.newEvent);
    }

}])



myApp.controller('MyEventsController', ['$scope', '$http', '$location', 'EventsService', 'UsersService', function($scope, $http, $location, EventsService, UsersService) {

    var loggedInUser = UsersService.getLoggedInUser();

    EventsService.getMyEvents($scope.loggedInUser)
    .success(function(myEvents) {
        $scope.myEvents = myEvents;
    });

    $scope.quantity = 5;

}])

myApp.controller('EventDetailsController', ['$scope', '$http', '$routeParams', 'EventsService', 'UsersService', '$location', function($scope, $http, $routeParams, EventsService, UsersService, $location) {

    var loggedInUser = UsersService.getLoggedInUser();

    $http.get('/api/events/eventDetails/' + $routeParams.id)
    .success(function(res) {
        console.log(res.event)
        res.event.member = false;
        if (res.event.adminId != loggedInUser.id) {
            if (!res.event.released) {
                res.event.pictures = null
            }
        }
        if (moment(res.event.endTime) < moment()) {
            res.event.member = true;
        } else {
            res.event.attenders.forEach(function(person) {
                if (person.id == loggedInUser.id) {
                    res.event.member = true;
                }
            })
            if (res.event.adminId == loggedInUser.id) {
                res.event.member = true;
            }
        }


        $scope.event = res.event
    })

    $scope.releaseImages = function(event) {
        if ($scope.loggedInUser._id == event.adminId) {
            //do soemthing
            releaseImgs(event)
        }
    }

    $scope.joinEvent = function(event) {
        //var newAttender = $scope.loggedInUser
        addPersonToEvent($scope.loggedInUser, event._id)
    }

    $scope.changePubilic = function(event) {
        //var newAttender = $scope.loggedInUser
        changePublicType(event)
    }

    $scope.removeUser = function(user) {
        //var newAttender = $scope.loggedInUser
        user.eventId = $routeParams.id
        rmUser(user)
    }

    $scope.removePic = function(picture) {
        //var newAttender = $scope.loggedInUser
        picture.eventId = $routeParams.id
        rmPic(picture)
    }

}])


myApp.factory('EventsService', ['$http', 'UsersService', '$location', function($http, UsersService, $location) {

    addNewEvent = function(newEvent) {
        $http.post('/api/events/', newEvent).success(function(res) {
            $location.path('/eventDetails/' + res._id)
        })
        .error(function(err) {
            console.log('error : ' + err)
        })
    }
    releaseImgs = function(event) {
        console.log('in new event')
        $http.post('/api/events/releaseImgs', event).error(function(err) {
            console.log('error : ' + err)
        })
    }

    changePublicType = function(event) {
        if (event.publicEvent) {
            event.publicEvent = false
        } else {
            event.publicEvent = true
        }

        $http.post('/api/events/changePublicType', event).error(function(err) {
            console.log('error : ' + err)
        })
    }

    rmUser = function(user) {
        $http.post('/api/events/removeUser', user, {
            headers: {
                Authorization: 'Bearer ' + UsersService.getTokenApi()
            }
        })
        .error(function(err) {
            console.log('error : ' + err)
        })
    }

    rmPic = function(picture) {
        $http.post('/api/events/removePicture', picture, {
            headers: {
                Authorization: 'Bearer ' + UsersService.getTokenApi()
            }
        })
        .error(function(err) {
            console.log('error : ' + err)
        })
    }


    addPersonToEvent = function(newAttender, eventId) {
        var check = false

        $http.get('/api/events/eventDetails/' + eventId)
        .success(function(res) {
            if (res.event.adminId == newAttender._id) {
                check = true
            }
            if (res.event.attenders.length > 0) {
                res.event.attenders.forEach(function(p) {
                    if (p.id == newAttender._id) {
                        check = true
                    }
                })
            }
            if (!check) {
                $http.post('/api/events/joinEvent/' + eventId, newAttender).error(function(err) {
                    console.log('error : ' + err)
                })
            }
        })
    }



    var api = {
        getAllEvents: function() {
            return $http.get('/api/events/', {
                headers: {
                    Authorization: 'Bearer ' + UsersService.getTokenApi()
                }
            })
        },

        getMyEvents: function(loggedInUser) {
            return $http.get('/api/events/myEvents/' + loggedInUser._id, {
                headers: {
                    Authorization: 'Bearer ' + UsersService.getTokenApi()
                }
            })

        }
        // ,
        // getPicEvent: function(eventId) {
        //     return $http.get('/api/events/getPicEvent/' + eventId, {
        //         headers: {
        //             Authorization: 'Bearer ' + UsersService.getTokenApi()
        //         }
        //     })
        // }
        
    }
    return api
}])



// All pictures controllers and services


myApp.controller('PicturesController', ['$scope', '$http', 'PicturesService', 'UsersService', '$location', function($scope, $http, PicturesService, UsersService, $location) {

    var loggedInUser = UsersService.getLoggedInUser();

    PicturesService.getPictures(loggedInUser)
    .success(function(pictures) {
        $scope.pictures = pictures;
    });
    $scope.orderProp = 'name';
    $scope.quantity = 5;
}])




myApp.controller('PicutresDetailCtrl', ['$scope', '$routeParams', '$http', 'UsersService', 'PicturesService',
    function($scope, $routeParams, $http, UsersService, PicturesService) {

        $scope.loggedInUser = UsersService.loggedIn();

        $http.get('/api/pictures/picture/' + $routeParams.id)
        .success(function(picture) {
            $scope.picture = picture[0]
        });

        // $scope.addComment = function(){
        //   if($scope.loggedInUser != null){
        //     $scope.newComment.author = $scope.loggedInUser.name
        //   }

        //   addPictureComment($scope.picture._id, $scope.newComment)
        //   $scope.newComment=''
        //   $http.get('/api/pictures/picture/' + $routeParams.id)
        //   .success(function(picture) {
        //    $scope.picture = picture[0]
        //  });
        // }
    }
    ])



// Face dection

myApp.controller('FaceDetController', ['$scope', '$routeParams', '$http', 'UsersService', 'PicturesService', 'pictureDetails', function($scope, $routeParams, $http, UsersService, PicturesService, pictureDetails) {


    $scope.picture = pictureDetails

    $scope.nameList = pictureDetails.tagged

    $scope.data_names = []

    $scope.saveFaces = function() {
        var names = []

        for (var i = 1; i <= pictureDetails.tagged.length; i++) {
            if ($scope.data_names[i] != null) {
                names.push($scope.data_names[i])
            } else if (pictureDetails.tagged[i - 1].length > 2) {
                names.push(pictureDetails.tagged[i - 1])

            } else if (typeof $scope.data_names[i] == 'undefined') {
                names.push(i)
            } else {
                names.push(i)
            }
        }
        var tag = {
            picId: $routeParams.id,
            names: names
        }
        tagfaces(tag)

    }


}])




myApp.factory('PicturesService', ['$http', 'UsersService', "$q", function($http, UsersService, $q) {

    tagfaces = function(names) {
        console.log(names)
        $http.post('/api/pictures/tagfaces', names, {
            headers: {
                Authorization: 'Bearer ' + UsersService.getTokenApi()
            }
        })
    }

    var api = {
        getPictures: function(loggedInUser) {

            return $http.get('/api/pictures', {
                headers: {
                    Authorization: 'Bearer ' + UsersService.getTokenApi()
                }
            })
        }
    }
    return api
}])
