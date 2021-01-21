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
const ServiceProviderPortfolioSchema = require("../models/service_provider_portfolio");
const ServiceProviderSchema = require("../models/service_providers");
const ServiceProviderPersonalDetailsSchema = require("../models/service_provider_personal_details");
const ServiceProviderEducationSchema = require("../models/service_provider_education");
const CustomerUploadDocsSchema = require("../models/customer_upload_document");
const PropertiesPictureSchema = require("../models/properties_picture");
//const PropertiesPlanPictureSchema = require("../models/properties_plan_picture");
const PropertiesSchema = require("../models/properties");

var isCustomer = auth.isCustomer;
var isServiceProvider = auth.isServiceProvider;

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
  ServiceProviderSchema.find({ sps_status: 'active' }).then(service_provider => {
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
        data: service_provider
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
  ServiceProviderSchema.find({ _id: req.query.id }).then(service_provider_detail => {
    if (service_provider_detail) {
      err_msg = req.flash('err_msg');
      success_msg = req.flash('success_msg');
      res.render('professionals-detail', {
        err_msg, success_msg, layout: false,
        session: req.session,
        service_provider_detail: service_provider_detail[0]
      });
    }
  }).catch((err) => {
    console.log(err)
  })

});

// app.get('/mydreamhome-details', isCustomer, (req, res) => {
//   err_msg = req.flash('err_msg');
//   success_msg = req.flash('success_msg');
//   res.render('mydreamhome-details', {
//     err_msg, success_msg, layout: false,
//     session: req.session
//   });
// });

// Professional Filter Role
app.get('/professionals-filter', isCustomer, (req, res) => {
  console.log('role data:',req.query.role);
  ServiceProviderSchema.find({ sps_role_name: req.query.role }).then(service_provider_detail => {
    if (service_provider_detail) {
      console.log('service_provider_detail:',service_provider_detail)
      err_msg = req.flash('err_msg');
      success_msg = req.flash('success_msg');
      res.send({
        err_msg, success_msg, layout: false,
        session: req.session,
        filterData: service_provider_detail
      })
    }
  }).catch((err) => {
    console.log(err)
  })
});

// Professional Filter name surname qualification
app.get('/professionals-searchbar', (req, res) => {
let professionalIDs = [];
ServiceProviderSchema.find({ sps_fullname: new RegExp(req.query.searchKeyword, 'i')  }).then(service_provider_detail1 => {
  ServiceProviderPersonalDetailsSchema.find({ spods_surname: new RegExp(req.query.searchKeyword, 'i')}).then(service_provider_detail2 => {
    ServiceProviderEducationSchema.find({ spes_qualification_obtained: new RegExp(req.query.searchKeyword, 'i') }).then(service_provider_detail3 => {
      if (service_provider_detail1 || service_provider_detail2 || service_provider_detail3) {
        err_msg = req.flash('err_msg');
        success_msg = req.flash('success_msg');
        var service_provider_detail = service_provider_detail1.concat(service_provider_detail2, service_provider_detail3);
      service_provider_detail.forEach( async function(providerData) {
          if(("spes_service_provider_id" in providerData) == true ){
             await professionalIDs.push(providerData.spes_service_provider_id.toString());
          }else if(('spods_service_provider_id' in providerData) == true){
             await professionalIDs.push(providerData.spods_service_provider_id.toString());
          }else{
             await professionalIDs.push(providerData._id.toString());
          } 
      });
      let unique = [...new Set(professionalIDs)];
      ServiceProviderSchema.find({ _id: { $in: unique } }).then(service_provider_detail => {
        res.send({
          err_msg, success_msg, layout: false,
          session: req.session,
          filterData: service_provider_detail
        })
      });
      }
  });
  });
  }).catch((err) => {
    console.log(err)
  })
});


