(function(){
    angular.module('dvCalc', [])
    .controller('HohmannCalc', HohmannCalc)
    .directive('dvCalcHohmann', function(){
        return {
            restrict: "E",
            templateUrl: "html/hohmannCalc.html",
            controller: "HohmannCalc as ctrl",
        };
    });

    HohmannCalc.$inject = ['$scope'];
    function HohmannCalc($scope){
    }
})();
