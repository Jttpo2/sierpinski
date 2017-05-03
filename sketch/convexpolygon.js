class ConvexPolygon {
	constructor(noOfPoints) {
		this.startingPos = Helper.randomPos;

		// this.points = this.getPoints(noOfPoints);
		this.points = this.makePolygon(noOfPoints);

		this.pointSize = 10;
		this.pointColor = color(100, 100, 100);

		this.showOutline = true;
		this.showPoints = true;

		if (devMode) {
			this.labelPoints();
		}
	}

	// addPoint(point) {
	// 	this.points.push(point);
	// }

	get allPoints() {
		return this.points;
	}

	display() {
		if (this.showOutline) {
			this.displayOutline();
		}
		if (this.showPoints) {
			this.displayPoints();
		}
	}

	displayOutline() {
		// TODO: implement
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

	isWithin(point, polygon) {
		if (!Helper.isWithinAABoundingBox(point, polygon)) {
			return false;
		}

		for (let j=2; j<polygon.length; j++) {

			// if (devMode) {
			// 	this.displayTriangle(p, p1, p2, color(23, 100, 0));
			// 	this.displayTriangle(p, p2, p3, color(23, 100, 0));
			// 	this.displayTriangle(p, p1, p3, color(23, 100, 0));
			// 	this.displayTriangle(p1, p2, p3, color(23, 200, 0));

			// 	this.displayPoint(p, 10, color(250, 20, 100));
			// }
			
			if (Helper.isWithinTriangle3(point, polygon[j-2], polygon[j-1], polygon[j])) {
				return true;	
			}
		} 
		return false;
	}

	getPointsTest() {
		let points = [];

		points = this.getTestTriangle();

		let outsidePos;
		outsidePos = this.getTestPointDownLeft();

		while (this.isShadingAnyPoint(outsidePos, points)) {
			// Then get a new point and calc again

			outsidePos = this.getPosOutsideShape(points);
		}
		points.push(outsidePos);

		outsidePos = this.getTestShadingPointDownLeft();
		while (this.isShadingAnyPoint(outsidePos, points)) {
			// Then get a new point and calc again
			console.log('should be new point');
			outsidePos = this.getPosOutsideShape(points);
		}

		points.push(outsidePos);

		this.numberOfPoints = points.length;
		return points;
	}

	getRandomTriangle() {
		let triangle = [];
		for (let i=0; i<3; i++) {
			triangle.push(Helper.randomPosition);
		}	
		return triangle;
	}

	getPoints(numberOfPoints) {
		let points = [];
		
		if (devMode) {
			points = this.getTestTriangle();
		} else {
			// Get starting triangle
			points = this.getRandomTriangle();
		}

		let outsidePos;

		for (let i=3; i<numberOfPoints; i++) {
			outsidePos = this.getPosOutsideShape(points);	


			// Check whether a point in the new position would shade the closest point in the shape
			while (this.isShadingAnyPoint(outsidePos, points)) {
				// Then get a new point and calc again
				outsidePos = this.getPosOutsideShape(points);
			}
			points.push(outsidePos);
		}

		this.numberOfPoints = points.length;
		return points;
	}

	isShadingAnyPoint(point, polygon) {
		let closestPoint = this.getClosestPoint(point, polygon);
		let widestAnglePoint = this.getWidestAngledPoint(point, closestPoint, polygon);
		let widestFromWidest = this.getWidestAngledPoint(point, widestAnglePoint, polygon);


		if (devMode) {
			this.displayPoint(closestPoint, 10, color(100, 50, 30), '   close ');
			this.displayPoint(widestAnglePoint, 10, color(200, 50, 30), '   wide ');
			this.displayPoint(widestFromWidest, 10, color(200, 50, 30), '            other ');

			let col = color(this.colorI, 100, 250);
			// this.displayTriangle(point, widestAnglePoint, widestFromWidest, col);
			this.colorI += 1;
		}

		let isShading;
		
		if (closestPoint === widestAnglePoint || closestPoint === widestFromWidest) {
			if (devMode) {
				console.log('Any Within triangle?');
			}
			// If we end up here we need to check all points within [point, widest, widestFromWidest]
			isShading = Helper.isAnyWithinTriangle(polygon, point, widestAnglePoint, widestFromWidest);
		} else {
			if (devMode) {
				console.log('Within single triangle?');
			}
			isShading = Helper.isWithinTriangle(closestPoint, point, widestAnglePoint, widestFromWidest);
		} 

		if(devMode && isShading) {
			this.displayPoint(closestPoint, 10, color(100, 200, 30), '            shaded');
		}

		return isShading;
	}

	displayTriangle(p1, p2, p3, col) {
		noFill();
		strokeWeight(1);
		stroke(col);
		triangle(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
	}

	displayClosestPointTo(point, polygon, textString) {
		let closestPoint = this.getClosestPoint(point, polygon);
		this.displayPoint(closestPoint, 10, color(500, 50, 30), textString);
	}

	getPosOutsideShape(shapePoints) {
		let pos = Helper.randomPosition;
		while(this.isWithin(pos, shapePoints)) {
			if (devMode) {
				this.displayPoint(pos, 10, color(500, 50, 30), '   inside ');
			}
			pos = Helper.randomPosition;
		}
		return pos;
	}

	getClosestPoint(pos, points) {
		let closest = points[0];
		let closestDistance = p5.Vector.dist(pos, closest);
		points.forEach(function(point) {
			let d = p5.Vector.dist(pos, point);
			if (d < closestDistance) {
				closest = point;
				closestDistance = d;
			} 
		});
		return closest;
	}

	getWidestAngledPoint(point, closestPointPos, points) {
		let toClosestPoint = p5.Vector.sub(closestPointPos, point);

		let widestAnglePoint = points[0];
		let toWidestAnglePoint = p5.Vector.sub(widestAnglePoint, point);
		let widestAngle = 0;

		points.forEach(function(point) {
			let toPoint = p5.Vector.sub(point, point);
			let angle = p5.Vector.angleBetween(toPoint, toClosestPoint);
			if (angle > widestAngle) {
				widestAnglePoint = point;
				widestAngle = angle;
			}
		}, this);

		return widestAnglePoint;
	}

	getTestTriangle() {
		let points = [];
		points.push(createVector(width/2, height/3));
		points.push(createVector(width/3, height*2/3));
		points.push(createVector(width*2/3, height*2/3));
		return points;
	}

	getTestPointWithinTestTriangle() {
		return createVector(width/2, height/2);
	}

	getTestShadingPointAbove() {
		return createVector(width/2, height*1/4);
	}

	getTestPointDownLeft() {
		return createVector(width*1/4, height*9/10);	
	}

	getTestShadingPointDownLeft() {
		return createVector(width*1/8, height*7/10);	
	}

	makePolygon(noOfPoints) {
		let points = this.getRandomTriangle();
		// let points = this.getTestTriangle();
		for(let i=3; i<noOfPoints;i++) {
			points.push(this.calcNewPointPosition(points));
		}
		return points;
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
		// strokeWeight(20);
		// point(pos.x, pos.y);
	}

	getStart(polygon) {
		return polygon[0];
	}

	getLast(polygon) {
		return polygon[polygon.length-1];
	}

	getSecondLast(polygon) {
		return polygon[polygon.length-2];
	}

	calcNewPointPosition(polygon) {
		// Get base vector from two last points of polygon
		let start = this.getStart(polygon);
		let last = this.getLast(polygon);
		let secondLast = this.getSecondLast(polygon);

		let baseVector = p5.Vector.sub(
			last, 
			secondLast);

		if (devMode) {
			// Draw first limit
			this.drawLine(secondLast, last, color(50, 190, 100));

			// Draw second limit
			this.drawLine(this.getStart(polygon), this.getLast(polygon), color(83, 100, 200));
	
			// this.drawVector(baseVector, last, color(200, 100, 200));
			// let direction = new Ray(last, baseVector);
			// direction.display();
			// this.drawLine(last, p5.Vector.add(last, baseVector.copy().mult(10)), color(200, 100, 200));
		}

		// Get max angle vector from last and first points of polygon
		let maxAngleVector = p5.Vector.sub(
			last, 
			start).normalize();

		// Angle between the two?
		let clockwiseAngleBetween = Helper.calcClockwiseAngleBetween(baseVector, maxAngleVector);
		console.log(degrees(clockwiseAngleBetween));
		
		clockwiseAngleBetween += PI;

		console.log('after: ' + degrees(clockwiseAngleBetween));
		// New point vector is the base vector rotated to somehere in that interval
		let newPointVector = baseVector.copy();
		newPointVector.normalize();
		let rotation;
		rotation = random(clockwiseAngleBetween, TWO_PI);

		// if (clockwiseAngleBetween > PI) {
		// 	rotation = random(PI, clockwiseAngleBetween);
		// } else if (clockwiseAngleBetween >= 0) {
		// 	rotation = random(0, clockwiseAngleBetween);
		// }  else if (clockwiseAngleBetween < -PI) {
		// 	rotation = random(-PI, clockwiseAngleBetween);
		// } else if (clockwiseAngleBetween < 0) {
		// 	rotation = random(0, clockwiseAngleBetween);
		// } else {
		// 	console.log('angle outside');
		// }

		console.log('random rotation: ' + degrees(rotation));
		newPointVector.rotate(rotation); 

		// this.drawVector(newPointVector, last, color(12, 200, 15));

		let newVectorRay = new Ray(last, newPointVector);
		newVectorRay.display();
		// newPointVector.mult(-1); // Flip


		// Limit direction: the ray extending from the first two points of the plygon
		let limitDirection = p5.Vector.sub(
			start, 
			polygon[1]).normalize();
		limitDirection.mult(max(width, length));
		let limitRay = new Ray(start, limitDirection);
		limitRay.display();
		// How long max?
		let maxLength = newVectorRay.getDistanceToIntersectionWith(limitRay);
		console.log('maxLength: ' + maxLength);
		if (maxLength < 0) {
			// Rays do not intersect = put max length at edge of canvas
			// TODO: max length at edge of canvas
			maxLength = min(width, height);
		}
		// Cut new point vector to random length
		let randomLength = random(0, maxLength);
		newPointVector.mult(randomLength);

		// this.drawVector(newPointVector, last, color(200, 15, 23), true);

		// New point is at
		let newPoint = p5.Vector.add(last, newPointVector);

		return newPoint;
	}
}