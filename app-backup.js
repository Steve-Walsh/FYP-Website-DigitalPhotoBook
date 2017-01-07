var myApp = angular.module('myApp',['ngRoute']);


myApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider
    .when('/', {
      templateUrl: 'partials/main.html'}
      )
    .when('/posts', {
      templateUrl: 'partials/posts.html',
      controller: 'PostsController'
    })
    .when('/posts/:post_id',
    {
      controller: 'PostsCommentsController',
      templateUrl: './partials/postComments.html'
    })
    .when('/posts2', {
      templateUrl: 'partials/posts2.html',
      controller: 'PostSecController'        
    })
    .when('/pictures',{
      templateUrl : 'partials/pictures.html',
      controller : 'PicturesController' 
    })

    .when('/picture/:pic_id', {
        templateUrl: 'partials/picture-details.html',
        controller: 'PicutresDetailCtrl'
      })
    .when('/login',{
      templateUrl : 'partials/login.html',
      controller :'AccountsController'
    })
    .when('/signup',{
      templateUrl : 'partials/signup.html',
      controller :'AccountsController'
    })
    .when('/users',{
      templateUrl : 'partials/users.html',
      controller : 'UsersController'
    })
    .otherwise({
      redirectTo: '/'
    })
  }])

myApp.controller('UsersController', ['$scope', 'UsersService' , function($scope, UsersService){
   $scope.users = UsersService.getUsers()
   $scope.loggedInUser = UsersService.getUser()
   $scope.orderProp = '+fName';
}])

myApp.controller('AccountsController', ['$scope', 'UsersService', '$location', '$http', function($scope, UsersService, $http, $location){
  $scope.users = UsersService.getUsers()

  $scope.register = function(newAccount){
    register($scope.newAccount)
    $scope.newAccount = '';
  }
  $scope.login = function(userDetails){
    console.log("login function called")
    login($scope.userDetails);
    $scope.userDetails = '';
  }
  $scope.user = UsersService.getUser


  
 
}])

myApp.factory('UsersService', [function(){
  var loggedInUser = null;
  
  var users = [
  {
    "index": 0,
    "fName": "Steve",
    "sName": "Walsh",
    'username' : 'Steve',
    "email": "test@test.com",
    "password": "password",
    "age": 28
  },
  {
    "index": 1,
    "fName": "Minerva",
    "sName": "Gutierrez",
    'username' : 'Minerva',
    "email": "paynemichael@inquala.com",
    "password": "password",
    "age": 40
  },
  {
    "index": 2,
    "fName": "Dorthy",
    "sName": "Colon",
    'username' : 'Dorthy',
    "email": "woodwardpowell@magnina.com",
    "password": "password",
    "age": 48
  },
  {
    "index": 3,
    "fName": "Mary",
    "sName": "Hicks",
    'username' : 'Mary',
    "email": "johannaatkinson@inventure.com",
    "password": "password",
    "age": 34
  },
  {
    "index": 4,
    "fName": "Jana",
    "sName": "Schmidt",
    '"username"' : 'Jana',
    "email": "bradydominguez@aquasseur.com",
    "password": "password",
    "age": 41
  }]

  register = function(newAccount){
    console.log("started")
    var duplicateUser = false;
    users.forEach(function(user){
      if(user.username == newAccount.username){
        duplicateUser = true;
        console.log("Account already exists." + user.username);
      }
    })
    if(duplicateUser == false){
      var newID = 1 + users[users.length - 1].id;
      users.push({
        "id":newID,
        "fname":newAccount.fName,
        "sName":newAccount.sName,
        "username" : newAccount.username,
        "email": newAccount.email,
        "password":newAccount.password
      })
        console.log("pushed user");
      }
    },

  login = function(userDetails){
    console.log("login in factory")
    users.forEach(function(user){
      console.log("user name is " + user.username)
      if(user.username == userDetails.username){
        console.log("username is right " + user.username + "  -  " + userDetails.username)
        if(user.password == userDetails.password){
          loggedInUser = user;
          console.log("user has logged in " + user.username)
         
        }
      }
    })
  }
    var api = {
      getUsers : function() {
        return users
      },
      getUser : function(){
      
        return loggedInUser;
      }
    }
    return api
  }])



