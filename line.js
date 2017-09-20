define(
	[
		'vector/vector'
	],

	function (Vector) {
		// 2D Lines

		const equalThreshold = 0.0000000001; //1e-10

		var Line = function (origin, direction) {
			if (!(origin instanceof Vector) || !(direction instanceof Vector)) {
				console.error('Line requires an origin Vector and a direction Vector');
			}

			if (!direction.mod()) {
				console.error('Line requires a direction Vector with non-zero magnitude');
			}

			this.origin = origin;
			this.direction = direction.normalise();
		};

		Line.prototype.isParallel = function (otherLine) {
			if (!(otherLine instanceof Line)) {
				console.error('Line.prototype.isParallel requires another Line');
				return;
			}

			var thisAngle = this.direction.getAngle();
			var otherAngle = otherLine.direction.getAngle();

			// If greater than pi, subtract pi until between pi and 0;
			thisAngle = (thisAngle + Math.PI*2) % Math.PI;
			otherAngle = (otherAngle + Math.PI*2) % Math.PI;

			return thisAngle === otherAngle;
		};

		Line.prototype.getIntersection = function (otherLine) {
			// https://stackoverflow.com/questions/563198/how-do-you-detect-where-two-line-segments-intersect

			if (!(otherLine instanceof Line)) {
				console.error('Line.prototype.getIntersection requires another Line');
				return;
			}

			if (this.isParallel(otherLine)) {
				console.warn('Line.prototype.getIntersection was passed parallel lines');
			}

			var a = (otherLine.origin.subtract(this.origin)).cross(otherLine.direction) / (this.direction.cross(otherLine.direction));

			var intersectionX = this.origin.x + a * this.direction.x;
			var intersectionY = this.origin.y + a * this.direction.y;

			return new Vector(intersectionX, intersectionY);
		};

		Line.prototype.isOnLine = function (point) {
			// Return the closest point on the line to the passed point
			if (!(point instanceof Vector)) {
				console.error('Line.prototype.isOnLine requires a Vector');
			}

			point = point.subtract(this.origin);

			var dx = point.x / this.direction.x,
				dy = point.y / this.direction.y;

			if (this.direction.x === 0) {
				if (point.x !== 0) {
					return false;
				} else {
					dx = dy;
				}
			}
			if (this.direction.y === 0) {
				if (point.y !== 0) {
					return false;
				} else {
					dy = dx;
				}
			}

			// Allow small amount of wiggle room for floating point operations
			return Math.abs(dx - dy) < equalThreshold;
		};

		Line.prototype.getClosestPoint = function (point) {
			// Return the closest point on the line to the passed point
			if (!(point instanceof Vector)) {
				console.error('Line.prototype.getClosestPoint requires a Vector');
			}

			var perpDirection = this.direction.rotate(Math.PI/2);
			var perp = new Line(point, perpDirection);

			return this.getIntersection(perp);
		};

		Line.prototype.getDistanceToLine = function (point) {
			if (!(point instanceof Vector)) {
				console.error('Line.prototype.getDistanceToLine requires a Vector');
			}

			var intersection = this.getClosestPoint(point);
			var gap = intersection.subtract(point);

			return gap.mod();
		};

		return Line;
	}
);