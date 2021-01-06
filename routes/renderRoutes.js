const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const path = require('path');
const ejs = require('ejs');
const app = express();

//***Index or home page related routes */
app.get('/buy-sell', (req, res) => {
  res.render('buy-sell');
});
app.get('/renovate', (req, res) => {
  res.render('renovate');
});
app.get('/how-it-works', (req, res) => {
  res.render('how-it-works');
});
app.get('/support', (req, res) => {
  res.render('support');
});
app.get('/community', (req, res) => {
  res.render('community');
});
app.get('/about-us', (req, res) => {
  res.render('about-us');
});
app.get('/contact-us', (req, res) => {
  res.render('contact-us');
});
app.get('/faq', (req, res) => {
  res.render('faq');
});
app.get('/privacy-policy', (req, res) => {
  res.render('privacy-policy');
});
app.get('/cookie-policy', (req, res) => {
  res.render('cookie-policy');
});
app.get('/termandconditions', (req, res) => {
  res.render('termandconditions');
});
app.get('/team', (req, res) => {
  res.render('team');
});
app.get('/intro', (req, res) => {
  res.render('intro');
});



//** customer Signup ***********8 */
app.get("/signup", (req, res) => {

  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  res.render('signup', { err_msg, success_msg });
})
app.get('/signin', (req, res) => {
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  res.render('signin', { err_msg, success_msg });
});

app.get('/dashboard', (req, res) => {
  res.render('dashboard');
});
app.get('/track-your-progress', (req, res) => {
  res.render('track-your-progress');
});
app.get('/professionals', (req, res) => {
  res.render('professionals');
});
app.get('/mydreamhome-details', (req, res) => {
  res.render('mydreamhome-details');
});
app.get('/mydreamhome-details-to-dos', (req, res) => {
  res.render('mydreamhome-details-to-dos');
});
app.get('/add-property', (req, res) => {
  res.render('add-property');
});

//*******Service Provider and signup and profiles routes */
app.get('/signup-service-provider', (req, res) => {
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  res.render('signup-service-provider', { err_msg, success_msg });
});

app.get('/signin-professional', (req, res) => {
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  res.render('signin-professional', { err_msg, success_msg });
});



app.get('/signup-professionals-profile', (req, res) => {
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  res.render('signup-professionals-profile', { err_msg, success_msg });
});
app.get('/signup-professionals-profile-2', (req, res) => {
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  res.render('signup-professionals-profile-2', { err_msg, success_msg });
});
app.get('/signup-professionals-profile-3', (req, res) => {
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  res.render('signup-professionals-profile-3', { err_msg, success_msg });
});
app.get('/signup-professionals-profile-4', (req, res) => {
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  res.render('signup-professionals-profile-4', { err_msg, success_msg });
});
app.get('/signup-professionals-profile-5', (req, res) => {
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  res.render('signup-professionals-profile-5', { err_msg, success_msg });
});
app.get('/signup-professionals-profile-6', (req, res) => {
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  res.render('signup-professionals-profile-6', { err_msg, success_msg });
});
app.get('/signup-professionals-profile-7', (req, res) => {
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  res.render('signup-professionals-profile-7', { err_msg, success_msg });
});
app.get('/portfolio', (req, res) => {
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  res.render('portfolio', { err_msg, success_msg });
});



app.get('/index', (req, res) => res.render('index'));


module.exports = app;
