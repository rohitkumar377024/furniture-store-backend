const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const productRoute = require('./routes/product');
const categoryRoute = require('./routes/category');
app.use('/products', productRoute);
app.use('/category', categoryRoute);

app.use((req, res) => res.json({ status: 'error', message: '404 Not Found.' }));

app.listen(3000, () =>
  mongoose.connect(
    'mongodb+srv://admin-rohit:test123@cluster0-exv7e.mongodb.net/furniture-store'
  )
);
