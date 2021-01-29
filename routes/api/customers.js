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
const MessageSchema = require("../../models/message");



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
    else if (file.fieldname === "propertiesplanpic") {
      cb(null, 'public/propplanimg');
    }

  },
  filename: function (req, file, cb) {
    var datetimestamp = Date.now();
    cb(null, file.originalname)
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
      name: 'propertiesplanpic', maxCount: 3
    }
  ]
);
function checkFileType(file, cb) {

  if (file.fieldname === "propertiespic" || file.fieldname === "propertiesplanpic") {
    if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg' ||
      fiel.mimetype === 'image/gif'
    ) { // check file type to be png, jpeg, or jpg
      cb(null, true);
    } else {
      cb(null, false); // else fails
    }
  }
}


router.post("/add-property", async (req, res) => {
  upload(req, res, () => {
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
      //ps_property_user_as: req.body.ps_property_user_as,
      ps_property_user_as: req.session.active_user_login, //updaing active customer portal buyer/seller/renovator
      ps_other_party_fullname: req.body.ps_other_party_fullname,
      ps_other_party_emailid: req.body.ps_other_party_emailid,
      ps_other_party_invited: req.body.ps_other_party_invited,
      ps_property_area: req.body.ps_property_area,
      ps_property_bedroom: req.body.ps_property_bedroom,
      ps_property_bathroom: req.body.ps_property_bathroom,
      ps_additional_note: req.body.ps_additional_note,
      ps_property_type: req.body.ps_property_type,
      ps_chain_property_id: req.body.ps_chain_property_id,
      ps_is_active_user_flag: req.session.active_user_login
    });
    newProperty
      .save()
      .then(async (property) => {
        console.log('result', property)
        if (property) {
          await req.files.propertiespic.forEach(element => {
            var obj = {
              pps_property_id: property._id,
              pps_property_image_name: element.filename,
              pps_is_active_user_flag: req.session.active_user_login,
              pps_property_image: {
                data: fs.readFileSync(path.join(__dirname + '../../../public/propimg/' + element.filename)),
                contentType: 'image/png'
              }
            }

            PropertiesPictureSchema.create(obj, (err, item) => {
              if (err) {
                console.log(err);
                req.flash('err_msg', "Something went worng please try after some time");
                // res.redirect('/add-property');
              }
              else {
                item.save();
                console.log("file Submitted Successfully");
                req.flash('success_msg', "Properties picture Uploaded Successfully");
                //res.redirect('/add-property');
              }
            });
          });
          await req.files.propertiesplanpic.forEach(e => {
            var obj = {
              ppps_property_id: property._id,
              ppps_plan_image_name: e.filename,
              ppps_is_active_user_flag: req.session.active_user_login,
              ppps_plan_image: {
                data: fs.readFileSync(path.join(__dirname + '../../../public/propplanimg/' + e.filename)),
                contentType: 'image/png'
              }
            }

            PropertiesPlanPictureSchema.create(obj, (err, item) => {
              if (err) {
                console.log(err);
                req.flash('err_msg', "Something went worng please try after some time");
                //res.redirect('/add-property');
              }
              else {
                item.save();
                console.log("file Submitted Successfully");
                req.flash('success_msg', "Properties picture Uploaded Successfully");
                // res.redirect('/add-property');

              }
            });

          });
          //Sending Invitation link to serviceProvider
          console.log("Invitation send to service provider", req.body);
          await invite_function(req);
          res.redirect("/mydreamhome")
        }

      })
      .catch(err => {
        console.log(err)
        req.flash('err_msg', 'Something went wrong please try after some time!');
        res.redirect('/add-property');

      });

  })

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
router.post('/change-permision', (req, res) => {
  console.log(req.body.id_element)

  var idArray = req.body.checked_elem.split(",");

  // DocumentPermissionSchema 
  for (var service_provider_id of idArray) {
    var Obj = {
      dps_customer_id: req.body.cust_id,
      dps_service_provider_id: service_provider_id,
      dps_document_id: req.body.id_element,
      dps_is_active_user_flag: req.session.active_user_login //active portal like: buyer/seller/renovator
    }
    var docPermissionSave = new DocumentPermissionSchema(Obj)
    docPermissionSave.save().then((data) => {
      console.log(data)
    }).catch(err => {
      console.log(err)
      req.flash('err_msg', 'Something went wrong please try after some time!');

    });
  }
})

