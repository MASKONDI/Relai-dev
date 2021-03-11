const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const path = require('path');
const ejs = require('ejs');
const app = express();
const moment = require('moment');
var fs = require('fs');
var auth = require('../config/auth');
var multer = require('multer');

var isCustomer = auth.isCustomer;
var isServiceProvider = auth.isServiceProvider;
var signUpHelper = require('./api/service_provider_helper/signup_helper')
var trackYourProgress = require('./api/service_provider_helper/trackYourProgress')

var propertyProfessinoal = require('./api/service_provider_helper/propertyProfessionalHelper')
var propertyHelper = require('./api/service_provider_helper/sp_propertydetial');
var customerHelper = require('./api/service_provider_helper/customerHelper')

const PropertiesPictureSchema = require("../models/properties_picture");
const CustomerSchema = require("../models/customers");
//const PropertiesPlanPictureSchema = require("../models/properties_plan_picture");
const PropertiesSchema = require("../models/properties");
const PropertyProfessionalSchema = require("../models/property_professional_Schema");
const CustomerUploadDocsSchema = require("../models/customer_upload_document");
const TaskHelper = require("./api/addTask");

const ServiceProviderPortfolioSchema = require("../models/service_provider_portfolio");
const ServiceProviderSchema = require("../models/service_providers");
const ServiceProviderPersonalDetailsSchema = require("../models/service_provider_personal_details");
const ServiceProviderEducationSchema = require("../models/service_provider_education");
const ServiceProviderOtherDetailsSchema = require("../models/service_providers_other_details");
const ServiceProviderLanguageSchema = require("../models/service_provider_languages");
const ServiceProviderEmploymentHistorySchema = require('../models/service_provider_employment_history');
const ServiceProviderReferenceSchema = require("../models/service_provider_reference");
const ServiceProviderIndemnityDetailsSchema = require("../models/service_provider_indemnity_details");

const MessageSchema = require("../models/message");

function tallyVotes(AllhiredProfeshnoal) {
  return AllhiredProfeshnoal.reduce((total, i) => total + i.pps_pofessional_budget, 0);
}

function timeDifference(data) {
  var date = [];
  data.forEach(function (item) {
    var startDate = "";
    var endDate = "";
    let diffInMilliSeconds;
    var days = "";
    console.log("start date" + item.start_date + " end Date" + item.end_date);
    // message = message + calcDate(item.start_date, item.end_date);
    startDate = new Date(Date.parse(item.start_date));
    endDate = new Date(Date.parse(item.end_date));
    diffInMilliSeconds = Math.abs(endDate - startDate) / 1000;
    // calculate days
    days = Math.floor(diffInMilliSeconds / 86400);
    date.push(days);

    console.log("total date is :", days);

  });
  var estimated_time = date.reduce((total, i) => total + i, 0);
  var message = "";
  if (estimated_time > 365) {
    var year = Math.floor(estimated_time / 365);
    var days = estimated_time % 365;
    if (days > 31) {
      var months = Math.floor(days / 31);
      var day = days % 31;
      message += year + " year " + months + " months " + day + " days"
    }
  }
  else if (estimated_time > 31) {
    var months = Math.floor(estimated_time / 31);
    var day = estimated_time % 31;
    message += months + " months " + day + " days"
  } else {
    message += estimated_time + " days "
  }
  console.log("estimated_time :", message);
  if (isNaN(estimated_time)) {
    console.log("aaa", estimated_time)
    return 'N/A';
  } else {
    console.log("bbb", estimated_time)
    return message;
  }
}

function getPhase(phase) {
  if (phase == 'A') {
    return 'mydreamhome-details-phase-a';
  } else if (phase == 'B') {
    return 'mydreamhome-details-phase-b';
  } else if (phase == 'C') {
    return 'mydreamhome-details-phase-c';
  } else if (phase == 'D') {
    return 'mydreamhome-details-phase-d';
  } else if (phase == 'E') {
    return 'mydreamhome-details-phase-e';
  } else if (phase == 'F') {
    return 'mydreamhome-details-phase-f';
  } else if (phase == 'G') {
    return 'mydreamhome-details-phase-g';
  } else if (phase == 'H') {
    return 'mydreamhome-details-phase-h';
  } else {
    return 'mydreamhome-details-phase-o';
  }


}

