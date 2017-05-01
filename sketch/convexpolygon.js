class ConvexPolygon {
	constructor(noOfPoints) {
		this.startingPos = Helper.randomPos;

		this.points = this.getPoints(noOfPoints);

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

	getPoints(numberOfPoints) {
		let points = [];
		
		if (devMode) {
			points = this.getTestTriangle();
		} else {
			// Get starting triangle
			for (let i=0; i<3; i++) {
				points.push(Helper.randomPos);
			}	
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

}