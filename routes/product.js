const router = require('express').Router();
const productController = require('../controllers/product');

router.get('/search', productController.search);
router.get('/', productController.findAll);
router.get('/:productID', productController.findOne);
router.post('/', productController.create);
router.put('/:productID', productController.updateOne);
router.delete('/:productID', productController.deleteOne);

module.exports = router;
