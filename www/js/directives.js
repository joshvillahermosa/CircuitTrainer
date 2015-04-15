angular.module('circuit.directives', [])

.directive('circuit', ['$interval', '$log', function($interval, $log){
  return {
    restrict: 'E',
    scope: {
      exercise: '='
    },
    replace: 'true',
    templateUrl: '/templates/circuit.directive.html',
    link: function(scope) {
      var totalTime = 0; 
      var exc = scope.exercise;

      for(var time = 0; time < exc.exercise.length; time++){
        totalTime += exc.exercise[time].exercTime;
      }

      scope.totalTime = totalTime;

      for (var i = 0; i <= 3; i++) {
        var counter = $interval(function(){
          scope.totalTime = totalTime;
          console.log(totalTime);
          totalTime -= 1000;

          //Stopes
          if (totalTime < 0) {
            $interval.cancel(counter);
          } 

        }, 1000);

        console.log('Round complete');
      }
    }
  };
}]);