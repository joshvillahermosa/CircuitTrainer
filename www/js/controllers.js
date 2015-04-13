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
   var exer = exerc.data;
   $log.log(exer.exercise.length);

   var n = 0;
  /*$scope.timer = function() {
    var t = 0;
    for (var exc = 0; exc < exer.exercise.length; exc++){
      $log.log('called');
      $scope.exc = exer.exercise[exc];
      $timeout($scope.timer, exer.exercise[exc].exercTime)
    }
   }*/

   function count (){
    n++;
    console.log(n);
   }

   $interval(count, 1000);
});
