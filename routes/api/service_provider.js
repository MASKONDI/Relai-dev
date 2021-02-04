const express = require("express");
const router = express.Router();
const ServiceProviderSchema = require("../../models/service_providers");
const ServiceProviderOtherDetailsSchema = require("../../models/service_providers_other_details");
const ServiceProviderEducationSchema = require("../../models/service_provider_education");
const ServiceProviderEmploymentHistorySchema = require("../../models/service_provider_employment_history");
const ServiceProviderLanguageSchema = require("../../models/service_provider_languages");
const ServiceProviderPlanSchema = require("../../models/service_provider_plan");
const ServiceProviderPortfolioSchema = require("../../models/service_provider_portfolio");
const ServiceProviderReferenceSchema = require("../../models/service_provider_reference");
const ServiceProviderRolesSchema = require("../../models/service_provider_roles");
const PlanSchema = require("../../models/plan");
const ServiceProviderPersonalDetailsSchema = require("../../models/service_provider_personal_details");
const ServiceProviderIndemnityDetailsSchema = require("../../models/service_provider_indemnity_details");


const isEmpty = require('../../Validation/is-empty');


const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

var nodemailer = require('nodemailer');
const http = require('http');
var crypto = require('crypto');
var dateFormat = require('dateformat');
var dateTime = require('node-datetime');

// Load Input Validation
const validateServiceProviderRegisterInput = require('../../Validation/service_provider_signup');
const validateServiceProviderSigninInput = require('../../Validation/service_provider_signin');


const { service_provider_register, service_provider_signin, service_provider_personal_details, service_provider_other_details, service_provider_Indemnity_details, service_provider_Roles, service_provider_education, service_provider_employment_history, service_provider_language, service_provider_plan, service_provider_portfolio, service_provider_reference, pricing_plan } = require("../../controllers/service_providers");


//router.post("/service_provider_register", service_provider_register);
//router.post("/service_provider_personal_details", service_provider_personal_details);
//router.post("/service_provider_other_details", service_provider_other_details);
//router.post("/service_provider_indemnity_details", service_provider_Indemnity_details);
router.post("/service_provider_roles", service_provider_Roles);
//router.post("/service_provider_education", service_provider_education);
//router.post("/service_provider_employment_history", service_provider_employment_history);
//router.post("/service_provider_language", service_provider_language);
router.post("/service_provider_plan", service_provider_plan);
//router.post("/service_provider_portfolio", service_provider_portfolio);
//router.post("/service_provider_reference", service_provider_reference);
//router.post("/service_provider_signin", service_provider_signin);
router.post("/pricing_plan", pricing_plan);







/* -------------------------------------------------------------------------------------------------
POST : service_provider_register post api is responsible for submitting signup-service-provider form data 
------------------------------------------------------------------------------------------------- */

router.post("/service_provider_register", (req, res) => {
  var err_msg = null;
  var success_msg = null;
  var service_provider = null;
  console.log("req.body is : ", req.body);
  const { errors, isValid } = validateServiceProviderRegisterInput(req.body);

  //Check Validation
  if (!isValid) {
    console.log("errors is ", errors);
    req.flash('err_msg', errors.confirmPassword);
    return res.redirect('/signup-service-provider')
  }

  ServiceProviderSchema.findOne({ sps_email_id: req.body.sps_email_id }).then(serviceProviders => {
    if (serviceProviders) {
      errors.sps_email_id = 'Email already exists';
      console.log("error is :", errors);
      req.flash('err_msg', errors.sps_email_id);
      return res.redirect('/signup-service-provider');
    } else {
      const newServiceProvider = new ServiceProviderSchema({
        sps_unique_code: "sp-" + uuidv4(),
        sps_fullname: req.body.sps_fullname,
        sps_email_id: req.body.sps_email_id,
        sps_phone_number: req.body.sps_phone_number,
        sps_address: req.body.sps_address,
        sps_country_id: req.body.sps_country_id,
        sps_city: req.body.sps_city,
        sps_password: req.body.sps_password,
        sps_role_name: req.body.sps_role_name,
        sps_experience: req.body.sps_experience
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newServiceProvider.sps_password, salt, (err, hash) => {
          if (err) throw err;
          newServiceProvider.sps_password = hash;
          newServiceProvider
            .save()
            .then(serviceProviders => {
              console.log("service_provider is", serviceProviders);
              req.session.success = true,
                // req.session._id = doc.user_id;
                req.session.user_id = serviceProviders._id,
                req.session.name = serviceProviders.sps_fullname,
                req.session.email = serviceProviders.sps_email_id,
                req.session.role = serviceProviders.sps_role_name,
                req.session.is_user_logged_in = true,
                req.flash('service_provider', serviceProviders);
              res.redirect("/signup-professionals-profile")
            })
            .catch(err => {
              console.log(err)
              req.flash('err_msg', 'You have entered wrong email or password please try again.');
              res.redirect('/signup-service-provider');
            });
        });
      });
    }
  });
});


