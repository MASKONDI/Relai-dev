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
var trackYourProgress= require('./api/service_provider_helper/trackYourProgress')

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
  console.log('data=======',data)
  //console.log("current session is :", req.session);
  req.session.pagename = 'service-provider/track-your-progress-professionals';
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  res.render('service-provider/track-your-progress-professionals', {
    err_msg, success_msg, layout: false,
    session: req.session,
    propertyData:data
  });
});
app.get('/service-provider/property', isServiceProvider, function (req, res) {
  console.log("current session is :", req.session);
  req.session.pagename = 'service-provider/property';
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  res.render('service-provider/property', {
    err_msg, success_msg, layout: false,
    session: req.session
  });
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

