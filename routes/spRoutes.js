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
//const TaskHelper = require("./api/addTask");

const ServiceProviderPortfolioSchema = require("../models/service_provider_portfolio");
const ServiceProviderSchema = require("../models/service_providers");
const ServiceProviderPersonalDetailsSchema = require("../models/service_provider_personal_details");
const ServiceProviderEducationSchema = require("../models/service_provider_education");
const ServiceProviderOtherDetailsSchema = require("../models/service_providers_other_details");
const ServiceProviderLanguageSchema = require("../models/service_provider_languages");
const ServiceProviderEmploymentHistorySchema = require('../models/service_provider_employment_history');
const ServiceProviderReferenceSchema = require("../models/service_provider_reference");
const ServiceProviderIndemnityDetailsSchema = require("../models/service_provider_indemnity_details");
const SubmitProposalSchema = require("../models/submit_proposal_schema");
const MessageSchema = require("../models/message");
const TaskHelper = require("../routes/api/service_provider_helper/taskHelper");
const NotificationSchema = require("../models/notification_modal");

const ComplaintsSchema = require("../models/Complaints");
const ComplaintDetailsSchema = require("../models/complaint_details_model");
const CustomerDocPermission = require("../models/document_permission");
const DocumentDownloadSchema = require('../models/document_download_modal')


function tallyVotes(AllhiredProfeshnoal) {
  return AllhiredProfeshnoal.reduce((total, i) => total + i.pps_pofessional_budget, 0);
}



function timeDiffCalc(dateFuture, dateNow) {
  let diffInMilliSeconds = Math.abs(dateFuture - dateNow) / 1000;

  // calculate days
  const days = Math.floor(diffInMilliSeconds / 86400);
  diffInMilliSeconds -= days * 86400;
  //console.log('calculated days', days);

  // calculate hours
  const hours = Math.floor(diffInMilliSeconds / 3600) % 24;
  diffInMilliSeconds -= hours * 3600;
  //console.log('calculated hours', hours);

  // calculate minutes
  const minutes = Math.floor(diffInMilliSeconds / 60) % 60;
  diffInMilliSeconds -= minutes * 60;
  //console.log('minutes', minutes);

  let difference = '';
  if (days > 0) {

    difference = (days === 1) ? `${days} day ` : `${days} days ago `;
  } else if (hours > 0) {
    difference = (hours === 0 || hours === 1) ? `${hours} hour ` : `${hours} hours ago`;
  } else if (minutes > 0) {
    difference = (minutes === 0 || hours === 1) ? `${minutes} minutes` : `${minutes} minutes ago`;
  } else {
    difference = 'just now';

  }

  return difference;
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




app.get('/signup-professionals-profile', isServiceProvider, async (req, res) => {
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  console.log("Current session is : ", req.session);
  if (req.query.editid) {
    let data = await signUpHelper.getPersonalDetialByID(req.query.editid);
    console.log(data)
    res.render('signup-professionals-profile', {
      err_msg, success_msg, layout: false,
      session: req.session,
      data: data
    });
  } else {
    res.render('signup-professionals-profile', {
      err_msg, success_msg, layout: false,
      session: req.session,
      data: null
    });
  }

});
app.get('/signup-professionals-profile-2', isServiceProvider, async (req, res) => {
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  if (req.query.editid) {
    let data = await signUpHelper.getOtherDetialByID(req.query.editid);
    console.log(data)
    res.render('signup-professionals-profile-2', {
      err_msg, success_msg, layout: false,
      session: req.session,
      data: data
    });
  } else {
    res.render('signup-professionals-profile-2', {
      err_msg, success_msg, layout: false,
      session: req.session,
      data: null
    });
  }

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
app.get('/service-provider/dashboard-professional', isServiceProvider, async (req, res) => {

  var notificationObj = {
    name: '',
    image: '',
  }
  var notifData = [];
  await NotificationSchema.find({ ns_receiver: req.session.user_id, ns_receiver_type: 'service_provider', ns_read_status: 'unseen' }).then(async (notificationResults) => {
    console.log('notificationL:', notificationResults)
    if (notificationResults) {
      for (let notifResult of notificationResults) {
        if (notifResult.ns_sender_type == 'customer') {
          await CustomerSchema.findOne({ _id: notifResult.ns_sender }).then(async (cusResult) => {
            console.log('CustomerSchemaCustomerSchema:', cusResult);
            notificationObj = {
              name: cusResult.cus_fullname,
              image: cusResult.cus_profile_image_name,
            }
            notifData.push(notificationObj)
          })
        }
      }
    }
  });


  let propertyArray = []

  let AllhiredProfeshnoal = await PropertyProfessionalSchema.find({ pps_service_provider_id: req.session.user_id, pps_is_active_user_flag: req.session.active_user_login }).sort({ _id: -1 }).limit(4);
  console.log(req.session)
  console.log('AllhiredProfeshnoal:=====', AllhiredProfeshnoal);

  if (AllhiredProfeshnoal) {
    for (let key of AllhiredProfeshnoal) {
      //let propertyData = await propertyHelper.getPropertyByID(key.pps_property_id);
      let propertyData = await PropertiesSchema.findOne({ _id: key.pps_property_id });
      // let propertyImageData = await propertyHelper.getPropertyImageByID(propertyData._id);
      // propertyData.property_image = await propertyImageData.pps_property_image_name;
      let customerName = await customerHelper.getCustomerNameByID(key.pps_user_id);
      let customerProfile = await customerHelper.getCustomerImageByID(key.pps_user_id);
      propertyData.customer_name = await customerName
      propertyData.customer_profile = await customerProfile
      propertyArray.push(propertyData)
    }
  } else {
    propertyArray
  }
  let custArray = []
  var userId = [];
  let AllhiredProfeshnoal2 = await propertyProfessinoal.getHiredPropertyProfessional(req.session.user_id, req.session.active_user_login);
  for (let key of AllhiredProfeshnoal2) {
    userId.push(key.pps_user_id);
  }
  console.log("user-Id is :", userId);

  var uniquesCustomer = await userId.unique();

  console.log("uniques user Id is:", uniquesCustomer);
  if (uniquesCustomer) {
    for (let key of uniquesCustomer) {
      let customerData = await CustomerSchema.findOne({ _id: key });
      custArray.push(customerData)
    }
  }
  // }
  console.log("Property Array is", propertyArray)
  console.log("is", custArray)
  console.log('notifData:', notifData)
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  req.session.pagename = "service-provider/dashboard-professional"
  res.render('service-provider/dashboard-professional', {
    err_msg, success_msg, layout: false,
    session: req.session,
    notifData: notifData,
    propertyData: propertyArray,
    custData: custArray

  });

});

Array.prototype.contains = function (v) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] === v) return true;
  }
  return false;
};

Array.prototype.unique = function () {
  var arr = [];
  for (var i = 0; i < this.length; i++) {
    if (!arr.contains(this[i])) {
      arr.push(this[i]);
    }
  }
  return arr;
}




