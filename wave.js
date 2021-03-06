var canvastag = document.getElementById('canvasdonut');

var A=1, B=1;

var R1 = 1;
var R2 = 2;
var K1 = 150;
var K2 = 5;
const width = canvastag.width / 2;
const height = canvastag.height / 2;
const animate = () => {
  var ctx = canvastag.getContext('2d');
  ctx.fillStyle='#000';
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  A += 0.007;

  const x = 50;
  let sA = Math.sin(A) * x + width;
  let cA = Math.cos(A) * x + height;
  ctx.fillStyle = 'rgba(255,255,255,1)';
  ctx.fillRect(sA, cA, 5, 5);

  //ctx.arc(sA, cA, 20, 0, 180);
  //円
  ctx.beginPath();
  ctx.arc(ctx.canvas.width/2, ctx.canvas.height/2, 40, 0, Math.PI*2, false);
  ctx.fill();

  console.log('animate');
  window.requestAnimationFrame(animate);
}
animate();
