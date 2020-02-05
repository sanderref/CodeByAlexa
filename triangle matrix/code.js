const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.style.backgroundColor = "#222";
canvas.width = innerWidth;
canvas.height = innerHeight;

addEventListener("resize", function() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
});

function rnd() {
  return Math.random();
}

//initialization
const amt = 125;
const color = "#fff";
const minDistance = canvas.width / 10;

var dots = [];
var lines = [];
var spd = 1;
var maxSize = 2;
var minSize = 2;

var glow = 0; //1 or 0

//objects needed as elements in animation
function Line(pos1, pos2, alpha) {
  c.strokeStyle = "rgba(255,255,255," + alpha + ")";
  c.beginPath();
  c.moveTo(pos1[0], pos1[1]);
  c.lineTo(pos2[0], pos2[1]);
  c.stroke();
}

function Dot(x, y, vec, rad, col) {
  this.x = x;
  this.y = y;
  this.vec = vec;
  this.rad = rad;
  this.col = col;

  this.draw = () => {
    c.beginPath();
    c.arc(this.x, this.y, this.rad, 0, Math.PI * 2, false);
    c.fillStyle = this.col;
    c.fill();
    c.closePath();
    c.shadowColor = "#fff";
    c.shadowBlur = 2 * glow;
  };

  this.update = () => {
    //wrap loop the dots
    if (this.x > canvas.width + minDistance) {
      this.x = -this.rad;
    } else if (this.x < 0 - minDistance) {
      this.x = canvas.width - minDistance;
    }
    if (this.y > canvas.width + minDistance) {
      this.y = -this.rad;
    } else if (this.y < 0 - minDistance) {
      this.y = canvas.width - minDistance;
    }

    this.x += this.vec[0];
    this.y += this.vec[1];

    for (let i = 0; i < dots.length; i++) {
      let other = dots[i];
      let a = this.x - other.x;
      let b = this.y - other.y;
      let hyp = Math.sqrt(a * a + b * b);
      if (hyp < minDistance) {
        let pos1 = [this.x, this.y];
        let pos2 = [other.x, other.y];
        let alpha = (minDistance - hyp) / minDistance;
        lines.push(new Line(pos1, pos2, alpha));
      }
    }

    this.draw();
  };
}

function initiate() {
  //create dots
  for (let i = 0; i < amt; i++) {
    let x = rnd() * canvas.width;
    let y = rnd() * canvas.height;
    let rad = rnd() * maxSize + minSize;
    let vec = [rnd() * spd - spd / 2, rnd() * spd - spd / 2];
    dots.push(new Dot(x, y, vec, rad, color));
  }
}
console.log(dots);
//animation setup
function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height);
  lines = [];
  //update before animation
  dots.forEach(Dot => {
    Dot.update();
  });
}

initiate();
animate();
