const { Product } = require("../models/product");

// Returns all the products of a specific category
const findAll = async (req, res) => {
  try {
    const category = req.params.categoryName;
    const allProducts = await Product.find({});

    const uniqueCategories = [
      ...new Set(allProducts.map((product) => product?.category)),
    ];

    allProducts.length === 0
      ? res.json({
          status: "error",
          message: "No products found in this category.",
        })
      : res.json({ status: "success", message: uniqueCategories });
  } catch (e) {
    res.json({ status: "error", message: e });
  }
};

module.exports = { findAll };
