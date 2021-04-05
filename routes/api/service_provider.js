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
const validateProfChangePasswordInput = require('../../Validation/change-password-professional');
const ServiceProviderUploadDocsSchema = require("../../models/service_provider_upload_document");
const MessageSchema = require("../../models/message");
const NotificationSchema = require("../../models/notification_modal");
const DocumentPermissionSchema = require('../../models/document_permission')

const PropertyProfessinoalTaskSchema = require('../../models/property_professional_tasks_Schema')

const ComplaintsSchema = require("../../models/Complaints");
const ComplaintDetailsSchema = require("../../models/complaint_details_model");
const DocumentDownloadSchema = require('../../models/document_download_modal')


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
const path = require('path');
var fs = require('fs');
const multer = require('multer');

// Load Input Validation
const validateServiceProviderRegisterInput = require('../../Validation/service_provider_signup');
const validateServiceProviderSigninInput = require('../../Validation/service_provider_signin');
const { where } = require("../../models/service_provider_employment_history");
var signUpHelper = require('../api/service_provider_helper/signup_helper')

////const { service_provider_register, service_provider_signin, service_provider_personal_details, service_provider_other_details, service_provider_Indemnity_details, service_provider_Roles, service_provider_education, service_provider_employment_history, service_provider_language, service_provider_plan, service_provider_portfolio, service_provider_reference, pricing_plan } = require("../../controllers/service_providers");


//router.post("/service_provider_register", service_provider_register);
//router.post("/service_provider_personal_details", service_provider_personal_details);
//router.post("/service_provider_other_details", service_provider_other_details);
//router.post("/service_provider_indemnity_details", service_provider_Indemnity_details);
//router.post("/service_provider_roles", service_provider_Roles);
//router.post("/service_provider_education", service_provider_education);
//router.post("/service_provider_employment_history", service_provider_employment_history);
//router.post("/service_provider_language", service_provider_language);
//router.post("/service_provider_plan", service_provider_plan);
//router.post("/service_provider_portfolio", service_provider_portfolio);
//router.post("/service_provider_reference", service_provider_reference);
//router.post("/service_provider_signin", service_provider_signin);
//router.post("/pricing_plan", pricing_plan);






var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === "complaint_file") {
      cb(null, 'public/complaintFile')
    }
  },
  filename: function (req, file, cb) {
    var datetimestamp = Date.now();
    const Filename = file.originalname
    const FilenameCleaned = Filename.replace(/\s/g, '')
    cb(null, FilenameCleaned.split('.').join('-' + Date.now() + '.'))
  }
})

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 10
  },
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  }
}).fields(
  [
    {
      name: 'complaint_file', maxCount: 3
    }
  ]
);
function checkFileType(file, cb) {
  if (file.fieldname === "complaint_file") {
    if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg' ||
      file.mimetype === 'image/gif' || file.mimetype === 'application/pdf'
    ) { // check file type to be png, jpeg, or jpg
      cb(null, true);
    } else {
      cb(null, false); // else fails
    }
  }
}



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
    // req.flash('err_msg', errors.confirmPassword);
    // return res.redirect('/signup-service-provider')
    console.log('errosss:', errors)
    if (errors.confirmPassword) {
      res.send({
        message: errors.confirmPassword,
        status: false
      })
    } else {
      res.send({
        message: errors.sps_email_id,
        status: false
      })
    }
  }

  ServiceProviderSchema.findOne({ sps_email_id: req.body.sps_email_id }).then(serviceProviders => {
    if (serviceProviders) {
      errors.sps_email_id = 'Email already exists';
      console.log("error is :", errors);
      // req.flash('err_msg', errors.sps_email_id);
      // return res.redirect('/signup-service-provider');
      res.send({
        message: errors.sps_email_id,
        status: false
      })
    } else {
      var now = new Date();
      now.setMinutes(now.getMinutes() + 03); // timestamp
      now = new Date(now); // Date object

      var otp_expire = now
      console.log("otp_expire time is", now);

      var otp = generateOTP()
      console.log("otp is", otp);
      var rendomNumber = '';
      var ServiceProviderCode ='';
      if(req.body.sps_role_name == 'Solicitor'){
         rendomNumber = Math.floor(10000 + Math.random() * 9000);
         ServiceProviderCode = 'SOL'+rendomNumber;  
      }else{
        rendomNumber = Math.floor(10000 + Math.random() * 9000);
        ServiceProviderCode = 'SPR'+rendomNumber;  
      }
     
      const newServiceProvider = new ServiceProviderSchema({
        sps_unique_code: ServiceProviderCode,
        sps_firstname: req.body.sps_firstname,
        sps_lastname: req.body.sps_lastname,
        sps_fullname: req.body.sps_firstname + ' ' + req.body.sps_lastname,
        sps_email_id: req.body.sps_email_id,
        sps_phone_number: req.body.sps_phone_number,
        sps_address: req.body.sps_address,
        sps_country_id: req.body.country,
        sps_city: req.body.city,
        sps_state: req.body.state,
        sps_password: req.body.sps_password,
        sps_role_name: req.body.sps_role_name,
        sps_experience: req.body.sps_experience,
        sps_otp: otp,
        sps_otp_expie_time: otp_expire,
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newServiceProvider.sps_password, salt, (err, hash) => {
          if (err) throw err;
          newServiceProvider.sps_password = hash;
          newServiceProvider
            .save()
            .then(serviceProviders => {
              console.log("service_provider is", serviceProviders);
              //calling Otp verfication
              // otp_verification(req, otp);
              req.session.success = true,
                // req.session._id = doc.user_id;
                req.session.user_id = serviceProviders._id,
                req.session.name = serviceProviders.sps_fullname,
                req.session.sps_firstname = serviceProviders.sps_firstname,
                req.session.sps_lastname = serviceProviders.sps_lastname,
                req.session.sps_address = serviceProviders.sps_address,
                req.session.email = serviceProviders.sps_email_id,
                req.session.role = serviceProviders.sps_role_name,
                req.session.imagename = '',
                req.session.is_user_logged_in = true,
                req.session.active_user_login = "buyer"
              //   req.flash('service_provider', serviceProviders);
              // res.redirect("/signup-professionals-profile")
              res.send({
                serviceProviders: serviceProviders,
                message: "You have registered sucessfully.",
                status: true,

              })

            })
            .catch(err => {
              console.log(err)
              // req.flash('err_msg', 'You have entered wrong email or password please try again.');
              // res.redirect('/signup-service-provider');
              res.send({
                message: 'Something went wrong please try again later.',
                status: false
              })

            });
        });
      });
    }
  });
});


