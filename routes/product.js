const router = require('express').Router();
const productController = require('../controllers/product');

router.get('/search', productController.search);
router.get('/', productController.findAll);
router.get('/:id', productController.findOne);
router.post('/', productController.create);
router.put('/:id', productController.updateOne);
router.delete('/:id', productController.deleteOne);

module.exports = router;
