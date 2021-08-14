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
            idx: 0
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
            idx: 1
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
            idx: 2
        }
    ],
    powerList: [
        {
            name: "Varuna",
            description: "Indic God of the ocean",
            powerType: "REJUVENATE",
            shape: [
                [ 1, 1, 0 ],
                [ 1, 1, 0 ],
                [ 0, 0, 0 ]
            ],
            cost: [1, 0, 0]
        },
        {
            name: "Agni",
            description: "Indic God of fire",
            powerType: "BURN",
            shape: [
                [ 0, 0, 0 ],
                [ 0, 1, 0 ],
                [ 0, 0, 0 ],
            ],
            cost: [2, 0, 0]
        },
        {
            name: "Himavat",
            description: "Mountain God of the Himalayas",
            powerType: "GUARD",
            shape: [
                [ 0, 1, 0 ],
                [ 1, 1, 1 ],
                [ 0, 1, 0 ],
            ],
            cost: [1, 0, 0]
        }
    ]
}
