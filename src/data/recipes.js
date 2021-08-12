export default {
  products: [
    {
      name: "Salad",
      shapes: [
        [
          [ 0, 0 ],
          [ 1, 1 ]
        ],
        [
          [ 0, 1 ],
          [ 1, 1 ]
        ]
      ]
    },
    {
      name: "Dessert",
      shapes: [
        [
          [ 2, 2, 0 ],
          [ 1, 1, 0 ],
          [ 0, 1, 0 ]
        ],
        [
          [ 1, 1, 0 ],
          [ 1, 1, 0 ],
          [ 0, 0, 2 ]
        ],
        [
          [ 1, 2 ],
          [ 2, 1 ]
        ]
      ]
    },
    {
      name: "Nectar",
      shapes: [
        [
          [ 0, 0, 2 ],
          [ 1, 2, 2 ],
          [ 1, 3, 3 ]
        ],
        [
          [ 0, 3, 2 ],
          [ 1, 1, 2 ],
          [ 1, 2, 2 ]
        ]
      ]
    }
  ],
  getMap (recipe) {
    return recipe.map((row) => row.map((elem) => elem == null ? 0 : 1))
  }
}
