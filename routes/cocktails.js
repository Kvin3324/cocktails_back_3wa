const mongoose = require('mongoose');
const router = require('express').Router();
const CocktailsSchema = require('../models/CocktailsSchema');
const cocktailsCollection =  mongoose.connection.collection('cocktails');


router.get('/', async (req, res) => {
    try {
      const result = await CocktailsSchema.find();

      return res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ error: "Something went wrong" });
    }
})

router.get('/:id', async (req, res) => {
    try {
      const result = await CocktailsSchema.findOne({_id: req.params.id});

      return res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ error: "Something went wrong" });
    }
})

router.post('/', async (req, res) => {
  try {
    await cocktailsCollection.insertOne(req.body);

    res.redirect('/cocktails');
  } catch (error) {
    res.status(400).json({ error: "Le cocktail n'a pas été créé"});
  }
})

router.put('/:id', async (req, res) => {
  try {
    const editCocktail = await CocktailsSchema.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        returnDocument: 'after',
        lean: true
      }
    );

    res.status(200).json(editCocktail);
  } catch (error) {
    res.status(400).json({ error: "Le cocktail n'a pas été édité"});
  }

})

router.delete('/:id', async (req, res) => {
  try {
    await CocktailsSchema.deleteOne({_id: req.params.id});

    res.status(200).json({ message: "Le cocktail a été supprimé"});
  } catch (error) {
    res.status(400).json({ error: "Le cocktail n'a pas été supprimé"});
  }
})


module.exports = router;
