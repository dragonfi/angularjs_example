(function(){
    angular.module('dvCalc', [])
    .service('dvCalc', dvCalcService)

    function dvCalcService(){
        dvCalc = this;
        var km = 1000;
        var Mm = 1000*km;
        this.km = km;
        this.Mm = Mm;

        this.newOrbitFromAltitude = function(body, pe_altitude, ap_altitude){
            var pe = pe_altitude + body.radius;
            var ap = ap_altitude + body.radius;
            return new dvCalc.Orbit(body, pe, ap);
        };

        this.Orbit = function(body, pe, ap){
            this.body = body;
            this.pe = pe;
            this.ap = ap;
            if (this.pe > this.ap){
                var tmp = this.pe;
                this.pe = this.ap;
                this.ap = tmp;
            };
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

        this.hohmannTransfer = function(source, target){
            if (target.pe < source.pe) {
                var tmp = source;
                source = target;
                target = tmp;
            };

            var transfer = new dvCalc.Orbit(source.body, source.pe, target.ap);
            var dv1 = Math.abs(transfer.speedAt('pe') - source.speedAt('pe'));
            var dv2 = Math.abs(target.speedAt('ap') - transfer.speedAt('ap'));
            return dv1 + dv2;
        };
    };

    HohmannCalc.$inject = ['$scope'];
    function HohmannCalc($scope){
    };
})();