/* -------------------------------------------------------------------------------------------------
POST : Hire now api is used for hiring professional(service_provider) for particular property.
------------------------------------------------------------------------------------------------- */
<<<<<<< HEAD
const addTaskHelper = require("./addTask");
router.post("/hire-now", async (req, res) => {
  console.log("req is", req.body);
  var user_id = req.body.user_id;
  var propertyId = req.body.propertyId;
  var pps_professional_id = req.body.serviceProviderId;
  var pps_phase_name = req.body.instruction;
  var pps_phase_start_date = req.body.startDate
  var pps_phase_end_date = req.body.endDate
  let addPhaseResponce = await addTaskHelper.save_addPhase(propertyId, pps_professional_id, pps_phase_name, pps_phase_start_date, pps_phase_end_date);
  console.log('addPhaseResponce', addPhaseResponce);
=======
 
const addTaskHelper = require("./addTask"); 
router.post("/hire-now", async(req, res) => {
  var err_msg = null;
  var success_msg = null;
  //const { errors, isValid } = validateAddPhase(req.body);
  console.log("req is", req.body);
  // if (!isValid) {
  //   console.log("server validation error is:", errors);
  //   req.flash('err_msg', errors.instruction);
  //   return res.redirect('/professionals-hirenow');
  // }

  if(req.body.instruction.length!=0){
    req.body.instruction.forEach(async function(instruction,i){
      var user_id=req.body.user_id;
      var propertyId = req.body.propertyId;
      var pps_professional_id=req.body.serviceProviderId;
      var pps_phase_name= instruction;
      var pps_phase_start_date=req.body.startDate[i]
      var pps_phase_end_date=req.body.endDate[i]
      let addPhaseResponce=await addTaskHelper.save_addPhase(propertyId,pps_professional_id,pps_phase_name,pps_phase_start_date,pps_phase_end_date);
       console.log('addPhaseResponce A:',addPhaseResponce) 
  })
  }else{
    req.flash('err_msg', errors.instruction);
    return res.redirect('/professionals-hirenow');
  }
  
>>>>>>> b78862b91bf7f9555fb904612dafe9325f71a125
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
      //res.json(hireprofessional);
      //await addTaskHelper.save_addTask();
<<<<<<< HEAD
      res.redirect("/professionals-hirenow")

=======
      //res.redirect("/professionals-hirenow")
      res.redirect('/add-task');
>>>>>>> b78862b91bf7f9555fb904612dafe9325f71a125
      //res.json({status:1,'message':'professinoal hired successfully',data:addPhaseResponce})
    })
    .catch(err => {
      console.log(err)
      req.flash('err_msg', 'Something went wrong please try again later.');
      // res.redirect('/');
    });

});