app.get('/signup-professionals-profile', isServiceProvider, (req, res) => {
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  console.log("Current session is : ", req.session);
  res.render('signup-professionals-profile', {
    err_msg, success_msg, layout: false,
    session: req.session
  });
});
app.get('/signup-professionals-profile-2', isServiceProvider, (req, res) => {
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  res.render('signup-professionals-profile-2', {
    err_msg, success_msg, layout: false,
    session: req.session
  });
});


app.get('/signup-professionals-profile-5', async (req, res) => {
  console.log('55555555555', req.query)
  if (req.query.editid) {
    let refrenceData = await signUpHelper.getReferenceDetailById(req.query.editid);
    console.log(refrenceData)
    if (refrenceData) {
      err_msg = req.flash('err_msg');
      success_msg = req.flash('success_msg');
      res.render('signup-professionals-profile-5', {
        err_msg, success_msg, layout: false,
        session: req.session,
        refrenceData: refrenceData
      });
    } else {
      err_msg = req.flash('err_msg');
      success_msg = req.flash('success_msg');
      res.render('signup-professionals-profile-5', {
        err_msg, success_msg, layout: false,
        session: req.session,
        refrenceData: null
      });
    }
  } else {
    err_msg = req.flash('err_msg');
    success_msg = req.flash('success_msg');
    res.render('signup-professionals-profile-5', {
      err_msg, success_msg, layout: false,
      session: req.session,
      refrenceData: null
    });
  }

  // res.render('signup-professionals-profile-5', {
  //   err_msg, success_msg, layout: false,
  //   session: req.session
  // });
});
app.get('/service-provider/dashboard-professional', isServiceProvider, (req, res) => {
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  req.session.pagename = "service-provider/dashboard-professional"
  res.render('service-provider/dashboard-professional', {
    err_msg, success_msg, layout: false,
    session: req.session
  });
});
app.get('/signup-professionals-profile-6', (req, res) => {
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  res.render('signup-professionals-profile-6', {
    err_msg, success_msg, layout: false,
    session: req.session
  });
});
app.get('/signup-professionals-profile-7', isServiceProvider, (req, res) => {
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  res.render('signup-professionals-profile-7', {
    err_msg, success_msg, layout: false,
    session: req.session
  });
});
app.get('/portfolio', isServiceProvider, (req, res) => {
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  res.render('portfolio', {
    err_msg, success_msg, layout: false,
    session: req.session
  });
});
app.get('/otp-professional', function (req, res) {
  console.log("current session is :", req.session);

  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  res.render('otp-professional', {
    err_msg, success_msg, layout: false,
    session: req.session
  });
});
app.get('/service-provider/track-your-progress-professionals', isServiceProvider, async function (req, res) {
  let data = await trackYourProgress.getAllPropertyByUserId(req.session.user_id)
  console.log('data=======', data);
  //console.log("current session is :", req.session);
  req.session.pagename = 'service-provider/track-your-progress-professionals';
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  res.render('service-provider/track-your-progress-professionals', {
    err_msg, success_msg, layout: false,
    session: req.session,
    propertyData: data
  });
});
// app.post('/service-provider/track-your-progress-professionals', isServiceProvider, async function (req, res) {
//   console.log(req.body);
//   var start=req.body.start
//   var limit=req.body.limit
//   let data = await trackYourProgress.getAllPropertyByUserId1(req.session.user_id,start,limit)
//   console.log('data===========',data)
//   res.send({
//     'data':data
//   })
// })
app.get('/service-provider/property', isServiceProvider, async function (req, res) {
  console.log("current session is  from sp end:", req.session);
  req.session.pagename = 'service-provider/property';
  let propertyArray = []
  PropertiesSchema.find().sort({ _id: -1 }).limit(12).then(async (data) => {
    if (data) {
      let arr = [];
      //console.log("Property Data is", data);
      for (let img of data) {

        //propertyArray.push(data)
        await PropertiesPictureSchema.find({ pps_property_id: img._id }).then(async (result) => {

          let temp = await result
          //for(let image of result){
          //  let temp = await image
          let customerName = await customerHelper.getCustomerNameByID(img.ps_user_id);
          let customerProfile = await customerHelper.getCustomerImageByID(img.ps_user_id);
          temp.customer_name = await customerName
          temp.customer_profile = await customerProfile
          arr.push(temp)
          // }
          console.log("arr is", arr);
        })
      }

      //data.add(t);
      // console.log("customer_name is ", arr[0].customer_name);
      // console.log('++++++++',arr)
      err_msg = req.flash('err_msg');
      success_msg = req.flash('success_msg');

      res.render('service-provider/property', {
        err_msg, success_msg, layout: false,
        session: req.session,
        propertyData: data,
        propertyImage: arr
      });

    }
  }).catch((err) => {
    console.log(err)
  })

})
// let AllhiredProfeshnoal = await propertyProfessinoal.getHiredPropertyProfessional(req.session.user_id);
// for (let key of AllhiredProfeshnoal) {
//   let propertyData = await propertyHelper.getPropertyByID(key.pps_property_id);
//   let propertyImageData = await propertyHelper.getPropertyImageByID(propertyData._id);
//   propertyData.property_image = await propertyImageData.pps_property_image_name;
//   let customerName = await customerHelper.getCustomerNameByID(key.pps_user_id);
//   let customerProfile = await customerHelper.getCustomerImageByID(key.pps_user_id);
//   propertyData.customer_name = await customerName
//   propertyData.customer_profile = await customerProfile
//   propertyArray.push(propertyData)

