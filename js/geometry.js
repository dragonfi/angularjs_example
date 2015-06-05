(function(){
    angular.module('geometry', [])
    .controller('Pythagorean', function(){
        this.a = 0;
        this.b = 0;
        this.compute_c = function(){
            return Math.sqrt(this.a * this.a + this.b * this.b);
        };
        this.compute_a = function(){
            return Math.sqrt(this.c * this.c - this.b * this.b);
        };
        this.changes = 0;
        this.onChange = function(side) {
            this.changes += 1;
            if (side=="a" || side=="b") {
                this.c = this.compute_c();
            };
            if (side=="c") {
                this.a = this.compute_a();
            };
        };
    }).directive('pythagorean', function(){
        return {
            restrict: "E",
            templateUrl: "html/pythagorean.html",
            controller: "Pythagorean as p",
        };
    });
})();
