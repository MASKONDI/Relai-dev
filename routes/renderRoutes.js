const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const path = require('path');
const ejs = require('ejs');
const app = express();


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
app.get('/signup-service-provider', (req, res) => {
  res.render('signup-service-provider');
});
app.get('/signup-professionals-profile', (req, res) => {
  res.render('signup-professionals-profile');
});
app.get('/signup-professionals-profile-2', (req, res) => {
  res.render('signup-professionals-profile-2');
});
app.get('/signup-professionals-profile-3', (req, res) => {
  res.render('signup-professionals-profile-3');
});
app.get('/signup-professionals-profile-4', (req, res) => {
  res.render('signup-professionals-profile-4');
});
app.get('/signup-professionals-profile-5', (req, res) => {
  res.render('signup-professionals-profile-5');
});
app.get('/signup-professionals-profile-6', (req, res) => {
  res.render('signup-professionals-profile-6');
});
app.get('/signup-professionals-profile-7', (req, res) => {
  res.render('signup-professionals-profile-7');
});
app.get('/portfolio', (req, res) => {
  res.render('portfolio');
});
app.get('/signup', (req, res) => {
  res.render('signup');
});
app.get('/signin', (req, res) => {
  res.render('signin');
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



app.get('/index', (req, res) => res.render('index'));


module.exports = app;
