describe('dvCalc module', function() {
    beforeEach(angular.mock.module('dvCalc'));

    var $controller;

    beforeEach(angular.mock.inject(function(_$controller_){
        $controller = _$controller_;
    }));

    describe("dvCalc service", function() {
        var kerbin = {
            name: "Kerbin",
            radius: 600000,
            atmospheric_height: 70000,
            gm: 3.5316e12,
        };

        var dvCalc;
        var km;
        beforeEach(angular.mock.inject(function(_dvCalc_){
            dvCalc = _dvCalc_;
            km = dvCalc.km;
            Mm = dvCalc.Mm;
        }));

        describe("OrbitFromSurface constructor", function() {
            it("should construct a new orbit given correct values", function(){
                var o = dvCalc.newOrbitFromAltitude(kerbin, 100*km, 100*km);
                expect(o.isSafeOrbit()).toBe(true);
                expect(o.pe).toBe(kerbin.radius + 100*km);
                expect(o.ap).toBe(kerbin.radius + 100*km);
            });
            it("should swap pe and ap if pe is greater than ap", function(){
                var o = dvCalc.newOrbitFromAltitude(kerbin, 200*km, 100*km);
                expect(o.isSafeOrbit()).toBe(true);
                expect(o.pe).toBe(kerbin.radius + 100*km);
                expect(o.ap).toBe(kerbin.radius + 200*km);
            });
            it("should return the correct speed for circular", function(){
                var o = dvCalc.newOrbitFromAltitude(kerbin, 100*km, 100*km);
                expect(o.speedAt('pe')).toBeCloseTo(2246.140, 3);
                expect(o.speedAt('ap')).toBe(o.speedAt('pe'));
            });
            it("should return the correct speed for elliptical", function(){
                var o = dvCalc.newOrbitFromAltitude(kerbin, 100*km, 200*km);
                expect(o.speedAt('pe')).toBeCloseTo(2319.803, 3);
                expect(o.speedAt('ap')).toBeCloseTo(2029.828, 3);
            });
            it("should return the correct speed at Mun orbit", function(){
                var o = new dvCalc.Orbit(kerbin, 12*Mm, 12*Mm);
                expect(o.speedAt('pe')).toBeCloseTo(542.5, 1);
                expect(o.speedAt('ap')).toBe(o.speedAt('pe'));
            });
        });

        describe("hohmannTransfer", function() {
            it("should calculate correct value and be reversible", function(){
                var o1 = dvCalc.newOrbitFromAltitude(kerbin, 100*km, 100*km);
                var o2 = new dvCalc.Orbit(kerbin, 12*Mm, 12*Mm);
                var o1_to_o2 = dvCalc.hohmannTransfer(o1, o2);
                var o2_to_o1 = dvCalc.hohmannTransfer(o2, o1);
                expect(o1_to_o2).toBeCloseTo(1203.975, 3);
                expect(o1_to_o2).toBe(o2_to_o1);
            });
            it("should calculate correct value for elliptical", function(){
                var o1 = dvCalc.newOrbitFromAltitude(kerbin, 200*km, 400*km);
                var o2 = dvCalc.newOrbitFromAltitude(kerbin, 100*km, 300*Mm);
                var o1_to_o2 = dvCalc.hohmannTransfer(o1, o2);
                var o2_to_o1 = dvCalc.hohmannTransfer(o2, o1);
                expect(o1_to_o2).toBeCloseTo(802.93, 1);
                expect(o1_to_o2).toBe(o2_to_o1);
            });
            it("should calculate correct value for elliptical 2", function(){
                var o1 = dvCalc.newOrbitFromAltitude(kerbin, 100*km, 400*km);
                var o2 = dvCalc.newOrbitFromAltitude(kerbin, 200*km, 300*Mm);
                var o1_to_o2 = dvCalc.hohmannTransfer(o1, o2);
                var o2_to_o1 = dvCalc.hohmannTransfer(o2, o1);
                expect(o1_to_o2).toBeCloseTo(737.057, 3);
                expect(o1_to_o2).toBe(o2_to_o1);
            });
        });
    });
});
