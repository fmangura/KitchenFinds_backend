const express = require('express')
const jsonschema = require('jsonschema')

const newUserSchema = require('../schemas/newUsers.json')

const User = require('../models/user')
const Recipes = require('../models/recipes')
const Spoonacular = require('../services/spoonacularAPI')

const { createToken } = require('../helpers/tokens')
const { BadRequestError, UnauthorizedError } = require('../expressErrors')

/** Controls POST ('/users/login', body: {username, password})
 * 
 * Returns {token} containing token.payload of user information
 */

const login = async function(req, res, next) {
    try {
        let user = await User.authenticateUser(req.body.username, req.body.password)

        if (user) {
            let token = createToken(user)

            return (res.json({token: token, user: user.username}))
        }

    } catch (err) {
        return next(err)
    }
}

/** Controls POST ('/users/register', body: {username, password, first_name, last_name, email})
 * 
 * Returns success message
 */

const ctrlRegister = async function(req, res, next) {
    try {
        let validator = jsonschema.validate(req.body, newUserSchema);
        if (validator) {
            let {username, password, first_name, last_name, email} = req.body
            let response = await User.register(username, password, first_name, last_name, email)
            return (res.json(response))
        } else {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }
    } catch (err) {
        return next(err)
    }
}

/** Controls GET ('/users/myrecipes', headers: {token: })
 * 
 * Return [{recipes}, ...{recipes}]
 */

const ctrlUserRecipes = async function(req, res, next) {
    try {
        let data = await Recipes.getUserRecipes(res.locals.user.username)
        return res.json(data)
    } catch (err) {
        return next(err)
    }
}

/** Controls POST ('/recipes/:ref_id/fave')
 * 
 * Searches for recipe
 * Checks if in DB ? continue : add to db
 * Connects logged in user and recipe
 * 
 * Returns user recipes
 */

const faveRecipe = async function (req, res, next) {
    try {
        let thisRecipe = await Recipes.getRecipe(req.params.ref_id)

        let all = await Recipes.getAllInDB()
        all = all.map((item) => item.ref_id)

        if (!(thisRecipe.id in all)){
            await Recipes.addRecipetoDB(thisRecipe.id, thisRecipe.name, thisRecipe)
        }

        let recipe = await Recipes.addToUserRecipes(res.locals.user.username, req.params.ref_id)

        return res.json(recipe)
    } catch (err) {
        return next(err)
    }
}

const delFave = async function (req, res, next) {
    try {
        let delRecipe = await Recipes.delFromUserRecipes(res.locals.user.username, req.params.ref_id)
        return res.json(delRecipe)
    } catch (err) {
        return next(err)
    }
}

/** Controls DELETE ('/users/:username')
 * 
 * Requires token and body {username, password}
 * 
 * Returns msg 
 */

const deleteUser = async function (req, res, next) {
    try {
        let valid = await User.authenticateUser(res.locals.user.username, req.body.password)

        let delmsg = await User.delUser(res.locals.user.username)

        return res.json(delmsg)
    } catch (err) {
        return next(err)
    }
}

module.exports = {
    login,
    ctrlUserRecipes,
    ctrlRegister,
    faveRecipe,
    deleteUser,
    delFave,
}