/* -------------------------------------------------------------------------------------------------
POST : service_provider_personal_details post api is responsible for submitting signup-professionals-profile form data 
------------------------------------------------------------------------------------------------- */

router.post("/service_provider_personal_details", (req, res) => {
  var err_msg = null;
  var success_msg = null;
  //TODO:need to add condition is session is expired

  console.log("req.body is : ", req.body);
  console.log("user_id is:", req.session.user_id);

  const serviceProviderPersonalDetails = new ServiceProviderPersonalDetailsSchema({
    spods_service_provider_id: req.session.user_id, //storing service_provider_id
    spods_surname: req.body.spods_surname,
    spods_fornames: req.body.spods_fornames,
    spods_preferred_title: req.body.spods_preferred_title,
    spods_former_surnames: req.body.spods_former_surnames,
    spods_address: req.body.spods_address,
    spods_dob: req.body.spods_dob,
    spods_nationality: req.body.spods_nationality,
    spods_postcode: req.body.spods_postcode,
    spods_home_telephone_number: req.body.spods_home_telephone_number,
    spods_postcode_covered: req.body.spods_postcode_covered,
    spods_start_working_time: req.body.start_working_time,
  });
  serviceProviderPersonalDetails
    .save()
    .then(serviceProviders => {
      console.log("server res is : ", serviceProviders);
      res.redirect("/signup-professionals-profile-2")
    })
    .catch(err => {
      console.log(err)
      req.flash('err_msg', 'Something went wrong please try after some time!');
      res.redirect('/signup-professionals-profile');
    });
});


/* -------------------------------------------------------------------------------------------------
POST : service_provider_other_details post api is responsible for submitting signup-professionals-profile-2 form data 
------------------------------------------------------------------------------------------------- */

router.post("/service_provider_other_details", (req, res) => {
  var err_msg = null;
  var success_msg = null;
  //TODO:need to add condition is session is expired
  console.log("req.body is : ", req.body);
  console.log("req.session.user_id is ", req.session.user_id);
  if (req.body.spods_option_criminal_convictions == 'yes' && req.body.spods_details_of_convictions == "") {
    req.flash('err_msg', 'if you have any criminal convictions Please enter details.');
    return res.redirect('/signup-professionals-profile-2')
  }
  else {
    const serviceProviderOtherDetails = new ServiceProviderOtherDetailsSchema({
      spods_service_provider_id: req.session.user_id, //storing service_provider_id
      spods_option_work_permit_for_uk: req.body.spods_option_work_permit_for_uk,
      spods_option_criminal_convictions: req.body.spods_option_criminal_convictions,
      spods_option_uk_driving_licence: req.body.spods_option_uk_driving_licence,
      spods_details_of_convictions: req.body.spods_details_of_convictions,
      spods_professional_body: req.body.spods_professional_body,
      spods_date_registered: req.body.spods_date_registered,
      spods_membership_number: req.body.spods_membership_number,
      spods_membership_no_date_registered: req.body.spods_membership_no_date_registered,
      spods_other_relevant_qualification: req.body.spods_other_relevant_qualification
    });
    serviceProviderOtherDetails
      .save()
      .then(serviceProviders => {
        console.log("server response is ;", serviceProviders);
        res.redirect("/signup-professionals-profile-3")
      })
      .catch(err => {
        console.log(err)
        req.flash('err_msg', 'Something went wrong please try after some time');
        res.redirect('/signup-professionals-profile-2');
      });
  }
});


