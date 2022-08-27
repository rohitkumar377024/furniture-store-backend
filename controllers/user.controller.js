const User = require("../models/user.model");
const { Product } = require("../models/product");
const Token = require("../models/token.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { sendResponse } = require("../utils/response");
const { isEmail, isPhoneNumber } = require("../utils/validation");

exports.createUser = async (req, res) => {
  const { name, phoneNumber, emailAddress, password } = req.body;

  // Validation
  !name && sendResponse(res, 400, "Name field cannot be empty", "");
  !phoneNumber && sendResponse(res, 400, "Phone number cannot be empty", "");
  !emailAddress && sendResponse(res, 400, "Email address cannot be empty", "");
  !password && sendResponse(res, 400, "Password field cannot be empty", "");
  // !type && sendResponse(res, 400, "Type field cannot be empty", "");

  phoneNumber &&
    (phoneNumber.length !== 10 || !isPhoneNumber(phoneNumber)) &&
    sendResponse(res, 400, "Phone number is not valid", "");

  password &&
    password.length < 6 &&
    sendResponse(res, 400, "Password must contain 6 or more digits", "");

  // const types = ["Social", "Sales"];
  // !types.includes(type) &&
  //   sendResponse(res, 400, "Type must be either Social or Sales", "");

  emailAddress &&
    !isEmail(emailAddress) &&
    sendResponse(res, 400, "Email address is not valid", "");

  try {
    // Check if user already exists in DB (based on email)
    const userExists = await User.findOne({ emailAddress });

    // If email address in request body and user exists in DB already
    if (userExists) {
      res.status(400).json({
        message: "error",
        data: "User with this email address already exists",
      });
      return;
    }

    // Encrypt plain-text password
    const encryptedPassword = await bcrypt.hash(password, 10);

    const result = await new User({
      name,
      phoneNumber,
      emailAddress,
      password: encryptedPassword,
      cart: {
        items: [],
        total: 0
      }
      // type,
    }).save();

    // Create token
    const token = jwt.sign(
      { _id: result._id, emailAddress },
      "TAG_JWT_SECRET_KEY",
      {
        expiresIn: "168h",
      }
    );

    sendResponse(res, 200, "", {
      ...result._doc,
      token,
    });
  } catch (e) {
    console.log(e);
    sendResponse(
      res,
      400,
      "Error occurred while trying to create a new user",
      ""
    );
  }
};

exports.loginUser = async (req, res) => {
  const { emailAddress, password } = req.body;

  // Validation
  !emailAddress && sendResponse(res, 400, "Email field cannot be empty", "");
  !password && sendResponse(res, 400, "Password field cannot be empty", "");

  emailAddress &&
    !isEmail(emailAddress) &&
    sendResponse(res, 400, "Email address is not valid", "");

  try {
    // Check if user exists in DB (based on email)
    const userExists = await User.findOne({ emailAddress });

    if (userExists && (await bcrypt.compare(password, userExists.password))) {
      // Create token
      const token = jwt.sign(
        { _id: userExists._id, emailAddress },
        "TAG_JWT_SECRET_KEY",
        {
          expiresIn: "168h",
        }
      );

      sendResponse(res, 200, "", { ...userExists._doc, token });
    } else {
      sendResponse(res, 400, "Invalid credentials for login", "");
      return;
    }
  } catch (e) {
    console.log(e);
    sendResponse(res, 400, "Error occurred while trying to login", "");
  }
};

exports.getAllUsers = async (req, res) => {
  const { type, page, count } = req.query;

  !type && sendResponse(res, 400, "Type field cannot be empty", "");
  !page && sendResponse(res, 400, "Page number field cannot be empty", "");
  !count && sendResponse(res, 400, "Page items count cannot be empty", "");

  const types = ["Social", "Sales"];
  !types.includes(type) &&
    sendResponse(res, 400, "Type must be either Social or Sales", "");

  try {
    const users = await User.find({ type })
      .skip(page > 0 ? (page - 1) * count : 0)
      .limit(count);

    sendResponse(res, 200, "", users, {
      pagesCount: Math.ceil((await User.count({ type })) / parseInt(count)),
      itemsCount: users.length,
      page: parseInt(page),
      count: parseInt(count),
    });
  } catch (e) {
    sendResponse(res, 400, "Error occurred while trying to fetch users", "");
  }
};

exports.getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findOne({ _id: id });
    sendResponse(res, 200, "", user);
  } catch (e) {
    console.log(e);
    sendResponse(res, 400, "Error occurred while trying to fetch user", "");
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await User.deleteOne({ _id: id });

    if (result?.deletedCount == 0) {
      sendResponse(res, 400, "No user found with this ID for deletion", "");
    } else {
      sendResponse(res, 200, "", result);
    }
  } catch (e) {
    console.log(e);
    sendResponse(
      res,
      400,
      "Error occurred while trying to delete the user",
      ""
    );
  }
};

