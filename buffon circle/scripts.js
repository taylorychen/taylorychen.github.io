const CrossesOut = document.querySelector('.data.cross');
const DropsOut = document.querySelector('.data.drop');
const ExpOut = document.querySelector('.data.exp');
const TheorOut = document.querySelector('.data.theor');
const DiffOut = document.querySelector('.data.diff');

const circles = document.getElementById('circles');

const slider = document.getElementById('length');
const RatioOut = document.getElementById('ratioDisplay');
RatioOut.innerHTML = slider.value; // Display the default slider value
let length;

let crosses;
let drops;
let experimental;
let theoretical;
let rst = false;  //determine if need to reset when drop() is called


const NUM_CIRCLES = 4;
const DELTA_R = 62.5;    //distance bewteen circles

//polar coords
let r;            //distance from origin
let phi;          //angle from positive x axis

//rectangular coords
let x;
let y;

let theta;        //angle needle is rotated
let annulusNum;   //the annulus needle fell in
let d;            //distance from the outer circumference of the annulus

reset();

function reset() {
  document.querySelectorAll('.needle').forEach(needle => {
    needle.remove();
  });
  length = slider.value * 62.5;

  theoretical = calculateTheoretical();
  TheorOut.innerHTML = theoretical.toFixed(5);

  DiffOut.innerHTML = "-";
  ExpOut.innerHTML = "-";

  drops = 0;
  crosses = 0;
  DropsOut.innerHTML = drops;
  CrossesOut.innerHTML = crosses;

  rst = false;
}

function drop(amt) {
  if(rst)
    reset();
  for (let i = 0; i < amt; i++) {
    generateNeedle();

    //adding needle to DOM
    let needle = document.createElement('div');
    needle.className = 'needle';
    needle.style.width = `${length}px`;

    //convert theta so it is displayed correctly
    theta = theta + Math.PI - phi;
    //console.log(`theta adj: ${theta * 180 / Math.PI}`);
    needle.style.transform = `rotate(${theta}rad)`; 
    theta = theta - Math.PI + phi;    //change theta back

    //divs are positioned from the corner, correcting x so it references the center
    needle.style.left = `${x - length / 2}px`;
    needle.style.top = `${y}px`;
    //needle.style.backgroundColor = `${color()}`;
    circles.appendChild(needle);

    if (checkCross()) {
      crosses++;
      needle.style.backgroundColor = 'rgb(0, 156, 0)';
    }
  }
  CrossesOut.innerHTML = crosses;

  drops += amt;
  DropsOut.innerHTML = drops;

  experimental = crosses / drops;
  ExpOut.innerHTML = experimental.toFixed(5);

  DiffOut.innerHTML = (Math.abs(experimental - theoretical) / theoretical * 100).toFixed(5);
}

function generateNeedle() {
  //Uses inverse transform sampling to generate a random variable with a desired pdf.
  r = NUM_CIRCLES * DELTA_R * Math.sqrt(Math.random());
  phi = Math.random() * 2 * Math.PI; //angle between 0 and 2pi

  // console.log(`r: ${r}`);
  //console.log(`phi: ${phi * 180 / Math.PI}`);
  
  //converting to rectangular
  x = 275 + r * Math.cos(phi);
  y = 275 - r * Math.sin(phi);
  
  //console.log(`x: ${x}`);
  //console.log(`y: ${y}`);

  theta = Math.random() * Math.PI;
  //console.log(`theta og: ${theta * 180 / Math.PI}`);

  annulusNum = Math.floor(r / DELTA_R) + 1;
  //console.log(`annulus: ${annulusNum}`);

  d = annulusNum * DELTA_R - r;
  //console.log(`distance: ${d}`);

}

//checks if needle crosses
function checkCross() {
  //convert theta so only dealing with quadrant 1
  if(theta > Math.PI / 2)
    theta = Math.abs(Math.PI - theta);

  //outer half test
  if(d < DELTA_R/2) {
    if (d < length / 2) {
      let temp = annulusNum * DELTA_R - d;
      if(Math.sqrt((temp) * (temp) + (length * length / 4) + length * (temp) * Math.cos(theta)) > annulusNum * DELTA_R){
        //console.log("case 1");
        return true;
      }
    }
  }

  //inner half test
  else {
    let a = (annulusNum-1) * DELTA_R;  //just shorthand
    //converts d to distance to inner circumference of annulus
    d = DELTA_R - d;
    if (d < length / 2) {
      if(d < (Math.sqrt(length*length / 4 + a*a)-a)) {
        if(theta < Math.asin(a / (a+d))){
          //console.log("case 2a");
          return true;
        }
          
      }
      else {
        if(Math.sqrt(length*length / 4 + (a + d)*(a + d) - length*(a + d)*Math.cos(theta)) < a) {
          //console.log("case 2b");
          return true;
        }
      }
    }
  }
  //console.log("no cross");
  return false;
}

function calculateTheoretical(){
  const l = length / DELTA_R;
  
  let series = 0;
  //Series
  for(let n=1; n<=NUM_CIRCLES; n++){
    series += l * Math.sqrt(n*n - l*l / 4) + 2 * n*n * Math.asin(l/(2 * n));
  }
  
  let probability;
  probability = 1 / (Math.PI * NUM_CIRCLES*NUM_CIRCLES) * series + (l*(NUM_CIRCLES - 1)) / (Math.PI * NUM_CIRCLES);
  return probability;
}

// Update the current slider value
slider.oninput = function() {
  RatioOut.innerHTML = this.value;
  rst = true;
};

////////////////////////////////////////
////          Explanation           ////
////////////////////////////////////////

const explainDoc = document.getElementsByTagName('iframe')[0];
const explainButton = document.querySelector('.explanation-button');

explainButton.addEventListener('click', () => {
  explainButton.innerHTML = (explainButton.innerHTML !== 'Hide') ? 'Hide' : 'Click to Learn More';
  explainDoc.style.display = (explainDoc.style.display === 'none') ? 'block' : 'none';
  window.scrollBy(0, 0.50 * window.innerHeight);
});
