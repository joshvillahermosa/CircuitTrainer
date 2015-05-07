angular.module('circuit.controllers', ['circuit.services', 'ui.router', 'circuit.directives', 'ionic', 'ngCordova'])
.config(['$logProvider', function($logProvider){
    //$logProvider.debugEnabled(false);
}])
.controller('DashCtrl', function($scope, $log, $state, exerc) {
    var data = exerc.data;
    $log.debug(data);
    $scope.exerc = exerc.data;
    $scope.start = function() {
        $state.go('app.circuit');
    };
}).controller('ExercCtrl', function($scope, $log, exerc) {
    $scope.exerc = exerc.data;
    $scope.totalTime = function() {
        var workouts = exerc.data.exercise;
        var totalTime = 0;
        for (var time = 0; time < exerc.data.exercise.length; time++) {
            totalTime += exerc.data.exercise[time].exercTime;
        }
        return totalTime;
    }
}).controller('CircuitCtrl', function($scope, $log, $interval, $timeout, $state, $ionicPopup, $cordovaNativeAudio, exerc) {
    $log.debug(exerc.data);
    $scope.exc = exerc.data;
    var promise;
    var mainTotalTimer = new ProgressBar.Circle('#totalTimer', {
        color: "#59FF12",
        strokeWidth: 2.1,
        trailColor: "#FFF",
        easing: 'easeOut',
        text: {
            value: 'Total Workout Time left'
        }
    });
    //Will be worked on in the next release
    /*var workoutTimer = new ProgressBar.Circle('#workoutTimer', {
      color: "#59FF12",
      strokeWidth: 2.1,
      trailColor: "#FFF",
      easing: 'easeOut',
      text:{value: 'Next'}
    });*/

    $log.debug($scope.exc.exercise);
    var getTotalTime = function(exercise) {
        var totalTime = 0;
        var totalExe = exercise.exercise.length
        for (var time = 0; time < totalExe; time++) {
            totalTime += exercise.exercise[time].exercTime;
        }
        $log.debug('Total time in miliseconds: ' + totalTime);
        return totalTime;
    };
    var getFirstSwitchTime = function(totalTime, exercise, exeIndex) {
        var switchTime = totalTime - exercise.exercise[exeIndex].exercTime;
        $log.debug('First switch time: ' + switchTime);
        return switchTime;
    };

    //This section will need to me modulized into a service
    var setUpMedia = function() {
        
        $cordovaNativeAudio
        .preloadSimple('begin', 'mp3s/begin.mp3')
        .then(function (msg) {
          $log.debug('Audio loaded -Begin-, messaged: '+msg);
        }, function (error) {
          $log.error(error);
        });

        $cordovaNativeAudio
        .preloadSimple('end', 'mp3s/completed.mp3')
        .then(function (msg) {
          $log.debug('Audio loaded -Begin-, messaged: '+msg);
        }, function (error) {
          $log.error(error);
        });

        //Create the media to be played from the exercises array
        var exercisesLength = $scope.exc.exercise.length;
        $log.debug('Total Exercises: '+exercisesLength);

        for(var index = 0; index < exercisesLength; index++){
            $log.debug('Audio to be loaded -'+ $scope.exc.exercise[index].exercName );
            $cordovaNativeAudio
            .preloadSimple($scope.exc.exercise[index].exercName, 'exercises/'+$scope.exc.folderName+'/'+$scope.exc.audioFolder+'/'+$scope.exc.exercise[index].audio)
            .then(function (msg) {
              $log.debug('Audio loaded -'+ $scope.exc.exercise[index].exercName +'-, messaged: '+msg);
            }, function (error) {
              $log.error(error);
            });
        }
    };
    $scope.start = function() {
        var completion = {
            header: 'You Have finished your circuit!',
            desc: 'You have completed this circuit! <span class="ion-checkmark-round"></span>'
        };
        var timer = function() { /*totalTime, exeIndex, switchTime, exercise, totalExe*/
            $log.debug('Time to Switch in loop: ' + switchTime);
            $log.debug('Total Exer: ' + totalExe);
            //To show total time left of the work out
            $scope.totalTime = totalTime;
            //Set up curent scope for exercise
            $scope.curExe = exercise.exercise[exeIndex];
            //Update circle timer
            mainTotalTimer.animate(totalTime / time, function() {
                if (totalTime == 0) {
                    mainTotalTimer.setText('Circuit complete');
                } else {
                    mainTotalTimer.setText($scope.curExe.exercName);
                }
            });
            //Will be worked on the next release
            //workoutTimer.animate(totalTime / switchTime);
            //Set up popup description for the workouts
            $scope.showExerDesc = function() {
                $scope.stop();
                if (totalTime <= 0) {
                    var popUp = $ionicPopup.alert({
                        title: completion.header,
                        template: completion.desc,
                        subTitle: 'Authors source: <a href="http://joshvee.com" >Joshvee.com</a>'
                    });
                } else {
                    var popUp = $ionicPopup.alert({
                        title: $scope.curExe.exercName,
                        template: $scope.curExe.exercDesc,
                        subTitle: 'Authors source: <a href="' + $scope.curExe.exercRefLink + '">' + $scope.curExe.exercRefLink + '</a>'
                    });
                    popUp.then(function() {
                        $scope.continue ();
                    });
                }
            }
            //Update total time
            totalTime -= 1000;
            //Decrease time for update
            $scope.exerciseTime -= 1000;
            //When time matches
            if (switchTime == totalTime) {
                //Move to the next workout
                exeIndex++;
                //Announce workout 
                $cordovaNativeAudio.play(exercise.exercise[exeIndex].exercName);
                //Update the new switch
                switchTime = totalTime - exercise.exercise[exeIndex].exercTime;
                $scope.exerciseTime = exercise.exercise[exeIndex].exercTime + 1000;
                //Reupdate time with next workout
                $log.debug('Next exe: ' + exercise.exercise[exeIndex].exercName);
            }
            //Stops
            if (totalTime < 0) {
                //Announce finish
                $cordovaNativeAudio.play('end');
                mainTotalTimer.setText(completion.header);
                $scope.finished = true;
                $scope.stop();
            }
        };
        $scope.stop = function() {
            $scope.paused = true;
            promise = $interval.cancel(promise);
        };
        $scope.continue = function() {
            $scope.paused = false;
            promise = $interval(timer, 1000);
        };
        $scope.kill = function() {
            var exercise = $scope.exc;
            var totalTime = getTotalTime($scope.exc);
            var exeIndex = 0; //Sets the index what will increment to switch workouts
            var switchTime = getFirstSwitchTime(totalTime, $scope.exc, exeIndex);
            var totalExe = $scope.exc.exercise.length;
            var time = totalTime;
            $scope.paused = true;
            $scope.canceled = true
            $scope.stop();
            $state.go('app.dash');
        };
        $scope.stop();
        var exercise = $scope.exc;
        var totalTime = getTotalTime($scope.exc);
        var exeIndex = 0; //Sets the index what will increment to switch workouts
        var switchTime = getFirstSwitchTime(totalTime, $scope.exc, exeIndex);
        var totalExe = $scope.exc.exercise.length;
        var time = totalTime;
        $scope.paused = false;
        //Announce before interval start workout
        $cordovaNativeAudio.play('begin');

        //Wait after playing begin
        $timeout(function(){$cordovaNativeAudio.play(exercise.exercise[exeIndex].exercName);}, 1500);
        
        //announceWorkOut($scope.exc.exercise[exeIndex].exercName);
        promise = $interval(timer, 1000);
        $scope.canceled = false;
        $scope.finished = false;
    };
    setUpMedia();
    $scope.start();
});