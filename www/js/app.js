// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('starter', ['ionic'])
var current_player_id = null;
var current_player_nick = null;
var current_game_id = null;

app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {/*
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }*/

    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});

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
    templateUrl: 'create-game.html',
    controller: 'create_game_controller'
  })
  .state('lobby', {
    url: 'lobby',
    templateUrl: 'lobby.html',
    controller: 'lobby_controller'
  })
  .state('game-list', {
    url: 'game-list',
    templateUrl: 'game-list.html',
    controller: 'game_list_controller'
  })

  $urlRouterProvider.otherwise("/start");
});

app.controller('game_list_controller', function($scope, $http) {

});

app.controller('signup_controller', function($scope, $http) {
  $scope.nick = {
    name: ""
  };
  $scope.submit_nick = function() {
    $http.post('https://hackust2016.herokuapp.com/create_player',
    { "nickname": $scope.nick.name })
    .then(function(result) {
      console.log("Result: " + JSON.stringify(result.data));
      current_player_id = result.data.player_id;
      current_player_nick = $scope.nick.name;
    }, function(error) {
      console.log("error: " + JSON.stringify(error));
    });
  };
});

app.controller('create_game_controller', function($scope, $http) {
  $scope.game = {
    type: "Normal",
    topic: "",
    time_limit: "",
    word_limit: "",
    player_limit: "",
    turn_limit: "",
    passphrase: "",
  };

  $scope.submit_game_options = function() {
    console.log('', {
      mode: $scope.game.type,
      topic: $scope.game.topic,
      host: current_player_id,
      time_limit: $scope.game.time_limit,
      word_limit: $scope.game.word_limit,
      player_limit: $scope.game.player_limit,
      turn_limit: $scope.game.turn_limit,
      password: $scope.game.passphrase
    });
    $http.post('https://hackust2016.herokuapp.com/create_game',
    {
      mode: $scope.game.type,
      topic: $scope.game.topic,
      host: current_player_id,
      time_limit: $scope.game.time_limit,
      word_limit: $scope.game.word_limit,
      player_limit: $scope.game.player_limit,
      turn_limit: $scope.game.turn_limit,
      password: $scope.game.passphrase
    }).then(function(result) {
      console.log("Current game: " + result.data.game_id);
      current_game_id = result.data.game_id;
    }, function(error) {
      console.log("", error);
    })
  }
});

app.controller('lobby_controller', function($scope, $http, $timeout) {
  $scope.players = [current_player_nick];
  var longPoll = function() {
    $http.post('https://hackust2016.herokuapp.com/request_next_player',
    { 'player_id': current_player_id },
    { timeout: 1000000 }).then(function(result) {
      console.log('result');
      $scope.players = result.data;
      longPoll();
    });
  }
  $scope.$on('$ionicView.enter', function() {
    longPoll();
  });
});
