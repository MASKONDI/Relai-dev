const express = require("express");
const router = express.Router();

const { cust_register, cust_signin } = require("../../controllers/customers");

router.post("/cust_register", cust_register);
router.post("/cust_signin", cust_signin);

module.exports = router;
