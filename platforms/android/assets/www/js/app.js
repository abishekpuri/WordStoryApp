// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('starter', ['ionic'])
var current_player_id = null;
var current_player_nick = null;
var current_game_id = null;
var current_list_of_players;
var is_host = false;

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

    if (window.StatusBar) {
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
  .state('game', {
    url: 'game',
    templateUrl: 'game.html',
    controller: 'game_controller'
  })

  $urlRouterProvider.otherwise("/start");
});

app.controller('game_list_controller', function($scope, $http, $state) {
  $scope.games = [];
  $scope.join_game = function(game_id) {
    is_host = false;
    $http.post('https://hackust2016.herokuapp.com/join_game',
    {
      player_id: current_player_id,
      game_id: game_id
    }).then(function(result) {
      console.log("result: " + JSON.stringify(result.data));
      var abc = [];
      for (var i = 0; i < result.data.length; ++i) {
        abc.push(result.data[i].nickname);
      }
      current_game_id = game_id;
      current_list_of_players = abc;
      console.log("ABC: " + JSON.stringify(abc));
      $state.go('lobby');
    }, function(error) {
      console.log("", error);
    });
  }
  var poll = function() {
    $http.post('https://hackust2016.herokuapp.com/get_all_games')
    .then(function(result) {
      console.log(JSON.stringify(result));
      $scope.games = result.data;
      setTimeout(function() {
        poll();
      }, 5000);
    });
  }
  $scope.$on('$ionicView.enter', function() {
    poll();
  });
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

app.controller('create_game_controller', function($scope, $http, $state) {
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
      is_host = true;
      current_list_of_players = [current_player_nick];
      $state.go('lobby');
    }, function(error) {
      console.log("", error);
    })
  }
});

app.controller('lobby_controller', function($scope, $http, $timeout, $state) {
  $scope.players = current_list_of_players;
  $scope.is_not_host = !is_host;
  var longPoll = function() {
    $http.post('https://hackust2016.herokuapp.com/request_next_player',
    { 'player_id': current_player_id },
    { timeout: 1000000 }).then(function(result) {
      console.log('result');
      $scope.players = result.data;
      longPoll();
    });
  }
  var shortPoll = function () {
    $http.post('https://hackust2016.herokuapp.com/get_game_status',
    { game_id: current_game_id }).then(function(result) {
      console.log("current status result: " + JSON.stringify(result.data));
      if (result.data.current_status === "started") {
        $state.go('game');
      } else {
        setTimeout(function() {
          shortPoll();
        }, 1000);
      }
    }, function(error) {
      setTimeout(function() {
        shortPoll();
      }, 1000);
    });
  }

  $scope.start_game = function() {
    $http.post('https://hackust2016.herokuapp.com/start_game',
    { game_id: current_game_id }).then(function(result) {
      console.log("start game result: " + JSON.stringify(result.data));
    })
  }
  $scope.$on('$ionicView.enter', function() {
    longPoll();
    shortPoll();
  });
});

app.controller('game_controller', function($scope) {
});
