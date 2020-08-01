const express = require('express');
const app = express();

const productRoute = require('./routes/product');
app.use('/products', productRoute);

app.use((req, res) => res.json({ status: 'error', message: '404 Not Found.' }));

app.listen(3000, () => console.log('Listening on Port 3000.'));
