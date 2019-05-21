class Hyperball {
  constructor(radius, pos, vel, acc, mass, dim) {
    this.radius = radius;
    this.pos = pos;
    this.vel = vel;
    this.acc = acc;
    this.mass = mass;
    this.dim = dim;
  }

  update(box, dt) {
    this.vel = Vector.add(this.vel, this.acc.scale(dt));
    this.pos = Vector.add(this.pos, this.vel.scale(dt));

    for (let i = 0; i < this.dim; i++) {
      if (this.pos.get(i) < this.radius && this.vel.get(i) < 0) {
        this.vel = this.vel.flip(i);
      } 

      if (this.pos.get(i) > box[i] - this.radius && this.vel.get(i) > 0) {
        this.vel = this.vel.flip(i);
      }
    }
  }

  static updateAll(hyperballs, box, dt) {
    hyperballs.forEach(hyperball =>
      hyperball.update(box, dt)
    );

    for (let i = 0; i < hyperballs.length; i++) {
      for (let j = i + 1; j < hyperballs.length; j++) {
        if (Hyperball.isColliding(hyperballs[i], hyperballs[j])) {
          Hyperball.collisionResponse(hyperballs[i], hyperballs[j]);
        }
      }
    }
  }

  crossSection(cuts) {
    let pos = this.pos.values.slice();
    let r = this.radius;

    for (let kv of cuts) {
      let i = kv[0];
      let c = kv[1];
      r = (r**2 - (this.pos.get(i) - c)**2)**0.5;
      pos.splice(i, 1);

      if (isNaN(r)) {
        return null;
      }
    }
    return new Hyperball(r, new Vector(pos));
  }

  static isToward(h1, h2) {
    return Vector.dot(Vector.sub(s2, s1), Vector.sub(v2, v1)) < 0;
  }

  static isColliding(h1, h2) {
    return Vector.dist(h1.pos, h2.pos) < h1.radius + h2.radius;
  }

  static collisionResponse(h1, h2) {
    let m1 = h1.mass;
    let m2 = h2.mass;
    let s1 = h1.pos;
    let s2 = h2.pos;
    let v1 = h1.vel;
    let v2 = h2.vel;
    let lambda = -2 * m1 * m2 / (m1 + m2) * 
      Vector.dot(Vector.sub(s2, s1), Vector.sub(v2, v1)) /
      Vector.sub(s2, s1).norm**2;

    h1.vel = Vector.add(Vector.sub(s2, s1).scale(-lambda / m1), v1);
    h2.vel = Vector.add(Vector.sub(s2, s1).scale(lambda / m2), v2);
  }
}

