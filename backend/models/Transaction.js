const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  productId: String,
  dateOfSale: Date,
  price: Number,
  title: String,
  description: String,
  category: String,
  sold: Boolean
});

module.exports = mongoose.model('Transaction', transactionSchema);