// }

//   console.log("propertyIdArray", propertyArray);
//   res.render('service-provider/property', {
//     err_msg, success_msg, layout: false,
//     session: req.session,
//     propertyData: propertyArray,

//   })
// });
app.get('/service-provider/professionals-to-do-list', isServiceProvider, function (req, res) {
  console.log("current session is :", req.session);
  req.session.pagename = 'service-provider/professionals-to-do-list';
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  res.render('service-provider/professionals-to-do-list', {
    err_msg, success_msg, layout: false,
    session: req.session
  });
});

app.get('/service-provider/myproperties', isServiceProvider, async function (req, res) {
  console.log("", req.session);
  req.session.pagename = 'service-provider/property';
  let propertyArray = []
  let AllhiredProfeshnoal = await propertyProfessinoal.getHiredPropertyProfessional(req.session.user_id);
  for (let key of AllhiredProfeshnoal) {
    let propertyData = await propertyHelper.getPropertyByID(key.pps_property_id);
    let propertyImageData = await propertyHelper.getPropertyImageByID(propertyData._id);
    propertyData.property_image = await propertyImageData.pps_property_image_name;
    let customerName = await customerHelper.getCustomerNameByID(key.pps_user_id);
    let customerProfile = await customerHelper.getCustomerImageByID(key.pps_user_id);
    propertyData.customer_name = await customerName
    propertyData.customer_profile = await customerProfile
    propertyArray.push(propertyData)

  }
  console.log("propertyIdArray", propertyArray);
  res.render('service-provider/myproperties', {
    err_msg, success_msg, layout: false,
    session: req.session,
    propertyData: propertyArray,

  })
});




app.get('/service-provider/professional-details-docs', isServiceProvider, async function (req, res) {
  console.log("", req.session);
  //console.log('data===========',data)
  req.session.pagename = 'service-provider/property';
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  res.render('service-provider/professional-details-docs', {
    err_msg, success_msg, layout: false,
    session: req.session
  });
});


