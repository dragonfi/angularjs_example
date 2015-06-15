(function(){
    angular.module('dvCalc')
    .controller('hohmannCtrl', hohmannCtrl)
    .controller('orbitCtrl', orbitCtrl)
    .directive('orbitCalc', function(){
        return {
            restrict: "E",
            templateUrl: "html/orbitCalc.html",
            controller: "orbitCtrl as ctrl"
        }
    })
    .directive('hohmannCalc', function(){
        return {
            restrict: "E",
            templateUrl: "html/hohmannCalc.html",
            controller: "hohmannCtrl as ctrl"
        };
    })

    orbitCtrl.$inject = ["$scope", "dvCalc"];
    function orbitCtrl($scope, dvCalc){
        $scope.bodies = [new dvCalc.Body().fromObj({
            name: "Kerbin",
            radius: 600000,
            atmospheric_height: 70000,
            gm: 3.5316e12,
        }), new dvCalc.Body().fromObj({
            name: "Mun",
            radius: 200000,
            atmospheric_height: 0,
            gm: 6.5138398e10
        })];

        $scope.orbit = new dvCalc.Orbit().fromRad(
            $scope.bodies[0], 700000, 700000);
    }

    hohmannCtrl.$inject = ["$scope", "dvCalc"];
    function hohmannCtrl($scope, dvCalc){
        $scope.planet = {
            name: "Kerbin",
            radius: 600000,
            atmospheric_height: 70000,
            gm: 3.5316e12,
        };
        $scope.dvCalc = dvCalc;
        $scope.o1 = new dvCalc.Orbit().fromAlt($scope.planet, 100000, 100000);
        $scope.o2 = new dvCalc.Orbit().fromAlt($scope.planet, 100000, 100000);
        $scope.a = 3.14;
        $scope.foo = {
            a: 6.82,
            b: 3.14
        };
    }
})();