myApp.controller('PostsController', ['$scope', '$http','PostService', function ($scope, $http, PostService) {
  $scope.posts = PostService.getPosts();

  $scope.addPost = function(newPost){
    addNewPost($scope.newPost);
    $scope.newPost = '';
  }
    $scope.orderProp = '+upvotes';
    $scope.quantity = 5;

  
  $scope.incrementUpvotes = function(post) {
    post.upvotes += 1;
  }
  $scope.decrementUpvotes = function(post) {
    post.upvotes -= 1;
  }
}]) 





myApp.controller('PostSecController', ['$scope', '$http', 'PostSecService', function ($scope, $http, PostSecService) {
  
     PostSecService.getPosts().success(function(data) {
       $scope.posts = data
     })

  $scope.addPost = function(newPost){
    addNewPost($scope.newPost);
    $scope.newPost = '';
  }
    $scope.orderProp = '+upvotes';
    $scope.quantity = 5;

  
  $scope.incrementUpvotes = function(post) {
    post.upvotes += 1;
  }
  $scope.decrementUpvotes = function(post) {
    post.upvotes -= 1;
  }

  $scope.addPost = function() {
    var new_id = 1 + $scope.posts[$scope.posts.length - 1].id
    $scope.posts.push({
      title: $scope.newPost.title,
      id: new_id,
      link: $scope.newPost.link,
      username : $scope.newPost.username,
      content : $scope.newPost.content,
      comments : [],
      upvotes: 0
    })
    $scope.newPost = {} 
  }
}])



myApp.factory('PostSecService', ['$http',function($http){

  var api = {
    getPosts : function()
    {
      return $http.get('data/data.json')
    }
  }
  return api
}])





myApp.controller('PicturesController', 
    ['$scope', 'PictureService',
    function($scope, PictureService) {

     PictureService.getPictures().success(function(data) {
       $scope.pictures = data
     })
     $scope.orderProp = 'name';
     $scope.quantity = 5;


  $scope.incrementUpvotes = function(picture) {
    picture.upvotes += 1;
  }
  $scope.decrementUpvotes = function(picture) {
    picture.upvotes -= 1;
  }

  $scope.addPicture = function() {
    var new_id = 1 + $scope.pictures[$scope.pictures.length - 1].id
    $scope.pictures.push({
      title: $scope.newPicture.title,
      id: new_id,
      link: $scope.newPicture.link,
      username : $scope.newPicture.username,
      content : $scope.newPicture.content,
      comments : [],
      upvotes: 1
    })
    $scope.newPicture = {} 
  }
}])



myApp.controller('PicutresDetailCtrl', 
   ['$scope', '$routeParams', 'PicutresDetailServ', 
   function($scope, $routeParams, PicutresDetailServ) {

     $scope.picture = PicutresDetailServ.getPicture($routeParams.pic_id)
  }])


myApp.factory('PictureService', ['$http', function($http){

    var api = {
      getPictures : function() {
        return $http.get('data/picture.json')            
      }
    }
    return api
}])



myApp.controller('PostsCommentsController', ['$scope', '$routeParams', 'PostService', function($scope, $routeParams, PostService){
  $scope.post = PostService.getPost($routeParams.post_id)

 $scope.incrementUpvotes = function(post) {
    post.upvotes += 1;
  }
 $scope.addComment = function(){
  $scope.post.comments.push({
    body: $scope.comment.body,
    author: $scope.comment.author ,
    upvotes: 0
  })
  $scope.comment = {} ;
  }
    
  }])


