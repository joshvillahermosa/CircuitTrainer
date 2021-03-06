// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var circuit = angular.module('circuit', ['ionic', 'circuit.controllers', 'circuit.services', 'circuit.directives', 'ngCordova']);
circuit.run(['$ionicPlatform', function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }
  });
}]);
circuit.config(['$stateProvider', '$urlRouterProvider', '$logProvider', function($stateProvider, $urlRouterProvider, $logProvider) {

  //Comment out to disable logs
  $logProvider.debugEnabled(true);

  // Ionic uses AngularUI Router which uses the concept of statess
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/tabs.html"
  })

  // Each tab has its own nav history stack:

  .state('app.dash', {
    url: '/dash',
    resolve: {
      exerc: ["ExerciseGen", function(ExerciseGen){
        return ExerciseGen.getExerc('10AbbWorkout');
      }]
    },
    views: {
      'app-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl',
      },
    }
  })

  .state('app.info', {
    url: '/exercinfo',
    resolve: {
      exerc: ["ExerciseGen", function(ExerciseGen){
        return ExerciseGen.getExerc('10AbbWorkout');
      }]
    },
    views: {
      'app-info': {
        templateUrl: 'templates/exercinfo.html',
        controller: 'ExercCtrl',
      }
    }
  })

  .state('app.circuit', {
    url: '/circuit',
    resolve: {
      exerc: ["ExerciseGen", function(ExerciseGen){
        return ExerciseGen.getExerc('10AbbWorkout');
      }]
    },
    views: {
      'app-circuit': {
        templateUrl: 'templates/circuit.html',
        controller: 'CircuitCtrl',
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/dash');
}]);
