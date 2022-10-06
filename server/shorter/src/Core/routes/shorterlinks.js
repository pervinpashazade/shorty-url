const router = require("express").Router();
const jwt = require("jsonwebtoken");
const shorterController = require("../../Core/controllers/shorter");

router.post("/", shorterController.create)

module.exports = router