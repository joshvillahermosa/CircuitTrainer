var circuitServices = angular.module('circuit.services', []);

circuitServices.factory('ExerciseGen', ["$http", function($http) {
  return {
    getExerc: function(exercise) {
      return $http.get('exercises/'+exercise+'/index.json');
    }
  };
}]);

/*
.service('timerStartCheck', function(){
  var isStart;

  var setIsStart = function(didStart){
    isStart = didStart;
  };

  var getIsStart = function() {
    return isStart;
  };

  return {
    setIsStart: setIsStart,
    getIsStart: getIsStart
  }
});*/
