const express = require('express');
const router = express.Router();

const {
        ctrlGetRecipe,
        ctrlSearchByIngredients,
        ctrlGetInstructions,
        getSuggest
    } = require('../controllers/recipeControllers')

const { faveRecipe, delFave } = require('../controllers/userControllers')

const {
    authenticateJWT,
    ensureLoggedIn,
  } = require('../middlewares/auth')

router.get('/getRecipe/:ref_id', ensureLoggedIn, ctrlGetRecipe)
router.get('/search', ensureLoggedIn, ctrlSearchByIngredients)
router.get('/instructions/:ref_id', ensureLoggedIn, ctrlGetInstructions)
router.post('/:ref_id/fave', ensureLoggedIn, faveRecipe)
router.delete('/:ref_id', ensureLoggedIn, delFave)
router.post('/suggestions', getSuggest)



module.exports = router;