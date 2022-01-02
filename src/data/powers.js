export default {
  godPowers: [
    {
      name: "Varuna",
      description: "Indic God of the ocean",
      powerType: "REJUVENATE",
      cost: 1
    },
    {
      name: "Agni",
      description: "Indic God of fire",
      powerType: "BURN",
      cost: 10
    },
    {
      name: "Himavat",
      description: "Mountain God of the Himalayas",
      powerType: "GUARD",
      cost: 1
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
