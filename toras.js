// (function() {
//     var _onload = function() {
//     var pretag = document.getElementById('d');
//     var canvastag = document.getElementById('canvasdonut');

//     var tmr1 = undefined, tmr2 = undefined;
//     var A=1, B=1;

//     // This is a reimplementation according to my math derivation on the page
//     var R1 = 1;
//     var R2 = 2;
//     var K1 = 150;
//     var K2 = 5;
//     var canvasframe=function() {
//         var ctx = canvastag.getContext('2d');
//         ctx.fillStyle='#000';
//         ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

//         if(tmr1 === undefined) { // only update A and B if the first animation isn't doing it already
//         A += 0.07;
//         B += 0.03;
//         }
//         // precompute cosines and sines of A, B, theta, phi, same as before
//         var cA=Math.cos(A), sA=Math.sin(A),
//             cB=Math.cos(B), sB=Math.sin(B);
//         for(var j=0;j<6.28;j+=0.3) { // j <=> theta
//             var ct=Math.cos(j),st=Math.sin(j); // cosine theta, sine theta
//             for(i=0;i<6.28;i+=0.1) {   // i <=> phi
//                 var sp=Math.sin(i),cp=Math.cos(i); // cosine phi, sine phi
//                 var ox = R2 + R1*ct, // object x, y = (R2,0,0) + (R1 cos theta, R1 sin theta, 0)
//                     oy = R1*st;

//                 var x = ox*(cB*cp + sA*sB*sp) - oy*cA*sB; // final 3D x coordinate
//                 var y = ox*(sB*cp - sA*cB*sp) + oy*cA*cB; // final 3D y
//                 var ooz = 1/(K2 + cA*ox*sp + sA*oy); // one over z
//                 var xp=(150+K1*ooz*x); // x' = screen space coordinate, translated and scaled to fit our 320x240 canvas element
//                 var yp=(120-K1*ooz*y); // y' (it's negative here because in our output, positive y goes down but in our 3D space, positive y goes up)
//                 // luminance, scaled back to 0 to 1
//                 var L=0.7*(cp*ct*sB - cA*ct*sp - sA*st + cB*(cA*st - ct*sA*sp));
//                 if(L > 0) {
//                 ctx.fillStyle = 'rgba(255,255,255,'+L+')';
//                 ctx.fillRect(xp, yp, 1.5, 1.5);
//                 }
//             }
//         }
//         console.log('loop')
//     }


//     window.anim2 = function() {
//         if(tmr2 === undefined) {
//         tmr2 = setInterval(canvasframe, 50);
//         } else {
//         clearInterval(tmr2);
//         tmr2 = undefined;
//         }
//     };

//     // asciiframe();
//     canvasframe();
//     }

//     if(document.all)
//     window.attachEvent('onload',_onload);
//     else
//     window.addEventListener("load",_onload,false);
//     })();
const canvas = document.createElement('canvas');
canvas.width = 600;
canvas.height = 400;
const ctx = canvas.getContext('2d');

ctx.fillStyle='#000';
ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

ctx.fillStyle = 'rgba(255,255,255)';
ctx.fillRect(100, 100, 15, 15);

ctx.fillStyle = 'rgba(155,255,55)';
ctx.fillRect(200, 200, 15, 15);

document.body.appendChild(canvas);

console.log("hello");