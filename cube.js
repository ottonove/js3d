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
	console.log("render start");

  // Clear the previous frame
	ctx.clearRect(0, 0, 2*dx, 2*dy);

	// For each object
	for (var i = 0, n_obj = objects.length; i < n_obj; ++i) {
		// For each face
		for (var j = 0, n_faces = objects[i].faces.length; j < n_faces; ++j) {
			// Current face
			var face = objects[i].faces[j];

			// Draw the first vertex
			var P = project(face[0]);
			ctx.beginPath();
			ctx.moveTo(P.x + dx, -P.y + dy);

			// Draw the other vertices
			for (var k = 1, n_vertices = face.length; k < n_vertices; ++k) {
				P = project(face[k]);
				ctx.lineTo(P.x + dx, -P.y + dy);
			}

			// Close the path and draw the face
			ctx.closePath();
			ctx.stroke();
			ctx.fill();
		}
	}
};

const animate = () => {
  console.log('animate');
  window.requestAnimationFrame(animate);
};

const init = () => {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');

  const dx = canvas.width / 2;
  const dy = canvas.height / 2;

  const cube_center = new Vertex(0, 11*dy/10, 0);
  const cube = new Cube(cube_center, dy);
  const objects = [cube];

  render(objects, ctx, dx, dy);
  animate();
};

init();