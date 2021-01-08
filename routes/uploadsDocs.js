const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const path = require('path');
const ejs = require('ejs');
const app = express();

var fs = require('fs');
var multer = require('multer');
const ServiceProviderPortfolioSchema = require("../models/service_provider_portfolio");

const CustomerKycSchema = require("../models/customer_kyc");

const PropertiesPictureSchema = require("../models/properties_picture");

const PropertiesPlanPictureSchema = require("../models/properties_plan_picture");


//** Upload Document Start */

var Storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./public/upload");
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  }
});
var maxSize = 1000000 * 1000;
var upload = multer({
  storage: Storage,
  limits: {
    fileSize: maxSize
  }
});



// Retriving the image
// app.get('/upload', (req, res) => {
//   ServiceProviderPortfolioSchema.find({}, (err, items) => {
//     if (err) {
//       console.log(err);
//     }
//     else {
//       res.render('app', { items: items });
//     }
//   });
// });

// Uploading the image
app.post('/upload', upload.single('portfolio-docs'), (req, res, next) => {
  var err_msg = null;
  var success_msg = null;
  console.log("req is :", req.file);

  var obj = {
    spps_filename: req.file.filename,
    //spps_type: req.file.fieldname,
    spps_file: {
      data: fs.readFileSync(path.join(__dirname + '../../public/upload/' + req.file.filename)),
      contentType: 'image/png'
    }
  }

  ServiceProviderPortfolioSchema.create(obj, (err, item) => {
    if (err) {
      console.log(err);
      req.flash('err_msg', "Something went worng please try aftersome time");
    }
    else {
      item.save();
      console.log("file Submitted Successfully");
      req.flash('success_msg', "file Uploaded Successfully");
      res.redirect('/portfolio');
    }
  });
});




// Uploading the image
app.post('/upload-kyc-docs', upload.single('kyc-docs'), (req, res, next) => {
  var err_msg = null;
  var success_msg = null;
  console.log("req is :", req.file);

  var obj = {
    cks_document_name: req.file.filename,
    cks_document_file: {
      data: fs.readFileSync(path.join(__dirname + '../../public/upload/' + req.file.filename)),
      contentType: 'image/png'
    }
  }

  CustomerKycSchema.create(obj, (err, item) => {
    if (err) {
      console.log(err);
      req.flash('err_msg', "Something went worng please try after some time");
    }
    else {
      item.save();
      console.log("file Submitted Successfully");
      req.flash('success_msg', "file Uploaded Successfully");
      res.redirect('/kyc-professional');
    }
  });
});

// Uploading the image
app.post('/upload-properties-pic', upload.single('properties-pic'), (req, res, next) => {
  var err_msg = null;
  var success_msg = null;
  console.log("req is :", req.file);

  var obj = {
    pps_property_image_name: req.file.filename,
    pps_property_image: {
      data: fs.readFileSync(path.join(__dirname + '../../public/upload/' + req.file.filename)),
      contentType: 'image/png'
    }
  }

  PropertiesPictureSchema.create(obj, (err, item) => {
    if (err) {
      console.log(err);
      req.flash('err_msg', "Something went worng please try after some time");
      res.redirect('/add-property');
    }
    else {
      item.save();
      console.log("file Submitted Successfully");
      req.flash('success_msg', "file Uploaded Successfully");
      res.redirect('/add-property');
    }
  });
});

// Uploading the image
app.post('/upload-properties-plan-pic', upload.single('properties-plan-pic'), (req, res, next) => {
  var err_msg = null;
  var success_msg = null;
  console.log("req is :", req.file);

  var obj = {
    ppps_plan_image_name: req.file.filename,
    ppps_plan_image: {
      data: fs.readFileSync(path.join(__dirname + '../../public/upload/' + req.file.filename)),
      contentType: 'image/png'
    }
  }

  PropertiesPlanPictureSchema.create(obj, (err, item) => {
    if (err) {
      console.log(err);
      req.flash('err_msg', "Something went worng please try after some time");
      res.redirect('/add-property');
    }
    else {
      item.save();
      console.log("file Submitted Successfully");
      req.flash('success_msg', "file Uploaded Successfully");
      res.redirect('/add-property');
    }
  });
});


module.exports = app;