/* -------------------------------------------------------------------------------------------------
POST : service_provider_personal_details post api is responsible for submitting signup-professionals-profile form data 
------------------------------------------------------------------------------------------------- */
var moment = require('moment');
router.get("/service_provider_personal_details", async (req, res) => {
  console.log('req', req.query);
  if (req.query.user_id) {
    var data = await signUpHelper.getPersonalDetialByID(req.query.user_id);
    // var d = JSON.stringify(data) 
    // var dd = JSON.parse(data)
    var spods_dob = moment(data.spods_dob).format('YYYY-MM-DD');
    var spods_start_working_time = moment(data.spods_start_working_time).format('YYYY-MM-DD');
    if (data) {

      return res.send({
        'status': true,
        'data': data,
        'spods_dob': spods_dob,
        'spods_start_working_time': spods_start_working_time
      })
    } else {
      return res.send({
        'status': false,

      })
    }
  } else {
    return res.send({
      'status': false,

    })
  }

})
router.post("/service_provider_personal_details", (req, res) => {
  var err_msg = null;
  var success_msg = null;
  //TODO:need to add condition is session is expired

  console.log("req.body is : ", req.body);
  console.log("user_id is:", req.session.user_id);
  console.log('is update id', req.body.personal_detail_id)
  if (req.body.personal_detail_id != '') {
    console.log('please update me')
    const serviceProviderPersonalDetails = {
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
    }
    ServiceProviderPersonalDetailsSchema
      .updateOne(serviceProviderPersonalDetails).where({ _id: req.body.personal_detail_id })
      .then(serviceProviders => {
        console.log("server res is : ", serviceProviders);
        // res.redirect("/signup-professionals-profile-2")
        if(req.body.isedit==1){
        res.send({
          message: 'Personal-details Update successfully',
          status: true,
          action:'isedit'
        })
      }else{
        res.send({
          message: 'Personal-details Update successfully',
          status: true,
          action:'isnext'
        })
      }

      })
      .catch(err => {
        console.log(err)
        res.send({
          message: 'Something went wrong please try after some time!',
          status: false
        })
        //req.flash('err_msg', 'Something went wrong please try after some time!');
        //res.redirect('/signup-professionals-profile');
      });
  } else {
    console.log('please add me')
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
        // res.redirect("/signup-professionals-profile-2")
        res.send({
          message: 'Personal-details sumitted successfully,please continue....',
          status: true,
        })

      })
      .catch(err => {
        console.log(err)
        res.send({
          message: 'Something went wrong please try after some time!',
          status: false
        })
        //req.flash('err_msg', 'Something went wrong please try after some time!');
        //res.redirect('/signup-professionals-profile');
      });
  }

});


/* -------------------------------------------------------------------------------------------------
POST : service_provider_other_details post api is responsible for submitting signup-professionals-profile-2 form data 
------------------------------------------------------------------------------------------------- */
router.get("/service_provider_other_details", async (req, res) => {
  console.log('req', req.query);
  if (req.query.user_id) {
    var data = await signUpHelper.getOtherDetialByID(req.query.user_id);
    if (data) {
      return res.send({
        'status': true,
        'data': data
      })
    } else {
      return res.send({
        'status': false,

      })
    }
  } else {
    return res.send({
      'status': false,

    })
  }
})
router.post("/service_provider_other_details", (req, res) => {
  var err_msg = null;
  var success_msg = null;
  //TODO:need to add condition is session is expired
  console.log("req.body is : ", req.body);
  console.log("req.session.user_id is ", req.session.user_id);
  if (req.body.other_detail_id) {
    if (req.body.spods_option_criminal_convictions == 'yes' && req.body.spods_details_of_convictions == "") {
      //req.flash('err_msg', '.');
      //return res.redirect('/signup-professionals-profile-2')
      res.send({
        message: "Please enter criminal convictions details",
        status: false,
        redirectpage: false,
        redirect: ''
      })
    }
    else {
      const serviceProviderOtherDetails = {
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
      }
      ServiceProviderOtherDetailsSchema
        .updateOne(serviceProviderOtherDetails).where({ _id: req.body.other_detail_id })
        .then(serviceProviders => {
          console.log("server response is ;", serviceProviders);
          // res.redirect("/signup-professionals-profile-3")
          if(req.body.isedit==1){
            res.send({
              message: "Other-details Update successfully",
              status: true,
              action:'isedit'
            })
          }else{
          res.send({
            message: "Other-details Update successfully",
            status: true,
            action:'isnext'
          })
        }
        })
        .catch(err => {
          console.log(err)
          //req.flash('err_msg', 'Something went wrong please try after some time');
          //res.redirect('/signup-professionals-profile-2');
          res.send({
            message: "something went wrong please try after some time!",
            status: false,
            redirectpage: false,
            redirect: ''
          })
        });
    }
  } else {
    if (req.body.spods_option_criminal_convictions == 'yes' && req.body.spods_details_of_convictions == "") {
      //req.flash('err_msg', '.');
      //return res.redirect('/signup-professionals-profile-2')
      res.send({
        message: "Please enter criminal convictions details",
        status: false,
        redirectpage: false,
        redirect: ''
      })
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
          // res.redirect("/signup-professionals-profile-3")
          res.send({
            message: "Other-details submitted successfully, please continue...",
            status: true
          })
        })
        .catch(err => {
          console.log(err)
          //req.flash('err_msg', 'Something went wrong please try after some time');
          //res.redirect('/signup-professionals-profile-2');
          res.send({
            message: "something went wrong please try after some time!",
            status: false,
            redirectpage: false,
            redirect: ''
          })
        });
    }
  }

});


/* -------------------------------------------------------------------------------------------------
POST : service_provider_education post api is responsible for submitting signup-professionals-profile-3 form data 
------------------------------------------------------------------------------------------------- */
router.get("/service_provider_education", (req, res) => {
  ServiceProviderEducationSchema.findOne({ spes_service_provider_id: req.query.user_id }).then((resp) => {
    if (resp) {
      res.send({
        status: true,
        data: resp
      })
    } else {
      res.send({
        status: false,
        data: resp
      })
    }
  })
})
router.post("/service_provider_education", (req, res) => {
  var err_msg = null;
  var success_msg = null;
  //TODO:need to add condition is session is expired

  console.log("req.body is : ", req.body);
  console.log("req.session.user_id is ", req.session.user_id);
  if (req.body.education_id) {

    ServiceProviderEducationSchema.updateOne({ 'spes_service_provider_id': req.session.user_id, '_id': req.body.education_id }, {
      $set: {
        spes_university_school_name: req.body.spes_university_school_name,
        spes_qualification_obtained: req.body.spes_qualification_obtained,
        spes_from_date: req.body.spes_from_date,
        spes_to_date: req.body.spes_to_date,
      }
    }, { upsert: true }, function (err) {
      if (err) {
        res.send({
          err_msg: 'Something went wrong please try after some time',
          status: false
        });
      } else {
        res.send({
          status: true,
          action: 'update',
          success_msg: 'Education details updated successfully'
        });
      }
    })


  } else {

    const serviceProviderEducation = new ServiceProviderEducationSchema({
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
        res.send({
          educationDetail: serviceProviders,
          status: true,
          success_msg: 'Education details  added successfully',
          action: 'add'
        });
      })
      .catch(err => {
        console.log(err)
        res.send({
          err_msg: 'Something went wrong please try after some time',
          status: false
        });

      });

  }

});


