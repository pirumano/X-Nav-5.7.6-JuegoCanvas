// Original game from:
// http://www.lostdecadegames.com/how-to-make-a-simple-html5-canvas-game/
// Slight modifications by Gregorio Robles <grex@gsyc.urjc.es>
// to meet the criteria of a canvas class for DAT @ Univ. Rey Juan Carlos

var iteratione = 0;
var dificultad = 5;
var nivel = 1;

// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/background.png";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = "images/hero.png";

// princess image
var princessReady = false;
var princessImage = new Image();
princessImage.onload = function () {
	princessReady = true;
};
princessImage.src = "images/princess.png";

// stone image
var stoneReady = false;
var stoneImage = new Image();
stoneImage.onload = function () {
	stoneReady = true;
};
stoneImage.src = "images/stone.png";

//monster image
// stone image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
	monsterReady = true;
};
monsterImage.src = "images/monster.png";

// Game objects
var hero = {
	speed: 256 // movement in pixels per second
};
var princess = {};
var stone = {};
var monster = {
	speed: 64
};

var princessesCaught = 0;

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// Reset the game when the player catches a princess
var reset = function () {
	hero.x = canvas.width / 2;
	hero.y = canvas.height / 2;

	// Throw the princess somewhere on the screen randomly
	princess.x = 32 + (Math.random() * (canvas.width - 90));
	princess.y = 32 + (Math.random() * (canvas.height - 90));

	stone.x = 24 + (Math.random() * (canvas.width - 90));
	stone.y = 24 + (Math.random() * (canvas.height - 90));

	monster.x = 24 + (Math.random() * (canvas.width - 90));
	monster.y = 24 + (Math.random() * (canvas.height - 90));

	if((stone.x == canvas.width / 2) && (stone.y = canvas.height / 2)){
		reset();
	}

	if((monster.x == canvas.width / 2) && (monster.y = canvas.height / 2)){
		reset();
	}

	if((princess.x == canvas.width / 2) && (princess.y = canvas.height / 2)){
		reset();
	}

	if (
		stone.x <= (princess.x + 16)
		&& princess.x <= (stone.x + 16)
		&& stone.y <= (princess.y + 16)
		&& princess.y <= (stone.y + 32)
	) {
		reset();
	}

	if (
		monster.x <= (princess.x + 16)
		&& princess.x <= (monster.x + 16)
		&& monster.y <= (princess.y + 16)
		&& princess.y <= (monster.y + 32)
	) {
		reset();
	}

	if (
		stone.x <= (monster.x + 16)
		&& monster.x <= (stone.x + 16)
		&& stone.y <= (monster.y + 16)
		&& monster.y <= (stone.y + 32)
	) {
		reset();
	}

	if (
		monster.x <= (hero.x + 16)
		&& hero.x <= (monster.x + 16)
		&& monster.y <= (hero.y + 16)
		&& hero.y <= (monster.y + 32)
	) {
		reset();
	}
};

// Update game objects
var update = function (modifier) {
	if (38 in keysDown) { // Player holding up
		if((hero.y <= 26) || (stone.x <= (hero.x + 20)
		&& hero.x <= (stone.x + 20)
		&& stone.y <= (hero.y + 20)
		&& hero.y <= (stone.y + 40)))
			hero.y += 10;
		else
			hero.y -= hero.speed * modifier;
	}
	if (40 in keysDown) { // Player holding down
		if((hero.y >=416) || (stone.x <= (hero.x + 20)
		&& hero.x <= (stone.x + 20)
		&& stone.y <= (hero.y + 20)
		&& hero.y <= (stone.y + 40)))
			hero.y -= 10;
		else
			hero.y += hero.speed * modifier;
	}
	if (37 in keysDown) { // Player holding left
		if((hero.x <= 26) || (stone.x <= (hero.x + 20)
		&& hero.x <= (stone.x + 20)
		&& stone.y <= (hero.y + 20)
		&& hero.y <= (stone.y + 40)))
			hero.x += 10;
		else
			hero.x -= hero.speed * modifier;
	}
	if (39 in keysDown) { // Player holding right
		if((hero.x >= 454) || (stone.x <= (hero.x + 20)
		&& hero.x <= (stone.x + 20)
		&& stone.y <= (hero.y + 20)
		&& hero.y <= (stone.y + 40)))
			hero.x -= 10;
		else
			hero.x += hero.speed * modifier;
	}

	// Are they touching?
	if (
		hero.x <= (princess.x + 16)
		&& princess.x <= (hero.x + 16)
		&& hero.y <= (princess.y + 16)
		&& princess.y <= (hero.y + 32)
	) {

		if(princessesCaught % 9 == 0 && princessesCaught > 0){
			if(dificultad != 1)
				dificultad = dificultad - 1;
			nivel = nivel + 1;
		}
			++princessesCaught;
		reset();
	}

};

// Draw everything
var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if (heroReady) {
		ctx.drawImage(heroImage, hero.x, hero.y);
	}

	if (princessReady) {
		ctx.drawImage(princessImage, princess.x, princess.y);
	}

	if (stoneReady){
		ctx.drawImage(stoneImage, stone.x, stone.y);
	}

	if(monsterReady){
		ctx.drawImage(monsterImage, monster.x, monster.y);
	}

	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Princesses caught: " + princessesCaught, 32, 32);
};

// The main game loop
var main = function () {
	document.getElementById("info").innerHTML = "NIVEL: " + nivel;
	var now = Date.now();
	var delta = now - then;
	iteratione++;

	if(iteratione % dificultad == 0){
		if((monster.x - hero.x) > 0){
			monster.x = monster.x - 1;
		}else{
			monster.x = monster.x + 1;
		}

		if((monster.y - hero.y) > 0){
			monster.y = monster.y - 1;
		}else{
			monster.y = monster.y + 1;
		}
	}

	if (
		hero.x <= (monster.x + 16)
		&& monster.x <= (hero.x + 16)
		&& hero.y <= (monster.y + 16)
		&& monster.y <= (hero.y + 32)
	) {
		princessesCaught = 0;
		localStorage.setItem("store", princessesCaught);
		window.location.reload();
	}

	update(delta / 1000);
	render();

	then = now;
};

// Let's play this game!
reset();
var then = Date.now();
//The setInterval() method will wait a specified number of milliseconds, and then execute a specified function, and it will continue to execute the function, once at every given time-interval.
//Syntax: setInterval("javascript function",milliseconds);
setInterval(main, 1); // Execute as fast as possible