app.get('/signup-professionals-profile-6', async (req, res) => {
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  if (req.query.editid) {
    let data = await signUpHelper.getIndemnityDetailsById(req.query.editid);
    console.log(data)
    res.render('signup-professionals-profile-6', {
      err_msg, success_msg, layout: false,
      session: req.session,
      data: data
    });
  } else {
    res.render('signup-professionals-profile-6', {
      err_msg, success_msg, layout: false,
      session: req.session,
      data: null
    });
  }

});
app.get('/signup-professionals-profile-7', isServiceProvider, async (req, res) => {
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  let data = await signUpHelper.getIndemnityLanguageById(req.session.user_id);
  console.log(data)
  if (data.length != 0) {
    res.render('signup-professionals-profile-7', {
      err_msg, success_msg, layout: false,
      session: req.session,
      data: data
    });
  } else {
    res.render('signup-professionals-profile-7', {
      err_msg, success_msg, layout: false,
      session: req.session,
      data: null
    });
  }
  // res.render('signup-professionals-profile-7', {
  //   err_msg, success_msg, layout: false,
  //   session: req.session
  // });
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
  console.log("Current session for service-provider is :", req.session);
  let data = await trackYourProgress.getAllPropertyByUserId(req.session.user_id, req.session.active_user_login)
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

  const { page = 1, limit = 9 } = req.query;
  console.log('pageQuery:', page);

  let propertyArray = []
  const count = await PropertiesSchema.countDocuments();
  console.log('countcount:', count);
  console.log("req.session.active_user_login", req.session.active_user_login);
  var query  = {
    $or:[{ps_is_active_user_flag: req.session.active_user_login },{ps_other_property_type: req.session.active_user_login }]
  }
  PropertiesSchema.find(query).sort({ _id: -1 }).limit(limit * 1).skip((page - 1) * limit).then(async (data) => {
    if (data) {
      console.log("PropertiesSchema is ", data);
      let arr = [];
      for (let img of data) {
        await PropertiesPictureSchema.find({ pps_property_id: img._id, pps_is_active_user_flag: req.session.active_user_login }).then(async (result) => {
          let temp = await result

          console.log('')
          //for(let image of result){
          //  let temp = await image
          // let customerName = await customerHelper.getCustomerNameByID(img.ps_user_id);
          // let customerProfile = await customerHelper.getCustomerImageByID(img.ps_user_id);
          let userdata = await CustomerSchema.findOne({ _id: img.ps_user_id });
          temp.customer_name = await userdata.cus_fullname;
          temp.customer_profile = await userdata.cus_profile_image_name;
          arr.push(temp)
          // }
          console.log("arr is", arr);
        })
      }
      err_msg = req.flash('err_msg');
      success_msg = req.flash('success_msg');
      res.render('service-provider/property', {
        err_msg, success_msg, layout: false,
        session: req.session,
        propertyData: data,
        propertyImage: arr,
        totalPages: Math.ceil(count / limit),
        currentPage: page
      });
    }
  }).catch((err) => {
    console.log(err)
  })

})

app.get('/service-provider/professionals-to-do-list', isServiceProvider, async function (req, res) {
  console.log("todo")
  req.session.pagename = 'service-provider/professionals-to-do-list';
  let propertyArray = []
  let AllhiredProfeshnoal = await PropertyProfessionalSchema.find({ pps_service_provider_id: req.session.user_id, pps_is_active_user_flag: req.session.active_user_login }).sort({ _id: -1 });
  for (let key of AllhiredProfeshnoal) {
    //let propertyData = await propertyHelper.getPropertyByID(key.pps_property_id);
    // var query = {
    //   $and:[
    //     { _id: { $in:  key.pps_property_id  } },
    //     {
    //       $or:[
    //         {ps_is_active_user_flag:req.session.active_user_login},{ps_other_property_type:req.session.active_user_login}
    //       ]
    //   }
    // ]
    // }
    let propertyData = await PropertiesSchema.findOne().where({ _id: key.pps_property_id });
    // let propertyImageData = await propertyHelper.getPropertyImageByID(propertyData._id);
    // propertyData.property_image = await propertyImageData.pps_property_image_name;
    // let customerName = await customerHelper.getCustomerNameByID(key.pps_user_id);
    // let customerProfile = await customerHelper.getCustomerImageByID(key.pps_user_id);
    // propertyData.customer_name = await customerName
    // propertyData.customer_profile = await customerProfile
    propertyArray.push(propertyData)

  }
  console.log("propertyIdArray", propertyArray);
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  res.render('service-provider/professionals-to-do-list', {
    err_msg, success_msg, layout: false,
    session: req.session,
    propertyObj: propertyArray,
    moment: moment,
    TaskDetailObj: []

  });


});

app.get('/service-provider/myproperties', isServiceProvider, async function (req, res) {
  console.log("", req.session);
  req.session.pagename = 'service-provider/property';
  let propertyArray = []
  const { page = 1, limit = 9 } = req.query;
  console.log('pageQuery:', page);
  let count = 0;
  let propertyId = [];
  let userId = [];

  let AllhiredProfeshnoal = await propertyProfessinoal.getHiredPropertyProfessional(req.session.user_id, req.session.active_user_login);
  for (let key of AllhiredProfeshnoal) {
    propertyId.push(key.pps_property_id);
    userId.push(key.pps_user_id);
  }
  console.log("AllhiredProfeshnoal is ", AllhiredProfeshnoal);
  console.log("propertyId is ", propertyId);
  
  count = await PropertiesSchema.countDocuments({ _id: { $in: propertyId } });
  let propertyData = await propertyHelper.getPropertyByID(propertyId, limit, page,req.session.active_user_login);
  for (let propertyData1 of propertyData) {
    let propertyImageData = await propertyHelper.getPropertyImageByID(propertyData1._id);
    console.log("propertyImageData is", propertyData1);
    //console.log("propertyImageData is ",propertyImageData.pps_property_image_name);
    if (propertyImageData) {
      propertyData1.property_image = await propertyImageData.pps_property_image_name;
    }
    let customerName = await customerHelper.getCustomerNameByID(propertyData1.ps_user_id);
    let customerProfile = await customerHelper.getCustomerImageByID(propertyData1.ps_user_id);
    propertyData1.customer_name = await customerName
    propertyData1.customer_profile = await customerProfile
    propertyArray.push(propertyData1)
  }


  // for (let key of AllhiredProfeshnoal) {
  //    count = await PropertiesSchema.countDocuments({_id:key.pps_property_id});
  //   let propertyData = await propertyHelper.getPropertyByID(key.pps_property_id,limit,page);
  //   let propertyImageData = await propertyHelper.getPropertyImageByID(propertyData._id);
  //   console.log("propertyImageData is", propertyImageData);
  //   //console.log("propertyImageData is ",propertyImageData.pps_property_image_name);
  //   if (propertyImageData) {
  //     propertyData.property_image = await propertyImageData.pps_property_image_name;
  //   }
  //   let customerName = await customerHelper.getCustomerNameByID(key.pps_user_id);
  //   let customerProfile = await customerHelper.getCustomerImageByID(key.pps_user_id);
  //   propertyData.customer_name = await customerName
  //   propertyData.customer_profile = await customerProfile
  //   propertyArray.push(propertyData)

  // }
  //console.log("propertyIdArray", propertyArray);
  console.log("totalPages", Math.ceil(count / limit));
  console.log("currentPage", page);
  console.log("count", count);
  res.render('service-provider/myproperties', {
    err_msg, success_msg, layout: false,
    session: req.session,
    propertyData: propertyArray,
    totalPages: Math.ceil(count / limit),
    currentPage: page

  })
});



