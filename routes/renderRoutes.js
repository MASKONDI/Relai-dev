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
const PropertiesPhaseSchema = require("../models/property_phase_schema");
const phaseDetail = require("./api/phaseDetail");
const propertyDetail = require("./api/propertyDetail");
const TaskHelper = require("./api/addTask");
const ComplaintsSchema = require("../models/Complaints");
const PropertyProfessionalHelper = require("./api/propertyProfessionalDetails")
//const ComplaintsSchema = require("../models/Complaints");
const ComplaintDetailsSchema = require("../models/complaint_details_model");


const message = require('../models/message');

const DocumentPermissionSchema = require('../models/document_permission')
const RatingSchema = require("../models/service_provider_rating_Schema");

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

app.get('/signin-intro', (req, res) => {
  res.render('signin-intro');
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

app.get("/mydreamhome-details-chainproperty", isCustomer, async (req, res) => {

  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  req.session.pagename = 'mydreamhome-details-chainproperty';
  console.log("customer session id is", req.session.user_id);
  console.log(" req issssssssssssssssss", req.query.id);
  var propertyArray = [];

  await PropertiesSchema.findOne({ ps_user_id: req.session.user_id, _id: req.query.id }).then(async (chainPropertyDetails) => {
    if (chainPropertyDetails) {

      await PropertiesSchema.findOne({
        _id: chainPropertyDetails.ps_chain_property_id
      }).then(async (existing_property_details) => {
        var propImage = [];
        await PropertiesPictureSchema.find({ pps_property_id: existing_property_details._id }).then(async (result) => {
          //let temp = await result
          for (let image of result) {
            let temp = await image
            propImage.push(temp);
          }
          console.log("existing_property_details", existing_property_details.ps_phase_array);
          var message = await timeDifference(existing_property_details.ps_phase_array);
          var object_as_string = JSON.stringify(existing_property_details);
          const t = JSON.parse(object_as_string);
          t.propertyImage = await propImage;
          t.estimated_time = await message;

          let prop = await t;
          propertyArray.push(prop)
          console.log("existing PROPERTY ARRAY IS", propertyArray);
        }).catch((err) => {
          console.log("Something went wrong", err)
        })

      }).catch((err) => {
        console.log("something went wrong")
      });

      var propImage = [];
      await PropertiesPictureSchema.find({ pps_property_id: chainPropertyDetails._id }).then(async (result) => {
        //let temp = await result
        for (let image of result) {
          let temp = await image
          propImage.push(temp);
        }
        console.log("chainPropertyDetails is :", chainPropertyDetails.ps_phase_array);
        var message = await timeDifference(chainPropertyDetails.ps_phase_array);
        var object_as_string = JSON.stringify(chainPropertyDetails);
        const t = JSON.parse(object_as_string);
        t.propertyImage = await propImage;
        t.estimated_time = await message;

        let prop = await t;
        propertyArray.push(prop)
        console.log("chain PROPERTY ARRAY IS", propertyArray);
      }).catch((err) => {
        console.log(err)
      });
    }
  })
  res.render('mydreamhome-details-chainproperty', {
    err_msg, success_msg, layout: false,
    session: req.session,
    propertyArray: propertyArray,

    moment: moment
  });
})
//   var propertyArray = [];

//   //propertyArray.push(img);
//   await PropertiesPictureSchema.find({ pps_property_id: prop._id }).then(async (result) => {
//     //let temp = await result
//     for (let image of result) {
//       let temp = await image
//       propertyImage.push(temp);
//     }
//   })

// }
// console.log(allProperties);
//   req.session.pagename = 'mydreamhome';
//   if (req.query.id) {
//     req.session.property_id = req.query.id
//     let AllhiredProfeshnoal = await PropertyProfessionalSchema.find({ $and: [{ pps_user_id: req.session.user_id, pps_property_id: req.query.id, pps_is_active_user_flag: req.session.active_user_login }] });
//     let allDocumentUploadByCustmer = await CustomerUploadDocsSchema.find({ $and: [{ cuds_customer_id: req.session.user_id, cuds_property_id: req.query.id, cuds_is_active_user_flag: req.session.active_user_login }] });
//     console.log('AllhiredProfeshnoal', AllhiredProfeshnoal);
//     let serviceProvArray = [];
//     let totalcostArray = [];
//     var cost = 0;
//     var to = [1, 2, 3]
//     //var sumof = tallyVotes(to)
//     var sumof = tallyVotes(AllhiredProfeshnoal)
//     console.log("sumofsumofsumofsumofsumof", sumof)
//     for (var k of AllhiredProfeshnoal) {
//       var costs = parseInt(k.pps_pofessional_budget);

//       cost = await parseInt(cost + costs);

//       totalcostArray.push(cost)
//       await ServiceProviderSchema.find({ _id: k.pps_service_provider_id }).then(async (allProfeshnoals) => {
//         //console.log('allProfeshnoals:', allProfeshnoals)
//         await MessageSchema.find({
//           $or: [
//             { $and: [{ sms_sender_id: req.session.user_id }, { sms_receiver_id: k.pps_service_provider_id }, { sms_is_active_user_flag: req.session.active_user_login }] },
//             { $and: [{ sms_sender_id: k.pps_service_provider_id }, { sms_receiver_id: req.session.user_id }] }
//           ]
//         }).then(async (msgdata) => {
//           //console.log('msgdata=', msgdata)
//           for (let i of allProfeshnoals) {
//             if (msgdata.length > 0) {
//               var object_as_string = JSON.stringify(i);
//               const t = JSON.parse(object_as_string);
//               // console.log('lastIndex:', msgdata.slice(-1)[0]);
//               let msgData = msgdata.slice(-1)[0];
//               t.sms_message = msgData.sms_message;
//               //let temps = await i
//               serviceProvArray.push(t)
//             } else {
//               var object_as_string = JSON.stringify(i);
//               const t = JSON.parse(object_as_string);
//               t.sms_message = '...';
//               //let temps = await i


//               serviceProvArray.push(t)
//             }
//           }
//         })
//       });
//     }
//     let todoArray = [];
//     var c = 0;
//     let TaskDetailObj = await TaskHelper.GetTaskById(req.query.id, req.session.active_user_login);
//     //console.log("TaskDetailObj===================================================",TaskDetailObj)
//     for (var ph of TaskDetailObj) {
//       const PhaseObject = JSON.stringify(ph);
//       const to_do_data = JSON.parse(PhaseObject);
//       //console.log("to do deta ",to_do_data.ppts_assign_to)
//       let professionalObj = await PropertyProfessionalHelper.GetProfessionalById(to_do_data.ppts_assign_to);
//       if (professionalObj) {
//         for (var Prof_fullname of professionalObj) {
//           to_do_data.professionalName = Prof_fullname.sps_fullname
//           todoArray.push(to_do_data);

//         }
//       }
//     }
//     //console.log("todoArray=======================",todoArray);

//     //console.log("todoArray", todoArray);
//     PropertiesSchema.find({ _id: req.query.id, ps_is_active_user_flag: req.session.active_user_login }).then(async (data) => {
//       if (data) {

//         let arr = [];
//         for (let img of data) {
//           await PropertiesPictureSchema.find({ pps_property_id: img._id, pps_is_active_user_flag: req.session.active_user_login }).then(async (result) => {
//             //let temp = await result
//             for (let image of result) {
//               let temp = await image
//               arr.push(temp)
//             }

//           })

//         }

//         err_msg = req.flash('err_msg');
//         success_msg = req.flash('success_msg');
//         res.render('mydreamhome-details-chainproperty', {
//           err_msg, success_msg, layout: false,
//           session: req.session,
//           propertyDetailData: data,
//           propertyImage: arr,
//           hiredProfeshnoalList: serviceProvArray,
//           allDocumentUploadByCustmer: allDocumentUploadByCustmer,
//           TaskDetailObj: todoArray,
//           totalcost: sumof,
//           moment: moment,
//           propertyArray: allProperties,

//         });
//       }
//     }).catch((err) => {
//       console.log(err)
//     })
//   } else {
//     res.redirect('/mydreamhome');
//   }
// })





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
  console.log("current user session is :", req.session);
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  req.session.pagename = 'dashboard';
  res.render('dashboard', {
    err_msg, success_msg, layout: false,
    session: req.session,
  });
});




