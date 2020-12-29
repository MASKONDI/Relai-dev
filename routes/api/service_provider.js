const express = require("express");
const router = express.Router();

const { signup } = require("../../controllers/customers");

router.post("/ser_provider_register", signup);

module.exports = router;
