const express = require('express');
const router = express.Router();
const {
    authenticateJWT,
    ensureLoggedIn,
  } = require('../middlewares/auth')

const { login,
        ctrlUserRecipes,
        ctrlRegister,
        deleteUser
} = require('../controllers/userControllers');


router.post('/login', login);
router.post('/register', ctrlRegister);
router.get('/myrecipes', authenticateJWT, ensureLoggedIn, ctrlUserRecipes);
router.delete('/:user_id', authenticateJWT, ensureLoggedIn, deleteUser);

module.exports = router;