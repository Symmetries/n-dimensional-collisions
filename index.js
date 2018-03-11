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
var dim = 3;
var numBalls = 7;
var sliders = [];
var paras = [];
var canvas;
var depth;
var displayDim = 3;
var extraDimSlider;
var dimSlider;
var oldValue = displayDim;
var oldExtraValue = 0;
var previous;
var displayDimPara;
var extraDimPara;
var descriptionPara;


function restart(){
  numBalls = 2**dim;
  // if (displayDim === 3){
  //   console.log("ooooh 3D :o")
  //   canvas = createCanvas(window.innerWidth-20, window.innerHeight-100, WEBGL);
  // } else {
  //   console.log("making a version that has ", displayDim," dimensions");
  //   canvas = createCanvas(window.innerWidth-20, window.innerHeight-100);
    
  // }
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
          v.push(50*Math.random());
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
  descriptionPara = createP("There are currently " + displayDim + 
    " visible dimension(s), " + (dim - displayDim) + " hidden dimension(s)" +
    " making a total of " + dim + " dimension(s). There are " + numBalls + 
    " " + (dim + "-balls") + " in the " + (dim + " dimensional") + 
    " box.");
  displayDimPara = createP("Number of visible dimensions:");
  dimSlider = createSlider(0, 3, displayDim, 1);
  extraDimPara = createP("Number of hidden dimensions:");
  extraDimSlider = createSlider(0, 7, dim-displayDim, 1);
  //dimSlider.position(20, 20);
  //extraDimSlider.position(20, 80);
  for (i = displayDim; i < dim; i++){
    paras.push(createP("x" + (i+1) + ":"));
    sliders.push(createSlider(0, depth, depth/2));
  }
}


function setup(){
  canvas = createCanvas(window.innerWidth/2, window.innerHeight/2, WEBGL);
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
  //sphere(10);
  //console.log("draw loop!")
  var dt;
  if (displayDim === 2 || displayDim === 1){
    fill(255);
    dt = 0.01;
  } else if (displayDim === 3){
    noStroke();
    dt = 0.01;
    push();
    fill(50);
    translate(0, 0, -depth);
    plane(width, height);
    pop();
    push();
    fill(10);
    translate(0, height/2, -depth/2);
    rotateX(-PI/2);
    plane(width, depth);
    pop();
    push();
    fill(10);
    translate(0, -height/2, -depth/2);
    rotateX(PI/2);
    plane(width, depth);
    pop();
    push();
    fill(30);
    translate(width/2, 0, -depth/2);
    rotateY(-PI/2);
    plane(height, depth);
    pop();
    push();
    fill(30);
    translate(-width/2, 0, -depth/2);
    rotateY(PI/2);
    plane(height, depth);
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
          ellipse(0, 0, 10, 10);
          //arc(width/2, height/2, 2*result.r, 2 * result.r, 0, 2 * PI);
        } else if (displayDim === 1){
          var rectHeight = 10;
          fill(0, 255, 0);
          stroke(0, 255, 0);
          rect(result.p.get(0) - result.r - width/2, -rectHeight/2,
            2*result.r, rectHeight, 
            rectHeight, rectHeight, rectHeight, rectHeight);
        } else if (displayDim === 2){
          fill(0, 255, 0);
          ellipse(result.p.get(0) - width/2,
            result.p.get(1) - height/2,
            2*result.r, 2*result.r);
        } else if (displayDim === 3){
          push();
          noFill();
          stroke(0, 255, 0);
          translate(width/2-result.p.get(0), height/2-result.p.get(1), -result.p.get(2));
          sphere(result.r, 12, 8);
          pop();
        }
      }
    }
    
    if (oldValue != dimSlider.value() || oldExtraValue != extraDimSlider.value()){
      console.log("changed!");
      oldValue = dimSlider.value();
      oldExtraValue = extraDimSlider.value();
      displayDim = oldValue;
      dim = oldValue+oldExtraValue;
      console.log(dim, displayDim);
      for (var i = 0; i < sliders.length; i++){
        sliders[i].remove();
        paras[i].remove();
      }
      dimSlider.remove();
      extraDimSlider.remove();
      displayDimPara.remove();
      extraDimPara.remove();
      descriptionPara.remove();
      sliders = [];
      paras = [];
      //canvas.remove();
      restart();
    }
  }
}