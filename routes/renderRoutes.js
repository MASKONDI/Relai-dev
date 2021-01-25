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
const PropertyProfessionalSchema = require("../models/property_professional_Schema");
const MessageSchema = require("../models/message");
const CustomerSchema = require("../models/customers");
const ServiceProviderOtherDetailsSchema = require("../models/service_providers_other_details");


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




function timeDiffCalc(dateFuture, dateNow) {
  let diffInMilliSeconds = Math.abs(dateFuture - dateNow) / 1000;

  // calculate days
  const days = Math.floor(diffInMilliSeconds / 86400);
  diffInMilliSeconds -= days * 86400;
  console.log('calculated days', days);

  // calculate hours
  const hours = Math.floor(diffInMilliSeconds / 3600) % 24;
  diffInMilliSeconds -= hours * 3600;
  console.log('calculated hours', hours);

  // calculate minutes
  const minutes = Math.floor(diffInMilliSeconds / 60) % 60;
  diffInMilliSeconds -= minutes * 60;
  console.log('minutes', minutes);

  let difference = '';
  if (days > 0) {
    difference += (days === 1) ? `${days} day, ` : `${days} days, `;
  }

  difference += (hours === 0 || hours === 1) ? `${hours} hour, ` : `${hours} hours, `;

  difference += (minutes === 0 || hours === 1) ? `${minutes} minutes` : `${minutes} minutes`;

  return difference;
}



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

app.get('/professionals', isCustomer, async (req, res) => {
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  await ServiceProviderSchema.find({ sps_status: 'active' }).then(async service_provider => {
    // Check for Customer
    if (!service_provider) {
      console.log("Service Provider not found");
      // req.flash('err_msg', 'Service Provider not found');
      // return res.redirect('/professionals');
      return res.status(400).json("Service Provider not found")
    }
    else {
      let serviceProvArray = [];
      for (var sp_id of service_provider) {
        await ServiceProviderOtherDetailsSchema.findOne({ spods_service_provider_id: sp_id._id }).then(async otherDetails => {
          if (otherDetails) {
            console.log("other Details of customers", otherDetails);
            const spProvider = JSON.stringify(sp_id);
            const parseSpProvider = JSON.parse(spProvider);
            parseSpProvider.professionalBody = otherDetails.spods_professional_body
            serviceProvArray.push(parseSpProvider);
            console.log("service_provider Array list in loop:", serviceProvArray);
          }
        });
      }
      console.log("service_provider Array list is:", serviceProvArray);
      res.render('professionals', {
        err_msg, success_msg, layout: false,
        session: req.session,
        data: serviceProvArray
      });
    }
  })
});

