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
        },
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
    }
  ],
  godPowerClasses: {
    "REJUVENATE": "shiny-blue",
    "BURN": "shiny-red"
  }
}
