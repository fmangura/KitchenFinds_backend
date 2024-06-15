const express = require('express')
const axios = require('axios')

const {SPOONACULAR_KEY} = require('../config')

const BASE_URL = 'https://api.spoonacular.com/recipes'

class Spoonacular {
    /** Get recipes from API using [ list of ingredients ], return filtered necessary data
     * 
     * [ ingredients ] => [ { id: , name: , img: , allIngr: }, 
     *                   ...{id: , ...} ]
     */
    static async findByIngredients(ingredients, amount) {
        const list_ingredients = ingredients.toString()
        const data = []
        return await axios.get(`${BASE_URL}/findByIngredients`, {params: {
            apiKey: SPOONACULAR_KEY,
            ingredients: list_ingredients,
            ignorePantry: true,
            ranking: 2,
            number: amount
        }})
        .then((res) => {
            for (let recipe of res.data) {
                let missing = recipe['missedIngredients'].map((ing) => ing['name'])
                let searched = recipe['usedIngredients'].map((ing) => ing['name'])
                data.push({
                    id: recipe['id'],
                    img: recipe['image'],
                    name: recipe['title'],
                    allIngr: missing.concat(searched),
                })
            }
            return data
        })
        .catch((err) => {return err})
    }

    /** Get recipe instructions from API using [ recipe_id ], return simplified version
     * 
     * [ id ] => { name: , 
     *              steps: [ {number: , 
     *                          step: ,
     *                                  }, 
     *                     ] 
     *            }
     * 
     */
    static async getInstructions(recipe_id) {
        return await axios.get(`${BASE_URL}/${recipe_id}/analyzedInstructions`, {params: {
                apiKey: SPOONACULAR_KEY,
                stepBreakdown: true
                }})
                .then((data) => {
                    let {steps} = data.data[0]
                    let newSteps = steps.map(item => {
                        return {...item,
                                'equipment': item.equipment.map(equip => equip.name), 
                                'ingredients': item.ingredients.map(ingr => ingr.name)}
                    })
                    return {
                            'steps': newSteps
                    }
                })
                .catch(err => {return err})
    }

    static async getRecipeAPI(recipe_id) {
        return await axios.get(`${BASE_URL}/${recipe_id}/information`, {params: {
            apiKey: SPOONACULAR_KEY,
            includeNutrition: false,
            addWinePairing: false
            }})
            .then((data) => {
                return {
                    'id' : data.data.id,
                    'name': data.data.title,
                    'img': data.data.image,
                    'allIngr' : data.data['extendedIngredients'].map((ing) => ing['name'])
                }
            })
            .catch(err => {return null})
    }

    static async getSuggestions(item) {
        return await axios.get(`https://api.spoonacular.com/food/ingredients/autocomplete`, 
            {params: {
                apiKey: SPOONACULAR_KEY,
                query: item,
                number: 5
            }})
            .then((res) => {
                let suggestions = res.data
                return suggestions.map(item => item.name);
            })
            .catch(err => {return null})
    }
}

module.exports = Spoonacular;