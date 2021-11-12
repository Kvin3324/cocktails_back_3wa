const mongoose = require('mongoose');

  const UserSchema = new mongoose.Schema({
    email: String,
    password: String,
    confirm_password: String
  })

  module.exports = mongoose.model('user', UserSchema)