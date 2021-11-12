const express = require('express');
const sessions = require('express-session');
const cookieParser = require("cookie-parser");
const bodyParser= require('body-parser');
const User = require("./models/user");
const bcrypt = require('bcrypt');
const app = express();
const MongoClient = require('mongodb').MongoClient
const cors = require('cors');

const dbKey = 'mongodb+srv://kvin:ZTRxkwxXRNc9Dthz@cluster0.l02a3.mongodb.net/cocktails?retryWrites=true&w=majority';
const oneDay = 1000 * 60 * 60 * 24;
// a variable to save a session
const saltRounds = 10;

// const user = require('./routes/user');



app.listen(3000, () => {
  console.log('server is listening 3000');
});

app.use(sessions({
  secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
  saveUninitialized:true,
  cookie: { maxAge: oneDay },
  resave: false 
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(cors());

MongoClient.connect(dbKey,  {
  useUnifiedTopology: true
}, (err, client) => {
  if (err) return console.error(err);

  console.log('Connected to Database');
  const db = client.db('cocktails-order');
  const cocktailsCollection = db.collection('cocktails');
  const usersCollection = db.collection('users_cocktails');


  app.get('/cocktails', (req, res) => {
    // res.sendFile('/Users/kevinjoya/github/project_3wa_back' + '/index.html');
    const cursor = db.collection('cocktails').find().toArray()
    .then(result => {
      console.log(result);
      res.status(200).json(result);
      })
      .catch(error => console.log(error))

    console.log(cursor);
  });

  app.post('/cocktails', (req, res) => {
    console.log(req.body);

    cocktailsCollection.insertOne(req.body)
      .then(result => {
        console.log(result);
        res.redirect('/cocktails');
      })
      .catch(error => console.error(error));
  });

  app.put('/cocktails', (req, res) => {
    console.log(req.body);

    cocktailsCollection.findOneAndUpdate(
      { name: 'Smoothie' },
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
      .catch(error => console.error(error))
  })

  app.delete('/cocktails', (req, res) => {
    cocktailsCollection.deleteOne(
      { name: req.body.name },
    )
    .then(result => {
      if (result.deletedCount === 0) {
        return res.json('No cocktail to delete')
      }

      // res.json(`Deleted Smoothie`)
    })
    .catch(error => console.error(error))
  })

  // app.get('/users',(req,res) => {
  //   console.log(req.session);
  //   session = req.session;
  //   if(session.userid) {
  //     res.send("Welcome User <a href=\'/logout'>click to logout</a>");
  //   } else
  //     res.send('Too bad');
  // });

  app.post('/connection', async (req, res) => {
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
  });

  app.post('/subscription', async (req, res) => {
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

  app.patch('/update_profile', async (req, res) => {
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

  app.get('/logout',(req,res) => {
    req.session.destroy();
    res.redirect('/cocktails');
  });

  app.delete('/delete/:email', async (req, res) => {
    // const { email } = req.params;

    try {
      await usersCollection.findOneAndDelete({email: req.body.email});

      console.log('got deleted');
      res.status(200).json({ message: "profile deleted" });
      // res.redirect('/');
    } catch (error) {
      res.status(400).json({ message: "pas good" });
    }
  });
});

