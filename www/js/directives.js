angular.module('circuit.directives', ['ionic', 'ui.router']).directive('circuit', ['$interval', '$log', '$ionicPopup', '$state', 
    function($interval, $log, $ionicPopup, $state) {
        return {
            restrict: 'E',
            scope: {
                exc: '=',
            },
            replace: 'true',
            templateUrl: '/templates/circuit.directive.html',
            link: function(scope, element) {
                
            }
        };
    }
]);