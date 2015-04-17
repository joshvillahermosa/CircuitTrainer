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
      //Completion Message
      var completion = {
        header: 'Complete'
      };

      //Total time of the whole work out
      var totalTime = 0;
      
      //Get total Exe count
      var totalExe = scope.exercise.exercise.length;

      //Captures total time
      for(var time = 0; time < totalExe; time++){
        totalTime += scope.exercise.exercise[time].exercTime;
      }

      $log.log('Total time: '+ totalTime);

      //SwitchIndex for the code below
      var switchIndex = 1;
      $log.log('Array index: '+ (totalExe - switchIndex));
      $log.log('Time of that exercise: '+ (scope.exercise.exercise[totalExe - switchIndex].exercTime));

      //Time to switch
      var switchTime = totalTime - scope.exercise.exercise[totalExe - switchIndex].exercTime;
      $log.log('Time to Switch for the first time: '+switchTime);

      //Display time
      scope.totalTime = totalTime;

      //Set up exercise index to move from one workout to another
      var exeIndex = 0;

      var counter = $interval(function(){
        $log.log('Time to Switch in loop: '+switchTime);
        $log.log('Total Exer: '+totalExe);

        //To show total time left of the work out
        scope.totalTime = totalTime;

        //Set up curent scope for exercise
        scope.curExe = scope.exercise.exercise[exeIndex]; 

        //Update total time
        totalTime -= 1000;

        if(switchTime == totalTime){
          //Move to the next workout
          exeIndex++;

          //Update to subtract index. This will lead to the next work out time (From last to first)
          switchIndex++

          //Update the new switch
          switchTime = totalTime - scope.exercise.exercise[totalExe - switchIndex].exercTime;
          $log.log('Next exe: '+ scope.exercise.exercise[exeIndex].exercName);
        }

        //Stops
        if (totalTime < 0) {
          $log.info('Fin');
          scope.complete = completion;
          $interval.cancel(counter);
        } 

      }, 1000);
    }
  };
}]);