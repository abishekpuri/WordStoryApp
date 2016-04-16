// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('starter', ['ionic'])

app.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state('home', {
    url: '/start',
    templateUrl: 'start.html'
  })
  .state('signup', {
    url: '/signup',
    templateUrl: 'signup.html',
    controller: 'signup_controller'
  })
  .state('menu', {
    url: '/menu',
    templateUrl: 'menu.html'
  })
  .state('game-choice', {
    url: '/game-choice',
    templateUrl: 'game-choice.html'
  })
  .state('create-game', {
    url: '/create-game',
    templateUrl: 'create-game.html'
  })

  $urlRouterProvider.otherwise("/start");
});

app.controller('signup_controller', function($scope, $http) {
  $scope.nick = {
    name: ""
  };
  $scope.submit_nick = function() {
    $http.post('https://hackust2016.herokuapp.com/create_player', { "nickname": $scope.nick.name })
    .then(function(result) {
      console.log("Result: " + JSON.stringify(result.data));
    }, function(error) {
      console.log("error: " + JSON.stringify(error));
    });
  };
});

app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