exports.resetPassword = async (req, res) => {
  const { userId, token, password } = req.body;

  let passwordResetToken = await Token.findOne({ userId });
  if (!passwordResetToken) {
    sendResponse(res, 400, "Invalid or expired password reset token", "");
  }

  const isValid = await bcrypt.compare(token, passwordResetToken.token);
  if (!isValid) {
    sendResponse(res, 400, "Invalid or expired password reset token", "");
  }

  const hash = await bcrypt.hash(password, Number(10));
  const result = await User.updateOne(
    { _id: userId },
    { $set: { password: hash } },
    { new: true }
  );

  const user = await User.findById({ _id: userId });

  await passwordResetToken.deleteOne();

  sendResponse(res, 200, "", result);
};

exports.getCart = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findOne({ _id: id });
    sendResponse(res, 200, "", user?.cart);
  } catch (e) {
    console.log(e);
    sendResponse(res, 400, "Error occurred while trying to fetch user", "");
  }
}

exports.addToCart = async (req, res) => {
  const { id } = req.params;
  const { productId } = req.body;

  // Validation
  !id && sendResponse(res, 400, "User ID field cannot be empty", "");
  !productId && sendResponse(res, 400, "Product ID field cannot be empty", "");

  try {
    const user = await User.findOne({ _id: id });
    const product = await Product.findOne({ _id: productId });

    const productIDStr = `${productId}`

    if (user?.cart?.items.map(x => x?.productID).includes(productIDStr)) {
      // Increment quantity
      const itemIdx = user?.cart?.items?.findIndex(x => x?.productID == productIDStr)
      await User.updateOne({ _id: id, "cart.items.productID": productIDStr }, { $set: { "cart.items.$.quantity": user?.cart?.items[itemIdx].quantity + 1 } })
    } else {
      // Add new item to cart
      const newCartItem = {
        name: product?.name,
        price: product?.price,
        productID: product?._id,
        quantity: 1
      }

      await User.updateOne({ _id: id }, { $push: { "cart.items": newCartItem } })
    }

    // Increment cart total by product's price
    await User.updateOne({ _id: id }, { $set: { "cart.total": user?.cart?.total + product?.price } })

    sendResponse(res, 200, "", "Added to cart successfully");
  } catch (e) {
    console.log(e);
    sendResponse(res, 400, "Error occurred while trying to add to cart", "");
  }
}

exports.removeFromCart = async (req, res) => {
  const { id } = req.params;
  const { productId } = req.body;

  // Validation
  !id && sendResponse(res, 400, "User ID field cannot be empty", "");
  !productId && sendResponse(res, 400, "Product ID field cannot be empty", "");

  try {
    const user = await User.findOne({ _id: id });
    const product = await Product.findOne({ _id: productId });
    const productIDStr = `${productId}`

    const filteredCart = user?.cart?.items.filter(cartItem => cartItem?.productID != productIDStr)
    const itemToRemove = user?.cart?.items.find(x => x.productID == productIDStr)

    // Reduce the cart total by product of removed product's price and quantity
    await User.updateOne({ _id: id }, { $set: { "cart.total": user?.cart?.total - (itemToRemove?.price * itemToRemove?.quantity) } })

    const result = await User.updateOne({ _id: id }, { $set: { "cart.items": filteredCart } })

    if (result?.nModified > 0) {
      sendResponse(res, 200, "", "Removed from cart successfully");
    } else {
      sendResponse(res, 200, "", "Could not remove the item from cart");
    }
  } catch (e) {
    console.log(e);
    sendResponse(res, 400, "Error occurred while trying to remove from cart", "");
  }
}


