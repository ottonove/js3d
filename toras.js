/**
 * y軸を中心に円を回し、トーラスを作成。
 * そのトーラスを、x軸を中心に回す。
 * {x, y, 0} . {{cosφ, 0, sinφ}, {0, 1, 0}, {-sinφ, 0, cosφ}} . {{1,0, 0}, {0, cosA, sinA}, {0, -sinA, cosA}}
 * 
 * [Donut math: how donut.c works – a1k0n.net](https://www.a1k0n.net/2011/07/20/donut-math.html)
 *   x -> R2 + R1 * cos(theta),  y -> R1 * sin(theta)
 * 
 * [Wolfram|Alpha](https://ja.wolframalpha.com/input/?i=%7Bx%2C+y%2C+0%7D+.+%7B%7Bcos%CF%86%2C+0%2C+sin%CF%86%7D%2C+%7B0%2C+1%2C+0%7D%2C+%7B-sin%CF%86%2C+0%2C+cos%CF%86%7D%7D+.+%7B%7B1%2C0%2C+0%7D%2C+%7B0%2C+cosA%2C+sinA%7D%2C+%7B0%2C+-sinA%2C+cosA%7D%7D)
 */

/**
 * {x, y, 0} . {{cosφ, 0, sinφ}, {0, 1, 0}, {-sinφ, 0, cosφ}} . {{1,0, 0}, {0, cosA, sinA}, {0, -sinA, cosA}} . {{cosB, sinB, 0}, {-sinB, cosB, 0}, {0, 0, 1}}
 */

// const canvastag = document.createElement('canvas');
// canvastag.width = window.innerWidth-16;
// canvastag.height = window.innerHeight;
// document.body.appendChild(canvastag);
 
const canvastag = document.getElementById('canvas');

const R1 = 25;
const R2 = 50;
const K1 = 150;
const K2 = 4;

let A = 1.00;
let B = 0.00;

let mouseIsActive = false;

canvastag.onmousedown = (event) => {
  mouseIsActive = true;
}
canvastag.onmouseup = (event) => {
  mouseIsActive = false;
}
canvastag.onmousemove = (event) => {
  if(mouseIsActive){
    A += event.movementY*0.01;
    B += event.movementX*0.01;
  }
}

let clientX = 0;
let clientY = 0;

canvastag.addEventListener('touchstart', (evt) => {
  // console.log('touch start', evt);
  clientX = evt.targetTouches[0].clientX;
  clientY = evt.targetTouches[0].clientY;
});
canvastag.addEventListener('touchmove', (evt) => {
  const valX = (clientX - evt.changedTouches[0].clientX) * 0.001;
  const valY = (clientY - evt.changedTouches[0].clientY) * 0.001;
  console.log('touch move X:', valX);
  console.log('touch move Y:', valY);
  B += valX;
  A += valY;
});
canvastag.addEventListener('touchend', (evt) => {
  // console.log('touched', evt);
  clientX = 0;
  clientY = 0;
});

const animate = () => {
  const ctx = canvastag.getContext('2d');
  ctx.fillStyle='#000';
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  const cA = Math.cos(A);
  const sA = Math.sin(A);
  const cB = Math.cos(B);
  const sB = Math.sin(B);

  for(j=0;j<6.28;j+=0.1) { // theta
      const ct=Math.cos(j), st=Math.sin(j);

      for(i=0;i<6.28;i+=0.1) { // phi
        const sp = Math.sin(i);
        const cp = Math.cos(i);
        const x = R2+R1*ct;
        const y = R1*st;
        const z = x*cA*sp+y*sA;
        const wrap = y*cA-x*sA*sp;
        
        ctx.fillStyle = 'rgba(255, 255, 255)';
        ctx.fillRect(
          (canvastag.width/2) + ((x*cB*cp-sB*wrap)*z),
          (canvastag.height/2) + ((cB*wrap+x*sB*cp)*z),
          3,3
        );
      }
  }
  window.requestAnimationFrame(animate);
}
animate();
