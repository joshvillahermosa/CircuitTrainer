angular.module('circuit.directives', ['ionic', 'ui.router']).directive('circuit', ['$interval', '$log', '$ionicPopup', '$state',
    function($interval, $log, $ionicPopup, $state) {
        return {
            restrict: 'E',
            scope: {
                exc: '='
            },
            replace: 'true',
            templateUrl: '/templates/circuit.directive.html',
            link: function(scope, element) {
                /* -----------------------------------------------------
                // Model to work from

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
                });

                /------------------------------------------------*/
                var promise;

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
                    var timer = function() { /*totalTime, exeIndex, switchTime, exercise, totalExe*/
                      $log.log('Time to Switch in loop: ' + switchTime);
                      $log.log('Total Exer: ' + totalExe);
                      //To show total time left of the work out
                      scope.totalTime = totalTime;
                      //Set up curent scope for exercise
                      scope.curExe = exercise.exercise[exeIndex];
                      //Update circle timer
                      /*mainTotalTimer.animate(totalTime / time, function() {
                          mainTotalTimer.setText(scope.curExe.exercName)
                      });*/
                      //Update current workout
                      //workoutTimer.animate(totalTime / switchTime);
                      //Set up popup description for the workouts
                      scope.showExerDesc = function() {
                          scope.stop();
                          var popUp = $ionicPopup.alert({
                              title: scope.curExe.exercName,
                              template: scope.curExe.exercDesc,
                              subTitle: 'Authors source: ' + scope.curExe.exercRefLink
                          });
                          popUp.then(function() {
                              scope.start();
                          })
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
                          //announceWorkOut(completion.header);
                          //mainTotalTimer.setText(completion.header);
                          scope.stop();
                      }
                  };

                  scope.stop = function() {
                    promise = $interval.cancel(promise);
                  };

                  scope.continue = function() {
                    promise = $interval(timer, 1000);
                  };
                  scope.kill = function() {
                    scope.stop();
                    $state.go('app.dash');
                  };

                  scope.stop();

                  var exercise = scope.exc;
                  var totalTime = getTotalTime(scope.exc);
                  var exeIndex = 0; //Sets the index what will increment to switch workouts
                  var switchTime = getFirstSwitchTime(totalTime, scope.exc, exeIndex);
                  var totalExe = scope.exc.exercise.length;
                  
                  //promise = $interval(timer, 1000, [totalTime, exeIndex, switchTime, scope.exc, scope.exc.exercise.length]);
                  
                  promise = $interval(timer, 1000);
                };
                
            }
        };
    }
]);