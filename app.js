const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());

const productRoute = require("./routes/product");
const categoryRoute = require("./routes/category");
const userRoute = require("./routes/user.route");
app.use("/products", productRoute);
app.use("/category", categoryRoute);
app.use("/users", userRoute);

app.use((req, res) => res.json({ status: "error", message: "404 Not Found." }));

app.listen(5000, () =>
  mongoose.connect(
    "mongodb+srv://admin-rohit:test123@cluster0-exv7e.mongodb.net/furniture-store"
  ).then(() => console.log('Server Started on PORT 5000'))
);
