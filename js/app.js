(function(){
    var app = angular.module('Adventure', []);
    app.controller('Pythagorean', ['$scope', function($scope){
        this.a = 0;
        this.b = 0;
        this.c = function(){
            return this.a * this.a + this.b * this.b;
        };
        this.changes = 0;
        this.onChange = function() {
            this.changes += 1;
        };
    }]);
})();
