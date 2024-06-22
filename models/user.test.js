const express = require('express')
const db = require('../db')
const User = require('./user')
const {BadRequestError, UnauthorizedError} = require('../expressErrors')
const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
  } = require("./_testCommon");
  
beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe('Test user model functions', function(){
    test('register func works', async function(){
        let testresult = await User.register('testinguser', 'password3', 'test1', 'last1', 'test@email.com' );
        expect(testresult.code).toEqual(200);
        
        let newUser = await User.authenticateUser('testinguser', 'password3');
        expect(newUser.username).toEqual('testinguser');
    })

    test('authenticateUser func works: CORRECT INFO', async function(){
        let testresult = await User.authenticateUser('u1','password1');
        expect(testresult.username).toEqual('u1');
    })

    // test('authenticateUser func works: INCORRECT INFO', async function(){
    //     expect(await User.authenticateUser('u1','WRONG')).toThrow('Invalid username/password');
    // })

})