/* -------------------------------------------------------------------------------------------------
POST : service_provider_education post api is responsible for submitting signup-professionals-profile-3 form data 
------------------------------------------------------------------------------------------------- */

router.post("/service_provider_education", (req, res) => {
  var err_msg = null;
  var success_msg = null;
  //TODO:need to add condition is session is expired

  console.log("req.body is : ", req.body);
  console.log("req.session.user_id is ", req.session.user_id);
  const serviceProviderEducation = new ServiceProviderEducationSchema({
    //rs_service_provider_id /*Need to store same sp_id while registering */
    spes_service_provider_id: req.session.user_id,
    spes_university_school_name: req.body.spes_university_school_name,
    spes_qualification_obtained: req.body.spes_qualification_obtained,
    spes_from_date: req.body.spes_from_date,
    spes_to_date: req.body.spes_to_date,

  });
  serviceProviderEducation
    .save()
    .then(serviceProviders => {
      console.log("server response is: ", serviceProviders);
      res.redirect("/signup-professionals-profile-4")
    })
    .catch(err => {
      console.log(err)
      req.flash('err_msg', 'Something went wrong please try after some time');
      res.redirect('/signup-professionals-profile-3');
    });
});


/* -------------------------------------------------------------------------------------------------
POST : service_provider_employment_history post api is responsible for submitting signup-professionals-profile-4 from data 
------------------------------------------------------------------------------------------------- */

router.post("/service_provider_employment_history", (req, res) => {
  var err_msg = null;
  var success_msg = null;
  //TODO:need to add condition is session is expired

  console.log("req.body is : ", req.body);
  console.log("req.session.user_id is ", req.session.user_id);
  const serviceProviderEmploymentHistory = new ServiceProviderEmploymentHistorySchema({
    //rs_service_provider_id /*Need to store same sp_id while registering */
    spehs_service_provider_id: req.session.user_id,
    spehs_name_of_employer: req.body.spehs_name_of_employer,
    spehs_job_title: req.body.spehs_job_title,
    spehs_job_description: req.body.spehs_job_description,
    spehs_reason_for_leaving: req.body.spehs_reason_for_leaving,
    spehs_from_date: req.body.spehs_from_date,
    spehs_to_date: req.body.spehs_to_date
  });
  serviceProviderEmploymentHistory
    .save()
    .then(serviceProviders => {
      console.log("server response is", serviceProviders);
      res.redirect("/signup-professionals-profile-5")
    })
    .catch(err => {
      console.log(err)
      req.flash('err_msg', 'Something went wrong please try after some time');
      res.redirect('/signup-professionals-profile-4');
    });
});

/* -------------------------------------------------------------------------------------------------
POST : service_provider_reference post api is responsible for submitting signup-professionals-profile-5 from data 
------------------------------------------------------------------------------------------------- */

router.post("/service_provider_reference", (req, res) => {
  var err_msg = null;
  var success_msg = null;
  //TODO:need to add condition is session is expired

  console.log("req.body is : ", req.body);
  console.log("req.session.user_id is ", req.session.user_id);
  const serviceProviderReference = new ServiceProviderReferenceSchema({
    //rs_service_provider_id //TODO:*Need to store same sp_id while registering */
    rs_service_provider_id: req.session.user_id,
    rs_reference_type: req.body.rs_reference_type,
    rs_reference_job_title: req.body.rs_reference_job_title,
    rs_reference_organisation: req.body.rs_reference_organisation,
    rs_reference_postal_code: req.body.rs_reference_postal_code,
    rs_reference_address: req.body.rs_reference_address,
    rs_reference_telephonenumber: req.body.rs_reference_telephonenumber,
    rs_reference_emailid: req.body.rs_reference_emailid,
    rs_option_obtain_reference: req.body.rs_option_obtain_reference,
    rs_reference_relationship: req.body.rs_reference_relationship,
    rs_reference_fullname: req.body.rs_reference_fullname
  });

  serviceProviderReference
    .save()
    .then(serviceProviders => {
      console.log("server response is:", serviceProviders); res.redirect("/signup-professionals-profile-6")
    })
    .catch(err => {
      console.log(err)
      req.flash('err_msg', 'Something went wrong please try after some time.');
      res.redirect('/signup-professionals-profile-5');
    });
});


