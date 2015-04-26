angular.module('circuit.directives', ['ionic', 'ui.router']).directive('circuit', ['$interval', '$log', '$ionicPopup', '$state', 
    function($interval, $log, $ionicPopup, $state) {
        return {
            restrict: 'E',
            scope: {
                exc: '=',
            },
            replace: 'true',
            templateUrl: '/templates/circuit.directive.html',
            link: function(scope, element) {
                var promise;

                var mainTotalTimer = new ProgressBar.Circle('#totalTimer', {
                  color: "#59FF12",
                  strokeWidth: 2.1,
                  trailColor: "#FFF",
                  easing: 'easeOut',
                  text:{value: 'Total Workout Time left'}
                });

                //Will be worked on in the next release
                /*var workoutTimer = new ProgressBar.Circle('#workoutTimer', {
                  color: "#59FF12",
                  strokeWidth: 2.1,
                  trailColor: "#FFF",
                  easing: 'easeOut',
                  text:{value: 'Next'}
                });*/

                $log.log(scope.exc.exercise);

                var getTotalTime = function(exercise) {
                  var totalTime = 0;
                  var totalExe = exercise.exercise.length
                  for(var time = 0; time < totalExe; time++){
                    totalTime += exercise.exercise[time].exercTime;
                  }

                  $log.log('Total time in miliseconds: '+totalTime);
                  return totalTime;
                };

                var getFirstSwitchTime = function(totalTime, exercise, exeIndex){
                  var switchTime = totalTime - exercise.exercise[exeIndex].exercTime;
                  $log.log('First switch time: '+switchTime);
                  return switchTime;
                };

                var announceWorkOut = function(message) {
                  var msg = new SpeechSynthesisUtterance(message);
                  window.speechSynthesis.speak(msg);
                };

                scope.start = function() {

                    var completion = {
                      header: 'You Have finished your circuit!',
                      desc: 'You have completed this circuit! <span class="ion-checkmark-round"></span>'
                    };

                    var timer = function() { /*totalTime, exeIndex, switchTime, exercise, totalExe*/
                      $log.log('Time to Switch in loop: ' + switchTime);
                      $log.log('Total Exer: ' + totalExe);
                      //To show total time left of the work out
                      scope.totalTime = totalTime;
                      //Set up curent scope for exercise
                      scope.curExe = exercise.exercise[exeIndex];
                      //Update circle timer
                      mainTotalTimer.animate(totalTime / time, function() {
                        if(totalTime == 0) {
                          mainTotalTimer.setText('Circuit complete');
                        } else {
                          mainTotalTimer.setText(scope.curExe.exercName);
                        }
                      });
                      //Will be worked on the next release
                      //workoutTimer.animate(totalTime / switchTime);
                      //Set up popup description for the workouts
                      scope.showExerDesc = function() {
                          scope.stop();

                          if (totalTime <= 0) {
                            var popUp = $ionicPopup.alert({
                                title: completion.header,
                                template: completion.desc,
                                subTitle: 'Authors source: <a href="http://joshvee.com" >Joshvee.com</a>'
                            });
                          } else {
                            var popUp = $ionicPopup.alert({
                                title: scope.curExe.exercName,
                                template: scope.curExe.exercDesc,
                                subTitle: 'Authors source: <a href="' + scope.curExe.exercRefLink+'">'+scope.curExe.exercRefLink+'</a>'
                            });
                            popUp.then(function() {
                                scope.continue();
                            });
                          }
                      }
                      //Update total time
                      totalTime -= 1000;
                      //Decrease time for update
                      scope.exerciseTime -= 1000;
                      //When time matches
                      if (switchTime == totalTime) {
                          //Move to the next workout
                          exeIndex++;
                          //Announce workout
                          announceWorkOut(exercise.exercise[exeIndex].exercName);
                          //Update the new switch
                          switchTime = totalTime - exercise.exercise[exeIndex].exercTime;
                          scope.exerciseTime = exercise.exercise[exeIndex].exercTime + 1000;
                          //Reupdate time with next workout
                          $log.log('Next exe: ' + exercise.exercise[exeIndex].exercName);
                      }
                      //Stops
                      if (totalTime < 0) {
                          //Announce finish
                          announceWorkOut(completion.header);
                          mainTotalTimer.setText(completion.header);
                          scope.finished = true;
                          scope.stop();
                      }
                  };

                  scope.stop = function() {
                    scope.paused = true;
                    promise = $interval.cancel(promise);
                  };

                  scope.continue = function() {
                    scope.paused = false;
                    promise = $interval(timer, 1000);
                  };
                  scope.kill = function() {

                    var exercise = scope.exc;
                    var totalTime = getTotalTime(scope.exc);
                    var exeIndex = 0; //Sets the index what will increment to switch workouts
                    var switchTime = getFirstSwitchTime(totalTime, scope.exc, exeIndex);
                    var totalExe = scope.exc.exercise.length;
                    var time = totalTime;
                    scope.paused = true;
                    scope.canceled = true
                    scope.stop();
                    $state.go('app.dash');
                  };

                  scope.stop();

                  var exercise = scope.exc;
                  var totalTime = getTotalTime(scope.exc);
                  var exeIndex = 0; //Sets the index what will increment to switch workouts
                  var switchTime = getFirstSwitchTime(totalTime, scope.exc, exeIndex);
                  var totalExe = scope.exc.exercise.length;
                  var time = totalTime;
                  scope.paused = false;

                  //Announce before interval start workout
                  announceWorkOut('Begin!');
                  announceWorkOut(scope.exc.exercise[exeIndex].exercName);
                  
                  promise = $interval(timer, 1000);
                  scope.canceled = false;
                  scope.finished = false;
                };
                scope.start();
            }
        };
    }
]);