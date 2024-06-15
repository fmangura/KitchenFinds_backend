const express = require('express')
const db = require('../db')
const bcrypt = require('bcrypt')
const {BadRequestError, UnauthorizedError} = require('../expressErrors')
const Spoonacular = require('../services/spoonacularAPI')

class Recipes {
    /**
     * 
     * @param {*} recipe_id 
     * If recipe is in database, return info else look for it in API
     * @returns Obj {id: , img: , name: , allIngr: []}
     */
    static async getRecipe(recipe_id) {
        const result = await db.query(
            ` SELECT *
                FROM recipes
                WHERE ref_id = $1`, [recipe_id])

        if (!result.rows[0]){
            let APIresults = await Spoonacular.getRecipeAPI(recipe_id)
            if (!APIresults) throw new BadRequestError('Recipe Not Found')
            return APIresults
        }
        
        return result.rows[0].recipe_data
    }

    static async getAllInDB() {
        const result = await db.query(
            `SELECT * FROM recipes`
        )
        return result.rows
    }

    /** Search database for recipes containing any of the listed ingredients; returns list of resipe_data
     * 
     * ([...ingredients]) => [ {id: , img: , name: , allIngr: []} ]
     * 
     */

    static async searchByDBIngredients(ingredients) {
        ingredients = ingredients.map((item) => item.toLowerCase())
        const result = await db.query(
            ` SELECT recipe_data
                FROM recipes
                WHERE (recipe_data->'allIngr') ?| $1`, [ingredients])
        let recipes = result.rows.map((item) => item.recipe_data)
        return recipes
    }

    /** Gets ALL recipes linked to user from user_recipe table
     * 
     * (username) => [ {id: , img: , name: , allIngr: []} , ... ]
     * 
     */

    static async getUserRecipes(username) {
        const result = await db.query(
            `SELECT r.recipe_data
                FROM users as u
                    LEFT JOIN user_recipe AS ur
                        ON u.username = ur.user_id
                    LEFT JOIN recipes AS r
                        ON ur.recipe = r.ref_id
                WHERE u.username=$1`, [username]);
        let recipes = result.rows.map((item) => item.recipe_data)
        return recipes
    }

    static async addToUserRecipes(username, ref_id) {
        await db.query(
            `INSERT INTO user_recipe(user_id, recipe)
                    VALUES ($1, $2)`, [username, ref_id]);
        
        let userRecipes = await this.getUserRecipes(username)
        return userRecipes;
    }

    static async delFromUserRecipes(username, ref_id) {
        await db.query(
            `DELETE FROM user_recipe 
            WHERE user_id=$1 AND recipe=$2`, [username, ref_id]);

        let userRecipes = await this.getUserRecipes(username)
        return userRecipes;
    }

    /** Generic add recipe to db
     * 
     * (id, name, data.json) => {'Recipe successfully added to database'}
     * 
     * Can be used to add recipes from API or Custom
     * 
     */

    static async addRecipetoDB(ref_id, name, data) {
        const dupeCheck = await db.query(
            `SELECT ref_id
                FROM recipes
                WHERE ref_id=$1`, [ref_id]);
        if (dupeCheck.rows[0]) return

        db.query(
            `INSERT INTO recipes
                        (ref_id,   
                         name,
                         recipe_data)
                    VALUES ($1, $2, $3)`, [ref_id, name, data]);

        return ('Recipe successfully added to database', 200)
    }

    static async getIngredientsInDB() {
        const result = await db.query(
            `SELECT (recipe_data->'allIngr') AS allIngr
                FROM recipes`)

        let ingredients = new Set()

        for (let list of result.rows){
            for (let ingr of list['allingr']) {
                ingredients.add(ingr)
            }
        }

        return ingredients
    }
};

module.exports = Recipes;