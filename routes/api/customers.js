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
const path = require('path');
var fs = require('fs');
const multer = require('multer');
const { cust_register, cust_signin } = require("../../controllers/customers");
const ServiceProviderSchema = require("../../models/service_providers");
// Load Input Validation
const validateAddPhase = require('../../Validation/add_phase');
const validateCustomerRegisterInput = require('../../Validation/cust_signup');
const validateCustomerSigninInput = require('../../Validation/cust_signin');
const validateChangePasswordInput = require('../../Validation/change_password');

const DocumentPermissionSchema = require('../../models/document_permission')
const PropertiesPictureSchema = require("../../models/properties_picture");
const PropertiesPlanPictureSchema = require("../../models/properties_plan_picture");
const PropertyProfessionalSchema = require("../../models/property_professional_Schema");
const PropertiesPhaseSchema = require("../../models/property_phase_schema");
const PropertyProfessinoalTaskSchema = require("../../models/property_professional_tasks_Schema");
const { Promise } = require("mongoose");
const { resolve } = require("path");
//router.post("/cust_register", cust_register);
//router.post("/cust_signin", cust_signin);


const ComplaintsSchema = require("../../models/Complaints");
const ComplaintDetailsSchema = require("../../models/complaint_details_model");
const MessageSchema = require("../../models/message");
const addTaskHelper = require("./addTask");
const PropertyHelper = require("./propertyDetail");
const PermisionHelper = require("./permision");
const propertyProfesshionalHelper = require('./propertyProfessionalDetails')
var isCustomer = auth.isCustomer;
// <<<<<<< HEAD
// router.post('/filterPropertyAdress', (req, res) => {
//   console.log('filterPropertyAdress==', req.body.propertyId)

//   if (req.body.propertyId) {
//     PropertiesSchema.findOne({ _id: req.body.propertyId }).then(async (data) => {
//       if (data) {
//         console.log(data)
// =======
router.get('/test', (req, res) => {
  //var array =[];
  // new Promise((resolve, reject) => {


  PropertiesSchema.find({ ps_user_id: '5ffeaf14cbd60d14a072935e' }).then(async (data) => {
    if (data) {
      var c = 0
      //var array=[]
      // data.forEach((element)=>{
      //  PropertiesPictureSchema.find({pps_property_id:element._id}).then((result)=>{
      //     array.push(result)
      //     console.log(result)
      //   });
      // array.push(allPropertyImage)
      //console.log('allPropertyImage++++++',allPropertyImage)
      let arr = [];
      for (let img of data) {
        await PropertiesPictureSchema.find({ pps_property_id: img._id }).then(async (result) => {
          let temp = await result
          arr.push(temp)
        })

      }
      console.log('++++++++', arr)

    }

  }).catch((err) => {
    console.log(err)
  })
})


