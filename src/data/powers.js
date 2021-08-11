export default {
  godPowers: [
    {
      powers: [
        {
          name: "Sindhu",
          description: "Goddess of the Indus river",
          shape: [
            [ 0, 0, 0 ],
            [ 1, 1, 1 ],
            [ 0, 0, 0 ],
          ],
          powerType: "REJUVENATE",
          cost: [1, 0, 0]
        },
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
        },
      ],
    },
    {
      powers: [
        {
          name: "Agni",
          description: "Indic God of fire",
          shape: [
            [ 0, 0, 0 ],
            [ 0, 1, 0 ],
            [ 0, 0, 0 ],
          ],
          powerType: "BURN",
          cost: [0, 1, 0]
        }
      ],
    },
    {
      powers: [
        {
          name: "Himavat",
          description: "Mountain God of the Himalayas",
          shape: [
            [ 0, 1, 0 ],
            [ 1, 1, 1 ],
            [ 0, 1, 0 ],
          ],
          powerType: "GUARD",
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
