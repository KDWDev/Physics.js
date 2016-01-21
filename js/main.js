/*
	TODO

*/



var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
var renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	
var keyboard = new KeyboardState(),
	clock = new THREE.Clock();
	
var player,world;

camera.position.z = 100;

var physUpdate = function(physics) {
	this.position.x = physics.position.x;
	this.position.y = physics.position.y;
};

var cm = new THREE.Mesh( new THREE.CircleGeometry( 5, 32 ), new THREE.MeshBasicMaterial( { color: 0xff0000 } ));
scene.add(cm);
cm.position.z = 2;
var testPaint = function(vec) {
		cm.position.x = vec.x;
		cm.position.y = vec.y;
};

var addBody = function(r) {
	var b, mesh;
	
	mesh = new THREE.Mesh( new THREE.CircleGeometry( r, 32 ), new THREE.MeshBasicMaterial( { color: 0x00ff00 } ));
	b = new body({callback: physUpdate.bind(mesh), collDot: testPaint, physics: {radius:r}});
	scene.add(mesh);
	world.add([b]);
};

var addPlayer = function(r) {
	var b, mesh;
	
	mesh = new THREE.Mesh( new THREE.CircleGeometry( r, 32 ), new THREE.MeshBasicMaterial( { color: 0x0000ff } ));
	b = new body({callback: physUpdate.bind(mesh), collDot: testPaint, physics: {radius:r, maxspeed: 20}});
	scene.add(mesh);
	world.add([b]);
	return b;
};

var keyUpdate = function(){
	keyboard.update();
	
	if ( keyboard.pressed("left") ) 
		player.accelerate( {x: -1, y: 0} );	
	if ( keyboard.pressed("right") ) 
		player.accelerate( {x: 1, y: 0} );
	if ( keyboard.pressed("up") )
		player.accelerate( {x: 0, y: 1} );
	if ( keyboard.pressed("down") )
		player.accelerate(  {x: 0, y: -1} );
};


var render = function () {
	var delta = clock.getDelta();
	keyUpdate();
	world.update(delta);
	requestAnimationFrame( render );
	renderer.render(scene, camera);
};