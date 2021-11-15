// Importing modules
const mongoose = require('mongoose');
const router = require("express").Router();
const usersCollection = mongoose.connection.collection('users_cocktails');


router.patch('/update_profile', async (req, res) => {
  try {
    const body = req.body;
    const newPswd = await new Promise((resolve, reject) => {
      bcrypt.hash(body.password, saltRounds, function(err, hash) {
        if (err) reject(err);

        resolve(body.password = hash);
      });
    })

    res.name = body.name;
    res.email = body.email;
    res.password = newPswd;

    res.status(200).json({ message: "information updated" });
  } catch (error) {
    res.status(400).json({ error: "Invalid update" });
  }
})

router.get('/logout',(req,res) => {
  req.session = null;
  res.redirect('/cocktails');
});

router.delete('/delete/:email', async (req, res) => {
  try {
    await usersCollection.findOneAndDelete({email: req.body.email});

    res.status(200).json({ message: "profile deleted" });
    res.redirect('/');
  } catch (error) {
    res.status(400).json({ message: "Something went wrong" });
  }
});

module.exports = router;