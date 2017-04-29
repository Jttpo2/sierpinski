class Shape {
	constructor() {
		this.startingPos = this.getRandomPos();
		this.currentPos = this.startingPos;
		this.numberOfCorners = round(random(3, 5));
		// this.corners = this.getCorners(this.numberOfCorners);
		this.corners = this.getBetterCorners(this.numberOfCorners);


		this.cornerSize = 10;
		this.pointSize = 1;

		// this.cornerColor = 200;
		this.cornerColor = color(200, 20, 200);
		this.pointColor = 140;

		this.calculationsPerFrame = 1000;
		this.pointsToDraw = [];

		// For optimization
		this.movementVector = null; 
		this.moveToCornerIndex = 0;

		this.displayCorners();
	}

	update() {
		for (let i=0; i<this.calculationsPerFrame; i++){
			this.move();
			this.pointsToDraw.push(this.currentPos.copy());
		}
	}

	display() {
		this.drawQueuedPoints();
		this.emptyPointQueue();
	}

	getRandomPos() {
		return createVector(
			random(width), 
			random(height));
	}

	getCorners(numberOfCorners) {
		let corners = [];
		if (isShapeRandom) {
			for (let i=0; i< numberOfCorners; i++) {
				corners.push(this.getRandomPos());
			}
		} else {
			corners.push(createVector(width/2, 0));
			corners.push(createVector(0, height));
			corners.push(createVector(width, height));
		}
		return corners;
	}

	displayCorners() {
		this.corners.forEach(function (corner) {
			this.displayPoint(corner, this.cornerSize, this.cornerColor);
		}, this);
	}

	displayPoint(pointPos, size, col) {
		if (col) {
			fill(col);
			stroke(col);
		} else {
			fill(this.pointColor); 
			stroke(this.pointColor);
		}
		strokeWeight(size);

		point(pointPos.x, pointPos.y);
	}

	move() {
		this.moveToCornerIndex = this.getMoveTowardsCornerIndex();
		this.moveTowards(this.corners[this.moveToCornerIndex]);
	}

	getMoveTowardsCornerIndex() {
		return floor(random(this.numberOfCorners));
	}

	moveTowards(pos) {
		// Move halfway towards position
		this.movementVector = p5.Vector.sub(pos, this.currentPos);
		this.movementVector.mult(0.5);
		this.currentPos.add(this.movementVector);
	}

	drawQueuedPoints() {
		this.pointsToDraw.forEach(function(point) {
			this.displayPoint(point, this.pointSize);
		}, this);
	}

	emptyPointQueue() {
		this.pointsToDraw = [];
	}

	// from: http://jsfiddle.net/PerroAZUL/zdaY8/1/
	isWhithinTriangle2(p, p0, p1, p2) {
		let A = 1/2 * (-p1.y * p2.x + p0.y * (-p1.x + p2.x) + p0.x * (p1.y - p2.y) + p1.x * p2.y);
		let sign = A < 0 ? -1 : 1;
		let s = (p0.y * p2.x - p0.x * p2.y + (p2.y - p0.y) * p.x + (p0.x - p2.x) * p.y) * sign;
		let t = (p0.x * p1.y - p0.y * p1.x + (p0.y - p1.y) * p.x + (p1.x - p0.x) * p.y) * sign;

		return s > 0 && t > 0 && (s + t) < 2 * A * sign;
	}

	getBetterCorners(numberOfCorners) {
		let corners = [];
		// Get starting triangle
		for (let i=0; i< 3; i++) {
			corners.push(this.getRandomPos());
		}

		for (let i=2; i<numberOfCorners; i++) {
			let pos = this.getRandomPos();
			for (let j=2; j<i; j++) {
				while (this.isWhithinTriangle2(pos, corners[i-2], corners[i-1], corners[i])) {
					pos = this.getRandomPos();
				}
			} 
			corners.push(pos);
		}

		// corners = this.getTestTriangle();

		// let fourthCorner = this.getRandomPos();
		// while (this.isWhithinTriangle2(
		// 	fourthCorner, 
		// 	corners[0],
		// 	corners[1],
		// 	corners[2]) 
		// 	) {

			// this.displayPoint(fourthCorner, 20, color(20, 20, 200));
		// fourthCorner = this.getRandomPos();
	// }

		// this.displayPoint(fourthCorner, 20, color(200, 20, 200));

		// corners.push(fourthCorner);
		this.numberOfCorners = corners.length;
		return corners;
	}

	getTestTriangle() {
		let corners = [];
		corners.push(createVector(width/2, 0));
		corners.push(createVector(0, height));
		corners.push(createVector(width, height));
		return corners;
	}
}