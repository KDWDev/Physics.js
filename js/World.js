/*
	TODO

*/

/*
var _add = function(objects){
	var c = this.children;
	for (b in objects) {
		c.push(objects[b]);
	}
	console.log(this.children);
};
var _wUpdate = function(delta){
	var c = this.children;
	for (b in c) {
		objArray = c.slice(b,1);
		c[b].update(delta,objArray);
	}
};
var _checkCollisions = function(){};
*/

var world = function(args) {
	this.physics = {
		frictionBaseline: 0.1,
	};
	this.children = [];
	
	//this.add = this.add.bind(this);
	//this.update = this.update.bind(this);
};

world.prototype = {
	constructor: world,
	add: function(objects){
			var c = this.children;
			for (b in objects) {
				c.push(objects[b]);
			}
		}, //.bind(this),
	update: function(delta){
			var c = this.children;
			for (b in c) {
				objArray = c.filter(function(val){return val!=c[b]}); // stage one of culling
				c[b].update(delta, this.physics.frictionBaseline, objArray );
			}
		},
	
	
};