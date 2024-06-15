"use strict";

require("dotenv").config();
require('colors')

const SECRET_KEY = process.env.SECRET_KEY;

const PORT = +process.env.PORT || 3001;

const SPOONACULAR_KEY = process.env.SPOONACULAR_KEY;

// Use dev database, testing database, or via env var, production database
function getDatabaseUri() {
  return (process.env.NODE_ENV === "test")
      ? "postgresql:///kitchenfinds_test"
      : process.env.DATABASE_URL || "postgresql:///kitchenfinds";
}

const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === "test" ? 1 : 12;

console.log("KitchenFinds Config:".green);
console.log("SECRET_KEY:".yellow, SECRET_KEY);
console.log("PORT:".yellow, PORT.toString());
console.log("BCRYPT_WORK_FACTOR".yellow, BCRYPT_WORK_FACTOR);
console.log("Database:".yellow, getDatabaseUri());
console.log("---");

module.exports = {
  SECRET_KEY,
  PORT,
  BCRYPT_WORK_FACTOR,
  getDatabaseUri,
  SPOONACULAR_KEY,
};