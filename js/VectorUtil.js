//vectormaths

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