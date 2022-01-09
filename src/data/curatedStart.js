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
    ]
}
