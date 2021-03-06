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

  A += 0.05;

  const x = 100; // 振幅
  const s = Math.PI/2;
  //円
  ctx.fillStyle = 'rgba(255,255,255)';
  ctx.beginPath();
  ctx.arc(Math.cos(A)*-50+width, Math.sin(A)*x+height, Math.sin(s+A)*20+40, 0, Math.PI*2, false);
  ctx.fill();

  console.log('animate');
  window.requestAnimationFrame(animate);
}
animate();
