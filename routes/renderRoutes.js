const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const path = require('path');
const ejs = require('ejs');
const app = express();
var fs = require('fs');
var auth = require('../config/auth');
var multer = require('multer');
const ServiceProviderPortfolioSchema = require("../models/service_provider_portfolio");

var isCustomer = auth.isCustomer;

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
  res.render('signup', {
    err_msg, success_msg, layout: false,
    session: req.session
  });
})



app.get('/signin', (req, res) => {
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  var test = req.session.is_user_logged_in;
  console.log("test is :", req.session.is_user_logged_in);
  if (test == true) {
    res.redirect('/dashboard');
  } else {
    res.render('signin', {
      err_msg, success_msg, layout: false,
      session: req.session
    });
  }
});




app.get('/dashboard', isCustomer, (req, res) => {
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  res.render('dashboard', {
    err_msg, success_msg, layout: false,
    session: req.session
  });
});
app.get('/track-your-progress', isCustomer, (req, res) => {
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  res.render('track-your-progress', {
    err_msg, success_msg, layout: false,
    session: req.session
  });
});
app.get('/professionals', isCustomer, (req, res) => {
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  res.render('professionals', {
    err_msg, success_msg, layout: false,
    session: req.session
  });
});
app.get('/professionals-detail', isCustomer, (req, res) => {
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  res.render('professionals-detail', {
    err_msg, success_msg, layout: false,
    session: req.session
  });
});

app.get('/mydreamhome-details', isCustomer, (req, res) => {
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  res.render('mydreamhome-details', {
    err_msg, success_msg, layout: false,
    session: req.session
  });
});
app.get('/mydreamhome-details-docs', isCustomer, (req, res) => {
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  res.render('mydreamhome-details-docs', {
    err_msg, success_msg, layout: false,
    session: req.session
  });
});
app.get('/mydreamhome-details-to-dos', isCustomer, (req, res) => {
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  res.render('mydreamhome-details-to-dos', {
    err_msg, success_msg, layout: false,
    session: req.session
  });
});
app.get('/add-property', isCustomer, (req, res) => {
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  res.render('add-property', {
    err_msg, success_msg, layout: false,
    session: req.session
  });
});
app.get('/mydreamhome-details-message', isCustomer, (req, res) => {
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  res.render('mydreamhome-details-message', {
    err_msg, success_msg, layout: false,
    session: req.session
  });
})

app.get('/professionals-detail-message', (req, res) => {
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  res.render('professionals-detail-message', {
    err_msg, success_msg, layout: false,
    session: req.session
  });
})

app.get('/professionals-hirenow', isCustomer, (req, res) => {
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  res.render('professionals-hirenow', {
    err_msg, success_msg, layout: false,
    session: req.session
  });
})
app.get('/pricingplan', (req, res) => {
  res.render('pricingplan');
})

app.get('/forget-password', (req, res) => {
  res.render('forget-password');
})
app.get('/mydreamhome-details-phase-a', (req, res) => {
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  res.render('mydreamhome-details-phase-a', {
    err_msg, success_msg, layout: false,
    session: req.session
  });
})
app.get('/mydreamhome', (req, res) => {
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  res.render('mydreamhome', {
    err_msg, success_msg, layout: false,
    session: req.session
  });
})


//*******Service Provider and signup and profiles routes */
app.get('/signup-service-provider', (req, res) => {
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  service_provider = req.flash('service_provider');
  res.render('signup-service-provider', { err_msg, success_msg, service_provider });
});

app.get('/signin-professional', (req, res) => {
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  res.render('signin-professional', { err_msg, success_msg });
});


app.get('/dashboard-professional', (req, res) => {
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  res.render('dashboard-professional', { err_msg, success_msg });
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
app.get('/kyc-professional', (req, res) => {
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  res.render('kyc-professional', { err_msg, success_msg });
});

app.get('/kyc-professional', (req, res) => {
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  res.render('kyc-professional', { err_msg, success_msg });
});


module.exports = app;