/* -------------------------------------------------------------------------------------------------
POST : service_provider_employment_history post api is responsible for submitting signup-professionals-profile-4 from data 
------------------------------------------------------------------------------------------------- */
router.get("/service_provider_employment_history", (req, res) => {
  ServiceProviderEmploymentHistorySchema.findOne({ spehs_service_provider_id: req.query.user_id }).then((resp) => {
    if (resp) {
      res.send({
        status: true,
        data: resp
      })
    } else {
      res.send({
        status: false,
        data: resp
      })
    }
  })
})
router.post("/service_provider_employment_history", (req, res) => {
  var err_msg = null;
  var success_msg = null;
  //TODO:need to add condition is session is expired

  console.log("req.body is : ", req.body);
  console.log("req.session.user_id is ", req.session.user_id);
  var obj = {
    spehs_name_of_employer: req.body.spehs_name_of_employer,
    spehs_job_title: req.body.spehs_job_title,
    spehs_job_description: req.body.spehs_job_description,
    spehs_reason_for_leaving: req.body.spehs_reason_for_leaving,
    spehs_from_date: req.body.spehs_from_date,
    spehs_to_date: req.body.spehs_to_date
  }
  if (req.body.employment_id) {
    ServiceProviderEmploymentHistorySchema.updateOne({ 'spehs_service_provider_id': req.session.user_id, '_id': req.body.employment_id }, { $set: obj }, { upsert: true }, function (err) {
      if (err) {
        res.send({
          err_msg: 'Something went wrong please try after some time',
          status: false
        });
      } else {
        res.send({
          status: true,
          action: 'update',
          success_msg: 'Employment History updated successfully'
        });
      }
    })
  } else {
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
        //res.redirect("/signup-professionals-profile-5")
        // res.send({
        //   employmentDetail: serviceProviders,
        //   status: true
        // });
        res.send({
          employmentDetail: serviceProviders,
          status: true,
          success_msg: 'Employment History added successfully',
          action: 'add'
        });
      })
      .catch(err => {
        console.log(err)
        // req.flash('err_msg', 'Something went wrong please try after some time');
        //res.redirect('/signup-professionals-profile-4');
        res.send({
          err_msg: 'Something went wrong please try after some time',
          status: false
        });
      });
  }
});
router.post("/edit-service_provider_employment_history", async (req, res) => {
  var err_msg = null;
  var success_msg = null;
  //TODO:need to add condition is session is expired
  let data = '';
  console.log("req.body is : ", req.body);
  console.log("req.session.user_id is ", req.session.user_id);
  if (req.body.action == 'employment-edit') {
    data = await ServiceProviderEmploymentHistorySchema.findOne({ _id: req.body.emp_historyId });
  }
  if (data) {
    console.log("server response is success: ", data);
    res.send({
      data: data,
      message: 'Update Successfully !!',
      status: true
    });
  } else {
    console.log("server response is error: ", data);
    res.send({
      data: data,
      message: 'Something going wrong please try again !!',
      status: false
    });
  }

});
router.post("/delete-service_provider_employment_history", async (req, res) => {
  var err_msg = null;
  var success_msg = null;
  //TODO:need to add condition is session is expired
  let deleteData = '';
  console.log("req.body is : ", req.body);
  console.log("req.session.user_id is ", req.session.user_id);
  if (req.body.action == 'employment-delete') {
    deleteData = await ServiceProviderEmploymentHistorySchema.deleteOne({ _id: req.body.emp_historyId });
  }
  if (deleteData) {
    console.log("server response is success: ", deleteData);
    res.send({
      deleteData: deleteData,
      message: 'Deleted Successfully !!',
      status: true
    });
  } else {
    console.log("server response is error: ", deleteData);
    res.send({
      deleteData: deleteData,
      message: 'Something going wrong please try again !!',
      status: false
    });
  }

});
/* -------------------------------------------------------------------------------------------------
POST : service_provider_reference post api is responsible for submitting signup-professionals-profile-5 from data 
------------------------------------------------------------------------------------------------- */
router.get("/get_service_provider_reference", async (req, res) => {
  console.log('req', req.query);
  if (req.query.user_id) {
    var data = await signUpHelper.getReferenceDetailById(req.query.user_id);
    console.log('=====================', data)
    if (data) {
      return res.send({
        'status': true,
        'data': data
      })
    } else {
      return res.send({
        'status': false,

      })
    }
  } else {
    return res.send({
      'status': false,

    })
  }
})
router.post("/service_provider_reference", (req, res) => {
  var err_msg = null;
  var success_msg = null;
  //TODO:need to add condition is session is expired

  console.log("req.body is====++++++++ : ", req.body);
  console.log("req.session.user_id is ", req.session.user_id);

  if (req.body.ref_id != '') {
    console.log('edit able')
    const serviceProviderReference = {
      //rs_service_provider_id //TODO:*Need to store same sp_id while registering */

      rs_reference_type: req.body.rs_reference_type,
      rs_reference_job_title: req.body.rs_reference_job_title,
      rs_reference_organisation: req.body.rs_reference_organisation,
      rs_reference_postal_code: req.body.rs_reference_postal_code,
      rs_reference_address: req.body.rs_reference_address,
      rs_reference_telePhoneNumber: req.body.rs_reference_telePhoneNumber,
      rs_reference_emailid: req.body.rs_reference_emailid,
      rs_option_obtain_reference: req.body.rs_option_obtain_reference,
      rs_reference_relationship: req.body.rs_reference_relationship,
      rs_reference_fullname: req.body.rs_reference_fullname
    }
    ServiceProviderReferenceSchema
      .updateOne(serviceProviderReference).where({ _id: req.body.ref_id })
      .then(serviceProviders => {

        console.log("server response is:", serviceProviders);
       if(req.body.isedit==1){
        res.send({
          message: "Reference-details Update successfully",
          status: true,
          redirect: '/service-provider/dashboard-professional',
          action: 'isedit'
        })
       }else{
        res.send({
          message: "Reference-details Update successfully",
          status: true,
          redirect: '/service-provider/dashboard-professional',
          action: 'isnext'
        })
       }
        
      })
      .catch(err => {
        console.log(err)

        res.send({
          err_msg: 'Something went wrong please try after some time',
          status: false
        });

      });
  } else {
    console.log('add able');

    const serviceProviderReference = new ServiceProviderReferenceSchema({
      //rs_service_provider_id //TODO:*Need to store same sp_id while registering */
      rs_service_provider_id: req.session.user_id,
      rs_reference_type: req.body.rs_reference_type,
      rs_reference_job_title: req.body.rs_reference_job_title,
      rs_reference_organisation: req.body.rs_reference_organisation,
      rs_reference_postal_code: req.body.rs_reference_postal_code,
      rs_reference_address: req.body.rs_reference_address,
      rs_reference_telePhoneNumber: req.body.rs_reference_telePhoneNumber,
      rs_reference_emailid: req.body.rs_reference_emailid,
      rs_option_obtain_reference: req.body.rs_option_obtain_reference,
      rs_reference_relationship: req.body.rs_reference_relationship,
      rs_reference_fullname: req.body.rs_reference_fullname
    });

    serviceProviderReference
      .save()
      .then(serviceProviders => {

        console.log("server response is:", serviceProviders);

        res.send({
          message: "Reference-details submitted successfully, please continue...",
          status: true,
          action: 'add'
        })
      })
      .catch(err => {
        console.log(err)

        res.send({
          err_msg: 'Something went wrong please try after some time',
          status: false
        });

      });
  }

});


/* -------------------------------------------------------------------------------------------------
POST : service_provider_indemnity_details post api is responsible for submitting signup-professionals-profile-6 form data 
------------------------------------------------------------------------------------------------- */
router.get("/service_provider_indemnity_details", async (req, res) => {
  console.log('req', req.query);
  if (req.query.user_id) {
    var data = await signUpHelper.getIndemnityDetailsById(req.query.user_id);
    console.log('indemnity_details', data)
    if (data) {
      return res.send({
        'status': true,
        'data': data
      })
    } else {
      return res.send({
        'status': false,

      })
    }
  } else {
    return res.send({
      'status': false,

    })
  }
})

