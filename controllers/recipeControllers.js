const Recipes = require('../models/recipes')
const Spoonacular = require('../services/spoonacularAPI')

const { createToken } = require('../helpers/tokens')
const { BadRequestError } = require('../expressErrors')

/** Controls GET ('recipes/getRecipe/:ref_id')
 * 
 * Returns {ingredients}
 */

const ctrlGetRecipe = async function (req, res, next) {
    try {
        let recipe = await Recipes.getRecipe(req.params.ref_id)
        return res.json(recipe)
    } catch (err) {
        return next(err)
    }
}

/** Controls GET ('recipes/search', {params: { ingredients: [list] } })
 * 
 * If recipes in database is less than 10, add in API list
 * 
 * Returns [...{recipes}]
 */

const ctrlSearchByIngredients = async function (req, res, next) {
    try {
        let recipes = await Recipes.searchByDBIngredients(req.query.ingredients.split(','))

        if (recipes.length < 10) {
            let amount = (10 - recipes.length)  
            let apiResult = await Spoonacular.findByIngredients(req.query.ingredients.split(','), amount)
            let totalList = recipes.concat(apiResult)
            return res.json(totalList)
        }
        return res.json(recipes)

    } catch (err) {
        return next(err)
    }
}

/** Controls GET ('/recipes/instructions/:ref_id')
 * 
 * 
 * Returns { instructions }
 */

const ctrlGetInstructions = async function (req, res, next) {
    try {
        let recipe = await Spoonacular.getInstructions(req.params.ref_id)
        return res.json(recipe)
    } catch (err) {
        return next(err)
    }
}

const getSuggest = async function (req, res, next) {
    try {
        let item = await Spoonacular.getSuggestions(req.body.item)
        return res.json(item)
    } catch (err) {
        return next(err)
    }
}

module.exports = {
    ctrlGetRecipe,
    ctrlSearchByIngredients,
    ctrlGetInstructions,
    getSuggest,
}