/* -------------------------------------------------------------------------------------------------
POST : service_provider_indemnity_details post api is responsible for submitting signup-professionals-profile-6 form data 
------------------------------------------------------------------------------------------------- */


router.post("/service_provider_indemnity_details", (req, res) => {
  var err_msg = null;
  var success_msg = null;
  //TODO:need to add condition is session is expired

  console.log("req.body is : ", req.body);
  console.log("req.session.user_id is ", req.session.user_id);
  if (req.body.spods_option_pl_claims == "yes" && req.body.spods_pl_claim_details == '') {
    req.flash("err_msg", "Please Enter PI claim details!");
    res.redirect('/signup-professionals-profile-6');
  } else {
    const serviceProviderIndemnityDetails = new ServiceProviderIndemnityDetailsSchema({
      spods_service_provider_id: req.session.user_id,
      spods_option_pl_claims: req.body.spods_option_pl_claims,
      spods_pl_claim_details: req.body.spods_pl_claim_details,
      spods_option_pl_cover: req.body.spods_option_pl_cover,
      spods_name_insurer: req.body.spods_name_insurer,
      spods_broker_details: req.body.spods_broker_details,
      spods_level_of_cover: req.body.spods_level_of_cover,
      spods_renewal_date: req.body.spods_renewal_date,

    });
    serviceProviderIndemnityDetails
      .save()
      .then(serviceProviders => {
        console.log("server response is:", serviceProviders);
        res.redirect("/signup-professionals-profile-7")
      })
      .catch(err => {
        console.log(err)
        req.flash('err_msg', 'Something went wrong please try after some time');
        res.redirect('/signup-professionals-profile-6');
      });
  }
});


/* -------------------------------------------------------------------------------------------------
POST : service_provider_language post api is responsible for submitting signup-professionals-profile-7 form data 
------------------------------------------------------------------------------------------------- */

router.post("/service_provider_language", (req, res) => {
  var err_msg = null;
  var success_msg = null;
  //TODO:need to add condition is session is expired

  console.log("req.body is : ", req.body);
  console.log("req.session.user_id is ", req.session.user_id);
  const serviceProviderLanguage = new ServiceProviderLanguageSchema({
    //spls_service_provider_id /*Need to store same sp_id while registering */
    spls_service_provider_id: req.session.user_id,
    spls_language: req.body.spls_language,
    spls_language_proficiency_level: req.body.spls_language_proficiency_level
  });
  serviceProviderLanguage
    .save()
    .then(serviceProviders => {
      console.log("server response is :", serviceProviders);
      res.redirect("/portfolio")
    })
    .catch(err => {
      console.log(err)
      req.flash('err_msg', 'Something went wrong please try again later.');
      res.redirect('/signup-professionals-profile-7');
    });
});

/* -------------------------------------------------------------------------------------------------
POST : service_provider_sign post api is used for login service_provider account 
------------------------------------------------------------------------------------------------- */

