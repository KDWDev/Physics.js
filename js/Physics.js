/*
	TODO
		* Acceleration (haphazardly done)
		* Collision detection
		* Orientation (outside of impulse)
*/

Vector = {};

(function(){
	Vector.add = function(preVel,addVel,maxVel){
		var posVal = {x: preVel.x + addVel.x, y: preVel.y + addVel.y} // add vectors
		if (arguments.length == 2)
			return posVal;
		
		// determine magnitude
		var x = posVal.x,
			y = posVal.y;
			
		var m = Math.sqrt((x*x)+(y*y));
		
		if (m > maxVel) {
			var ratio = maxVel / m;
			posVal.x = x * ratio;
			posVal.y = y * ratio;
		}
		return posVal;
	};
})();


/*
	TODO
		* Acceleration (haphazardly done)
		* Collision detection
		* Orientation (outside of impulse)
*/

var body = function(args) {
	this.callback = args.callback;
	this.collDot = args.collDot;
	this.physics = {
		position: {x: 0, y: 0},
		velocity: {x: 0, y: 0},
		maxspeed: 10,
		mass: 1,
		scale: 1,
		radius: 1,
	};
	
	this.physics = $.extend({},this.physics,args.physics);
	
	this.resolveCollision = body.prototype.resolveCollision.bind(this);
};

body.prototype.constructor = body;
body.prototype.update = function(delta,fb,possColl) {
	// factor in friction baseline
	var fb = fb || 0;
	var vel = this.physics.velocity;
	if (this.physics.velocity.x>0)
		this.physics.velocity.x-=fb;
	if (this.physics.velocity.x<0)
		this.physics.velocity.x+=fb;
	if (this.physics.velocity.y>0)
		this.physics.velocity.y-=fb;
	if (this.physics.velocity.y<0)
		this.physics.velocity.y+=fb;
	
	this.physics.position.x = this.physics.position.x + (this.physics.velocity.x * delta);
	this.physics.position.y = this.physics.position.y + (this.physics.velocity.y * delta);
	
	this.checkCollisions(possColl);
	
	this.callback(this.physics);
};

body.prototype.checkCollisions = function(possColl) {
	var bodies = [];
	var distance;
	var pos = this.physics.position;
	for (body in possColl) {
		var pos2 = possColl[body].physics.position;
		var distance = Math.sqrt(((pos.x - pos2.x) * (pos.x - pos2.x)) + ((pos.y - pos2.y) * (pos.y - pos2.y)));
		if (distance < this.physics.radius + possColl[body].physics.radius) {
			this.resolveCollision(possColl[body]);
		}
	}
};

body.prototype.resolveCollision = function(b) {
	colPos = {x:0,y:0};

	colPos.x = ((this.physics.position.x * b.physics.radius) + 
				(b.physics.position.x * this.physics.radius)) /
				(this.physics.radius + b.physics.radius);

 
	colPos.y = ((this.physics.position.y * b.physics.radius) +
				(b.physics.position.y * this.physics.radius)) /
				(this.physics.radius + b.physics.radius);
		
	this.collDot(colPos);
	//console.log("collision at {x: " + colPos.x + ", y: " + colPos.y + "}")
};

body.prototype.accelerate = function(vec) {
	this.physics.velocity = Vector.add(this.physics.velocity,vec,this.physics.maxspeed);
};


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