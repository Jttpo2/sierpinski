class Shape {
	constructor() {
		// this.startingPos = this.getRandomPos();
		this.currentPos = Helper.randomPosition;
		this.numberOfCorners = round(random(3, 7));
		if (devMode) {
			this.numberOfCorners = 4;
		}
		this.polygon = new ConvexPolygon(this.numberOfCorners);

		this.pointSize = 1;
		this.pointColor = 140;

		this.calculationsPerFrame = calculationsPerFrame;
		this.pointsToDraw = [];

		// For optimization
		this.movementVector = null; 
		this.moveToCornerIndex = 0;

		if (devMode) {
			this.colorI = 0;
		}
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

		this.polygon.display();
	}

	move() {
		this.moveToCornerIndex = this.getMoveTowardsCornerIndex();
		this.moveTowards(this.polygon.allPoints[this.moveToCornerIndex]);
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

	emptyPointQueue() {
		this.pointsToDraw = [];
	}
}