let shape;
let isShapeRandom = true;

// Framerate html holder
let fr; 

function setup() {
	let canvas = createCanvas(
		window.innerWidth*(9/10),
		window.innerHeight*(9/10)
		);

	background(220);

	shape = new Shape();

	// frameRate(80);

	// Framerate holder, <p> element
	fr = createP('');

}

function draw() {
	// background(200);
	// fill(100); 
	// rect(width/2, height/2, 50, 50);

	shape.update();
	shape.display();

	showFramerate();
}

// Displays framerate on screen
function showFramerate() {
	fr.html(floor(frameRate()));
}