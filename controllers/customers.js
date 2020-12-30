const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const passport = require('passport');
const { v4: uuidv4 } = require('uuid');

const CustomerSchema = require("../models/customers");

// Load Input Validation
const validateCustomerRegisterInput = require('../Validation/cust_signup');
const validateCustomerSigninInput = require('../Validation/cust_signin');


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
        cus_unique_code: "cus-" + uuidv4(),
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




exports.cust_signin = (req, res) => {
  const cus_email_id = req.body.cus_email_id;
  const cus_password = req.body.cus_password;

  const { errors, isValid } = validateCustomerSigninInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  // Find Customer by 
  CustomerSchema.findOne({ cus_email_id }).then(customers => {
    // Check for Customer
    if (!customers) {
      errors.cus_email_id = 'Customers not found';
      return res.status(404).json(errors);
    }
    // Check Password
    bcrypt.compare(cus_password, customers.cus_password).then(isMatch => {
      if (isMatch) {
        // Customer Matched
        const payload = { id: customers.id, cus_fullname: customers.cus_fullname, cus_email_id: customers.cus_email_id }; // Create JWT Payload

        // Sign Token
        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 3600 },
          (err, token) => {
            res.json({
              success: true,
              token: 'Bearer ' + token
            });
          }
        );
      } else {
        errors.cus_password = 'Password incorrect';
        return res.status(400).json(errors);
      }
    });
  });
}
