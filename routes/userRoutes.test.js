const express = require('express')
const request = require('supertest')
const app = require('../app')

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

describe('Test user routes', () => {
    test('/users/register works', async () => {
        const resp = await request(app)
            .post('/users/register')
            .send({
                username:'testUser', 
                password:'passwordtest', 
                first_name:'test', 
                last_name:'test', 
                email:'test@email.com'
            })
        expect(resp.statusCode).toEqual(200)
    })

    test('/users/login works', async () => {
        const resp = await request(app)
            .post('/users/login')
            .send({
                username:'u1', 
                password:'password1', 
            })
        expect(resp.statusCode).toEqual(200)
        expect(resp.body.user).toEqual('u1')
    })

    test('/users/myrecipes works', async () => {
        const user = await request(app)
            .post('/users/login')
            .send({
                username:'u1', 
                password:'password1', 
            })
        const resp = await request(app)
            .get('/users/myrecipes')
            .set('authorization', `${user.body.token}`)
        expect(resp.statusCode).toEqual(200)
        expect(resp.body.length).toEqual(2)
    })
})