app.get('/myprofessionals', isCustomer, async (req, res) => {
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  let AllhiredProfeshnoal = await PropertyProfessionalSchema.find({ pps_user_id: req.session.user_id });
  console.log('AllhiredProfeshnoal', AllhiredProfeshnoal);
  let serviceProvArray = [];
  for (var k of AllhiredProfeshnoal) {
    await ServiceProviderSchema.find({ _id: k.pps_service_provider_id }).then(async (allProfeshnoals) => {
      for (let i of allProfeshnoals) {
        let temps = await i
        serviceProvArray.push(temps)
      }
    });
  }
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  res.render('myprofessionals', {
    err_msg, success_msg, layout: false,
    session: req.session,
    data: serviceProvArray
  });
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
  ServiceProviderSchema.findOne({ _id: req.query.id }).then(async service_provider_detail => {
    if (service_provider_detail) {
      //spods_service_provider_id
    let serviceProOtherDetail=  await ServiceProviderOtherDetailsSchema.findOne({spods_service_provider_id:service_provider_detail._id});
       console.log('serviceProOtherDetail:',serviceProOtherDetail) 
    err_msg = req.flash('err_msg');
      success_msg = req.flash('success_msg');
      res.render('professionals-detail', {
        err_msg, success_msg, layout: false,
        session: req.session,
        service_provider_detail: service_provider_detail,
        serviceProOtherDetail:serviceProOtherDetail,
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
  console.log('role data:', req.query.role);
  ServiceProviderSchema.find({ sps_role_name: req.query.role }).then(service_provider_detail => {
    if (service_provider_detail) {
      console.log('service_provider_detail:', service_provider_detail)
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
  ServiceProviderSchema.find({ sps_fullname: new RegExp(req.query.searchKeyword, 'i') }).then(service_provider_detail1 => {
    ServiceProviderPersonalDetailsSchema.find({ spods_surname: new RegExp(req.query.searchKeyword, 'i') }).then(service_provider_detail2 => {
      ServiceProviderEducationSchema.find({ spes_qualification_obtained: new RegExp(req.query.searchKeyword, 'i') }).then(service_provider_detail3 => {
        if (service_provider_detail1 || service_provider_detail2 || service_provider_detail3) {
          err_msg = req.flash('err_msg');
          success_msg = req.flash('success_msg');
          var service_provider_detail = service_provider_detail1.concat(service_provider_detail2, service_provider_detail3);
          service_provider_detail.forEach(async function (providerData) {
            if (("spes_service_provider_id" in providerData) == true) {
              await professionalIDs.push(providerData.spes_service_provider_id.toString());
            } else if (('spods_service_provider_id' in providerData) == true) {
              await professionalIDs.push(providerData.spods_service_provider_id.toString());
            } else {
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
  console.log('property id is :', req.session.property_id);
  //req.session.property_id=req.query.id
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  let property = await PropertiesSchema.findOne({ _id: req.session.property_id });
  const allDocument = await CustomerUploadDocsSchema.find({ $and: [{ cuds_customer_id: req.session.user_id, cuds_property_id: req.session.property_id }] });
  //const propertyDataObj = await PropertiesSchema.find();

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
        allDocument: allDocument,//need to show property wise document still showing all uploaded
        property: property,
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

app.get('/mydreamhome-details-message', isCustomer, async (req, res) => {
  console.log(' property id  :', req.session.property_id);
  let property = await PropertiesSchema.findOne({ _id: req.session.property_id });
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  res.render('mydreamhome-details-message', {
    err_msg, success_msg, layout: false,
    session: req.session,
    property: property
  });
})

app.get('/professionals-detail-message', (req, res) => {
  console.log('helooooo', req.query);
  //return
  var newData = [];
  ServiceProviderSchema.find({ _id: req.query.spp_id }).then(service_provider_detail => {
    if (service_provider_detail) {
      MessageSchema.find({
        $or: [
          { $and: [{ sms_sender_id: req.query.cus_id }, { sms_receiver_id: req.query.spp_id }] },
          { $and: [{ sms_sender_id: req.query.spp_id }, { sms_receiver_id: req.query.cus_id }] }
        ]
      }).then(async (data) => {
        if (data) {


          // data.forEach(async function (providerData) {
          //   var today = new Date();
          //   var date = today.getFullYear()+'/'+(today.getMonth()+1)+'/'+today.getDate();
          //   var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
          //   var dateTime = date+' '+time;

          //   var today1 = new Date(providerData.sms_msg_Date);
          //   var date1 = today1.getFullYear()+'/'+(today1.getMonth()+1)+'/'+today1.getDate();
          //   var time1 = today1.getHours() + ":" + today1.getMinutes() + ":" + today1.getSeconds();
          //   var dateTime1 = date1+' '+time1;

          //   var msg_time = timeDiffCalc(new Date(dateTime), new Date(dateTime1));
          //   var object_as_string = JSON.stringify(providerData);  
          //              const t =    JSON.parse(object_as_string);
          //              t.msgTime = msg_time;
          //             //console.log('providerData New:',t);
          //          newData.push(t);
          //  });



          for (let providerData of data) {
            var today = new Date();
            var date = today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + today.getDate();
            var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            var dateTime = date + ' ' + time;

            var today1 = new Date(providerData.sms_msg_Date);
            var date1 = today1.getFullYear() + '/' + (today1.getMonth() + 1) + '/' + today1.getDate();
            var time1 = today1.getHours() + ":" + today1.getMinutes() + ":" + today1.getSeconds();
            var dateTime1 = date1 + ' ' + time1;

            var msg_time = timeDiffCalc(new Date(dateTime), new Date(dateTime1));

            var object_as_string = JSON.stringify(providerData);
            const t = JSON.parse(object_as_string);
            t.msgTime = msg_time;
            await ServiceProviderSchema.findOne({ _id: t.sms_sender_id }).then(async professional => {
              if (professional) {
                console.log('professional:', professional.sps_fullname);
                t.senderName = await professional.sps_fullname;
                //console.log('providerData xxxx New:',t);
              } else {
                t.senderName = await 'You';
              }

            });
            const s = await t;
            //console.log('providerData New:',s);
            newData.push(s);

          }

          console.log('newData', newData);
          err_msg = req.flash('err_msg');
          success_msg = req.flash('success_msg');
          res.render('professionals-detail-message', {
            err_msg, success_msg, layout: false,
            session: req.session,
            service_provider_detail: service_provider_detail[0],
            chatData: newData
          });
        }
      }).catch((err) => {
        console.log(err)
      })
    }
  }).catch((err) => {
    console.log(err)
  })

});


app.get('/professionals-hirenow', isCustomer, async (req, res) => {
  //console.log('spp_id', req.query.spp_id)

  if (req.query.spp_id) {
    // if(req.session.user_id)
    var property = await PropertiesSchema.find({ ps_user_id: req.session.user_id });
    //console.log('property====',property)
    var serviceProvider = await ServiceProviderSchema.findOne({ _id: req.query.spp_id });
    //console.log('service_provider=+++',serviceProvider)
    if (serviceProvider) {

      err_msg = req.flash('err_msg');
      success_msg = req.flash('success_msg');
      res.render('professionals-hirenow', {
        err_msg, success_msg, layout: false,
        session: req.session,
        serviceProvider: serviceProvider,
        property: property

      });
    }
  } else {

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
        await PropertiesPictureSchema.find({ pps_property_id: img._id }).then(async (result) => {

          let temp = await result
          //for(let image of result){
          //  let temp = await image
          arr.push(temp)
          // }
        })

      }
      // console.log('++++++++',arr)

      err_msg = req.flash('err_msg');
      success_msg = req.flash('success_msg');
      res.render('mydreamhome', {
        err_msg, success_msg, layout: false,
        session: req.session,
        propertyData: data,
        propertyImage: arr

      });
    }
  }).catch((err) => {
    console.log(err)
  })

})
app.post('/getPropertyDetail',isCustomer,async(req,res)=>{
console.log('getProperty-detail:',req.body)
console.log('session property id',req.body.property_id);
req.session.property_id=req.body.property_id
let AllhiredProfeshnoal = await PropertyProfessionalSchema.find({pps_user_id:req.session.user_id});
let allDocumentUploadByCustmer =await CustomerUploadDocsSchema.find({cuds_customer_id:req.session.user_id});
//console.log('AllhiredProfeshnoal',AllhiredProfeshnoal);
let serviceProvArray = [];
for (var k of AllhiredProfeshnoal) {
  await ServiceProviderSchema.find({ _id: k.pps_service_provider_id }).then(async (allProfeshnoals) => {
    for (let i of allProfeshnoals) {
      let temps = await i
      serviceProvArray.push(temps)
    }
  });
}
//console.log('hiredProfeshnoalList=',serviceProvArray)
PropertiesSchema.find({ _id: req.body.property_id }).then(async (data) => {
  if (data) {

    let arr = [];
    for (let img of data) {
      await PropertiesPictureSchema.find({ pps_property_id: img._id }).then(async (result) => {
        //let temp = await result
        for (let image of result) {
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
      propertyImage:arr,
      hiredProfeshnoalList:serviceProvArray,
      allDocumentUploadByCustmer:allDocumentUploadByCustmer

    });
    
    //console.log(serviceProvArray)
  }
}).catch((err) => {
  console.log(err)
})


})
app.get('/mydreamhome-details', isCustomer, async(req, res) => {
  console.log('session property id',req.query.id);
  req.session.property_id=req.query.id
  let AllhiredProfeshnoal = await PropertyProfessionalSchema.find({pps_user_id:req.session.user_id});
  let allDocumentUploadByCustmer =await CustomerUploadDocsSchema.find({cuds_customer_id:req.session.user_id});
  //console.log('AllhiredProfeshnoal',AllhiredProfeshnoal);
  let serviceProvArray = [];
  for (var k of AllhiredProfeshnoal) {
    await ServiceProviderSchema.find({ _id: k.pps_service_provider_id }).then(async (allProfeshnoals) => {
      for (let i of allProfeshnoals) {
        let temps = await i
        serviceProvArray.push(temps)
      }
    });
  }
  //console.log('hiredProfeshnoalList=',serviceProvArray)

  PropertiesSchema.find({ _id: req.query.id }).then(async (data) => {
    if (data) {

      let arr = [];
      for (let img of data) {
        await PropertiesPictureSchema.find({ pps_property_id: img._id }).then(async (result) => {
          //let temp = await result
          for (let image of result) {
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
        propertyImage: arr,

        hiredProfeshnoalList: serviceProvArray,
        allDocumentUploadByCustmer: allDocumentUploadByCustmer


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
  ServiceProviderEducationSchema.find({ spes_service_provider_id: req.session.user_id }).then((AllEducation) => {
    console.log('AllEducation', AllEducation)
    err_msg = req.flash('err_msg');
    success_msg = req.flash('success_msg');
    res.render('signup-professionals-profile-3', {
      err_msg, success_msg, layout: false,
      session: req.session,
      education: AllEducation,
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


app.get('/get-message', async (req, res) => {
  //console.log('helooooo hghgh', req.query);
  //return
  var newData = [];
  MessageSchema.find({
    $or: [
      { $and: [{ sms_sender_id: req.query.sms_sender_id }, { sms_receiver_id: req.query.sms_receiver_id }] },
      { $and: [{ sms_sender_id: req.query.sms_receiver_id }, { sms_receiver_id: req.query.sms_sender_id }] }
    ]
  }).then(async (data) => {
    if (data) {
      // data.forEach(async function (providerData) {
      //   var today = new Date();
      //   var date = today.getFullYear()+'/'+(today.getMonth()+1)+'/'+today.getDate();
      //   var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      //   var dateTime = date+' '+time;

      //   var today1 = new Date(providerData.sms_msg_Date);
      //   var date1 = today1.getFullYear()+'/'+(today1.getMonth()+1)+'/'+today1.getDate();
      //   var time1 = today1.getHours() + ":" + today1.getMinutes() + ":" + today1.getSeconds();
      //   var dateTime1 = date1+' '+time1;

      //   var msg_time = timeDiffCalc(new Date(dateTime), new Date(dateTime1));
      //   var object_as_string = JSON.stringify(providerData);  
      //              const t =    JSON.parse(object_as_string);
      //              t.msgTime = msg_time;
      //             //console.log('providerData New:',t);
      //          newData.push(t);
      //  });



      for (let providerData of data) {
        var today = new Date();
        var date = today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date + ' ' + time;

        var today1 = new Date(providerData.sms_msg_Date);
        var date1 = today1.getFullYear() + '/' + (today1.getMonth() + 1) + '/' + today1.getDate();
        var time1 = today1.getHours() + ":" + today1.getMinutes() + ":" + today1.getSeconds();
        var dateTime1 = date1 + ' ' + time1;

        var msg_time = timeDiffCalc(new Date(dateTime), new Date(dateTime1));

        var object_as_string = JSON.stringify(providerData);
        const t = JSON.parse(object_as_string);
        t.msgTime = msg_time;
        await ServiceProviderSchema.findOne({ _id: t.sms_sender_id }).then(async professional => {
          if (professional) {
            //console.log('professional:',professional.sps_fullname);
            t.senderName = await professional.sps_fullname;
            //console.log('providerData xxxx New:',t);
          } else {
            t.senderName = await 'You';
          }

        });
        const s = await t;
        //console.log('providerData New:',s);
        newData.push(s);

      }



      // console.log('Get newData',newData);
      err_msg = req.flash('err_msg');
      success_msg = req.flash('success_msg');
      res.send({
        err_msg, success_msg, layout: false,
        session: req.session,
        chatData: newData
      });
    }
  }).catch((err) => {
    console.log(err)
  })


});


app.get('/get-message-postman', async (req, res) => {
  console.log('getapi:', req.query)
  var newData = [];
  const newArr1 = '';
  const newArr2 = '';
  MessageSchema.find({
    $or: [
      { $and: [{ sms_sender_id: req.query.cus_id }, { sms_receiver_id: req.query.spp_id }] },
      { $and: [{ sms_sender_id: req.query.spp_id }, { sms_receiver_id: req.query.cus_id }] }
    ]
  }).then(async (data) => {
    if (data) {
      //data.forEach(async function (providerData) {
      for (let providerData of data) {

        var today = new Date();
        var date = today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date + ' ' + time;

        var today1 = new Date(providerData.sms_msg_Date);
        var date1 = today1.getFullYear() + '/' + (today1.getMonth() + 1) + '/' + today1.getDate();
        var time1 = today1.getHours() + ":" + today1.getMinutes() + ":" + today1.getSeconds();
        var dateTime1 = date1 + ' ' + time1;

        var msg_time = timeDiffCalc(new Date(dateTime), new Date(dateTime1));


        var object_as_string = JSON.stringify(providerData);
        const t = JSON.parse(object_as_string);
        t.msgTime = msg_time;
        await ServiceProviderSchema.findOne({ _id: t.sms_sender_id }).then(async professional => {
          if (professional) {
            console.log('professional:', professional.sps_fullname);
            t.senderName = await professional.sps_fullname;
            //console.log('providerData xxxx New:',t);
          } else {
            t.senderName = await 'You';
          }

        });

        const s = await t;
        //console.log('providerData New:',s);
        newData.push(s);

      }
      // });



      console.log('New newArr2:', newData)
      res.send({
        newData: newData
      })

    }
  }).catch((err) => {
    console.log(err)
  })

});




function timeDiffCalc(dateFuture, dateNow) {
  let diffInMilliSeconds = Math.abs(dateFuture - dateNow) / 1000;

  // calculate days
  const days = Math.floor(diffInMilliSeconds / 86400);
  diffInMilliSeconds -= days * 86400;
  //console.log('calculated days', days);

  // calculate hours
  const hours = Math.floor(diffInMilliSeconds / 3600) % 24;
  diffInMilliSeconds -= hours * 3600;
  //console.log('calculated hours', hours);

  // calculate minutes
  const minutes = Math.floor(diffInMilliSeconds / 60) % 60;
  diffInMilliSeconds -= minutes * 60;
  //console.log('minutes', minutes);

  let difference = '';
  if (days > 0) {
    difference = (days === 1) ? `${days} day ` : `${days} days, `;
  } else if (hours > 0) {
    difference = (hours === 0 || hours === 1) ? `${hours} hour ` : `${hours} hours `;
  } else if (minutes > 0) {
    difference = (minutes === 0 || hours === 1) ? `${minutes} minutes` : `${minutes} minutes`;
  } else {
    difference = 'just now';
  }

  return difference;
}

module.exports = app;
