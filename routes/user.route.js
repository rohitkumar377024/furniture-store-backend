const router = require("express").Router();
const userController = require("../controllers/user.controller");
const auth = require("../middleware/auth");

router.post("/register", userController.createUser);
router.post("/login", userController.loginUser);
router.get("/:id", userController.getUser);
router.get("/", userController.getAllUsers);
router.delete("/:id", userController.deleteUser);

module.exports = router;
