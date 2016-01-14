var Body = {};


(function() {
	
	Body.create = function(args) {
		var defaults = {
				mesh: null,
				position: {x: 0, y: 0},
				velocity: {x: 0, y: 0},
				mass: 1,
				scale: 1,
				radius: 1,
			};
		var body = $.extend({},defaults,args);
		
		// set internal functions
		body.applyImpulse = _applyImpulse.bind(body);
		
		return body;
	}
	
	/*
	 *	INTERNAL DEFS
	 */
	
	var _applyImpulse = function(args){
		this.velocity.x += args.x;
		this.velocity.y += args.y;
	};
	
})();

var World = {};

(function() {
	World.create = function(args) {
		var defaults = {
				children: [],
				frictionBaseline: 0.01,
				gravConst: 0.01,
			};
		var world = $.extend({},defaults,args);
			// Rectify scope issues
			world.add = _add.bind(world);
			world.update = _calculateAllPositions.bind(world);
			world.calculateBodyPosition = _calculateBodyPosition.bind(world);
			world.checkCollisions = _checkCollisions.bind(world);
			world.resolveCollision = _resolveCollision.bind(world);
			
		return world;
	}
	
	/*
	 *	INTERNAL DEFS
	 */
	var _add = function(args) {
		for (obj in args) {
			this.children.push(args[obj]);
		}
	};
	
	var _calculateAllPositions = function(delta){
		var c = this.children;
		for (b in c) {
			var body = c[b];
			this.calculateBodyPosition(body,delta);
			this.checkCollisions(body);
		}
	};
	
	var _calculateBodyPosition = function(body,delta) {
		// body.position -> last recorded position
		// body.velocity -> duh
		// delta -> change in time since last recorded position
		
		// supes ugly, but in the absence of gravity, this will slow down and eventually stop objects
		var fb = this.frictionBaseline;
		if (body.velocity.x>0)
			body.velocity.x-=fb;
		if (body.velocity.x<0)
			body.velocity.x+=fb;
		
		if (body.velocity.y>0)
			body.velocity.y-=fb;
		if (body.velocity.y<0)
			body.velocity.y+=fb;
		//body.velocity.x-=fb;
		//body.velocity.y-=fb;
		
		body.position.x = body.position.x + (body.velocity.x * delta);
		body.position.y = body.position.y + (body.velocity.y * delta);
		
		
		// 
	};
	
	var _checkCollisions = function(body1){
		var body2;
		for (b in this.children) {
			if (this.children[b] != body1)
				body2 = this.children[b];
		}
		
		var dx = body1.position.x - body2.position.x;
		var dy = body1.position.y - body2.position.y;
		var distance = Math.sqrt(dx*dx + dy*dy);
		
		if (distance < body1.radius + body2.radius) {
			body1.velocity.x = body1.velocity.x * -1;
			body1.velocity.y = body1.velocity.y * -1;
		}
	};
	
	var _resolveCollision = function(){};
})();