var express = require('express');
var router = express.Router();
const Recipe = require('../models/recipeModel');

/* GET users listing. */
router.get('/', async (req, res) => {
  try {
    const {opinion, ingredient} = req.query;

    let recipes;

    if (!opinion && !ingredient) {
      recipes = await Recipe.find()
    }
    else if (!ingredient && opinion) {
      recipes = await Recipe.find({opinion: opinion})
    }
    else if (!opinion && ingredient) {
      recipes = await Recipe.find({ingredients:{$elemMatch: {$eq: ingredient}}})
    }
    else {
      recipes = await Recipe.find({$and:[{ingredients:{$elemMatch: {$eq: ingredient}}}, {opinion: opinion}]})
    }

    res.json(recipes)
  }
  catch (error) {
    console.error(`MongoDB error: ${error}`);
    res.status(500).json({message: 'Something went wrong'});
  }
});

router.get('/:id', async (req, res) => {
  try {
    const recipes = await Recipe.findById(req.params.id)
    res.json(recipes)
  }
  catch (error) {
    console.error(`MongoDB error: ${error}`);
    res.status(500).json({message: 'Something went wrong'});
  }
})

router.post('/', async (req, res) => {
  try {
    const { name, ingredients, description, opinion } = req.body;

    if (!name || !ingredients || !description || !opinion) {
      return res.status(400).json({message: `Missing required field`});
    }

    const recipe = new Recipe({
      name,
      ingredients,
      description,
      opinion
    })

    const newRecipe = await recipe.save();

    res.status(201).json(newRecipe);
  } catch (error) {
    console.error(`MongoDB error: ${error}`);
    res.status(500).json({message: 'Something went wrong'});
  }
})

router.put('/:id', async (req, res) => {
  try {
    const {id} = req.params;
    const { name, ingredients, description, opinion } = req.body;

    if (!name || !ingredients || !description || !opinion) {
      return res.status(400).json({message: `Missing required field`});
    }

    const recipe = await Recipe.findByIdAndUpdate(
        id,
        {name, ingredients, description, opinion},
        {new:true, runValidators:true}
    )

    if (!recipe) {
      return res.status(404).json({message: `Recipe with id ${id} not found`});
    }

    res.status(200).json(recipe);

  } catch (error) {
    console.error(`MongoDB error: ${error}`);
    res.status(400).json({message: 'Something went wrong'});
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const {id} = req.params;

    const recipe = await Recipe.findByIdAndDelete(id)

    if (!recipe) {
      return res.status(404).json({message: `Recipe with id ${id} not found`});
    }

    res.status(200).json({message:"Deleted recipe ",recipe});
  } catch (error) {
    console.error(`MongoDB error: ${error}`);
  }
})

module.exports = router;
