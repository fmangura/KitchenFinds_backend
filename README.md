# KitchenFinds - Backend

Foobar is a Python library for dealing with word pluralization.

## Routes
### Users
Creates new user
```bash
POST /users/register
```
Verifies login info and returns authorization token and user
```bash
POST /users/login
```
Returns all recipes saved by user
```bash
GET /users/myrecipes
```
Deletes user with correct token, username, password
```bash
DELETE /users/:username
```

### Recipes
Searches database for recipe information; else searches API
```bash
GET recipes/getRecipe/:ref_id
```
Searches API via 'ingredients' list in parameter, returns list of recipe info
```bash
GET recipes/search?ingredients=...,
```
Returns full recipe instructions of a single recipe
```bash
GET recipes/instructions/:ref_id
```
Adds recipe to current logged in user's fave
```bash
POST recipes/:ref_id/fave
```
Takes a word and searches API for suggested ingredients
```bash
POST recipes/suggestions
```

### Usage
Input your own keys into a .env file.
```bash
SPOONACULAR_KEY=
SECRET_KEY=
NODE_ENV=
```
