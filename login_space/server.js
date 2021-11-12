const express = require('express');
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
const app = express();
const PORT = 4000;

const oneDay = 1000 * 60 * 60 * 24;
const myusername = 'user1'
const mypassword = 'mypassword'

// a variable to save a session
var session;

app.listen(4000, () => {
  console.log('server is listening 4000');
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