app.get('/service-provider/property-detail', isServiceProvider, function (req, res) {
  console.log("current session is :", req.session);
  console.log("req.query is :", req.query);
  req.session.pagename = 'service-provider/property';
  PropertiesSchema.find({ _id: req.query.id }).then(async (data) => {
    if (data) {
      let customerName = await customerHelper.getCustomerNameByID(data[0].ps_user_id);
      let customerProfile = await customerHelper.getCustomerImageByID(data[0].ps_user_id);

      let arr = [];
      for (let img of data) {
        await PropertiesPictureSchema.find({ pps_property_id: img._id }).then(async (result) => {
          //let temp = await result
          for (let image of result) {
            let temp = await image
            arr.push(temp)
          }

        })
      }
      req.session.property_id = data[0]._id;
      //console.log("Data Array is ", data);
      //console.log("customerName ...", customerName)
      // console.log("customerProfile is ......", customerProfile);
      err_msg = req.flash('err_msg');
      success_msg = req.flash('success_msg');
      res.render('service-provider/property-detail', {
        err_msg, success_msg, layout: false,
        session: req.session,
        propertyDetailData: data,
        propertyImage: arr,
        customerName: customerName,
        customerProfile: customerProfile
      });

      //console.log(serviceProvArray)
    }
  }).catch((err) => {
    console.log(err)
  })


})




//   err_msg = req.flash('err_msg');
//   success_msg = req.flash('success_msg');
//   res.render('service-provider/property-detail', {
//     err_msg, success_msg, layout: false,
//     session: req.session
//   });
// });


app.get('/service-provider/professionals-detail-message', isServiceProvider, function (req, res) {
  console.log("current session is :", req.session);
  req.session.pagename = 'service-provider/property';
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  res.render('service-provider/professionals-detail-message', {
    err_msg, success_msg, layout: false,
    session: req.session
  });
});

app.get('/service-provider/complaints-professional-detail', isServiceProvider, function (req, res) {
  console.log("current session is :", req.session);
  req.session.pagename = 'service-provider/complaints-professional';
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  res.render('service-provider/complaints-professional-detail', {
    err_msg, success_msg, layout: false,
    session: req.session
  });
});

app.get('/service-provider/complaints-professional', isServiceProvider, function (req, res) {
  console.log("current session is :", req.session);
  req.session.pagename = 'service-provider/complaints-professional';
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  res.render('service-provider/complaints-professional', {
    err_msg, success_msg, layout: false,
    session: req.session
  });
});


app.get('/service-provider/complaints-professional-detail', isServiceProvider, function (req, res) {
  console.log("current session is :", req.session);
  req.session.pagename = 'service-provider/complaints-professional-detail';
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  res.render('service-provider/complaints-professional-detail', {
    err_msg, success_msg, layout: false,
    session: req.session
  });
});


app.get('/service-provider/professionals-detail-message', isServiceProvider, function (req, res) {
  console.log("current session is :", req.session);
  req.session.pagename = 'service-provider/property';
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  res.render('/service-provider/professionals-detail-message', {
    err_msg, success_msg, layout: false,
    session: req.session
  });
});

app.get('/service-provider/property-detail-submit-proposal', isServiceProvider, function (req, res) {
  console.log("current session is :", req.session);
  console.log("req.query is :", req.query);
  req.session.pagename = 'service-provider/property';
  PropertiesSchema.find({ _id: req.query.id }).then(async (data) => {
    if (data) {
      // let customerName = await customerHelper.getCustomerNameByID(data[0].ps_user_id);
      // let customerProfile = await customerHelper.getCustomerImageByID(data[0].ps_user_id);
      let custData = await CustomerSchema.findOne({ _id: data[0].ps_user_id });
      let arr = [];
      for (let img of data) {
        await PropertiesPictureSchema.find({ pps_property_id: img._id }).then(async (result) => {
          //let temp = await result
          for (let image of result) {
            let temp = await image
            arr.push(temp)
          }

        })
      }

      console.log("Data Array is ", data);
      //console.log("customerName ...", customerName)
      // console.log("customerProfile is ......", customerProfile);
      err_msg = req.flash('err_msg');
      success_msg = req.flash('success_msg');
      res.render('service-provider/property-detail-submit-proposal', {
        err_msg, success_msg, layout: false,
        session: req.session,
        propertyDetailData: data,
        propertyImage: arr,
        customer: custData
      });

      //console.log(serviceProvArray)
    }
  }).catch((err) => {
    console.log(err)
  })


})


