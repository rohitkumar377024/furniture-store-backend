const router = require('express').Router();
const categoryController = require('../controllers/category');

router.get('/:categoryName', categoryController.findAll);

module.exports = router;
