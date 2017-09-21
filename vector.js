class Vector{
    constructor(values){
        this.values = values;
        this.n = values.length;
    }
    get(n){
        return this.values[n];
    }
    
    norm(){
        return Vector.dot(this, this)**0.5;
    }
    
    scale(k){
        var result = [];
        for (var i = 0; i < this.n; i++){
            result.push(k*this.get(i));
        }
        return new Vector(result);
    }
    
    reflect(dim){
        var result = [];
        for (var i = 0; i < this.n; i++){
            if (i === dim){
                result.push(-this.get(i))
            } else {
                result.push(this.get(i));
            }
        }
        return new Vector(result);
    }
    
    static dot(v1, v2){
        var result = 0;
        for (var i = 0; i < v1.n; i++){
            result += v1.get(i) * v2.get(i);
        }
        return result;
    }
    
    static add(v1, v2){
        var result = [];
        for (var i = 0; i < v1.n; i++){
            result.push(v1.get(i) + v2.get(i));
        }
        return new Vector(result);
    }
    
    static sub(v1, v2){
        var result = [];
        for (var i = 0; i < v1.n; i++){
            result.push(v1.get(i) - v2.get(i));
        }
        return new Vector(result);
    }
}
