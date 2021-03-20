    var canvastag = document.getElementById('canvas');

    var A=1, B=1;

    // This is a reimplementation according to my math derivation on the page
    var R1 = 1;
    var R2 = 2;
    var K1 = 200;//150;
    var K2 = 5;

const animate = () => {
  //console.log("hello");
  var ctx = canvastag.getContext('2d');
  ctx.fillStyle='#000';
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  //if(tmr1 === undefined) { // only update A and B if the first animation isn't doing it already
  A += 0.005;
  B += 0.005;
  //}
  // precompute cosines and sines of A, B, theta, phi, same as before
  var cA=Math.cos(A), sA=Math.sin(A),
      cB=Math.cos(B), sB=Math.sin(B);
  for(var j=0;j<6.28;j+=0.3) { // j <=> theta
      var ct=Math.cos(j),st=Math.sin(j); // cosine theta, sine theta
      for(i=0;i<6.28;i+=0.1) {   // i <=> phi
          var sp=Math.sin(i),cp=Math.cos(i); // cosine phi, sine phi
          var ox = R2 + R1*ct, // object x, y = (R2,0,0) + (R1 cos theta, R1 sin theta, 0)
              oy = R1*st;

          var x = ox*(cB*cp + sA*sB*sp) - oy*cA*sB; // final 3D x coordinate
          var y = ox*(sB*cp - sA*cB*sp) + oy*cA*cB; // final 3D y
          var ooz = 1/(K2 + cA*ox*sp + sA*oy); // one over z
          var xp=(150+K1*ooz*x); // x' = screen space coordinate, translated and scaled to fit our 320x240 canvas element
          var yp=(120-K1*ooz*y); // y' (it's negative here because in our output, positive y goes down but in our 3D space, positive y goes up)
          // luminance, scaled back to 0 to 1
          var L=1.0*(cp*ct*sB - cA*ct*sp - sA*st + cB*(cA*st - ct*sA*sp));
          if(L > 0) {
          ctx.fillStyle = 'rgba(255,255,255,'+L+')';
          ctx.fillRect(xp, yp, 2.5, 2.5);
          }
      }
  }
  window.requestAnimationFrame(animate);
}
animate();
