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

app.get('/otp-professional', function (req, res) {
  console.log("");

  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  res.render('otp-professional', {
    err_msg, success_msg, layout: false,
    session: req.session
  });
});
app.get('/track-your-progress-professionals', function (req, res) {
  console.log("");

  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  res.render('track-your-progress-professionals', {
    err_msg, success_msg, layout: false,
    session: req.session
  });
});
app.get('/property', function (req, res) {
  console.log("");

  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  res.render('property', {
    err_msg, success_msg, layout: false,
    session: req.session
  });
});
app.get('/professionals-to-do-list', function (req, res) {
  console.log("");

  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  res.render('professionals-to-do-list', {
    err_msg, success_msg, layout: false,
    session: req.session
  });
});

app.get('/myproperties', function (req, res) {
  console.log("");

  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  res.render('myproperties', {
    err_msg, success_msg, layout: false,
    session: req.session
  });
});

app.get('/property-detail', function (req, res) {
  console.log("");
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  res.render('property-detail', {
    err_msg, success_msg, layout: false,
    session: req.session
  });
});


app.get('/professionals-detail-message', function (req, res) {
  console.log("");
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  res.render('professionals-detail-message', {
    err_msg, success_msg, layout: false,
    session: req.session
  });
});

app.get('/professionals-detail-message', function (req, res) {
  console.log("");
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  res.render('professionals-detail-message', {
    err_msg, success_msg, layout: false,
    session: req.session
  });
});


app.get('/property-detail-submit-proposal', function (req, res) {
  console.log("");
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  res.render('property-detail-submit-proposal', {
    err_msg, success_msg, layout: false,
    session: req.session
  });
});

module.exports = app;

