export default {
  shapes: {
    j: [
      [ 1, 0, 0 ],
      [ 1, 1, 1 ],
      [ 0, 0, 0 ]
    ],
    i: [
      [ 0, 0, 0 ],
      [ 1, 1, 1 ],
      [ 0, 0, 0 ]
    ],
    s: [
      [ 1, 0, 0 ],
      [ 1, 1, 0 ],
      [ 0, 1, 0 ]
    ],
    sl: [
      [ 0, 1, 0 ],
      [ 1, 1, 0 ],
      [ 0, 0, 0 ]
    ],
    l: [
      [ 1, 1, 1 ],
      [ 1, 0, 0 ],
      [ 1, 0, 0 ]
    ],
    b: [
      [ 1, 1, 0 ],
      [ 1, 1, 0 ],
      [ 0, 0, 0 ]
    ],
    t: [
      [ 0, 1, 0 ],
      [ 0, 1, 1 ],
      [ 0, 1, 0 ]
    ],
    bt: [
      [ 1, 0, 0 ],
      [ 1, 1, 1 ],
      [ 1, 0, 0 ]
    ]
  },
  get (shape) {
    return JSON.parse(JSON.stringify(this.shapes[shape]))
  },
  rotate (matrix) {
    return matrix[0].map((val, index) => matrix.map(row => row[index]).reverse());
  },
  flip (matrix) {
    return matrix.map((val, index) => val.map((v) => v).reverse());
  }
}
