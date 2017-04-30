class Shape {
	constructor() {
		this.startingPos = this.getRandomPos();
		this.currentPos = this.startingPos;
		// this.numberOfCorners = round(random(3, 5));
		this.numberOfCorners = 5;
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

		// this.displayCorners();
		this.labelCorners();
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
		this.corners.forEach(function (corner, index) {
			this.displayPoint(corner, this.cornerSize, this.cornerColor, index.toString());
		}, this);
	}

	displayPoint(pointPos, size, col, textString) {
		if (col) {
			fill(col);
			stroke(col);
		} else {
			fill(this.pointColor); 
			stroke(this.pointColor);
		}

		strokeWeight(size);
		point(pointPos.x, pointPos.y);

		if (textString) {
			this.labelPoint(pointPos, textString);
		}
	}

	labelCorners() {
		this.corners.forEach(function (corner, index) {
			this.labelPoint(corner, index.toString());
		}, this);
	}

	labelPoint(pointPos, textString) {
			fill(0);
			strokeWeight(0);
			text(textString, pointPos.x + 10, pointPos.y + 10);	
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
	isWithinTriangle2(p, p0, p1, p2) {
		let A = 1/2 * (-p1.y * p2.x + p0.y * (-p1.x + p2.x) + p0.x * (p1.y - p2.y) + p1.x * p2.y);
		let sign = A < 0 ? -1 : 1;
		let s = (p0.y * p2.x - p0.x * p2.y + (p2.y - p0.y) * p.x + (p0.x - p2.x) * p.y) * sign;
		let t = (p0.x * p1.y - p0.y * p1.x + (p0.y - p1.y) * p.x + (p1.x - p0.x) * p.y) * sign;

		return s > 0 && t > 0 && (s + t) < 2 * A * sign;
	}

	getBetterCorners(numberOfCorners) {
		let corners = [];
		// Get starting triangle
		for (let i=0; i<3; i++) {
			corners.push(this.getRandomPos());
		}

		for (let i=3; i<numberOfCorners; i++) {
			let outsidePos = this.getPosOutsideShape(corners);
			
			let closestCorner = this.getClosestCorner(outsidePos, corners);
			let widestAngleCorner = this.getWidestAngledCorner(outsidePos, closestCorner, corners);
			let widestFromWidest = this.getWidestAngledCorner(outsidePos, widestAngleCorner, corners);

			this.displayPoint(closestCorner, 10, color(100, 50, 30), '   close ' + i);
			this.displayPoint(widestAngleCorner, 10, color(200, 50, 30), '   wide ' + i);
			this.displayPoint(widestFromWidest, 10, color(200, 50, 30), '                    other ' + i);

			// Check whether a corner in the new position would shade the closest point in the shape
			while (this.isWithinTriangle2(closestCorner, outsidePos, widestAngleCorner, widestFromWidest)) {
				// Then get a new point and calc again
				outsidePos = this.getPosOutsideShape(corners);
				closestCorner = this.getClosestCorner(outsidePos, corners);
				widestAngleCorner = this.getWidestAngledCorner(outsidePos, closestCorner, corners);
				widestFromWidest = this.getWidestAngledCorner(outsidePos, widestAngleCorner, corners);
			}
			corners.push(outsidePos);
		}

		this.numberOfCorners = corners.length;
		return corners;
	}

	getPosOutsideShape(shapeCorners) {
		let pos = this.getRandomPos();
		if (shapeCorners.length < 3) {
			return;
		}

		for (let i=2; i<shapeCorners.length; i++) {
			for (let j=2; j<i; j++) {
				while (this.isWithinTriangle2(pos, shapeCorners[j-2], shapeCorners[j-1], shapeCorners[j])) {
					pos = this.getRandomPos();
				}
			} 
			
		}
		return pos;
	}

	getClosestCorner(pos, corners) {
		let closest = corners[0];
		let closestDistance = p5.Vector.dist(pos, closest);
		corners.forEach(function(corner) {
			let d = p5.Vector.dist(pos, corner);
			if (d < closestDistance) {
				closest = corner;
				closestDistance = d;
			} 
		});
		return closest;
	}

	getWidestAngledCorner(point, closestCornerPos, corners) {
		let toClosestCorner = p5.Vector.sub(closestCornerPos, point);
		
		let widestAngleCorner = corners[0];
		let toWidestAngleCorner = p5.Vector.sub(widestAngleCorner, point);
		let widestAngle = 0;

		corners.forEach(function(corner) {
			let toCorner = p5.Vector.sub(corner, point);
			let angle = p5.Vector.angleBetween(toCorner, toClosestCorner);
			if (angle > widestAngle) {
				widestAngleCorner = corner;
				widestAngle = angle;
			}
		}, this);

		return widestAngleCorner;
	}

	// isHidingAnyPoints(cornerToTest, closest, point1, point2) {

	// }

	getTestTriangle() {
		let corners = [];
		corners.push(createVector(width/2, 0));
		corners.push(createVector(0, height));
		corners.push(createVector(width, height));
		return corners;
	}
}