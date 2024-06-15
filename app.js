"use strict";

const express = require("express");
const { NotFoundError } = require("./expressErrors");
const userRoutes = require('./routes/userRoutes')
const recipesRoutes = require('./routes/recipesRoutes')

const app = express();
const cors = require("cors");
const {
    authenticateJWT,
    ensureLoggedIn,
  } = require('./middlewares/auth')

app.use(cors());
app.use(express.json());
app.use('/users', userRoutes)
app.use('/recipes', authenticateJWT, recipesRoutes)

app.use(function (req, res, next) {
    return next(new NotFoundError());
  });
  
app.use(function (err, req, res, next) {
    if (process.env.NODE_ENV !== "test") console.error(err.stack);
    const status = err.status || 500;
    const message = err.message;

    return res.status(status).json({
        error: { message, status },
    });
});

module.exports = app