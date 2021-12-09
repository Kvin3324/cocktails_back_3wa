const mongoose = require('mongoose');
const router = require('express').Router();
const OrdersSchema = require('../models/OrdersSchema');
const ordersCollection =  mongoose.connection.collection('orders');


router.get('/', async (req, res) => {
    try {
      const result = await OrdersSchema.find();

      return res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ error: "Something went wrong" });
    }
})

router.get('/:id', async (req, res) => {
    try {
      const result = await OrdersSchema.findOne({_id: req.params.id});

      return res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ error: "Something went wrong" });
    }
})

router.post('/', async (req, res) => {
  try {
    await ordersCollection.insertOne(req.body);

    res.redirect('/cocktails');
  } catch (error) {
    res.status(400).json({ error: "La commande n'a pas été passée."});
  }
})

router.put('/:id', async (req, res) => {
  try {
    const editOrder = await OrdersSchema.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        returnDocument: 'after',
        lean: true
      }
    );

    res.status(200).json(editOrder);
  } catch (error) {
    res.status(400).json({ error: "La commande n'a pas été éditée"});
  }

})

router.delete('/:id', async (req, res) => {
  try {
    await OrdersSchema.deleteOne({_id: req.params.id});

    res.status(200).json({ message: "La commande a été supprimée"});
  } catch (error) {
    res.status(400).json({ error: "La commande n'a pas été supprimée"});
  }
})

module.exports = router;
