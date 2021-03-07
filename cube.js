class Vertex {
  constructor(x, y, z){
    this.x = parseFloat(x);
    this.y = parseFloat(y);
    this.z = parseFloat(z);
  }
};

const A = new Vertex(10, 20, 0.5);

console.log('A.x: ',A.x);