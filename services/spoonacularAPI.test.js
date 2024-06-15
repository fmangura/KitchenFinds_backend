const express = require('express')
const Spoonacular = require('./spoonacularAPI')

describe('Test API functions', function(){
    test('findByIngredients func works', async function(){
        let testresult = await Spoonacular.findByIngredients(['kimchi', 'tofu']);
    })

    test('getInstructions func works', async function(){
        let testresult = await Spoonacular.getInstructions(649029);
    })
})