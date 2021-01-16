const express = require("express");
const router = express.Router();
const CustomerSchema = require("../../models/customers");
const PropertiesSchema = require("../../models/properties");
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const auth = require("../../config/auth");
const passport = require("passport");
require("../../config/passport")(passport);

var nodemailer = require('nodemailer');
const http = require('http');
var crypto = require('crypto');
var dateFormat = require('dateformat');
var dateTime = require('node-datetime');


const { cust_register, cust_signin } = require("../../controllers/customers");
const ServiceProviderSchema = require("../../models/service_providers");
// Load Input Validation
const validateCustomerRegisterInput = require('../../Validation/cust_signup');
const validateCustomerSigninInput = require('../../Validation/cust_signin');
const DocumentPermissionSchema = require('../../models/document_permission')

//router.post("/cust_register", cust_register);
//router.post("/cust_signin", cust_signin);

var isCustomer = auth.isCustomer;

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
        cus_unique_code: "cust-" + uuidv4(),
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
        //enableing session variable
        req.session.success = true;
        // req.session._id = doc.user_id;
        req.session.user_id = customers._id;
        req.session.name = customers.cus_fullname;
        req.session.email = customers.cus_email_id;
        req.session.is_user_logged_in = true;

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


/* -------------------------------------------------------------------------------------------------
    POST : Customer can add his property.
    ------------------------------------------------------------------------------------------------
    */

//router.post("/add-property", passport.authenticate("jwt", { session: false }), (req, res) => {
router.post("/add-property", (req, res) => {
  var err_msg = null;
  var success_msg = null;
  var test = req.session.is_user_logged_in;
  console.log("req.body is : ", req.body);
  const newProperty = new PropertiesSchema({
    //should be auto-generated mongodb objectId()
    // ps_property_id: req.body,
    ps_unique_code: "properties-" + uuidv4(),
    ps_user_id: req.session.user_id, //storing customer_ID
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


/* -------------------------------------------------------------------------------------------------
GET : fetch or search the service providers data based on name, surname, qualifications,
location, reviews, ratings and quotations.
------------------------------------------------------------------------------------------------- */

router.get("/fetch-service-provider", (req, res) => {
  console.log("fetching service provider data for following req: ", req.body);

  // Find Customer by 
  if (req.body != null) {
    if (req.body.sps_fullname != null) {
      ServiceProviderSchema.find({ sps_fullname: req.body.sps_fullname, }).then(service_provider => {
        // Check for Customer
        if (!service_provider) {
          console.log("Service Provider not found");
          // req.flash('err_msg', 'Service Provider not found');
          // return res.redirect('/professionals');
          return res.status(400).json("Service Provider not found")
        }
        else {
          //req.flash('success_msg', errors.sps_email_id);
          return res.status(200).json(service_provider);
        }

      })
    }
  }
})


// ***************** post forget pass **************//

router.post('/forget-password', function (req, res) {
  console.log("req.body is :", req.body);
  CustomerSchema.find({
    'cus_email_id': req.body.cus_email_id,
    //'cus_email_verification_status': 'yes'
  }, function (err, result) {
    if (err) {
      console.log('err', err);
      req.flash('err_msg', 'Please enter registered Email address.');
      res.redirect('/forget-password');
    } else {

      if (result != '' && result != null) {
        new_pass = Math.random().toString(36).slice(-6);
        var hashPassword = "";
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(new_pass, salt, (err, hash) => {
            if (err) throw err;
            hashPassword = hash;

            CustomerSchema.updateOne({
              'cus_email_id': req.body.cus_email_id
            }, {
              $set: {
                cus_password: hashPassword
              }
            }, {
              upsert: true
            }, function (err) {
              if (err) {
                console.log("err is :", err);
                req.flash('err_msg', 'Something went wrong.');
                res.redirect('/forget-password')
              } else {

                var smtpTransport = nodemailer.createTransport({
                  // port: 25,
                  // host: 'localhost',
                  tls: {
                    rejectUnauthorized: false
                  },
                  host: 'smtp.gmail.com',
                  port: 465,
                  secure: true,
                  service: 'Gmail',
                  auth: {
                    user: 'golearning4@gmail.com',
                    pass: 'Maskondi#1997',
                  }
                });
                const mailOptions = {
                  to: req.body.cus_email_id,
                  from: 'golearning4@gmail.com',
                  subject: 'Relai Forget Password',

                  text: 'Dear Customer,' + '\n\n' + 'New Password from Relai.\n\n' +
                    'Password: ' + new_pass + '\n\n' +

                    'We suggest you to please change your password after successfully logging in on the portal using the above password :\n' + 'Here is the change password link: http://' + req.headers.host + '/Change-password' + '\n\n' +
                    'Thanks and Regards,' + '\n' + 'Relai Team' + '\n\n',

                };
                smtpTransport.sendMail(mailOptions, function (err) {
                  if (err) { console.log('err_msg is :', err); req.flash('err_msg', 'Something went wrong.please connect support team'); res.redirect('/forget-password') } else {
                    req.flash('success_msg', 'Password has been sent successfully to your registered email, please check your mail...');
                    res.redirect('/forget-password')
                  }
                });
              }
            });
          });
        });
      } else {
        req.flash('err_msg', 'Please enter registered Email address.');
        res.redirect('/forget-password');
      }

    }
  });
});




router.get('/logout', function (req, res) {
  console.log("logout");
  var test = req.session.is_user_logged_in;
  if (test == true) {
    req.session.destroy(function (err) {
      if (err) {
        return err;
      } else {
        return res.redirect('/signin');
      }
    });
  }
});

//@route Get api/customers/current
//@desc Return current user
//@access private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json(req.user);
  }
);
//Change-permission====================

router.post('/change-permision',(req,res)=>{
  console.log(req.body.id_element)
  
  var idArray = req.body.checked_elem.split(",");
  
  // DocumentPermissionSchema 
  for(var service_provider_id of idArray){
    var Obj = {
      dps_customer_id:req.body.cust_id,
      dps_service_provider_id:service_provider_id,
      dps_document_id :req.body.id_element
    }
    var docPermissionSave =new DocumentPermissionSchema(Obj)
    docPermissionSave.save().then((data)=>{
      console.log(data)
    }).catch(err => {
      console.log(err)
      req.flash('err_msg', 'Something went wrong please try after some time!');

    });
  }
})
module.exports = router;
