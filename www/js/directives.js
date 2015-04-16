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
      var totalExc = exc.exercise.length;
      var excCount = 0; 

      for(var time = 0; time < totalExc; time++){
        totalTime += exc.exercise[time].exercTime;
      }

      var spareTime = totalTime - exc.exercise[totalExc - 1].exercTime;

      scope.totalTime = totalTime;

      var counter = $interval(function(){

        //To show total time left of the work out
        scope.totalTime = totalTime;

        //Puts the current object in scope
        scope.exc = scope.exercise.exercise[excCount];

        //Special Loggers
        $log.log(totalTime);
        $log.log(scope.exercise.exercise[excCount]);
        $log.log('SpareTime: '+ spareTime);
        $log.log('excCount = '+excCount);

        //Update total time
        totalTime -= 1000;

        //Creates the correct countdown
        if(spareTime == totalTime){
          excCount++;
          spareTime = spareTime - scope.exercise.exercise[excCount].exercTime;
        }

        //Stops
        if (totalTime < 0) {
          $interval.cancel(counter);
        } 

      }, 1000);
    }
  };
}]);