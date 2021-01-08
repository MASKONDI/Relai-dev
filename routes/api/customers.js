const express = require("express");
const router = express.Router();
const CustomerSchema = require("../../models/customers");
const PropertiesSchema = require("../../models/properties");

const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');


const { cust_register, cust_signin } = require("../../controllers/customers");
// Load Input Validation
const validateCustomerRegisterInput = require('../../Validation/cust_signup');
const validateCustomerSigninInput = require('../../Validation/cust_signin');

//router.post("/cust_register", cust_register);
//router.post("/cust_signin", cust_signin);


router.post("/cust_register", (req, res) => {
  console.log("rq.body", req.body);
  var err_msg = null;
  var success_msg = null;
  const { errors, isValid } = validateCustomerRegisterInput(req.body);
  // Check Validation
  if (!isValid) {
    console.log("server validation error is:", errors);
    req.flash('err_msg', errors.confirmPassword);
    return res.redirect('/signup');
  }

  CustomerSchema.findOne({ cus_email_id: req.body.cus_email_id }).then(customers => {
    if (customers) {
      errors.cus_email_id = 'Email already exists';
      console.log('errors is : ', errors);
      req.flash('err_msg', errors.cus_email_id);
      res.redirect('/signup');
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
            .then(customers => {
              console.log("resposne is :", customers);
              res.redirect("/signin")
            })
            .catch(err => {
              console.log(err)
              req.flash('err_msg', 'Something went wron please try again later.');
              res.redirect('/signup');
            });
        });
      });
    }
  });
});




router.post("/cust_signin", (req, res) => {
  var err_msg = null;
  var success_msg = null;
  const cus_email_id = req.body.cus_email_id;
  const cus_password = req.body.cus_password;
  const { errors, isValid } = validateCustomerSigninInput(req.body);

  // Check Validation
  if (!isValid) {
    console.log("error is ", errors);
    req.flash('err_msg', "please enter valid emailid and password")
    return res.redirect('/signin');
  }

  // Find Customer by 
  CustomerSchema.findOne({ cus_email_id }).then(customers => {
    // Check for Customer
    if (!customers) {
      errors.cus_email_id = 'Customers not found';
      req.flash('err_msg', errors.cus_email_id);
      return res.redirect('/signin');
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
        req.flash("customers", customers);
        res.redirect('/dashboard')
      } else {
        errors.cus_password = 'Password incorrect';
        console.log("Password incorrect", errors);
        req.flash("err_msg", errors.cus_password);
        return res.redirect('/signin');
      }
    });
  });
});

router.post("/add-property", (req, res) => {
  var err_msg = null;
  var success_msg = null;
  console.log("req.body is : ", req.body);
  const newProperty = new PropertiesSchema({
    //should be auto-generated mongodb objectId()
    // ps_property_id: req.body,
    ps_unique_code: "properties-" + uuidv4(),
    //ps_user_id: req.body,  */need to store customer_id
    ps_property_name: req.body.ps_property_name,
    ps_property_address: req.body.ps_property_address,
    ps_property_country_id: req.body.ps_property_country_id,
    ps_property_state_id: req.body.ps_property_state_id,
    ps_property_city_id: req.body.ps_property_city_id,
    ps_property_zipcode: req.body.ps_property_zipcode,
    ps_property_user_as: req.body.ps_property_user_as,
    ps_other_party_user_as: req.body.ps_other_party_user_as,
    ps_other_party_emailid: req.body.ps_other_party_emailid,
    ps_other_party_invited: req.body.ps_other_party_invited,
    ps_property_area: req.body.ps_property_area,
    ps_property_bedroom: req.body.ps_property_bedroom,
    ps_property_bathroom: req.body.ps_property_bathroom,
    ps_additional_note: req.body.ps_additional_note,
    ps_property_type: req.body.ps_property_type,
    ps_chain_property_id: req.body.ps_chain_property_id,

  });
  newProperty
    .save()
    .then(property => res.redirect("/mydreamhome"))
    .catch(err => {
      console.log(err)
      req.flash('err_msg', 'Something went wrong please try after some time!');
      res.redirect('/add-property');

    });
});




module.exports = router;