app.get('/service-provider/professional-details-docs', isServiceProvider, async function (req, res) {
  console.log("", req.session);

  req.session.pagename = 'service-provider/property';
  var normalDocArray = [];
  var taskDocArray = [];
  var custmorePermisionArray = [];
  //console.log('property id is :', req.session.property_id);
  //req.session.property_id=req.query.id
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  let property = await PropertiesSchema.findOne({
    _id: req.session.property_id
  });
  await CustomerUploadDocsSchema.find({
    cuds_property_id: req.session.property_id
  }).sort({ _id: -1 }).then(async (resp) => {
    for (var key of resp) {
      let temps = await key
      const d = JSON.stringify(temps);
      const DocData = JSON.parse(d)
      await CustomerDocPermission.findOne({ dps_document_id: DocData._id }).then(async (docPermissionResp) => {
        if (docPermissionResp) {

          DocData.permissionData = docPermissionResp

          await DocumentDownloadSchema.find({ dd_document_id: DocData._id }).then(async (docDownloadData) => {
            console.log('Taskkk docDownloadData:',docDownloadData)
              if (docDownloadData) { 
                DocData.docDownloadData = docDownloadData.length;
              }else{
                DocData.docDownloadData =0; 
              }
           });

        } else {
          DocData.permissionData = '';
        }
      })
      normalDocArray.push(DocData);
    }
  });
  //const propertyDataObj = await PropertiesSchema.find();

  console.log('normalDocArray:', normalDocArray);
  let propertyProfeshnoal = await PropertyProfessionalSchema.find({
    $and: [{ pps_service_provider_id: req.session.user_id, pps_property_id: req.session.property_id }]
  });
  //console.log('propertyProfeshnoal', propertyProfeshnoal);
  for (var k of propertyProfeshnoal) {
    var image = await customerHelper.getCustomerImageByID(k.pps_user_id);
    await CustomerSchema.findOne({ _id: k.pps_user_id }).then(async (coustomerdata) => {
      if (coustomerdata) {
        var cust = JSON.stringify(coustomerdata)
        var custs = JSON.parse(cust)
        custs.pps_property_id = k.pps_property_id;
        custs.pps_service_provider_id = k.pps_service_provider_id
        custs.custormer_as = k.pps_is_active_user_flag
        custs.profilePic = image
        let temps = await custs
        custmorePermisionArray.push(temps)
      }
    })
    // console.log('custmorePermisionArray', custmorePermisionArray);
  }


  // for (var k of AllhiredProfeshnoal) {
  //   await ServiceProviderSchema.find({ _id: k.pps_service_provider_id }).then(async (allProfeshnoals) => {
  //     for (let i of allProfeshnoals) {
  //       var object_as_string = JSON.stringify(i);
  //       const t = JSON.parse(object_as_string);
  //       t.pps_property_id = k.pps_property_id;
  //       let temps = await t
  //       temps.pps_user_id = k.pps_user_id;
  //       let tempsData = await temps
  //       serviceProvArray.push(temps)
  //     }
  //   });
  // }
  var sptaskDocArray = []
  var sp_normalDocArray = []
  var all_sp_doc = await propertyHelper.getAllServiceProviderDocument(req.session.user_id, req.session.property_id)
  console.log(all_sp_doc)
  for (var k of all_sp_doc) {
    let tempss = await k
    const dd = JSON.stringify(tempss);
    const datass = JSON.parse(dd)
    if (k.spuds_task_id) {

      await DocumentDownloadSchema.find({ dd_document_id: datass._id }).then(async (docDownloadData) => {
        console.log('Taskkk docDownloadData:',docDownloadData)
          if (docDownloadData) { 
            datass.docDownloadData = docDownloadData.length;
          }else{
            datass.docDownloadData =0; 
          }
       });


      sptaskDocArray.push(datass)
    } else {
      await DocumentDownloadSchema.find({ dd_document_id: datass._id }).then(async (docDownloadData) => {
        console.log('Taskkk docDownloadData:',docDownloadData)
          if (docDownloadData) { 
            datass.docDownloadData = docDownloadData.length;
          }else{
            datass.docDownloadData =0; 
          }
       });
      sp_normalDocArray.push(datass)
    }
  }
  res.render('service-provider/professional-details-docs', {
    err_msg, success_msg, layout: false,
    session: req.session,
    data: custmorePermisionArray,
    allDocument: normalDocArray,//need to show property wise document still showing all uploaded
    service_provider_document: sp_normalDocArray,
    taskDocument: sptaskDocArray,
    property: property,
    moment: moment
  });

});


