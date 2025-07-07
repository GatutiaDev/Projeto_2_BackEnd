const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

function checkLogin(req, res, next) {
  if (req.session.logado) {
    next();
  } else {
    res.redirect("/login");
  }
}

router.get("/", checkLogin, authController.renderHomePage);

router.get("/login", authController.renderLoginPage);

router.get("/register", authController.renderRegisterPage);

router.post("/login", authController.processLogin);

router.post("/register", authController.processRegister);

router.get("/logout", authController.logout);

module.exports = router;
