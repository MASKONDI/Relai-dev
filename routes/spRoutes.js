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

module.exports = app;

