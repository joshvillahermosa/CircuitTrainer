angular.module('circuit.directives', ['ionic', 'ui.router'])

.directive('circuit', [ '$interval', '$log', '$ionicPopup', '$state', function($interval, $log, $ionicPopup, $state){
  return {
    restrict: 'E',
    scope: {
      exercise: '='
    },
    replace: 'true',
    templateUrl: '/templates/circuit.directive.html',
    link: function(scope, element) {
      scope.time = 0;
      var promise;

      var count  = function(){
        scope.time++
      }

      scope.start = function(){
        //Cancel timer running
        $interval.cancel(promise);
        scope.time = 0;
        var count  = function(){
          scope.time++
        }
        promise = $interval(count, 1000);          
      };

      scope.continue = function(){
        promise = $interval(count, 1000);
      };

      scope.stop = function(){
        $interval.cancel(promise);
      };

      scope.kill = function(){
        scope.stop();
        scope.time = 0;
        $state.go('app.dash')
      };

      scope.start();

      element.on('$destroy', function(){
        $log.log('hit');
      })
    }
  };
}]);