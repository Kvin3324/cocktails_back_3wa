const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const CocktailsSchema = new Schema({
  name: String,
  description: String,
  img: String,
  ingredients: Array,
  recipe: Array,
})

  module.exports = mongoose.model('Cocktails', CocktailsSchema);