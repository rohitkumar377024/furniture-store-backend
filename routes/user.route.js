const router = require("express").Router();
const userController = require("../controllers/user.controller");
const auth = require("../middleware/auth");

router.post("/register", userController.createUser);
router.post("/login", userController.loginUser);
router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUser);
router.delete("/:id", userController.deleteUser);

module.exports = router;
