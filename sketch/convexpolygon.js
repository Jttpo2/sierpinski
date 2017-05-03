class ConvexPolygon {
	constructor(noOfPoints) {
		this.startingPos = Helper.randomPos;

		this.points = null;
		this.makeRandomPolygon(noOfPoints);

		this.pointSize = 10;
		this.pointColor = color(100, 100, 100);

		this.showPoints = false;

		if (devMode) {this.labelPoints();}
	}

	get allPoints() {
		return this.points;
	}

	display() {
		if (this.showPoints) {
			this.displayPoints();
		}
	}

	displayPoints() {
		this.points.forEach(function (point, index) {
			this.displayPoint(point, this.pointSize, this.pointColor, index.toString());
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

	labelPoints() {
		this.points.forEach(function (point, index) {
			this.labelPoint(point, index.toString());
		}, this);
	}

	labelPoint(point, textString) {
		fill(0);
		strokeWeight(0);
		text(textString, point.x + 10, point.y + 10);	
	}

	getRandomTriangle() {
		let triangle = [];
		for (let i=0; i<3; i++) {
			triangle.push(Helper.randomPosition);
		}	
		return triangle;
	}

	displayTriangle(p1, p2, p3, col) {
		noFill();
		strokeWeight(1);
		stroke(col);
		triangle(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
	}

	getTestTriangle() {
		let points = [];
		points.push(createVector(width/2, height/3));
		points.push(createVector(width/3, height*2/3));
		points.push(createVector(width*2/3, height*2/3));
		return points;
	}

	makeRandomPolygon(noOfPoints) {
		this.points = this.getRandomTriangle();
		// if (devMode) {this.points = this.getTestTriangle();}
		for(let i=3; i<noOfPoints;i++) {
			this.points.push(this.calcNewPointPosition());
		}
	}

	drawLine(start, end, col, showStart) {
		strokeWeight(1);
		if (col) {
			stroke(col);
		} else {
			stroke(23, 45, 80);
		}
		line(start.x, start.y, end.x, end.y);

		if (showStart) {
			strokeWeight(20);
			if (col) {
				fill(col);
			} else {
				fill(23, 45, 80);
			}
			point(start.x, start.y);
		}
	}

	drawVector(vector, pos, col, showStart) {
		vector = vector.copy();
		this.drawLine(pos, p5.Vector.add(pos, vector.mult(1)), col, showStart );
	}

	get first() {
		return this.points[0];
	}

	get second() {
		return this.points[1];
	}

	get last() {
		return this.points[this.points.length-1];
	}

	get secondLast() {
		return this.points[this.points.length-2];
	}

	calcNewPointPosition() {
		let first = this.first;
		let second = this.second;
		let last = this.last;
		let secondLast = this.secondLast;

		// Get base vector from two last points of polygon
		let baseVector = p5.Vector.sub(
			last, 
			secondLast);

		if (devMode) {this.drawHelplines(baseVector);}

		// Get max angle vector from last and first points of polygon
		let maxAngleVector = p5.Vector.sub(
			last, 
			first).normalize();

		// Angle between the two?
		let clockwiseAngleBetween = Helper.calcClockwiseAngleBetween(baseVector, maxAngleVector);
		// Complimentary angle
		clockwiseAngleBetween += PI;

		// New point vector is the base vector rotated to somehere in that interval
		let newPointVector = baseVector.copy();
		newPointVector.normalize();
		let rotation = random(clockwiseAngleBetween, TWO_PI);
		newPointVector.rotate(rotation); 

		if (devMode) {this.drawVector(newPointVector, last, color(12, 200, 15));}

		// Max length of new point vector
		let maxLength = this.getMaxLength(newPointVector);

		// Cut new point vector to random length within set limits
		let randomLength = random(0, maxLength);
		newPointVector.mult(randomLength);

		if (devMode) {this.drawVector(newPointVector, last, color(200, 15, 23));}

		// New point is at
		let newPoint = p5.Vector.add(
			last, 
			newPointVector);

		return newPoint;
	}

	drawHelplines(baseVector) {
		// Draw first limit
		this.drawLine(
			this.secondLast, 
			this.last, 
			color(50, 190, 100));

		// Draw second limit
		this.drawLine(
			this.first, 
			this.last, 
			color(83, 100, 200));

		this.drawVector(
			baseVector, 
			this.last, 
			color(200, 100, 200));
		let direction = new Ray(this.last, baseVector);
		direction.display();
		this.drawLine(
			this.last, 
			p5.Vector.add(
				this.last, 
				baseVector.copy().mult(10)), 
			color(200, 100, 200));
	}

	getMaxLength(newPointVector) {
		// For finding max length of new point vector through raycasting 
		let newVectorRay = new Ray(this.last, newPointVector);
		if (devMode) {newVectorRay.display();}

		// Limit direction: the ray extending from the first two points of the plygon
		let limitDirection = p5.Vector.sub(
			this.first, 
			this.second).normalize();
		limitDirection.mult(max(width, length));
		let limitRay = new Ray(this.first, limitDirection);
		if (devMode) {limitRay.display();}
		// How long max?
		let maxLength = newVectorRay.getDistanceToIntersectionWith(limitRay);
		if (maxLength < 0) {
			// Rays do not intersect = put max length at edge of canvas
			// TODO: max length at edge of canvas
			maxLength = min(width, height);
		}
		return maxLength;
	}
}