router.post('/filterPropertyAdress', (req, res) => {
  if (req.body.propertyId) {
    PropertiesSchema.findOne({ _id: req.body.propertyId }).then(async (data) => {
      if (data) {
        //console.log(data)

        res.json({ data: data });
      }
    }).catch((err) => {
      console.log(err)
    })
  } else {
    console.log('property id not found')
  }
})


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
        cus_fullname: req.body.cus_firstname + ' ' + req.body.cus_lastname,
        cus_email_id: req.body.cus_email_id,
        cus_phone_number: req.body.cus_phone_number,
        cus_address: req.body.cus_address,
        cus_country_id: req.body.country,
        cus_city: req.body.city,
        cus_state: req.body.state,
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
              req.flash('success_msg', 'You have register sucessfully.')
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
        req.session.active_user_login = "buyer";
        req.session.address = customers.cus_address;
        req.session.city = customers.cus_city;
        req.session.phoneNumber = customers.cus_phone_number;
        req.session.country = customers.cus_country_id;
        //req.session.profilePicture= customer.profile_picture
        if (customers.cus_profile_image_name) {
          req.session.imagename = customers.cus_profile_image_name
        } else {
          req.session.imagename = '';
        }
        //req.session.isChanged = true
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

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === "propertiespic") {
      cb(null, 'public/propimg')
    }
    else if (file.fieldname === "planImage") {
      cb(null, 'public/propplanimg');
    }
    else if (file.fieldname === "complaint_file") {
      cb(null, 'public/complaintFile');
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
      name: 'propertiespic', maxCount: 3
    },
    {
      name: 'planImage', maxCount: 3
    },
    {
      name: 'complaint_file', maxCount: 3
    }
  ]
);
function checkFileType(file, cb) {


  if (file.fieldname === "propertiespic" || file.fieldname === "planImage" || file.fieldname === "complaint_file") {
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
router.post("/add-property", async (req, res) => {
  upload(req, res, async () => {

    // console.log("body:=", req.body);
    // var err_msg = null;
    // var success_msg = null;

    // let PropertySaved = await PropertyHelper.AddNewProperty(req);
    // console.log('PropertySaved========', PropertySaved)
    // if (PropertySaved) {
    //   // console.log("instruction req is", req.body.instruction.length);
    //   // console.log("instruction req is Type", typeof (req.body.instruction));
    //   // console.log("req.session.active_user_login", req.session.active_user_login);
    //   var totalInstruction = 0;
    //   if (req.session.active_user_login == 'renovator') {
    //     totalInstruction = 8;
    //   } else {
    //     totalInstruction = 6;
    //   }
    //   console.log("totalInstruction:", totalInstruction);
    //   if (req.body.instruction.length >= totalInstruction && typeof (req.body.instruction) != 'string') {
    //     req.body.instruction.forEach(async function (instruction, i) {
    //       var user_id = req.session.user_id;
    //       // var propertyId = req.body.propertyId;
    //       var propertyId = PropertySaved._id
    //       //var pps_professional_id = req.body.serviceProviderId;
    //       var pps_phase_name = instruction;
    //       var pps_phase_start_date = req.body.startDate[i]
    //       var pps_phase_end_date = req.body.endDate[i]
    //       var pps_is_active_user_flag = req.session.active_user_login;
    //       let addPhaseResponce = await addTaskHelper.save_addPhase(propertyId, pps_phase_name, pps_phase_start_date, pps_phase_end_date, pps_is_active_user_flag);
    //       console.log('addPhaseResponce A:', addPhaseResponce)
    //     })
    //     return res.send({
    //       'success_msg': 'Saved successfully',
    //       'status': true,
    //       'redirect': '/add-task'
    //     });
    //     //res.redirect('/add-property');
    //   } else {
    //     //console.log("server validation error is:", errors);
    //     //req.flash('err_msg', errors.instruction);
    //     return res.send({
    //       'err_msg': 'Please add all phases',
    //       'status': false
    //     });
    //   }

    // }

    //function invite_function(req, saved_property)//need to add invite function
    if (req.body) {
      console.log("body:=", req.body);
      var err_msg = null;
      var success_msg = null;
      let PropertySaved = await PropertyHelper.AddNewProperty(req);
      console.log('PropertySaved========', PropertySaved)
      if (PropertySaved) {
        //sending invite function in add-property
        console.log("sending invitation to professional with token");
        invite_function(req, PropertySaved);
        return res.send({
          'success_msg': ' Your Property Saved successfully Please Wait We Are Prosessing...',
          'status': true,
          'redirect': '/add-property'
        });
        //   var totalInstruction = 0;
        //   if (req.session.active_user_login == 'renovator') {
        //   totalInstruction = 8;
        // } else {
        //   totalInstruction = 6;
        // }
        //console.log("totalInstruction:", totalInstruction);
        // if (req.body.instruction.length >= totalInstruction && typeof (req.body.instruction) != 'string') {
        //   req.body.instruction.forEach(async function (instruction, i) {
        //     var user_id = req.session.user_id;
        //     var propertyId= PropertySaved._id
        //     var pps_phase_name = instruction;
        //     var pps_phase_start_date = req.body.startDate[i]
        //     var pps_phase_end_date = req.body.endDate[i]
        //     var pps_is_active_user_flag = req.session.active_user_login;
        //     let addPhaseResponce = await addTaskHelper.save_addPhase(propertyId, pps_phase_name, pps_phase_start_date, pps_phase_end_date, pps_is_active_user_flag);
        //     console.log('addPhaseResponce A:', addPhaseResponce)
        //   })
        //   return res.send({
        //     'success_msg': 'Saved successfully',
        //     'status': true,
        //     'redirect': '/add-task'
        //   });
        // }else {

        //   return res.send({
        //     'err_msg': 'Please add all phases',
        //     'status': false
        //   });
        // }
      } else {
        return res.send({
          'err_msg': 'Something Wrong Try Again ',
          'status': false
        });
      }
    }
  });

});
//=============property add section====================//

router.post("/add-new-property", isCustomer, async (req, res) => {
  upload(req, res, async () => {
    if (req.body) {
      console.log("first form body:=", req.body);
      let PropertySaved = await PropertyHelper.Add_New_Propert(req);
      console.log('PropertySaved========', PropertySaved);
      if (PropertySaved) {
        //sending invite function in add-property
        console.log("sending invitation to professional with token");
        invite_function(req, PropertySaved);
        return res.send({
          'message': ' Your Property Saved plese add property image',
          'status': true,
          'property_id': PropertySaved._id
        });
      } else {
        return res.send({
          'message': 'Something Wrong Try Again ',
          'status': false
        });
      }
    }
  });

});

router.post("/add-new-property-image", isCustomer, async (req, res) => {
  upload(req, res, async () => {
    if (req.body) {
      console.log("second form body:=", req.body);
      console.log("second form file:=", req.files);
      let PropertyImageSaved = await PropertyHelper.add_new_property_image(req);
      console.log('image saved========', PropertyImageSaved);
      if (PropertyImageSaved) {
        return res.send({
          'message': ' Your Property image Saved plese add property plan image',
          'status': true,

        });
      } else {
        return res.send({
          'message': 'Something Wrong Try Again ',
          'status': false
        });
      }
    }
  });

});

router.post("/add-new-property-plan-image", isCustomer, async (req, res) => {
  upload(req, res, async () => {
    if (req.body) {
      console.log("third form body:=", req.body);
      console.log("third form file:=", req.files);
      let PropertyPlanImageSaved = await PropertyHelper.add_new_property_plan_image(req);
      console.log('plan image saved========', PropertyPlanImageSaved);
      if (PropertyPlanImageSaved) {
        return res.send({
          'message': ' Your Property Add SuccessFully',
          'status': true,
          'redirect': '/mydreamhome'

        });
      } else {
        return res.send({
          'message': 'Something Wrong Try Again ',
          'status': false,
          'redirect': '/add-property'
        });
      }
    }
  });

});

router.get("/get_property_for_chain",isCustomer, async (req, res) => {
  
    if (req.body) {
      console.log("get chain property body:=", req.session);
      let AllProperty = await PropertyHelper.GetAllProperty(req.session.user_id,req.session.active_user_login);
      console.log('AllProperty========', AllProperty);
      if (AllProperty) {
        return res.send({
          'message': 'Select Property',
          'status': true,
          'data':AllProperty
          
        });
      } else {
        return res.send({
          'message': 'Something Wrong Try Again ',
          'status': false,
          'redirect':'/add-property'
        });
      }
    }
  

});
//=============property add section close====================//
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


/* -------------------------------------------------------------------------------------------------
POST : Forget password for customer portal. it will send 6 digit random password to customer gmail account..
------------------------------------------------------------------------------------------------- */
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
                    pass: 'Krishna#1997',
                  }
                });
                const mailOptions = {
                  to: req.body.cus_email_id,
                  from: 'golearning4@gmail.com',
                  subject: 'Relai Forget Password',

                  text: 'Dear Customer,' + '\n\n' + 'New Password from Relai.\n\n' +
                    'Password: ' + new_pass + '\n\n' +

                    'We suggest you to please change your password after successfully logging in on the portal using the above password :\n' + 'Here is the link for signin: https://' + req.headers.host + '/signin' + '\n\n' +
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


/* -------------------------------------------------------------------------------------------------
GET : Customer logout API
------------------------------------------------------------------------------------------------- */

router.get('/cust_logout', function (req, res) {
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
/* -------------------------------------------------------------------------------------------------
POST : Change Permission api for giving Docs read/write permission to existing serviceProvider.
------------------------------------------------------------------------------------------------- */
router.post('/change-permision', async (req, res) => {
  console.log('doc id:', req.body.doc_id)
  console.log('checkFlag:', req.body.checkFlag)
  DocumentPermissionSchema.findOne({ dps_customer_id: req.body.cust_id, dps_service_provider_id: req.body.professionalId, dps_document_id: req.body.doc_id }).then(async (data) => {
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


      DocumentPermissionSchema.updateOne({ 'dps_service_provider_id': req.body.professionalId, 'dps_customer_id': req.body.cust_id, 'dps_document_id': req.body.doc_id }, { $set: { dps_view_permission: permisionFlagView, dps_download_permission: permisionFlagDownload, dps_is_active_user_flag: req.session.active_user_login } }, { upsert: true }, function (err) {
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
        dps_customer_id: req.body.cust_id,
        dps_service_provider_id: req.body.professionalId,
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




  // var idArray = req.body.checked_elem.split(",");
  // var idArray_1 = req.body.checked_elem_1.split(",");
  // // DocumentPermissionSchema 
  // console.log("idArray_1 download", idArray_1);
  // console.log("idArray view", idArray);
  // PermisionHelper.changePermision(req.body);
  // var obj = {};
  // idArray.forEach(async function (service_provider_id, i) {
  //   if (service_provider_id && idArray_1[i]) {
  //     console.log('AAAA')
  //     Object.assign(obj,
  //       {
  //         dps_view_permission: "yes",
  //         dps_download_permission: 'yes',
  //         dps_customer_id: req.body.cust_id,
  //         dps_service_provider_id: service_provider_id,
  //         dps_document_id: req.body.id_element,
  //         dps_is_active_user_flag: req.session.active_user_login

  //       });

  //   } else if (service_provider_id) {
  //     console.log('BBBBB')
  //     Object.assign(obj,
  //       {
  //         dps_view_permission: "yes",
  //         dps_download_permission: 'no',
  //         dps_customer_id: req.body.cust_id,
  //         dps_service_provider_id: service_provider_id,
  //         dps_document_id: req.body.id_element,
  //         dps_is_active_user_flag: req.session.active_user_login

  //       });

  //   } else if (idArray_1[i]) {
  //     console.log('CCCCC')
  //     Object.assign(obj,
  //       {
  //         dps_view_permission: "no",
  //         dps_download_permission: 'yes',
  //         dps_customer_id: req.body.cust_id,
  //         dps_service_provider_id: service_provider_id,
  //         dps_document_id: req.body.id_element,
  //         dps_is_active_user_flag: req.session.active_user_login

  //       });

  //   }
  //   console.log('obj', obj)

  //   var docPermissionSave = new DocumentPermissionSchema(obj)
  //   docPermissionSave.save().then(async (data) => {
  //     console.log(data)
  //   }).catch(err => {
  //     console.log(err)
  //     req.flash('err_msg', 'Something went wrong please try after some time!');

  //   });
  // })
})

/* -------------------------------------------------------------------------------------------------
POST : Hire now api is used for hiring professional(service_provider) for particular property.
------------------------------------------------------------------------------------------------- */

router.post("/hire-now", async (req, res) => {
  var err_msg = null;
  var success_msg = null;
  if (req.body.propertyId && req.body.serviceProviderId) {
    const hirenow = new PropertyProfessionalSchema({
      pps_user_id: req.body.user_id,
      pps_property_id: req.body.propertyId,
      pps_service_provider_id: req.body.serviceProviderId,
      pps_pofessional_budget: req.body.pps_pofessional_budget,
      pps_exptected_delivery_date: req.body.pps_exptected_delivery_date,
      pps_is_active_user_flag: req.session.active_user_login
      //pps_status: req.body.pps_status,//TODO:we need to save later
    });
    hirenow
      .save()
      .then(async hireprofessional => {
        console.log("server response is :", hireprofessional);
        //res.redirect('/add-task');
        return res.send({
          'success_msg': ' Professional Hired successfully',
          'status': true,
          'redirect': '/professionals-hirenow'
        });
      })
      .catch(err => {
        console.log(err)
        req.flash('err_msg', 'Something went wrong please try again later.');
      });

  } else {
    //console.log("server validation error is:", errors);
    //req.flash('err_msg', errors.instruction);
    return res.send({
      'err_msg': 'Please add all input fild',
      'status': false
    });
  }
});

// router.post("/hire-now", async (req, res) => {
//   var err_msg = null;
//   var success_msg = null;
//   var totalInstruction = 0;
//   //const { errors, isValid } = validateAddPhase(req.body);
//   console.log("instruction req is", req.body.instruction.length);
//   console.log("instruction req is Type", typeof (req.body.instruction));
//   console.log("req.session.active_user_login", req.session.active_user_login);

//   if (req.session.active_user_login == 'renovator') {
//     totalInstruction = 8;
//   } else {
//     totalInstruction = 6;
//   }
//   console.log("totalInstruction:", totalInstruction);

//   if (req.body.instruction.length >= totalInstruction && typeof (req.body.instruction) != 'string') {
//     req.body.instruction.forEach(async function (instruction, i) {
//       var user_id = req.body.user_id;
//       var propertyId = req.body.propertyId;
//       var pps_professional_id = req.body.serviceProviderId;
//       var pps_phase_name = instruction;
//       var pps_phase_start_date = req.body.startDate[i]
//       var pps_phase_end_date = req.body.endDate[i]
//       var pps_is_active_user_flag = req.session.active_user_login;
//       let addPhaseResponce = await addTaskHelper.save_addPhase(propertyId, pps_professional_id, pps_phase_name, pps_phase_start_date, pps_phase_end_date, pps_is_active_user_flag);
//       console.log('addPhaseResponce A:', addPhaseResponce)
//     })

//     // } else {
//     //   req.flash('err_msg', errors.instruction);
//     //   return res.redirect('/professionals-hirenow');
//     // }

//     const hirenow = new PropertyProfessionalSchema({
//       pps_user_id: req.body.user_id,
//       pps_property_id: req.body.propertyId,
//       pps_service_provider_id: req.body.serviceProviderId,
//       pps_pofessional_budget: req.body.pps_pofessional_budget,
//       pps_exptected_delivery_date: req.body.pps_exptected_delivery_date,
//       pps_is_active_user_flag: req.session.active_user_login
//       //pps_status: req.body.pps_status,//TODO:we need to save later
//     });
//     hirenow
//       .save()
//       .then(async hireprofessional => {
//         console.log("server response is :", hireprofessional);
//         //res.redirect('/add-task');
//         return res.send({
//           'success_msg': 'Saved successfully',
//           'status': true,
//           'redirect': '/add-task'
//         });
//       })
//       .catch(err => {
//         console.log(err)
//         req.flash('err_msg', 'Something went wrong please try again later.');
//       });

//   } else {
//     //console.log("server validation error is:", errors);
//     //req.flash('err_msg', errors.instruction);
//     return res.send({
//       'err_msg': 'Please add all phases',
//       'status': false
//     });
//   }
// });

/* -------------------------------------------------------------------------------------------------
POST : Add Task api is used for adding task(or Phase) details and sharing these details to hired professional.
------------------------------------------------------------------------------------------------- */

router.post("/addTask", (req, res) => {
  if (req.body.Phase == '' || req.body.Phase == undefined) {
    return res.send({
      'err_msg': 'Please Select All Fild',
      'status': false,
      'redirect': '/professionals-hirenow'
    });


  } else {
    console.log("addTask post:", req.body);
    const newTask = new PropertyProfessinoalTaskSchema({
      ppts_property_id: req.body.property_id,
      ppts_user_id: req.session.user_id,
      ppts_task_name: req.body.task_name,
      ppts_assign_to: req.body.professionalId,
      ppts_due_date: req.body.duedate,
      //ppts_phase_id: req.body.Phase,
      ppts_phase_name: req.body.Phase,
      ppts_is_active_user_flag: req.session.active_user_login,
      ppts_note: req.body.notes
    });
    newTask
      .save()
      .then(addedTask => {
        console.log("server response is addedTask :", addedTask);
        //res.json({ status: 1, message: 'Task Add Successfully', data: addedTask });
        if (addedTask) {

          return res.send({
            'success_msg': 'Task Add Successfully',
            'status': true,
            'redirect': '/professionals-hirenow'
          });
          // res.redirect("/professionals-hirenow")
        } else {
          return res.send({
            'err_msg': 'Please Add Task',
            'status': false,
            'redirect': '/professionals-hirenow'
          });
        }
      })
      .catch(err => {
        console.log(err)
        req.flash('err_msg', 'Something went wrong please try again later.');
        res.redirect('/professionals-hirenow');
      });
  }
})


/* -------------------------------------------------------------------------------------------------
POST : Raise a complaints api is used for raising a complaints to particular service provider along with note and status.
------------------------------------------------------------------------------------------------- */

// router.post('/raise-a-complaint', (req, res) => {

//   console.log("request coming from server is :", req.body.image);

//   return;

//   const newComplaint = new ComplaintsSchema({
//     //should be mongodb generated id
//     //coms_id :
//     coms_complaint_for: req.body.sevice_provider_id,
//     coms_complaint_code: "C" + uuidv4(),//need to generate in  like C123 auto increment feature
//     coms_property_id: req.body.property_id,
//     coms_user_id: req.body.cust_user_id,
//     //coms_complaint_by: 'customer' //need to check if complaints filed via customer portal or service_provider portal
//     coms_complaint_subject: req.body.coms_complaint_subject,
//     coms_complaint_note: req.body.coms_complaint_note,
//     coms_is_active_user_flag: req.session.active_user_login
//     //coms_complaint_file: req.body.coms_complaint_file,
//   });
//   newComplaint.save().then(complaints => {
//     console.log("Getting respose from db is :", complaints);
//     req.flash('success_msg', 'complaints raise succesfully');
//     //res.redirect("/")
//     res.json({ complaints: complaints, 'message': 'complaint sent successfully' })
//   }).catch(err => {
//     console.log(err)
//     req.flash('err_msg', 'Something went wrong please try again later.');
//     res.redirect('/professionals-hirenow');
//   });
// });

/* -------------------------------------------------------------------------------------------------
POST : message api is used for sending message to service_provider or vice-versa.
------------------------------------------------------------------------------------------------- */
router.post('/message', (req, res) => {
  console.log("Getting data from client is :", req);
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
  newMessage.save().then(message => {
    console.log("getting response form server is :", message);
    res.send({
      msgData: message
    })
    //res.flash('success_msg', 'message forward successfully');
    //res.redirect('/'); //set based on current login if its customer portal then redirect customer_message portal and 
  }).catch(err => {
    console.log(err)
    //req.flash('err_msg', 'Something went wrong please try again later.');
    //res.redirect('/professionals-hirenow');
  });
});

/* -------------------------------------------------------------------------------------------------
Function : invite function is used for sending invite to service_provider via gmail. this function will call while adding new Property in customer Portal
------------------------------------------------------------------------------------------------- */

function invite_function(req, saved_property) {
  console.log("Request getting from server :", req.body);
  const payload = { id: saved_property._id, property_name: saved_property.ps_property_name }; // Create Token Payload

  // Sign Token
  jwt.sign(
    payload,
    keys.secretOrKey,
    { expiresIn: 3600 * 60 * 60 },
    (err, token) => {
      console.log("Sending Secret token along with customer request", token);
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
        to: req.body.ps_other_party_emailid,
        from: 'golearning4@gmail.com',
        subject: 'Invitaion letter from Relai',

        text: 'Dear \n' + req.body.ps_other_party_fullname + '\n\n' + 'you are invited in Relai plateform.\n\n' +

          'We suggest you to please visit our Relai plateform and create your account as a service_provider \n' + 'Here is the registration link: http://' + req.headers.host + '/intro' + '\n\n' +

          'After Successfull registeration please copy this SecretToken in your dashboard section \n' + token + '\n\n' +

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
  );
}

/* -------------------------------------------------------------------------------------------------
POST : update-customer-profile is used for updating customer profile data 
------------------------------------------------------------------------------------------------- */

router.post('/update-customer-profile', (req, res) => {
  console.log("updating user profile with incoming request :", req.body);

  var user_id = req.session.user_id;
  CustomerSchema.findByIdAndUpdate({ _id: user_id }, { $set: { cus_fullname: req.body.cus_fullname, cus_address: req.body.cus_address, cus_country_id: req.body.cus_country_id, cus_city: req.body.cus_city, cus_phone_number: req.body.cus_phone_number, cus_updated_at: Date.now() } },
    function (err, customers) {
      if (err) {
        console.log("Something went wrong")
      }
      else {
        console.log("result after updating : ", customers);
        //TODO: Want to update session after editprofile

        // req.session._id = doc.user_id;
        // req.session.user_id = customers._id;
        req.session.name = req.body.cus_fullname;
        // req.session.email = customers.cus_email_id;
        // //req.session.is_user_logged_in = true;
        // // req.session.active_user_login = "buyer";
        req.session.address = req.body.cus_address;
        req.session.city = req.body.cus_city;
        req.session.phoneNumber = req.body.cus_phone_number;
        req.session.country = req.body.cus_country_id;
        //req.session.profilePicture= customer.profile_picture
        //req.flash('success_msg', 'Profile updated successfully.');
        //req.session.isChanged();
        console.log("req session is :", req.session);
        req.flash('success_msg', "Profile Uploaded Successfully.");
        res.redirect('/dashboard')
      }
    });
});

router.post('/new-raise-a-complaint', isCustomer, (req, res) => {
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
        comsd_user_id: req.body.user_id,
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


router.post('/complaint-details-discussion', isCustomer, (req, res) => {
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


router.post('/removeProfesshional', isCustomer, async(req, res) => {
   console.log("remove prof id" ,req.body.professhional_id,req.session)
  var responce=await propertyProfesshionalHelper.removeProfessionalById(req.body.professhional_id,req.session.property_id)
  if(responce){
    console.log("remove responce==========",responce)
    return res.send({
      'success_msg': 'Professional Removed successfully..',
      'status': true,
      'id':responce._id
    });
  } else {
    return res.send({
      'err_msg': 'Something Wrong.',
      'status': false,

    });
  }
  console.log("responce:", responce)
})



//***************** post changes password **************//
router.post('/change-password', isCustomer, function (req, res) {
  console.log("calling change password API", req.body);
  var user_id = req.session.user_id;
  const { errors, isValid } = validateChangePasswordInput(req.body);
  // Check Validation
  if (!isValid) {
    console.log("error is ", errors);
    req.flash('err_msg', errors.confirmPassword);
    return; // res.redirect('/change-Password');
  }
  var hashPassword = "";
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(req.body.cus_password, salt, (err, hash) => {
      if (err) throw err;
      hashPassword = hash;
      CustomerSchema.updateOne({
        '_id': req.session.user_id
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
          return;
        } else {
          console.log("Password change successfully");
          req.flash('success_msg', 'password change successfully');
        }
      });
    });

  });
});

router.post('/complaint-details-discussion-close', isCustomer, (req, res) => {

  let ComplaintCode = req.body.complainCode;
  ComplaintsSchema.updateOne({ 'coms_complaint_code': ComplaintCode }, { $set: { coms_complaint_status: 'completed' } }, { upsert: true }, function (err) {
    if (err) {
      res.send({ status: false, message: 'Something going wrong please check again !!' })
    } else {
      res.send({ status: true, message: 'Your complaint discussion closed successfully !!' })
    }
  });
});


module.exports = router;
