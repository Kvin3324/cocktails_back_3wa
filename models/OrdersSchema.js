const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const OrdersSchema = new Schema({
  usernameOrder: String,
  cocktails: Array,
})

module.exports = mongoose.model('Orders', OrdersSchema);