// Importing modules
const mongoose = require('mongoose');
const router = require("express").Router();
const bcrypt = require('bcrypt');
const usersCollection = mongoose.connection.collection('users_cocktails');

// User login api
router.post("/connection", async (req, res) => {
  const body = req.body;
  try {
    const user = await usersCollection.findOne({ email: body.email });

    if (user) {
      const validPassword = await bcrypt.compare(body.password, user.password);

      if (validPassword) {
        res.status(200).json({ message: "user connected" });
      } else {
        return res.status(400).send({
          message: "User not found.",
        });
      }
    } else {
      res.status(401).json({ error: "User does not exist" });
    }
  } catch (error) {
    throw(error);
  }
})

// User signup api
router.post('/subscription', async (req, res) => {
  if (req.body.password !== req.body.confirm_password) {
    return res.status(400).json({ message: "Confirm password not equals to password." });
  }

  await new Promise((resolve, reject) => {
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
      if (err) reject(err);

      resolve(req.body.password = hash);
    });
  })

  usersCollection.insertOne(req.body)
    .then(result => {
      res.status(200).json({ message: "user created" });
    })
    .catch(error => {
      res.status(400).json({ error: "Invalid user" });
    });
});

// Export module to allow it to be imported in other files
module.exports = router;
