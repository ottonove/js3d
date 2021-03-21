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

var canvastag = document.getElementById('canvas');

var A=1, B=1;

let mouseIsActive = false;

canvastag.onmousedown = (event) => {
  console.log('down');
  mouseIsActive = true;
}
canvastag.onmouseup = (event) => {
  console.log('up');
  mouseIsActive = false;
}
canvastag.onmousemove = (event) => {
  if(mouseIsActive){
    console.log('Y', event.movementY);
    A += event.movementY*0.01;
  }
}

// This is a reimplementation according to my math derivation on the page
var R1 = 50;
var R2 = 100;
var K1 = 200;//150;
var K2 = 5;

const animate = () => {
  var ctx = canvastag.getContext('2d');
  ctx.fillStyle='#000';
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // A += 0.01;
  B += 0.01;

  var cA=Math.cos(A), sA=Math.sin(A),
      cB=Math.cos(B), sB=Math.sin(B);
  for(var j=0;j<6.28;j+=0.1) { // j <=> theta
      var ct=Math.cos(j),st=Math.sin(j); // cosine theta, sine theta
      for(i=0;i<6.28;i+=0.1) {   // i <=> phi
        var sp=Math.sin(i),cp=Math.cos(i); // cosine phi, sine phi
        ctx.fillStyle = 'rgba(255,255,255)';
        var x = R2+R1*ct
        var y = R1*st
        ctx.fillRect(250+ x*cB*cp-sB*(y*cA-x*sA*sp), 250+(cB*(y*cA-x*sA*sp)), 2.5, 2.5);
      }
    //   for(i=0;i<6.28;i+=0.1) {   // i <=> phi
    //       var sp=Math.sin(i),cp=Math.cos(i); // cosine phi, sine phi
    //       var ox = R2 + R1*ct, // object x, y = (R2,0,0) + (R1 cos theta, R1 sin theta, 0)
    //           oy = R1*st;

    //       var x = ox*(cB*cp + sA*sB*sp) - oy*cA*sB; // final 3D x coordinate
    //       var y = ox*(sB*cp - sA*cB*sp) + oy*cA*cB; // final 3D y
    //       var ooz = 1/(K2 + cA*ox*sp + sA*oy); // one over z
    //       var xp=(150+K1*ooz*x); // x' = screen space coordinate, translated and scaled to fit our 320x240 canvas element
    //       var yp=(120-K1*ooz*y); // y' (it's negative here because in our output, positive y goes down but in our 3D space, positive y goes up)
    //       // luminance, scaled back to 0 to 1
    //       var L=1.0*(cp*ct*sB - cA*ct*sp - sA*st + cB*(cA*st - ct*sA*sp));
    //       if(L > 0) {
    //       ctx.fillStyle = 'rgba(255,255,255,'+L+')';
    //       ctx.fillRect(xp, yp, 2.5, 2.5);
    //       }
    //   }
  }
  window.requestAnimationFrame(animate);
}
animate();