app.get('/service-provider/property-detail', isServiceProvider, function (req, res) {
  console.log("current session is :", req.session);
  console.log("req.query is :", req.query);
  req.session.pagename = 'service-provider/property';
  PropertiesSchema.find({ _id: req.query.id, ps_is_active_user_flag: req.session.active_user_login }).then(async (data) => {
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


app.get('/service-provider/professionals-detail-message', isServiceProvider, async function (req, res) {
  console.log("current session is :", req.session);
  req.session.pagename = 'service-provider/property';
  var newData = [];
  //console.log(' property id  :', req.session.property_id);
  //console.log('helooooo', req.query.pid);
  req.session.customer_id = req.query.pid;

  let property = await PropertiesSchema.findOne({ _id: req.query.id, ps_is_active_user_flag: req.session.active_user_login });
  console.log(property);
  const { page = 1, limit = 5 } = req.query;

  var QueryData = {
    $or: [
      { $and: [{ sms_sender_id: req.session.user_id }, { sms_receiver_id: req.query.pid }, { sms_property_id: req.query.id }] },
      { $and: [{ sms_sender_id: req.query.pid }, { sms_receiver_id: req.session.user_id }, { sms_property_id: req.query.id }] }
    ]
  };
  const count = await MessageSchema.countDocuments(QueryData);

  await MessageSchema.find(QueryData).sort({ _id: -1 }).limit(limit * 1).skip((page - 1) * limit).then(async (data) => {
    if (data) {
      for (let providerData of data) {
        var today = new Date();
        var date = today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date + ' ' + time;


        var today1 = new Date(providerData.sms_msg_Date);
        var date1 = today1.getFullYear() + '/' + (today1.getMonth() + 1) + '/' + today1.getDate();
        var time1 = today1.getHours() + ":" + today1.getMinutes() + ":" + today1.getSeconds();
        var dateTime1 = date1 + ' ' + time1;

        var msg_time = timeDiffCalc(new Date(dateTime), new Date(dateTime1));

        var object_as_string = JSON.stringify(providerData);
        const t = JSON.parse(object_as_string);
        t.msgTime = msg_time;
        await ServiceProviderSchema.findOne({ _id: t.sms_sender_id }).then(async professional => {
          if (professional) {
            t.senderName = await professional.sps_fullname;
          }
        });
        const s = await t;
        await CustomerSchema.findOne({ _id: s.sms_sender_id }).then(async customer => {
          if (customer) {
            s.senderName = await customer.cus_fullname;
            s.sms_user_profile_img = await customer.cus_profile_image_name;
          }
        });
        const ss = await s;
        newData.push(ss);
      }
    }
  }).catch((err) => {
    console.log(err)
  })
  //console.log('property:', property)
  //console.log('ChatData:', newData)

  console.log('currentPage:', page)
  console.log('totalPages:', Math.ceil(count / limit))


  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  res.render('service-provider/professionals-detail-message', {
    err_msg, success_msg, layout: false,
    session: req.session,
    property: property,
    customer_id: req.query.pid,
    chatData: newData.reverse(),
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    msgcount: count

  });

});


app.get('/service-provider-get-message-property', async (req, res) => {
  var newData = [];
  var newData1 = [];
  const { page = 1, limit = 5 } = req.query;
  var QueryData = {
    $or: [
      { $and: [{ sms_sender_id: req.query.sms_sender_id }, { sms_receiver_id: req.query.sms_receiver_id }, { sms_property_id: req.query.sms_property_id }] },
      { $and: [{ sms_sender_id: req.query.sms_receiver_id }, { sms_receiver_id: req.query.sms_sender_id }, { sms_property_id: req.query.sms_property_id }] }
    ]
  };
  const count = await MessageSchema.countDocuments(QueryData);

  MessageSchema.find(QueryData).sort({ _id: -1 }).limit(limit * 1).skip((page - 1) * limit).then(async (data) => {
    if (data) {
      for (let providerData of data) {
        var today = new Date();
        var date = today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date + ' ' + time;

        var today1 = new Date(providerData.sms_msg_Date);
        var date1 = today1.getFullYear() + '/' + (today1.getMonth() + 1) + '/' + today1.getDate();
        var time1 = today1.getHours() + ":" + today1.getMinutes() + ":" + today1.getSeconds();
        var dateTime1 = date1 + ' ' + time1;

        var msg_time = timeDiffCalc(new Date(dateTime), new Date(dateTime1));

        var object_as_string = JSON.stringify(providerData);
        const t = JSON.parse(object_as_string);
        t.msgTime = msg_time;
        await ServiceProviderSchema.findOne({ _id: t.sms_sender_id }).then(async professional => {
          if (professional) {
            t.senderName = await professional.sps_fullname;
          }

        });
        const s = await t;
        await CustomerSchema.findOne({ _id: s.sms_sender_id }).then(async customer => {
          if (customer) {
            s.senderName = await customer.cus_fullname;
            s.sms_user_profile_img = await customer.cus_profile_image_name;
          }

        });
        const ss = await s;
        newData.push(ss);
      }
      console.log('Count', count);
      console.log('Totalpage', Math.ceil(count / limit));
      console.log('Page', page);
      err_msg = req.flash('err_msg');
      success_msg = req.flash('success_msg');
      res.send({
        err_msg, success_msg, layout: false,
        session: req.session,
        chatData: newData,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        msgcount: count

      });
    }
  }).catch((err) => {
    console.log(err)
  })
});





// app.get('/service-provider/complaints-professional-detail', isServiceProvider, function (req, res) {
//   console.log("current session is :", req.session);
//   req.session.pagename = 'service-provider/complaints-professional-detail';
//   err_msg = req.flash('err_msg');
//   success_msg = req.flash('success_msg');
//   res.render('service-provider/complaints-professional-detail', {
//     err_msg, success_msg, layout: false,
//     session: req.session
//   });
// });


// app.get('/service-provider/professionals-detail-message', isServiceProvider, function (req, res) {
//   //console.log("current session is :", req.session);
//   req.session.pagename = 'service-provider/property';
//   err_msg = req.flash('err_msg');
//   success_msg = req.flash('success_msg');
//   res.render('/service-provider/professionals-detail-message', {
//     err_msg, success_msg, layout: false,
//     session: req.session
//   });
// });

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

app.get('/service-provider/myproperties-detail-phaseA', isServiceProvider, async function (req, res) {
  console.log("current session is :", req.session);
  console.log("request coming from server is", req.query);

  var property_id = req.query.id;
  let propertyData = await PropertiesSchema.findOne({ _id: req.query.id });
  console.log("Property Data is ::", propertyData);
  var user_id = req.session.user_id;
  req.session.property_id = req.query.id
  var phase_name = req.query.phase;
  var taskArray = []
  var taskObject = await TaskHelper.GetTaskByPhaseName(property_id, phase_name, user_id);
  var completedTask = 0;
  var progressResult = 0;
  console.log("task Object lenght is :", taskObject.length);
  if (taskObject.length != 0) {
    for (var k of taskObject) {
      var dd = JSON.stringify(k);
      var ddd = JSON.parse(dd);
      //fetching index 
      var index = k.ppts_assign_to.indexOf(user_id);
      if (k.ppts_task_status[index] == 'completed_by_service_provider') {
        completedTask = completedTask + 1;
      }
      ddd.user_id = user_id
      ddd.index = index
      var datas = await ddd
      taskArray.push(ddd)
    }
    console.log("completedTask is :", completedTask);
    progressResult = Math.round((completedTask / taskObject.length) * 100);
  } else {
    progressResult = 0;
  }
  completedTask = 0;
  console.log("progressResult is ", progressResult);
  console.log("task Object is:", taskArray);
  err_msg = req.flash('err_msg');
  req.session.pagename = 'service-provider/property';
  success_msg = req.flash('success_msg');
  res.render('service-provider/myproperties-detail-phaseA', {
    err_msg, success_msg, layout: false,
    session: req.session,
    propertyData: propertyData,
    step: req.query.step,
    phase: req.query.phase,
    taskObject: taskArray,
    progressResult: progressResult
  });
});

app.get('/service-provider/myproperties-detail-phaseB', isServiceProvider, async function (req, res) {
  console.log("request coming from server is", req.query);
  //Need to  write logic for fetching Task Data from 

  var property_id = req.query.id;
  let propertyData = await PropertiesSchema.findOne({ _id: req.query.id, ps_is_active_user_flag: req.session.active_user_login });
  console.log("Property Data is ::", propertyData);
  var user_id = req.session.user_id;
  req.session.property_id = req.query.id
  var phase_name = req.query.phase;
  var taskArray = []
  var taskObject = await TaskHelper.GetTaskByPhaseName(property_id, phase_name, user_id);
  var completedTask = 0;
  var progressResult = 0;
  console.log("task Object lenght is :", taskObject.length);
  if (taskObject.length != 0) {
    for (var k of taskObject) {
      var dd = JSON.stringify(k);
      var ddd = JSON.parse(dd);
      //fetching index 
      var index = k.ppts_assign_to.indexOf(user_id);
      if (k.ppts_task_status[index] == 'completed_by_service_provider') {
        completedTask = completedTask + 1;
      }
      ddd.user_id = user_id
      ddd.index = index
      var datas = await ddd
      taskArray.push(ddd)
    }
    console.log("completedTask is :", completedTask);
    progressResult = Math.round((completedTask / taskObject.length) * 100);
  } else {
    progressResult = 0;
  }
  completedTask = 0;
  console.log("progressResult is ", progressResult);
  console.log("task Object is:", taskArray);
  err_msg = req.flash('err_msg');
  req.session.pagename = 'service-provider/property';
  success_msg = req.flash('success_msg');
  res.render('service-provider/myproperties-detail-phaseB', {
    err_msg, success_msg, layout: false,
    session: req.session,
    propertyData: propertyData,
    step: req.query.step,
    phase: req.query.phase,
    taskObject: taskArray,
    progressResult: progressResult
  });
});

app.get('/service-provider/myproperties-detail-phaseC', isServiceProvider, async function (req, res) {
  console.log("current session is :", req.session);
  console.log("request coming from server is", req.query);
  //Need to  write logic for fetching Task Data from 

  var property_id = req.query.id;
  let propertyData = await PropertiesSchema.findOne({ _id: req.query.id, ps_is_active_user_flag: req.session.active_user_login });
  console.log("Property Data is ::", propertyData);
  var user_id = req.session.user_id;
  req.session.property_id = req.query.id
  var phase_name = req.query.phase;
  var taskArray = []
  var taskObject = await TaskHelper.GetTaskByPhaseName(property_id, phase_name, user_id);
  var completedTask = 0;
  var progressResult = 0;
  console.log("task Object lenght is :", taskObject.length);
  if (taskObject.length != 0) {
    for (var k of taskObject) {
      var dd = JSON.stringify(k);
      var ddd = JSON.parse(dd);
      //fetching index 
      var index = k.ppts_assign_to.indexOf(user_id);
      if (k.ppts_task_status[index] == 'completed_by_service_provider') {
        completedTask = completedTask + 1;
      }
      ddd.user_id = user_id
      ddd.index = index
      var datas = await ddd
      taskArray.push(ddd)
    }
    console.log("completedTask is :", completedTask);
    progressResult = Math.round((completedTask / taskObject.length) * 100);
  } else {
    progressResult = 0;
  }
  completedTask = 0;
  console.log("progressResult is ", progressResult);
  console.log("task Object is:", taskArray);
  err_msg = req.flash('err_msg');
  req.session.pagename = 'service-provider/property';
  success_msg = req.flash('success_msg');
  res.render('service-provider/myproperties-detail-phaseC', {
    err_msg, success_msg, layout: false,
    session: req.session,
    propertyData: propertyData,
    step: req.query.step,
    phase: req.query.phase,
    taskObject: taskArray,
    progressResult: progressResult
  });
});

app.get('/service-provider/myproperties-detail-phaseD', isServiceProvider, async function (req, res) {
  console.log("current session is :", req.session);
  console.log("request coming from server is", req.query);
  //Need to  write logic for fetching Task Data from 

  var property_id = req.query.id;
  let propertyData = await PropertiesSchema.findOne({ _id: req.query.id, ps_is_active_user_flag: req.session.active_user_login });
  console.log("Property Data is ::", propertyData);
  var user_id = req.session.user_id;
  req.session.property_id = req.query.id
  var phase_name = req.query.phase;
  var taskArray = []
  var taskObject = await TaskHelper.GetTaskByPhaseName(property_id, phase_name, user_id);
  var completedTask = 0;
  var progressResult = 0;
  console.log("task Object lenght is :", taskObject.length);
  if (taskObject.length != 0) {
    for (var k of taskObject) {
      var dd = JSON.stringify(k);
      var ddd = JSON.parse(dd);
      //fetching index 
      var index = k.ppts_assign_to.indexOf(user_id);
      if (k.ppts_task_status[index] == 'completed_by_service_provider') {
        completedTask = completedTask + 1;
      }
      ddd.user_id = user_id
      ddd.index = index
      var datas = await ddd
      taskArray.push(ddd)
    }
    console.log("completedTask is :", completedTask);
    progressResult = Math.round((completedTask / taskObject.length) * 100);
  } else {
    progressResult = 0;
  }
  completedTask = 0;
  console.log("progressResult is ", progressResult);
  console.log("task Object is:", taskArray);
  err_msg = req.flash('err_msg');
  req.session.pagename = 'service-provider/property';
  success_msg = req.flash('success_msg');
  res.render('service-provider/myproperties-detail-phaseD', {
    err_msg, success_msg, layout: false,
    session: req.session,
    propertyData: propertyData,
    step: req.query.step,
    phase: req.query.phase,
    taskObject: taskArray,
    progressResult: progressResult
  });
});

app.get('/service-provider/myproperties-detail-phaseE', isServiceProvider, async function (req, res) {
  console.log("current session is :", req.session);
  console.log("request coming from server is", req.query);
  //Need to  write logic for fetching Task Data from 

  var property_id = req.query.id;
  let propertyData = await PropertiesSchema.findOne({ _id: req.query.id, ps_is_active_user_flag: req.session.active_user_login });
  console.log("Property Data is ::", propertyData);
  var user_id = req.session.user_id;
  req.session.property_id = req.query.id
  var phase_name = req.query.phase;
  var taskArray = []
  var taskObject = await TaskHelper.GetTaskByPhaseName(property_id, phase_name, user_id);
  var completedTask = 0;
  var progressResult = 0;
  console.log("task Object lenght is :", taskObject.length);
  if (taskObject.length != 0) {
    for (var k of taskObject) {
      var dd = JSON.stringify(k);
      var ddd = JSON.parse(dd);
      //fetching index 
      var index = k.ppts_assign_to.indexOf(user_id);
      if (k.ppts_task_status[index] == 'completed_by_service_provider') {
        completedTask = completedTask + 1;
      }
      ddd.user_id = user_id
      ddd.index = index
      var datas = await ddd
      taskArray.push(ddd)
    }
    console.log("completedTask is :", completedTask);
    progressResult = Math.round((completedTask / taskObject.length) * 100);
  } else {
    progressResult = 0;
  }
  completedTask = 0;
  console.log("progressResult is ", progressResult);
  console.log("task Object is:", taskArray);
  err_msg = req.flash('err_msg');
  req.session.pagename = 'service-provider/property';
  success_msg = req.flash('success_msg');
  res.render('service-provider/myproperties-detail-phaseE', {
    err_msg, success_msg, layout: false,
    session: req.session,
    propertyData: propertyData,
    step: req.query.step,
    phase: req.query.phase,
    taskObject: taskArray,
    progressResult: progressResult
  });
});
app.get('/service-provider/myproperties-detail-phaseF', isServiceProvider, async function (req, res) {
  console.log("current session is :", req.session);
  console.log("request coming from server is", req.query);
  var property_id = req.query.id;
  let propertyData = await PropertiesSchema.findOne({ _id: req.query.id, ps_is_active_user_flag: req.session.active_user_login });
  console.log("Property Data is ::", propertyData);
  var user_id = req.session.user_id;
  req.session.property_id = req.query.id
  var phase_name = req.query.phase;
  var taskArray = []
  var taskObject = await TaskHelper.GetTaskByPhaseName(property_id, phase_name, user_id);
  var completedTask = 0;
  var progressResult = 0;
  console.log("task Object lenght is :", taskObject.length);
  if (taskObject.length != 0) {
    for (var k of taskObject) {
      var dd = JSON.stringify(k);
      var ddd = JSON.parse(dd);
      //fetching index 
      var index = k.ppts_assign_to.indexOf(user_id);
      if (k.ppts_task_status[index] == 'completed_by_service_provider') {
        completedTask = completedTask + 1;
      }
      ddd.user_id = user_id
      ddd.index = index
      var datas = await ddd
      taskArray.push(ddd)
    }
    console.log("completedTask is :", completedTask);
    progressResult = Math.round((completedTask / taskObject.length) * 100);
  } else {
    progressResult = 0;
  }
  completedTask = 0;
  console.log("progressResult is ", progressResult);
  console.log("task Object is:", taskArray);
  err_msg = req.flash('err_msg');
  req.session.pagename = 'service-provider/property';
  success_msg = req.flash('success_msg');
  res.render('service-provider/myproperties-detail-phaseF', {
    err_msg, success_msg, layout: false,
    session: req.session,
    propertyData: propertyData,
    step: req.query.step,
    phase: req.query.phase,
    taskObject: taskArray,
    progressResult: progressResult
  });
});

app.get('/service-provider/myproperties-detail-phaseG', isServiceProvider, async function (req, res) {
  console.log("current session is :", req.session);
  console.log("request coming from server is", req.query);
  //Need to  write logic for fetching Task Data from 

  var property_id = req.query.id;
  let propertyData = await PropertiesSchema.findOne({ _id: req.query.id, ps_is_active_user_flag: req.session.active_user_login });
  console.log("Property Data is ::", propertyData);
  var user_id = req.session.user_id;
  req.session.property_id = req.query.id
  var phase_name = req.query.phase;
  var taskArray = []
  var taskObject = await TaskHelper.GetTaskByPhaseName(property_id, phase_name, user_id);
  var completedTask = 0;
  var progressResult = 0;
  console.log("task Object lenght is :", taskObject.length);
  if (taskObject.length != 0) {
    for (var k of taskObject) {
      var dd = JSON.stringify(k);
      var ddd = JSON.parse(dd);
      //fetching index 
      var index = k.ppts_assign_to.indexOf(user_id);
      if (k.ppts_task_status[index] == 'completed_by_service_provider') {
        completedTask = completedTask + 1;
      }
      ddd.user_id = user_id
      ddd.index = index
      var datas = await ddd
      taskArray.push(ddd)
    }
    console.log("completedTask is :", completedTask);
    progressResult = Math.round((completedTask / taskObject.length) * 100);
  } else {
    progressResult = 0;
  }
  completedTask = 0;
  console.log("progressResult is ", progressResult);
  console.log("task Object is:", taskArray);
  err_msg = req.flash('err_msg');
  req.session.pagename = 'service-provider/property';
  success_msg = req.flash('success_msg');
  res.render('service-provider/myproperties-detail-phaseG', {
    err_msg, success_msg, layout: false,
    session: req.session,
    propertyData: propertyData,
    step: req.query.step,
    phase: req.query.phase,
    taskObject: taskArray,
    progressResult: progressResult
  });
});

app.get('/service-provider/myproperties-detail-phaseH', isServiceProvider, async function (req, res) {
  console.log("current session is :", req.session);
  console.log("request coming from server is", req.query);
  //Need to  write logic for fetching Task Data from 

  var property_id = req.query.id;
  let propertyData = await PropertiesSchema.findOne({ _id: req.query.id, ps_is_active_user_flag: req.session.active_user_login });
  console.log("Property Data is ::", propertyData);
  var user_id = req.session.user_id;
  req.session.property_id = req.query.id
  var phase_name = req.query.phase;
  var taskArray = []
  var taskObject = await TaskHelper.GetTaskByPhaseName(property_id, phase_name, user_id);
  var completedTask = 0;
  var progressResult = 0;
  console.log("task Object lenght is :", taskObject.length);
  if (taskObject.length != 0) {
    for (var k of taskObject) {
      var dd = JSON.stringify(k);
      var ddd = JSON.parse(dd);
      //fetching index 
      var index = k.ppts_assign_to.indexOf(user_id);
      if (k.ppts_task_status[index] == 'completed_by_service_provider') {
        completedTask = completedTask + 1;
      }
      ddd.user_id = user_id
      ddd.index = index
      var datas = await ddd
      taskArray.push(ddd)
    }
    console.log("completedTask is :", completedTask);
    progressResult = Math.round((completedTask / taskObject.length) * 100);
  } else {
    progressResult = 0;
  }
  completedTask = 0;
  console.log("progressResult is ", progressResult);
  console.log("task Object is:", taskArray);
  err_msg = req.flash('err_msg');
  req.session.pagename = 'service-provider/property';
  success_msg = req.flash('success_msg');
  res.render('service-provider/myproperties-detail-phaseH', {
    err_msg, success_msg, layout: false,
    session: req.session,
    propertyData: propertyData,
    step: req.query.step,
    phase: req.query.phase,
    taskObject: taskArray,
    progressResult: progressResult
  });
});

app.get('/service-provider/myproperties-detail-phaseO', isServiceProvider, async function (req, res) {
  console.log("current session is :", req.session);
  console.log("request coming from server is", req.query);
  //Need to  write logic for fetching Task Data from 

  var property_id = req.query.id;
  let propertyData = await PropertiesSchema.findOne({ _id: req.query.id, ps_is_active_user_flag: req.session.active_user_login });
  console.log("Property Data is ::", propertyData);
  var user_id = req.session.user_id;
  req.session.property_id = req.query.id
  var phase_name = req.query.phase;
  var taskArray = []
  var taskObject = await TaskHelper.GetTaskByPhaseName(property_id, phase_name, user_id);
  var completedTask = 0;
  var progressResult = 0;
  console.log("task Object lenght is :", taskObject.length);
  if (taskObject.length != 0) {
    for (var k of taskObject) {
      var dd = JSON.stringify(k);
      var ddd = JSON.parse(dd);
      //fetching index 
      var index = k.ppts_assign_to.indexOf(user_id);
      if (k.ppts_task_status[index] == 'completed_by_service_provider') {
        completedTask = completedTask + 1;
      }
      ddd.user_id = user_id
      ddd.index = index
      var datas = await ddd
      taskArray.push(ddd)
    }
    console.log("completedTask is :", completedTask);
    progressResult = Math.round((completedTask / taskObject.length) * 100);
  } else {
    progressResult = 0;
  }
  completedTask = 0;
  console.log("progressResult is ", progressResult);
  console.log("task Object is:", taskArray);
  err_msg = req.flash('err_msg');
  req.session.pagename = 'service-provider/property';
  success_msg = req.flash('success_msg');
  res.render('service-provider/myproperties-detail-phaseO', {
    err_msg, success_msg, layout: false,
    session: req.session,
    propertyData: propertyData,
    step: req.query.step,
    phase: req.query.phase,
    taskObject: taskArray,
    progressResult: progressResult
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
    PropertiesSchema.find({ _id: req.query.id }).then(async (data) => {
      console.log('data=======', data)
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

        let allDocumentUploadByCustmer = await CustomerUploadDocsSchema.find({ cuds_property_id: req.query.id, cuds_is_active_user_flag: req.session.active_user_login });
        //console.log('AllhiredProfeshnoal', AllhiredProfeshnoal);
        let serviceProvArray = [];
        let totalcostArray = [];
        var cost = 0;

        let CustomerDetails = await CustomerSchema.find({ _id: data[0].ps_user_id });
        if (CustomerDetails) {
          //serviceProvArray.push(CustomerDetails)        
          for (let customerDetail of CustomerDetails) {
            await MessageSchema.findOne({
              $or: [
                { $and: [{ sms_sender_id: req.session.user_id }, { sms_receiver_id: customerDetail.id }, { sms_property_id: req.session.property_id }] },
                { $and: [{ sms_sender_id: customerDetail.id }, { sms_receiver_id: req.session.user_id }, { sms_property_id: req.session.property_id }] }
              ]
            }).sort({ _id: -1 }).then(async (msgdata) => {
              console.log('msgdata=', msgdata)
             // if (msgdata !== null) {
                //for (let i of allProfeshnoals) {
                if (msgdata !== null) {
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
              //} else {
              //  console.log('myfff:')
              //}
            })
          }
        }

        console.log('serviceProvArraymyfff:', serviceProvArray);


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
        let TaskDetailObj = await TaskHelper.GetTaskById(req.query.id, req.session.user_id);
        var phase_page_name = '';
        for (var ph of TaskDetailObj) {
          var ServiceProffId = '';
          const PhaseObject = JSON.stringify(ph);
          const to_do_data = JSON.parse(PhaseObject);
          phase_page_name = await getPhase(to_do_data.ppts_phase_flag);
          to_do_data.phase_page_name = phase_page_name
          if (typeof (to_do_data.ppts_assign_to) == 'object') {
            var serviceId = to_do_data.ppts_assign_to.includes(req.session.user_id);
            if (serviceId == true) {
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
        console.log('CustomerDetailsCustomerDetails:',CustomerDetails)
        console.log('serviceProvArrayserviceProvArray:',serviceProvArray)
        res.render('service-provider/myproperties-detail', {
          err_msg, success_msg, layout: false,
          session: req.session,
          propertyDetailData: data,
          propertyImage: arr,
          hiredProfeshnoalList: serviceProvArray,
          allDocumentUploadByCustmer: allDocumentUploadByCustmer,
          TaskDetailObj: todoArray,
          CustomerDetails: CustomerDetails,
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

app.get('/service-provider/myproperties-details-to-dos', isServiceProvider, async (req, res) => {
  req.session.pagename = 'service-provider/property';
  console.log('property id  myproperties-details-to-dos', req.session.property_id, req.session.active_user_login);
  if (req.query.id) {
    let property_id = req.query.id;

    let TaskDetailObj = await PropertiesSchema.findOne({ _id: req.query.id, ps_is_active_user_flag: req.session.active_user_login });;
    if (TaskDetailObj) {
      console.log("TaskDetailObj:", TaskDetailObj)
      err_msg = req.flash('err_msg');
      success_msg = req.flash('success_msg');
      res.render('service-provider/myproperties-details-to-dos', {
        err_msg, success_msg, layout: false,
        session: req.session,
        moment: moment,
        TaskDetailObj: TaskDetailObj

      });
    } else {
      console.log('TaskDetailObj not found')
    }

  } else {
    console.log('error in mydreamhome-details-to-dos get api')
    res.redirect('/service-provider/myproperties')
  }

});


app.post('/get_hired_property_by_id', isServiceProvider, async (req, res) => {
  console.log("Getting request from server ", req.body);
  if (req.body.property_id) {
    let singlePropertyObj = await PropertiesSchema.findOne({ _id: req.body.property_id });
    console.log('singlePropertyObj', singlePropertyObj);
    if (singlePropertyObj) {
      return res.send({
        'status': true,
        'message': 'single property found success',
        'data': singlePropertyObj
      })
    }
  } else {
    return res.send({
      'status': false,
      'message': 'property id not found'
    })
  }
});


function removeDuplicates(originalArray, prop) {
  var newArray = [];
  var lookupObject = {};

  for (var i in originalArray) {
    lookupObject[originalArray[i][prop]] = originalArray[i];
  }

  for (i in lookupObject) {
    newArray.push(lookupObject[i]);
  }
  return newArray;
}


app.get('/service-provider/get-notification', isServiceProvider, async (req, res) => {
  var notificationObj = {
    id: '',
    name: '',
    image: '',
    type: '',
    property_id: '',
    reciver_id: '',
    sender_id: '',
  }
  console.log('dddaaa:', req.query)
  var notifData = [];
  await NotificationSchema.find({ ns_receiver: req.query.ns_receiver, ns_receiver_type: req.query.ns_receiver_type, ns_read_status: req.query.ns_read_status }).then(async (notificationResults) => {
    console.log('notificationL:', notificationResults)
    if (notificationResults) {
      for (let notifResult of notificationResults) {
        if (notifResult.ns_sender_type == 'customer') {
          await CustomerSchema.findOne({ _id: notifResult.ns_sender }).then(async (cusResult) => {
            notificationObj = {
              id: cusResult._id,
              name: cusResult.cus_fullname,
              image: cusResult.cus_profile_image_name,
              type: 'message',
              property_id: notifResult.ns_property_id,
              reciver_id: notifResult.ns_receiver,
              sender_id: notifResult.ns_sender,
            }
            notifData.push(notificationObj)
          })
        }
      }
    }
  });
  uniqueArray = removeDuplicates(notifData, "id");
  console.log('autoLoadnotifData:', uniqueArray)
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  res.send({
    err_msg, success_msg,
    layout: false,
    session: req.session,
    notifData: uniqueArray
  });

});



app.get('/service-provider/proposal', isServiceProvider, async (req, res) => {
  console.log("Current session is :", req.session);
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  req.session.pagename = 'service-provider/proposal';

  //Current active proposal 
  var activeProposal = await SubmitProposalSchema.find({ sps_service_provider_id: req.session.user_id, sps_status: 'pending' });
  var activePropertyProposalArray = [];
  for (var propertyId of activeProposal) {
    console.log("property Id", propertyId);
    let propertyObj = await PropertiesSchema.findOne({ _id: propertyId.sps_property_id, ps_is_active_user_flag: req.session.active_user_login });;
    let customer = await CustomerSchema.findOne({ _id: propertyId.sps_customer_id });
    if (customer) {
      propertyObj.cs_name = customer.cus_fullname;
      propertyObj.cus_profile_image_name = customer.cus_profile_image_name;
    }
    if (propertyId.sps_extra_notes) {
      propertyObj.notes = await propertyId.sps_extra_notes;
    }
    if (propertyId.sps_filename) {
      propertyObj.filename = await propertyId.sps_filename;
    }
    propertyObj.proposalId = await propertyId._id;
    activePropertyProposalArray.push(propertyObj);
  }
  console.log("activePropertyProposalArray is :", activePropertyProposalArray);


  //Submitted Proposal For Professional
  var submitPropertyProposalArray = [];
  var submitProposal = await SubmitProposalSchema.find({ sps_service_provider_id: req.session.user_id, sps_status: 'accept' });
  for (var propertyId of submitProposal) {
    console.log("property Id", propertyId);
    let propertyObj = await PropertiesSchema.findOne({ _id: propertyId.sps_property_id, ps_is_active_user_flag: req.session.active_user_login });
    let customer = await CustomerSchema.findOne({ _id: propertyId.sps_customer_id });
    if (customer) {
      propertyObj.cs_name = customer.cus_fullname;
      propertyObj.cus_profile_image_name = customer.cus_profile_image_name;
    }
    if (propertyId.sps_extra_notes) {
      propertyObj.notes = await propertyId.sps_extra_notes;
    }
    if (propertyId.sps_filename) {
      propertyObj.filename = await propertyId.sps_filename;
    }
    propertyObj.proposalId = await propertyId._id;
    submitPropertyProposalArray.push(propertyObj);
  }
  console.log("submitPropertyProposalArray is :", submitPropertyProposalArray);



  //fetching Reject Proposal 
  var rejectPropertyProposalArray = [];
  var rejectProposal = await SubmitProposalSchema.find({ sps_service_provider_id: req.session.user_id, sps_status: 'reject' });
  for (var propertyId of rejectProposal) {
    console.log("property Id", propertyId);
    let propertyObj = await PropertiesSchema.findOne({ _id: propertyId.sps_property_id, ps_is_active_user_flag: req.session.active_user_login });

    let customer = await CustomerSchema.findOne({ _id: propertyId.sps_customer_id });
    if (customer) {
      propertyObj.cs_name = customer.cus_fullname;
      propertyObj.cus_profile_image_name = customer.cus_profile_image_name;
      //propertyObj.sp_profession = customer.sps_role_name;
    }
    if (propertyId.sps_extra_notes) {
      propertyObj.notes = await propertyId.sps_extra_notes;
    }
    if (propertyId.sps_filename) {
      propertyObj.filename = await propertyId.sps_filename;
    } propertyObj.proposalId = await propertyId._id;
    rejectPropertyProposalArray.push(propertyObj);
  }
  console.log("rejectPropertyProposalArray is :", rejectPropertyProposalArray);


  res.render('service-provider/proposal', {
    err_msg, success_msg, layout: false,
    session: req.session,
    activePropertyProposalArray: activePropertyProposalArray,
    rejectPropertyProposalArray: rejectPropertyProposalArray,
    submitPropertyProposalArray: submitPropertyProposalArray,

  });
})

app.get('/service-provider/proposal-details', isCustomer, async (req, res) => {
  console.log("Current query is :", req.query);
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  req.session.pagename = 'service-provider/proposal';
  var proposalDetails = [];
  var activeProposal = await SubmitProposalSchema.find({ _id: req.query.id });
  console.log("activeProposal is ", activeProposal);
  if (activeProposal) {
    for (var propertyId of activeProposal) {
      console.log("property Id", propertyId);
      // let propertyObj = await propertyHelper.getPropertyByID(propertyId.sps_property_id);
      let propertyObj = await PropertiesSchema.findOne({ _id: propertyId.sps_property_id, ps_is_active_user_flag: req.session.active_user_login });
      let customer = await CustomerSchema.findOne({ _id: propertyId.sps_customer_id });
      // var totalProposal = await SubmitProposalSchema.find({ sps: propertyId.sps_service_provider_id });

      // if (totalProposal) {
      //   propertyObj.total_proposal = await totalProposal.length;
      // }
      if (customer) {
        propertyObj.cs_name = await customer.cus_fullname;
        // propertyObj.cs_profession = await customer.sps_role_name;
        propertyObj.cs_state = await customer.cus_state;
        propertyObj.cs_country = await customer.cus_country_id;
        propertyObj.cs_city = await customer.cus_city;
        propertyObj.cs_joining_date = await customer.cus_created_at;
      }
      propertyObj.proposal_filename = await propertyId.sps_filename;
      propertyObj.sps_payment_mode = await propertyId.sps_payment_mode;
      propertyObj.sps_extra_notes = await propertyId.sps_extra_notes;
      propertyObj.sps_status = await propertyId.sps_status;
      propertyObj.sps_start_date = await propertyId.sps_start_date;
      propertyObj.sps_end_date = await propertyId.sps_end_date;
      propertyObj.proposalId = await propertyId._id;
      proposalDetails.push(propertyObj);
    }
  }
  console.log("active Proposal is:", proposalDetails);
  res.render('service-provider/proposal-details', {
    err_msg, success_msg, layout: false,
    session: req.session,
    proposalDetails: proposalDetails,
  });
})

app.post('/sp-change-proposal-status', isServiceProvider, async (req, res) => {
  console.log("Request comming for change status", req.body);
  let proposalId = req.body.proposalId;
  SubmitProposalSchema.updateOne({ '_id': proposalId }, { $set: { sps_status: req.body.proposalStatus } }, { upsert: true }, function (err) {
    if (err) {
      res.send({ status: false, message: 'Something going wrong please check again !!' })
    } else {
      res.send({ status: true, message: 'Your proposal update successfully !!' })
    }
  });
});



app.get('/buyer', isCustomer, function (req, res) {
  console.log("buyer");
  var test = req.session.is_user_logged_in;
  var active_user = req.session.active_user_login;
  if (test == true && active_user != 'buyer') {
    req.session.active_user_login = "buyer"
    //req.session.isChanged();
    res.redirect('/dashboard-professional')
    console.log("current user login and session is", req.session);
  }

});


app.get('/seller', isCustomer, function (req, res) {
  console.log("seller");
  var test = req.session.is_user_logged_in;
  var active_user = req.session.active_user_login;
  if (test == true && active_user != 'seller') {
    req.session.active_user_login = "seller"
    //req.session.isChanged();
    res.redirect('/dashboard-professional')
    console.log("current user login and session is", req.session);
  }
});


app.get('/renovator', isCustomer, function (req, res) {
  console.log("renovator");
  var test = req.session.is_user_logged_in;
  var active_user = req.session.active_user_login;
  if (test == true && active_user != 'renovator') {
    req.session.active_user_login = "renovator"
    //req.session.isChanged();
    res.redirect('service-provider/dashboard-professional')
    console.log("current user login and session", req.session);
  }
});




app.get('/service-provider/customer-by-property', isServiceProvider, async function (req, res) {
  console.log("", req.session);
  req.session.pagename = 'service-provider/property';
  let propertyData = await PropertiesSchema.findOne({ _id: req.query.property_id })
  if (propertyData) {
    let userdata = await CustomerSchema.find({ _id: propertyData.ps_user_id })
    if (userdata) {
      res.send({
        err_msg, success_msg,
        layout: false,
        session: req.session,
        userdata: userdata
      })
    } else {
      res.send({
        err_msg, success_msg,
        layout: false,
        session: req.session,
        userdata: ''
      })
    }
  } else {

    res.send({
      err_msg, success_msg,
      layout: false,
      session: req.session,
      userdata: ''
    })

  }
});


app.get('/service-provider/complaints-professional', isServiceProvider, function (req, res) {
  console.log("current session is :", req.session);
  req.session.pagename = 'service-provider/complaints-professional';
  ComplaintsSchema.find({ coms_user_id: req.session.user_id, coms_is_active_user_flag: req.session.active_user_login }).sort({ _id: -1 }).then(async (data) => {
    console.log('dataaa:', data)
    if (data) {
      let arr = [];
      err_msg = req.flash('err_msg');
      success_msg = req.flash('success_msg');
      res.render('service-provider/complaints-professional', {
        err_msg, success_msg, layout: false,
        session: req.session,
        complaintData: data
      });
    }
  }).catch((err) => {
    console.log(err)
  })
});


app.get('/service-provider/complaints-professional-detail', isServiceProvider, async function (req, res) {
  console.log("current session is :", req.session);
  req.session.pagename = 'service-provider/complaints-professional';
  console.log('req.query.complaintID:', req.query.complaintID)

  let complaintData = await ComplaintsSchema.find({ coms_complaint_code: req.query.complaintID });
  console.log('testDataCom:', complaintData)
  await ComplaintDetailsSchema.find({ comsd_id: req.query.complaintID }).sort({ _id: -1 }).then(async (data) => {
    req.session.complaintID = req.query.complaintID;
    console.log('dataaa:', data)
    if (data) {
      let arr = [];
      err_msg = req.flash('err_msg');
      success_msg = req.flash('success_msg');
      res.render('service-provider/complaints-professional-detail', {
        err_msg, success_msg, layout: false,
        session: req.session,
        complaintDetailsData: data,
        complaintData: complaintData
      });
    }
  }).catch((err) => {
    console.log(err)
  })
});


app.get('/service-provider/property-related-enquiry-proprty-list', isServiceProvider, async (req, res) => {
  req.session.pagename = 'mydreamhome';
  console.log("current session is", req.session);
  console.log("req.session.user_id", req.session.user_id);
  console.log(" req.session.active_user_login:", req.session.active_user_login);


  let propertyArray = []
  let propertyId = [];
  let AllhiredProfeshnoal = await propertyProfessinoal.getHiredPropertyProfessional(req.session.user_id, req.session.active_user_login);
  for (let key of AllhiredProfeshnoal) {
    propertyId.push(key.pps_property_id);
  }
  let data = await PropertiesSchema.find({ _id: { $in: propertyId } })
  if (data) {
    res.send({
      err_msg, success_msg, layout: false,
      session: req.session,
      propertyData: data
    });
  } else {
    console.log(err)
  }
})


app.get('/service-provider/professional-customer-by-property', async (req, res) => {
  let serviceProvArray = [];
  console.log('propertyidid:', req.query.property_id);
  let data = await PropertiesSchema.findOne({ _id: req.query.property_id })
  if (data) {
    console.log('data:', data)
    await CustomerSchema.find({ _id: data.ps_user_id }).then(async (cusResult) => {
      if (cusResult) {
        res.send({
          session: req.session,
          cusResultData: cusResult
        });
      } else {
        console.log(err)
      }
    })
  } else {
    console.log(err)
  }


});

// All Professional Filter name surname qualification
app.get('/service-provider/professional-global-search', isServiceProvider, async (req, res) => {
  req.session.pagename = 'service-provider/property';
  const { page = 1, limit = 9 } = req.query;
  console.log('pageQuery:', page);

  let propertyArray = []
  const count = await PropertiesSchema.countDocuments();
  console.log('countcount:', count);
  console.log("req.session.active_user_login", req.session.active_user_login);
  PropertiesSchema.find({ ps_property_name: new RegExp(req.query.global_search, 'i') }).sort({ _id: -1 }).limit(limit * 1).skip((page - 1) * limit).then(async (data) => {
    if (data) {
      console.log("PropertiesSchema is ", data);
      let arr = [];
      for (let img of data) {
        await PropertiesPictureSchema.find({ pps_property_id: img._id, pps_is_active_user_flag: req.session.active_user_login }).then(async (result) => {
          let temp = await result

          console.log('')
          //for(let image of result){
          //  let temp = await image
          // let customerName = await customerHelper.getCustomerNameByID(img.ps_user_id);
          // let customerProfile = await customerHelper.getCustomerImageByID(img.ps_user_id);
          let userdata = await CustomerSchema.findOne({ _id: img.ps_user_id });
          temp.customer_name = await userdata.cus_fullname;
          temp.customer_profile = await userdata.cus_profile_image_name;
          arr.push(temp)
          // }
          console.log("arr is", arr);
        })
      }
      err_msg = req.flash('err_msg');
      success_msg = req.flash('success_msg');
      res.render('service-provider/professional-global-search', {
        err_msg, success_msg, layout: false,
        session: req.session,
        propertyData: data,
        propertyImage: arr,
        totalPages: Math.ceil(count / limit),
        currentPage: page
      });
    }
  }).catch((err) => {
    console.log(err)
  })


});

module.exports = app;

