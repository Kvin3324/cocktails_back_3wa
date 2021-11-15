const mongoose = require('mongoose');
const router = require('express').Router();
const CocktailsSchema = require('../models/CocktailsSchema');
const cocktailsCollection =  mongoose.connection.collection('cocktails');


router.get('/', async (req, res) => {
    try {
      const result = await CocktailsSchema.find();

      return res.status(200).json(result);
    } catch (error) {
      res.status(401).json({ error: "Something went wrong" });
    }
})

router.get('/:id', async (req, res) => {
    try {
      const result = await CocktailsSchema.findOne({_id: req.params.id});

      return res.status(200).json(result);
    } catch (error) {
      res.status(401).json({ error: "Something went wrong" });
    }
})

router.post('/', async (req, res) => {
  try {
    await cocktailsCollection.insertOne(req.body);

    res.redirect('/cocktails');
  } catch (error) {
    res.status(401).json({ error: "Le cocktail n'a pas été créé"});
  }
})

router.put('/', (req, res) => {
  console.log(req.body);

  cocktailsCollection.findOneAndUpdate(
    { name: req.body.name },
    {
      $set: {
        name: req.body.name,
        description: req.body.description
      }
    },
    {
      upsert: true
    }
  )
    .then(result => {
      console.log(result);
      res.json('Success');
    })
    .catch(error => {
      res.status(401).json({ error: "Le cocktail n'a pas été modifié"});
    })
})

router.delete('/:id', async (req, res) => {
  try {
    await mongoose.model('Cocktails').deleteOne({_id: req.params.id});

    res.status(200).json({ message: "Le cocktail a été supprimé"});
  } catch (error) {
    res.status(401).json({ error: "Le cocktail n'a pas été supprimé"});
  }
})


module.exports = router;
