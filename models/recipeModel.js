const mongoose = require('mongoose')

const RecipeSchema = new mongoose.Schema({
    name: {type: String, required: true},
    ingredients: {type: [String], required: true},
    description: {type: String, required: true},
    opinion: {type: Number, required: true, min: 1, max: 5},
})

module.exports = mongoose.model('Recipe', RecipeSchema)