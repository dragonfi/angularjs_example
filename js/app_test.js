describe('Adventure', function() {
    beforeEach(angular.mock.module('Adventure'));

    var $controller;
    var scope;

    beforeEach(angular.mock.inject(function($rootScope, _$controller_){
        scope = $rootScope.$new();
        $controller = _$controller_;
    }));

    it("includes Pythagorean", function() {
        pythagorean = $controller("Pythagorean", {$scope: scope});
        expect(pythagorean).toBeDefined();
    });
});