router.post("/service_provider_indemnity_details", (req, res) => {
  var err_msg = null;
  var success_msg = null;
  //TODO:need to add condition is session is expired

  console.log("req.body is : ", req.body);
  if (req.body.indemnity_detail_id != '') {
    if (req.body.spods_option_pl_claims === "yes" && req.body.spods_pl_claim_details === '') {
      //req.flash("err_msg", "Please Enter PI claim details!");
      //res.redirect('/signup-professionals-profile-6');
      console.log("req.body.spods_option_pl_claims is ", req.body.spods_option_pl_claims);
      res.send({
        message: "Please enter PI claim details",
        status: false,
        redirectpage: false,
        redirect: ''
      })
    } else {
      const serviceProviderIndemnityDetails = {
        spods_service_provider_id: req.session.user_id,
        spods_option_pl_claims: req.body.spods_option_pl_claims,
        spods_pl_claim_details: req.body.spods_pl_claim_details,
        spods_option_pl_cover: req.body.spods_option_pl_cover,
        spods_name_insurer: req.body.spods_name_insurer,
        spods_broker_details: req.body.spods_broker_details,
        spods_level_of_cover: req.body.spods_level_of_cover,
        spods_renewal_date: req.body.spods_renewal_date,

      }
      ServiceProviderIndemnityDetailsSchema
        .updateOne(serviceProviderIndemnityDetails).where({ _id: req.body.indemnity_detail_id })
        .then(serviceProviders => {
          console.log("server response is:", serviceProviders);
          if(req.body.isedit==1){
          res.send({
            message: "Indemnity-Details Update successfully.",
            status: true,
            action:'isedit'
          })
        }else{
          res.send({
            message: "Indemnity-Details Update successfully.",
            status: true,
            action:'isnext'
          })
        }
          //res.redirect("/signup-professionals-profile-7")
        })
        .catch(err => {
          console.log(err)
          res.send({
            message: "Something went wrong please try after some time ",
            status: false,
          })
          //req.flash('err_msg', 'Something went wrong please try after some time');
          //res.redirect('/signup-professionals-profile-6');
        });
    }
  } else {
    if (req.body.spods_option_pl_claims === "yes" && req.body.spods_pl_claim_details === '') {
      //req.flash("err_msg", "Please Enter PI claim details!");
      //res.redirect('/signup-professionals-profile-6');
      console.log("req.body.spods_option_pl_claims is ", req.body.spods_option_pl_claims);
      res.send({
        message: "Please enter PI claim details",
        status: false,
        redirectpage: false,
        redirect: ''
      })
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
          res.send({
            message: "Indemnity-Details submitted successfully.please continue...",
            status: true,
          })
          //res.redirect("/signup-professionals-profile-7")
        })
        .catch(err => {
          console.log(err)
          res.send({
            message: "Something went wrong please try after some time ",
            status: false,
          })
          //req.flash('err_msg', 'Something went wrong please try after some time');
          //res.redirect('/signup-professionals-profile-6');
        });
    }
  }

});


/* -------------------------------------------------------------------------------------------------
POST : service_provider_language post api is responsible for submitting signup-professionals-profile-7 form data 
------------------------------------------------------------------------------------------------- */
router.post("/delete_service_provider_language", async (req, res) => {
  var err_msg = null;
  var success_msg = null;
  //TODO:need to add condition is session is expired
  let deleteData = '';
  console.log("req.body is : ", req.body);
  console.log("req.session.user_id is ", req.session.user_id);
  if (req.body.action == 'language-delete') {
    deleteData = await ServiceProviderLanguageSchema.deleteOne({ _id: req.body.langId });
  }
  if (deleteData) {
    console.log("server response is success: ", deleteData);
    res.send({
      deleteData: deleteData,
      message: 'Language Deleted Successfully !!',
      status: true
    });
  } else {
    console.log("server response is error: ", deleteData);
    res.send({
      deleteData: deleteData,
      message: 'Something going wrong please try again !!',
      status: false
    });
  }
})
router.get("/service_provider_language", async (req, res) => {
  console.log('req', req.query);
  if (req.query.user_id) {
    var data = await signUpHelper.getIndemnityLanguageById(req.query.user_id);
    console.log('language', data)
    if (data.length > 0) {
      return res.send({
        'status': true,
        'data': data
      })
    } else {
      return res.send({
        'status': false,

      })
    }
  } else {
    return res.send({
      'status': false,

    })
  }
})
router.post("/service_provider_language", async (req, res) => {
  var err_msg = null;
  var success_msg = null;
  //TODO:need to add condition is session is expired
  var flag = true;
  console.log("req.body is lang: ", req.body.spls_language);
  // console.log("req.body is lang: ", req.body);
  if (req.body.spls_language != '') {
    if (typeof (req.body.spls_language) == 'object') {
      if (req.body.spls_language.length == 0 || req.body.spls_language_proficiency_level.length == 0) {
        res.send(
          {
            'status': 0,
            'message': 'something went wrong....'
          }
        )
      } else {
        if (req.body.lang_id) {
          console.log('edit multiple lang', req.body.lang_id)
          var responce = await signUpHelper.editMultipleLang(req)
          res.send(responce)
        } else {
          console.log('add multiple lang')
          var responce = await signUpHelper.saveMultipleLang(req)
          res.send(responce)
        }
      }
      //console.log('bbbbbbbbbbbbbbbb')

      //res.send(responce)
    } else if (typeof (req.body.spls_language) == 'string') {
      if (req.body.lang_id) {
        console.log('edit one lang', req.body.lang_id)
        var responce = await signUpHelper.editOneLang(req)
        res.send(responce)
      } else {
        console.log('add one lang')
        var responce = await signUpHelper.saveOneLang(req)
        res.send(responce)
      }

      //console.log('aaaaaaaaaaaaaaaaaa')

    }
  } else {
    res.send({
      status: false,
      'message': 'please select filds'
    })
  }


});
/* -------------------------------------------------------------------------------------------------
Get : portpolio post api is responsible for geting portpolio form data 
------------------------------------------------------------------------------------------------- */
router.get("/portpolio", async (req, res) => {
  console.log('req', req.query);
  if (req.query.user_id) {
    var data = await signUpHelper.getPortpofolio(req.query.user_id);
    console.log('language', data)
    if (data.length > 0) {
      return res.send({
        'status': true,
        'data': data
      })
    } else {
      return res.send({
        'status': false,

      })
    }
  } else {
    return res.send({
      'status': false,

    })
  }
})
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
      // req.flash('err_msg', "please enter valid emailid and password")
      // return res.redirect('/signin-professional');
      console.log("error is ", errors);
      //req.flash('err_msg', "please enter valid emailid and password")
      // return res.redirect('/signin');
      res.send({
        message: "please enter valid email and password",
        status: false,
        redirectpage: false,
        redirect: ''
      })
    }
    else {
      // Find Customer by 
      ServiceProviderSchema.findOne({ sps_email_id }).then(service_provider => {
        // Check for Customer
        if (!service_provider) {
          console.log("service provider not found");
          errors.sps_email_id = 'service provider not found';
          //req.flash('err_msg', errors.cus_email_id);
          //return res.redirect('/signin');
          res.send({
            message: "Service provider not found",
            status: false,
            redirectpage: false,
            redirect: ''
          })
        }
        // else if (service_provider.sps_email_verification_status == 'no') {

        //   console.log("Sending Otp if user email not verified");
        //   otp_send(req, service_provider);
        //   res.send({
        //     message: "Please verify  OTP first",
        //     status: false,
        //     redirectpage: true,
        //     redirect: "/otp-professional?email=" + sps_email_id
        //     //redirect to OTP
        //   })
        //}}
        else {
          // Check Password
          bcrypt.compare(sps_password, service_provider.sps_password).then(isMatch => {
            if (isMatch) {
              //enableing session variable
              // req.session._id = doc.user_id;
              req.session.success = true
              req.session.user_id = service_provider._id;
              req.session.name = service_provider.sps_fullname;
              req.session.sps_firstname = service_provider.sps_firstname;
              req.session.sps_lastname = service_provider.sps_lastname;
              req.session.sps_address = service_provider.sps_address;
              req.session.email = service_provider.sps_email_id;
              req.session.role = service_provider.sps_role_name;
              req.session.imagename = '';
              req.session.is_user_logged_in = true;
              req.session.active_user_login = "buyer"

              // service_provider Matched
              const payload = { id: service_provider.id, sps_fullname: service_provider.sps_firstname + '' + service_provider.sps_lastname, sps_email_id: service_provider.sps_email_id }; // Create JWT Payload

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
              console.log("Signin Successfully");
              // res.redirect('/dashboard-professional')
              res.send({
                message: "Signin successfully, we are processing please wait...",
                status: true
              })

            } else {
              console.log("password incorrect");
              // errors.sps_password = 'Password incorrect';
              // console.log("Password incorrect");
              // req.flash("err_msg", errors.sps_password);
              // return res.redirect('/signin-professional');
              res.send({
                message: "Password incorrect",
                status: false,
                redirectpage: false,
                redirect: ''
              })
            }
          });
        }
      });
    }
  });