/* -------------------------------------------------------------------------------------------------
POST : Add Task api is used for adding task(or Phase) details and sharing these details to hired professional.
------------------------------------------------------------------------------------------------- */
<<<<<<< HEAD
router.post("/addTask", (req, res) => {
  console.log("AddTask:++", req.body)
  const newTask = new PropertyProfessinoalTaskSchema({
    //ppts_property_id:  need to store properties Id
    ppts_user_id: req.body.currentUserId,
    ppts_task_name: req.body.todotask,
    ppts_assign_to: req.body.professionalId,
    ppts_due_date: req.body.duedate
=======
router.post("/addTask",(req,res)=>{
  console.log("AddTask:++",req.body)
  console.log('session user active flage',req.session.active_user_login);
  const newTask = new PropertyProfessinoalTaskSchema({
    ppts_property_id: req.body.ppts_property_id,
    ppts_user_id:req.body.currentUserId,
    ppts_task_name: req.body.todotask,
    ppts_assign_to: req.body.professionalId,
    ppts_due_date:req.body.duedate,
    ppts_phase_id:req.body.phase_id,
    ppts_is_active_user_flag:req.session.active_user_login,
    ppts_note:req.body.notes
>>>>>>> b78862b91bf7f9555fb904612dafe9325f71a125
  });
  newTask
    .save()
    .then(addedTask => {
      console.log("server response is addedTask :", addedTask);
      res.json({status:1,message:'Task Add Successfully',data:addedTask});
      // res.redirect("/professionals-hirenow")
    })
    .catch(err => {
      console.log(err)
      req.flash('err_msg', 'Something went wrong please try again later.');
      res.redirect('/professionals-hirenow');
    });
})
router.post("/add-Task", (req, res) => {
  console.log("req is", req.body);
  return;
  const newTask = new PropertiesPhaseSchema({
    //pps_property_id:  need to store properties Id
    pps_phase_name: req.body.pps_phase_name,
    pps_phase_start_date: req.body.pps_phase_start_date,
    pps_phase_end_date: req.body.pps_phase_end_date,
    pps_is_active_user_flag: req.session.active_user_login
  });
  newTask
    .save()
    .then(addedTask => {
      console.log("server response is :", addedTask);
      res.json(addedTask);
      // res.redirect("/professionals-hirenow")
    })
    .catch(err => {
      console.log(err)
      req.flash('err_msg', 'Something went wrong please try again later.');
      res.redirect('/professionals-hirenow');
    });

});

/* -------------------------------------------------------------------------------------------------
POST : Raise a complaints api is used for raising a complaints to particular service provider along with note and status.
------------------------------------------------------------------------------------------------- */

router.post('/raise-a-complaint', (req, res) => {

  console.log("request coming from server is :", req.body.image);

  return;

  const newComplaint = new ComplaintsSchema({
    //should be mongodb generated id
    //coms_id :
    coms_complaint_for: req.body.sevice_provider_id,
    coms_complaint_code: "C" + uuidv4(),//need to generate in  like C123 auto increment feature
    coms_property_id: req.body.property_id,
    coms_user_id: req.body.cust_user_id,
    //coms_complaint_by: 'customer' //need to check if complaints filed via customer portal or service_provider portal
    coms_complaint_subject: req.body.coms_complaint_subject,
    coms_complaint_note: req.body.coms_complaint_note,
    coms_is_active_user_flag: req.session.active_user_login
    //coms_complaint_file: req.body.coms_complaint_file,
  });
  newComplaint.save().then(complaints => {
    console.log("Getting respose from db is :", complaints);
    req.flash('success_msg', 'complaints raise succesfully');
    //res.redirect("/")
    res.json({ complaints: complaints, 'message': 'complaint sent successfully' })
  }).catch(err => {
    console.log(err)
    req.flash('err_msg', 'Something went wrong please try again later.');
    res.redirect('/professionals-hirenow');
  });
});

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

function invite_function(req) {
  console.log("Request getting from server :", req.body);
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
    to: req.body.ps_other_party_emailid,
    from: 'golearning4@gmail.com',
    subject: 'Invitaion letter from Relai',

    text: 'Dear \n' + req.body.ps_other_party_fullname + '\n\n' + 'you are invited in Relai plateform.\n\n' +

      'We suggest you to please visit our Relai plateform and create your account as a service_provider \n' + 'Here is the registration link: http://' + req.headers.host + '/intro' + '\n\n' +
      'Thanks and Regards,' + '\n' + 'Relai Team' + '\n\n',
  };
  smtpTransport.sendMail(mailOptions, function (err) {
    if (err) { console.log('err_msg is :', err); req.flash('err_msg', 'Something went wrong, please contact to support team'); res.redirect('/add-property') } else {
      //req.flash('success_msg', 'Invitation link has been sent successfully on intered email id, please check your mail...');
      // res.redirect('/add-property')
    }
  });
}
/* -------------------------------------------------------------------------------------------------
POST : update-customer-profile is used for updating customer profile data 
------------------------------------------------------------------------------------------------- */

router.post('/update-customer-profile', (req, res) => {
  console.log("updating user profile with incoming request :", req.body);

  var user_id = req.session.user_id;
  CustomerSchema.findByIdAndUpdate({ _id: user_id }, { $set: { cus_fullname: req.body.cus_fullname, cus_address: req.body.cus_address, cus_city: req.body.cus_city, cus_email_id: req.body.cus_email_id, cus_phone_number: req.body.cus_phone_number, cus_updated_at: Date.now() } },
    function (err, customers) {
      if (err) {
        console.log("Something went wrong")
      }
      else {
        console.log("result after updating : ", customers);
        //TODO: Want to update session after editprofile

        // req.session._id = doc.user_id;
        // req.session.user_id = customers._id;
        // req.session.name = customers.cus_fullname;
        // req.session.email = customers.cus_email_id;
        // //req.session.is_user_logged_in = true;
        // // req.session.active_user_login = "buyer";
        // req.session.address = customers.cus_address;
        // req.session.city = customers.cus_city;
        // req.session.phoneNumber = customers.cus_phone_number;
        // req.session.country = customers.cus_country_id;
        //req.session.profilePicture= customer.profile_picture
        //req.flash('success_msg', 'Profile updated successfully.');
        //req.session.isChanged();
        console.log("req session is :", req.session);
        res.redirect('/signin')
      }
    });
});



module.exports = router;
