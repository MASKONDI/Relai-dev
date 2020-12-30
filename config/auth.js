var mongoose = require('mongoose');
var nodemailer = require('nodemailer');
const session = require('express-session');
var { Registration } = require('../model/user_model');
var { TenderFor, CountryData, StateData, CityData } = require('../model/tender_model');


var isAdmin = function (req, res, next) {

  var check_user = req.session.admin_main_id;
  if (check_user == undefined && check_user == null && check_user == "") {

    res.redirect('/admin-login');
  }
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  next();

}

var isUser = function (req, res, next) {
  var check_user = req.session.is_user_logged_in;
  var check_user_id = req.session.re_us_id;
  if (check_user != undefined && check_user != "" && check_user == true && check_user_id != "") {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
  } else {
    req.flash('danger', 'Please log in first.');
    res.redirect('/login');
  }
}

var isDeveloper = function (req, res, next) {
  var check_user_type = req.session.user_type;

  if (check_user_type == '5d306e3776b9b17261b0d544') {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
  } else {
    req.flash('danger', 'Please log in first.');
    res.redirect('/not-available');
  }
}

var isAva = function (req, res, next) {
  var check_user_type = req.session.user_type;

  if (check_user_type == '5d306e947d7a22e731d4a143') {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
  } else {
    req.flash('danger', 'Please log in first.');
    res.redirect('/not-available');
  }
}



var isContractor = function (req, res, next) {
  var check_user_type = req.session.user_type;
  console.log(check_user_type);

  if (check_user_type == '5d3074807d7a22e731d4a14b') {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
  } else {
    req.flash('danger', 'Please log in first.');
    res.redirect('/not-available');
  }
}



// exports.transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: 'questtestmail@gmail.com',
//     pass: 'test123R',

//   }
// });

module.exports = {

  isUser: isUser,
  isAdmin: isAdmin,
  isDeveloper: isDeveloper,
  isContractor: isContractor,
  isAva: isAva

}