//Sending otp for email verifictaion while registering user
function otp_send(req, Service_provider) {
  console.log("Service provider Data :", Service_provider);

  var now = new Date();
  now.setMinutes(now.getMinutes() + 03); // timestamp
  now = new Date(now); // Date object

  var otp_expire = now
  console.log("otp_expire time is", now);
  var otp = generateOTP();
  console.log(" Generated OTP is ", otp);

  ServiceProviderSchema.updateOne({
    'sps_email_id': Service_provider.sps_email_id
  }, {
    $set: {
      sps_otp: otp,
      sps_otp_expie_time: otp_expire
    }
  }, {
    upsert: true
  }, function (err) {
    if (err) {
      console.log("err is :", err);
      // res.send({
      //   message: 'Something went wrong.',
      //   status: false
      // })
    } else {
      var smtpTransport = nodemailer.createTransport({
        // port: 25,
        // host: 'localhost',
        // tls: {
        //   rejectUnauthorized: false
        // },
        // host: 'smtp.gmail.com',
        // port: 465,
        // secure: true,
        service: 'Gmail',
        auth: {
          user: keys.user4,
          pass: keys.pass4,
        }
      });
      const mailOptions = {
        to: Service_provider.sps_email_id,
        from: keys.user4,
        subject: 'OTP verification from Relai',

        text: 'Dear \n' + Service_provider.sps_fullname + '\n\n' + 'your OTP for email-validation is  \n' + otp + '\n\n' + 'We suggest you to please hit given url and submit otp:\n' + ' http://' + req.headers.host + '/otp?email=' + Service_provider.sps_email_id + '\n\n' +

          'Thanks and Regards,' + '\n' + 'Relai Team' + '\n\n',
      };
      smtpTransport.sendMail(mailOptions, function (err) {
        if (err) {
          //console.log('err_msg is :', err); req.flash('err_msg', 'Something went wrong, please contact to support team');
          console.log("Something went wrong");

        } else {
          console.log("OTP send Successfully");
          // return true;

        }
      });
    }
  }).catch(err => {
    console.log(err)
  })
};

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
      // console.log('err', err);
      // req.flash('err_msg', 'Please enter registered Email address.');
      // res.redirect('/forget-password-professional');
      res.send({
        message: 'Please enter registered Email address.',
        status: false
      })
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
                // console.log("err is :", err);
                // req.flash('err_msg', 'Something went wrong.');
                // res.redirect('/forget-password-professional')
                console.log('Error is :', err);
                res.send({
                  message: 'Something went wrong please contact to support team..',
                  status: false
                })
              } else {

                var smtpTransport = nodemailer.createTransport({
                  // port: 25,
                  // host: 'localhost',
                  // tls: {
                  //   rejectUnauthorized: false
                  // },
                  // host: 'smtp.gmail.com',
                  // port: 465,
                  // secure: true,
                  service: 'Gmail',
                  auth: {
                    user: keys.user4,
                    pass: keys.pass4,
                  }
                });
                const mailOptions = {
                  to: req.body.sps_email_id,
                  from: keys.user4,
                  subject: 'Relai Forget Password',

                  text: 'Dear ServiceProvider,' + '\n\n' + 'New Password from Relai.\n\n' +
                    'Password: ' + new_pass + '\n\n' +

                    'We suggest you to please change your password after successfully logging in on the portal using the above password :\n' + 'Here is the change password link: http://' + req.headers.host + '/signin-professional' + '\n\n' +
                    'Thanks and Regards,' + '\n' + 'Relai Team' + '\n\n',

                };
                smtpTransport.sendMail(mailOptions, function (err) {
                  if (err) {
                    console.log('email sending failed and error is :', err);
                    res.send({
                      message: 'Something went wrong please contact to support team..',
                      status: false
                    })
                    //  console.log('err_msg is :', err); req.flash('err_msg', 'Something went wrong.please connect support team'); res.redirect('/forget-password-professional') 
                  } else {
                    // req.flash('success_msg', 'Password has been sent successfully to your registered email, please check your mail...');
                    // res.redirect('/signin-professional')
                    res.send({
                      message: 'Password has been sent successfully to your registered email, please check your mail...',
                      status: true
                    })
                  }
                });
              }
            });
          });
        });
      } else {
        // req.flash('err_msg', 'Please enter registered Email address.');
        // res.redirect('/forget-password-professional');
        res.send({
          message: 'Please enter registered Email address.',
          status: false
        })
      }

    }
  });
});



/* -------------------------------------------------------------------------------------------------
POST : service_provider_delete_action post api
------------------------------------------------------------------------------------------------- */

router.post("/delete-professional-basic-details", async (req, res) => {
  var err_msg = null;
  var success_msg = null;
  //TODO:need to add condition is session is expired
  let deleteData = '';
  console.log("req.body is : ", req.body);
  console.log("req.session.user_id is ", req.session.user_id);
  if (req.body.action == 'education-delete') {
    deleteData = await ServiceProviderEducationSchema.deleteOne({ _id: req.body.eduId });
  }
  if (deleteData) {
    console.log("server response is success: ", deleteData);
    res.send({
      deleteData: deleteData,
      message: 'Deleted Successfully !!',
      status: true
    });
  } else {
    console.log("server response is error: ", deleteData);
    res.send({
      deleteData: deleteData,
      message: 'Something going wrong please try again !!',
      status: false
    });
  }

});

/* -------------------------------------------------------------------------------------------------
POST : service_provider_edit_action post api
------------------------------------------------------------------------------------------------- */

router.post("/edit-professional-basic-details", async (req, res) => {
  var err_msg = null;
  var success_msg = null;
  //TODO:need to add condition is session is expired
  let data = '';
  console.log("req.body is : ", req.body);
  console.log("req.session.user_id is ", req.session.user_id);
  if (req.body.action == 'education-edit') {
    data = await ServiceProviderEducationSchema.findOne({ _id: req.body.eduId });
  }
  if (data) {
    console.log("server response is success: ", data);
    res.send({
      data: data,
      message: 'Update Successfully !!',
      status: true
    });
  } else {
    console.log("server response is error: ", data);
    res.send({
      data: data,
      message: 'Something going wrong please try again !!',
      status: false
    });
  }

});