app.get('/track-your-progress', isCustomer, async (req, res) => {
  console.log("current user session is :", req.session);
  req.session.pagename = 'track-your-progress';
  let AllProperty = await PropertiesSchema.find({ $and: [{ ps_user_id: req.session.user_id, ps_is_active_user_flag: req.session.active_user_login }] })
  if (AllProperty) {
    err_msg = req.flash('err_msg');
    success_msg = req.flash('success_msg');
    res.render('track-your-progress', {
      err_msg, success_msg, layout: false,
      session: req.session,
      AllProperty: AllProperty
    });
  }

});

app.get('/professionals', isCustomer, async (req, res) => {
  console.log("current user session is :", req.session);
  req.session.pagename = 'professionals';
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
            console.log('spp id:', sp_id._id)
            let professionalRating = await RatingSchema.find({ sprs_service_provider_id: sp_id._id })
            console.log('professionalRating:', professionalRating)
            var sumRating = 0;
            for (var RatingData of professionalRating) {
              sumRating += parseInt(RatingData.sprs_rating);
            }
            let avgRating = Math.round(sumRating / professionalRating.length);
            if (!isNaN(avgRating)) {
              avgRating = avgRating.toFixed(1);
            } else {
              avgRating = 0;
            }

            console.log("avgRating:", avgRating);
            const spProvider = JSON.stringify(sp_id);
            const parseSpProvider = JSON.parse(spProvider);
            parseSpProvider.professionalBody = otherDetails.spods_professional_body
            parseSpProvider.avgRating = avgRating;
            serviceProvArray.push(parseSpProvider);
            //console.log("service_provider Array list in loop:", serviceProvArray);
          }
        });
      }
      // console.log("service_provider Array list is:", serviceProvArray);
      res.render('professionals', {
        err_msg, success_msg, layout: false,
        session: req.session,
        data: serviceProvArray
      });
    }
  })
});

