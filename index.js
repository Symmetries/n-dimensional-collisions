/*global createCanvas*/
/*global WEBGL*/
/*global background*/
/*global mouseX*/
/*global mouseY*/
/*global height*/
/*global width*/
/*global pointLight*/
/*global push*/
/*global translate*/
/*global rotateX*/
/*global rotateY*/
/*global pop*/
/*global box*/
/*global PI*/
/*global HyperBall*/
/*global Vector*/

var t = 0;

var hyperBalls = [];
var dim = 2;
var numBalls = 7;
var sliders = [];
var canvas;
var depth;
var displayDim = 2;
var extraDimSlider;
var dimSlider;
var oldValue = 1;
var oldExtraValue = 0;
var previous;

var important = p5.RendererGL;

function restart(){
  numBalls = 2**dim;
  if (displayDim === 3){
    console.log("ooooh 3D :o")
    p5.RendererGL = important;
    canvas = createCanvas(window.innerWidth-20, window.innerHeight-100, WEBGL);
  } else {
    console.log("making a version that has ", displayDim," dimensions");
    p5.RendererGL = null;
    canvas = createCanvas(window.innerWidth-20, window.innerHeight-100);
    
  }
  depth = Math.min(width, height);
  hyperBalls = [];
  dimensions = [width, height];
  for (var i = 2; i < dim; i++){
    dimensions.push(depth);
  }  
  for (var i = 0; i < numBalls; i++){
    //console.log("trying to make ball", i);
    var overlap = true;
    var test;
    r = Math.min(...dimensions)/2 * Math.random();
    while (overlap){
      r *= 0.99;
      var v = [];
      var p = [];
      for (var j = 0; j < dim; j++){
          v.push(100*Math.random());
          p.push(r + (dimensions[j]-2*r)*Math.random());
      }
      test = new HyperBall(new Vector(p), r, r**dim, new Vector(v));
      overlap = false;
      for (var j = 0; j < hyperBalls.length; j++){
        if (HyperBall.overlap(test, hyperBalls[j], false)) {
          overlap = true;
        }
      }
    }
    hyperBalls.push(test);
  }
  dimSlider = createSlider(0, 3, displayDim, 1);
  extraDimSlider = createSlider(0, 7, dim-displayDim, 1);
  dimSlider.position(20, 20);
  extraDimSlider.position(20, 80);
  for (i = displayDim; i < dim; i++){
    sliders.push(createSlider(0, depth, depth/2));
  }
}


function setup(){
  restart();
  previous = Date.now();
  // canvas = createCanvas(window.innerWidth-20, window.innerHeight-100);
  // depth = Math.min(width, height);
  // for (var i = 0; i < numBalls; i++){
  //   var overlap = true;
  //   var test;
  //   r = depth/2 * Math.random();
  //   while (overlap){
  //     r *= 0.99;
  //     var v = [];
  //     var p = [];
  //     for (var j = 0; j < dim; j++){
  //         v.push(200*Math.random());
  //         p.push(r + (Math.min(width, height)-2*r)*Math.random());
  //     }
  //     test = new HyperBall(new Vector(p), r, r**dim, new Vector(v));
  //     overlap = false;
  //     for (var j = 0; j < hyperBalls.length; j++){
  //       if (HyperBall.overlap(test, hyperBalls[j], false)) {
  //         overlap = true;
  //       }
  //     }
  //   }
  //   hyperBalls.push(test);
  // }
  
  // dimSlider = createSlider(2, 3, 2, 1);
  // extraDimSlider = createSlider(0, 2, 0, 1);
  // oldValue = 2;
  // oldExtraValue = 0;
  // for (i = 2; i < dim; i++){
  //   sliders.push(createSlider(0, depth, depth/2));
  // }
}

function draw() {
  background(0);
  //console.log("draw loop!")
  var dt;
  if (displayDim === 2 || displayDim === 1){
    fill(255);
    dt = 0.01;
  } else if (displayDim === 3){
    depth = Math.min(width, height);
    var tri = 3;
    noFill();
    push();
    //translate(width/2-mouseX, height/2-mouseY, 0);
    pointLight(255, 255, 255, 0);
    pop();
    dt = 0.01;
    push();
    translate(0, 0, -depth);
    plane(width, height, tri, tri);
    pop();
    push();
    translate(0, height/2, -depth/2);
    rotateX(-PI/2);
    plane(width, depth, tri, tri);
    pop();
    push();
    translate(0, -height/2, -depth/2);
    rotateX(PI/2);
    plane(width, depth, tri, tri);
    pop();
    push();
    translate(width/2, 0, -depth/2);
    rotateY(-PI/2);
    plane(height, depth, tri, tri);
    pop();
    push();
    translate(-width/2, 0, -depth/2);
    rotateY(PI/2);
    plane(height, depth, tri, tri);
    pop();
  }
  
  dt = (Date.now()- previous)/1000;
  previous = Date.now();
  if (dt < 0.5){
    dimensions = [width, height];
    for (var i = 2; i < dim; i++){
      dimensions.push(depth);
    }
    HyperBall.updateAll(hyperBalls, dt, dimensions);
    for (var i = 0; i < hyperBalls.length; i++){
      values = [];
      for (var j = 0; j < dim; j++){
        if (j < displayDim){
          values.push(null);
        } else {
          values.push(sliders[j-displayDim].value());
        }
      }
      var result = hyperBalls[i].intersect(values);
      if (result != null){
        if (displayDim === 0){
          arc(width/2, height/2, 2*result.r, 2 * result.r, 0, 2 * PI);
        }
        if (displayDim === 1){
          arc(result.p.get(0), height/2, 2*result.r, 2 * result.r, 0, 2 * PI);
        }
        else if (displayDim === 2){
          arc(result.p.get(0), result.p.get(1), 2*result.r, 2*result.r, 0, 2 *PI);
        } else if (displayDim === 3){
          push();
          translate(width/2-result.p.get(0), height/2-result.p.get(1), -result.p.get(2));
          sphere(result.r, 12, 8);
          pop();
        }
      }
    }
    
    if (oldValue != dimSlider.value() || oldExtraValue != extraDimSlider.value()){
      //console.log("changed!");
      oldValue = dimSlider.value();
      oldExtraValue = extraDimSlider.value();
      displayDim = oldValue;
      dim = oldValue+oldExtraValue;
      console.log(dim, displayDim);
      for (var i = 0; i < sliders.length; i++){
        sliders[i].remove();
      }
      dimSlider.remove();
      extraDimSlider.remove();
      sliders = [];
      canvas.remove();
      restart();
    }
  }
}