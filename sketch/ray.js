class Ray {
	constructor(start, dir) {
		this.startPos = start.copy();
		this.direction = dir.copy();
		this.direction.normalize();

		this.color = color(100, 20, 223);
	}

	isIntersecting(thatRay) {
		let as = this.startPos;
		let ad = this.direction;
		let bs = thatRay.startPos;
		let bd = thatRay.direction;
		// let u = ((bs.y - as.y) * bd.x - (bs.x - as.x) * bd.y) / (bd.x * ad.y - bd.y * ad.x);
		// let v = ((bs.y - as.y) * ad.x - (bs.x - as.x) * ad.y) / (bd.x * ad.y - bd.y * ad.x);

		let dx = bs.x - as.x;
		let dy = bs.y - as.y;
		let det = bd.x * ad.y - bd.y * ad.x;
		let u = (dy * bd.x - dx * bd.y) / det;
		let v = (dy * ad.x - dx * ad.y) / det;

		return u>=0 && v>=0;
	}

	getDistanceToIntersectionWith(thatRay) {
		let as = this.startPos;
		let ad = this.direction;
		let bs = thatRay.startPos;
		let bd = thatRay.direction;

		let dx = bs.x - as.x;
		let dy = bs.y - as.y;
		let det = bd.x * ad.y - bd.y * ad.x;
		let u = (dy * bd.x - dx * bd.y) / det;
		let v = (dy * ad.x - dx * ad.y) / det;

		// Return -1 if rays do not intersect
		return max(-1, u);
	}

	getIntersectionPoint(thatRay) {
		let as = this.startPos;
		let ad = this.direction;
		let bs = thatRay.startPos;
		let bd = thatRay.direction;
		
		let dx = bs.x - as.x;
		let dy = bs.y - as.y;
		let det = bd.x * ad.y - bd.y * ad.x;
		let u = (dy * bd.x - dx * bd.y) / det;
		let v = (dy * ad.x - dx * ad.y) / det;

		return p5.Vector.add(as, p5.Vector.mult(ad, u)); 
	}

	display() {
		let length = max(width, height);
		let endPos = p5.Vector.add(this.startPos, this.direction.copy().mult(length));
		strokeWeight(1);
		stroke(this.color);
		line(this.startPos.x, this.startPos.y, endPos.x, endPos.y);
	}
}