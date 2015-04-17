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
      //Total time of the whole work out
      var totalTime = 0;
      
      //Get total Exe count
      var totalExe = scope.exercise.exercise.length;

      //Captures total time
      for(var time = 0; time < totalExe; time++){
        totalTime += scope.exercise.exercise[time].exercTime;
      }

      //SwitchIndex for the code below
      var switchIndex = 1;
      $log.log('Array index: '+ (totalExe - switchIndex));

      //Time to switch
      var switchTime = totalTime - scope.exercise.exercise[totalExe - switchIndex].exercTime;

      //Display time
      scope.totalTime = totalTime;

      //Set up exercise index
      var exeIndex = 0;

      var counter = $interval(function(){
        $log.log('Time to Switch: '+switchTime);

        //To show total time left of the work out
        scope.totalTime = totalTime;

        //Set up curent scope for exercise
        scope.curExe = scope.exercise.exercise[exeIndex]; 

        //Update total time
        totalTime -= 1000;

        if(switchTime == totalTime){
          exeIndex++;
          switchIndex++
          var switchTime = totalTime - scope.exercise.exercise[totalExe - switchIndex].exercTime;
          $log.log('Next exe: '+ scope.exercise.exercise[exeIndex].exercName);
        }

        //Stops
        if (totalTime < 0) {
          $interval.cancel(counter);
        } 

      }, 1000);
    }
  };
}]);