app.get('/myprofessionals', isCustomer, async (req, res) => {
  req.session.pagename = 'professionals';
  console.log("current user session is :", req.session);
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  let AllhiredProfeshnoal = await PropertyProfessionalSchema.find({ pps_user_id: req.session.user_id, pps_is_active_user_flag: req.session.active_user_login });
  console.log('AllhiredProfeshnoal', AllhiredProfeshnoal);
  let serviceProvArray = [];
  for (var k of AllhiredProfeshnoal) {
    await ServiceProviderSchema.find({ _id: k.pps_service_provider_id }).then(async (allProfeshnoals) => {
      for (let i of allProfeshnoals) {

        let professionalRating = await RatingSchema.find({ sprs_service_provider_id: i._id })
        console.log('professionalRating:', professionalRating)
        var sumRating = 0;
        for (var RatingData of professionalRating) {
          sumRating += parseInt(RatingData.sprs_rating);
        }
        let avgRating = Math.round(sumRating / professionalRating.length);
        if (!isNaN(avgRating)) {
          avgRating = avgRating.toFixed(1);
        } else {
          avgRating = 0;
        }
        console.log('avgRating:', avgRating)


        let temps = await i

        const spProvider = JSON.stringify(temps);
        const parseSpProvider = JSON.parse(spProvider);
        parseSpProvider.avgRating = avgRating
        serviceProvArray.push(parseSpProvider)
      }
    });
  }
  //const UserviceProvArray = [...new Set(serviceProvArray.map(item => item))]; // [ 'A', 'B']

  const UserviceProvArray = [...new Map(serviceProvArray.map(item => [item['_id'], item])).values()];

  //const UserviceProvArray = [ ...new Set(serviceProvArray)]  
  console.log('serviceProvArray:', UserviceProvArray)
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  res.render('myprofessionals', {
    err_msg, success_msg, layout: false,
    session: req.session,
    data: UserviceProvArray
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
  req.session.pagename = 'professionals';
  req.session.currentSarviceProviderId = req.query.id
  ServiceProviderSchema.findOne({ _id: req.query.id }).then(async service_provider_detail => {
    if (service_provider_detail) {

      let hiredProfeshnoal = await PropertyProfessionalSchema.findOne({ pps_user_id: req.session.user_id, pps_is_active_user_flag: req.session.active_user_login, pps_service_provider_id: req.query.id });
      console.log('AllhiredProfeshnoal', hiredProfeshnoal);
      let serviceProvArray = [];

      //spods_service_provider_id
      let serviceProOtherDetail = await ServiceProviderOtherDetailsSchema.findOne({ spods_service_provider_id: service_provider_detail._id });
      console.log('serviceProOtherDetail:', serviceProOtherDetail)
      let portpolioImage = await ServiceProviderPortfolioSchema.find({ spps_service_provider_id: req.query.id })

      let professionalRating = await RatingSchema.find({ sprs_service_provider_id: req.query.id }).sort({ _id: -1 })
      console.log('professionalRating:', professionalRating)


      var sumRating = 0;
      for (var RatingData of professionalRating) {
        sumRating += parseInt(RatingData.sprs_rating);
      }
      let avgRating = Math.round(sumRating / professionalRating.length);
      if (!isNaN(avgRating)) {
        avgRating = avgRating.toFixed(1);
      } else {
        avgRating = 0;
      }


      err_msg = req.flash('err_msg');
      success_msg = req.flash('success_msg');
      res.render('professionals-detail', {
        err_msg, success_msg, layout: false,
        session: req.session,
        service_provider_detail: service_provider_detail,
        serviceProOtherDetail: serviceProOtherDetail,
        portpolioImage: portpolioImage,
        professionalRating: professionalRating,
        hiredProfeshnoal: hiredProfeshnoal,
        avgRating:avgRating,
        moment: moment
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

// All Professional Filter Role
app.get('/professionals-filter', isCustomer, (req, res) => {
  req.session.pagename = 'professionals';
  console.log('role data:', req.query.role);
  ServiceProviderSchema.find({ sps_role_name: req.query.role }).then(async service_provider_detail => {
    if (service_provider_detail) {


      let serviceProvArray = [];
      for (var sp_id of service_provider_detail) {
        await ServiceProviderOtherDetailsSchema.findOne({ spods_service_provider_id: sp_id._id }).then(async otherDetails => {
          if (otherDetails) {
            //console.log("other Details of customers", otherDetails);
            const spProvider = JSON.stringify(sp_id);
            const parseSpProvider = JSON.parse(spProvider);
            parseSpProvider.professionalBody = otherDetails.spods_professional_body
            serviceProvArray.push(parseSpProvider);
            //console.log("service_provider Array list in loop:", serviceProvArray);
          }
        });
      }




      console.log('service_provider_detail:', serviceProvArray)
      err_msg = req.flash('err_msg');
      success_msg = req.flash('success_msg');
      res.send({
        err_msg, success_msg, layout: false,
        session: req.session,
        filterData: serviceProvArray
      })
    }
  }).catch((err) => {
    console.log(err)
  })
});

// All Professional Filter name surname qualification
app.get('/professionals-searchbar', (req, res) => {
  req.session.pagename = 'professionals';
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
          ServiceProviderSchema.find({ _id: { $in: unique } }).then(async service_provider_detail => {

            let serviceProvArray = [];
            for (var sp_id of service_provider_detail) {
              await ServiceProviderOtherDetailsSchema.findOne({ spods_service_provider_id: sp_id._id }).then(async otherDetails => {
                if (otherDetails) {
                  //console.log("other Details of customers", otherDetails);
                  const spProvider = JSON.stringify(sp_id);
                  const parseSpProvider = JSON.parse(spProvider);
                  parseSpProvider.professionalBody = otherDetails.spods_professional_body
                  serviceProvArray.push(parseSpProvider);
                  //console.log("service_provider Array list in loop:", serviceProvArray);
                }
              });
            }


            res.send({
              err_msg, success_msg, layout: false,
              session: req.session,
              filterData: serviceProvArray
            })
          });
        }
      });
    });
  }).catch((err) => {
    console.log(err)
  })
});


// My professional filter role
app.get('/my-professionals-filter', isCustomer, async (req, res) => {
  req.session.pagename = 'professionals';
  let AllhiredProfeshnoal = await PropertyProfessionalSchema.find({ pps_user_id: req.session.user_id, pps_is_active_user_flag: req.session.active_user_login });
  let serviceProvArray = [];
  for (var k of AllhiredProfeshnoal) {
    await ServiceProviderSchema.find({ $and: [{ _id: k.pps_service_provider_id, sps_role_name: req.query.role }] }).then(async (allProfeshnoals) => {
      for (let i of allProfeshnoals) {
        let temps = await i
        serviceProvArray.push(temps)
      }
    });
  }
  res.send({
    err_msg, success_msg, layout: false,
    session: req.session,
    data: serviceProvArray
  });

});


// My Professional Filter name surname qualification
app.get('/my-professionals-searchbar', async (req, res) => {
  req.session.pagename = 'professionals';
  let professionalIDs = [];
  let AllhiredProfeshnoal = await PropertyProfessionalSchema.find({ pps_user_id: req.session.user_id, pps_is_active_user_flag: req.session.active_user_login });
  let AllhiredProfeshnoalID = [];
  let serviceProvArray = [];

  //console.log('MYYYY AllhiredProfeshnoal:',AllhiredProfeshnoal);
  for (var k of AllhiredProfeshnoal) {
    await AllhiredProfeshnoalID.push(k.pps_service_provider_id.toString());
  }

  console.log('MYYYY AllhiredProfeshnoalID:', AllhiredProfeshnoalID);

  ServiceProviderSchema.find({ _id: { $in: AllhiredProfeshnoalID }, sps_fullname: new RegExp(req.query.searchKeyword, 'i') }).then(service_provider_detail1 => {
    ServiceProviderPersonalDetailsSchema.find({ spods_service_provider_id: { $in: AllhiredProfeshnoalID }, spods_surname: new RegExp(req.query.searchKeyword, 'i') }).then(service_provider_detail2 => {
      ServiceProviderEducationSchema.find({ spes_service_provider_id: { $in: AllhiredProfeshnoalID }, spes_qualification_obtained: new RegExp(req.query.searchKeyword, 'i') }).then(service_provider_detail3 => {
        if (service_provider_detail1 || service_provider_detail2 || service_provider_detail3) {
          err_msg = req.flash('err_msg');
          success_msg = req.flash('success_msg');
          var service_provider_detail = service_provider_detail1.concat(service_provider_detail2, service_provider_detail3);
          console.log('MYYYY service_provider_detail:', AllhiredProfeshnoal);

          service_provider_detail.forEach(async function (providerData) {
            if (("spes_service_provider_id" in providerData) == true) {
              await professionalIDs.push(providerData.spes_service_provider_id.toString());
            } else if (('spods_service_provider_id' in providerData) == true) {
              await professionalIDs.push(providerData.spods_service_provider_id.toString());
            } else {
              await professionalIDs.push(providerData._id.toString());
            }
          });

          console.log('MYYYY professionalIDs:', professionalIDs);

          let unique = [...new Set(professionalIDs)];

          console.log('MYYYY unique:', unique);


          ServiceProviderSchema.find({ _id: { $in: unique } }).then(async service_provider_detail => {
            for (var sp_id of service_provider_detail) {
              await ServiceProviderOtherDetailsSchema.findOne({ spods_service_provider_id: sp_id._id }).then(async otherDetails => {
                if (otherDetails) {
                  //console.log("other Details of customers", otherDetails);
                  const spProvider = JSON.stringify(sp_id);
                  const parseSpProvider = JSON.parse(spProvider);
                  parseSpProvider.professionalBody = otherDetails.spods_professional_body
                  serviceProvArray.push(parseSpProvider);
                  //console.log("service_provider Array list in loop:", serviceProvArray);
                }
              });
            }
            res.send({
              err_msg, success_msg, layout: false,
              session: req.session,
              filterData: serviceProvArray
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
  req.session.pagename = 'mydreamhome';
  //console.log('property id is :', req.session.property_id);
  //req.session.property_id=req.query.id
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  let property = await PropertiesSchema.findOne({ _id: req.session.property_id, ps_is_active_user_flag: req.session.active_user_login });
  const allDocument = await CustomerUploadDocsSchema.find({ $and: [{ cuds_customer_id: req.session.user_id, cuds_property_id: req.session.property_id, cuds_is_active_user_flag: req.session.active_user_login }] });
  //const propertyDataObj = await PropertiesSchema.find();
  let AllhiredProfeshnoal = await PropertyProfessionalSchema.find({ pps_user_id: req.session.user_id, pps_is_active_user_flag: req.session.active_user_login });
  //console.log('AllhiredProfeshnoal', AllhiredProfeshnoal);
  let serviceProvArray = [];
  for (var k of AllhiredProfeshnoal) {
    await ServiceProviderSchema.find({ _id: k.pps_service_provider_id }).then(async (allProfeshnoals) => {
      for (let i of allProfeshnoals) {
        var object_as_string = JSON.stringify(i);
        const t = JSON.parse(object_as_string);
        t.pps_property_id = k.pps_property_id;
        let temps = await t
        temps.pps_user_id = k.pps_user_id;
        let tempsData = await temps
        serviceProvArray.push(temps)
      }
    });
  }

  console.log('permisionnnn faa:', serviceProvArray)

  res.render('mydreamhome-details-docs', {
    err_msg, success_msg, layout: false,
    session: req.session,
    data: serviceProvArray,
    allDocument: allDocument,//need to show property wise document still showing all uploaded
    property: property,
    moment: moment
  });



  // ServiceProviderSchema.find({ sps_status: 'active', }).then(service_provider => {
  //   if (!service_provider) {
  //     console.log("Service Provider not found");
  //     return res.status(400).json("Service Provider not found")
  //   }
  //   else {
  //     res.render('mydreamhome-details-docs', {
  //       err_msg, success_msg, layout: false,
  //       session: req.session,
  //       data: service_provider,
  //       allDocument: allDocument,//need to show property wise document still showing all uploaded
  //       property: property,
  //       moment: moment
  //     });
  //   }

  // })
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
app.get('/mydreamhome-details-to-dos', isCustomer, async (req, res) => {
  req.session.pagename = 'mydreamhome-details-to-dos';
  console.log('property id  mydreamhome-details-to-dos', req.session.property_id, req.session.active_user_login);
  if (req.session.property_id) {
    let pps_property_id = req.session.property_id;
    let pps_is_active_user_flag = req.session.active_user_login
    let TaskDetailObj = await propertyDetail.GetPropertById(pps_property_id, pps_is_active_user_flag);
    if (TaskDetailObj) {
      console.log("TaskDetailObj:", TaskDetailObj)

      err_msg = req.flash('err_msg');
      success_msg = req.flash('success_msg');
      res.render('mydreamhome-details-to-dos', {
        err_msg, success_msg, layout: false,
        session: req.session,
        moment: moment,
        TaskDetailObj: TaskDetailObj

      });
    } else {
      console.log('TaskDetailObj not found')
    }

  } else {
    console.log('error in mydreamhome-details-to-dos get api')
    res.redirect('/mydreamhome')
  }

});
// app.get('/add-property', isCustomer, (req, res) => {
//   err_msg = req.flash('err_msg');
//   success_msg = req.flash('success_msg');
//   res.render('add-property', {
//     err_msg, success_msg, layout: false,
//     session: req.session
//   });
// });
app.get('/add-property', isCustomer, async(req, res) => {
  //req.session.propertyEditId
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  console.log("deep:==",req.query)
  if (req.query.property_id != null) {
    
    var property_id = req.query.property_id;
    var active_user = req.session.active_user_login;
    req.session.propertyEditId = property_id
    let propertyObj = await propertyDetail.GetPropertById(property_id, active_user);
    let propertyImageObject = await propertyDetail.GetPropertImageById(property_id, active_user);
    let propertyPlanImageObject = await propertyDetail.GetPropertPlanImageById(property_id, active_user);
    // console.log("propertyObj",propertyObj)
    // console.log("propertyImageObject",propertyImageObject)
    // console.log("propertyPlanImageObject",propertyPlanImageObject)
    res.render('add-property', {
    err_msg, success_msg, layout: false,
    session: req.session,
    propertyObj:propertyObj,
    propertyImageObject:propertyImageObject,
    propertyPlanImageObject:propertyPlanImageObject

  });
}else{
 
  res.render('add-property', {
    err_msg, success_msg, layout: false,
    session: req.session,
    propertyObj:'null'
  });
}
});


app.get('/mydreamhome-details-message', isCustomer, async (req, res) => {
  req.session.pagename = 'mydreamhome';
  var newData = [];
  console.log(' property id  :', req.session.property_id);
  console.log('helooooo', req.query.pid);
  req.session.professional_id = req.query.pid;
  let property = await PropertiesSchema.findOne({ _id: req.session.property_id, ps_is_active_user_flag: req.session.active_user_login });

  // let AllhiredProfeshnoal = await PropertyProfessionalSchema.find({pps_user_id:req.session.user_id});
  // let serviceProvArray = [];
  // for (var k of AllhiredProfeshnoal) {
  //   await ServiceProviderSchema.find({ _id: k.pps_service_provider_id }).then(async (allProfeshnoals) => {
  //     await  MessageSchema.find({
  //           $or: [
  //               { $and: [ {sms_sender_id:req.session.user_id}, {sms_receiver_id:k.pps_service_provider_id} ] },
  //               { $and: [ {sms_sender_id:k.pps_service_provider_id}, {sms_receiver_id:req.session.user_id} ] }
  //           ]
  //       }).then(async (msgdata) => {
  //             console.log('msgdata=',msgdata[0])
  //             for (let i of allProfeshnoals) {
  //               if(msgdata.length > 0){
  //                 var object_as_string = JSON.stringify(i);  
  //                 const t =  JSON.parse(object_as_string);
  //                 console.log('lastIndex:',msgdata.slice(-1)[0]);
  //                 let msgData = msgdata.slice(-1)[0];
  //                 t.sms_message = msgData.sms_message;
  //                 //let temps = await i
  //                 serviceProvArray.push(t)
  //               }else{
  //                 var object_as_string = JSON.stringify(i);  
  //                 const t =  JSON.parse(object_as_string);
  //                 t.sms_message ='...';
  //                 //let temps = await i
  //                 serviceProvArray.push(t)
  //               }
  //             }
  //       })
  //   });
  // }

  await MessageSchema.find({
    $or: [
      { $and: [{ sms_sender_id: property.ps_user_id }, { sms_receiver_id: req.query.pid }, { sms_property_id: req.session.property_id }, { sms_is_active_user_flag: req.session.active_user_login }] },
      { $and: [{ sms_sender_id: req.query.pid }, { sms_receiver_id: property.ps_user_id }, { sms_property_id: req.session.property_id }] }
    ]
  }).then(async (data) => {
    if (data) {
      for (let providerData of data) {
        var today = new Date();
        var date = today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date + ' ' + time;


        //  var today1 = new Date(providerData.sms_msg_Date);
        // var date1 = today1.getFullYear() + '/' + (today1.getMonth() + 1) + '/' + today1.getDate();
        //  var time1 = today1.getHours() + ":" + today1.getMinutes() + ":" + today1.getSeconds();
        //var dateTime1 = date1 + ' ' + time1;

        //var msg_time = timeDiffCalc(new Date(dateTime), new Date(dateTime1));

        //var object_as_string = JSON.stringify(providerData);
        //const t = JSON.parse(object_as_string);
        //t.msgTime = msg_time;
        //await ServiceProviderSchema.findOne({ _id: t.sms_sender_id }).then(async professional => {
        // if (professional) {
        //  console.log('professional:', professional.sps_fullname);
        // t.senderName = await professional.sps_fullname;
        //console.log('providerData xxxx New:',t);
        //} else {
        // t.senderName = await 'You';
        //}



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

    }
  }).catch((err) => {
    console.log(err)
  })



  console.log('property:', property)

  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  res.render('mydreamhome-details-message', {
    err_msg, success_msg, layout: false,
    session: req.session,

    property: property,
    professional_id: req.query.pid,
    chatData: newData
    //hiredProfeshnoalList:serviceProvArray
  });
})

app.get('/professionals-detail-message', (req, res) => {
  req.session.pagename = 'professionals';
  console.log('helooooo', req.query);
  //return
  var newData = [];
  ServiceProviderSchema.find({ _id: req.query.spp_id }).then(service_provider_detail => {

    if (service_provider_detail) {
      MessageSchema.find({
        $or: [
          { $and: [{ sms_sender_id: req.query.cus_id }, { sms_receiver_id: req.query.spp_id }, { sms_is_active_user_flag: req.session.active_user_login }] },
          { $and: [{ sms_sender_id: req.query.spp_id }, { sms_receiver_id: req.query.cus_id }] }
        ]
      }).then(async (data) => {
        if (data) {
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
  req.session.pagename = 'professionals';
  //console.log('spp_id', req.query.spp_id)
  var PropertyList = [];
  var SarviceProviderId = req.session.currentSarviceProviderId
  if (SarviceProviderId) {
    // if(req.session.user_id)
    var property = await PropertiesSchema.find({ ps_user_id: req.session.user_id, ps_is_active_user_flag: req.session.active_user_login });
    console.log('property====', property)
    var serviceProvider = await ServiceProviderSchema.findOne({ _id: SarviceProviderId });
    //console.log('service_provider=+++',serviceProvider)

    for (let propertyData of property) {
      var propertyExist = await PropertyProfessionalSchema.findOne({ pps_user_id: propertyData.ps_user_id, pps_property_id: propertyData._id, pps_service_provider_id: SarviceProviderId });
      console.log('propertyExist:', propertyExist);
      if (propertyExist == null) {
        console.log('Hello coming..')
        PropertyList.push(propertyData);
      }
    }
    console.log('PropertyList Arr:', PropertyList);


    if (serviceProvider) {
      err_msg = req.flash('err_msg');
      success_msg = req.flash('success_msg');
      res.render('professionals-hirenow', {
        err_msg, success_msg, layout: false,
        session: req.session,
        serviceProvider: serviceProvider,
        property: PropertyList
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
// app.get('/mydreamhome-details-phase-a', isCustomer, async(req, res) => {
//   req.session.pagename = 'mydreamhome';
//   err_msg = req.flash('err_msg');
//   success_msg = req.flash('success_msg');
//   res.render('mydreamhome-details-phase-a', {
//     err_msg, success_msg, layout: false,
//     session: req.session,

//   });
// })






app.get('/mydreamhome-details-phase-a', isCustomer, async (req, res) => {
  console.log('req:', req.session.property_id);
  var propertyData = await propertyDetail.GetPropertById(req.query.id, req.session.active_user_login);
  var taskObject = await TaskHelper.GetTaskById(req.query.id, req.session.active_user_login)
  console.log('taskObject', taskObject)
  console.log("propertyData===", propertyData)
  if (taskObject) {
    // return res.send({
    //   'status':true,
    //   'data':taskObject,
    //   'redairect':'/mydreamhome-details-phase-a'
    // })
    req.session.pagename = 'mydreamhome';
    err_msg = req.flash('err_msg');
    success_msg = req.flash('success_msg');
    res.render('mydreamhome-details-phase-a', {
      err_msg, success_msg, layout: false,
      session: req.session,
      taskObject: taskObject,
      propertyData: propertyData
    });
  }


})
// app.get('/mydreamhome', isCustomer, (req, res) => {
//   err_msg = req.flash('err_msg');
//   success_msg = req.flash('success_msg');
//   res.render('mydreamhome', {
//     err_msg, success_msg, layout: false,
//     session: req.session
//   });
// })
//*************************property data display on mydream home page
app.get('/mydreamhome', isCustomer, async (req, res) => {
  req.session.pagename = 'mydreamhome';
  console.log("current session is", req.session);
  PropertiesSchema.find({ ps_user_id: req.session.user_id, ps_is_active_user_flag: req.session.active_user_login }).then(async (data) => {
    if (data) {
      let arr = [];

      for (let img of data) {
        await PropertiesPictureSchema.find({ pps_property_id: img._id, pps_is_active_user_flag: req.session.active_user_login }).then(async (result) => {

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
app.post('/getPropertyDetail', isCustomer, async (req, res) => {
  req.session.pagename = 'mydreamhome';
  console.log('getProperty-detail:', req.body)
  console.log('session property id', req.body.property_id);
  req.session.property_id = req.body.property_id
  let AllhiredProfeshnoal = await PropertyProfessionalSchema.find({ pps_user_id: req.session.user_id, pps_is_active_user_flag: req.session.active_user_login });
  let allDocumentUploadByCustmer = await CustomerUploadDocsSchema.find({ cuds_customer_id: req.session.user_id, cuds_is_active_user_flag: req.session.active_user_login });
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
  PropertiesSchema.find({ _id: req.body.property_id, ps_is_active_user_flag: req.session.active_user_login }).then(async (data) => {
    if (data) {

      let arr = [];
      for (let img of data) {
        await PropertiesPictureSchema.find({ pps_property_id: img._id, pps_is_active_user_flag: req.session.active_user_login }).then(async (result) => {
          //let temp = await result
          for (let image of result) {
            let temp = await image
            arr.push(temp)
          }

        })

      }
      console.log("data",data)
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

      //console.log(serviceProvArray)
    }
  }).catch((err) => {
    console.log(err)
  })


})
function tallyVotes(AllhiredProfeshnoal) {
  return AllhiredProfeshnoal.reduce((total, i) => total + i.pps_pofessional_budget, 0);
}
function timeDifference(data) {
  var date = [];
  data.forEach(function (item) {
    var startDate = "";
    var endDate = "";
    let diffInMilliSeconds;
    var days = "";
    console.log("start date" + item.start_date + " end Date" + item.end_date);
    // message = message + calcDate(item.start_date, item.end_date);
    startDate = new Date(Date.parse(item.start_date));
    endDate = new Date(Date.parse(item.end_date));
    diffInMilliSeconds = Math.abs(endDate - startDate) / 1000;
    // calculate days
    days = Math.floor(diffInMilliSeconds / 86400);
    date.push(days);

    console.log("total date is :", days);
  });
  var estimated_time = date.reduce((total, i) => total + i, 0);
  var message = "";
  if (estimated_time > 365) {
    var year = Math.floor(estimated_time / 365);
    var days = estimated_time % 365;
    if (days > 31) {
      var months = Math.floor(days / 31);
      var day = days % 31;
      message += year + " year " + months + " months " + day + " days"
    }
  }
  else if (estimated_time > 31) {
    var months = Math.floor(estimated_time / 31);
    var day = estimated_time % 31;
    message += months + " months " + day + " days"
  } else {
    message += estimated_time + " days "
  }
  console.log("estimated_time :", message);
  return message;
}


app.get('/mydreamhome-details', isCustomer, async (req, res) => {
  //console.log("current session is", req.session);
  //console.log('session property id', req.query.id);
  req.session.pagename = 'mydreamhome';
  if (req.query.id) {
    req.session.property_id = req.query.id
    let AllhiredProfeshnoal = await PropertyProfessionalSchema.find({ $and: [{ pps_user_id: req.session.user_id, pps_property_id: req.query.id, pps_is_active_user_flag: req.session.active_user_login }] });
    let allDocumentUploadByCustmer = await CustomerUploadDocsSchema.find({ $and: [{ cuds_customer_id: req.session.user_id, cuds_property_id: req.query.id, cuds_is_active_user_flag: req.session.active_user_login }] });
    console.log('AllhiredProfeshnoal', AllhiredProfeshnoal);
    let serviceProvArray = [];
    let totalcostArray = [];
    var cost = 0;
    var to = [1, 2, 3]
    //var sumof = tallyVotes(to)
    var sumof = tallyVotes(AllhiredProfeshnoal)
    console.log("sumofsumofsumofsumofsumof", sumof)
    for (var k of AllhiredProfeshnoal) {
      var costs = parseInt(k.pps_pofessional_budget);

      cost = await parseInt(cost + costs);

      totalcostArray.push(cost)
      await ServiceProviderSchema.find({ _id: k.pps_service_provider_id }).then(async (allProfeshnoals) => {
        //console.log('allProfeshnoals:', allProfeshnoals)
        await MessageSchema.find({
          $or: [
            { $and: [{ sms_sender_id: req.session.user_id }, { sms_receiver_id: k.pps_service_provider_id }, { sms_is_active_user_flag: req.session.active_user_login }] },
            { $and: [{ sms_sender_id: k.pps_service_provider_id }, { sms_receiver_id: req.session.user_id }] }
          ]
        }).then(async (msgdata) => {
          //console.log('msgdata=', msgdata)
          for (let i of allProfeshnoals) {
            if (msgdata.length > 0) {
              var object_as_string = JSON.stringify(i);
              const t = JSON.parse(object_as_string);
              // console.log('lastIndex:', msgdata.slice(-1)[0]);
              let msgData = msgdata.slice(-1)[0];
              t.sms_message = msgData.sms_message;
              //let temps = await i
              serviceProvArray.push(t)
            } else {
              var object_as_string = JSON.stringify(i);
              const t = JSON.parse(object_as_string);
              t.sms_message = '...';
              //let temps = await i


              serviceProvArray.push(t)
            }
          }
        })
      });
    }
    let todoArray = [];
    var c = 0;
    let TaskDetailObj = await TaskHelper.GetTaskById(req.query.id, req.session.active_user_login);
    console.log("TaskDetailObj===================================================",TaskDetailObj)
    for (var ph of TaskDetailObj) {
      const PhaseObject = JSON.stringify(ph);
      const to_do_data = JSON.parse(PhaseObject);
      //console.log("to do deta ",to_do_data.ppts_assign_to)
      let professionalObj = await PropertyProfessionalHelper.GetProfessionalById(to_do_data.ppts_assign_to);
      if (professionalObj) {
        for (var Prof_fullname of professionalObj) {
          to_do_data.professionalName = Prof_fullname.sps_fullname


          todoArray.push(to_do_data);

        }

      }




    }
    //console.log("todoArray=======================",todoArray);

    //console.log("todoArray", todoArray);
    PropertiesSchema.find({ _id: req.query.id, ps_is_active_user_flag: req.session.active_user_login }).then(async (data) => {
      if (data) {

        console.log("Property Data is *************************", data[0].ps_phase_array);
        //var totaldiff = "";
        var message = timeDifference(data[0].ps_phase_array);

        let arr = [];
        for (let img of data) {
          await PropertiesPictureSchema.find({ pps_property_id: img._id, pps_is_active_user_flag: req.session.active_user_login }).then(async (result) => {
            //let temp = await result
            for (let image of result) {
              let temp = await image
              arr.push(temp)
            }

          })

        }
         console.log("data=======================",data)
        err_msg = req.flash('err_msg');
        success_msg = req.flash('success_msg');
        res.render('mydreamhome-details', {
          err_msg, success_msg, layout: false,
          session: req.session,
          propertyDetailData: data,
          propertyImage: arr,
          hiredProfeshnoalList: serviceProvArray,
          allDocumentUploadByCustmer: allDocumentUploadByCustmer,
          TaskDetailObj: todoArray,
          totalcost: sumof,
          estimated_time: message,
          moment: moment

        });
      }
    }).catch((err) => {
      console.log(err)
    })
  } else {
    res.redirect('/mydreamhome');
  }
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

  var newData = [];
  MessageSchema.find({
    $or: [
      { $and: [{ sms_sender_id: req.query.sms_sender_id }, { sms_receiver_id: req.query.sms_receiver_id }, { sms_is_active_user_flag: req.session.active_user_login }] },
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



app.get('/get-message-property', async (req, res) => {
  var newData = [];
  var newData1 = [];
  MessageSchema.find({
    $or: [
      { $and: [{ sms_sender_id: req.query.sms_sender_id }, { sms_receiver_id: req.query.sms_receiver_id }, { sms_property_id: req.query.sms_property_id }, { sms_is_active_user_flag: req.session.active_user_login }] },
      { $and: [{ sms_sender_id: req.query.sms_receiver_id }, { sms_receiver_id: req.query.sms_sender_id }, { sms_property_id: req.query.sms_property_id }] }
    ]
  }).then(async (data) => {
    if (data) {
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
        //console.log('t:', t);
        t.msgTime = msg_time;
        await ServiceProviderSchema.findOne({ _id: t.sms_sender_id }).then(async professional => {
       // await ServiceProviderSchema.find({ $or: [ { _id: t.sms_sender_id }, { _id: t.sms_receiver_id } ] }).then(async professional => {
          if (professional) {
            //console.log('professional:',professional.sps_fullname);
            t.senderName = await professional.sps_fullname;
            //console.log('providerData xxxx New:',t);
          }

        });
        const s = await t;
       // console.log('providerData New:', s);

        //newData.push(s);
        //var object_as_string1 = JSON.stringify(newData);
       // const tt = JSON.parse(object_as_string1);
        //console.log('tt--===:', tt);

        await CustomerSchema.findOne({ _id: s.sms_sender_id }).then(async customer => {
        //await CustomerSchema.find({ $or: [ { _id: t.sms_sender_id }, { _id: t.sms_receiver_id } ] }).then(async customer => {
          if (customer) {
            //console.log('professional:',professional.sps_fullname);
            s.senderName = await customer.cus_fullname;
            s.sms_user_profile_img = await customer.cus_profile_image_name;
            //console.log('providerData xxxx New:',t);
          }

        });
        const ss = await s;
       // console.log('providerData Newssssss:', ss);
        newData.push(ss);
        

      }
       console.log('Get newData',newData);
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
      { $and: [{ sms_sender_id: req.query.cus_id }, { sms_receiver_id: req.query.spp_id }, { sms_is_active_user_flag: req.session.active_user_login }] },
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

    difference = (days === 1) ? `${days} day ` : `${days} days ago `;
  } else if (hours > 0) {
    difference = (hours === 0 || hours === 1) ? `${hours} hour ` : `${hours} hours ago`;
  } else if (minutes > 0) {
    difference = (minutes === 0 || hours === 1) ? `${minutes} minutes` : `${minutes} minutes ago`;
  } else {
    difference = 'just now';

  }

  return difference;
}




app.get('/buyer', isCustomer, function (req, res) {
  console.log("buyer");
  var test = req.session.is_user_logged_in;
  var active_user = req.session.active_user_login;
  if (test == true && active_user != 'buyer') {
    req.session.active_user_login = "buyer"
    //req.session.isChanged();
    res.redirect('/dashboard')
    console.log("current user login and session is", req.session);
  }

});


app.get('/seller', isCustomer, function (req, res) {
  console.log("seller");
  var test = req.session.is_user_logged_in;
  var active_user = req.session.active_user_login;
  if (test == true && active_user != 'seller') {
    req.session.active_user_login = "seller"
    //req.session.isChanged();
    res.redirect('/dashboard')
    console.log("current user login and session is", req.session);
  }
});


app.get('/renovator', isCustomer, function (req, res) {
  console.log("renovator");
  var test = req.session.is_user_logged_in;
  var active_user = req.session.active_user_login;
  if (test == true && active_user != 'renovator') {
    req.session.active_user_login = "renovator"
    //req.session.isChanged();
    res.redirect('/dashboard')
    console.log("current user login and session", req.session);
  }
});


app.get('/otp', function (req, res) {
  console.log("");

  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  res.render('otp', {
    err_msg, success_msg, layout: false,
    session: req.session
  });
});




app.get('/add-task', isCustomer, async function (req, res) {
  return new Promise(async function (resolve, reject) {
    console.log("current user session is :", req.session);
    err_msg = req.flash('err_msg');
    success_msg = req.flash('success_msg');
    await PropertyProfessionalSchema.find({ $and: [{ pps_user_id: req.session.user_id }] }).then(async (hiredProfessinoal) => {
      console.log(hiredProfessinoal)
      let profArray = [];
      let propArray = [];
      let pahseArray = [];
      if (hiredProfessinoal) {
        for (let k of hiredProfessinoal) {
          var profeshnoal = await ServiceProviderSchema.find({ _id: k.pps_service_provider_id });
          for (let i of profeshnoal) {
            var object_as_string = JSON.stringify(i);
            const t = JSON.parse(object_as_string);
            t.pps_property_id = await k.pps_property_id;
            let p = await t;
            profArray.push(p)
          }
          // profArray.push(profeshnoal)


        }
        //console.log("profArray",profArray)

        const uniqueObjects = [...new Map(profArray.map(item => [item._id, item])).values()];


        console.log("uniqueObjects", uniqueObjects)
        res.render('add-task', {
          err_msg, success_msg, layout: false,
          session: req.session,
          hiredProfessinoal: uniqueObjects,
          property: propArray,
          phaseData: pahseArray
        });
      }
    })
  })

});

app.get('/add-task-prfessional-property', isCustomer, async function (req, res) {
  return new Promise(async function (resolve, reject) {
    console.log("req.query.professionId :", req.query.professionId);

    console.log("req.query.professionId :", req.query.professionId);
    console.log("req.query.propertyId :", req.query.propertyId);
    err_msg = req.flash('err_msg');
    success_msg = req.flash('success_msg');
    //,pps_property_id:req.query.propertyId
    await PropertyProfessionalSchema.find({ $and: [{ pps_user_id: req.session.user_id, pps_service_provider_id: req.query.professionId }] }).then(async (hiredProfessinoal) => {
      console.log('hiredProfessinoalProperty:', hiredProfessinoal)
      let profArray = [];
      let propArray = [];
      let pahseArray = [];
      if (hiredProfessinoal) {
        for (let k of hiredProfessinoal) {
          var property = await PropertiesSchema.find({ _id: k.pps_property_id });
          for (let i of property) {
            var object_as_string = JSON.stringify(i);
            const t = JSON.parse(object_as_string);
            t.pps_service_provider_id = await k.pps_service_provider_id;

            let prop = await t;
            propArray.push(prop)
          }

        }
        console.log("pahseArray", propArray)
        res.send({
          err_msg, success_msg, layout: false,
          session: req.session,
          property: propArray
        });
      }
    })
  })
});

app.get('/add-task-prfessional-property-phase', isCustomer, async function (req, res) {
  return new Promise(async function (resolve, reject) {
    console.log("req.query.professionId :", req.query.professionId);
    console.log("req.query.propertyId :", req.query.propertyId);
    err_msg = req.flash('err_msg');
    success_msg = req.flash('success_msg');
    var pahseArray = [];
    var phase = await PropertiesPhaseSchema.find({ $and: [{ pps_professional_id: req.query.professionId, pps_property_id: req.query.propertyId }] });
    console.log('phase:', phase);
    for (let j of phase) {
      let phases = await j;
      pahseArray.push(phases)
    }


    console.log("pahseArray", pahseArray)
    res.send({
      err_msg, success_msg, layout: false,
      session: req.session,
      phases: pahseArray
    });
  })
})



app.get('/property-related-enquiry-proprty-list', isCustomer, async (req, res) => {
  req.session.pagename = 'mydreamhome';
  console.log("current session is", req.session);
  PropertiesSchema.find({ ps_user_id: req.session.user_id, ps_is_active_user_flag: req.session.active_user_login }).then(async (data) => {
    if (data) {
      let arr = [];
      err_msg = req.flash('err_msg');
      success_msg = req.flash('success_msg');
      res.send({
        err_msg, success_msg, layout: false,
        session: req.session,
        propertyData: data
      });
    }
  }).catch((err) => {
    console.log(err)
  })
})

app.get('/service-provider-by-property', async (req, res) => {
  let serviceProvArray = [];
  let AllhiredProfeshnoal = await PropertyProfessionalSchema.find({ pps_user_id: req.session.user_id, pps_property_id: req.query.property_id, pps_is_active_user_flag: req.session.active_user_login });
  for (var k of AllhiredProfeshnoal) {
    await ServiceProviderSchema.find({ _id: k.pps_service_provider_id }).then(async (allProfeshnoals) => {
      serviceProvArray.push(allProfeshnoals);
    });
  }
  res.send({
    session: req.session,
    hireServiceData: serviceProvArray
  });
});


app.get('/complaints', isCustomer, async (req, res) => {
  req.session.pagename = 'complaints';
  console.log("current session is here", req.session);
  ComplaintsSchema.find({ coms_user_id: req.session.user_id, coms_is_active_user_flag: req.session.active_user_login }).sort({ _id: -1 }).then(async (data) => {
    console.log('dataaa:', data)
    if (data) {
      let arr = [];
      err_msg = req.flash('err_msg');
      success_msg = req.flash('success_msg');
      res.render('complaints', {
        err_msg, success_msg, layout: false,
        session: req.session,
        complaintData: data
      });
    }
  }).catch((err) => {
    console.log(err)
  })
})


app.get('/complaints-detail', isCustomer, async (req, res) => {
  req.session.pagename = 'complaints';
  console.log('idddd:', req.query)

  let complaintData = await ComplaintsSchema.find({ coms_complaint_code: req.query.complaintID, coms_is_active_user_flag: req.session.active_user_login });
  await ComplaintDetailsSchema.find({ comsd_id: req.query.complaintID }).sort({ _id: -1 }).then(async (data) => {
    req.session.complaintID = req.query.complaintID;
    console.log('dataaa:', data)
    if (data) {
      let arr = [];
      err_msg = req.flash('err_msg');
      success_msg = req.flash('success_msg');
      res.render('complaints-detail', {
        err_msg, success_msg, layout: false,
        session: req.session,
        complaintDetailsData: data,
        complaintData: complaintData
      });
    }
  }).catch((err) => {
    console.log(err)
  })
});


app.get('/get-change-permision', isCustomer, async (req, res) => {
  req.session.pagename = 'mydreamhome';
  console.log('req.query:', req.query)
  await DocumentPermissionSchema.find({ dps_document_id: req.query.docId, dps_is_active_user_flag: req.session.active_user_login }).sort({ _id: -1 }).then(async (data) => {
    //req.session.complaintID = req.query.complaintID;
    console.log('dataaa:', data)
    if (data) {
      let arr = [];
      err_msg = req.flash('err_msg');
      success_msg = req.flash('success_msg');
      res.send({
        err_msg, success_msg, layout: false,
        session: req.session,
        permissionDetailsData: data,
      });
    }
  }).catch((err) => {
    console.log(err)
  })
});
app.get('/edit-property', isCustomer, async(req, res) => {
  //req.session.propertyEditId
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  console.log("edit:==",req.query)
  if (req.query.property_id != null) {
    
    var property_id = req.query.property_id;
    var active_user = req.session.active_user_login;
    req.session.propertyEditId = property_id
    let propertyObj = await propertyDetail.GetPropertById(property_id, active_user);
    let propertyImageObject = await propertyDetail.GetPropertImageById(property_id, active_user);
    let propertyPlanImageObject = await propertyDetail.GetPropertPlanImageById(property_id, active_user);
    // console.log("propertyObj",propertyObj)
    // console.log("propertyImageObject",propertyImageObject)
    // console.log("propertyPlanImageObject",propertyPlanImageObject)
    res.render('edit-property', {
    err_msg, success_msg, layout: false,
    session: req.session,
    propertyObj:propertyObj,
    propertyImageObject:propertyImageObject,
    propertyPlanImageObject:propertyPlanImageObject

  });
}else{
 
  res.render('edit-property', {
    err_msg, success_msg, layout: false,
    session: req.session,
    propertyObj:'null'
  });
}
});
app.get('/to-do-list', isCustomer, async (req, res) => {
  var err_msg=null;
  var success_msg=null;
  console.log("todo")
   req.session.pagename = 'to-do-list';
   let propertyObj = await propertyDetail.GetAllProperty(req.session.user_id,req.session.active_user_login);
  console.log('property in to-do-list', propertyObj);
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
 res.render('to-do-list', {
   err_msg, success_msg, layout: false,
   session: req.session,
   propertyObj:propertyObj,
   moment: moment,
   TaskDetailObj: []

 });


});

app.post('/get_property_by_id', isCustomer, async (req, res) => {
 
if(req.body.property_id){
  let singlePropertyObj = await propertyDetail.GetPropertById(req.body.property_id, req.session.active_user_login);
  console.log('singlePropertyObj', singlePropertyObj);
  if(singlePropertyObj){
    return res.send({
      'status':true,
      'message':'single property found success',
      'data':singlePropertyObj
    })
  }
}else{
  return res.send({
    'status':false,
    'message':'property id not found'
  })
}


});   
app.get('/take-action', isCustomer, async (req, res) => {
  
  console.log('from get take action url====',req.query)
  var property_id = req.query.prop;
  var phase_name = req.query.phase;
  var taskObject = await TaskHelper.GetTaskByPhaseName(property_id, phase_name,req.session.active_user_login);
  var propertyData = await propertyDetail.GetPropertById(property_id, req.session.active_user_login);
  console.log("taskObject by phase name take action",taskObject)

  
  if (taskObject) {
    // return res.send({
    //   'status':true,
    //   'data':taskObject,
    //   'redairect':'/mydreamhome-details-phase-a'
    // })
    req.session.pagename = 'to-do-list';
    err_msg = req.flash('err_msg');
    success_msg = req.flash('success_msg');
    res.render('mydreamhome-details-phase-a', {
      err_msg, success_msg, layout: false,
      session: req.session,
      taskObject: taskObject,
      propertyData: propertyData
    });
  }else{
    return res.send({
      'status':false,
      'message':'some thing wrong'
    })
  }


}) 

module.exports = app;