myApp.factory('PostService', ['$http',function($http){

var posts = [
  {
    "id": 0,
    "title": "Lorem occaecat deserunt mollit ex veniam id incididunt laborum ullamco.",
    "username": "Cameron Hensley",
    "upvotes": 80,
    "content": "Irure laboris anim qui ad et consequat. Ea occaecat exercitation eu pariatur commodo reprehenderit elit. Minim et cillum dolore exercitation ut commodo labore et esse aliqua labore eiusmod eu.\r\nElit est ullamco nisi incididunt proident. Ullamco amet eiusmod ipsum elit pariatur. Anim in irure consequat nisi velit labore. Aliquip officia do consequat ullamco eu et eiusmod quis esse elit excepteur adipisicing. Dolor non tempor fugiat qui non sit ad sit et. Duis consectetur proident elit in excepteur voluptate in laboris.\r\nEt tempor irure magna sit eiusmod pariatur ullamco irure cupidatat nisi dolor ipsum laboris reprehenderit. Sint minim sint in nisi aliquip in occaecat deserunt ad voluptate. Laboris reprehenderit elit sunt irure Lorem eu mollit. Nulla nisi elit velit ipsum.\r\nQuis adipisicing cupidatat quis est ex qui deserunt est do culpa nulla veniam deserunt anim. Elit cillum mollit do tempor excepteur est est excepteur exercitation. Mollit aute quis officia laborum consequat irure occaecat ut incididunt laborum occaecat cillum. Ad ut consequat Lorem do voluptate duis Lorem id proident consectetur nulla qui magna. Reprehenderit enim cupidatat commodo eu culpa reprehenderit irure quis anim fugiat. Sunt dolor sunt ex commodo officia.\r\n",
    "link": "http://www.google.com",
    "comments": [
      {
        "id": 0,
        "author": "Acosta Mason",
        "body": "Sint ex deserunt laborum nulla anim sint consectetur nulla elit do. Eiusmod pariatur eiusmod tempor sunt cupidatat proident dolore incididunt veniam culpa. Eu deserunt laborum aute consectetur sint quis qui.\r\nLaborum sint ea ea eu laboris do ex sint aute velit consequat dolor. Nostrud dolore eu cupidatat laboris tempor dolor. Voluptate consectetur qui aliquip exercitation sunt deserunt aute pariatur qui elit ut fugiat. Dolore anim adipisicing ipsum culpa occaecat esse sint reprehenderit proident laborum anim culpa nostrud. Id est enim do velit. Veniam occaecat duis eu ad ea sint commodo sit id minim do ad. Exercitation voluptate cupidatat exercitation ut consectetur dolor enim et.\r\n",
        "upvotes": 4
      },
      {
        "id": 1,
        "author": "Chandler Bishop",
        "body": "Ad commodo ipsum magna officia amet nisi laboris labore est in dolore eiusmod ipsum. Ex occaecat proident proident do enim nisi dolore velit Lorem tempor sint cillum nisi. Qui Lorem sunt duis pariatur Lorem. Eiusmod sunt occaecat sit eiusmod. Excepteur sint incididunt magna sint dolore laborum ipsum do veniam deserunt sunt magna. Et ut commodo nisi non amet ipsum magna aute ex id ut veniam anim reprehenderit. Dolore minim sit ex et elit.\r\nIncididunt tempor in dolore esse laboris irure eiusmod id voluptate id fugiat. Ad laborum reprehenderit excepteur pariatur consectetur nisi sunt excepteur proident sit in. Nostrud velit ex pariatur in mollit. Qui non ut aliquip culpa cillum ea proident consectetur ea nostrud et. Id non mollit velit dolore elit dolore minim voluptate excepteur est duis. Laboris minim est veniam aliqua officia incididunt voluptate aliquip ipsum. Voluptate consequat veniam pariatur eu ex eu.\r\n",
        "upvotes": 8
      },
      {
        "id": 2,
        "author": "Holt Donovan",
        "body": "Elit nostrud occaecat nostrud labore ea enim minim. Proident excepteur magna sint pariatur tempor pariatur. Elit tempor elit fugiat in proident excepteur deserunt do sint. Laborum velit mollit non sit anim ea ullamco tempor adipisicing reprehenderit dolor quis esse. Occaecat enim eiusmod labore veniam amet aute esse tempor est velit ad ea in proident. Eiusmod id nisi eiusmod fugiat incididunt officia laboris nisi veniam elit aliquip irure reprehenderit.\r\nNostrud laboris ipsum cillum sit dolore mollit sint. Lorem elit velit dolor ipsum reprehenderit ad ea amet id laborum occaecat nostrud ex. Qui laborum non dolore sint dolor ut labore esse minim pariatur ad aliquip.\r\n",
        "upvotes": 7
      }
    ]
  },
  {
    "id": 1,
    "title": "Commodo proident ea officia cillum culpa nisi incididunt consectetur.",
    "username": "Valeria Mcintyre",
    "upvotes": 33,
    "content": "Reprehenderit dolor sunt dolor veniam est dolor consectetur adipisicing velit. Nisi fugiat fugiat commodo magna tempor proident consequat commodo culpa dolore cillum magna. Do ut sit reprehenderit labore pariatur occaecat sint. Ea mollit laboris ea deserunt duis cupidatat. Sunt dolor veniam velit et qui anim ea.\r\nVeniam et non nulla exercitation voluptate sit adipisicing anim id. Ullamco voluptate cupidatat mollit velit pariatur reprehenderit. Quis ullamco elit non esse adipisicing. Ad id anim esse exercitation sint. Ullamco cupidatat veniam amet culpa Lorem incididunt culpa. Eiusmod excepteur velit veniam commodo id ut dolor sunt voluptate voluptate. Consequat ullamco non minim occaecat laboris adipisicing irure anim occaecat aliqua id.\r\nExcepteur ullamco aliqua quis dolore ea deserunt cillum magna tempor et culpa. Qui eiusmod incididunt deserunt sit qui fugiat reprehenderit voluptate ad fugiat nostrud aliquip proident. Fugiat nisi consectetur est reprehenderit do cupidatat ipsum et veniam occaecat incididunt.\r\nAliqua sint laborum eiusmod cillum et. Veniam deserunt dolor non magna incididunt minim ut tempor. Non duis deserunt consectetur aliquip aliqua officia tempor minim Lorem ullamco officia cupidatat quis qui. Qui sunt est ex ad minim dolor cupidatat incididunt elit elit duis. Sint veniam esse duis eiusmod ea tempor cupidatat.\r\n",
    "link": "http://www.google.com",
    "comments": [
      {
        "id": 0,
        "author": "Nielsen Kennedy",
        "body": "Aliquip eu fugiat anim sit nulla commodo fugiat duis sit duis ad minim aliqua. Fugiat proident dolor elit ad nisi proident consectetur aliqua exercitation proident eiusmod nostrud qui. Reprehenderit irure quis ipsum nostrud exercitation id pariatur sint cillum nulla nisi.\r\nConsectetur nulla proident ad ex deserunt proident nisi velit. Aliqua ex nisi ullamco ex consequat cupidatat laboris minim pariatur voluptate. Magna non nisi cupidatat voluptate dolor minim aliquip elit laboris id. Excepteur eu non id proident nostrud. Quis non sunt labore officia aliquip voluptate ex.\r\n",
        "upvotes": 17
      },
      {
        "id": 1,
        "author": "Barbra Sampson",
        "body": "Ullamco labore exercitation ut commodo. Ea mollit nulla eiusmod sunt eu ea laborum est labore velit proident sint. Est dolor velit esse ex labore. Ullamco irure irure ullamco amet aliqua non pariatur aliqua veniam deserunt et aute officia. Deserunt esse veniam amet sint tempor velit aliqua non voluptate sit adipisicing esse.\r\nIrure nostrud sunt dolor pariatur aute proident amet fugiat commodo minim minim. Ex elit amet sit tempor. Pariatur dolore nisi anim culpa. Enim magna exercitation qui qui commodo ipsum ullamco.\r\n",
        "upvotes": 9
      },
      {
        "id": 2,
        "author": "Meghan Bell",
        "body": "Commodo dolor minim ad aliquip exercitation id nisi. Commodo anim in consequat ipsum eu. Mollit minim excepteur laboris Lorem eiusmod enim.\r\nDolore velit ad aliquip non id excepteur irure incididunt. Quis enim sit culpa ut aliquip pariatur esse esse deserunt do ea incididunt enim deserunt. Quis cupidatat quis ullamco enim exercitation ipsum magna. Velit quis nostrud consectetur magna ipsum adipisicing enim sunt ex velit.\r\n",
        "upvotes": 12
      }
    ]
  },
  {
    "id": 2,
    "title": "Amet ex amet ex consequat sint.",
    "username": "Gilmore Vance",
    "upvotes": 42,
    "content": "Dolor adipisicing exercitation anim sunt elit eiusmod nostrud excepteur veniam nulla culpa. Quis Lorem voluptate do esse proident adipisicing irure aliquip adipisicing veniam sit magna exercitation ut. Et fugiat consequat exercitation aliquip duis sit ipsum id Lorem sit elit excepteur officia voluptate.\r\nProident duis quis cillum dolor ex ad consectetur exercitation veniam consectetur excepteur irure laboris. Commodo adipisicing nostrud excepteur magna laboris esse culpa consectetur commodo. Nulla consectetur dolore do enim consequat enim. Aliqua do duis veniam voluptate adipisicing ullamco duis amet do irure incididunt velit.\r\nCillum commodo duis ex commodo cupidatat et culpa. Incididunt fugiat amet mollit esse culpa dolor mollit magna dolore magna. Aliquip ea pariatur magna adipisicing nulla voluptate sint aliquip. Eu est commodo occaecat nostrud pariatur deserunt incididunt culpa aute tempor magna Lorem aute. Est consequat magna proident pariatur sunt aliquip. Minim ut proident aute sint nulla quis et deserunt exercitation irure id. Voluptate ullamco dolore commodo qui.\r\nPariatur sunt tempor duis enim tempor. Exercitation ullamco eiusmod deserunt sunt Lorem irure deserunt eu mollit officia. Dolore elit ipsum mollit mollit occaecat consectetur in reprehenderit Lorem. Duis et laboris voluptate aute quis sit Lorem veniam. Anim in pariatur pariatur excepteur anim sint elit ullamco officia fugiat est culpa. Veniam excepteur amet dolore amet duis consectetur ipsum veniam exercitation nulla consectetur. Ipsum sint nisi aute occaecat tempor velit ex nulla adipisicing deserunt cupidatat.\r\n",
    "link": "http://www.google.com",
    "comments": [
      {
        "id": 0,
        "author": "Boyd Johnston",
        "body": "Aliqua exercitation amet veniam nulla elit anim dolore. Aliquip laborum duis adipisicing anim do laborum aute eiusmod. Officia proident quis laborum veniam consectetur nostrud et non reprehenderit. Consectetur eu ad pariatur do aliquip. Est sint proident aliquip eiusmod est qui reprehenderit anim est eu aliquip mollit minim ex. Exercitation aliqua sint commodo ut do nisi dolor in non anim irure. Non ad quis pariatur proident ullamco fugiat minim sint et.\r\nElit dolor sint officia sit commodo voluptate do irure sunt. Qui veniam aliquip Lorem aliquip labore. Qui pariatur nostrud sint consectetur laborum irure anim commodo quis aliquip nisi.\r\n",
        "upvotes": 14
      },
      {
        "id": 1,
        "author": "Knight Mcneil",
        "body": "Irure amet occaecat culpa elit culpa exercitation esse eiusmod. Officia elit nulla exercitation ullamco. Minim pariatur cillum nisi sint commodo nulla esse tempor pariatur. Voluptate in aute qui do incididunt duis reprehenderit. Consequat ea aliqua commodo dolore proident labore pariatur excepteur incididunt.\r\nId laboris dolore proident ullamco nisi non cillum ad. Do mollit quis qui velit adipisicing consequat consequat. Officia ad cillum excepteur magna proident ex voluptate aliqua commodo nisi sunt exercitation tempor ut.\r\n",
        "upvotes": 7
      },
      {
        "id": 2,
        "author": "Wallace Stokes",
        "body": "Labore adipisicing dolore ipsum dolor et dolor cupidatat eu. Anim labore amet adipisicing consequat. Cupidatat et nisi duis minim ea voluptate. Duis dolor ea mollit do. Excepteur ullamco in anim duis eiusmod veniam consectetur voluptate consectetur culpa est et et excepteur. Aliquip irure voluptate dolor irure.\r\nEiusmod tempor irure cupidatat pariatur non eiusmod aute tempor non laboris. Eiusmod officia tempor do enim est pariatur labore exercitation esse exercitation deserunt adipisicing laboris. Sint do aliquip ullamco magna culpa. Nostrud tempor amet sunt ut cupidatat sit exercitation. Dolor in et eiusmod ad mollit et dolore labore id nostrud.\r\n",
        "upvotes": 3
      }
    ]
  },
  {
    "id": 3,
    "title": "Nostrud amet pariatur in reprehenderit est in consequat.",
    "username": "Harper Brock",
    "upvotes": 42,
    "content": "Officia sit magna culpa labore nulla. Mollit aliquip ad incididunt eiusmod dolor. Nulla aliqua cillum minim adipisicing deserunt enim dolore dolor consectetur voluptate. Irure officia ex quis id laboris quis ex ipsum nostrud ullamco nisi. Occaecat aliquip laboris minim deserunt exercitation non nostrud aute mollit cupidatat dolore ut. Id cillum cupidatat et excepteur et amet aute enim enim et proident dolor. Cupidatat commodo esse commodo quis dolor voluptate esse excepteur nulla mollit pariatur.\r\nCupidatat officia labore aliqua non ad. Elit incididunt consectetur ut labore. Dolore esse proident culpa culpa ad voluptate.\r\nTempor commodo in eiusmod ea consectetur proident dolore aute. Enim ut sit dolore sit magna cillum nisi. Quis non incididunt do eiusmod velit nisi nulla veniam non reprehenderit commodo incididunt dolore. Ullamco anim laboris veniam ea deserunt aliquip ut pariatur. Reprehenderit amet magna adipisicing do pariatur excepteur adipisicing.\r\nFugiat duis ullamco pariatur adipisicing dolor. Sint qui id irure laboris enim officia labore. Anim proident ipsum laboris enim nisi aute fugiat. Proident proident ex ullamco ut ullamco nostrud labore enim labore irure laborum ut sit. Id laborum in amet cupidatat eu voluptate Lorem deserunt voluptate ea aliqua et consequat amet.\r\n",
    "link": "http://www.google.com",
    "comments": [
      {
        "id": 0,
        "author": "Evans Conley",
        "body": "Ex tempor pariatur mollit elit ea non eiusmod adipisicing reprehenderit nisi eiusmod dolor. Aliquip esse non reprehenderit aute magna mollit magna minim. Est pariatur quis mollit fugiat reprehenderit est duis cupidatat nisi labore labore qui nostrud. Commodo aliqua ut exercitation anim Lorem sunt. Anim anim quis irure ad officia irure culpa nostrud enim ut. Eu do amet enim ea ut qui do dolor labore sit laboris qui veniam proident.\r\nLorem eiusmod dolor eiusmod excepteur ut ullamco ipsum veniam. Consectetur consequat labore ad voluptate et commodo tempor cupidatat proident eu. Voluptate magna fugiat mollit aliqua aliquip ad quis. Et eiusmod et deserunt quis minim laboris eiusmod veniam. Velit minim velit mollit adipisicing aliquip exercitation qui.\r\n",
        "upvotes": 12
      },
      {
        "id": 1,
        "author": "Norris Joseph",
        "body": "Laborum sit laboris anim adipisicing fugiat exercitation enim. Enim pariatur ipsum ipsum excepteur nisi velit ullamco amet mollit ut elit eu quis. Ea ullamco ut aliqua velit commodo eu eiusmod aliquip commodo irure excepteur cupidatat ipsum.\r\nMagna non aliqua sunt sit eu qui ipsum occaecat sint incididunt veniam. Est consequat consequat qui proident eiusmod laborum mollit veniam. Veniam ex et consectetur reprehenderit fugiat ipsum ipsum tempor. Culpa adipisicing labore qui duis. Et sint sit minim aliqua eiusmod nostrud veniam commodo commodo aliquip aliqua est quis esse. Ex cupidatat elit irure nostrud dolor consequat.\r\n",
        "upvotes": 17
      },
      {
        "id": 2,
        "author": "Lakeisha Strickland",
        "body": "Labore voluptate aliquip veniam qui eiusmod. Cupidatat aliquip incididunt pariatur veniam eu. Dolore qui deserunt consectetur ea est ea aliqua. Exercitation nisi incididunt ea in deserunt reprehenderit sit nulla do eu. Dolore elit nostrud fugiat id ad excepteur officia Lorem eiusmod. Labore laborum cupidatat ea ut aliqua proident.\r\nLorem sint nulla eiusmod tempor deserunt exercitation aute labore eu voluptate amet. Consectetur ex in et velit sit do consectetur quis occaecat. Mollit elit minim proident voluptate enim commodo occaecat laborum. Consectetur ut excepteur eiusmod dolore proident commodo sunt officia voluptate veniam veniam sint commodo do.\r\n",
        "upvotes": 3
      }
    ]
  }]

  addNewPost = function(newPost){
    posts.push(newPost);
   
  };
  var api = {
    getPosts : function() {
      return posts
    },
    getPost : function(id) {
      var result = null
      posts.forEach(function(post){
        if (post.id == id) {
          result  = post
        }
      })
    return result
    }
  }
  return api
}])

