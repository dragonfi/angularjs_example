describe('geometry module', function() {
    beforeEach(angular.mock.module('geometry'));

    var $controller;

    beforeEach(angular.mock.inject(function(_$controller_){
        $controller = _$controller_;
    }));

    describe("Pythagorean", function() {
        var scope;
        var pythagorean;

        beforeEach(angular.mock.inject(function($rootScope){
            scope = $rootScope.$new();
            pythagorean = $controller("Pythagorean", {$scope: scope});
        }));

        it("should compute c when a and b are provided", function() {
            scope.a = 3;
            scope.b = 4;
            scope.$digest();
            expect(scope.c).toEqual(5);

            scope.a = 10;
            scope.b = 24;
            scope.$digest();
            expect(scope.c).toEqual(26);
        });

        it("should compute a when c and b are provided", function() {
            scope.b = 4;
            scope.$digest();

            scope.c = 5;
            scope.$digest();
            expect(scope.a).toEqual(3);

            scope.b = 24;
            scope.$digest();

            scope.c = 26;
            scope.$digest();
            expect(scope.a).toEqual(10);
        });
    });
});
