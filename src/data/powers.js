export default {
  godPowers: [
    {
      name: "Varuna",
      description: "Indic God of the ocean",
      powerType: "REJUVENATE",
      shapes: [
        {
          shape: [
            [ 0, 0, 0 ],
            [ 1, 1, 1 ],
            [ 0, 0, 0 ],
          ],
          cost: [1, 0, 0]
        },
        {
          shape: [
            [ 1, 1, 1 ],
            [ 1, 1, 1 ],
            [ 1, 1, 1 ],
          ],
          cost: [1, 1, 0]
        },
      ],
    },
    {
      name: "Agni",
      description: "Indic God of fire",
      powerType: "BURN",
      shapes: [
        {
          shape: [
            [ 0, 0, 0 ],
            [ 0, 1, 0 ],
            [ 0, 0, 0 ],
          ],
          cost: [0, 1, 0]
        }
      ],
    },
    {
      name: "Himavat",
      description: "Mountain God of the Himalayas",
      powerType: "GUARD",
      shapes: [
        {
          shape: [
            [ 0, 1, 0 ],
            [ 1, 1, 1 ],
            [ 0, 1, 0 ],
          ],
          cost: [1, 0, 0]
        }
      ],
    },
  ],
  godPowerClasses: {
    "REJUVENATE": "shiny-blue",
    "BURN": "shiny-red",
    "GUARD": "shiny-green"
  },
  godPowerDescriptions: {
    "REJUVENATE": "Restores previously harvested land",
    "BURN": "Burns opponent's land",
    "GUARD": "Prevents opponents from burning your land"
  }
}
