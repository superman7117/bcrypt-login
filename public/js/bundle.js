'use strict';

var app = angular.module('someApp', ['ui.router']);

app.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('home', { url: '/', templateUrl: '/partials/home/home.html', controller: 'homeCtrl' })
    .state('loggedIn', { url: '/user', templateUrl: '/partials/home/loggedIn.html', controller: 'homeCtrl' })

  $urlRouterProvider.otherwise('/');
});

app.factory('httpRequestInterceptor', function(Auth) {
  return {
    request: function(config) {
      if(Auth.token) {
        config.headers = {'Authorization': 'Bearer ' + Auth.token}
      }
      return config;
    }
  };
});

app.config(function($httpProvider) {
  $httpProvider.interceptors.push('httpRequestInterceptor');
});

app.service('Auth', function(){
  this.login = function(userObj){
    $http.post('/user/login', userObj)
    .then(res)=> {
      this.token = res.token;
      $state.go('home');
    }
    this.isLoggedIn = function()
  }
})

app.controller('navCtrl', function($scope, Auth){
  $scope.isLoggedIn = Auth.isLoggedIn()
})

'use strict';

var app = angular.module('someApp');

app.controller('homeCtrl', function() {
  console.log('homeCtrl');
});
