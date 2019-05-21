/*global createCanvas*/
/*global WEBGL*/
/*global background*/
/*global height*/
/*global width*/
/*global push*/
/*global translate*/
/*global rotateX*/
/*global rotateY*/
/*global pop*/
/*global PI*/
/*global Hyperball*/
/*global Vector*/

let previousTime;
let hyperballs;
let dim;
let extraDim;
let displayDim;
let numBalls;
let depth;

let sliders;
let paras
let divs;
let canvas;

let backgroundColor;
let sideColor;
let bottomColor;
let backColor;
let ballColor;

function init() {
  previousTime = Date.now();
  hyperballs = [];
  dim = 4;
  extraDim = 1;
  displayDim = 3;
  sliders = [];
  paras = [];
  divs = [];
  backgroundColor = 50;
  sideColor = 0;
  backColor = 0;
  ballColor = color(0, 200, 0);
}

function restart(){
  dim = displayDim + extraDim
  numBalls = 2**dim;
  depth = Math.min(width, height);
  hyperballs = [];
  dimensions = [width, height];
  for (let i = 2; i < dim; i++){
    dimensions.push(depth);
  }  
  for (let i = 0; i < numBalls; i++){
    var overlap = true;
    var test;
    r = Math.min(...dimensions)/2 * Math.random();
    while (overlap){
      r *= 0.99;
      let v = [];
      let p = [];
      let a = [];
      for (let j = 0; j < dim; j++){
        v.push(50*Math.random());
        p.push(r + (dimensions[j]-2*r)*Math.random());
        a.push(0);
      }
      test = new Hyperball(r, new Vector(p), new Vector(v), new Vector(a), r**dim, dim);
      overlap = false;
      for (let j = 0; j < hyperballs.length; j++){
        if (Hyperball.isColliding(test, hyperballs[j])) {
          overlap = true;
        }
      }
    }
    hyperballs.push(test);
  }
  removeSliders();
  createSliders();
  updateUIValues();
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
  };

  document.querySelector("#incrementDisplayDimButton").onclick = () => {
    if (displayDim < 3) displayDim++;
    restart();
  };

  document.querySelector("#decrementExtraDimButton").onclick = () => {
    if (extraDim > 0) extraDim--;
    restart();
  };
  
  document.querySelector("#incrementExtraDimButton").onclick = () => {
    if (extraDim < 3) extraDim++;
    restart();
  };
}

function createSliders() {
  for (let i = 0; i < extraDim; i++){
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
  init();
  canvas = createCanvas(window.innerWidth, window.innerHeight, WEBGL);
  buildUI();
  restart();
}

function draw() {
  background(backgroundColor);
  if (displayDim === 2 || displayDim === 1){
    fill(ballColor);
  } else if (displayDim === 3){
    noStroke();
    push();
    fill(120);
    translate(0, 0, -depth);
    plane(width, height);
    pop();
    fill(50);
    push();
    translate(0, height/2, -depth/2);
    rotateX(-PI/2);
    plane(width, depth);
    pop();
    push();
    translate(0, -height/2, -depth/2);
    rotateX(PI/2);
    plane(width, depth);
    pop();
    fill(80);
    push();
    translate(width/2, 0, -depth/2);
    rotateY(-PI/2);
    plane(depth, height);
    pop();
    push();
    translate(-width/2, 0, -depth/2);
    rotateY(PI/2);
    plane(depth, height);
    pop();
    noFill();
    stroke(ballColor);
  }
  
  let dt = (Date.now()- previousTime)/1000;
  previousTime = Date.now();
  if (dt < 0.5){
    dimensions = [width, height];
    for (let i = 2; i < dim; i++){
      dimensions.push(depth);
    }
    Hyperball.updateAll(hyperballs, dimensions, dt);
    for (let i = 0; i < hyperballs.length; i++){
      cuts = [];
      for (let j = 0; j < dim; j++){
        if (j >= displayDim){
          cuts.push([j, sliders[j-displayDim].value()]);
        }
      }
      let result = hyperballs[i].crossSection(cuts);
      if (result != null){
        if (displayDim == 0){
          let diameter = min(width, height)/50;
          ellipse(0, 0, diameter, diameter);
        } else if (displayDim == 1){
          let rectHeight = floor(min(width, height)/50);
          rect(result.pos.get(0) - result.radius - width/2, -rectHeight/2,
            2*result.radius, rectHeight, 
            rectHeight, rectHeight, rectHeight, rectHeight);
        } else if (displayDim == 2){
          ellipse(result.pos.get(0) - width/2,
            result.pos.get(1) - height/2,
            2*result.radius, 2*result.radius);
        } else if (displayDim === 3){
          push();
          translate(width/2-result.pos.get(0), height/2-result.pos.get(1), -result.pos.get(2));
          strokeWeight(map(result.radius, 0, depth/2, 0, 5));
          sphere(result.radius, 14, 10);
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
