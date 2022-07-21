const express = require("express");
const router = express.Router();
const userController = require("../controller/user");

router.post("/signup", userController.postUser);

router.post("/signin", userController.loginUser);

module.exports = router;