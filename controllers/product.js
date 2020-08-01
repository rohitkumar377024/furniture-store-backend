const { Product } = require('../models/product');

// Returns all the products
const findAll = async (req, res) => {
  try {
    const allProducts = await Product.find();

    allProducts.length === 0
      ? res.json({ status: 'error', message: 'No products.' })
      : res.json({ status: 'success', message: allProducts });
  } catch (e) {
    res.json({ status: 'error', message: e });
  }
};

// Returns details of a specific product
const findOne = async (req, res) => {
  try {
    const productID = req.params.productID;
    const productFound = await Product.findOne({ productID });

    productFound === null
      ? res.json({ status: 'error', message: 'Product not found.' })
      : res.json({ status: 'success', message: productFound });
  } catch (e) {
    res.json({ status: 'error', message: e });
  }
};

// Creates a new product
const create = async (req, res) => {
  try {
    const created = await new Product({
      name: req.body.name,
      price: req.body.price,
      category: req.body.category,
      productID: req.body.productID
    }).save();

    res.json({ status: 'success', message: created });
  } catch (e) {
    res.json({ status: 'error', message: e });
  }
};

// Updates details of a specific product
const updateOne = async (req, res) => {
  try {
    const productID = req.params.productID;
    const updated = await Product.updateOne(
      { productID },
      {
        name: req.body.name,
        price: req.body.price,
        productID: req.body.productID,
        category: req.body.category
      }
    );

    updated.nModified === 0
      ? res.json({ status: 'error', message: 'Product could not be updated.' })
      : res.json({ status: 'success', message: 'Product updated successfully.' });
  } catch (e) {
    res.json({ status: 'error', message: e });
  }
};

// Deletes a specific product
const deleteOne = async (req, res) => {
  try {
    const productID = req.params.productID;
    const deleted = await Product.deleteOne({ productID });

    deleted.n === 0
      ? res.json({ status: 'error', message: 'Product could not be deleted.' })
      : res.json({ status: 'success', message: 'Product deleted successfully.' });
  } catch (e) {
    res.json({ status: 'error', message: e });
  }
};

// Shows search results for products query
const search = async (req, res) => {
  const query = req.query.q;

  const allProducts = await Product.find();
  const allProductNames = allProducts.map(product => product.name.toLowerCase());

  const foundProducts = allProductNames.filter(productName =>
    productName.includes(query.toLowerCase())
  );

  res.json({ status: 'success', message: foundProducts });
};

module.exports = {
  findAll,
  findOne,
  create,
  updateOne,
  deleteOne,
  search
};
