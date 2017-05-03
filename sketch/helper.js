class Helper {
	static get randomPosition() {
		return createVector(
			random(width), 
			random(height));
	}

	static isAnyWithinTriangle(points, p1, p2, p3) {
		let isAnyWithin = false;
		points.forEach(function(point) {
			if (this.isWithinTriangle(point, p1, p2, p3)) {
				isAnyWithin = true;
			}
		}, this);
		return isAnyWithin;
	}

	static isWithinTriangle(p, p1, p2, p3) {
		const DELTA_MAX = 0.00001;

		let A = this.calcAreaOfTriangle(p1, p2, p3);
		let A1 = this.calcAreaOfTriangle(p, p1, p2);
		let A2 = this.calcAreaOfTriangle(p, p2, p3);
		let A3 = this.calcAreaOfTriangle(p, p1, p3);

		A = abs(A);
		A1 = abs(A1);
		A2 = abs(A2);
		A3 = abs(A3);
		
		let isWithin = abs(A - (A1 + A2 + A3)) < DELTA_MAX ;

		if (p === p1 || p === p2 || p === p3) {
			isWithin = false;
		}

		if (devMode) {
			let others = A1 + A2 + A3;
			console.log(isWithin + " " + 'A: ' + A + " 1: " + A1 + " 2: " + A2 + " 3: " + A3 + " Others: " + others);
		}

		return isWithin;
	}

	static isWithinAABoundingBox(pos, polygon) {
		let xMin=width, xMax=0, yMin=height, yMax=0;
		polygon.forEach(function(point) {
			xMin = min(xMin, point.x);
			xMax = max(xMax, point.x);
			yMin = min(yMin, point.y);
			yMax = min(yMax, point.y);
		});

		return !(pos.x < xMin || pos.x > xMax || pos.y < yMin || pos.y > yMax);
	}

	static calcAreaOfTriangle(p1, p2, p3) {		
		return (p1.x*(p2.y - p3.y) + p2.x*(p3.y-p1.y) + p3.x*(p1.y - p2.y)) * 1/2;
	}

	// From: http://stackoverflow.com/questions/14066933/direct-way-of-computing-clockwise-angle-between-2-vectors
	// Clockwise angle between two vectors
	static calcClockwiseAngleBetween(v1, v2) {
		let dot = v1.x*v2.x + v1.y*v2.y;	// dot product between [x1, y1] and [x2, y2]
		let det = v1.x*v2.y - v1.y*v2.x;    // determinant
		let angle = atan2(det, dot);		// atan2(y, x) or atan2(sin, cos)
		if (angle < 0) {
			angle += TWO_PI;
		}
		return angle;
	}
}