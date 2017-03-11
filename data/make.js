process.chdir(__dirname);
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./data.db');
const items = [];
const recipes = [];

function sanitizeResponse(item) {
  // hack for navicat's dirty input
  return Object.keys(item)
    .reduce((o, key) => {
      const obj = o;
      obj[key] = item[key];
      if (typeof obj[key] === 'string') {
        obj[key] = obj[key].replace(/\r?\n|\r/g, ' ');
      }
      if (key === 'id') {
        obj[key] = obj[key].replace(/\s+/g, '');
      }
      return obj;
    }, {});
}

function parseItem(err, row) {
  const item = sanitizeResponse(row);

  if (item.classes) {
    item.classes = item.classes.split(', ');
  }
  items.push(item);
}

function dumpItems() {
  fs.writeFileSync('./items.json', JSON.stringify(items, null, 2), 'utf-8');
}

function parseRecipe(err, row) {
  const recipe = sanitizeResponse(row);
  recipe.buff = {};

  if (recipe.buff_name) {
    recipe.buff.name = recipe.buff_name;
    delete recipe.buff_name;
  }

  if (recipe.buff_duration) {
    recipe.buff.duration = recipe.buff_duration;
    delete recipe.buff_duration;
  }

  if (recipe.buff_value) {
    recipe.buff.value = recipe.buff_value;
    delete recipe.buff_value;
  }

  recipe.ingredients = JSON.parse(recipe.ingredients);
  recipes.push(recipe);
}

function dumpRecipes() {
  fs.writeFileSync('./recipes.json', JSON.stringify(recipes, null, 2), 'utf-8');
}

db.each('SELECT * FROM items', parseItem, dumpItems);
db.each('SELECT * FROM recipes', parseRecipe, dumpRecipes);
db.close();
