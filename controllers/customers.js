const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const passport = require('passport');

const CustomerSchema = require("../models/customers");


// Load Input Validation
const validateCustomerRegisterInput = require('../Validation/cust_signup');
const customers = require('../models/customers');

exports.cust_register = (req, res) => {
  console.log("rq.body", req.body);
  const { errors, isValid } = validateCustomerRegisterInput(req.body);
  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  CustomerSchema.findOne({ cus_email_id: req.body.cus_email_id }).then(customers => {
    if (customers) {
      errors.cus_email_id = 'Email already exists';
      return res.status(400).json(errors);
    } else {
      const newCustomer = new CustomerSchema({

        cus_fullname: req.body.cus_fullname,
        cus_email_id: req.body.cus_email_id,
        cus_phone_number: req.body.cus_phone_number,
        cus_address: req.body.cus_address,
        cus_country_id: req.body.cus_country_id,
        cus_city: req.body.cus_city,
        cus_password: req.body.cus_password,
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newCustomer.cus_password, salt, (err, hash) => {
          if (err) throw err;
          newCustomer.cus_password = hash;
          newCustomer
            .save()
            .then(customers => res.json(customers))
            .catch(err => console.log(err));
        });
      });
    }
  });
};


