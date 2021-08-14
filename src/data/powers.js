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
          cost: 1
        },
        {
          shape: [
            [ 0, 1, 0 ],
            [ 1, 1, 0 ],
            [ 0, 0, 0 ],
          ],
          cost: 1
        },
        {
          shape: [
            [ 1, 1, 1 ],
            [ 1, 1, 1 ],
            [ 1, 1, 1 ],
          ],
          cost: 2
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
          cost: 2
        },
        {
          shape: [
            [ 1, 0, 0 ],
            [ 0, 1, 0 ],
            [ 0, 0, 1 ],
          ],
          cost: 4
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
            [ 1, 1, 0 ],
            [ 0, 1, 0 ],
            [ 0, 1, 1 ],
          ],
          cost: 1
        },
        {
          shape: [
            [ 0, 1, 0 ],
            [ 1, 1, 1 ],
            [ 0, 1, 0 ],
          ],
          cost: 1
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
