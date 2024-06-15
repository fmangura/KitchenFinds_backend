const express = require('express')
const Recipe = require('./recipes')
const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
    testRecipe_data,
  } = require("./_testCommon");
  
beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe('Test recipe model functions', function(){
    test('getUserRecipes func works', async function(){
        let testresult = await Recipe.getUserRecipes('u1');
        expect(testresult.length).toEqual(2);
        expect(testresult).toEqual(
            expect.arrayContaining([
                expect.objectContaining(testRecipe_data)
            ])
        );
    })

    test('searchByDBIngredients func works', async function(){
        let testresult = await Recipe.searchByDBIngredients(['silken tofu']);
        expect(testresult.length).toEqual(1);
        expect(testresult).toEqual(
            expect.arrayContaining([
                expect.objectContaining(testRecipe_data)
            ])
        );
    })

    test('getRecipe func works', async function(){
        let testresult = await Recipe.getRecipe(123196);
        expect(testresult).toEqual(testRecipe_data);
    })

    // test('getIngredientsInDB func works', async function(){
    //     let testresult = await Recipe.getIngredientsInDB();
    //     expect(testresult).toBe(obj);
    // })
})