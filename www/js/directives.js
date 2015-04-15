angular.module('circuit.directives', [])

.directive('circuit', function(){
  return {
    restrict: 'E',
    templateUrl: '/templates/circuit.directive.html'
  };
});