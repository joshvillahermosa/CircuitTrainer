angular.module('circuit.controllers', ['circuit.services'])

.controller('DashCtrl', function($scope, $log, exerc) {
  var data = exerc.data;
  $log.info(data);

  $scope.exerc = exerc.data
})

.controller('ExercCtrl', function($scope, $log, exerc){
  $scope.exerc = exerc.data;

  $scope.totalTime = function(){
    var workouts = exerc.data.exercise;
    var totalTime = 0;
    for(var time = 0; time < exerc.data.exercise.length; time++){
      totalTime += exerc.data.exercise[time].exercTime;
    }
    return totalTime;
  }
})

.controller('CircuitCtrl', function($scope, $log, $interval, exerc){
   $log.log(exerc.data);
   $scope.exc = exerc.data;
});
