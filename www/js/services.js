angular.module('circuit.services', [])

.factory('ExerciseGen', function($http) {
  return {
    getExerc: function(exercise) {
      return $http.get('exercises/'+exercise+'/index.json').success(function(res){
        return res.data;
      });
    }
  };
});