app.get('/signup-professionals-profile-4', isServiceProvider, async (req, res) => {
  var service_provider_id = req.session.user_id;
  var all_employe_history = await signUpHelper.getAllEmployeHistory(service_provider_id);
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  req.session.pagename = 'signup-professionals-profile-4';
  res.render('signup-professionals-profile-4', {
    err_msg, success_msg, layout: false,
    session: req.session,
    moment: moment,
    all_employe_history: all_employe_history
  });
});

app.get('/service-provider/myproperties-detail-phaseA', isServiceProvider, function (req, res) {
  console.log("current session is :", req.session);
  err_msg = req.flash('err_msg');
  req.session.pagename = 'service-provider/property';
  success_msg = req.flash('success_msg');
  res.render('service-provider/myproperties-detail-phaseA', {
    err_msg, success_msg, layout: false,
    session: req.session
  });
});

app.get('/service-provider/professional-detail-message', isServiceProvider, function (req, res) {
  console.log("current session is :", req.session);
  err_msg = req.flash('err_msg');
  req.session.pagename = 'service-provider/property';
  success_msg = req.flash('success_msg');
  res.render('service-provider/professional-detail-message', {
    err_msg, success_msg, layout: false,
    session: req.session
  });
});


app.get('/getPersonaldetails', isServiceProvider, async function (req, res) {
  console.log('req.query:', req.query)
  await ServiceProviderPersonalDetailsSchema.find({ spods_service_provider_id: req.query.user_id }).then(async (data) => {
    console.log('server response for personal data is :', data)
    if (data) {
      err_msg = req.flash('err_msg');
      success_msg = req.flash('success_msg');
      res.send({
        err_msg, success_msg, layout: false,
        session: req.session,
        personalDetailsData: data,
      });
    }
  }).catch((err) => {
    console.log(err)
  })
});


app.get('/getOtherProfile', isServiceProvider, async function (req, res) {
  console.log('req.query:', req.query)
  await ServiceProviderOtherDetailsSchema.find({ spods_service_provider_id: req.query.user_id }).then(async (data) => {
    console.log('server response for other data is :', data)
    if (data) {
      err_msg = req.flash('err_msg');
      success_msg = req.flash('success_msg');
      res.send({
        err_msg, success_msg, layout: false,
        session: req.session,
        otherDetailsData: data,
      });
    }
  }).catch((err) => {
    console.log(err)
  })
});

app.get('/getEducationdetails', isServiceProvider, async function (req, res) {
  console.log('req.query:', req.query)
  await ServiceProviderEducationSchema.find({ spes_service_provider_id: req.query.user_id }).sort({ _id: -1 }).then(async (data) => {
    console.log('server response for education data is : ', data)
    if (data) {
      err_msg = req.flash('err_msg');
      success_msg = req.flash('success_msg');
      res.send({
        err_msg, success_msg, layout: false,
        session: req.session,
        educationDetailsData: data,
      });
    }
  }).catch((err) => {
    console.log(err)
  })
});

app.get('/getEmploymenthistorydetails', isServiceProvider, async function (req, res) {
  console.log('req.query:', req.query)
  await ServiceProviderEmploymentHistorySchema.find({ spehs_service_provider_id: req.query.user_id }).sort({ _id: -1 }).then(async (data) => {
    console.log('server response for employment history data is : ', data)
    if (data) {
      err_msg = req.flash('err_msg');
      success_msg = req.flash('success_msg');
      res.send({
        err_msg, success_msg, layout: false,
        session: req.session,
        employmentDetailsData: data,
      });
    }
  }).catch((err) => {
    console.log(err)
  })
});

