class Ray {
	constructor(startPos, direction) {
		this.startPos = startPos;
		this.direction = direction.copy().normalize();

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

		return u;
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

		return p5.add(as, p5.mult(ad, u)); 
	}

	display() {
		let endPos = p5.Vector.add(this.startPos, this.offset);
		strokeWeight(1);
		stroke(this.color);
		line(this.startPos.x, this.startPos.y, endPos.x, endPos.y);
	}
}