function generateOTP() {

  // Declare a digits variable  
  // which stores all digits 
  var digits = '0123456789';
  let OTP = '';
  for (let i = 0; i < 4; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
}


router.post('/resend-otp-link2', function (req, res) {
  console.log("Sending otp link to registered email-id", req.body.email);
  ServiceProviderSchema.find({
    'sps_email_id': req.body.email,
    //'cus_email_verification_status': 'yes'
  }, function (err, result) {
    if (err) {
      console.log('err', err);
      // req.flash('err_msg', 'Please enter registered Email address.');
      //res.redirect('/forget-password');
      res.send({
        message: 'Service Provider Not Found.',
        status: false
      })
    }
    else {

      if (result != '' && result != null) {
        console.log("Service Provider results is :", result[0].sps_otp);
        var now = new Date();
        now.setMinutes(now.getMinutes() + 03); // timestamp
        now = new Date(now); // Date object

        var otp_expire = now
        console.log("otp_expire time is", now);
        var otp = generateOTP();
        console.log(" Generated OTP is ", otp);

        ServiceProviderSchema.updateOne({
          'sps_email_id': req.body.email
        }, {
          $set: {
            sps_otp: otp,
            sps_otp_expie_time: otp_expire
          }
        }, {
          upsert: true
        }, function (err) {
          if (err) {
            console.log("err is :", err);
            //req.flash('err_msg', 'Something went wrong.');
            //res.redirect('/forget-password')
            res.send({
              message: 'Something went wrong.',
              status: false
            })
          } else {
            var smtpTransport = nodemailer.createTransport({
              // port: 25,
              // host: 'localhost',
              // tls: {
              //   rejectUnauthorized: false
              // },
              // host: 'smtp.gmail.com',
              // port: 465,
              // secure: true,
              service: 'Gmail',
              auth: {
                user: keys.user4,
                pass: keys.pass4,
              }
            });
            const mailOptions = {
              to: req.body.email,
              from: keys.user4,
              subject: 'OTP verification from Relai',

              text: 'Dear \n' + result[0].sps_firstname + result[0].sps_lastname + '\n\n' + 'your OTP for email-validation is  \n' + otp + '\n\n' + 'We suggest you to please hit given url and submit otp:\n' + ' http://' + req.headers.host + '/otp?email=' + req.body.email + '\n\n' +

                'Thanks and Regards,' + '\n' + 'Relai Team' + '\n\n',
            };
            smtpTransport.sendMail(mailOptions, function (err) {
              if (err) {
                console.log('err_msg is :', err); req.flash('err_msg', 'Something went wrong, please contact to support team');
                //res.redirect('/add-property')
              } else {
                //req.flash('success_msg', 'Invitation link has been sent successfully on intered email id, please check your mail...');
                // res.redirect('/add-property')
                console.log("OTP send Successfully");
                res.send({
                  message: 'OTP Send successfully please check your registered-Email.',
                  status: true
                })
              }
            });

          }
        });


      } else {
        console.log("Service Provider Data not found");
        res.send({
          message: 'Service Provider Data not found.',
          status: false
        })
      }
    }
  });

});





//Sending otp for email verifictaion while registering user
function otp_verification(req, otp) {
  console.log("Customer Data :", req.body);
  console.log("OTP for customer verification:", otp);

  var smtpTransport = nodemailer.createTransport({
    // port: 25,
    // host: 'localhost',
    // tls: {
    //   rejectUnauthorized: false
    // },
    // host: 'smtp.gmail.com',
    // port: 465,
    // secure: true,
    service: 'Gmail',
    auth: {
      user: keys.user4,
      pass: keys.pass4,
    }
  });
  const mailOptions = {
    to: req.body.sps_email_id,
    from: keys.user4,
    subject: 'OTP verification from Relai',

    text: 'Dear \n' + req.body.sps_firstname + ' ' + req.body.sps_lastname + '\n\n' + 'your OTP for email-validation is  \n' + otp + '\n\n' + 'We suggest you to please hit given url and submit otp:\n' + ' http://' + req.headers.host + '/otp?email=' + req.body.sps_email_id + '\n\n' +

      'Thanks and Regards,' + '\n' + 'Relai Team' + '\n\n',
  };
  smtpTransport.sendMail(mailOptions, function (err) {
    if (err) {
      console.log('err_msg is :', err); req.flash('err_msg', 'Something went wrong, please contact to support team');
      //res.redirect('/add-property')
    } else {
      //req.flash('success_msg', 'Invitation link has been sent successfully on intered email id, please check your mail...');
      // res.redirect('/add-property')
    }
  });
}

/*********OTP Verification for ServiceProvider****************/
router.post('/otp_verfication2', function (req, res) {
  console.log("req.body is :", req.body);
  var otp1 = req.body.otp1;
  var otp2 = req.body.otp2;
  var otp3 = req.body.otp3;
  var otp4 = req.body.otp4;
  var otp = otp1 + otp2 + otp3 + otp4;
  console.log("getting otp from form data", otp);

  ServiceProviderSchema.find({
    'sps_email_id': req.body.sps_email_id,
    //'cus_email_verification_status': 'yes'
  }, function (err, result) {
    if (err) {
      console.log('err', err);
      // req.flash('err_msg', 'Please enter registered Email address.');
      //res.redirect('/forget-password');
      res.send({
        message: 'Service Provider Not Found.',
        status: false
      })
    }
    else {

      if (result != '' && result != null) {
        console.log("Service Provider results is :", result[0].sps_otp);
        console.log("OTP is ", otp);
        if (parseInt(result[0].sps_otp) === parseInt(otp)) {

          ServiceProviderSchema.updateOne({
            'sps_email_id': req.body.sps_email_id
          }, {
            $set: {
              sps_email_verification_status: 'yes'
            }
          }, {
            upsert: true
          }, function (err) {
            if (err) {
              console.log("err is :", err);
              //req.flash('err_msg', 'Something went wrong.');
              //res.redirect('/forget-password')
              res.send({
                message: 'Something went wrong.',
                status: false
              })

            } else {

              res.send({
                message: 'OTP verification done successfully.',
                status: true
              })
            }
          });

        } else {
          console.log("please enter valid OTP");
          res.send({
            message: 'OTP verification failed.',
            status: false
          })
        }
      } else {
        console.log("Service Provider Data not found");
        res.send({
          message: 'Service Provider Data not found.',
          status: false
        })
      }
    }
  });
});

//***************** post changes password **************//
router.post('/professional-change-password', function (req, res) {
  console.log("calling change password API", req.body);
  var user_id = req.session.user_id;
  const { errors, isValid } = validateProfChangePasswordInput(req.body);

  // Check Validation
  if (!isValid) {
    console.log("error is ", errors);
    //req.flash('err_msg', errors.confirmPassword);
    if (errors.confirmPassword) {
      res.send({
        message: errors.confirmPassword,
        status: false,
        validationType: 'length'
      })
    } else {
      res.send({
        message: errors.sps_password,
        status: false,
        validationType: 'length'
      })
    }
    //return; // res.redirect('/change-Password');
  } else {
    // Find Customer by 
    ServiceProviderSchema.findOne({ _id: req.session.user_id }).then(sp => {
      bcrypt.compare(req.body.oldPassword, sp.sps_password).then(isMatch => {
        if (isMatch) {
          //enableing session variable
          var hashPassword = "";
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(req.body.sps_password, salt, (err, hash) => {
              if (err) throw err;
              hashPassword = hash;
              ServiceProviderSchema.updateOne({
                '_id': req.session.user_id
              }, {
                $set: {
                  sps_password: hashPassword
                }
              }, {
                upsert: true
              }, function (err) {
                if (err) {
                  res.send({
                    message: 'Something went wrong please try again.',
                    status: false,
                    validationType: 'server'
                  })

                  //console.log("err is :", err);
                  //req.flash('err_msg', 'Something went wrong.');
                  // return;
                } else {
                  //console.log("Password change successfully");
                  //req.flash('success_msg', 'password change successfully');
                  res.send({
                    message: 'Password change successfully.',
                    status: true,
                    validationType: ''
                  })

                }
              });
            });
          });
          req.session.success = true;
        } else {
          //console.log('not matched')
          res.send({
            message: 'Old password wrong please check again.',
            status: false,
            validationType: 'matched'
          })
        }
      });
    });
  }

});