app.get('/mydreamhome-details-docs', isCustomer, async (req, res) => {

  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  const allDocument = await CustomerUploadDocsSchema.find({cuds_customer_id:req.session.user_id});


  ServiceProviderSchema.find({ sps_status: 'active', }).then(service_provider => {
    if (!service_provider) {
      console.log("Service Provider not found");
      return res.status(400).json("Service Provider not found")
    }
    else {
      res.render('mydreamhome-details-docs', {
        err_msg, success_msg, layout: false,
        session: req.session,
        data: service_provider,
        allDocument: allDocument,
        moment: moment
      });
    }

  })
});
// app.get('/mydreamhome-details-docs', isCustomer, (req, res) => {

//   err_msg = req.flash('err_msg');
//   success_msg = req.flash('success_msg');
//   ServiceProviderSchema.find({sps_status:'active'}).then(service_provider => {
//     if (!service_provider) {
//       console.log("Service Provider not found");
//       return res.status(400).json("Service Provider not found")
//     }
//     else {
//       res.render('mydreamhome-details-docs', {
//         err_msg, success_msg, layout: false,
//         session: req.session,
//         data:service_provider
//       });
//     }

//   })
// });
app.get('/mydreamhome-details-to-dos', isCustomer, (req, res) => {
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  res.render('mydreamhome-details-to-dos', {
    err_msg, success_msg, layout: false,
    session: req.session
  });
});
// app.get('/add-property', isCustomer, (req, res) => {
//   err_msg = req.flash('err_msg');
//   success_msg = req.flash('success_msg');
//   res.render('add-property', {
//     err_msg, success_msg, layout: false,
//     session: req.session
//   });
// });
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
  console.log('helooooo',req.query);
  //return
  ServiceProviderSchema.find({ _id: req.query.spp_id }).then(service_provider_detail => {
    if (service_provider_detail) {
      err_msg = req.flash('err_msg');
      success_msg = req.flash('success_msg');
      res.render('professionals-detail-message', {
        err_msg, success_msg, layout: false,
        session: req.session,
        service_provider_detail: service_provider_detail[0]
      });
    }
  }).catch((err) => {
    console.log(err)
  })

});


