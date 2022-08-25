const router = require("express").Router();
const categoryController = require("../controllers/category");
const auth = require("../middleware/auth");

router.get("/", categoryController.findAll);
router.post("/", categoryController.createCategory);
router.get("/:id", categoryController.getCategory);
router.put("/:id", categoryController.updateCategory);
router.delete("/:id", categoryController.deleteCategory);

module.exports = router;
