const express = require("express");
const jwt = require("jsonwebtoken");
const { chatWithAssistant } = require("../controller/chatController");

const router = express.Router();

const optionalUserToken = (req, res, next) => {
  const token = req.header("token");
  if (!token) return next();

  try {
    req.token = jwt.verify(token, process.env.SECRET_KEY);
    return next();
  } catch {
    return res.status(401).json({ success: false, message: "Your sign-in session expired. Sign in and try again." });
  }
};

router.post("/assistant", optionalUserToken, chatWithAssistant);

module.exports = router;
