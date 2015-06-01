describe('Adventure', function() {
    beforeEach(angular.mock.module('Adventure'));

    var $controller;

    beforeEach(angular.mock.inject(function(_$controller_){
        $controller = _$controller_;
    }));

    describe("Pythagorean", function() {
        var pythagorean;
        var scope;

        beforeEach(function(){
            scope = {};
            pythagorean = $controller("Pythagorean", {$scope: scope});
        });

        it("MyAppController.foo should contain foo", function() {
            pythagorean.a = 4;
            pythagorean.b = 5;
            expect(pythagorean.c()).toEqual(16 + 25);
        });
    });
});
