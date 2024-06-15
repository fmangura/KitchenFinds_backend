DROP TABLE IF EXISTS user_recipe;
DROP TABLE IF EXISTS recipes;
DROP TABLE IF EXISTS users;


CREATE TABLE recipes (
    id SERIAL PRIMARY KEY,
    ref_id INTEGER UNIQUE NOT NULL,
    name TEXT NOT NULL,
    recipe_data JSONB
);

CREATE TABLE users (
  username VARCHAR(25) PRIMARY KEY,
  password TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL
    CHECK (position('@' IN email) > 1),
    last_activity JSON,
  is_admin BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE user_recipe (
    user_id TEXT NOT NULL REFERENCES users (username) ON DELETE CASCADE,
    recipe INTEGER NOT NULL REFERENCES recipes (ref_id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, recipe)
);