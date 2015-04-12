angular.module('circuit.controllers', ['circuit.services'])

.controller('DashCtrl', function($scope, ExerciseGen) {
  var data = ExerciseGen.getExerc('10AbbWorkout');
  console.log(data);
})

.controller('ExercCtrl', function($scope){

});