app.get('/getReferencedetails', isServiceProvider, async function (req, res) {
  console.log('req.query:', req.query)
  await ServiceProviderReferenceSchema.find({ rs_service_provider_id: req.query.user_id }).then(async (data) => {
    console.log('server response for Refernce data is:', data)
    if (data) {
      err_msg = req.flash('err_msg');
      success_msg = req.flash('success_msg');
      res.send({
        err_msg, success_msg, layout: false,
        session: req.session,
        referenceData: data,
      });
    }
  }).catch((err) => {
    console.log(err)
  })
});

app.get('/getIdentimitydetails', isServiceProvider, async function (req, res) {
  console.log('req.query:', req.query)
  await ServiceProviderIndemnityDetailsSchema.find({ spods_service_provider_id: req.query.user_id }).then(async (data) => {
    console.log('server response for Identimity-details data is : ', data)
    if (data) {
      err_msg = req.flash('err_msg');
      success_msg = req.flash('success_msg');
      res.send({
        err_msg, success_msg, layout: false,
        session: req.session,
        IdemnityDetailsData: data,
      });
    }
  }).catch((err) => {
    console.log(err)
  })
});

app.get('/getLanguagedetails', isServiceProvider, async function (req, res) {
  console.log('req.query:', req.query)
  await ServiceProviderLanguageSchema.find({ spls_service_provider_id: req.query.user_id }).sort({ _id: -1 }).then(async (data) => {
    console.log('server response for Language data is:', data)
    if (data) {
      err_msg = req.flash('err_msg');
      success_msg = req.flash('success_msg');
      res.send({
        err_msg, success_msg, layout: false,
        session: req.session,
        languageData: data,
      });
    }
  }).catch((err) => {
    console.log(err)
  })
});



