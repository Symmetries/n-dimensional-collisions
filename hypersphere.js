class HyperBall{
    constructor(p, r, m, v){
        this.p = p;
        this.r = r;
        this.dim = p.n;
        this.m = m;
        this.v = v;
    }
    
    update(dt) {
        this.p = Vector.add(this.p, this.v.scale(dt));
    }
    
    intersect(values){
        var firstNum = null;
        var firstIndex = -1;
        var count = 0;
        
        
        while (firstNum === null && count < values.length){
            if (values[count] !== null){
                firstNum = values[count];
                firstIndex = count;
            }
            count++;
        }

        if (firstNum === null){
            return this;
        } else {
            var newValues = [];
            var newCoords = [];
            var rSquared = this.r**2-(this.p.get(firstIndex)-firstNum)**2;
            if (rSquared > 0){
                for (var i = 0; i < values.length; i++){
                    if (i !== firstIndex){
                        newValues.push(values[i]);
                        newCoords.push(this.p.get(i));
                    }
                }
                var crossSection = new HyperBall(new Vector(newCoords), rSquared**0.5);
                return crossSection.intersect(newValues);
            } else {
                return null;
            }
        }
    }
    
    
    static overlap(b1, b2, dir){
        return Vector.sub(b1.p, b2.p).norm() < b1.r + b2.r && 
            (Vector.dot(Vector.sub(b1.p, b2.p),Vector.sub(b1.v, b2.v)) < 0 || !dir);
    }
    
    static updateAll(hyperBalls, dt, dims){
        for (var i = 0; i < hyperBalls.length; i++){
            var s = hyperBalls[i].p;
            var v = hyperBalls[i].v;
            var r = hyperBalls[i].r;
            for (var j = 0; j < dims.length; j++){
                if ((s.get(j) < r && v.get(j) < 0) || (s.get(j)+ r> dims[j] && v.get(j)) > 0){
                    hyperBalls[i].v = v.reflect(j);
                }
            }
        }
        for (var i = 0; i < hyperBalls.length; i++){
            for (var j = i + 1; j < hyperBalls.length; j++){
                if (HyperBall.overlap(hyperBalls[i], hyperBalls[j], true)){
                    var vA = hyperBalls[i].v;
                    var vB = hyperBalls[j].v;
                    var sA = hyperBalls[i].p;
                    var sB = hyperBalls[j].p;
                    var mA = hyperBalls[i].m;
                    var mB = hyperBalls[j].m;
                    var s = Vector.sub(sB, sA);
                    
                    var lambda = -2*mA*mB/(mA+mB)*Vector.dot(s, Vector.sub(vB, vA))/Vector.dot(s, s); 
                    
                    hyperBalls[i].v = Vector.add(s.scale(-lambda/mA), vA);
                    hyperBalls[j].v = Vector.add(s.scale(lambda/mB), vB);
                }
            }
        }
        for (var i = 0; i < hyperBalls.length; i++){
            hyperBalls[i].update(dt);
        }
    }
}
