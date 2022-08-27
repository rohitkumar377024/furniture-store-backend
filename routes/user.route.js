const router = require("express").Router();
const userController = require("../controllers/user.controller");
const auth = require("../middleware/auth");

router.post("/register", userController.createUser);
router.post("/login", userController.loginUser);
router.get("/:id", userController.getUser);
router.get("/", userController.getAllUsers);
router.delete("/:id", userController.deleteUser);

router.get("/cart/:id", userController.getCart);
router.post("/cart/:id", userController.addToCart);
router.delete("/cart/:id", userController.removeFromCart);

module.exports = router;
