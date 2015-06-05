describe('Adventure', function() {
    beforeEach(angular.mock.module('Adventure'));

    var $controller;

    beforeEach(angular.mock.inject(function(_$controller_){
        $controller = _$controller_;
    }));

    it("includes Pythagorean", function() {
        pythagorean = $controller("Pythagorean");
        expect(pythagorean).toBeDefined();
    });
});