router.post("/service_provider_signin",
  (req, res) => {
    var err_msg = null;
    var success_msg = null;
    //TODO:need to add condition if session is expired

    const sps_email_id = req.body.sps_email_id;
    const sps_password = req.body.sps_password;

    const { errors, isValid } = validateServiceProviderSigninInput(req.body);

    // Check Validation
    if (!isValid) {
      req.flash('err_msg', "please enter valid emailid and password")
      return res.redirect('/signin-professional');
    }

    // Find Customer by 
    ServiceProviderSchema.findOne({ sps_email_id }).then(service_provider => {
      // Check for Customer
      if (!service_provider) {
        errors.sps_email_id = 'Service Provider not found';
        console.log("Service Provider not found");
        req.flash('err_msg', errors.sps_email_id);
        return res.redirect('/signin-professional');
      }
      // Check Password
      bcrypt.compare(sps_password, service_provider.sps_password).then(isMatch => {
        if (isMatch) {
          //enableing session variable
          // req.session._id = doc.user_id;
          req.session.success = true
          req.session.user_id = service_provider._id;
          req.session.name = service_provider.sps_fullname;
          req.session.email = service_provider.sps_email_id;
          req.session.role = service_provider.sps_role_name;
          req.session.is_user_logged_in = true;

          // service_provider Matched
          const payload = { id: service_provider.id, sps_fullname: service_provider.sps_fullname, sps_email_id: service_provider.sps_email_id }; // Create JWT Payload

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
          res.redirect('/dashboard-professional')
        } else {
          errors.sps_password = 'Password incorrect';
          console.log("Password incorrect");
          req.flash("err_msg", errors.sps_password);
          return res.redirect('/signin-professional');
        }
      });
    });
  });


/* -------------------------------------------------------------------------------------------------
GET : Logout API  
------------------------------------------------------------------------------------------------- */
router.get('/sp_logout', function (req, res) {
  console.log("logout");
  var test = req.session.is_user_logged_in;
  if (test == true) {
    req.session.destroy(function (err) {
      if (err) {
        return err;
      } else {
        return res.redirect('/signin-professional');
      }
    });
  }
});

/* -------------------------------------------------------------------------------------------------
POST : forget-password-professional  api is used for sending Password on user gmail 
------------------------------------------------------------------------------------------------- */
router.post('/forget-password-professional', function (req, res) {
  console.log("req.body is :", req.body);
  ServiceProviderSchema.find({
    'sps_email_id': req.body.sps_email_id,
    //'cus_email_verification_status': 'yes'
  }, function (err, result) {
    if (err) {
      console.log('err', err);
      req.flash('err_msg', 'Please enter registered Email address.');
      res.redirect('/forget-password-professional');
    } else {

      if (result != '' && result != null) {
        //generating 6 digit password hash
        new_pass = Math.random().toString(36).slice(-6);
        var hashPassword = "";
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(new_pass, salt, (err, hash) => {
            if (err) throw err;
            hashPassword = hash;

            ServiceProviderSchema.updateOne({
              'sps_email_id': req.body.sps_email_id
            }, {
              $set: {
                sps_password: hashPassword
              }
            }, {
              upsert: true
            }, function (err) {
              if (err) {
                console.log("err is :", err);
                req.flash('err_msg', 'Something went wrong.');
                res.redirect('/forget-password-professional')
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
                    pass: 'Krishna#1997',
                  }
                });
                const mailOptions = {
                  to: req.body.sps_email_id,
                  from: 'golearning4@gmail.com',
                  subject: 'Relai Forget Password',

                  text: 'Dear Customer,' + '\n\n' + 'New Password from Relai.\n\n' +
                    'Password: ' + new_pass + '\n\n' +

                    'We suggest you to please change your password after successfully logging in on the portal using the above password :\n' + 'Here is the change password link: http://' + req.headers.host + '/Change-password' + '\n\n' +
                    'Thanks and Regards,' + '\n' + 'Relai Team' + '\n\n',

                };
                smtpTransport.sendMail(mailOptions, function (err) {
                  if (err) { console.log('err_msg is :', err); req.flash('err_msg', 'Something went wrong.please connect support team'); res.redirect('/forget-password-professional') } else {
                    req.flash('success_msg', 'Password has been sent successfully to your registered email, please check your mail...');
                    res.redirect('/forget-password-professional')
                  }
                });
              }
            });
          });
        });
      } else {
        req.flash('err_msg', 'Please enter registered Email address.');
        res.redirect('/forget-password-professional');
      }

    }
  });
});



module.exports = router;
