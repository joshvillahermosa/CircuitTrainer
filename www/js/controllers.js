angular.module('circuit.controllers', ['circuit.services'])

.controller('DashCtrl', function($scope, exerc) {
  var data = exerc.data;
  console.log(data);

  $scope.exercName = data.name;
  $scope.exercDesc = data.desc;
})

.controller('ExercCtrl', function($scope){

});
