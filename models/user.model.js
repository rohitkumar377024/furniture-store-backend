const { Schema, model } = require("mongoose");

const UserSchema = Schema({
  name: {
    type: String,
    trim: true,
    require: true,
  },
  phoneNumber: {
    type: String,
    trim: true,
    require: true,
    minlength: 10,
    maxlength: 10,
  },
  emailAddress: {
    type: String,
    trim: true,
    require: true,
  },
  password: {
    type: String,
    trim: true,
    require: true,
  },
  // type: {
  //   type: String,
  //   enum: ["Social", "Sales"],
  //   trim: true,
  //   require: true,
  // },
});

module.exports = model("user", UserSchema);
