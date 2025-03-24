const express = require("express");
const { regrister, login } = require("../controllers/authController");
const authRoutes = express.Router();

authRoutes.post("/register", regrister);

authRoutes.post("/login", login);

module.exports = authRoutes;
