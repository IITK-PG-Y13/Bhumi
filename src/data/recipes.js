export default {
  products: [
    {
      name: "Potatoes",
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
      name: "Strawberries",
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
  godPowers: [
    {
      powers: [
        {
          name: "Poseidon",
          description: "Olympic God of the sea",
          shape: [
            [ 0, 0, 0 ],
            [ 1, 1, 1 ],
            [ 0, 0, 0 ],
          ],
          powerType: "REJUVENATE",
          cost: [1, 0, 0]
        }
      ],
    },
    {
      powers: [
        {
          name: "Varuna",
          description: "Indic God of the ocean",
          shape: [
            [ 1, 1, 1 ],
            [ 1, 1, 1 ],
            [ 1, 1, 1 ],
          ],
          powerType: "REJUVENATE",
          cost: [1, 1, 0]
        }
      ],
    }
  ],
  getMap (recipe) {
    return recipe.map((row) => row.map((elem) => elem == null ? 0 : 1))
  }
}
