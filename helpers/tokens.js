const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

function createToken(user) {

  return jwt.sign(user, SECRET_KEY);
}

module.exports = { createToken };