router.post('/service-provider-message', async (req, res) => {
  console.log("Service Send Message data from client is :", req.body);
  const newMessage = new MessageSchema({
    sms_property_id: req.body.sms_property_id,// storing property_id if its not null
    sms_sender_id: req.body.sms_sender_id,//check if msg comes from customer portal than store customer_Id
    sms_receiver_id: req.body.sms_receiver_id, //recevier_id
    sms_sender_type: req.body.sms_sender_type,
    sms_receiver_type: req.body.sms_receiver_type,
    sms_message: req.body.message,
    sms_msg_Date: req.body.sms_msg_Date,
    sms_read_status: req.body.sms_read_status, //default is unread
    sms_is_active_user_flag: req.session.active_user_login
  })
  newMessage.save().then(async message => {
    console.log("getting response form server is :", message);

    const newNotification = new NotificationSchema({
      ns_title: 'New Message',
      ns_sender: req.session.user_id,
      ns_receiver: req.body.sms_receiver_id,
      ns_property_id: req.body.sms_property_id,
      ns_sender_type: 'service_provider',
      ns_receiver_type: 'customer',
      ns_read_status: 'unseen'
    });
    newNotification.save();

    let QueryCount = {
      $or: [
        { $and: [{ sms_sender_id: req.body.sms_sender_id }, { sms_receiver_id: req.body.sms_receiver_id }, { sms_property_id: req.body.sms_property_id }] },
        { $and: [{ sms_sender_id: req.body.sms_receiver_id }, { sms_receiver_id: req.body.sms_sender_id }, { sms_property_id: req.body.sms_property_id }] }
      ]
    }
    const countMsg = await MessageSchema.countDocuments(QueryCount);
    res.send({
      msgData: message,
      countMsg: countMsg
    })
    //res.flash('success_msg', 'message forward successfully');
    //res.redirect('/'); //set based on current login if its customer portal then redirect customer_message portal and 
  }).catch(err => {
    console.log(err)
    //req.flash('err_msg', 'Something went wrong please try again later.');
    //res.redirect('/professionals-hirenow');
  });
});


//service-provider-message-unread


router.post('/service-provider-message-unread', (req, res) => {
  console.log("Service Unread Send Message data from client is :", req.body);
  MessageSchema.updateMany({ sms_property_id: req.body.sms_property_id, sms_sender_id: req.body.sms_sender_id, sms_receiver_id: req.body.sms_receiver_id, sms_sender_type: req.body.sms_sender_type, sms_receiver_type: req.body.sms_receiver_type }, { $set: { sms_read_status: 'read' } }, function (err) {
    if (err) {
      console.log(err)
      res.send({ status: false, message: 'Something going wrong please check again !!' })
    } else {
      NotificationSchema.updateMany({ ns_title: 'New Message', ns_sender_type: 'customer', ns_receiver_type: 'service_provider', ns_receiver: req.session.user_id, ns_sender: req.body.sms_sender_id }, { $set: { ns_read_status: 'seen' } }, function (err) {
        if (err) {
          console.log(err)
          res.send({ status: false, message: 'Something going wrong please check again !!' })
        } else {
          res.send({ status: true, message: 'Task update successfully !!' })
          console.log("notification messg Status update successfully");
        }

      });
      console.log("Message Status update successfully");
    }
  });
});


router.post("/remove_sp_uploaded_document", async (req, res) => {
  var err_msg = null;
  var success_msg = null;
  //TODO:need to add condition is session is expired
  let deleteData = '';
  console.log("req.body is : ", req.body);
  console.log("req.session.user_id is ", req.session.user_id);
  if (req.body.action == 'sp_doc_delete') {
    deleteData = await ServiceProviderUploadDocsSchema.deleteOne({ _id: req.body.document_id });
    await DocumentPermissionSchema.findOneAndRemove({ dps_document_id: req.body.document_id });
  }
  if (deleteData) {
    console.log("server response is success: ", deleteData);
    res.send({
      deleteData: deleteData,
      message: 'Document Deleted Successfully !!',
      status: true
    });
  } else {
    console.log("server response is error: ", deleteData);
    res.send({
      deleteData: deleteData,
      message: 'Something going wrong please try again !!',
      status: false
    });
  }

});
/* -------------------------------------------------------------------------------------------------
POST : Change Permission api for giving Docs read/write permission to existing serviceProvider.
------------------------------------------------------------------------------------------------- */
router.get('/get-sp-change-permision', async (req, res) => {
  req.session.pagename = 'mydreamhome';
  console.log('req.query:', req.query)
  await DocumentPermissionSchema.find({ dps_document_id: req.query.docId }).sort({ _id: -1 }).then(async (data) => {
    //req.session.complaintID = req.query.complaintID;
    console.log('dataaa:', data)
    if (data) {
      let arr = [];
      err_msg = req.flash('err_msg');
      success_msg = req.flash('success_msg');
      res.send({
        err_msg, success_msg, layout: false,
        session: req.session,
        permissionDetailsData: data,
      });
    }
  }).catch((err) => {
    console.log(err)
  })
});
router.post('/sp-change-permision', async (req, res) => {
  console.log('doc id:', req.body.doc_id)
  console.log('checkFlag:', req.body.checkFlag)
  console.log('=========', req.body)

  DocumentPermissionSchema.findOne({ dps_service_provider_id: req.body.service_provider_id, dps_customer_id: req.body.cust_id, dps_document_id: req.body.doc_id }).then(async (data) => {
    console.log('FindData:', data);
    let permisionFlagDownload = '';
    let permisionFlagView = '';

    if (data) {

      if (req.body.checkFlag === 'viewaction') {
        permisionFlagDownload = data.dps_download_permission;
        permisionFlagView = req.body.viewFlag;
        console.log('view....action...')
      } else {
        permisionFlagView = data.dps_view_permission;
        permisionFlagDownload = req.body.downloadFlag;
        console.log('download....action...')

      }

      console.log('permisionFlagView:', permisionFlagView);
      console.log('permisionFlagDownload:', permisionFlagDownload);


      DocumentPermissionSchema.updateOne({ 'dps_customer_id': req.body.cust_id, 'dps_service_provider_id': req.body.service_provider_id, 'dps_document_id': req.body.doc_id }, { $set: { dps_view_permission: permisionFlagView, dps_download_permission: permisionFlagDownload, dps_is_active_user_flag: req.session.active_user_login } }, { upsert: true }, function (err) {
        if (err) {
          console.log("err is :", err);
          req.flash('err_msg', 'Something went wrong.');
          //res.redirect('/forget-password')
        } else {
          res.send({
            message: 'Permission Updated !!'
          })
        }
      })

    } else {
      let permissionObject = {
        dps_view_permission: req.body.viewFlag,
        dps_download_permission: req.body.downloadFlag,
        dps_service_provider_id: req.body.service_provider_id,
        dps_customer_id: req.body.cust_id,
        dps_document_id: req.body.doc_id,
        dps_is_active_user_flag: req.session.active_user_login
      }
      console.log('permissionObject:', permissionObject);
      var docPermissionSave = new DocumentPermissionSchema(permissionObject)
      docPermissionSave.save().then(async (data) => {
        console.log('docPermissionSave:', data)
        res.send({
          message: 'Permission Updated !!'
        })
      }).catch(err => {
        console.log(err)
        req.flash('err_msg', 'Something went wrong please try after some time!');
      });
    }
  });

})
router.post('/sp_task_status_update', (req, res) => {
  console.log("sp_task_status_update :", req.body);

  PropertyProfessinoalTaskSchema.findOne({ _id: req.body.task_id }).then((resp) => {
    if (resp) {
      var index = resp.ppts_assign_to.indexOf(req.session.user_id)
      const items = resp.ppts_task_status

      items[index] = req.body.ppts_task_status
      console.log('find resp when update', index, items)
      PropertyProfessinoalTaskSchema.updateOne({ _id: req.body.task_id }, { $set: { ppts_task_status: items } }, function (err, data) {

        if (err) {
          console.log(err)
          res.send({ status: false, message: 'Something going wrong please check again !!' })
        } else {
          res.send({ status: true, message: 'Task Status update successfully !!' })
          console.log("Task Status update successfully", data);
        }
      });
    } else {
      console.log('error in find')
    }
  }).catch((err) => {
    console.log(err)
  })

});


