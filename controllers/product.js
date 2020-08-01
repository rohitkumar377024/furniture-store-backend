const { Product } = require('../models/product');

// Returns all the products
const findAll = async (req, res) => {
  const allProducts = await Product.find();

  res.json({ status: 'success', message: allProducts });
};

// Returns details of a specific product
const findOne = async (req, res) => {
  const productID = req.params.productID;
  const productFound = await Product.findOne({ productID });

  res.json({ status: 'success', message: productFound });
};

// Creates a new product
const create = async (req, res) => {
  const created = await new Product({
    name: 'White Sofa',
    price: 7999,
    productID: 21409
  }).save();

  res.json({ status: 'success', message: created });
};

// Updates details of a specific product
const updateOne = async (req, res) => {
  const productID = req.params.productID;
  const updated = await Product.updateOne(
    { productID },
    { name: req.body.name, price: req.body.price, productID: req.body.productID }
  );

  res.json({ status: 'success', message: updated });
};

// Deletes a specific product
const deleteOne = async (req, res) => {
  const productID = req.params.productID;
  const deleted = await Product.deleteOne({ productID });

  res.json({ status: 'success', message: deleted });
};

module.exports = {
  findAll,
  findOne,
  create,
  updateOne,
  deleteOne
};
