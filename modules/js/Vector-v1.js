
export default class Vector {
    /**
     * 
     * @param {number} x 
     * @param {number} y 
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    /**
     * The length of the vector.
     */
    get magnitude() {
        return Math.hypot(this.x, this.y);
    }

    set magnitude(value) {
        const prevMagnitude = this.magnitude;
        this.x = this.x * (value / prevMagnitude);
        this.y = this.y * (value / prevMagnitude);
    }

    /**
     * Angle the vector forms with the x axis. Goes from -PI to PI
     */
    get angle() {
        return Math.atan2(this.y, this.x);
    }

    set angle(value) {
        const prevMagnitude = this.magnitude;
        this.x = Math.cos(value) * prevMagnitude;
        this.y = Math.sin(value) * prevMagnitude;
    }

    /**
     * 
     * @param {Vector} other 
     */
    sum(other) {
        this.x += other.x;
        this.y += other.y;
    }

    /**
     * 
     * @param {Vector} other 
     */
    sub(other) {
        this.x -= other.x;
        this.y -= other.y;
    }

    /**
     * 
     * @param {Vector} other 
     */
    dot(other) {
        this.x *= other.x;
        this.y *= other.y;
    }

    /**
     * 
     * @param {Vector} scalar 
     */
    scalarMul(scalar) {
        this.x *= scalar;
        this.y *= scalar;
    }

    /**
     * 
     * @param {number} magnitude Length of the vector.
     * @param {number} angle Angle in radians.
     */
    static fromMagnitudeAndAngle(magnitude, angle) {
        const x = Math.cos(angle) * magnitude;
        const y = Math.sin(angle) * magnitude;
        return new Vector(x, y);
    }

    static zero() {
        return new Vector(0, 0);
    }

    static identity() {
        return new Vector(1,1);
    }

    static xAxis() {
        return new Vector(1, 0);
    }

    static yAxis() {
        return new Vector(0, 1);
    }

    /**
     * 
     * @param {Vector} vector1 
     * @param {Vector} vector2 
     * @returns 
     */
    static sum(vector1, vector2) {
        return new Vector(vector1.x + vector2.x, vector1.y + vector2.y);
    }

    /**
     * 
     * @param {Vector} vector1 
     * @param {Vector} vector2 
     * @returns 
     */
    static sub(vector1, vector2) {
        return new Vector(vector1.x - vector2.x, vector1.y - vector2.y);
    }

    /**
     * 
     * @param {Vector} vector
     * @param {number} scalar
     * @returns 
     */
    static scalerMul(vector, scalar) {
        return new Vector(vector.x * scalar, vector.y * scalar);
    }

    /**
     * 
     * @param {Vector} vector1 
     * @param {Vector} vector2 
     * @returns 
     */
    static dot(vector1, vector2) {
        return new Vector(vector1.x * vector2.x, vector1.y * vector2.y);
    }
}