router.post('/professional-new-raise-a-complaint', (req, res) => {
  upload(req, res, async () => {
    let newComplaint = '';
    const obj = JSON.parse(JSON.stringify(req.body));
    const files = JSON.parse(JSON.stringify(req.files));
    const ComplaintId = 'C-' + uuidv4().slice(uuidv4().length - 4).toUpperCase();;

    console.log('filesfiles:', files)
    if (Object.keys(files).length === 0) {
      newComplaint = new ComplaintsSchema({
        coms_complaint_for: req.body.coms_complaint_for,
        coms_complaint_help: req.body.coms_complaint_help,
        coms_complaint_code: ComplaintId,//need to generate in  like C123 auto increment feature
        coms_property_id: req.body.property_id,
        coms_user_id: req.body.cust_user_id,
        coms_complaint_subject: req.body.coms_complaint_subject,
        coms_complaint_note: req.body.coms_complaint_note,
        coms_is_active_user_flag: req.session.active_user_login,
        coms_user_name: req.session.name,
        coms_user_profile_img: req.session.imagename
      });

      newComplaintDetails = new ComplaintDetailsSchema({
        comsd_id: ComplaintId,
        comsd_user_id: req.session.user_id,
        comsd_complaint_note: req.body.coms_complaint_note,
        comsd_user_name: req.session.name,
        comsd_user_profile_img: req.session.imagename,
        comsd_complaint_filename: '',
        comsd_complaint_filetype: ''
      });

    } else {
      newComplaint = new ComplaintsSchema({
        coms_complaint_for: req.body.coms_complaint_for,
        coms_complaint_help: req.body.coms_complaint_help,
        coms_complaint_code: ComplaintId,//need to generate in  like C123 auto increment feature
        coms_property_id: req.body.property_id,
        coms_user_id: req.body.cust_user_id,
        coms_complaint_subject: req.body.coms_complaint_subject,
        coms_complaint_note: req.body.coms_complaint_note,
        coms_is_active_user_flag: req.session.active_user_login,
        coms_user_name: req.session.name,
        coms_user_profile_img: req.session.imagename,
        coms_complaint_filename: req.files.complaint_file[0].filename,
        coms_complaint_file: {
          data: fs.readFileSync(path.join(__dirname + '../../../public/complaintFile/' + req.files.complaint_file[0].filename)),
          contentType: 'image/png'
        },
        coms_complaint_filetype: req.files.complaint_file[0].mimetype
      });

      newComplaintDetails = new ComplaintDetailsSchema({
        comsd_id: ComplaintId,
        comsd_user_id: req.body.user_id,
        comsd_complaint_note: req.body.coms_complaint_note,
        comsd_user_name: req.session.name,
        comsd_user_profile_img: req.session.imagename,
        comsd_complaint_filename: req.files.complaint_file[0].filename,
        comsd_complaint_file: {
          data: fs.readFileSync(path.join(__dirname + '../../../public/complaintFile/' + req.files.complaint_file[0].filename)),
          contentType: 'image/png'
        },
        comsd_complaint_filetype: req.files.complaint_file[0].mimetype
      });

    }
    console.log('newComplaint:', newComplaint)
    newComplaint.save().then(complaints => {
      newComplaintDetails.save().then(complaintsDetails => {
        res.send({ status: true, message: 'You complaint submited successfully, we will review and connect with you soon !!' })
      });
    }).catch(err => {
      console.log(err)
      res.send({ status: false, 'message': 'Something went wrong please try again later.' })
    });
  });

});

router.post('/professional-complaint-details-discussion', (req, res) => {
  upload(req, res, async () => {
    let newComplaintDetails = '';
    const obj = JSON.parse(JSON.stringify(req.body));
    const files = JSON.parse(JSON.stringify(req.files));
    //const ComplaintId = 'C-'+uuidv4().slice(uuidv4().length - 4).toUpperCase();;

    if (Object.keys(files).length === 0) {
      newComplaintDetails = new ComplaintDetailsSchema({
        comsd_id: req.body.complaintID,
        comsd_user_id: req.session.user_id,
        comsd_complaint_note: req.body.coms_complaint_note,
        comsd_user_name: req.session.name,
        comsd_user_profile_img: req.session.imagename,
        comsd_complaint_filename: '',
        comsd_complaint_filetype: ''
      });

    } else {
      newComplaintDetails = new ComplaintDetailsSchema({
        comsd_id: req.body.complaintID,
        comsd_user_id: req.session.user_id,
        comsd_complaint_note: req.body.coms_complaint_note,
        comsd_user_name: req.session.name,
        comsd_user_profile_img: req.session.imagename,
        comsd_complaint_filename: req.files.complaint_file[0].filename,
        comsd_complaint_file: {
          data: fs.readFileSync(path.join(__dirname + '../../../public/complaintFile/' + req.files.complaint_file[0].filename)),
          contentType: 'image/png'
        },
        comsd_complaint_filetype: req.files.complaint_file[0].mimetype
      });
    }
    console.log('newComplaintDetails:', newComplaintDetails)
    newComplaintDetails.save().then(complaintsDetails => {
      res.send({ status: true, message: 'You complaint submited successfully, we will review and connect with you soon !!' })
    }).catch(err => {
      console.log(err)
      res.send({ status: false, 'message': 'Something went wrong please try again later.' })
    });
  });
});

router.post('/professional-complaint-details-discussion-close', (req, res) => {

  let ComplaintCode = req.body.complainCode;
  ComplaintsSchema.updateOne({ 'coms_complaint_code': ComplaintCode }, { $set: { coms_complaint_status: 'completed' } }, { upsert: true }, function (err) {
    if (err) {
      res.send({ status: false, message: 'Something going wrong please check again !!' })
    } else {
      res.send({ status: true, message: 'Your complaint discussion closed successfully !!' })
    }
  });
});

router.post('/sp_document_download_count', async (req, res) => {
  console.log("sp_document_download_count :", req.body);
  var docPermissionData = await DocumentPermissionSchema.findOne({
        _id:req.body.doc_permission_id,
        //dps_is_active_user_flag:req.body.active_flag,
        dps_service_provider_id:req.body.uploaded_by_id,
        dps_customer_id:req.body.downloaded_by_id,
        dps_document_id:req.body.document_id
    });
    if(docPermissionData){
                 console.log('docPermissionData:',docPermissionData)
                 DocumentDownloadSchema.updateOne({ dd_permission_id:docPermissionData._id, dd_uploaded_by_id:docPermissionData.dps_customer_id,dd_downloaded_by_id:docPermissionData.dps_service_provider_id,dd_document_id:docPermissionData.dps_document_id}, { $set: { dd_download_status: 'yes'} }, { upsert: true }, function (err) {
                    if (err) {
                      console.log(err)
                      res.send({ status: false, message: 'Something going wrong please check again !!' })
                    } else {
                      res.send({ status: true, message: 'downloaded update successfully !!' })
                      console.log("downloaded update successfully");
                    }
                  });

    }else{
              console.log('else data my doc')
    }
});


module.exports = router;
