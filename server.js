require('dotenv').config();
const express = require('express');
const sessions = require('express-session');
const cookieParser = require("cookie-parser");
const bodyParser= require('body-parser');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const cocktailsRoute = require('./routes/cocktails');
const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/user');
const dbKey = process.env.DB_KEY;
const oneDay = 1000 * 60 * 60 * 24;

mongoose.connect(dbKey);
console.log('Connected to Database');

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
app.use(bodyParser.json());
app.use(cors());

app.use('/', authRoutes);
app.use('/cocktails', cocktailsRoute);
app.use('/user', usersRoutes);

