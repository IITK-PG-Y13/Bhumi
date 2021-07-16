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
    ],
    c: [
      [ 1, 1, 0 ],
      [ 0, 1, 0 ],
      [ 1, 1, 0 ]
    ]
  },
  get (shape) {
    if (typeof shape == "string") {
        return JSON.parse(JSON.stringify(this.shapes[shape]))
    } else {
        return JSON.parse(JSON.stringify(shape))
    }
  },
  rotate (matrix) {
    return matrix[0].map((val, index) => matrix.map(row => row[index]).reverse());
  },
  flip (matrix) {
    return matrix.map((val, index) => val.map((v) => v).reverse());
  },
  getNew (shape, flip, rotate) {
    let newMatrix = this.get(shape)

    for (let i = 0; i < rotate; i++) {
      newMatrix = this.rotate(newMatrix)
    }

    if (flip > 0) {
      newMatrix = this.flip(newMatrix)
    }

    return newMatrix
  }
}
