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
      var time = totalTime;

      //Set up exercise index to move from one workout to another
      var exeIndex = 0;

      //Time to switch
      var switchTime = totalTime - scope.exercise.exercise[exeIndex].exercTime;
      $log.log('Time to Switch for the first time: '+switchTime);

      //Announce before interval start workout
      announceWorkOut('Begin!');
      announceWorkOut(scope.exercise.exercise[exeIndex].exercName);

      //Exercise Time to update
      scope.exerciseTime = scope.exercise.exercise[exeIndex].exercTime +1000;

      // Total Time -- Circle bar
      var mainTotalTimer = new ProgressBar.Circle('#totalTimer', {
        color: "#59FF12",
        strokeWidth: 2.1,
        trailColor: "#FFF",
        easing: 'easeOut',
        text:{value: 'Total Workout Time left'}
      });

      var workoutTimer = new ProgressBar.Circle('#workoutTimer', {
        color: "#59FF12",
        strokeWidth: 2.1,
        trailColor: "#FFF",
        easing: 'easeOut',
        text:{value: 'Next'}
      });


      var timer = function(){
        $log.log('Time to Switch in loop: '+switchTime);
        $log.log('Total Exer: '+totalExe);

        //To show total time left of the work out
        scope.totalTime = totalTime;

        //Set up curent scope for exercise
        scope.curExe = scope.exercise.exercise[exeIndex]; 

        //Update circle timer
        mainTotalTimer.animate(totalTime/time, function(){
          mainTotalTimer.setText(scope.curExe.exercName)
        });

        //Update current workout
        workoutTimer.animate(totalTime/switchTime);

        //Set up popup description for the workouts
        scope.showExerDesc = function(){
          scope.stop();
          var popUp = $ionicPopup.alert({
            title: scope.curExe.exercName,
            template: scope.curExe.exercDesc,
            subTitle: 'Authors source: '+scope.curExe.exercRefLink
          });

          popUp.then(function(){
            scope.start();
          })
        }

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

          //Announce finish
          announceWorkOut(completion.header);
          mainTotalTimer.setText(completion.header);
          $interval.cancel(promis);
        } 
      };
      //var counter = $interval(timer, 1000);

      //Starts timer
      scope.start = function(){
        scope.stop;
        scope.paused = false;
        promis = $interval(timer, 1000); 
      };

      //Stops or pauses
      scope.stop = function(){
        scope.paused = true;
        $interval.cancel(promis);
      };

      //Cancels overall
      scope.cancel = function() {
        $log.log('Cancelling');
        
        
        //Reset Variables
        exeIndex = 0;
        switchTime = totalTime - scope.exercise.exercise[exeIndex].exercTime;
        scope.exerciseTime = scope.exercise.exercise[exeIndex].exercTime +1000;

        //Supposed to change states
        $log.log('Done');
      };

      element.on('$destroy', function() {
        scope.stop();
        $log.log('HIT');
      });
      scope.start();
    }
  };
}]);