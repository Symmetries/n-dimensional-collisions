class Vector {
  constructor(...values) {
    if (values[0] instanceof Array) {
      this.values = values[0];
    } else {
      this.values = values;
    }
    this.dim = this.values.length;
  }

  get(i) {
    return this.values[i];
  }
  
  static add(v1, v2) {
    Vector.checkSizes(v1, v2);

    let result = [];
    for (let i = 0; i < v1.dim; i++) {
      result.push(v1.get(i) + v2.get(i));
    }
    return new Vector(result);
  }

  static sub(v1, v2) {
    return Vector.add(v1, v2.scale(-1));
  }

  scale(k) {
    let result = [];
    for (let i = 0; i < this.dim; i++) {
      result.push(this.get(i) * k);
    }
    return new Vector(result);
  }

  static dot(v1, v2) {
    Vector.checkSizes(v1, v2);

    let result = 0;
    for (let i = 0; i < v1.dim; i++) {
      result += v1.get(i) * v2.get(i);
    }
    return result;
  }

  get norm() {
    return Math.sqrt(
      Vector.dot(this, this));
  }
  
  static checkSizes(v1, v2) {
    if (v1.dim != v2.dim) {
      throw Error(
        "Vectors must have same dimension"
      );
    }
  }

  static dist(v1, v2) {
    return Vector.sub(v1, v2).norm
  }

  flip(i) {
    let result = [];
    for (let j = 0; j < this.dim; j++) {
      result.push(this.get(j) * 
        (i == j ? -1 : 1));
    }
    return new Vector(result);
  }
}
