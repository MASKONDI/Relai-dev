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


const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

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
router.post("/service_provider_portfolio", service_provider_portfolio);
//router.post("/service_provider_reference", service_provider_reference);
router.post("/service_provider_signin", service_provider_signin);
router.post("/pricing_plan", pricing_plan);


router.get('/service_provider_register', function (req, res) {
  res.render("/service_provider_register");

});

/* -------------------------------------------------------------------------------------------------
POST : service_provider_register post api is responsible for submitting signup-service-provider form data 
------------------------------------------------------------------------------------------------- */

router.post("/service_provider_register", (req, res) => {
  console.log("req.body is : ", req.body);
  const { errors, isValid } = validateServiceProviderRegisterInput(req.body);

  //Check Validation
  if (!isValid) {
    // req.flash('errors', 'Something went wrong.');
    console.log("errors is ", errors);
    return res.redirect('/signup-service-provider')
  }

  ServiceProviderSchema.findOne({ sps_email_id: req.body.sps_email_id }).then(serviceProviders => {
    if (serviceProviders) {
      errors.sps_email_id = 'Email already exists';
      console.log("error is :", errors);
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
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newServiceProvider.sps_password, salt, (err, hash) => {
          if (err) throw err;
          newServiceProvider.sps_password = hash;
          newServiceProvider
            .save()
            .then(serviceProviders => res.redirect("/signup-professionals-profile"))
            .catch(err => {
              console.log(err)
              // req.flash('err_msg', 'You have entered wrong email or password try again.');
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
  console.log("req.body is : ", req.body);
  const serviceProviderPersonalDetails = new ServiceProviderOtherDetailsSchema({
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
    .then(serviceProviders => res.redirect("/signup-professionals-profile-2"))
    .catch(err => {
      console.log(err)
      // req.flash('err_msg', 'You have entered wrong email or password try again.');
      res.redirect('/signup-professionals-profile');
    });
});


/* -------------------------------------------------------------------------------------------------
POST : service_provider_other_details post api is responsible for submitting signup-professionals-profile-2 form data 
------------------------------------------------------------------------------------------------- */

router.post("/service_provider_other_details", (req, res) => {
  console.log("req.body is : ", req.body);
  const serviceProviderOtherDetails = new ServiceProviderOtherDetailsSchema({
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
    .then(serviceProviders => res.redirect("/signup-professionals-profile-3"))
    .catch(err => {
      console.log(err)
      // req.flash('err_msg', 'You have entered wrong email or password try again.');
      res.redirect('/signup-professionals-profile-2');
    });
});


/* -------------------------------------------------------------------------------------------------
POST : service_provider_education post api is responsible for submitting signup-professionals-profile-3 form data 
------------------------------------------------------------------------------------------------- */

router.post("/service_provider_education", (req, res) => {
  console.log("req.body is : ", req.body);
  const serviceProviderEducation = new ServiceProviderEducationSchema({
    //rs_service_provider_id /*Need to store same sp_id while registering */
    spes_university_school_name: req.body.spes_university_school_name,
    spes_qualification_obtained: req.body.spes_qualification_obtained,
    spes_from_date: req.body.spes_from_date,
    spes_to_date: req.body.spes_to_date,

  });
  serviceProviderEducation
    .save()
    .then(serviceProviders => res.redirect("/signup-professionals-profile-4"))
    .catch(err => {
      console.log(err)
      // req.flash('err_msg', 'You have entered wrong email or password try again.');
      res.redirect('/signup-professionals-profile-3');
    });
});


/* -------------------------------------------------------------------------------------------------
POST : service_provider_employment_history post api is responsible for submitting signup-professionals-profile-4 from data 
------------------------------------------------------------------------------------------------- */


router.post("/service_provider_employment_history", (req, res) => {
  console.log("req.body is : ", req.body);
  const serviceProviderEmploymentHistory = new ServiceProviderEmploymentHistorySchema({
    //rs_service_provider_id /*Need to store same sp_id while registering */
    spehs_name_of_employer: req.body.spehs_name_of_employer,
    spehs_job_title: req.body.spehs_job_title,
    spehs_job_description: req.body.spehs_job_description,
    spehs_reason_for_leaving: req.body.spehs_reason_for_leaving,
    spehs_from_date: req.body.spehs_from_date,
    spehs_to_date: req.body.spehs_to_date
  });
  serviceProviderEmploymentHistory
    .save()
    .then(serviceProviders => res.redirect("/signup-professionals-profile-5"))
    .catch(err => {
      console.log(err)
      // req.flash('err_msg', 'You have entered wrong email or password try again.');
      res.redirect('/signup-professionals-profile-4');
    });
});

/* -------------------------------------------------------------------------------------------------
POST : service_provider_reference post api is responsible for submitting signup-professionals-profile-5 from data 
------------------------------------------------------------------------------------------------- */

router.post("/service_provider_reference", (req, res) => {
  console.log("req.body is : ", req.body);

  const serviceProviderReference = new ServiceProviderReferenceSchema({
    //rs_service_provider_id /*Need to store same sp_id while registering */
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
    .then(serviceProviders => res.redirect("/signup-professionals-profile-6"))
    .catch(err => {
      console.log(err)
      // req.flash('err_msg', 'You have entered wrong email or password try again.');
      res.redirect('/signup-professionals-profile-5');
    });
});


/* -------------------------------------------------------------------------------------------------
POST : service_provider_indemnity_details post api is responsible for submitting signup-professionals-profile-6 form data 
------------------------------------------------------------------------------------------------- */


router.post("/service_provider_indemnity_details", (req, res) => {
  console.log("req.body is : ", req.body);
  const serviceProviderIndemnityDetails = new ServiceProviderOtherDetailsSchema({
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
    .then(serviceProviders => res.redirect("/signup-professionals-profile-7"))
    .catch(err => {
      console.log(err)
      // req.flash('err_msg', 'You have entered wrong email or password try again.');
      res.redirect('/signup-professionals-profile-6');
    });
});


/* -------------------------------------------------------------------------------------------------
POST : service_provider_language post api is responsible for submitting signup-professionals-profile-7 form data 
------------------------------------------------------------------------------------------------- */

router.post("/service_provider_language", (req, res) => {
  console.log("req.body is : ", req.body);
  const serviceProviderLanguage = new ServiceProviderLanguageSchema({
    //spls_service_provider_id /*Need to store same sp_id while registering */
    spls_language: req.body.spls_language,
    spls_language_proficiency_level: req.body.spls_language_proficiency_level
  });
  serviceProviderLanguage
    .save()
    .then(serviceProviders => res.redirect("/portfolio"))
    .catch(err => {
      console.log(err)
      // req.flash('err_msg', 'You have entered wrong email or password try again.');
      res.redirect('/signup-professionals-profile-7');
    });
});

router.post("/service_provider_signin",
  (req, res) => {
    const sps_email_id = req.body.sps_email_id;
    const sps_password = req.body.sps_password;

    const { errors, isValid } = validateServiceProviderSigninInput(req.body);

    // Check Validation
    if (!isValid) {
      //return res.status(400).json(errors);
      //req.flash
      return res.redirect('/signin-professional');
    }

    // Find Customer by 
    ServiceProviderSchema.findOne({ sps_email_id }).then(service_provider => {
      // Check for Customer
      if (!service_provider) {
        errors.sps_email_id = 'Service Provider not found';
        console.log("Service Provider not found");
        return res.redirect('/signin-professional');
      }
      // Check Password
      bcrypt.compare(sps_password, service_provider.sps_password).then(isMatch => {
        if (isMatch) {
          // service_provider Matched
          const payload = { id: service_provider.id, cus_fullname: service_provider.cus_fullname, sps_email_id: service_provider.sps_email_id }; // Create JWT Payload

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
          //req.flash
          return res.redirect('/signin-professional');
        }
      });
    });
  });





module.exports = router;
