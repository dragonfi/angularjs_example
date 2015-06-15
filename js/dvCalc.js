(function(){
    angular.module('dvCalc', [])
    .service('dvCalc', dvCalcService)

    function dvCalcService(){
        dvCalc = this;
        var km = 1000;
        var Mm = 1000*km;
        this.km = km;
        this.Mm = Mm;

        this.Orbit = function(){
            this.body = null;
            this.pe = null;
            this.ap = null;
        };
        this.Orbit.prototype.fromRad = function(body, pe, ap){
            this.body = body;
            this.pe = pe;
            this.ap = ap;
            if (this.pe > this.ap){
                var tmp = this.pe;
                this.pe = this.ap;
                this.ap = tmp;
            };
            return this;
        };
        this.Orbit.prototype.fromAlt = function(body, pe_alt, ap_alt){
            var pe = pe_alt + body.radius;
            var ap = ap_alt + body.radius;
            return this.fromRad(body, pe, ap);
        };
        this.Orbit.prototype.isSafeOrbit = function(){
            var atmo_height = this.body.radius + this.body.atmospheric_height;
            var safety_radius = atmo_height + 10*km;
            return this.pe > safety_radius;
        };
        this.Orbit.prototype.speedAt = function(radius){
            radius = (radius === 'pe') ? this.pe : radius;
            radius = (radius === 'ap') ? this.ap : radius;
            if (radius < this.pe || radius > this.ap){
                throw {
                    message: "Radius must be within range",
                    orbit: this, radius: radius
                };
            };
            var a2 = (this.ap + this.pe);
            return Math.sqrt(this.body.gm * 2 * (1/radius - 1/a2));
        };

        this.Body = function(){
            this.name = null;
            this.gm = null;
            this.pe = null;
            this.ap = null;
            this.radius = null;
            this.highest_elevation = null;
            this.atmospheric_height = null;
        };

        this.Body.prototype.fromObj = function(obj){
            this.name = obj.name;
            this.gm = obj.gm;
            this.pe = obj.pe;
            this.ap = obj.ap;
            this.radius = obj.radius;
            this.highest_elevation = obj.highest_elevation;
            this.atmospheric_height = obj.atmospheric_height;
            this.orbit = obj.orbit;
            return this;
        };

        this.Body.prototype.escapeSpeed = function(radius){
            return Math.sqrt(2 * this.gm / radius);
        };

        this.Body.prototype.minimumSafeRadius = function(){
            var atm = this.radius + this.atmospheric_height;
            var ele = this.radius + this.highest_elevation;
            return Math.max(atm, ele) + 10000;
        };

        this.Body.prototype.lowestSafeOrbit = function(){
            var r = this.minimumSafeRadius();
            return new dvCalc.Orbit().fromRad(this, r, r);
        };

        this.Body.prototype.oberthReduction = function(radius, v_inf){
            radius = (radius === 'min') ? this.minimumSafeRadius() : radius;
            var v_esc = this.escapeSpeed(radius);
            return Math.sqrt(v_esc*v_esc + v_inf*v_inf);
        };

        this.hohmannTransfer = function(source, target){
            var swapped = false;
            if (target.pe < source.pe) {
                swapped = source;
                source = target;
                target = swapped;
            };

            var transfer = new dvCalc.Orbit().fromRad(
                source.body, source.pe, target.ap);
            var dv1 = Math.abs(transfer.speedAt('pe') - source.speedAt('pe'));
            var dv2 = Math.abs(target.speedAt('ap') - transfer.speedAt('ap'));
            if (swapped) {
                swapped = dv1;
                dv1 = dv2;
                dv2 = swapped;
            };
            return {dv1:dv1, dv2:dv2};
        };

        this.hohmannTransferToSatellite = function(o1, o2){
            var dvs = this.hohmannTransfer(o1, o2.body.orbit);
            dvs.dv2 = o2.body.oberthReduction('min', dvs.dv2);
            dvs.dv2 -= o2.body.lowestSafeOrbit().speedAt('pe');
            return dvs;
        };

        this.hohmannTransferBetweenSatellites = function(o1, o2){
            var dvs = this.hohmannTransfer(o1.body.orbit, o2.body.orbit);
            console.log(dvs);
            dvs.dv1 = o1.body.oberthReduction(o1.pe, dvs.dv1);
            console.log(dvs);
            dvs.dv1 -= o1.speedAt('pe');
            console.log(dvs);
            dvs.dv2 = o2.body.oberthReduction(o2.pe, dvs.dv2);
            console.log(dvs);
            dvs.dv2 -= o2.speedAt('pe');
            console.log(dvs);
            return dvs;
        };

        this.transfer = function(o1, o2){
            var dvs;
            if (o1.body === o2.body){
                dvs = this.hohmannTransfer(o1, o2);
            } else if (o2.body.orbit && o2.body.orbit.body === o1.body) {
                dvs = this.hohmannTransferToSatellite(o1, o2);
            } else if (o1.body.orbit && o1.body.orbit.body === o2.body) {
                dvs = this.hohmannTransferToSatellite(o2, o1);
            } else if (o1.body.orbit && o2.body.orbit
                    && o1.body.orbit.body === o2.body.orbit.body) {
                dvs = this.hohmannTransferBetweenSatellites(o1, o2);
            }
            return dvs.dv1 + dvs.dv2;
        };
    };
})();
