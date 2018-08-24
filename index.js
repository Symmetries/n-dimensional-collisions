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

let t = 0;

let hyperBalls = [];
let dim = 4;
let extraDim = 1;
let displayDim = 3;
let numBalls;
let sliders = [];
let paras = [];
let divs = [];
let canvas;
let depth;
let previousTime;

function restart(){
  dim = displayDim + extraDim
  numBalls = 2**dim;
  depth = Math.min(width, height);
  hyperBalls = [];
  dimensions = [width, height];
  for (var i = 2; i < dim; i++){
    dimensions.push(depth);
  }  
  for (var i = 0; i < numBalls; i++){
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
}

function updateUIValues() {
  document.querySelector("#displayDimSpan").innerHTML = displayDim;
  document.querySelector("#extraDimSpan").innerHTML = extraDim;
  document.querySelector("#hyperballSpan").innerHTML = numBalls;
  document.querySelector("#totalDimSpan").innerHTML = dim;
  document.querySelector("#decrementDisplayDimButton").disabled = displayDim <= 0;
  document.querySelector("#incrementDisplayDimButton").disabled = displayDim >= 3;
  document.querySelector("#decrementExtraDimButton").disabled = extraDim <= 0;
  document.querySelector("#incrementExtraDimButton").disabled = extraDim >= 3;
}

function buildUI() {
  document.querySelector("#decrementDisplayDimButton").onclick = () => {
    if (displayDim > 0) displayDim--;
    restart();
    removeSliders();
    createSliders();
    updateUIValues();
  };

  document.querySelector("#incrementDisplayDimButton").onclick = () => {
    if (displayDim < 3) displayDim++;
    restart();
    removeSliders();
    createSliders();
    updateUIValues();
  };

  document.querySelector("#decrementExtraDimButton").onclick = () => {
    if (extraDim > 0) extraDim--;
    restart();
    removeSliders();
    createSliders();
    updateUIValues();
  };
  
  document.querySelector("#incrementExtraDimButton").onclick = () => {
    if (extraDim < 3) extraDim++;
    restart();
    removeSliders();
    createSliders();
    updateUIValues();
  };
}

function createSliders() {
  for (i = 0; i < extraDim; i++){
    divs.push(createDiv(""));
    paras.push(createP("x<sub>" + (i+displayDim+1) + "</sub>:"));
    sliders.push(createSlider(0, depth, depth/2));
    divs[i].child(paras[i]);
    divs[i].child(sliders[i]);
    divs[i].parent(document.querySelector("footer"));
  }
}

function removeSliders() {
  for (let i = 0; i < sliders.length; i++){
    sliders[i].remove();
    paras[i].remove();
    divs[i].remove();
  }
  sliders = [];
  paras = [];
  divs = [];
}

function setup(){
  canvas = createCanvas(window.innerWidth, window.innerHeight, WEBGL);
  buildUI();
  restart();
  createSliders();
  updateUIValues();
  previousTime = Date.now();
}

function draw() {
  background(50);
  var dt;
  if (displayDim === 2 || displayDim === 1){
    fill(0, 200, 0);
  } else if (displayDim === 3){
    noStroke();
    push();
    fill(120);
    translate(0, 0, -depth);
    plane(width, height);
    pop();
    push();
    fill(50);
    translate(0, height/2, -depth/2);
    rotateX(-PI/2);
    plane(width, depth);
    pop();
    push();
    fill(50);
    translate(0, -height/2, -depth/2);
    rotateX(PI/2);
    plane(width, depth);
    pop();
    push();
    fill(80);
    translate(width/2, 0, -depth/2);
    rotateY(-PI/2);
    plane(depth, height);
    pop();
    push();
    fill(80);
    translate(-width/2, 0, -depth/2);
    rotateY(PI/2);
    plane(depth, height);
    pop();
    noFill();
    stroke(0, 200, 0);
    strokeWeight(5);
  }
  
  dt = (Date.now()- previousTime)/1000;
  previousTime = Date.now();
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
        if (displayDim == 0){
          let diameter = min(width, height)/50;
          ellipse(0, 0, diameter, diameter);
        } else if (displayDim == 1){
          let rectHeight = floor(min(width, height)/50);
          rect(result.p.get(0) - result.r - width/2, -rectHeight/2,
            2*result.r, rectHeight, 
            rectHeight, rectHeight, rectHeight, rectHeight);
        } else if (displayDim == 2){
          ellipse(result.p.get(0) - width/2,
            result.p.get(1) - height/2,
            2*result.r, 2*result.r);
        } else if (displayDim === 3){
          push();
          translate(width/2-result.p.get(0), height/2-result.p.get(1), -result.p.get(2));
	  strokeWeight(map(result.r, 0, depth/2, 0, 5));
          sphere(result.r, 10, 6);
          pop();
        }
      }
    }
  }
}

function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
  restart();
}
