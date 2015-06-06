(function(){
    angular.module('geometry', [])
    .controller('Pythagorean', Pythagorean)
    .directive('pythagorean', function(){
        return {
            restrict: "E",
            templateUrl: "html/pythagorean.html",
            controller: "Pythagorean as p",
        };
    });

    Pythagorean.$inject = ['$scope'];
    function Pythagorean($scope){
        $scope.a = 0;
        $scope.b = 0;
        $scope.c = 0;
        $scope.changes = 0;
        function compute_c(scope){
            var a = scope.a;
            var b = scope.b;
            return Math.sqrt(a * a + b * b);
        };
        function compute_a(scope){
            var c = scope.c;
            var b = scope.b;
            return Math.sqrt(c * c - b * b);
        };
        $scope.changes = 0;
        $scope.$watch(compute_c, function(newValue, oldValue, scope){
            scope.c = newValue;
            scope.changes += 1;
        });
        $scope.$watch(compute_a, function(newValue, oldValue, scope){
            scope.a = newValue;
            scope.changes += 1;
        });
    }
})();
