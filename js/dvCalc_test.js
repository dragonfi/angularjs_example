describe('dvCalc module', function() {
    beforeEach(angular.mock.module('dvCalc'));

    var $controller;

    beforeEach(angular.mock.inject(function(_$controller_){
        $controller = _$controller_;
    }));

    describe("HohmannCalc controller", function() {
        var scope;
        var ctrl;

        beforeEach(angular.mock.inject(function($rootScope){
            scope = $rootScope.$new();
            ctrl = $controller("HohmannCalc", {$scope: scope});
        }));

        it("should do something", function() {
        });
    });
});
