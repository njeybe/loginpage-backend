const express = require("express");
const router = express.Router();
const { registeredUser, loginUser } = require("../controllers/authController");

router.post("/regiser", registeredUser);
router.post("/login", loginUser);

module.exports = router;
