angular.module('circuit.controllers', ['circuit.services', 'ui.router', 'circuit.directives'])

.controller('DashCtrl', function($scope, $log, $state, exerc) {
  var data = exerc.data;
  $log.info(data);

  $scope.exerc = exerc.data;

  $scope.start = function(){
    $state.go('app.circuit');
  };
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

.controller('CircuitCtrl', function($scope, $log, $interval, $state, exerc){
   $log.log(exerc.data);
   $scope.exc = exerc.data;
});
