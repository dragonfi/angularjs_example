(function(){
    angular.module('geometry', [])
    .controller('Pythagorean', function(){
        this.a = 0;
        this.b = 0;
        this.c = function(){
            return Math.sqrt(this.a * this.a + this.b * this.b);
        };
        this.changes = 0;
        this.onChange = function() {
            this.changes += 1;
        };
    });
})();
