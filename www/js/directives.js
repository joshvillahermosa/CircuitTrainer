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

      //To announce workout
      var announceWorkOut = function(message) {
        var msg = new SpeechSynthesisUtterance(message);
        window.speechSynthesis.speak(msg);
      };

      //Completion Message
      var completion = {
        header: 'You Have finished your circuit!'
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

      //Display time
      scope.totalTime = totalTime;

      //Set up exercise index to move from one workout to another
      var exeIndex = 0;

      //Time to switch
      var switchTime = totalTime - scope.exercise.exercise[exeIndex].exercTime;
      $log.log('Time to Switch for the first time: '+switchTime);

      //Announce before interval start workout
      announceWorkOut('Begin!');
      announceWorkOut(scope.exercise.exercise[exeIndex].exercName);

      //Exercise Time to update
      scope.exerciseTime = scope.exercise.exercise[exeIndex].exercTime ;

      var counter = $interval(function(){

        $log.log('Time to Switch in loop: '+switchTime);
        $log.log('Total Exer: '+totalExe);

        //To show total time left of the work out
        scope.totalTime = totalTime;

        //Set up curent scope for exercise
        scope.curExe = scope.exercise.exercise[exeIndex]; 

        //Update total time
        totalTime -= 1000;
        //Decrease time for update
        scope.exerciseTime -= 1000;

        //When time matches
        if(switchTime == totalTime){
          //Move to the next workout
          exeIndex++;

          //Announce workout
          announceWorkOut(scope.exercise.exercise[exeIndex].exercName);

          //Update the new switch
          switchTime = totalTime - scope.exercise.exercise[exeIndex].exercTime;
          scope.exerciseTime = scope.exercise.exercise[exeIndex].exercTime + 1000;

          //Reupdate time with next workout
          $log.log('Next exe: '+ scope.exercise.exercise[exeIndex].exercName);
        }

        //Stops
        if (totalTime < 0) {

          //Sets complettion message
          scope.complete = completion;

          //Announce finish
          announceWorkOut(completion.header);
          $interval.cancel(counter);
        } 

      }, 1000);

    }
  };
}]);