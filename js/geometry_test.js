describe('geometry module', function() {
    beforeEach(angular.mock.module('geometry'));

    var $controller;

    beforeEach(angular.mock.inject(function(_$controller_){
        $controller = _$controller_;
    }));

    describe("Pythagorean", function() {
        var pythagorean;

        beforeEach(function(){
            pythagorean = $controller("Pythagorean");
        });

        it("should compute c when a and b are provided", function() {
            pythagorean.a = 3;
            pythagorean.b = 4;
            pythagorean.onChange('a');
            expect(pythagorean.c).toEqual(5);

            pythagorean.a = 10;
            pythagorean.b = 24;
            pythagorean.onChange('b');
            expect(pythagorean.c).toEqual(26);
        });

        it("should compute a when c and b are provided", function() {
            pythagorean.c = 5;
            pythagorean.b = 4;
            pythagorean.onChange('c');
            expect(pythagorean.a).toEqual(3);

            pythagorean.c = 26;
            pythagorean.b = 24;
            pythagorean.onChange('c');
            expect(pythagorean.a).toEqual(10);
        });
    });
});
