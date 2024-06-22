const express = require('express')
const {BCRYPT_WORK_FACTOR} = require('../config')
const db = require('../db')
const bcrypt = require('bcrypt')

const testRecipe_data = { 'id': 123196,
                            'name': 'testRecipe',
                            'img': '',
                            'allIngr': [ 'cornstarch', 'green onions', 'hoisin sauce', 'silken tofu' ]}

const testRecipe_data2 = { 'id': 10697,
                            'name': 'testRecipe2',
                            'img': '',
                            'allIngr': [ 'cornstarch', 'green onions' ]}

async function commonBeforeAll() {
    await db.query("DELETE FROM users cascade");
    await db.query("DELETE FROM recipes cascade");

    await db.query(`
          INSERT INTO users(username,
                            password,
                            first_name,
                            last_name,
                            email)
          VALUES ('u1', $1, 'U1F', 'U1L', 'u1@email.com'),
                 ('u2', $2, 'U2F', 'U2L', 'u2@email.com')
          RETURNING username`,
        [
          await bcrypt.hash("password1", BCRYPT_WORK_FACTOR),
          await bcrypt.hash("password2", BCRYPT_WORK_FACTOR),
        ]);
  
    await db.query(`
          INSERT INTO recipes(ref_id, name, recipe_data)
          VALUES (123196, 'testRecipe', $1),
                 (010697, 'testRecipe2', $2)`, [testRecipe_data, testRecipe_data2]);

    await db.query(`
        INSERT INTO user_recipe(user_id, recipe)
        VALUES ('u1', 123196),
                 ('u1', 010697)`);
}

async function commonBeforeEach() {
    await db.query("BEGIN");
  }
  
async function commonAfterEach() {
await db.query("ROLLBACK");

}
  
async function commonAfterAll() {
  await db.end();
}

module.exports = {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
    testRecipe_data,
  };