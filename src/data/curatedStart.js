export default {
    recipeList: [
        {
            name: "Salad",
            shape: [
                [ 0, 0 ],
                [ 1, 1 ]
            ],
            type: [
                [ "null", "null" ],
                [ "brown", "brown" ]
            ],
            vp: 4
        },
        {
            name: "Dessert",
            shape: [
                [ 1, 1, 0 ],
                [ 1, 1, 0 ],
                [ 0, 1, 0 ]
            ],
            type: [
                [ "brown", "brown", "null" ],
                [ "green", "green", "null" ],
                [ "null", "green", "null" ]
            ],
            vp: 15
        },
        {
            name: "Nectar",
            shape: [
                [ 0, 1, 1 ],
                [ 1, 1, 1 ],
                [ 1, 1, 1 ]
            ],
            type: [
                [ "null", "brown", "green" ],
                [ "yellow", "yellow", "green" ],
                [ "yellow", "green", "green" ]
            ],
            vp: 25
        }
    ],
    powerList: [
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
        }
    ]
}
