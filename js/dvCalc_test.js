describe('dvCalc service', function() {
    beforeEach(angular.mock.module('dvCalc'));

    var $controller;

    beforeEach(angular.mock.inject(function(_$controller_){
        $controller = _$controller_;
    }));

    var system;
    var kerbin;
    var mun;
    var minmus;
    var dvCalc;
    var km;
    beforeEach(angular.mock.inject(function(_dvCalc_){
        dvCalc = _dvCalc_;
        km = dvCalc.km;
        Mm = dvCalc.Mm;
        kerbin = new dvCalc.Body().fromObj({
            name: "Kerbin",
            gm: 3.5316e12,
            radius: 600 * km,
            atmospheric_height: 70 * km,
            highest_elevation: 10 * km,
            orbit: null
        });
        mun = new dvCalc.Body().fromObj({
            name: "Mun",
            gm: 6.5138398e10,
            radius: 200 * km,
            atmospheric_height: 0,
            highest_elevation: 7500,
            orbit: new dvCalc.Orbit().fromRad(kerbin, 12 * Mm, 12 * Mm)
        });
        minmus = new dvCalc.Body().fromObj({
            name: "Minmus",
            gm: 1.7658e9,
            radius: 60 * km,
            atmospheric_height: 0,
            highest_elevation: 10 * km,
            orbit: new dvCalc.Orbit().fromRad(kerbin, 47 * Mm, 4.7 * Mm)
        });
        system = [kerbin, mun, minmus];
    }));

    describe("Orbit constructor", function() {
        it("should construct a new orbit given correct values", function(){
            var o = new dvCalc.Orbit().fromAlt(kerbin, 100*km, 100*km);
            expect(o.isSafeOrbit()).toBe(true);
            expect(o.pe).toBe(kerbin.radius + 100*km);
            expect(o.ap).toBe(kerbin.radius + 100*km);
        });
        it("should swap pe and ap if pe is greater than ap", function(){
            var o = new dvCalc.Orbit().fromAlt(kerbin, 200*km, 100*km);
            expect(o.isSafeOrbit()).toBe(true);
            expect(o.pe).toBe(kerbin.radius + 100*km);
            expect(o.ap).toBe(kerbin.radius + 200*km);
        });
        it("should return the correct speed for circular", function(){
            var o = new dvCalc.Orbit().fromAlt(kerbin, 100*km, 100*km);
            expect(o.speedAt('pe')).toBeCloseTo(2246.140, 3);
            expect(o.speedAt('ap')).toBe(o.speedAt('pe'));
        });
        it("should return the correct speed for elliptical", function(){
            var o = new dvCalc.Orbit().fromAlt(kerbin, 100*km, 200*km);
            expect(o.speedAt('pe')).toBeCloseTo(2319.803, 3);
            expect(o.speedAt('ap')).toBeCloseTo(2029.828, 3);
        });
        it("should return the correct speed at Mun orbit", function(){
            var o = new dvCalc.Orbit().fromRad(kerbin, 12*Mm, 12*Mm);
            expect(o.speedAt('pe')).toBeCloseTo(542.5, 1);
            expect(o.speedAt('ap')).toBe(o.speedAt('pe'));
        });
    });

    describe("Body constructor", function(){
        var obj;
        beforeEach(function(){
            obj = {
                name: "Foo", gm: 1e10, radius: 1e5,
                atmospheric_height: 1e4, highest_elevation: 1e3,
                orbit: new dvCalc.Orbit().fromRad(kerbin, 1e6, 1e6)
            };
        });
        it("constructs planet from plain object", function(){
            var planet = new dvCalc.Body().fromObj(obj);
            expect(planet.name).toBe(obj.name);
            expect(planet.gm).toBe(obj.gm);
            expect(planet.radius).toBe(obj.radius);
            expect(planet.atmospheric_height).toBe(obj.atmospheric_height);
            expect(planet.highest_elevation).toBe(obj.highest_elevation);
            expect(planet.orbit).toBe(obj.orbit);
        });
        it("creates object with proper methods", function(){
            var planet = new dvCalc.Body().fromObj(obj);
            expect(planet.escapeSpeed).toBeDefined();
            expect(planet.minimumSafeRadius).toBeDefined();
        });
    });

    describe("Body", function(){
        it("calculates escape speed properly", function(){
            expect(kerbin.escapeSpeed(700*km)).toBeCloseTo(3176.5, 1);
            expect(mun.escapeSpeed(215*km)).toBeCloseTo(778.4, 1);
        });
        it("calculates safe radius properly", function(){
            expect(kerbin.minimumSafeRadius()).toBe(680000);
            expect(mun.minimumSafeRadius()).toBe(217500);
        });
        it("calculates periapsis speed for Oberth effect", function(){
            var radius = kerbin.radius + 100*km;
            expect(kerbin.oberthReduction(radius, 1000)
            ).toBeCloseTo(3330.208, 3);
        });
        it("should equal escapeSpeed for excess velocity of 0", function(){
            var radius = kerbin.radius + 100*km;
            expect(kerbin.oberthReduction(radius, 0)
            ).toBe(kerbin.escapeSpeed(radius));
        });
    });

    describe("transfer between orbits of the same body", function() {
        it("should calculate 0 for identical orbits", function(){
            var o1 = new dvCalc.Orbit().fromAlt(kerbin, 100*km, 100*km);
            var o2 = new dvCalc.Orbit().fromAlt(kerbin, 100*km, 100*km);
            var o1_to_o2 = dvCalc.transfer(o1, o2);
            var o2_to_o1 = dvCalc.transfer(o2, o1);
            expect(o1_to_o2).toBe(0, 3);
            expect(o1_to_o2).toBe(o2_to_o1);
        });
        it("should calculate correct value and be reversible", function(){
            var o1 = new dvCalc.Orbit().fromAlt(kerbin, 100*km, 100*km);
            var o2 = new dvCalc.Orbit().fromRad(kerbin, 12*Mm, 12*Mm);
            var o1_to_o2 = dvCalc.transfer(o1, o2);
            var o2_to_o1 = dvCalc.transfer(o2, o1);
            expect(o1_to_o2).toBeCloseTo(1203.975, 3);
            expect(o1_to_o2).toBe(o2_to_o1);
        });
        it("should calculate correct value for ellipticals", function(){
            var o1 = new dvCalc.Orbit().fromAlt(kerbin, 200*km, 400*km);
            var o2 = new dvCalc.Orbit().fromAlt(kerbin, 100*km, 300*Mm);
            var o1_to_o2 = dvCalc.transfer(o1, o2);
            var o2_to_o1 = dvCalc.transfer(o2, o1);
            expect(o1_to_o2).toBeCloseTo(802.93, 1);
            expect(o1_to_o2).toBe(o2_to_o1);
        });
        it("should calculate correct value for crossing", function(){
            var o1 = new dvCalc.Orbit().fromAlt(kerbin, 100*km, 400*km);
            var o2 = new dvCalc.Orbit().fromAlt(kerbin, 200*km, 300*Mm);
            var o1_to_o2 = dvCalc.transfer(o1, o2);
            var o2_to_o1 = dvCalc.transfer(o2, o1);
            expect(o1_to_o2).toBeCloseTo(737.057, 3);
            expect(o1_to_o2).toBe(o2_to_o1);
        });
    });

    describe("transfer from orbit to lowest orbit of satellite", function(){
        it("should result in smaller dv than pure hohmann", function(){
            var o1 = kerbin.lowestSafeOrbit();
            var o2 = mun.lowestSafeOrbit();
            expect(dvCalc.transfer(o1, o2))
            .toBeLessThan(dvCalc.transfer(o1, mun.orbit));

            expect(dvCalc.transfer(o1, mun.orbit)).toBeCloseTo(1221.18, 2);
            expect(dvCalc.transfer(o1, o2)).toBeCloseTo(1164.71, 2);
        });
        it("should be reversible", function(){
            var o1 = kerbin.lowestSafeOrbit();
            var o2 = mun.lowestSafeOrbit();
            expect(dvCalc.transfer(o1, o2)).toBe(dvCalc.transfer(o2, o1));
        });
    });
    describe("transfer from satellite to satellite", function(){
        it("should be defined", function(){
            var o1 = mun.lowestSafeOrbit();
            var o2 = minmus.lowestSafeOrbit();
            expect(dvCalc.transfer(o1, o2)).toBeDefined();
        });
    });
});
