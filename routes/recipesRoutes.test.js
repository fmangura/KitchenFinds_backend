const express = require('express')
const request = require('supertest')
const app = require('../app')
const Spoonacular = require('../services/spoonacularAPI')
const Recipes = require('../models/recipes')
const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
  } = require("../models/_testCommon");
  
beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

jest.mock('../services/spoonacularAPI')

describe('Test recipe routes interact with database AND API', () => {
    test('/recipes/getRecipe/:ref_id', async () => {
        const user = await request(app)
            .post('/users/login')
            .send({
                username:'u1', 
                password:'password1', 
            })
        let resp = await request(app)
                .get('/recipes/getRecipe/123196')
                .set('authorization', `${user.body.token}`)
        expect(resp.body.id).toEqual(123196)
    })

    test('/recipes/search', async () => {
        Spoonacular.findByIngredients.mockReturnValue(Promise.resolve({
                id: 1111,
                img: '',
                name: 'testRecipe3',
                allIngr: [ 'cornstarch', 'green onions' ]
          }));
        
        const user = await request(app)
        .post('/users/login')
        .send({
            username:'u1', 
            password:'password1', 
        })
        let resp = await request(app)
                .get('/recipes/search')
                .query({ingredients:'cornstarch'})
                .set('authorization', `${user.body.token}`)
        expect(resp.body.length).toEqual(3)
    })

    test('/instructions/:ref_id', async () => {
        Spoonacular.getInstructions.mockReturnValue(Promise.resolve({
            id : 1234,
            name: 'Test Recipe',
            img: '',
            allIngr : ['test']
          }));
        
        const user = await request(app)
            .post('/users/login')
            .send({
                username:'u1', 
                password:'password1', 
            })
        let resp = await request(app)
                .get('/recipes/instructions/1234')
                .set('authorization', `${user.body.token}`)
        expect(resp.body.id).toEqual(1234)
    })

    test('/recipes/:ref_id/fave works and deletes', async () => {
        const user = await request(app)
            .post('/users/login')
            .send({
                username:'u2', 
                password:'password2', 
            })

            await request(app)
            .post('/recipes/123196/fave')
            .set('authorization', `${user.body.token}`)

        let userRecipes = await Recipes.getUserRecipes('u2')
        expect(userRecipes.length).toEqual(1)
        expect(userRecipes[0].id).toEqual(123196)
        
        let res = await request(app)
            .delete('/recipes/123196')
            .set('authorization', `${user.body.token}`)
        expect(res.statusCode).toEqual(200)

    })
})

