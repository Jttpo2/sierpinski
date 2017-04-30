class Shape {
	constructor() {
		this.startingPos = this.getRandomPos();
		this.currentPos = this.startingPos;
		// this.numberOfCorners = round(random(3, 7));
		if (devMode) {
			this.numberOfCorners = 5;
		}
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

		if (devMode) {
			// this.displayCorners();
			this.labelCorners();
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

	isWithinTriangle3(p, p1, p2, p3) {
		
		const DELTA_MAX = 0.00001;

		if (devMode) {
			this.displayTriangle(p, p1, p2, color(23, 100, 0));
			this.displayTriangle(p, p2, p3, color(23, 100, 0));
			this.displayTriangle(p, p1, p3, color(23, 100, 0));
			this.displayTriangle(p1, p2, p3, color(23, 200, 0));

			this.displayPoint(p, 10, color(250, 20, 100));
		}

		let A = this.calcAreaOfTriangle(p1, p2, p3);
		let A1 = this.calcAreaOfTriangle(p, p1, p2);
		let A2 = this.calcAreaOfTriangle(p, p2, p3);
		let A3 = this.calcAreaOfTriangle(p, p1, p3);

		A = abs(A);
		A1 = abs(A1);
		A2 = abs(A2);
		A3 = abs(A3);
		
		if (devMode) {
			let others = A1 + A2 + A3;
			console.log('A: ' + A + " 1: " + A1 + " 2: " + A2 + " 3: " + A3 + " Others: " + others );
		}

		return abs(A - (A1 + A2 + A3)) < DELTA_MAX ;
	}

	calcAreaOfTriangle(p1, p2, p3) {		
		return (p1.x*(p2.y - p3.y) + p2.x*(p3.y-p1.y) + p3.x*(p1.y - p2.y)) * 1/2;
	}

	isWithinPolygon(point, polygon) {
		if (!this.isWithinAABoundingBox(point, polygon)) {
			return false;
		}

		for (let j=2; j<polygon.length; j++) {
			if (this.isWithinTriangle3(point, polygon[j-2], polygon[j-1], polygon[j])) {
				return true;
				
			}
		} 
		return false;

	}

	isWithinAABoundingBox(pos, polygon) {
		let xMin=width, xMax=0, yMin=height, yMax=0;
		polygon.forEach(function(point) {
			xMin = min(xMin, point.x);
			xMax = max(xMax, point.x);
			yMin = min(yMin, point.y);
			yMax = min(yMax, point.y);
		});

		return !(pos.x < xMin || pos.x > xMax || pos.y < yMin || pos.y > yMax);
	}

	getBetterCorners(numberOfCorners) {
		let corners = [];
		
		if (devMode) {
			corners = this.getTestTriangle();
		} else {
			// Get starting triangle
			for (let i=0; i<3; i++) {
				corners.push(this.getRandomPos());
			}	
		}

		let outsidePos;
		for (let i=3; i<numberOfCorners; i++) {
			// if (devMode) {
			// 	outsidePos = this.getTestShadingPoint();	

			// } else {
				outsidePos = this.getPosOutsideShape(corners);	
			// }

			// Check whether a corner in the new position would shade the closest point in the shape
			while (this.isShadingAnyCorner(outsidePos, corners)) {
				// Then get a new point and calc again
				
				outsidePos = this.getPosOutsideShape(corners);
			}
			corners.push(outsidePos);
		}

		this.numberOfCorners = corners.length;
		return corners;
	}

	isShadingAnyCorner(point, polygon) {
		let closestCorner = this.getClosestCorner(point, polygon);
		let widestAngleCorner = this.getWidestAngledCorner(point, closestCorner, polygon);
		let widestFromWidest = this.getWidestAngledCorner(point, widestAngleCorner, polygon);

		if (closestCorner === widestAngleCorner || closestCorner === widestFromWidest) {
			return false;
		} 

		if (devMode) {
			this.displayPoint(closestCorner, 10, color(100, 50, 30), '   close ');
			this.displayPoint(widestAngleCorner, 10, color(200, 50, 30), '   wide ');
			this.displayPoint(widestFromWidest, 10, color(200, 50, 30), '            other ');

			let col = color(this.colorI, 100, 250);
			// this.displayTriangle(point, widestAngleCorner, widestFromWidest, col);
			this.colorI += 1;
		}
		
		let isShading = this.isWithinTriangle3(closestCorner, point, widestAngleCorner, widestFromWidest);

		if(devMode && isShading) {
			this.displayPoint(closestCorner, 10, color(100, 200, 30), '            shaded');
		}

		return isShading;
	}

	displayTriangle(p1, p2, p3, col) {
		noFill();
		strokeWeight(1);
		stroke(col);
		triangle(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
	}

	displayClosestCornerTo(point, polygon, textString) {
		let closestCorner = this.getClosestCorner(point, polygon);
		this.displayPoint(closestCorner, 10, color(500, 50, 30), textString);
	}

	getPosOutsideShape(shapeCorners) {
		let pos = this.getRandomPos();
		while(this.isWithinPolygon(pos, shapeCorners)) {
			if (devMode) {
				this.displayPoint(pos, 10, color(500, 50, 30), '   inside ');
			}
			pos = this.getRandomPos();
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
		corners.push(createVector(width/2, height/3));
		corners.push(createVector(width/3, height*2/3));
		corners.push(createVector(width*2/3, height*2/3));
		return corners;
	}

	getTestPointWithinTestTriangle() {
		return createVector(width/2, height/2);
	}

	getTestShadingPoint() {
		return createVector(width/2, height*1/4);
	}

}