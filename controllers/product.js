const { Product } = require('../models/product');
const Category = require("../models/category");
const { sendResponse } = require("../utils/response");

// Returns all the products
const findAll = async (req, res) => {
  try {
    const allProducts = await Product.find();
    const result = []

    for (const product of allProducts) {
      // Check if category exists and is valid
      const categoryValid = await Category.findOne({ _id: product.categoryID })

      if (categoryValid == null) {
        sendResponse(res, 400, "Category ID is not valid", "");
        return;
      } else {
        result.push({ ...product._doc, category: categoryValid._doc })
      }
    }

    result.length === 0
      ? sendResponse(res, 400, "No products found", "")
      : sendResponse(res, 200, "", result);
  } catch (e) {
    console.log(e);
    sendResponse(
      res,
      400,
      "Error occurred while trying to fetch all products",
      ""
    );
  }
};

// Returns details of a specific product
const findOne = async (req, res) => {
  try {
    const { id } = req.params;

    // Validation
    !id && sendResponse(res, 400, "ID cannot be empty", "");

    const productFound = await Product.findOne({ _id: id });

    // Check if category exists and is valid
    const categoryValid = await Category.findOne({ _id: productFound?.categoryID })

    if (categoryValid == null) {
      sendResponse(res, 400, "Category ID is not valid", "");
      return;
    } else {
      productFound === null
        ? sendResponse(res, 400, "Product not found", "")
        : sendResponse(res, 200, "", { ...productFound._doc, category: categoryValid._doc });
    }
  } catch (e) {
    console.log(e);
    sendResponse(
      res,
      400,
      "Error occurred while trying to fetch product",
      ""
    );
  }
};

// Creates a new product
const create = async (req, res) => {
  try {
    const { name, price, categoryID, imageUrl } = req.body;

    // Validation
    !name && sendResponse(res, 400, "Name field cannot be empty", "");
    !price && sendResponse(res, 400, "Price field cannot be empty", "");
    !categoryID && sendResponse(res, 400, "Category ID field cannot be empty", "");
    !imageUrl && sendResponse(res, 400, "Image URL field cannot be empty", "");

    // Check if category exists and is valid
    const categoryValid = await Category.findOne({ _id: categoryID })

    if (categoryValid == null) {
      sendResponse(res, 400, "Category ID is not valid", "");
      return;
    }

    const created = await new Product({
      name,
      price,
      categoryID,
      imageUrl,
    }).save();

    sendResponse(res, 200, "", created);
  } catch (e) {
    console.log(e);
    sendResponse(
      res,
      400,
      "Error occurred while trying to create a new product",
      ""
    );
  }
};

// Updates details of a specific product
const updateOne = async (req, res) => {
  try {
    const { name, price, categoryID, imageUrl } = req.body;
    const { id } = req.params;

    !id && sendResponse(res, 400, "ID cannot be empty", "");

    // Validation
    !name && sendResponse(res, 400, "Name field cannot be empty", "");
    !price && sendResponse(res, 400, "Price field cannot be empty", "");
    !categoryID && sendResponse(res, 400, "Category ID field cannot be empty", "");
    !imageUrl && sendResponse(res, 400, "Image URL field cannot be empty", "");

    // Check if category exists and is valid
    const categoryValid = await Category.findOne({ _id: categoryID })

    if (categoryValid == null) {
      sendResponse(res, 400, "Category ID is not valid", "");
      return;
    }

    const updated = await Product.updateOne(
      { _id: id },
      {
        name,
        price,
        categoryID,
        imageUrl,
      }
    );

    updated.n === 0
      ? sendResponse(res, 400, "", "Product could not be updated")
      : sendResponse(res, 200, "", "Product updated successfully");
  } catch (e) {
    console.log(e);
    sendResponse(
      res,
      400,
      "Error occurred while trying to update product",
      ""
    );
  }
};

// Deletes a specific product
const deleteOne = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await Product.deleteOne({ _id: id });

    if (result.deletedCount == 0) {
      sendResponse(res, 400, "No product found with this ID for deletion", "");
    } else {
      sendResponse(res, 200, "", "Product deleted successfully");
    }
  } catch (e) {
    console.log(e);
    sendResponse(
      res,
      400,
      "Error occurred while trying to delete the product",
      ""
    );
  }
};

// WARNING:::::::NOT IN USE
// Shows search results for products query
const search = async (req, res) => {
  const query = req.query.q;

  const allProducts = await Product.find();
  const allProductNames = allProducts.map(product => product.name.toLowerCase());

  const foundProducts = allProducts.filter(product =>
    product.name.toLowerCase().includes(query.toLowerCase())
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
