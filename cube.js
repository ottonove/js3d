class Vertex {
  constructor(x, y, z){
    this.x = parseFloat(x);
    this.y = parseFloat(y);
    this.z = parseFloat(z);
  }
};

class Vertex2D {
  constructor(x, y, z){
    this.x = parseFloat(x);
    this.y = parseFloat(y);
  }
};

/**
 * 立方体クラス          : Cube(new Vertex(0, 0, 0), 200)
 * new Vertex(0, 0, 0)  : 中心座標 x, y, z
 * 200                  : 1辺の長さ
 */
class Cube {
  constructor(center, size){
    // Generate the vertices
    const d = size / 2;

    this.vertices = [
        new Vertex(center.x - d, center.y - d, center.z + d),
        new Vertex(center.x - d, center.y - d, center.z - d),
        new Vertex(center.x + d, center.y - d, center.z - d),
        new Vertex(center.x + d, center.y - d, center.z + d),
        new Vertex(center.x + d, center.y + d, center.z + d),
        new Vertex(center.x + d, center.y + d, center.z - d),
        new Vertex(center.x - d, center.y + d, center.z - d),
        new Vertex(center.x - d, center.y + d, center.z + d)
    ];

    // Generate the faces
    this.faces = [
      [this.vertices[0], this.vertices[1], this.vertices[2], this.vertices[3]],
      [this.vertices[3], this.vertices[2], this.vertices[5], this.vertices[4]],
      [this.vertices[4], this.vertices[5], this.vertices[6], this.vertices[7]],
      [this.vertices[7], this.vertices[6], this.vertices[1], this.vertices[0]],
      [this.vertices[7], this.vertices[0], this.vertices[3], this.vertices[4]],
      [this.vertices[1], this.vertices[6], this.vertices[5], this.vertices[2]]
    ];
  }
};

const project = (M) => {
  return new Vertex2D(M.x, M.y);
};

const render = (objects, ctx, dx, dy) => {
	console.log("render");

  // Clear the previous frame
	ctx.clearRect(0, 0, 2*dx, 2*dy);

	// For each object
	for (let i = 0, n_obj = objects.length; i < n_obj; ++i) {
		// For each face
		for (let j = 0, n_faces = objects[i].faces.length; j < n_faces; ++j) {
			// Current face
			const face = objects[i].faces[j];

			// Draw the first vertex
			let P = project(face[0]);
			ctx.beginPath();
			ctx.moveTo(P.x + dx, -P.y + dy);

			// Draw the other vertices
			for (let k = 1, n_vertices = face.length; k < n_vertices; ++k) {
				P = project(face[k]); // 上の「let P」を「const」にして、ここも「const」にしても動作する。
				ctx.lineTo(P.x + dx, -P.y + dy);
			}

			// Close the path and draw the face
			ctx.closePath();
			ctx.stroke();
			ctx.fill();
		}
	}
};

const init = () => {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
	ctx.fillStyle = 'rgba(0, 150, 255, 0.3)';

  const dx = canvas.width / 2;
  const dy = canvas.height / 2;

  const cube_center = new Vertex(0, /* 11*dy/10 */0, 0);
  const cube = new Cube(cube_center, dy);
  const objects = [cube];

  const rotate = (M, center, theta, phi) => {
    // Rotation matrix coefficients
    const ct = Math.cos(theta);
    const st = Math.sin(theta);
    const cp = Math.cos(phi);
    const sp = Math.sin(phi);

    // Rotation
    const x = M.x - center.x;
    const y = M.y - center.y;
    const z = M.z - center.z;

    M.x = ct * x - st * cp * y + st * sp * z + center.x;
    M.y = st * x + ct * cp * y - ct * sp * z + center.y;
    M.z = sp * y + cp * z + center.z;
  }
  const animate = () => {
    for (let i = 0; i < 8; ++i) {
        rotate(cube.vertices[i], cube_center, -Math.PI / 720, Math.PI / 720);
    }
    render(objects, ctx, dx, dy);
    window.requestAnimationFrame(animate);
  };
  animate();
};

init();