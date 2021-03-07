class Vertex {
  constructor(x, y, z){
    this.x = parseFloat(x);
    this.y = parseFloat(y);
    this.z = parseFloat(z);
  }
};
// const A = new Vertex(10, 20, 0.5);
// console.log('A.x: ',A.x);

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

const cube = new Cube(new Vertex(0, 0, 0), 200);
console.log('cube:', cube);