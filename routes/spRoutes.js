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
const PropertiesPictureSchema = require("../models/properties_picture");
//const PropertiesPlanPictureSchema = require("../models/properties_plan_picture");
const PropertiesSchema = require("../models/properties");
const PropertyProfessionalSchema = require("../models/property_professional_Schema");

app.get('/service-provider/dashboard-professional', isServiceProvider, (req, res) => {
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  req.session.pagename = "service-provider/dashboard-professional"
  res.render('service-provider/dashboard-professional', {
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
  console.log('data=======', data)
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

app.get('/service-provider/property', isServiceProvider, async function (req, res) {
  console.log("current session is  from sp end:", req.session);
  req.session.pagename = 'service-provider/property';


  let AllhiredProfeshnoal = await PropertyProfessionalSchema.find({ pps_service_provider_id: req.session.user_id });

  console.log("professional hired on particuler list", AllhiredProfeshnoal);

  var propertyIdArray = [];
  var customerIdArray = [];
  var propertyData = [];
  var propertyImageData = [];

  for (let hiredProff of AllhiredProfeshnoal) {
    propertyIdArray.push(hiredProff.pps_property_id);
    customerIdArray.push(hiredProff.pps_user_id);
    //Need to fetch customer data

    await PropertiesSchema.find({
      _id: hiredProff.pps_property_id
    }).sort({ _id: -1 }).then(async (data) => {
      if (data) {
        //console.log("property Data is", data);
        let arr = [];
        await propertyData.push(data);
        console.log("property Data is", propertyData);
        for (let img of data) {
          await PropertiesPictureSchema.find({ pps_property_id: img._id }).then(async (result) => {

            let temp = await result
            //for(let image of result){
            //  let temp = await image
            arr.push(temp)
            // }
          })

        }

        await propertyImageData.push(arr);
        // console.log('++++++++',arr)
      }
      err_msg = req.flash('err_msg');
      success_msg = req.flash('success_msg');



    }).catch((err) => {
      console.log(err)
    })
  }
  console.log("Property Data is :", propertyData[0]);
  console.log();
  console.log();
  console.log();

  console.log("propertyImageData is :", propertyImageData[0]);

  res.render('service-provider/property', {
    err_msg, success_msg, layout: false,
    session: req.session,
    propertyData: propertyData,
    propertyImage: propertyImageData
  })

});
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

app.get('/service-provider/myproperties', isServiceProvider, function (req, res) {
  console.log("", req.session);
  req.session.pagename = 'service-provider/property';
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  res.render('service-provider/myproperties', {
    err_msg, success_msg, layout: false,
    session: req.session
  });
});

app.get('/service-provider/myproperties-detail', isServiceProvider, async function (req, res) {


  console.log("", req.session);
  //console.log('data===========',data)
  req.session.pagename = 'service-provider/property';
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  res.render('service-provider/myproperties-detail', {
    err_msg, success_msg, layout: false,
    session: req.session
  });
});

app.get('/service-provider/property-detail', isServiceProvider, function (req, res) {
  console.log("current session is :", req.session);
  req.session.pagename = 'service-provider/property';
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  res.render('service-provider/property-detail', {
    err_msg, success_msg, layout: false,
    session: req.session
  });
});


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
  err_msg = req.flash('err_msg');
  req.session.pagename = 'service-provider/property';
  success_msg = req.flash('success_msg');
  res.render('service-provider/property-detail-submit-proposal', {
    err_msg, success_msg, layout: false,
    session: req.session
  });
});
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



module.exports = app;

