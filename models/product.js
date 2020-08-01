const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  productID: Number
});

const Product = mongoose.model('product', productSchema);

module.exports = {
  Product
};