app.get('/service-provider/myproperties-detail', isServiceProvider, async function (req, res) {
  console.log("", req.session);
  req.session.pagename = 'service-provider/property';
  if (req.query.id) {
    req.session.property_id = req.query.id
    console.log("req.query.id:", req.query.id);
    PropertiesSchema.find({ _id: req.query.id}).then(async (data) => {
      if (data) {

        
        var EstimatedTime = timeDifference(data[0].ps_phase_array);
        let arr = [];
        for (let img of data) {
          await PropertiesPictureSchema.find({ pps_property_id: img._id }).then(async (result) => {
            //let temp = await result
            for (let image of result) {
              let temp = await image
              arr.push(temp)
            }
          })
        }

        let allDocumentUploadByCustmer = await CustomerUploadDocsSchema.find({cuds_property_id: req.query.id});
        //console.log('AllhiredProfeshnoal', AllhiredProfeshnoal);
        let serviceProvArray = [];
        let totalcostArray = [];
        var cost = 0;

        let CustomerDetails = await CustomerSchema.find({ _id: data[0].ps_user_id });
        if(CustomerDetails){
            //serviceProvArray.push(CustomerDetails)        
          for (let customerDetail of CustomerDetails) {
            await MessageSchema.findOne({
              $or: [
                { $and: [{ sms_sender_id: req.session.user_id }, { sms_receiver_id: customerDetail.id }, { sms_property_id: req.session.property_id }] },
                { $and: [{ sms_sender_id: customerDetail.id }, { sms_receiver_id: req.session.user_id }, { sms_property_id: req.session.property_id }] }
              ]
            }).sort({ _id: -1 }).then(async (msgdata) => {
              console.log('msgdata=', msgdata)
                if(msgdata !== null){
                      //for (let i of allProfeshnoals) {
                            if (msgdata) {
                              var object_as_string = JSON.stringify(customerDetail);
                              const t = JSON.parse(object_as_string);
                              // console.log('lastIndex:', msgdata.slice(-1)[0]);
                              let msgData = msgdata;
                              t.sms_message = msgData.sms_message;
                              //let temps = await i
                              serviceProvArray.push(t)
                            } else {
                              var object_as_string = JSON.stringify(customerDetail);
                              const t = JSON.parse(object_as_string);
                              t.sms_message = '...';
                              //let temps = await i
                              serviceProvArray.push(t)
                            }
                      //}
                }else{
                      console.log('myfff:')
                }
            })
        }
      }

      console.log('serviceProvArraymyfff:',serviceProvArray);


        // var sumof = tallyVotes(to)
        // var sumof = tallyVotes(AllhiredProfeshnoal)
        // console.log("sumofsumofsumofsumofsumof", sumof)
        // for (var k of AllhiredProfeshnoal) {
        //   var costs = parseInt(k.pps_pofessional_budget);
        //   cost = await parseInt(cost + costs);
        //   totalcostArray.push(cost)

        //   await ServiceProviderSchema.find({ _id: k.pps_service_provider_id }).then(async (allProfeshnoals) => {
        //     //console.log('allProfeshnoals:', allProfeshnoals)
        //     await MessageSchema.find({
        //       $or: [
        //         { $and: [{ sms_sender_id: req.session.user_id }, { sms_receiver_id: k.pps_service_provider_id }, { sms_is_active_user_flag: req.session.active_user_login }, { sms_property_id: req.session.property_id }] },
        //         { $and: [{ sms_sender_id: k.pps_service_provider_id }, { sms_receiver_id: req.session.user_id }, { sms_property_id: req.session.property_id }] }
        //       ]
        //     }).then(async (msgdata) => {
        //       //console.log('msgdata=', msgdata)
        //       for (let i of allProfeshnoals) {
        //         if (msgdata.length > 0) {
        //           var object_as_string = JSON.stringify(i);
        //           const t = JSON.parse(object_as_string);
        //           // console.log('lastIndex:', msgdata.slice(-1)[0]);
        //           let msgData = msgdata.slice(-1)[0];
        //           t.sms_message = msgData.sms_message;
        //           //let temps = await i
        //           serviceProvArray.push(t)
        //         } else {
        //           var object_as_string = JSON.stringify(i);
        //           const t = JSON.parse(object_as_string);
        //           t.sms_message = '...';
        //           //let temps = await i
        //           serviceProvArray.push(t)
        //         }
        //       }
        //     })
        //   });
        // }



        let todoArray = [];
        var c = 0;
        let TaskDetailObj = await TaskHelper.GetTaskById(req.query.id, req.session.active_user_login);
        var phase_page_name = '';
        for (var ph of TaskDetailObj) {
          var ServiceProffId='';
          const PhaseObject = JSON.stringify(ph);
          const to_do_data = JSON.parse(PhaseObject);
          phase_page_name = await getPhase(to_do_data.ppts_phase_flag);
          to_do_data.phase_page_name = phase_page_name
          if (typeof (to_do_data.ppts_assign_to) == 'object') { 
            var serviceId = to_do_data.ppts_assign_to.includes(req.session.user_id);
            if(serviceId == true)
            {
              ServiceProffId = req.session.user_id;

              let professionalObj = await propertyProfessinoal.GetProfessionalById(ServiceProffId);
              if (professionalObj) {
                for (var Prof_fullname of professionalObj) {
                  to_do_data.professionalName = Prof_fullname.sps_fullname
                  todoArray.push(to_do_data);
                }
              }

            }
          }
        }
        err_msg = req.flash('err_msg');
        success_msg = req.flash('success_msg');
        res.render('service-provider/myproperties-detail', {
          err_msg, success_msg, layout: false,
          session: req.session,
          propertyDetailData: data,
          propertyImage: arr,
          hiredProfeshnoalList: serviceProvArray,
          allDocumentUploadByCustmer: allDocumentUploadByCustmer,
          TaskDetailObj: todoArray,
          CustomerDetails:CustomerDetails,
         // totalcost: sumof,
          estimated_time: EstimatedTime,
          moment: moment

        });
      }
    }).catch((err) => {
      console.log(err)
    })
  } else {
    res.redirect('/myproperties');
  }


  // err_msg = req.flash('err_msg');
  // success_msg = req.flash('success_msg');
  // res.render('service-provider/myproperties-detail', {
  //   err_msg, success_msg, layout: false,
  //   session: req.session
  // });
});

module.exports = app;

