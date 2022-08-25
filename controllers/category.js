const { Product } = require("../models/product");
const Category = require("../models/category");
const { sendResponse } = require("../utils/response");

// Create new category
const createCategory = async (req, res) => {
  const { name, imageUrl } = req.body;

  // Validation
  !name && sendResponse(res, 400, "Name field cannot be empty", "");
  !imageUrl && sendResponse(res, 400, "Image Url cannot be empty", "");

  try {
    // Check if user already exists in DB (based on email)
    const userExists = await Category.findOne({ name });

    // If category in request body and user exists in DB already
    if (userExists) {
      res.status(400).json({
        message: "error",
        data: "Category with this name already exists",
      });
      return;
    }

    const result = await new Category({
      name,
      imageUrl
    }).save();


    sendResponse(res, 200, "", result);
  } catch (e) {
    console.log(e);
    sendResponse(
      res,
      400,
      "Error occurred while trying to create a new category",
      ""
    );
  }
};

// Returns all the products of a specific category
const findAll = async (req, res) => {
  try {
    const allCategories = await Category.find({});

    allCategories.length === 0
      ? sendResponse(res, 400, "No categories found", "")
      : sendResponse(res, 200, "", allCategories);
  } catch (e) {
    console.log(e)
    sendResponse(res, 400, e, "")
  }
};

const getCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const category = await Category.findOne({ _id: id });
    sendResponse(res, 200, "", category);
  } catch (e) {
    console.log(e);
    sendResponse(res, 400, "Error occurred while trying to fetch category", "");
  }
};

const deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await Category.deleteOne({ _id: id });

    if (result?.n == 1) {
      sendResponse(res, 200, "", "Category Deleted");
    } else {
      sendResponse(res, 400, "No category found with this ID for deletion", "");
    }
  } catch (e) {
    console.log(e);
    sendResponse(
      res,
      400,
      "Error occurred while trying to delete the category",
      ""
    );
  }
};

const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, imageUrl } = req.body;

  // Validation
  !name && sendResponse(res, 400, "Name field cannot be empty", "");
  !imageUrl && sendResponse(res, 400, "Image Url cannot be empty", "");

  try {
    const result = await Category.updateOne({ _id: id }, { name, imageUrl });
    sendResponse(res, 200, "", result.nModified == 1 ? "Updated category" : "Could not update category");
  } catch (e) {
    console.log(e);
    sendResponse(res, 400, "Error occurred while trying to update category", "");
  }
}

module.exports = { findAll, createCategory, getCategory, deleteCategory, updateCategory };
