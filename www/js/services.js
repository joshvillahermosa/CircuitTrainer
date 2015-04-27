angular.module('circuit.services', [])

.factory('ExerciseGen', function($http) {
  return {
    getExerc: function(exercise) {
      return $http.get('exercises/'+exercise+'/index.json');
    }
  };
});

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
