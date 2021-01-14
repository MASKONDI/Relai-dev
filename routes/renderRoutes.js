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
const ServiceProviderSchema = require("../models/service_providers");
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
  res.render('signin', {
    err_msg, success_msg, layout: false,
    session: req.session
  });

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
  ServiceProviderSchema.find({sps_status:'active'}).then(service_provider => {
    // Check for Customer
  
    
    if (!service_provider) {
      console.log("Service Provider not found");
      // req.flash('err_msg', 'Service Provider not found');
      // return res.redirect('/professionals');

      return res.status(400).json("Service Provider not found")
    }
    else {

      res.render('professionals', {
        err_msg, success_msg, layout: false,
        session: req.session,
        data:service_provider
      });
    }

  })
});

// app.get('/professionals', isCustomer, (req, res) => {
//   err_msg = req.flash('err_msg');
//   success_msg = req.flash('success_msg');
//   res.render('professionals', {
//     err_msg, success_msg, layout: false,
//     session: req.session
//   });
// });
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
  ServiceProviderSchema.find({sps_status:'active'}).then(service_provider => {
    if (!service_provider) {
      console.log("Service Provider not found");
      return res.status(400).json("Service Provider not found")
    }
    else {
      res.render('mydreamhome-details-docs', {
        err_msg, success_msg, layout: false,
        session: req.session,
        data:service_provider
      });
    }

  })
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

// app.get('/forget-password', (req, res) => {
//   res.render('forget-password');
// })
/***************** get forgot pass **************/

app.get('/forget-password', function (req, res) {
  var test = req.session.is_user_logged_in;
  if (test == true) {
    res.redirect('/dashboard');
  } else {
    err_msg = req.flash('err_msg');
    success_msg = req.flash('success_msg');
    res.render('forget-password', {
      err_msg,
      success_msg,
      layout: false,
      session: req.session,
    });
  }
});




//***************** get resend link **************//
app.get('/Resend-link', function (req, res) {
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  var test = req.session.is_user_logged_in;
  // else 
  // {
  res.render('Resend-link', {
    err_msg,
    success_msg,
    layout: false,
    session: req.session,
  });
  // }
});


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
