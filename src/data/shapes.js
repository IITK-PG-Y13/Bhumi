export default {
  j: [
    [ 1, 0, 0 ],
    [ 1, 1, 1 ],
    [ 0, 0, 0 ]
  ],
  l: [
    [ 0, 0, 0 ],
    [ 1, 1, 1 ],
    [ 1, 0, 0 ]
  ],
  s: [
    [ 1, 0, 0 ],
    [ 1, 1, 0 ],
    [ 0, 1, 0 ]
  ],
  z: [
    [ 0, 1, 0 ],
    [ 1, 1, 0 ],
    [ 1, 0, 0 ]
  ],
  b: [
    [ 1, 1, 0 ],
    [ 1, 1, 0 ],
    [ 0, 0, 0 ]
  ],
  t: [
    [ 1, 0, 0 ],
    [ 1, 1, 1 ],
    [ 1, 0, 0 ]
  ],
  rotate (matrix) {
    return matrix[0].map((val, index) => matrix.map(row => row[index]).reverse());
  },
  flip (matrix) {
    return matrix.map((val, index) => val.map((v) => v).reverse());
  }
}