app.get('/professionals-hirenow', isCustomer, async(req, res) => {
  //console.log('spp_id', req.query.spp_id)
  
  if(req.query.spp_id){
   // if(req.session.user_id)
   var property= await PropertiesSchema.find({ ps_user_id: req.session.user_id });
   //console.log('property====',property)
  var serviceProvider= await ServiceProviderSchema.findOne({_id:req.query.spp_id });
      //console.log('service_provider=+++',serviceProvider)
      if (serviceProvider) {
        
        err_msg = req.flash('err_msg');
        success_msg = req.flash('success_msg');
        res.render('professionals-hirenow', {
          err_msg, success_msg, layout: false,
          session: req.session,
          serviceProvider:serviceProvider,
          property:property
          
        });
      }
  }else{

    console.log('service provider id not found')
  }

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

app.get('/forget-password-professional', function (req, res) {
  var test = req.session.is_user_logged_in;
  if (test == true) {
    res.redirect('/dashboard-professional');
  } else {
    err_msg = req.flash('err_msg');
    success_msg = req.flash('success_msg');
    res.render('forget-password-professional', {
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


app.get('/mydreamhome-details-phase-a', isCustomer, (req, res) => {
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  res.render('mydreamhome-details-phase-a', {
    err_msg, success_msg, layout: false,
    session: req.session
  });
})
// app.get('/mydreamhome', isCustomer, (req, res) => {
//   err_msg = req.flash('err_msg');
//   success_msg = req.flash('success_msg');
//   res.render('mydreamhome', {
//     err_msg, success_msg, layout: false,
//     session: req.session
//   });
// })
//*************************property data display on mydeream home page
app.get('/mydreamhome', isCustomer, async (req, res) => {
  PropertiesSchema.find({ ps_user_id: req.session.user_id }).then(async (data) => {
    if (data) {
      let arr = [];
          for (let img of data) {
            await PropertiesPictureSchema.find({pps_property_id:img._id}).then(async (result)=>{

               let temp = await result
              //for(let image of result){
               //  let temp = await image
                 arr.push(temp)
              // }
            })
            
          }
      console.log('++++++++',arr)
      err_msg = req.flash('err_msg');
      success_msg = req.flash('success_msg');
      res.render('mydreamhome', {
        err_msg, success_msg, layout: false,
        session: req.session,
        propertyData: data,
        propertyImage:arr
        
      });
    }
  }).catch((err) => {
    console.log(err)
  })

})

app.get('/mydreamhome-details', isCustomer, (req, res) => {

  PropertiesSchema.find({ _id: req.query.id }).then(async (data) => {
    if (data) {
      
      let arr = [];
      for (let img of data) {
        await PropertiesPictureSchema.find({pps_property_id:img._id}).then(async (result)=>{
           //let temp = await result
           for(let image of result){
             let temp = await image
             arr.push(temp)
           }
         
        })
        
      }
  
      err_msg = req.flash('err_msg');
      success_msg = req.flash('success_msg');
      res.render('mydreamhome-details', {
        err_msg, success_msg, layout: false,
        session: req.session,
        propertyDetailData: data,
        propertyImage:arr
      });
    }
  }).catch((err) => {
    console.log(err)
  })

})



//*******Service Provider and signup and profiles routes */
app.get('/signup-service-provider', (req, res) => {
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  service_provider = req.flash('service_provider');
  res.render('signup-service-provider', {
    err_msg, success_msg, service_provider, layout: false,
    session: req.session
  });
});

app.get('/signin-professional', (req, res) => {
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  res.render('signin-professional', {
    err_msg, success_msg, layout: false,
    session: req.session
  });
});


app.get('/dashboard-professional', isServiceProvider, (req, res) => {
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  res.render('dashboard-professional', {
    err_msg, success_msg, layout: false,
    session: req.session
  });
});
app.get('/signup-professionals-profile', isServiceProvider, (req, res) => {
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');

  res.render('signup-professionals-profile', {
    err_msg, success_msg, layout: false,
    session: req.session
  });
});
app.get('/signup-professionals-profile-2', isServiceProvider, (req, res) => {
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  res.render('signup-professionals-profile-2', {
    err_msg, success_msg, layout: false,
    session: req.session
  });
});
app.get('/signup-professionals-profile-3', isServiceProvider, (req, res) => {
  ServiceProviderEducationSchema.find({spes_service_provider_id:req.session.user_id}).then((AllEducation)=>{
    console.log('AllEducation',AllEducation)
    err_msg = req.flash('err_msg');
    success_msg = req.flash('success_msg');
    res.render('signup-professionals-profile-3', {
      err_msg, success_msg, layout: false,
      session: req.session,
      education:AllEducation,
      moment: moment

    });
  })
  
});  
app.get('/signup-professionals-profile-4', isServiceProvider, (req, res) => {
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  res.render('signup-professionals-profile-4', {
    err_msg, success_msg, layout: false,
    session: req.session
  });
});
app.get('/signup-professionals-profile-5', isServiceProvider, (req, res) => {
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  res.render('signup-professionals-profile-5', {
    err_msg, success_msg, layout: false,
    session: req.session
  });
});
app.get('/signup-professionals-profile-6', isServiceProvider, (req, res) => {
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  res.render('signup-professionals-profile-6', {
    err_msg, success_msg, layout: false,
    session: req.session
  });
});
app.get('/signup-professionals-profile-7', isServiceProvider, (req, res) => {
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  res.render('signup-professionals-profile-7', {
    err_msg, success_msg, layout: false,
    session: req.session
  });
});
app.get('/portfolio', isServiceProvider, (req, res) => {
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  res.render('portfolio', {
    err_msg, success_msg, layout: false,
    session: req.session
  });
});


app.get('/index', (req, res) => res.render('index'));
app.get('/kyc-professional', isServiceProvider, (req, res) => {
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  res.render('kyc-professional', {
    err_msg, success_msg, layout: false,
    session: req.session
  });
});



module.exports = app;
