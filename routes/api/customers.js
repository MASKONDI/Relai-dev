const express = require("express");
const router = express.Router();

const { cust_register } = require("../../controllers/customers");

router.post("/cust_register", cust_register);

module.exports = router;
