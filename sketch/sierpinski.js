let devMode = false;

let shape;
let isShapeRandom = true;

let calculationsPerFrame = 1000;

// Framerate html holder
let fr; 

let isRunning;

function setup() {
	let canvas = createCanvas(
		window.innerWidth*(9/10),
		window.innerHeight*(9/10)
		);

	background(220);

	shape = new Shape();

	// if (devMode) {frameRate(1);}

	// Framerate holder, <p> element
	fr = createP('');

	isRunning = true;
}

function draw() {
	if (isRunning) {
		shape.update();
		shape.display();
	}

	if (devMode){showFramerate();}
}

// Displays framerate on screen
function showFramerate() {
	fr.html(floor(frameRate()));
}

function pause() {
	isRunning = false;
}

function play() {
	isRunning = true;
}

function togglePausePlay() {
	isRunning = !isRunning;
}

function keyPressed() {
	if (key === ' ') {
		togglePausePlay();
	}
}