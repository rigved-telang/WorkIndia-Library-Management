const express = require("express");
const usersController = require("../controllers/users-controllers");

const router = express.Router();

router.post("/signup", usersController.signupController);
router.post("/login", usersController.loginController);

module.exports = router;