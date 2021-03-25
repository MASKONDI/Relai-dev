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
const ServiceProviderLanguageSchema = require("../models/service_provider_languages");
const PropertiesPhaseSchema = require("../models/property_phase_schema");
const phaseDetail = require("./api/phaseDetail");
const propertyDetail = require("./api/propertyDetail");
const TaskHelper = require("./api/addTask");
const ComplaintsSchema = require("../models/Complaints");
const PropertyProfessionalHelper = require("./api/propertyProfessionalDetails")

//const ComplaintsSchema = require("../models/Complaints");
const ComplaintDetailsSchema = require("../models/complaint_details_model");
const NotificationSchema = require("../models/notification_modal");
const ServiceProviderUploadDocsSchema = require("../models/service_provider_upload_document")

const message = require('../models/message');

const DocumentPermissionSchema = require('../models/document_permission')
const RatingSchema = require("../models/service_provider_rating_Schema");
const PropertyProfessinoalTaskSchema = require("../models/property_professional_tasks_Schema");
const SubmitProposalSchema = require("../models/submit_proposal_schema");
var isCustomer = auth.isCustomer;
var isServiceProvider = auth.isServiceProvider;

//***Index or home page related routes */
app.get('/buy-sell', (req, res) => {
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  res.render('buy-sell', {
    err_msg, success_msg, layout: false,
    session: req.session
  });
})
app.get('/renovate', (req, res) => {
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  res.render('renovate', {
    err_msg, success_msg, layout: false,
    session: req.session
  });
})
app.get('/how-it-works', (req, res) => {
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  res.render('how-it-works', {
    err_msg, success_msg, layout: false,
    session: req.session
  });
})
app.get('/support', (req, res) => {
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  res.render('support', {
    err_msg, success_msg, layout: false,
    session: req.session
  });
})
app.get('/community', (req, res) => {
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  res.render('community', {
    err_msg, success_msg, layout: false,
    session: req.session
  });
})
app.get('/about-us', (req, res) => {
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  res.render('about-us', {
    err_msg, success_msg, layout: false,
    session: req.session
  });
})
app.get('/contact-us', (req, res) => {
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  res.render('contact-us', {
    err_msg, success_msg, layout: false,
    session: req.session
  });
})
app.get('/faq', (req, res) => {
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  res.render('faq', {
    err_msg, success_msg, layout: false,
    session: req.session
  });
})
app.get('/privacy-policy', (req, res) => {
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  res.render('privacy-policy', {
    err_msg, success_msg, layout: false,
    session: req.session
  });
})
app.get('/cookie-policy', (req, res) => {
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  res.render('cookie-policy', {
    err_msg, success_msg, layout: false,
    session: req.session
  });
})
app.get('/termandconditions', (req, res) => {
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  res.render('termandconditions', {
    err_msg, success_msg, layout: false,
    session: req.session
  });
})
app.get('/team', (req, res) => {
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  res.render('team', {
    err_msg, success_msg, layout: false,
    session: req.session
  });
})
app.get('/intro', (req, res) => {
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  res.render('intro', {
    err_msg, success_msg, layout: false,
    session: req.session
  });
})

app.get('/signin-intro', (req, res) => {
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  res.render('signin-intro', {
    err_msg, success_msg, layout: false,
    session: req.session
  });
})

app.get('/proposal', isCustomer, async (req, res) => {
  console.log("Current session is :", req.session);
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  req.session.pagename = 'proposal';
  var activeProposal = await SubmitProposalSchema.find({ sps_customer_id: req.session.user_id, sps_status: 'pending' });
  var activePropertyProposalArray = [];
  for (var propertyId of activeProposal) {
    console.log("property Id", propertyId);
    let propertyObj = await propertyDetail.GetPropertyById(propertyId.sps_property_id);
    let serviceProvider = await ServiceProviderSchema.findOne({ _id: propertyId.sps_service_provider_id });
    if (serviceProvider) {
      propertyObj.sp_name = serviceProvider.sps_fullname;
      propertyObj.sp_profession = serviceProvider.sps_role_name;
    }
    if (propertyId.sps_extra_notes) {
      propertyObj.notes = await propertyId.sps_extra_notes;
    }
    if (propertyId.sps_filename) {
      propertyObj.filename = await propertyId.sps_filename;
    }
    propertyObj.proposalId = await propertyId._id;
    activePropertyProposalArray.push(propertyObj);
  }
  console.log("activePropertyProposalArray is :", activePropertyProposalArray);


  //Submitted Proposal For Professional
  var submitPropertyProposalArray = [];
  var submitProposal = await SubmitProposalSchema.find({ sps_customer_id: req.session.user_id, sps_status: 'accept' });
  for (var propertyId of submitProposal) {
    console.log("property Id", propertyId);
    let propertyObj = await propertyDetail.GetPropertyById(propertyId.sps_property_id);
    let serviceProvider = await ServiceProviderSchema.findOne({ _id: propertyId.sps_service_provider_id });
    if (serviceProvider) {
      propertyObj.sp_name = serviceProvider.sps_fullname;
      propertyObj.sp_profession = serviceProvider.sps_role_name;
    }
    if (propertyId.sps_extra_notes) {
      propertyObj.notes = await propertyId.sps_extra_notes;
    }
    if (propertyId.sps_filename) {
      propertyObj.filename = await propertyId.sps_filename;
    }
    propertyObj.proposalId = await propertyId._id;
    submitPropertyProposalArray.push(propertyObj);
  }
  console.log("submitPropertyProposalArray is :", submitPropertyProposalArray);



  //fetching Reject Proposal 
  var rejectPropertyProposalArray = [];
  var rejectProposal = await SubmitProposalSchema.find({ sps_customer_id: req.session.user_id, sps_status: 'reject' });
  for (var propertyId of rejectProposal) {
    console.log("property Id", propertyId);
    let propertyObj = await propertyDetail.GetPropertyById(propertyId.sps_property_id);
    let serviceProvider = await ServiceProviderSchema.findOne({ _id: propertyId.sps_service_provider_id });
    if (serviceProvider) {
      propertyObj.sp_name = serviceProvider.sps_fullname;
      propertyObj.sp_profession = serviceProvider.sps_role_name;
    }
    if (propertyId.sps_extra_notes) {
      propertyObj.notes = await propertyId.sps_extra_notes;
    }
    if (propertyId.sps_filename) {
      propertyObj.filename = await propertyId.sps_filename;
    }
    propertyObj.proposalId = await propertyId._id;
    rejectPropertyProposalArray.push(propertyObj);
  }
  console.log("rejectPropertyProposalArray is :", rejectPropertyProposalArray);


  res.render('proposal', {
    err_msg, success_msg, layout: false,
    session: req.session,
    activePropertyProposalArray: activePropertyProposalArray,
    rejectPropertyProposalArray: rejectPropertyProposalArray,
    submitPropertyProposalArray: submitPropertyProposalArray,

  });
})



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
  req.session.property_id = req.query.id
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

app.get('/dashboard', isCustomer, async (req, res) => {
  console.log("current user session is :", req.session);

  const mapData = await PropertiesSchema.find({ ps_user_id: req.session.user_id, ps_is_active_user_flag: req.session.active_user_login });
  console.log('MapData:', mapData);
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  req.session.pagename = 'dashboard';
  res.render('dashboard', {
    err_msg, success_msg, layout: false,
    session: req.session,
    mapData: mapData
  });

});




app.get('/track-your-progress', isCustomer, async (req, res) => {
  console.log("current user session is :", req.session);
  req.session.pagename = 'track-your-progress';
  let AllProperty = await PropertiesSchema.find({
    $and: [{
      $or: [
        { $and: [{ ps_user_id: req.session.user_id }, { ps_is_active_user_flag: req.session.active_user_login }] },
        { $and: [{ ps_tagged_user_id: req.session.user_id }, { ps_other_property_type: req.session.active_user_login }] }
      ]

      //ps_user_id: req.session.user_id, ps_is_active_user_flag: req.session.active_user_login
    }]
  }).sort({ _id: -1 })
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
  const { page = 1, limit = 12 } = req.query;
  console.log('pageQuery:', page);
  let uniqueExperience = '';
  let uniqueCategory = '';
  let uniqueCity = '';
  let uniqueLanguage = '';
  let uniqueLanguageLevel = '';
  let Experience = [];
  let Category = [];
  let City = [];
  let Language = [];
  let LanguageLevel = [];
  await ServiceProviderSchema.find({ sps_status: 'active' }).then(async service_provider1 => {
    if (service_provider1) {
      for (var sp_id of service_provider1) {
        Experience.push(sp_id.sps_experience);
        Category.push(sp_id.sps_role_name);
        City.push(sp_id.sps_city);
        await ServiceProviderLanguageSchema.findOne({ spls_service_provider_id: sp_id._id }).then(async languageDetails => {
          if (languageDetails) {
            Language.push(languageDetails.spls_language);
            LanguageLevel.push(languageDetails.spls_language_proficiency_level)
          }
        })
      }
      uniqueExperience = [...new Set(Experience)];
      uniqueCategory = [...new Set(Category)];
      uniqueCity = [...new Set(City)];
      uniqueLanguage = [...new Set(Language)];
      uniqueLanguageLevel = [...new Set(LanguageLevel)];
    }
  });

  await ServiceProviderSchema.find({ sps_status: 'active' }).sort({ _id: -1 }).limit(limit * 1).skip((page - 1) * limit).then(async service_provider => {
    // Check for Customer
    const count = await ServiceProviderSchema.countDocuments({ sps_status: 'active' });
    console.log('countcount:', count);
    if (!service_provider) {
      console.log("Service Provider not found");
      // req.flash('err_msg', 'Service Provider not found');
      // return res.redirect('/professionals');
      return res.status(400).json("Service Provider not found")
    }
    else {
      let serviceProvArray = [];
      // let Experience = [];
      // let Category = [];
      // let City = [];
      // let Language = [];
      // let LanguageLevel = [];
      for (var sp_id of service_provider) {
        //Experience.push(sp_id.sps_experience);
        // Category.push(sp_id.sps_role_name);
        // City.push(sp_id.sps_city);
        console.log('Main spp id:', sp_id._id)
        await ServiceProviderOtherDetailsSchema.findOne({ spods_service_provider_id: sp_id._id }).then(async otherDetails => {
          if (otherDetails) {
            //console.log('spp id:', sp_id._id)
            console.log('Other spp id:', otherDetails)

            let professionalRating = await RatingSchema.find({ sprs_service_provider_id: sp_id._id })
            // console.log('professionalRating:', professionalRating)
            var sumRating = 0;
            for (var RatingData of professionalRating) {
              sumRating += parseInt(RatingData.sprs_rating);
            }
            let avgRating = sumRating / professionalRating.length;
            if (!isNaN(avgRating)) {
              avgRating = avgRating.toFixed(1);
            } else {
              avgRating = 0;
            }

            //console.log("avgRating:", avgRating);
            const spProvider = JSON.stringify(sp_id);
            const parseSpProvider = JSON.parse(spProvider);
            parseSpProvider.professionalBody = otherDetails.spods_professional_body
            parseSpProvider.avgRating = avgRating;
            serviceProvArray.push(parseSpProvider);
            //console.log("service_provider Array list in loop:", serviceProvArray);
          }
        });

        // await ServiceProviderLanguageSchema.findOne({ spls_service_provider_id: sp_id._id }).then(async languageDetails => {
        //   if (languageDetails) {
        //     Language.push(languageDetails.spls_language);
        //     LanguageLevel.push(languageDetails.spls_language_proficiency_level)
        //   }
        // })

      }



      //  console.log("uniqueExperience:", uniqueExperience);
      //  console.log("uniqueCategory:", uniqueCategory);
      //   console.log("uniqueCity:", uniqueCity);
      //   console.log("uniqueLanguage:", uniqueLanguage);
      //   console.log("uniqueLanguageLevel:", uniqueLanguageLevel);
      //   console.log('service_provider:', service_provider)
      //   console.log('serviceProvArray:', serviceProvArray)

      console.log('pagepage:', page);
      console.log('TotalPages:', Math.ceil(count / limit));
      res.render('professionals', {
        err_msg, success_msg, layout: false,
        session: req.session,
        data: serviceProvArray,
        uniqueExperience: uniqueExperience.sort(function (a, b) { return a - b }),
        uniqueCategory: uniqueCategory.sort(),
        uniqueCity: uniqueCity.sort(),
        uniqueLanguageLevel: uniqueLanguageLevel.sort(),
        uniqueLanguage: uniqueLanguage.sort(),
        totalPages: Math.ceil(count / limit),
        currentPage: page
      });
    }
  })
});

app.get('/myprofessionals', isCustomer, async (req, res) => {
  req.session.pagename = 'professionals';
  console.log("current user session is :", req.session);
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  const { page = 1, limit = 12 } = req.query;
  console.log('mypageQuery:', page);

  let uniqueExperience = '';
  let uniqueCategory = '';
  let uniqueCity = '';
  let uniqueLanguage = '';
  let uniqueLanguageLevel = '';
  let Experience = [];
  let Category = [];
  let City = [];
  let Language = [];
  let LanguageLevel = [];
  await ServiceProviderSchema.find({ sps_status: 'active' }).then(async service_provider1 => {
    if (service_provider1) {
      for (var sp_id of service_provider1) {
        Experience.push(sp_id.sps_experience);
        Category.push(sp_id.sps_role_name);
        City.push(sp_id.sps_city);
        await ServiceProviderLanguageSchema.findOne({ spls_service_provider_id: sp_id._id }).then(async languageDetails => {
          if (languageDetails) {
            Language.push(languageDetails.spls_language);
            LanguageLevel.push(languageDetails.spls_language_proficiency_level)
          }
        })
      }
      uniqueExperience = [...new Set(Experience)];
      uniqueCategory = [...new Set(Category)];
      uniqueCity = [...new Set(City)];
      uniqueLanguage = [...new Set(Language)];
      uniqueLanguageLevel = [...new Set(LanguageLevel)];
    }
  });


  let AllhiredProfeshnoal = await PropertyProfessionalSchema.find({ pps_user_id: req.session.user_id, pps_is_active_user_flag: req.session.active_user_login }).sort({ _id: -1 }).limit(limit * 1).skip((page - 1) * limit);
  console.log('AllhiredProfeshnoal', AllhiredProfeshnoal);

  let AllhiredProfeshnoalCount = await PropertyProfessionalSchema.find({ pps_user_id: req.session.user_id, pps_is_active_user_flag: req.session.active_user_login });
  var totalHire = [];
  for (var t of AllhiredProfeshnoalCount) {
    totalHire.push(t.pps_service_provider_id.toString());
  }
  let totalHireUnique = [...new Set(totalHire)];
  console.log('totalHire:', totalHire);
  console.log('totalHireUnique:', totalHireUnique);
  const count = totalHireUnique.length;

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
  console.log('mycountcount:', count);
  //const UserviceProvArray = [ ...new Set(serviceProvArray)]  
  console.log('serviceProvArray:', UserviceProvArray)
  console.log('mypagepage:', page);
  console.log('myTotalPages:', Math.ceil(count / limit));
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  res.render('myprofessionals', {
    err_msg, success_msg, layout: false,
    session: req.session,
    data: UserviceProvArray,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    uniqueExperience: uniqueExperience.sort(function (a, b) { return a - b }),
    uniqueCategory: uniqueCategory.sort(),
    uniqueCity: uniqueCity.sort(),
    uniqueLanguageLevel: uniqueLanguageLevel.sort(),
    uniqueLanguage: uniqueLanguage.sort()
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
      //console.log('AllhiredProfeshnoal', hiredProfeshnoal);
      let serviceProvArray = [];

      //spods_service_provider_id
      let serviceProOtherDetail = await ServiceProviderOtherDetailsSchema.findOne({ spods_service_provider_id: service_provider_detail._id });
      // console.log('serviceProOtherDetail:', serviceProOtherDetail)
      let portpolioImage = await ServiceProviderPortfolioSchema.find({ spps_service_provider_id: req.query.id })

      let professionalRating = await RatingSchema.find({ sprs_service_provider_id: req.query.id }).sort({ _id: -1 })
      //console.log('professionalRating:', professionalRating)
      const TotalRatingcount = await RatingSchema.countDocuments({ sprs_service_provider_id: req.query.id }).sort({ _id: -1 });


      var sumRating = 0;
      var ratingOne = [];
      var ratingTwo = [];
      var ratingThree = [];
      var ratingFour = [];
      var ratingFive = [];

      for (var RatingData of professionalRating) {
        if (RatingData.sprs_rating == '1') {
          ratingOne.push(RatingData.sprs_rating);
        } else if (RatingData.sprs_rating == '2') {
          ratingTwo.push(RatingData.sprs_rating);
        } else if (RatingData.sprs_rating == '3') {
          ratingThree.push(RatingData.sprs_rating);
        } else if (RatingData.sprs_rating == '4') {
          ratingFour.push(RatingData.sprs_rating);
        } else if (RatingData.sprs_rating == '5') {
          ratingFive.push(RatingData.sprs_rating);
        }
        sumRating += parseInt(RatingData.sprs_rating);
      }
      let avgRating = sumRating / professionalRating.length;
      // console.log("ProfessionalavgRating 1========", ratingOne.length)
      // console.log("ProfessionalavgRating 2========", ratingTwo.length)
      // console.log("ProfessionalavgRating 3========", ratingThree.length)
      // console.log("ProfessionalavgRating 4========", ratingFour.length)
      // console.log("ProfessionalavgRating 5========", ratingFive.length)
      // console.log("TotalRatingcount========", TotalRatingcount)

      let ratingOneAvg = (((ratingOne.length) / TotalRatingcount) * 100);
      let ratingTwoAvg = (((ratingTwo.length) / TotalRatingcount) * 100);
      let ratingThreeAvg = (((ratingThree.length) / TotalRatingcount) * 100);
      let ratingFourAvg = (((ratingFour.length) / TotalRatingcount) * 100);
      let ratingFiveAvg = (((ratingFive.length) / TotalRatingcount) * 100);
      if (!isNaN(ratingOneAvg)) { ratingOneAvg = ratingOneAvg } else { ratingOneAvg = 0; }
      if (!isNaN(ratingTwoAvg)) { ratingTwoAvg = ratingTwoAvg } else { ratingTwoAvg = 0; }
      if (!isNaN(ratingThreeAvg)) { ratingThreeAvg = ratingThreeAvg } else { ratingThreeAvg = 0; }
      if (!isNaN(ratingFourAvg)) { ratingFourAvg = ratingFourAvg } else { ratingFourAvg = 0; }
      if (!isNaN(ratingFiveAvg)) { ratingFiveAvg = ratingFiveAvg } else { ratingFiveAvg = 0; }
      // console.log("ratingOneAvg========", ratingOneAvg)
      // console.log("ratingTwoAvg========", ratingTwoAvg)
      // console.log("ratingThreeAvg========", ratingThreeAvg)
      // console.log("ratingFourAvg========", ratingFourAvg)
      // console.log("ratingFiveAvg========", ratingFiveAvg)

      if (!isNaN(avgRating)) {
        avgRating = avgRating.toFixed(1);
      } else {
        avgRating = 0;
      }
      var propertyObjArray = [];
      let propertyObj = await PropertyProfessionalHelper.GetAllHiredProertyByUserId(req.query.id, req.session.active_user_login, req.session.user_id);
      for (var pr of propertyObj) {
        var property_object = await pr;
        propertyObjArray.push(property_object)
      }
      console.log("avgRating========", avgRating)
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
        avgRating: avgRating,
        ratingOneavg: ratingOneAvg,
        ratingTwoavg: ratingTwoAvg,
        ratingThreeavg: ratingThreeAvg,
        ratingFouravg: ratingFourAvg,
        ratingFiveavg: ratingFiveAvg,
        ratingOne: ratingOne.length,
        ratingTwo: ratingTwo.length,
        ratingThree: ratingThree.length,
        ratingFour: ratingFour.length,
        ratingFive: ratingFive.length,
        moment: moment,
        propertyObj: propertyObj
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

  const { page = 1, limit = 12 } = req.query;
  console.log('pageQuery:', page);

  ServiceProviderSchema.find({ sps_role_name: req.query.role, sps_status: 'active' }).sort({ _id: -1 }).limit(limit * 1).skip((page - 1) * limit).then(async service_provider_detail => {
    if (service_provider_detail) {

      const count = await ServiceProviderSchema.countDocuments({ sps_role_name: req.query.role, sps_status: 'active' });
      console.log('countcount:', count);

      let serviceProvArray = [];
      for (var sp_id of service_provider_detail) {
        await ServiceProviderOtherDetailsSchema.findOne({ spods_service_provider_id: sp_id._id }).then(async otherDetails => {
          if (otherDetails) {
            //console.log("other Details of customers", otherDetails);
            const spProvider = JSON.stringify(sp_id);
            const parseSpProvider = JSON.parse(spProvider);
            parseSpProvider.professionalBody = otherDetails.spods_professional_body
            let professionalRating = await RatingSchema.find({ sprs_service_provider_id: sp_id._id })
            console.log('professionalRating:', professionalRating)
            var sumRating = 0;
            for (var RatingData of professionalRating) {
              sumRating += parseInt(RatingData.sprs_rating);
            }
            let avgRating = sumRating / professionalRating.length;
            if (!isNaN(avgRating)) {
              avgRating = avgRating.toFixed(1);
            } else {
              avgRating = 0;
            }
            console.log('avgRating:', avgRating)


            let temps = await parseSpProvider

            const spProvider1 = JSON.stringify(temps);
            const parseSpProvider1 = JSON.parse(spProvider1);
            parseSpProvider1.avgRating = avgRating


            serviceProvArray.push(parseSpProvider1);

            // serviceProvArray.push(parseSpProvider);
            //console.log("service_provider Array list in loop:", serviceProvArray);
          }
        });
      }



      var uniqueArray = '';
      //console.log('service_provider_detail:', serviceProvArray)
      if (serviceProvArray != '') {
        console.log('hereeee..');
        uniqueArray = removeDuplicates(serviceProvArray, "_id");
      } else {
        console.log('not hereeee..');
        uniqueArray = serviceProvArray;
      }

      console.log('uniqueArray:', uniqueArray)
      console.log('Filterpagepage:', page);
      console.log('FilterTotalPages:', Math.ceil(count / limit));
      err_msg = req.flash('err_msg');
      success_msg = req.flash('success_msg');
      res.send({
        err_msg, success_msg, layout: false,
        session: req.session,
        filterData: uniqueArray,
        totalPages: Math.ceil(count / limit),
        currentPage: page
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
          const { page = 1, limit = 12 } = req.query;
          console.log('pageQuery:', page);
          ServiceProviderSchema.find({ _id: { $in: unique } }).sort({ _id: -1 }).limit(limit * 1).skip((page - 1) * limit).then(async service_provider_detail => {

            const count = unique.length;
            console.log('countcount:', count);


            let serviceProvArray = [];
            for (var sp_id of service_provider_detail) {
              await ServiceProviderOtherDetailsSchema.findOne({ spods_service_provider_id: sp_id._id }).then(async otherDetails => {
                if (otherDetails) {
                  //console.log("other Details of customers", otherDetails);
                  const spProvider = JSON.stringify(sp_id);
                  const parseSpProvider = JSON.parse(spProvider);
                  parseSpProvider.professionalBody = otherDetails.spods_professional_body


                  let professionalRating = await RatingSchema.find({ sprs_service_provider_id: sp_id._id })
                  console.log('professionalRating:', professionalRating)
                  var sumRating = 0;
                  for (var RatingData of professionalRating) {
                    sumRating += parseInt(RatingData.sprs_rating);
                  }
                  let avgRating = sumRating / professionalRating.length;
                  if (!isNaN(avgRating)) {
                    avgRating = avgRating.toFixed(1);
                  } else {
                    avgRating = 0;
                  }
                  console.log('avgRating:', avgRating)


                  let temps = await parseSpProvider

                  const spProvider1 = JSON.stringify(temps);
                  const parseSpProvider1 = JSON.parse(spProvider1);
                  parseSpProvider1.avgRating = avgRating


                  serviceProvArray.push(parseSpProvider1);
                  //console.log("service_provider Array list in loop:", serviceProvArray);
                }
              });
            }

            console.log('SearchFilterpagepage:', page);
            console.log('SearchFilterTotalPages:', Math.ceil(count / limit));

            res.send({
              err_msg, success_msg, layout: false,
              session: req.session,
              filterData: serviceProvArray,
              totalPages: Math.ceil(count / limit),
              currentPage: page
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
  const { page = 1, limit = 12 } = req.query;
  console.log('pageQuery:', req.query);

  //let AllhiredProfeshnoal = await PropertyProfessionalSchema.find({ pps_user_id: req.session.user_id, pps_is_active_user_flag: req.session.active_user_login });
  let serviceProvArray = [];

  let AllhiredProfeshnoalCount = await PropertyProfessionalSchema.find({ pps_user_id: req.session.user_id, pps_is_active_user_flag: req.session.active_user_login });
  var totalHire = [];
  for (var t of AllhiredProfeshnoalCount) {
    await ServiceProviderSchema.find({ $and: [{ _id: t.pps_service_provider_id, sps_role_name: req.query.role }] }).then(async (allProfeshnoals1) => {
      for (let ii of allProfeshnoals1) {
        totalHire.push(ii._id.toString());
      }
    });
  }
  let totalHireUnique = [...new Set(totalHire)];
  console.log('FiltertotalHire:', totalHire);
  console.log('FiltertotalHireUnique:', totalHireUnique);
  const count = totalHireUnique.length;


  //console.log('AllhiredProfeshnoal:',AllhiredProfeshnoal);
  //.sort({ _id: -1 }).limit(limit * 1).skip((page - 1) * limit)
  // for (var k of AllhiredProfeshnoal) {
  //{ $in: AllhiredProfeshnoalID }
  // _id: k.pps_service_provider_id
  await ServiceProviderSchema.find({ $and: [{ _id: { $in: totalHireUnique }, sps_role_name: req.query.role }] }).sort({ _id: -1 }).limit(limit * 1).skip((page - 1) * limit).then(async (allProfeshnoals) => {
    console.log('allProfeshnoals:', allProfeshnoals);
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
      //let temps = await i
      // serviceProvArray.push(temps)
    }
  });
  //}


  var uniqueArray = '';
  console.log('service_provider_detail:', serviceProvArray)

  if (serviceProvArray != '') {
    console.log('hereeee..');
    uniqueArray = removeDuplicates(serviceProvArray, "_id");
  } else {
    console.log('not hereeee..');

    uniqueArray = serviceProvArray;
  }
  //var uniqueArray = removeDuplicates(serviceProvArray, "_id");
  //console.log("uniqueArray is: " + JSON.stringify(uniqueArray));

  console.log('Filtermycountcount:', count);
  console.log('Filtermypagepage:', page);
  console.log('FiltermyTotalPages:', Math.ceil(count / limit));

  res.send({
    err_msg, success_msg, layout: false,
    session: req.session,
    data: uniqueArray,
    totalPages: Math.ceil(count / limit),
    currentPage: page
  });

});






// My Professional Filter name surname qualification
app.get('/my-professionals-searchbar', async (req, res) => {
  req.session.pagename = 'professionals';
  const { page = 1, limit = 12 } = req.query;
  console.log('pageQuery:', req.query);
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
          if (unique > 1) {
            var citrus = unique.slice(0, 4);
          }
          console.log('MYYYY unique:', unique);
          const count = unique.length;
          console.log('countcount:', count);

          ServiceProviderSchema.find({ _id: { $in: unique } }).sort({ _id: -1 }).limit(limit * 1).skip((page - 1) * limit).then(async service_provider_detail => {
            for (var sp_id of service_provider_detail) {
              await ServiceProviderOtherDetailsSchema.findOne({ spods_service_provider_id: sp_id._id }).then(async otherDetails => {
                if (otherDetails) {
                  //console.log("other Details of customers", otherDetails);
                  const spProvider = JSON.stringify(sp_id);
                  const parseSpProvider = JSON.parse(spProvider);
                  parseSpProvider.professionalBody = otherDetails.spods_professional_body

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
                  console.log('avgRating:', avgRating)

                  let temps = await parseSpProvider
                  const spProvider1 = JSON.stringify(temps);
                  const parseSpProvider1 = JSON.parse(spProvider1);
                  parseSpProvider1.avgRating = avgRating

                  serviceProvArray.push(parseSpProvider1);
                  //console.log("service_provider Array list in loop:", serviceProvArray);
                }
              });
            }

            console.log("service_provider Array list in loop:", serviceProvArray);
            console.log('SearchFilterpagepage:', page);
            console.log('SearchFilterTotalPages:', Math.ceil(count / limit));


            res.send({
              err_msg, success_msg, layout: false,
              session: req.session,
              filterData: serviceProvArray,
              totalPages: Math.ceil(count / limit),
              currentPage: page
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
  var normalDocArray = [];
  var taskDocArray = [];
  var spDocArray=[]
  //console.log('property id is :', req.session.property_id);
  //req.session.property_id=req.query.id
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  let property = await PropertiesSchema.findOne({
    //_id: req.session.property_id, ps_is_active_user_flag: req.session.active_user_login 
    _id: req.session.property_id
  });
  // ServiceProviderUploadDocsSchema.find({spuds_property_id:req.session.property_id}).then((respdata)=>{
  //   console.log('responce of sp document',respdata)
    
  // })
  await ServiceProviderUploadDocsSchema.find({
    spuds_property_id: req.session.property_id
  }).sort({ _id: -1 }).then(async (spresp) => {
    for (var keyy of spresp) {
      let sptemps = await keyy
      const spd = JSON.stringify(sptemps);
      const spDocData = JSON.parse(spd)
     await DocumentPermissionSchema.findOne({ dps_document_id:spDocData._id }).then(async (docPermissionResp) => { 
       if(docPermissionResp){
        spDocData.permissionData = docPermissionResp
       }else{
        spDocData.permissionData ='';
       }
      })
      spDocArray.push(spDocData);
    }
  });
console.log('sp document',spDocArray)
  await CustomerUploadDocsSchema.find({
    cuds_property_id: req.session.property_id
    // $and: [{ cuds_customer_id: req.session.user_id, cuds_property_id: req.session.property_id, cuds_is_active_user_flag: req.session.active_user_login }] 
  }).sort({ _id: -1 }).then(async (resp) => {
    for (var key of resp) {
      let temps = await key
      const d = JSON.stringify(temps);
      const datas = JSON.parse(d)

      if (key.cuds_task_id) {

        taskDocArray.push(datas);
      } else {
        normalDocArray.push(datas);
      }
    }
  });
  //const propertyDataObj = await PropertiesSchema.find();
  let AllhiredProfeshnoal = await PropertyProfessionalSchema.find({
    //pps_user_id: req.session.user_id, 
    // pps_is_active_user_flag: req.session.active_user_login
    pps_property_id: req.session.property_id
  });
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

  //console.log('permisionnnn faa:', serviceProvArray)
  console.log('normalarray==========', normalDocArray)
  console.log('taskdocarray==========', taskDocArray)

  res.render('mydreamhome-details-docs', {
    err_msg, success_msg, layout: false,
    session: req.session,
    data: serviceProvArray,
    allDocument: normalDocArray,//need to show property wise document still showing all uploaded
    taskDocument: taskDocArray,
    spDocument:spDocArray,
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
app.get('/add-property', isCustomer, async (req, res) => {
  //req.session.propertyEditId
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  console.log("deep:==", req.query)
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
      propertyObj: propertyObj,
      propertyImageObject: propertyImageObject,
      propertyPlanImageObject: propertyPlanImageObject

    });
  } else {

    res.render('add-property', {
      err_msg, success_msg, layout: false,
      session: req.session,
      propertyObj: 'null'
    });
  }
});


app.get('/mydreamhome-details-message', isCustomer, async (req, res) => {
  req.session.pagename = 'mydreamhome';
  var newData = [];
  console.log(' property id  :', req.session.property_id);
  console.log('helooooo', req.query.pid);
  req.session.professional_id = req.query.pid;
  let property = await PropertiesSchema.findOne({
    $or: [
      { $and: [{ _id: req.session.property_id }, { ps_is_active_user_flag: req.session.active_user_login }] },
      { $and: [{ _id: req.session.property_id }, { ps_other_property_type: req.session.active_user_login }] }
    ]
    // _id: req.session.property_id, ps_is_active_user_flag: req.session.active_user_login
  });

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
  const { page = 1, limit = 5 } = req.query;

  var QueryData = {
    $or: [
      { $and: [{ sms_sender_id: property.ps_user_id }, { sms_receiver_id: req.query.pid }, { sms_property_id: req.session.property_id }, { sms_sender_id: req.session.user_id }] },
      { $and: [{ sms_sender_id: req.query.pid }, { sms_receiver_id: property.ps_user_id }, { sms_property_id: req.session.property_id }, { sms_receiver_id: req.session.user_id }] }
    ]
  };
  const count = await MessageSchema.countDocuments(QueryData);
  await MessageSchema.find(QueryData).sort({ _id: -1 }).limit(limit * 1).skip((page - 1) * limit).then(async (data) => {
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
        // await ServiceProviderSchema.findOne({ _id: t.sms_sender_id }).then(async professional => {
        //   if (professional) {
        //     console.log('professional:', professional.sps_fullname);
        //     t.senderName = await professional.sps_fullname;
        //     //console.log('providerData xxxx New:',t);
        //   } else {
        //     t.senderName = await 'You';
        //   }

        // });
        // const s = await t;
        // //console.log('providerData New:',s);
        // newData.push(s);

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

    }
  }).catch((err) => {
    console.log(err)
  })



  console.log('currentPage:', page)
  console.log('totalPages:', Math.ceil(count / limit))

  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  res.render('mydreamhome-details-message', {
    err_msg, success_msg, layout: false,
    session: req.session,

    property: property,
    professional_id: req.query.pid,
    chatData: newData.reverse(),
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    msgcount: count

    //hiredProfeshnoalList:serviceProvArray
  });
})

app.get('/professionals-detail-message', async (req, res) => {
  req.session.pagename = 'professionals';
  console.log('helooooo', req.query);
  //return
  var newData = [];
  ServiceProviderSchema.find({ _id: req.query.spp_id }).then(async service_provider_detail => {

    const { page = 1, limit = 5 } = req.query;


    if (service_provider_detail) {

      var QueryData = {
        $or: [
          { $and: [{ sms_sender_id: req.query.cus_id }, { sms_receiver_id: req.query.spp_id }] },
          { $and: [{ sms_sender_id: req.query.spp_id }, { sms_receiver_id: req.query.cus_id }] }
        ]
      };
      const count = await MessageSchema.countDocuments(QueryData);


      MessageSchema.find(QueryData).sort({ _id: -1 }).limit(limit * 1).skip((page - 1) * limit).then(async (data) => {
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
            // await ServiceProviderSchema.findOne({ _id: t.sms_sender_id }).then(async professional => {
            //   if (professional) {
            //     console.log('professional:', professional.sps_fullname);
            //     t.senderName = await professional.sps_fullname;
            //     //console.log('providerData xxxx New:',t);
            //   } else {
            //     t.senderName = await 'You';
            //   }

            // });
            // const s = await t;
            // //console.log('providerData New:',s);
            // newData.push(s);

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

          console.log('newData', newData);

          console.log('Count', count);
          console.log('Totalpage', Math.ceil(count / limit));
          console.log('Page', page);

          err_msg = req.flash('err_msg');
          success_msg = req.flash('success_msg');
          res.render('professionals-detail-message', {
            err_msg, success_msg, layout: false,
            session: req.session,
            service_provider_detail: service_provider_detail[0],
            chatData: newData,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            msgcount: count
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
    var property = await PropertiesSchema.find({
      //ps_user_id: req.session.user_id, ps_is_active_user_flag: req.session.active_user_login
      // $or: [
      //   { $and: [{ _id: req.session.property_id }, { ps_is_active_user_flag: req.session.active_user_login }] },
      //  { $and: [{ _id: req.session.property_id }, { ps_other_property_type: req.session.active_user_login }] }
      // ]
      $or: [
        { $and: [{ ps_user_id: req.session.user_id }, { ps_is_active_user_flag: req.session.active_user_login },] },
        { $and: [{ ps_tagged_user_id: req.session.user_id }, { ps_other_property_type: req.session.active_user_login }] }
      ]

    });
    //console.log('property====', property)
    var serviceProvider = await ServiceProviderSchema.findOne({ _id: SarviceProviderId });
    //console.log('service_provider=+++',serviceProvider)

    for (let propertyData of property) {
      var propertyExist = await PropertyProfessionalSchema.findOne({
        pps_user_id: propertyData.ps_user_id, pps_property_id: propertyData._id, pps_service_provider_id: SarviceProviderId
        /* $or: [
           { $and: [{ ps_user_id: propertyData.ps_user_id }, { pps_property_id: propertyData._id },{ pps_service_provider_id: SarviceProviderId }] },
           { $and: [{ ps_user_id: propertyData.ps_tagged_user_id }, { pps_property_id: propertyData._id },{ pps_service_provider_id: SarviceProviderId }] },
         ]*/
      });
      //console.log('propertyExist:', propertyExist);
      if (propertyExist == null) {
        console.log('Hello coming..')
        PropertyList.push(propertyData);
      }
    }
    console.log('PropertyList Arr:', PropertyList);


    if (serviceProvider) {
      let propertyObj = await PropertyProfessionalHelper.GetAllHiredProertyByUserId(SarviceProviderId, req.session.active_user_login, req.session.user_id);
      //console.log('propertyObj in hire now:=======================', propertyObj)
      err_msg = req.flash('err_msg');
      success_msg = req.flash('success_msg');
      res.render('professionals-hirenow', {
        err_msg, success_msg, layout: false,
        session: req.session,
        serviceProvider: serviceProvider,
        property: PropertyList,
        propertyObj: propertyObj
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




// function checkstatus(data) {
//   for(var k of data){
//     var ppts_task_status = k.ppts_task_status;
//     return ppts_task_status;
//   }
//   return age >= document.getElementById("ageToCheck").value;
// }
// function getTaskStatus(data){
// for(var k of data){
//   console.log(k);
//  k.ppts_task_status.every(checkstatus)
// }
// }
function isStatusComplete(element, index, array) {
  return element == 'completed_by_service_provider';
}
function isStatusPanding(element, index, array) {
  return element == 'pending';
}

app.get('/mydreamhome-details-phase-a', isCustomer, async (req, res) => {
  //console.log('from get take action url====', req.query)
  var user_id = req.session.user_id;
  var property_id = req.query.id;
  req.session.property_id = req.query.id
  var phase_name = req.query.phase;
  var taskObject = await TaskHelper.GetTaskByPhaseName(property_id, phase_name, user_id, req.session.active_user_login);
  var gest_taskObject = await TaskHelper.GetGestTaskByPhaseName(property_id, phase_name, user_id, req.session.active_user_login);
  var propertyData = await propertyDetail.GetPropertById(property_id, req.session.active_user_login);
  var AllProfessional_property_wise = await PropertyProfessionalHelper.Get_all_Professional_by_property(property_id, req.session.user_id, req.session.active_user_login);
  //console.log("hiredProfessional_list", AllProfessional_property_wise)

  //console.log("taskObject mydreamhome-details-phase-a", taskObject)
  //console.log("gest_taskObject", gest_taskObject)
  var gest_taskObjectArray=[]
  var completedTask1=0;
  var progressResult1 = 0;
  if(gest_taskObject.length!=0){
    for(ky of gest_taskObject){
      var ds= JSON.stringify(ky)
      var ds = JSON.parse(ds)
      var temps = ds
      var arrr = temps.ppts_task_status;
      var gest_iscomplete =await arrr.every(isStatusComplete);
      var gest_isPanding =await arrr.every(isStatusPanding);
      temps.gestiscompleteStatus = gest_iscomplete
      temps.gestispendingStatus = gest_isPanding
          if(iscomplete==true){
         
            completedTask1 = completedTask1+1
           }
           gest_taskObjectArray.push(temps)
    }
    console.log('gest total task',gest_taskObject.length)
  console.log('gest num of completed task',completedTask1)
   progressResult1 = Math.round((completedTask1 / gest_taskObject.length) * 100);
  }else{
    progressResult1
  }
  completedTask1=0
  console.log('gest progressResult==============',progressResult1)
  console.log("gest taskObjectArray==============",gest_taskObjectArray)
  

  var taskObjectArray=[]
  var completedTask=0;
  var progressResult = 0;
  if(taskObject.length!=0){
  for(k of taskObject){
      var d = JSON.stringify(k)
      var dd = JSON.parse(d)
      var temp = dd
      var arr = temp.ppts_task_status;
      var iscomplete =await arr.every(isStatusComplete);
      var isPanding =await arr.every(isStatusPanding);
         // console.log(iscomplete)
          temp.iscompleteStatus = iscomplete
          temp.ispendingStatus = isPanding
           //progress bar number of total task / no of completed task 
           if(iscomplete==true){
           
             completedTask = completedTask+1
            }
            
             
          taskObjectArray.push(temp)
  }
  console.log('total task',taskObject.length)
  console.log('num of completed task',completedTask)
   progressResult = Math.round((completedTask / taskObject.length) * 100);
  
}else{
  progressResult=0
}

completedTask=0
console.log('task object length======',taskObject.length)
  console.log('progressResult==============',progressResult)
  console.log("taskObjectArray==============",taskObjectArray)
  


  if (taskObject) {

    req.session.pagename = 'mydreamhome';
    err_msg = req.flash('err_msg');
    success_msg = req.flash('success_msg');
    res.render('mydreamhome-details-phase-a', {
      err_msg, success_msg, layout: false,
      session: req.session,
      taskObject: taskObjectArray,
      propertyData: propertyData,
      step: req.query.step,
      phase: req.query.phase,
      hiredProfessional_list: AllProfessional_property_wise,
      gest_taskObject: gest_taskObjectArray,
      progressResult:progressResult,
      //progressResult1:progressResult1

    });
  } else {
    return res.send({
      'status': false,
      'message': 'some thing wrong'
    })
  }


})

app.get('/removetasktable',(req,res)=>{
  var id = req.query.id
  console.log(id)
  PropertyProfessinoalTaskSchema.find({ppts_user_id:id}).deleteMany().then((resp)=>{
    if(resp){
      console.log(resp)
      res.json({'resp':resp})
    }
  })
})
app.get('/mydreamhome-details-phase-b', isCustomer, async (req, res) => {
  //console.log('from get take action url====', req.query)
  var user_id = req.session.user_id;
  var property_id = req.query.id;
  req.session.property_id = req.query.id
  var phase_name = req.query.phase;
  var taskObject = await TaskHelper.GetTaskByPhaseName(property_id, phase_name, user_id, req.session.active_user_login);
  var gest_taskObject = await TaskHelper.GetGestTaskByPhaseName(property_id, phase_name, user_id, req.session.active_user_login);
  var propertyData = await propertyDetail.GetPropertById(property_id, req.session.active_user_login);
  var AllProfessional_property_wise = await PropertyProfessionalHelper.Get_all_Professional_by_property(property_id, req.session.user_id, req.session.active_user_login);
  //console.log("hiredProfessional_list", AllProfessional_property_wise)
  console.log("taskObject mydreamhome-details-phase-b", taskObject)
  console.log("gest_taskObject", gest_taskObject)

  if (taskObject) {
    req.session.pagename = 'mydreamhome';
    err_msg = req.flash('err_msg');
    success_msg = req.flash('success_msg');
    res.render('mydreamhome-details-phase-b', {
      err_msg, success_msg, layout: false,
      session: req.session,
      taskObject: taskObject,
      propertyData: propertyData,
      step: req.query.step,
      phase: req.query.phase,
      hiredProfessional_list: AllProfessional_property_wise,
      gest_taskObject: gest_taskObject
    });
  } else {
    return res.send({
      'status': false,
      'message': 'some thing wrong'
    })
  }
})


app.get('/mydreamhome-details-phase-c', isCustomer, async (req, res) => {
  //console.log('from get take action url====', req.query)
  var user_id = req.session.user_id;
  var property_id = req.query.id;
  req.session.property_id = req.query.id
  var phase_name = req.query.phase;
  var taskObject = await TaskHelper.GetTaskByPhaseName(property_id, phase_name, user_id, req.session.active_user_login);
  var gest_taskObject = await TaskHelper.GetGestTaskByPhaseName(property_id, phase_name, user_id, req.session.active_user_login);
  var propertyData = await propertyDetail.GetPropertById(property_id, req.session.active_user_login);
  var AllProfessional_property_wise = await PropertyProfessionalHelper.Get_all_Professional_by_property(property_id, req.session.user_id, req.session.active_user_login);
  //console.log("hiredProfessional_list", AllProfessional_property_wise)
  console.log("taskObject mydreamhome-details-phase-c", taskObject)
  console.log("gest_taskObject", gest_taskObject)

  if (taskObject) {
    req.session.pagename = 'mydreamhome';
    err_msg = req.flash('err_msg');
    success_msg = req.flash('success_msg');
    res.render('mydreamhome-details-phase-c', {
      err_msg, success_msg, layout: false,
      session: req.session,
      taskObject: taskObject,
      propertyData: propertyData,
      step: req.query.step,
      phase: req.query.phase,
      hiredProfessional_list: AllProfessional_property_wise,
      gest_taskObject: gest_taskObject
    });
  } else {
    return res.send({
      'status': false,
      'message': 'some thing wrong'
    })
  }
})

app.get('/mydreamhome-details-phase-d', isCustomer, async (req, res) => {
  //console.log('from get take action url====', req.query)
  var user_id = req.session.user_id;
  var property_id = req.query.id;
  req.session.property_id = req.query.id
  var phase_name = req.query.phase;
  var taskObject = await TaskHelper.GetTaskByPhaseName(property_id, phase_name, user_id, req.session.active_user_login);
  var gest_taskObject = await TaskHelper.GetGestTaskByPhaseName(property_id, phase_name, user_id, req.session.active_user_login);
  var propertyData = await propertyDetail.GetPropertById(property_id, req.session.active_user_login);
  var AllProfessional_property_wise = await PropertyProfessionalHelper.Get_all_Professional_by_property(property_id, req.session.user_id, req.session.active_user_login);
  //console.log("hiredProfessional_list", AllProfessional_property_wise)
  console.log("taskObject mydreamhome-details-phase-d", taskObject)
  console.log("gest_taskObject", gest_taskObject)

  if (taskObject) {
    req.session.pagename = 'mydreamhome';
    err_msg = req.flash('err_msg');
    success_msg = req.flash('success_msg');
    res.render('mydreamhome-details-phase-d', {
      err_msg, success_msg, layout: false,
      session: req.session,
      taskObject: taskObject,
      propertyData: propertyData,
      step: req.query.step,
      phase: req.query.phase,
      hiredProfessional_list: AllProfessional_property_wise,
      gest_taskObject: gest_taskObject
    });
  } else {
    return res.send({
      'status': false,
      'message': 'some thing wrong'
    })
  }
})

app.get('/mydreamhome-details-phase-e', isCustomer, async (req, res) => {
  //console.log('from get take action url====', req.query)
  var user_id = req.session.user_id;
  var property_id = req.query.id;
  req.session.property_id = req.query.id
  var phase_name = req.query.phase;
  var taskObject = await TaskHelper.GetTaskByPhaseName(property_id, phase_name, user_id, req.session.active_user_login);
  var gest_taskObject = await TaskHelper.GetGestTaskByPhaseName(property_id, phase_name, user_id, req.session.active_user_login);
  var propertyData = await propertyDetail.GetPropertById(property_id, req.session.active_user_login);
  var AllProfessional_property_wise = await PropertyProfessionalHelper.Get_all_Professional_by_property(property_id, req.session.user_id, req.session.active_user_login);
  //console.log("hiredProfessional_list", AllProfessional_property_wise)
  console.log("taskObject mydreamhome-details-phase-e", taskObject)
  console.log("gest_taskObject", gest_taskObject)

  if (taskObject) {
    req.session.pagename = 'mydreamhome';
    err_msg = req.flash('err_msg');
    success_msg = req.flash('success_msg');
    res.render('mydreamhome-details-phase-e', {
      err_msg, success_msg, layout: false,
      session: req.session,
      taskObject: taskObject,
      propertyData: propertyData,
      step: req.query.step,
      phase: req.query.phase,
      hiredProfessional_list: AllProfessional_property_wise,
      gest_taskObject: gest_taskObject
    });
  } else {
    return res.send({
      'status': false,
      'message': 'some thing wrong'
    })
  }
})

app.get('/mydreamhome-details-phase-f', isCustomer, async (req, res) => {
  //console.log('from get take action url====', req.query)
  var user_id = req.session.user_id;
  var property_id = req.query.id;
  req.session.property_id = req.query.id
  var phase_name = req.query.phase;
  var taskObject = await TaskHelper.GetTaskByPhaseName(property_id, phase_name, user_id, req.session.active_user_login);
  var gest_taskObject = await TaskHelper.GetGestTaskByPhaseName(property_id, phase_name, user_id, req.session.active_user_login);
  var propertyData = await propertyDetail.GetPropertById(property_id, req.session.active_user_login);
  var AllProfessional_property_wise = await PropertyProfessionalHelper.Get_all_Professional_by_property(property_id, req.session.user_id, req.session.active_user_login);
  //console.log("hiredProfessional_list", AllProfessional_property_wise)
  console.log("taskObject mydreamhome-details-phase-f", taskObject)
  console.log("gest_taskObject", gest_taskObject)

  if (taskObject) {
    req.session.pagename = 'mydreamhome';
    err_msg = req.flash('err_msg');
    success_msg = req.flash('success_msg');
    res.render('mydreamhome-details-phase-f', {
      err_msg, success_msg, layout: false,
      session: req.session,
      taskObject: taskObject,
      propertyData: propertyData,
      step: req.query.step,
      phase: req.query.phase,
      hiredProfessional_list: AllProfessional_property_wise,
      gest_taskObject: gest_taskObject
    });
  } else {
    return res.send({
      'status': false,
      'message': 'some thing wrong'
    })
  }
})



app.get('/mydreamhome-details-phase-g', isCustomer, async (req, res) => {
  //console.log('from get take action url====', req.query)
  var user_id = req.session.user_id;
  var property_id = req.query.id;
  req.session.property_id = req.query.id
  var phase_name = req.query.phase;
  var taskObject = await TaskHelper.GetTaskByPhaseName(property_id, phase_name, user_id, req.session.active_user_login);
  var gest_taskObject = await TaskHelper.GetGestTaskByPhaseName(property_id, phase_name, user_id, req.session.active_user_login);
  var propertyData = await propertyDetail.GetPropertById(property_id, req.session.active_user_login);
  var AllProfessional_property_wise = await PropertyProfessionalHelper.Get_all_Professional_by_property(property_id, req.session.user_id, req.session.active_user_login);
  //console.log("hiredProfessional_list", AllProfessional_property_wise)
  console.log("taskObject mydreamhome-details-phase-g", taskObject)
  console.log("gest_taskObject", gest_taskObject)

  if (taskObject) {
    req.session.pagename = 'mydreamhome';
    err_msg = req.flash('err_msg');
    success_msg = req.flash('success_msg');
    res.render('mydreamhome-details-phase-g', {
      err_msg, success_msg, layout: false,
      session: req.session,
      taskObject: taskObject,
      propertyData: propertyData,
      step: req.query.step,
      phase: req.query.phase,
      hiredProfessional_list: AllProfessional_property_wise,
      gest_taskObject: gest_taskObject
    });
  } else {
    return res.send({
      'status': false,
      'message': 'some thing wrong'
    })
  }
})


app.get('/mydreamhome-details-phase-h', isCustomer, async (req, res) => {
  //console.log('from get take action url====', req.query)
  var user_id = req.session.user_id;
  var property_id = req.query.id;
  req.session.property_id = req.query.id
  var phase_name = req.query.phase;
  var taskObject = await TaskHelper.GetTaskByPhaseName(property_id, phase_name, user_id, req.session.active_user_login);
  var gest_taskObject = await TaskHelper.GetGestTaskByPhaseName(property_id, phase_name, user_id, req.session.active_user_login);
  var propertyData = await propertyDetail.GetPropertById(property_id, req.session.active_user_login);
  var AllProfessional_property_wise = await PropertyProfessionalHelper.Get_all_Professional_by_property(property_id, req.session.user_id, req.session.active_user_login);
  //console.log("hiredProfessional_list", AllProfessional_property_wise)
  console.log("taskObject mydreamhome-details-phase-h", taskObject)
  console.log("gest_taskObject", gest_taskObject)

  if (taskObject) {
    req.session.pagename = 'mydreamhome';
    err_msg = req.flash('err_msg');
    success_msg = req.flash('success_msg');
    res.render('mydreamhome-details-phase-h', {
      err_msg, success_msg, layout: false,
      session: req.session,
      taskObject: taskObject,
      propertyData: propertyData,
      step: req.query.step,
      phase: req.query.phase,
      hiredProfessional_list: AllProfessional_property_wise,
      gest_taskObject: gest_taskObject
    });
  } else {
    return res.send({
      'status': false,
      'message': 'some thing wrong'
    })
  }
})
app.get('/mydreamhome-details-phase-o', isCustomer, async (req, res) => {
  console.log('from get take action url====', req.query)
  var property_id = req.query.id;
  req.session.property_id = req.query.id
  var phase_name = req.query.phase;
  var taskObject = await TaskHelper.GetTaskByPhaseName(property_id, phase_name, req.session.active_user_login);
  var propertyData = await propertyDetail.GetPropertById(property_id, req.session.active_user_login);
  console.log("taskObject by phase name take action", taskObject)
  var AllProfessional_property_wise = await PropertyProfessionalHelper.Get_all_Professional_by_property(property_id, req.session.user_id, req.session.active_user_login);
  console.log("AllProfessional_property_wise", AllProfessional_property_wise)

  if (taskObject) {
    req.session.pagename = 'mydreamhome';
    err_msg = req.flash('err_msg');
    success_msg = req.flash('success_msg');
    res.render('mydreamhome-details-phase-o', {
      err_msg, success_msg, layout: false,
      session: req.session,
      taskObject: taskObject,
      propertyData: propertyData,
      step: req.query.step,
      phase: req.query.phase,
      hiredProfessional_list: AllProfessional_property_wise
    });
  } else {
    return res.send({
      'status': false,
      'message': 'some thing wrong'
    })
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

  const { page = 1, limit = 9 } = req.query;
  console.log('pageQuery:', page);

  PropertiesSchema.find({
    $or: [
      { $and: [{ ps_user_id: req.session.user_id }, { ps_is_active_user_flag: req.session.active_user_login },] },
      { $and: [{ ps_tagged_user_id: req.session.user_id }, { ps_other_property_type: req.session.active_user_login }] }
    ]
  }).sort({ _id: -1 }).limit(limit * 1).skip((page - 1) * limit).then(async (data) => {
    if (data) {

      const count = await PropertiesSchema.countDocuments({
        $or: [
          { $and: [{ ps_user_id: req.session.user_id }, { ps_is_active_user_flag: req.session.active_user_login },] },
          { $and: [{ ps_tagged_user_id: req.session.user_id }, { ps_other_property_type: req.session.active_user_login }] }
        ]
      });
      console.log('countcount:', count);

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
        propertyImage: arr,
        totalPages: Math.ceil(count / limit),
        currentPage: page
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
      console.log("data", data)
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
  if (isNaN(estimated_time)) {
    console.log("aaa", estimated_time)
    return 'N/A';
  } else {
    console.log("bbb", estimated_time)
    return message;
  }
}


app.get('/mydreamhome-details', isCustomer, async (req, res) => {
  //console.log("current session is", req.session);
  //console.log('session property id', req.query.id);
  req.session.pagename = 'mydreamhome';
  if (req.query.id) {
    req.session.property_id = req.query.id
    //console.log("todoArray", todoArray);
    PropertiesSchema.find({
      $or: [
        { $and: [{ ps_user_id: req.session.user_id }, { ps_is_active_user_flag: req.session.active_user_login }, { _id: req.query.id }] },
        { $and: [{ ps_tagged_user_id: req.session.user_id }, { ps_other_property_type: req.session.active_user_login }, { _id: req.query.id }] }
      ]
      //_id: req.query.id, ps_is_active_user_flag: req.session.active_user_login
    }).then(async (data) => {
      if (data) {
        var message = timeDifference(data[0].ps_phase_array);
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



        let AllhiredProfeshnoal = await PropertyProfessionalSchema.find({
          pps_property_id: req.query.id

          /* $or: [
             { $and: [{ pps_user_id: req.session.user_id, pps_property_id: req.query.id, pps_is_active_user_flag: req.session.active_user_login }] },
             { $and: [{ ps_tagged_user_id: req.session.user_id , pps_property_id: req.query.id, ps_other_property_type: req.session.active_user_login }] }
           ]*/
          // $and: [{ pps_user_id: req.session.user_id, pps_property_id: req.query.id, pps_is_active_user_flag: req.session.active_user_login }] 
        });
        let allDocumentUploadByCustmer = await CustomerUploadDocsSchema.find({
          cuds_property_id: req.query.id,
          // $and: [{ cuds_customer_id: req.session.user_id, cuds_property_id: req.query.id, cuds_is_active_user_flag: req.session.active_user_login }]
        });
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
                { $and: [{ sms_sender_id: req.session.user_id }, { sms_receiver_id: k.pps_service_provider_id }, { sms_is_active_user_flag: req.session.active_user_login }, { sms_property_id: req.session.property_id }] },
                { $and: [{ sms_sender_id: k.pps_service_provider_id }, { sms_receiver_id: req.session.user_id }, { sms_property_id: req.session.property_id }] }
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

        //console.log("TaskDetailObj===================================================",TaskDetailObj)
        var phase_page_name = '';
        for (var ph of TaskDetailObj) {
          const PhaseObject = JSON.stringify(ph);
          const to_do_data = JSON.parse(PhaseObject);

          phase_page_name = await getPhase(to_do_data.ppts_phase_flag);
          to_do_data.phase_page_name = phase_page_name
          //to_do_data.step=to_do_data.ppts_phase_flag
          //console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%',to_do_data)
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





















        //console.log("data=======================",data)

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



function getPhase(phase) {
  if (phase == 'A') {
    return 'mydreamhome-details-phase-a';
  } else if (phase == 'B') {
    return 'mydreamhome-details-phase-b';
  } else if (phase == 'C') {
    return 'mydreamhome-details-phase-c';
  } else if (phase == 'D') {
    return 'mydreamhome-details-phase-d';
  } else if (phase == 'E') {
    return 'mydreamhome-details-phase-e';
  } else if (phase == 'F') {
    return 'mydreamhome-details-phase-f';
  } else if (phase == 'G') {
    return 'mydreamhome-details-phase-g';
  } else if (phase == 'H') {
    return 'mydreamhome-details-phase-h';
  } else {
    return 'mydreamhome-details-phase-o';
  }


}
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


// app.get('/dashboard-professional', isServiceProvider, (req, res) => {
//   err_msg = req.flash('err_msg');
//   success_msg = req.flash('success_msg');
//   res.render('dashboard-professional', {
//     err_msg, success_msg, layout: false,
//     session: req.session
//   });
// });
// app.get('/signup-professionals-profile', isServiceProvider, (req, res) => {
//   err_msg = req.flash('err_msg');
//   success_msg = req.flash('success_msg');
//   console.log("Current session is : ", req.session);
//   res.render('signup-professionals-profile', {
//     err_msg, success_msg, layout: false,
//     session: req.session
//   });
// });
// app.get('/signup-professionals-profile-2', isServiceProvider, (req, res) => {
//   err_msg = req.flash('err_msg');
//   success_msg = req.flash('success_msg');
//   res.render('signup-professionals-profile-2', {
//     err_msg, success_msg, layout: false,
//     session: req.session
//   });
// });
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
// app.get('/signup-professionals-profile-4', isServiceProvider, (req, res) => {
//   err_msg = req.flash('err_msg');
//   success_msg = req.flash('success_msg');
//   res.render('signup-professionals-profile-4', {
//     err_msg, success_msg, layout: false,
//     session: req.session
//   });
// });
// app.get('/signup-professionals-profile-5', (req, res) => {
//   err_msg = req.flash('err_msg');
//   success_msg = req.flash('success_msg');
//   res.render('signup-professionals-profile-5', {
//     err_msg, success_msg, layout: false,
//     session: req.session
//   });
// });
// app.get('/signup-professionals-profile-6', (req, res) => {
//   err_msg = req.flash('err_msg');
//   success_msg = req.flash('success_msg');
//   res.render('signup-professionals-profile-6', {
//     err_msg, success_msg, layout: false,
//     session: req.session
//   });
// });
// app.get('/signup-professionals-profile-7', isServiceProvider, (req, res) => {
//   err_msg = req.flash('err_msg');
//   success_msg = req.flash('success_msg');
//   res.render('signup-professionals-profile-7', {
//     err_msg, success_msg, layout: false,
//     session: req.session
//   });
// });
// app.get('/portfolio', isServiceProvider, (req, res) => {
//   err_msg = req.flash('err_msg');
//   success_msg = req.flash('success_msg');
//   res.render('portfolio', {
//     err_msg, success_msg, layout: false,
//     session: req.session
//   });
// });


app.get('/index', (req, res) => {
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  res.render('index', {
    err_msg, success_msg, layout: false,
    session: req.session
  });
});

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

  const { page = 1, limit = 5 } = req.query;
  var QueryData = {
    $or: [
      { $and: [{ sms_sender_id: req.query.sms_sender_id }, { sms_receiver_id: req.query.sms_receiver_id }] },
      { $and: [{ sms_sender_id: req.query.sms_receiver_id }, { sms_receiver_id: req.query.sms_sender_id }] }
    ]
  };
  const count = await MessageSchema.countDocuments(QueryData);

  MessageSchema.find(QueryData).sort({ _id: -1 }).limit(limit * 1).skip((page - 1) * limit).then(async (data) => {
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
            t.senderName = await professional.sps_fullname;
          }
        });
        const s = await t;
        await CustomerSchema.findOne({ _id: s.sms_sender_id }).then(async customer => {
          if (customer) {
            s.senderName = await customer.cus_fullname;
            s.sms_user_profile_img = await customer.cus_profile_image_name;
          }
        });
        const ss = await s;
        newData.push(ss);
      }
      // console.log('Get newData',newData);

      console.log('Count', count);
      console.log('Totalpage', Math.ceil(count / limit));
      console.log('Page', page);

      err_msg = req.flash('err_msg');
      success_msg = req.flash('success_msg');
      res.send({
        err_msg, success_msg, layout: false,
        session: req.session,
        chatData: newData,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        msgcount: count
      });
    }
  }).catch((err) => {
    console.log(err)
  })
});



app.get('/get-message-property', async (req, res) => {
  var newData = [];
  var newData1 = [];

  const { page = 1, limit = 5 } = req.query;
  var QueryData = {
    $or: [
      { $and: [{ sms_sender_id: req.query.sms_sender_id }, { sms_receiver_id: req.query.sms_receiver_id }, { sms_property_id: req.query.sms_property_id }] },
      { $and: [{ sms_sender_id: req.query.sms_receiver_id }, { sms_receiver_id: req.query.sms_sender_id }, { sms_property_id: req.query.sms_property_id }] }
    ]
  };
  const count = await MessageSchema.countDocuments(QueryData);


  MessageSchema.find(QueryData).sort({ _id: -1 }).limit(limit * 1).skip((page - 1) * limit).then(async (data) => {
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
            t.senderName = await professional.sps_fullname;
          }
        });
        const s = await t;
        await CustomerSchema.findOne({ _id: s.sms_sender_id }).then(async customer => {
          if (customer) {
            s.senderName = await customer.cus_fullname;
            s.sms_user_profile_img = await customer.cus_profile_image_name;
          }
        });
        const ss = await s;
        newData.push(ss);
      }
      console.log('Get newData', newData);

      console.log('Count', count);
      console.log('Totalpage', Math.ceil(count / limit));
      console.log('Page', page);

      err_msg = req.flash('err_msg');
      success_msg = req.flash('success_msg');
      res.send({
        err_msg, success_msg, layout: false,
        session: req.session,
        chatData: newData,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        msgcount: count
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
  console.log("req.session.user_id", req.session.user_id);
  console.log(" req.session.active_user_login:", req.session.active_user_login);

  PropertiesSchema.find({
    $or: [
      { $and: [{ ps_user_id: req.session.user_id }, { ps_is_active_user_flag: req.session.active_user_login }] },
      { $and: [{ ps_tagged_user_id: req.session.user_id }, { ps_other_property_type: req.session.active_user_login }] }
    ]
    // ps_user_id: req.session.user_id, ps_is_active_user_flag: req.session.active_user_login
  }).then(async (data) => {
    console.log("Complaint property session is:", data);
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
app.get('/edit-property', isCustomer, async (req, res) => {
  //req.session.propertyEditId
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  console.log("edit:==", req.query)
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
      propertyObj: propertyObj,
      propertyImageObject: propertyImageObject,
      propertyPlanImageObject: propertyPlanImageObject

    });
  } else {

    res.render('edit-property', {
      err_msg, success_msg, layout: false,
      session: req.session,
      propertyObj: 'null'
    });
  }
});
app.get('/to-do-list', isCustomer, async (req, res) => {
  var err_msg = null;
  var success_msg = null;
  console.log("todo")
  req.session.pagename = 'to-do-list';
  // let propertyObj = await propertyDetail.GetAllProperty(req.session.user_id, req.session.active_user_login);
  let propertyObj= await  PropertiesSchema.find({
    $or: [
      { $and: [{ ps_user_id: req.session.user_id }, { ps_is_active_user_flag: req.session.active_user_login },] },
      { $and: [{ ps_tagged_user_id: req.session.user_id }, { ps_other_property_type: req.session.active_user_login }] }
    ]
  }).sort({ _id: -1 })
   console.log('property in to-do-list', propertyObj);
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  res.render('to-do-list', {
    err_msg, success_msg, layout: false,
    session: req.session,
    propertyObj: propertyObj,
    moment: moment,
    TaskDetailObj: []

  });


});

app.post('/get_property_by_id', isCustomer, async (req, res) => {

  if (req.body.property_id) {
    let singlePropertyObj = await propertyDetail.GetPropertById(req.body.property_id, req.session.active_user_login);
    console.log('singlePropertyObj', singlePropertyObj);
    if (singlePropertyObj) {
      return res.send({
        'status': true,
        'message': 'single property found success',
        'data': singlePropertyObj
      })
    }
  } else {
    return res.send({
      'status': false,
      'message': 'property id not found'
    })
  }


});
app.get('/take-action', isCustomer, async (req, res) => {

  console.log('from get take action url====', req.query)
  var property_id = req.query.prop;
  var phase_name = req.query.phase;
  var taskObject = await TaskHelper.GetTaskByPhaseName(property_id, phase_name, req.session.active_user_login);
  var propertyData = await propertyDetail.GetPropertById(property_id, req.session.active_user_login);
  console.log("taskObject by phase name take action", taskObject)


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
  } else {
    return res.send({
      'status': false,
      'message': 'some thing wrong'
    })
  }


})

app.get('/mydreamhome-details-phase', isCustomer, async (req, res) => {

  console.log('from get take action url====', req.query)
  var property_id = req.session.property_id;
  var phase_name = req.query.phase;
  var taskObject = await TaskHelper.GetTaskByPhaseName(property_id, phase_name, req.session.active_user_login);
  var propertyData = await propertyDetail.GetPropertById(property_id, req.session.active_user_login);
  console.log("taskObject by phase name take action", taskObject)
  if (taskObject) {
    req.session.pagename = 'mydreamhome';
    err_msg = req.flash('err_msg');
    success_msg = req.flash('success_msg');
    res.render('mydreamhome-details-phase', {
      err_msg, success_msg, layout: false,
      session: req.session,
      taskObject: taskObject,
      propertyData: propertyData,
      step: req.query.step,
      phase: req.query.phase
    });
  } else {
    return res.send({
      'status': false,
      'message': 'some thing wrong'
    })
  }
})



// All Professional Filter name surname qualification
app.get('/global-search', isCustomer, (req, res) => {

  console.log("current session is", req.session);
  PropertiesSchema.find({
    ps_property_name: new RegExp(req.query.global_search, 'i'), $or: [
      { $and: [{ ps_user_id: req.session.user_id }, { ps_is_active_user_flag: req.session.active_user_login },] },
      { $and: [{ ps_tagged_user_id: req.session.user_id }, { ps_is_active_user_flag: req.session.active_user_login }] }
    ]
  }).then(async (data) => {
    if (data) {
      let arr = [];
      for (let img of data) {
        await PropertiesPictureSchema.find({ pps_property_id: img._id, pps_is_active_user_flag: req.session.active_user_login }).then(async (result) => {
          let temp = await result
          arr.push(temp)
        })
      }
      // console.log('++++++++',arr)

      err_msg = req.flash('err_msg');
      success_msg = req.flash('success_msg');

      res.render('global-search', {
        err_msg, success_msg, layout: false,
        session: req.session,
        propertyData: data,
        propertyImage: arr

      });

    }
  }).catch((err) => {
    console.log(err)
  })



});

app.get('/get_phase_task_list', isCustomer, async (req, res) => {
  console.log('from get take action url====', req.query)
  console.log('from get take action url+++++', req.body)
  console.log('req.session.user_id', req.session.user_id)
  var pushArray = '';
  //var propertyData = await PropertyProfessinoalTaskSchema.GetPropertById(property_id, req.session.active_user_login);
  await PropertyProfessinoalTaskSchema.find({
    ppts_assign_to: req.query.ppts_assign_to, ppts_phase_flag: req.query.ppts_phase_flag, ppts_property_id: req.query.ppts_property_id, ppts_user_id: req.session.user_id
  }).sort({ _id: -1 }).then(async (taskObject) => {
    console.log("taskObject by phase name take action", taskObject)
    if (taskObject) {

      await PropertiesSchema.findOne({ _id: req.query.ppts_property_id }).then(async (propertyData) => {
        if ('ps_tagged_user_id' in propertyData) {
          console.log('here..1');
          if (propertyData.ps_tagged_user_id == req.session.user_id) {
            console.log('here..2');
            await PropertyProfessinoalTaskSchema.find({
              ppts_assign_to: req.query.ppts_assign_to, ppts_phase_flag: req.query.ppts_phase_flag, ppts_property_id: req.query.ppts_property_id, ppts_user_id: propertyData.ps_user_id
            }).sort({ _id: -1 }).then(async (taskObject1) => {
              if (taskObject1) {
                pushArray = taskObject1;
              }
            });
          } else {
            console.log('here..111');

            await PropertyProfessinoalTaskSchema.find({
              ppts_assign_to: req.query.ppts_assign_to, ppts_phase_flag: req.query.ppts_phase_flag, ppts_property_id: req.query.ppts_property_id, ppts_user_id: propertyData.ps_tagged_user_id
            }).sort({ _id: -1 }).then(async (taskObject1) => {
              if (taskObject1) {
                pushArray = taskObject1;
              }
            });
          }
        }
      });


      console.log('taskTag:', pushArray)
      console.log('taskObject:', taskObject)
      const array3 = [...taskObject, ...pushArray];
      console.log('taskTagarray3:', array3)

      req.session.pagename = 'mydreamhome';
      err_msg = req.flash('err_msg');
      success_msg = req.flash('success_msg');
      res.send({
        err_msg, success_msg, layout: false,
        session: req.session,
        taskObject: array3,
      });


    } else {
      return res.send({
        'status': false,
        'message': 'some thing wrong'
      })
    }
  })
})

function removeDuplicates(originalArray, prop) {
  var newArray = [];
  var lookupObject = {};

  for (var i in originalArray) {
    lookupObject[originalArray[i][prop]] = originalArray[i];
  }

  for (i in lookupObject) {
    newArray.push(lookupObject[i]);
  }
  return newArray;
}
app.get('/task-details-docs', isCustomer, async (req, res) => {
  req.session.pagename = 'mydreamhome';
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  let property = await PropertiesSchema.findOne({
    _id: req.session.property_id
  });
  const allDocument = await CustomerUploadDocsSchema.find({
    cuds_property_id: req.session.property_id
  }).sort({ _id: -1 });
  let AllhiredProfeshnoal = await PropertyProfessionalSchema.find({
    pps_property_id: req.session.property_id
  });
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


  //console.log('allDocument:', allDocument)

  res.render('task-details-docs', {
    err_msg, success_msg, layout: false,
    session: req.session,
    data: serviceProvArray,
    allDocument: allDocument,
    property: property,
    moment: moment
  });




});



// My Professional Filter name surname qualification
app.post('/professionals-multifilter', async (req, res) => {
  req.session.pagename = 'professionals';
  console.log('multifilterData:', req.body)
  let QuerySyntex = '';
  let categoryKeyword = '';
  let experienceKeyword = '';
  let cityKeyword = '';
  let languageKeyword = '';
  let categoryServiceProvIdArray = [], categoryServiceProvData = [];
  let experienceServiceProvIdArray = [], experienceServiceProvData = [];
  let cityServiceProvIdArray = [], cityServiceProvData = [];
  let languageServiceProvIdArray = [], languageServiceProvData = [];
  let catExpServiceProvIdArray = [];
  if (Object.keys(req.body).length === 0 && req.body.constructor === Object) {
    console.log('notingngngngngn');
    res.send({
      err_msg, success_msg, layout: false,
      session: req.session,
      filterData: ''
    })

  } else {

    if (req.body.category != undefined) {
      if (typeof (req.body.category) == 'object') {
        categoryKeyword = req.body.category;
      } else {
        var arr = [];
        arr.push(req.body.category);
        categoryKeyword = arr;
      }
    }

    if (req.body.experience != undefined) {
      if (typeof (req.body.experience) == 'object') {
        experienceKeyword = req.body.experience;
      } else {
        var arr = [];
        arr.push(req.body.experience);
        experienceKeyword = arr;
      }
    }

    if (req.body.location_city != undefined) {
      if (typeof (req.body.location_city) == 'object') {
        cityKeyword = req.body.location_city;
      } else {
        var arr = [];
        arr.push(req.body.location_city);
        cityKeyword = arr;
      }
    }

    if (req.body.language != undefined) {
      if (typeof (req.body.language) == 'object') {
        languageKeyword = req.body.language;
      } else {
        var arr = [];
        arr.push(req.body.language);
        languageKeyword = arr;
      }
    }


    console.log('categoryKeyword:', categoryKeyword)
    console.log('experienceKeyword:', experienceKeyword)
    console.log('cityKeyword:', cityKeyword)
    console.log('languageKeyword:', languageKeyword)

    const { page = 1, limit = 4 } = req.body;
    let count = 0;
    console.log('pageQuery:', page);
    console.log('req.query:', req.body);

    /*== Category==*/
    if (categoryKeyword) {
      console.log('categoryKeyword11:', categoryKeyword)

      //QuerySyntexCount = { sps_role_name: { $in: categoryKeyword }, sps_status: 'active'  };

      // for (var categoryWord of categoryKeyword) {
      QuerySyntex = { sps_role_name: { $in: categoryKeyword }, sps_status: 'active' };
      count = await ServiceProviderSchema.countDocuments(QuerySyntex);
      console.log('countcount:', count);
      console.log('limitss:', limit);

      await ServiceProviderSchema.find(QuerySyntex).sort({ _id: -1 }).limit(limit * 1).skip((page - 1) * limit).then(async service_provider_detail => {
        if (service_provider_detail) {
          console.log('service_provider_detail:', service_provider_detail);

          for (var sp_id of service_provider_detail) {
            //let temp = await sp_id._id;

            await ServiceProviderOtherDetailsSchema.findOne({ spods_service_provider_id: sp_id._id }).then(async otherDetails => {
              if (otherDetails) {
                const spProvider = JSON.stringify(sp_id);
                const parseSpProvider = JSON.parse(spProvider);
                parseSpProvider.professionalBody = otherDetails.spods_professional_body
                let professionalRating = await RatingSchema.find({ sprs_service_provider_id: sp_id._id })
                // console.log('professionalRating:', professionalRating)
                var sumRating = 0;
                for (var RatingData of professionalRating) {
                  sumRating += parseInt(RatingData.sprs_rating);
                }
                let avgRating = sumRating / professionalRating.length;
                if (!isNaN(avgRating)) {
                  avgRating = avgRating.toFixed(1);
                } else {
                  avgRating = 0;
                }
                //console.log('avgRating:', avgRating)
                let temps = await parseSpProvider
                const spProvider1 = JSON.stringify(temps);
                const parseSpProvider1 = JSON.parse(spProvider1);
                parseSpProvider1.avgRating = avgRating
                categoryServiceProvData.push(parseSpProvider1);
              }
            });
            //let temp = await sp_id._id.toString();
            //await categoryServiceProvIdArray.push(temp);
          }
        }
      })

      await ServiceProviderSchema.find(QuerySyntex).then(async service_provider_detail1 => {
        if (service_provider_detail1) {
          for (var sp_id1 of service_provider_detail1) {
            let temp = await sp_id1._id.toString();
            await categoryServiceProvIdArray.push(temp);
          }
        }
      });


      //}

      console.log('currentPage:', page);
      console.log('totalPages:', Math.ceil(count / limit));

      //if(experienceKeyword == '' && ){
      if (experienceKeyword == '' && cityKeyword == '' && languageKeyword == '') {
        console.log('categoryServiceProvData:', categoryServiceProvData);
        res.send({
          err_msg, success_msg, layout: false,
          session: req.session,
          filterData: categoryServiceProvData,
          totalPages: Math.ceil(count / limit),
          currentPage: page
        })
      }
    }


    /*== Location === */
    if (cityKeyword) {
      console.log('cityKeyword11:', cityKeyword)
      //for (var cityWord of cityKeyword) {
      QuerySyntex = { sps_city: { $in: cityKeyword }, sps_status: 'active' };

      count = await ServiceProviderSchema.countDocuments(QuerySyntex);
      console.log('countcount:', count);
      await ServiceProviderSchema.find(QuerySyntex).sort({ _id: -1 }).limit(limit * 1).skip((page - 1) * limit).then(async service_provider_detail => {
        if (service_provider_detail) {
          for (var sp_id of service_provider_detail) {
            //let temp = await sp_id._id;

            await ServiceProviderOtherDetailsSchema.findOne({ spods_service_provider_id: sp_id._id }).then(async otherDetails => {
              if (otherDetails) {
                const spProvider = JSON.stringify(sp_id);
                const parseSpProvider = JSON.parse(spProvider);
                parseSpProvider.professionalBody = otherDetails.spods_professional_body
                let professionalRating = await RatingSchema.find({ sprs_service_provider_id: sp_id._id })
                console.log('professionalRating:', professionalRating)
                var sumRating = 0;
                for (var RatingData of professionalRating) {
                  sumRating += parseInt(RatingData.sprs_rating);
                }
                let avgRating = sumRating / professionalRating.length;
                if (!isNaN(avgRating)) {
                  avgRating = avgRating.toFixed(1);
                } else {
                  avgRating = 0;
                }
                console.log('avgRating:', avgRating)
                let temps = await parseSpProvider
                const spProvider1 = JSON.stringify(temps);
                const parseSpProvider1 = JSON.parse(spProvider1);
                parseSpProvider1.avgRating = avgRating
                cityServiceProvData.push(parseSpProvider1);
              }
            });
            let temp = await sp_id._id.toString();
            await cityServiceProvIdArray.push(temp);
          }
        }
      })

      await ServiceProviderSchema.find(QuerySyntex).then(async service_provider_detail1 => {
        if (service_provider_detail1) {
          for (var sp_id1 of service_provider_detail1) {
            let temp = await sp_id1._id.toString();
            await cityServiceProvIdArray.push(temp);
          }
        }
      });


      // }

      console.log('currentPage:', page);
      console.log('totalPages:', Math.ceil(count / limit));

      if (experienceKeyword == '' && categoryKeyword == '' && languageKeyword == '') {
        res.send({
          err_msg, success_msg, layout: false,
          session: req.session,
          filterData: cityServiceProvData,
          totalPages: Math.ceil(count / limit),
          currentPage: page
        })
      }
    }

    /*===Language=== */

    if (languageKeyword) {
      console.log('cityKeyword11:', languageKeyword)
      //for (var languageWord of languageKeyword) {
      QuerySyntex = { spls_language: { $in: languageKeyword }, sps_status: 'active' };
      count = await ServiceProviderLanguageSchema.countDocuments(QuerySyntex);
      console.log('countcount:', count);
      await ServiceProviderLanguageSchema.find(QuerySyntex).sort({ _id: -1 }).limit(limit * 1).skip((page - 1) * limit).then(async service_provider_detail_lang => {
        if (service_provider_detail_lang) {
          for (var lang_sp_id of service_provider_detail_lang) {
            //let temp = await sp_id._id;
            await ServiceProviderSchema.find({ _id: lang_sp_id.spls_service_provider_id }).then(async service_provider_detail => {
              for (var sp_id of service_provider_detail) {
                await ServiceProviderOtherDetailsSchema.findOne({ spods_service_provider_id: sp_id._id }).then(async otherDetails => {
                  if (otherDetails) {
                    const spProvider = JSON.stringify(sp_id);
                    const parseSpProvider = JSON.parse(spProvider);
                    parseSpProvider.professionalBody = otherDetails.spods_professional_body
                    let professionalRating = await RatingSchema.find({ sprs_service_provider_id: sp_id._id })
                    // console.log('professionalRating:', professionalRating)
                    var sumRating = 0;
                    for (var RatingData of professionalRating) {
                      sumRating += parseInt(RatingData.sprs_rating);
                    }
                    let avgRating = sumRating / professionalRating.length;
                    if (!isNaN(avgRating)) {
                      avgRating = avgRating.toFixed(1);
                    } else {
                      avgRating = 0;
                    }
                    console.log('avgRating:', avgRating)
                    let temps = await parseSpProvider
                    const spProvider1 = JSON.stringify(temps);
                    const parseSpProvider1 = JSON.parse(spProvider1);
                    parseSpProvider1.avgRating = avgRating
                    languageServiceProvData.push(parseSpProvider1);
                  }
                });
              }

            })

            //  let temp = await lang_sp_id.spls_service_provider_id.toString();
            //  await languageServiceProvIdArray.push(temp);
          }
        }
      })


      await ServiceProviderLanguageSchema.find(QuerySyntex).then(async service_provider_detail_lang1 => {
        if (service_provider_detail_lang1) {
          for (var lang_sp_id1 of service_provider_detail_lang1) {
            let temp = await lang_sp_id1.spls_service_provider_id.toString();
            await languageServiceProvIdArray.push(temp);
          }
        }
      });


      //}

      console.log('currentPage:', page);
      console.log('totalPages:', Math.ceil(count / limit));

      if (experienceKeyword == '' && categoryKeyword == '' && cityKeyword == '') {
        res.send({
          err_msg, success_msg, layout: false,
          session: req.session,
          filterData: languageServiceProvData,
          totalPages: Math.ceil(count / limit),
          currentPage: page
        })
      }
    }




    /*=== Expirence ==*/

    if (experienceKeyword) {
      //for (var experienceWord of experienceKeyword) {
      QuerySyntex = { sps_experience: { $in: experienceKeyword }, sps_status: 'active' };
      count = await ServiceProviderSchema.countDocuments(QuerySyntex);
      //console.log('countcount:',count);
      await ServiceProviderSchema.find(QuerySyntex).sort({ _id: -1 }).limit(limit * 1).skip((page - 1) * limit).then(async service_provider_detail => {
        if (service_provider_detail) {
          for (var sp_id of service_provider_detail) {

            await ServiceProviderOtherDetailsSchema.findOne({ spods_service_provider_id: sp_id._id }).then(async otherDetails => {
              if (otherDetails) {
                const spProvider = JSON.stringify(sp_id);
                const parseSpProvider = JSON.parse(spProvider);
                parseSpProvider.professionalBody = otherDetails.spods_professional_body
                let professionalRating = await RatingSchema.find({ sprs_service_provider_id: sp_id._id })
                // console.log('professionalRating:', professionalRating)
                var sumRating = 0;
                for (var RatingData of professionalRating) {
                  sumRating += parseInt(RatingData.sprs_rating);
                }
                let avgRating = sumRating / professionalRating.length;
                if (!isNaN(avgRating)) {
                  avgRating = avgRating.toFixed(1);
                } else {
                  avgRating = 0;
                }
                // console.log('avgRating:', avgRating)
                let temps = await parseSpProvider
                const spProvider1 = JSON.stringify(temps);
                const parseSpProvider1 = JSON.parse(spProvider1);
                parseSpProvider1.avgRating = avgRating
                experienceServiceProvData.push(parseSpProvider1);
              }
            });


            //await experienceServiceProvData.push(sp_id);

          }
        }
      })



      await ServiceProviderSchema.find(QuerySyntex).then(async service_provider_detail1 => {
        if (service_provider_detail1) {
          for (var sp_id1 of service_provider_detail1) {
            let temp = await sp_id1._id.toString();
            await experienceServiceProvIdArray.push(temp);
          }
        }
      });
      // }

      //console.log('currentPage:',page);
      //console.log('totalPages:',Math.ceil(count / limit));

      if (categoryKeyword == '' && cityKeyword == '' && languageKeyword == '') {
        res.send({
          err_msg, success_msg, layout: false,
          session: req.session,
          filterData: experienceServiceProvData,
          totalPages: Math.ceil(count / limit),
          currentPage: page
        })
      }
    }

    /*== Location === */
    // if (cityKeyword) {
    //   console.log('cityKeyword11:', cityKeyword)
    //   for (var cityWord of cityKeyword) {
    //     QuerySyntex = { sps_city: cityWord };
    //     await ServiceProviderSchema.find(QuerySyntex).then(async service_provider_detail => {
    //       if (service_provider_detail) {
    //         for (var sp_id of service_provider_detail) {
    //           //let temp = await sp_id._id;

    //           await ServiceProviderOtherDetailsSchema.findOne({ spods_service_provider_id: sp_id._id }).then(async otherDetails => {
    //             if (otherDetails) {
    //               const spProvider = JSON.stringify(sp_id);
    //               const parseSpProvider = JSON.parse(spProvider);
    //               parseSpProvider.professionalBody = otherDetails.spods_professional_body
    //               let professionalRating = await RatingSchema.find({ sprs_service_provider_id: sp_id._id })
    //               console.log('professionalRating:', professionalRating)
    //               var sumRating = 0;
    //               for (var RatingData of professionalRating) {
    //                 sumRating += parseInt(RatingData.sprs_rating);
    //               }
    //               let avgRating = Math.round(sumRating / professionalRating.length);
    //               if (!isNaN(avgRating)) {
    //                 avgRating = avgRating.toFixed(1);
    //               } else {
    //                 avgRating = 0;
    //               }
    //               console.log('avgRating:', avgRating)
    //               let temps = await parseSpProvider
    //               const spProvider1 = JSON.stringify(temps);
    //               const parseSpProvider1 = JSON.parse(spProvider1);
    //               parseSpProvider1.avgRating = avgRating
    //               cityServiceProvData.push(parseSpProvider1);
    //             }
    //           });
    //           let temp = await sp_id._id.toString();
    //           await cityServiceProvIdArray.push(temp);
    //         }
    //       }
    //     })
    //   }
    //   if (experienceKeyword == '' && categoryKeyword == '' && languageKeyword == '') {
    //     res.send({
    //       err_msg, success_msg, layout: false,
    //       session: req.session,
    //       filterData: cityServiceProvData
    //     })
    //   }
    // }

    /*===Language=== */

    // if (languageKeyword) {
    //   console.log('cityKeyword11:', languageKeyword)
    //   for (var languageWord of languageKeyword) {
    //     QuerySyntex = { spls_language: languageWord };
    //     await ServiceProviderLanguageSchema.find(QuerySyntex).then(async service_provider_detail_lang => {
    //       if (service_provider_detail_lang) {
    //         for (var lang_sp_id of service_provider_detail_lang) {
    //           //let temp = await sp_id._id;
    //           await ServiceProviderSchema.find({ _id: lang_sp_id.spls_service_provider_id }).then(async service_provider_detail => {
    //             for (var sp_id of service_provider_detail) {
    //               await ServiceProviderOtherDetailsSchema.findOne({ spods_service_provider_id: sp_id._id }).then(async otherDetails => {
    //                 if (otherDetails) {
    //                   const spProvider = JSON.stringify(sp_id);
    //                   const parseSpProvider = JSON.parse(spProvider);
    //                   parseSpProvider.professionalBody = otherDetails.spods_professional_body
    //                   let professionalRating = await RatingSchema.find({ sprs_service_provider_id: sp_id._id })
    //                   console.log('professionalRating:', professionalRating)
    //                   var sumRating = 0;
    //                   for (var RatingData of professionalRating) {
    //                     sumRating += parseInt(RatingData.sprs_rating);
    //                   }
    //                   let avgRating = Math.round(sumRating / professionalRating.length);
    //                   if (!isNaN(avgRating)) {
    //                     avgRating = avgRating.toFixed(1);
    //                   } else {
    //                     avgRating = 0;
    //                   }
    //                   console.log('avgRating:', avgRating)
    //                   let temps = await parseSpProvider
    //                   const spProvider1 = JSON.stringify(temps);
    //                   const parseSpProvider1 = JSON.parse(spProvider1);
    //                   parseSpProvider1.avgRating = avgRating
    //                   languageServiceProvData.push(parseSpProvider1);
    //                 }
    //               });
    //             }

    //           })

    //           let temp = await lang_sp_id.spls_service_provider_id.toString();
    //           await languageServiceProvIdArray.push(temp);
    //         }
    //       }
    //     })
    //   }
    //   if (experienceKeyword == '' && categoryKeyword == '' && cityKeyword == '') {
    //     res.send({
    //       err_msg, success_msg, layout: false,
    //       session: req.session,
    //       filterData: languageServiceProvData
    //     })
    //   }
    // }




    /*==  Category and Expirence  ==*/
    if (experienceServiceProvIdArray != '' && categoryServiceProvIdArray != '' && cityServiceProvIdArray == '' && languageServiceProvIdArray == '') {
      console.log('insideee Category and Expirence')
      let ttt = await getMatch(experienceServiceProvIdArray, categoryServiceProvIdArray);
      console.log('ttt:', ttt)

      count = ttt.length;
      console.log('CE countcount:', count);

      if (ttt) {
        //for (var t of ttt) {
        // if(t){
        QuerySyntex = { _id: { $in: ttt } };
        console.log()
        await ServiceProviderSchema.find(QuerySyntex).sort({ _id: -1 }).limit(limit * 1).skip((page - 1) * limit).then(async service_provider_detail => {
          if (service_provider_detail) {
            for (var sp_id of service_provider_detail) {

              await ServiceProviderOtherDetailsSchema.findOne({ spods_service_provider_id: sp_id._id }).then(async otherDetails => {
                if (otherDetails) {
                  const spProvider = JSON.stringify(sp_id);
                  const parseSpProvider = JSON.parse(spProvider);
                  parseSpProvider.professionalBody = otherDetails.spods_professional_body
                  let professionalRating = await RatingSchema.find({ sprs_service_provider_id: sp_id._id })
                  //console.log('professionalRating:', professionalRating)
                  var sumRating = 0;
                  for (var RatingData of professionalRating) {
                    sumRating += parseInt(RatingData.sprs_rating);
                  }
                  let avgRating = sumRating / professionalRating.length;
                  if (!isNaN(avgRating)) {
                    avgRating = avgRating.toFixed(1);
                  } else {
                    avgRating = 0;
                  }
                  //console.log('avgRating:', avgRating)
                  let temps = await parseSpProvider
                  const spProvider1 = JSON.stringify(temps);
                  const parseSpProvider1 = JSON.parse(spProvider1);
                  parseSpProvider1.avgRating = avgRating
                  catExpServiceProvIdArray.push(parseSpProvider1);
                }
              });
              //let temp = await sp_id;
              // await catExpServiceProvIdArray.push(temp);
            }
          }
        })
        //}
        // }
        console.log('currentPage:', page);
        console.log('totalPages:', Math.ceil(count / limit));

        res.send({
          err_msg, success_msg, layout: false,
          session: req.session,
          filterData: catExpServiceProvIdArray,
          totalPages: Math.ceil(count / limit),
          currentPage: page
        })

      } else {
        res.send({
          err_msg, success_msg, layout: false,
          session: req.session,
          filterData: ''
        })
      }
    }


    /*== Category and City ==*/

    if (cityServiceProvIdArray != '' && categoryServiceProvIdArray != '' && experienceServiceProvIdArray == '' && languageServiceProvIdArray == '') {
      console.log('insideee Category and City')
      let ttt = await getMatch(cityServiceProvIdArray, categoryServiceProvIdArray);
      console.log('ttt:', ttt)

      count = ttt.length;
      console.log('CC countcount:', count);

      if (ttt) {
        //  for (var t of ttt) {
        //       if(t){
        QuerySyntex = { _id: { $in: ttt } };
        console.log()
        await ServiceProviderSchema.find(QuerySyntex).limit(limit * 1).skip((page - 1) * limit).then(async service_provider_detail => {
          if (service_provider_detail) {
            for (var sp_id of service_provider_detail) {

              await ServiceProviderOtherDetailsSchema.findOne({ spods_service_provider_id: sp_id._id }).then(async otherDetails => {
                if (otherDetails) {
                  const spProvider = JSON.stringify(sp_id);
                  const parseSpProvider = JSON.parse(spProvider);
                  parseSpProvider.professionalBody = otherDetails.spods_professional_body
                  let professionalRating = await RatingSchema.find({ sprs_service_provider_id: sp_id._id })
                  // console.log('professionalRating:', professionalRating)
                  var sumRating = 0;
                  for (var RatingData of professionalRating) {
                    sumRating += parseInt(RatingData.sprs_rating);
                  }
                  let avgRating = sumRating / professionalRating.length;
                  if (!isNaN(avgRating)) {
                    avgRating = avgRating.toFixed(1);
                  } else {
                    avgRating = 0;
                  }
                  //console.log('avgRating:', avgRating)
                  let temps = await parseSpProvider
                  const spProvider1 = JSON.stringify(temps);
                  const parseSpProvider1 = JSON.parse(spProvider1);
                  parseSpProvider1.avgRating = avgRating
                  catExpServiceProvIdArray.push(parseSpProvider1);
                }
              });
            }
          }
        })
        //   }
        // }

        console.log('currentPage:', page);
        console.log('totalPages:', Math.ceil(count / limit));


        res.send({
          err_msg, success_msg, layout: false,
          session: req.session,
          filterData: catExpServiceProvIdArray,
          totalPages: Math.ceil(count / limit),
          currentPage: page
        })

      } else {
        res.send({
          err_msg, success_msg, layout: false,
          session: req.session,
          filterData: ''
        })
      }
    }


    /*== Category And Language == */

    if (languageServiceProvIdArray != '' && categoryServiceProvIdArray != '' && cityServiceProvIdArray == '' && experienceServiceProvIdArray == '') {
      console.log('insideee Category And Language')
      let ttt = await getMatch(languageServiceProvIdArray, categoryServiceProvIdArray);
      console.log('ttt:', ttt)

      count = ttt.length;
      console.log('CL countcount:', count);

      if (ttt) {
        //  for (var t of ttt) {
        //       if(t){
        QuerySyntex = { _id: { $in: ttt } };
        console.log()
        await ServiceProviderSchema.find(QuerySyntex).limit(limit * 1).skip((page - 1) * limit).then(async service_provider_detail => {
          if (service_provider_detail) {
            for (var sp_id of service_provider_detail) {

              await ServiceProviderOtherDetailsSchema.findOne({ spods_service_provider_id: sp_id._id }).then(async otherDetails => {
                if (otherDetails) {
                  const spProvider = JSON.stringify(sp_id);
                  const parseSpProvider = JSON.parse(spProvider);
                  parseSpProvider.professionalBody = otherDetails.spods_professional_body
                  let professionalRating = await RatingSchema.find({ sprs_service_provider_id: sp_id._id })
                  //console.log('professionalRating:', professionalRating)
                  var sumRating = 0;
                  for (var RatingData of professionalRating) {
                    sumRating += parseInt(RatingData.sprs_rating);
                  }
                  let avgRating = sumRating / professionalRating.length;
                  if (!isNaN(avgRating)) {
                    avgRating = avgRating.toFixed(1);
                  } else {
                    avgRating = 0;
                  }
                  //console.log('avgRating:', avgRating)
                  let temps = await parseSpProvider
                  const spProvider1 = JSON.stringify(temps);
                  const parseSpProvider1 = JSON.parse(spProvider1);
                  parseSpProvider1.avgRating = avgRating
                  catExpServiceProvIdArray.push(parseSpProvider1);
                }
              });
            }
          }
        })
        //   }
        // }
        console.log('currentPage:', page);
        console.log('totalPages:', Math.ceil(count / limit));

        res.send({
          err_msg, success_msg, layout: false,
          session: req.session,
          filterData: catExpServiceProvIdArray,
          totalPages: Math.ceil(count / limit),
          currentPage: page
        })

      } else {
        res.send({
          err_msg, success_msg, layout: false,
          session: req.session,
          filterData: ''
        })
      }
    }



    /*== Expirence and City ==*/

    if (cityServiceProvIdArray != '' && experienceServiceProvIdArray != '' && categoryServiceProvIdArray == '' && languageServiceProvIdArray == '') {
      console.log('insideee Expirence and City')
      let ttt = await getMatch(cityServiceProvIdArray, experienceServiceProvIdArray);
      console.log('ttt:', ttt)

      count = ttt.length;
      console.log('CL countcount:', count);

      if (ttt) {
        //  for (var t of ttt) {
        //       if(t){
        QuerySyntex = { _id: { $in: ttt } };
        console.log()
        await ServiceProviderSchema.find(QuerySyntex).limit(limit * 1).skip((page - 1) * limit).then(async service_provider_detail => {
          if (service_provider_detail) {
            for (var sp_id of service_provider_detail) {

              await ServiceProviderOtherDetailsSchema.findOne({ spods_service_provider_id: sp_id._id }).then(async otherDetails => {
                if (otherDetails) {
                  const spProvider = JSON.stringify(sp_id);
                  const parseSpProvider = JSON.parse(spProvider);
                  parseSpProvider.professionalBody = otherDetails.spods_professional_body
                  let professionalRating = await RatingSchema.find({ sprs_service_provider_id: sp_id._id })
                  //console.log('professionalRating:', professionalRating)
                  var sumRating = 0;
                  for (var RatingData of professionalRating) {
                    sumRating += parseInt(RatingData.sprs_rating);
                  }
                  let avgRating = sumRating / professionalRating.length;
                  if (!isNaN(avgRating)) {
                    avgRating = avgRating.toFixed(1);
                  } else {
                    avgRating = 0;
                  }
                  //console.log('avgRating:', avgRating)
                  let temps = await parseSpProvider
                  const spProvider1 = JSON.stringify(temps);
                  const parseSpProvider1 = JSON.parse(spProvider1);
                  parseSpProvider1.avgRating = avgRating
                  catExpServiceProvIdArray.push(parseSpProvider1);
                }
              });
            }
          }
        })
        //   }
        // }

        console.log('currentPage:', page);
        console.log('totalPages:', Math.ceil(count / limit));

        res.send({
          err_msg, success_msg, layout: false,
          session: req.session,
          filterData: catExpServiceProvIdArray,
          totalPages: Math.ceil(count / limit),
          currentPage: page
        })

      } else {
        res.send({
          err_msg, success_msg, layout: false,
          session: req.session,
          filterData: ''
        })
      }
    }


    /*== Expirence and Language ==*/

    if (languageServiceProvIdArray != '' && experienceServiceProvIdArray != '' && categoryServiceProvIdArray == '' && cityServiceProvIdArray == '') {
      console.log('insideee Expirence and City')
      let ttt = await getMatch(languageServiceProvIdArray, experienceServiceProvIdArray);
      console.log('ttt:', ttt)

      count = ttt.length;
      console.log('EL countcount:', count);


      if (ttt) {
        //  for (var t of ttt) {
        //       if(t){
        QuerySyntex = { _id: { $in: ttt } };
        console.log()
        await ServiceProviderSchema.find(QuerySyntex).limit(limit * 1).skip((page - 1) * limit).then(async service_provider_detail => {
          if (service_provider_detail) {
            for (var sp_id of service_provider_detail) {

              await ServiceProviderOtherDetailsSchema.findOne({ spods_service_provider_id: sp_id._id }).then(async otherDetails => {
                if (otherDetails) {
                  const spProvider = JSON.stringify(sp_id);
                  const parseSpProvider = JSON.parse(spProvider);
                  parseSpProvider.professionalBody = otherDetails.spods_professional_body
                  let professionalRating = await RatingSchema.find({ sprs_service_provider_id: sp_id._id })
                  //console.log('professionalRating:', professionalRating)
                  var sumRating = 0;
                  for (var RatingData of professionalRating) {
                    sumRating += parseInt(RatingData.sprs_rating);
                  }
                  let avgRating = sumRating / professionalRating.length;
                  if (!isNaN(avgRating)) {
                    avgRating = avgRating.toFixed(1);
                  } else {
                    avgRating = 0;
                  }
                  //console.log('avgRating:', avgRating)
                  let temps = await parseSpProvider
                  const spProvider1 = JSON.stringify(temps);
                  const parseSpProvider1 = JSON.parse(spProvider1);
                  parseSpProvider1.avgRating = avgRating
                  catExpServiceProvIdArray.push(parseSpProvider1);
                }
              });
            }
          }
        })
        //   }
        // }

        console.log('currentPage:', page);
        console.log('totalPages:', Math.ceil(count / limit));

        res.send({
          err_msg, success_msg, layout: false,
          session: req.session,
          filterData: catExpServiceProvIdArray,
          totalPages: Math.ceil(count / limit),
          currentPage: page
        })

      } else {
        res.send({
          err_msg, success_msg, layout: false,
          session: req.session,
          filterData: ''
        })
      }
    }




    /* == City And Language ==*/

    if (languageServiceProvIdArray != '' && cityServiceProvIdArray != '' && experienceServiceProvIdArray == '' && categoryServiceProvIdArray == '') {
      console.log('insideee Category And Language')
      let ttt = await getMatch(languageServiceProvIdArray, cityServiceProvIdArray);
      console.log('ttt:', ttt)

      count = ttt.length;
      console.log('CityL countcount:', count);

      if (ttt) {
        //  for (var t of ttt) {
        //       if(t){
        QuerySyntex = { _id: { $in: ttt } };
        console.log()
        await ServiceProviderSchema.find(QuerySyntex).limit(limit * 1).skip((page - 1) * limit).then(async service_provider_detail => {
          if (service_provider_detail) {
            for (var sp_id of service_provider_detail) {

              await ServiceProviderOtherDetailsSchema.findOne({ spods_service_provider_id: sp_id._id }).then(async otherDetails => {
                if (otherDetails) {
                  const spProvider = JSON.stringify(sp_id);
                  const parseSpProvider = JSON.parse(spProvider);
                  parseSpProvider.professionalBody = otherDetails.spods_professional_body
                  let professionalRating = await RatingSchema.find({ sprs_service_provider_id: sp_id._id })
                  //console.log('professionalRating:', professionalRating)
                  var sumRating = 0;
                  for (var RatingData of professionalRating) {
                    sumRating += parseInt(RatingData.sprs_rating);
                  }
                  let avgRating = sumRating / professionalRating.length;
                  if (!isNaN(avgRating)) {
                    avgRating = avgRating.toFixed(1);
                  } else {
                    avgRating = 0;
                  }
                  // console.log('avgRating:', avgRating)
                  let temps = await parseSpProvider
                  const spProvider1 = JSON.stringify(temps);
                  const parseSpProvider1 = JSON.parse(spProvider1);
                  parseSpProvider1.avgRating = avgRating
                  catExpServiceProvIdArray.push(parseSpProvider1);
                }
              });
            }
          }
        })
        //   }
        // }

        console.log('currentPage:', page);
        console.log('totalPages:', Math.ceil(count / limit));

        res.send({
          err_msg, success_msg, layout: false,
          session: req.session,
          filterData: catExpServiceProvIdArray,
          totalPages: Math.ceil(count / limit),
          currentPage: page
        })

      } else {
        res.send({
          err_msg, success_msg, layout: false,
          session: req.session,
          filterData: ''
        })
      }
    }


    /*== Category + Experience + Location ==*/

    if (experienceServiceProvIdArray != '' && categoryServiceProvIdArray != '' && cityServiceProvIdArray != '' && languageServiceProvIdArray == '') {
      console.log('insideee Category + Experience + Location')
      let firstArray = await getMatch(experienceServiceProvIdArray, categoryServiceProvIdArray);
      console.log('firstArray:', firstArray)
      let totalArrayId = await getMatch(firstArray, cityServiceProvIdArray);
      let ttt = [...new Set(totalArrayId)];
      console.log('ttt:', ttt)


      count = ttt.length;
      console.log('CityL countcount:', count);


      if (ttt) {
        //  for (var t of ttt) {
        //       if(t){
        QuerySyntex = { _id: { $in: ttt } };
        console.log()
        await ServiceProviderSchema.find(QuerySyntex).limit(limit * 1).skip((page - 1) * limit).then(async service_provider_detail => {
          if (service_provider_detail) {
            for (var sp_id of service_provider_detail) {

              await ServiceProviderOtherDetailsSchema.findOne({ spods_service_provider_id: sp_id._id }).then(async otherDetails => {
                if (otherDetails) {
                  const spProvider = JSON.stringify(sp_id);
                  const parseSpProvider = JSON.parse(spProvider);
                  parseSpProvider.professionalBody = otherDetails.spods_professional_body
                  let professionalRating = await RatingSchema.find({ sprs_service_provider_id: sp_id._id })
                  //console.log('professionalRating:', professionalRating)
                  var sumRating = 0;
                  for (var RatingData of professionalRating) {
                    sumRating += parseInt(RatingData.sprs_rating);
                  }
                  let avgRating = sumRating / professionalRating.length;
                  if (!isNaN(avgRating)) {
                    avgRating = avgRating.toFixed(1);
                  } else {
                    avgRating = 0;
                  }
                  //console.log('avgRating:', avgRating)
                  let temps = await parseSpProvider
                  const spProvider1 = JSON.stringify(temps);
                  const parseSpProvider1 = JSON.parse(spProvider1);
                  parseSpProvider1.avgRating = avgRating
                  catExpServiceProvIdArray.push(parseSpProvider1);
                }
              });


              //let temp = await sp_id;
              // await catExpServiceProvIdArray.push(temp);
            }
          }
        })
        //   }
        // }
        console.log('currentPage:', page);
        console.log('totalPages:', Math.ceil(count / limit));

        res.send({
          err_msg, success_msg, layout: false,
          session: req.session,
          filterData: catExpServiceProvIdArray,
          totalPages: Math.ceil(count / limit),
          currentPage: page
        })

      } else {
        res.send({
          err_msg, success_msg, layout: false,
          session: req.session,
          filterData: ''
        })
      }
    }

    /*== Category + Experience + Language ==*/

    if (experienceServiceProvIdArray != '' && categoryServiceProvIdArray != '' && languageServiceProvIdArray != '' && cityServiceProvIdArray == '') {
      console.log('insideee Category + Experience + Language')
      let firstArray = await getMatch(experienceServiceProvIdArray, categoryServiceProvIdArray);
      console.log('firstArray:', firstArray)
      let totalArrayId = await getMatch(firstArray, languageServiceProvIdArray);
      let ttt = [...new Set(totalArrayId)];
      console.log('ttt:', ttt)

      count = ttt.length;
      console.log('CityL countcount:', count);

      if (ttt) {
        //  for (var t of ttt) {
        //       if(t){
        QuerySyntex = { _id: { $in: ttt } };
        console.log()
        await ServiceProviderSchema.find(QuerySyntex).limit(limit * 1).skip((page - 1) * limit).then(async service_provider_detail => {
          if (service_provider_detail) {
            for (var sp_id of service_provider_detail) {

              await ServiceProviderOtherDetailsSchema.findOne({ spods_service_provider_id: sp_id._id }).then(async otherDetails => {
                if (otherDetails) {
                  const spProvider = JSON.stringify(sp_id);
                  const parseSpProvider = JSON.parse(spProvider);
                  parseSpProvider.professionalBody = otherDetails.spods_professional_body
                  let professionalRating = await RatingSchema.find({ sprs_service_provider_id: sp_id._id })
                  //console.log('professionalRating:', professionalRating)
                  var sumRating = 0;
                  for (var RatingData of professionalRating) {
                    sumRating += parseInt(RatingData.sprs_rating);
                  }
                  let avgRating = sumRating / professionalRating.length;
                  if (!isNaN(avgRating)) {
                    avgRating = avgRating.toFixed(1);
                  } else {
                    avgRating = 0;
                  }
                  //console.log('avgRating:', avgRating)
                  let temps = await parseSpProvider
                  const spProvider1 = JSON.stringify(temps);
                  const parseSpProvider1 = JSON.parse(spProvider1);
                  parseSpProvider1.avgRating = avgRating
                  catExpServiceProvIdArray.push(parseSpProvider1);
                }
              });


              //let temp = await sp_id;
              // await catExpServiceProvIdArray.push(temp);
            }
          }
        })
        //   }
        // }

        console.log('currentPage:', page);
        console.log('totalPages:', Math.ceil(count / limit));

        res.send({
          err_msg, success_msg, layout: false,
          session: req.session,
          filterData: catExpServiceProvIdArray,
          totalPages: Math.ceil(count / limit),
          currentPage: page
        })

      } else {
        res.send({
          err_msg, success_msg, layout: false,
          session: req.session,
          filterData: ''
        })
      }
    }

    /*== Category + Location + Language ==*/

    if (cityServiceProvIdArray != '' && categoryServiceProvIdArray != '' && languageServiceProvIdArray != '' && experienceServiceProvIdArray == '') {
      console.log('insideee Category + Location + Language')
      let firstArray = await getMatch(cityServiceProvIdArray, categoryServiceProvIdArray);
      console.log('firstArray:', firstArray)
      let totalArrayId = await getMatch(firstArray, languageServiceProvIdArray);
      let ttt = [...new Set(totalArrayId)];
      console.log('ttt:', ttt)


      count = ttt.length;
      console.log('CityL countcount:', count);


      if (ttt) {
        //  for (var t of ttt) {
        //       if(t){
        QuerySyntex = { _id: { $in: ttt } };
        console.log()
        await ServiceProviderSchema.find(QuerySyntex).limit(limit * 1).skip((page - 1) * limit).then(async service_provider_detail => {
          if (service_provider_detail) {
            for (var sp_id of service_provider_detail) {

              await ServiceProviderOtherDetailsSchema.findOne({ spods_service_provider_id: sp_id._id }).then(async otherDetails => {
                if (otherDetails) {
                  const spProvider = JSON.stringify(sp_id);
                  const parseSpProvider = JSON.parse(spProvider);
                  parseSpProvider.professionalBody = otherDetails.spods_professional_body
                  let professionalRating = await RatingSchema.find({ sprs_service_provider_id: sp_id._id })
                  //console.log('professionalRating:', professionalRating)
                  var sumRating = 0;
                  for (var RatingData of professionalRating) {
                    sumRating += parseInt(RatingData.sprs_rating);
                  }
                  let avgRating = sumRating / professionalRating.length;
                  if (!isNaN(avgRating)) {
                    avgRating = avgRating.toFixed(1);
                  } else {
                    avgRating = 0;
                  }
                  //console.log('avgRating:', avgRating)
                  let temps = await parseSpProvider
                  const spProvider1 = JSON.stringify(temps);
                  const parseSpProvider1 = JSON.parse(spProvider1);
                  parseSpProvider1.avgRating = avgRating
                  catExpServiceProvIdArray.push(parseSpProvider1);
                }
              });


              //let temp = await sp_id;
              // await catExpServiceProvIdArray.push(temp);
            }
          }
        })
        //   }
        // }

        console.log('currentPage:', page);
        console.log('totalPages:', Math.ceil(count / limit));

        res.send({
          err_msg, success_msg, layout: false,
          session: req.session,
          filterData: catExpServiceProvIdArray,
          totalPages: Math.ceil(count / limit),
          currentPage: page
        })

      } else {
        res.send({
          err_msg, success_msg, layout: false,
          session: req.session,
          filterData: ''
        })
      }
    }


    /*== Experience + Location + Language ==*/

    if (cityServiceProvIdArray != '' && languageServiceProvIdArray != '' && experienceServiceProvIdArray != '' && categoryServiceProvIdArray == '') {
      console.log('insideee Experience + Location + Language')
      let firstArray = await getMatch(cityServiceProvIdArray, experienceServiceProvIdArray);
      console.log('firstArray:', firstArray)
      let totalArrayId = await getMatch(firstArray, languageServiceProvIdArray);
      let ttt = [...new Set(totalArrayId)];
      console.log('ttt:', ttt)

      count = ttt.length;
      console.log('CityL countcount:', count);

      if (ttt) {
        //  for (var t of ttt) {
        //       if(t){
        QuerySyntex = { _id: { $in: ttt } };
        console.log()
        await ServiceProviderSchema.find(QuerySyntex).limit(limit * 1).skip((page - 1) * limit).then(async service_provider_detail => {
          if (service_provider_detail) {
            for (var sp_id of service_provider_detail) {

              await ServiceProviderOtherDetailsSchema.findOne({ spods_service_provider_id: sp_id._id }).then(async otherDetails => {
                if (otherDetails) {
                  const spProvider = JSON.stringify(sp_id);
                  const parseSpProvider = JSON.parse(spProvider);
                  parseSpProvider.professionalBody = otherDetails.spods_professional_body
                  let professionalRating = await RatingSchema.find({ sprs_service_provider_id: sp_id._id })
                  //console.log('professionalRating:', professionalRating)
                  var sumRating = 0;
                  for (var RatingData of professionalRating) {
                    sumRating += parseInt(RatingData.sprs_rating);
                  }
                  let avgRating = sumRating / professionalRating.length;
                  if (!isNaN(avgRating)) {
                    avgRating = avgRating.toFixed(1);
                  } else {
                    avgRating = 0;
                  }
                  //console.log('avgRating:', avgRating)
                  let temps = await parseSpProvider
                  const spProvider1 = JSON.stringify(temps);
                  const parseSpProvider1 = JSON.parse(spProvider1);
                  parseSpProvider1.avgRating = avgRating
                  catExpServiceProvIdArray.push(parseSpProvider1);
                }
              });


              //let temp = await sp_id;
              // await catExpServiceProvIdArray.push(temp);
            }
          }
        })
        //   }
        // }

        console.log('currentPage:', page);
        console.log('totalPages:', Math.ceil(count / limit));

        res.send({
          err_msg, success_msg, layout: false,
          session: req.session,
          filterData: catExpServiceProvIdArray,
          totalPages: Math.ceil(count / limit),
          currentPage: page
        })

      } else {
        res.send({
          err_msg, success_msg, layout: false,
          session: req.session,
          filterData: ''
        })
      }
    }


    /*== Experience + Location + Language + Category ==*/

    if (cityServiceProvIdArray != '' && languageServiceProvIdArray != '' && experienceServiceProvIdArray != '' && categoryServiceProvIdArray != '') {
      console.log('insideee Experience + Location + Language + Category')
      let firstArray = await getMatch(cityServiceProvIdArray, experienceServiceProvIdArray);
      console.log('firstArray:', firstArray)
      let SecondArray = await getMatch(firstArray, languageServiceProvIdArray);
      console.log('SecondArray:', SecondArray)
      let totalArrayId = await getMatch(SecondArray, categoryServiceProvIdArray);
      let ttt = [...new Set(totalArrayId)];
      console.log('ttt:', ttt)


      count = ttt.length;
      console.log('CityL countcount:', count);


      if (ttt) {
        //  for (var t of ttt) {
        //       if(t){
        QuerySyntex = { _id: { $in: ttt } };
        console.log()
        await ServiceProviderSchema.find(QuerySyntex).limit(limit * 1).skip((page - 1) * limit).then(async service_provider_detail => {
          if (service_provider_detail) {
            for (var sp_id of service_provider_detail) {

              await ServiceProviderOtherDetailsSchema.findOne({ spods_service_provider_id: sp_id._id }).then(async otherDetails => {
                if (otherDetails) {
                  const spProvider = JSON.stringify(sp_id);
                  const parseSpProvider = JSON.parse(spProvider);
                  parseSpProvider.professionalBody = otherDetails.spods_professional_body
                  let professionalRating = await RatingSchema.find({ sprs_service_provider_id: sp_id._id })
                  //console.log('professionalRating:', professionalRating)
                  var sumRating = 0;
                  for (var RatingData of professionalRating) {
                    sumRating += parseInt(RatingData.sprs_rating);
                  }
                  let avgRating = sumRating / professionalRating.length;
                  if (!isNaN(avgRating)) {
                    avgRating = avgRating.toFixed(1);
                  } else {
                    avgRating = 0;
                  }
                  //console.log('avgRating:', avgRating)
                  let temps = await parseSpProvider
                  const spProvider1 = JSON.stringify(temps);
                  const parseSpProvider1 = JSON.parse(spProvider1);
                  parseSpProvider1.avgRating = avgRating
                  catExpServiceProvIdArray.push(parseSpProvider1);
                }
              });


              //let temp = await sp_id;
              // await catExpServiceProvIdArray.push(temp);
            }
          }
        })
        //   }
        // }

        console.log('currentPage:', page);
        console.log('totalPages:', Math.ceil(count / limit));

        res.send({
          err_msg, success_msg, layout: false,
          session: req.session,
          filterData: catExpServiceProvIdArray,
          totalPages: Math.ceil(count / limit),
          currentPage: page
        })

      } else {
        res.send({
          err_msg, success_msg, layout: false,
          session: req.session,
          filterData: ''
        })
      }
    }
    console.log('experienceServiceProvIdArray:', experienceServiceProvIdArray)
    console.log('categoryServiceProvIdArray:', categoryServiceProvIdArray)
    console.log('catExpServiceProvIdArray:', catExpServiceProvIdArray)
    console.log('cityServiceProvIdArray:', cityServiceProvIdArray)
    console.log('languageServiceProvIdArray:', languageServiceProvIdArray)

  }

});


// My Professional Multifilter Filter
app.post('/my-service-professionals-multifilter', async (req, res) => {
  req.session.pagename = 'professionals';
  console.log('multifilterData:', req.body)
  let QuerySyntex = '';
  let categoryKeyword = '';
  let experienceKeyword = '';
  let cityKeyword = '';
  let languageKeyword = '';
  let categoryServiceProvIdArray = [], categoryServiceProvData = [];
  let experienceServiceProvIdArray = [], experienceServiceProvData = [];
  let cityServiceProvIdArray = [], cityServiceProvData = [];
  let languageServiceProvIdArray = [], languageServiceProvData = [];
  let catExpServiceProvIdArray = [];
  if (Object.keys(req.body).length === 0 && req.body.constructor === Object) {
    console.log('notingngngngngn');
    res.send({
      err_msg, success_msg, layout: false,
      session: req.session,
      filterData: ''
    })

  } else {

    if (req.body.category != undefined) {
      if (typeof (req.body.category) == 'object') {
        categoryKeyword = req.body.category;
      } else {
        var arr = [];
        arr.push(req.body.category);
        categoryKeyword = arr;
      }
    }

    if (req.body.experience != undefined) {
      if (typeof (req.body.experience) == 'object') {
        experienceKeyword = req.body.experience;
      } else {
        var arr = [];
        arr.push(req.body.experience);
        experienceKeyword = arr;
      }
    }

    if (req.body.location_city != undefined) {
      if (typeof (req.body.location_city) == 'object') {
        cityKeyword = req.body.location_city;
      } else {
        var arr = [];
        arr.push(req.body.location_city);
        cityKeyword = arr;
      }
    }

    if (req.body.language != undefined) {
      if (typeof (req.body.language) == 'object') {
        languageKeyword = req.body.language;
      } else {
        var arr = [];
        arr.push(req.body.language);
        languageKeyword = arr;
      }
    }


    console.log('categoryKeyword:', categoryKeyword)
    console.log('experienceKeyword:', experienceKeyword)
    console.log('cityKeyword:', cityKeyword)
    console.log('languageKeyword:', languageKeyword)

    const { page = 1, limit = 1 } = req.body;
    let count = 0;
    console.log('pageQuery:', page);
    console.log('req.query:', req.body);



    let AllhiredProfeshnoalCount = await PropertyProfessionalSchema.find({ pps_user_id: req.session.user_id, pps_is_active_user_flag: req.session.active_user_login });
    var totalHire = [];
    for (var t of AllhiredProfeshnoalCount) {
      totalHire.push(t.pps_service_provider_id.toString());
    }
    let totalHireUnique = [...new Set(totalHire)];
    console.log('FiltertotalHire:', totalHire);
    console.log('FiltertotalHireUnique:', totalHireUnique);
    //const count = totalHireUnique.length;



    /*== Category==*/
    if (categoryKeyword) {
      console.log('categoryKeyword11:', categoryKeyword)
      // for (var categoryWord of categoryKeyword) {
      QuerySyntex = { sps_role_name: { $in: categoryKeyword }, _id: { $in: totalHireUnique } };
      count = await ServiceProviderSchema.countDocuments(QuerySyntex);
      console.log('countcount:', count);
      console.log('limitss:', limit);

      await ServiceProviderSchema.find(QuerySyntex).sort({ _id: -1 }).limit(limit * 1).skip((page - 1) * limit).then(async service_provider_detail => {
        if (service_provider_detail) {
          console.log('service_provider_detail:', service_provider_detail);
          for (var sp_id of service_provider_detail) {
            //let temp = await sp_id._id;

            await ServiceProviderOtherDetailsSchema.findOne({ spods_service_provider_id: sp_id._id }).then(async otherDetails => {
              if (otherDetails) {
                const spProvider = JSON.stringify(sp_id);
                const parseSpProvider = JSON.parse(spProvider);
                parseSpProvider.professionalBody = otherDetails.spods_professional_body
                let professionalRating = await RatingSchema.find({ sprs_service_provider_id: sp_id._id })
                // console.log('professionalRating:', professionalRating)
                var sumRating = 0;
                for (var RatingData of professionalRating) {
                  sumRating += parseInt(RatingData.sprs_rating);
                }
                let avgRating = sumRating / professionalRating.length;
                if (!isNaN(avgRating)) {
                  avgRating = avgRating.toFixed(1);
                } else {
                  avgRating = 0;
                }
                //console.log('avgRating:', avgRating)
                let temps = await parseSpProvider
                const spProvider1 = JSON.stringify(temps);
                const parseSpProvider1 = JSON.parse(spProvider1);
                parseSpProvider1.avgRating = avgRating
                categoryServiceProvData.push(parseSpProvider1);
              }
            });
            //let temp = await sp_id._id.toString();
            //await categoryServiceProvIdArray.push(temp);
          }
        }
      })

      await ServiceProviderSchema.find(QuerySyntex).then(async service_provider_detail1 => {
        if (service_provider_detail1) {
          for (var sp_id1 of service_provider_detail1) {
            let temp = await sp_id1._id.toString();
            await categoryServiceProvIdArray.push(temp);
          }
        }
      });


      //}

      console.log('currentPage:', page);
      console.log('totalPages:', Math.ceil(count / limit));

      //if(experienceKeyword == '' && ){
      if (experienceKeyword == '' && cityKeyword == '' && languageKeyword == '') {
        console.log('categoryServiceProvData:', categoryServiceProvData);
        res.send({
          err_msg, success_msg, layout: false,
          session: req.session,
          filterData: categoryServiceProvData,
          totalPages: Math.ceil(count / limit),
          currentPage: page
        })
      }
    }


    /*== Location === */
    if (cityKeyword) {
      console.log('cityKeyword11:', cityKeyword)
      //for (var cityWord of cityKeyword) {
      QuerySyntex = { sps_city: { $in: cityKeyword }, _id: { $in: totalHireUnique } };

      count = await ServiceProviderSchema.countDocuments(QuerySyntex);
      console.log('countcount:', count);
      await ServiceProviderSchema.find(QuerySyntex).sort({ _id: -1 }).limit(limit * 1).skip((page - 1) * limit).then(async service_provider_detail => {
        if (service_provider_detail) {
          for (var sp_id of service_provider_detail) {
            //let temp = await sp_id._id;

            await ServiceProviderOtherDetailsSchema.findOne({ spods_service_provider_id: sp_id._id }).then(async otherDetails => {
              if (otherDetails) {
                const spProvider = JSON.stringify(sp_id);
                const parseSpProvider = JSON.parse(spProvider);
                parseSpProvider.professionalBody = otherDetails.spods_professional_body
                let professionalRating = await RatingSchema.find({ sprs_service_provider_id: sp_id._id })
                console.log('professionalRating:', professionalRating)
                var sumRating = 0;
                for (var RatingData of professionalRating) {
                  sumRating += parseInt(RatingData.sprs_rating);
                }
                let avgRating = sumRating / professionalRating.length;
                if (!isNaN(avgRating)) {
                  avgRating = avgRating.toFixed(1);
                } else {
                  avgRating = 0;
                }
                console.log('avgRating:', avgRating)
                let temps = await parseSpProvider
                const spProvider1 = JSON.stringify(temps);
                const parseSpProvider1 = JSON.parse(spProvider1);
                parseSpProvider1.avgRating = avgRating
                cityServiceProvData.push(parseSpProvider1);
              }
            });
            let temp = await sp_id._id.toString();
            await cityServiceProvIdArray.push(temp);
          }
        }
      })

      await ServiceProviderSchema.find(QuerySyntex).then(async service_provider_detail1 => {
        if (service_provider_detail1) {
          for (var sp_id1 of service_provider_detail1) {
            let temp = await sp_id1._id.toString();
            await cityServiceProvIdArray.push(temp);
          }
        }
      });


      // }

      console.log('currentPage:', page);
      console.log('totalPages:', Math.ceil(count / limit));

      if (experienceKeyword == '' && categoryKeyword == '' && languageKeyword == '') {
        res.send({
          err_msg, success_msg, layout: false,
          session: req.session,
          filterData: cityServiceProvData,
          totalPages: Math.ceil(count / limit),
          currentPage: page
        })
      }
    }

    /*===Language=== */

    if (languageKeyword) {
      console.log('cityKeyword11:', languageKeyword)
      //for (var languageWord of languageKeyword) {
      QuerySyntex = { spls_language: { $in: languageKeyword }, _id: { $in: totalHireUnique } };
      count = await ServiceProviderLanguageSchema.countDocuments(QuerySyntex);
      console.log('countcount:', count);
      await ServiceProviderLanguageSchema.find(QuerySyntex).sort({ _id: -1 }).limit(limit * 1).skip((page - 1) * limit).then(async service_provider_detail_lang => {
        if (service_provider_detail_lang) {
          for (var lang_sp_id of service_provider_detail_lang) {
            //let temp = await sp_id._id;
            await ServiceProviderSchema.find({ _id: lang_sp_id.spls_service_provider_id }).then(async service_provider_detail => {
              for (var sp_id of service_provider_detail) {
                await ServiceProviderOtherDetailsSchema.findOne({ spods_service_provider_id: sp_id._id }).then(async otherDetails => {
                  if (otherDetails) {
                    const spProvider = JSON.stringify(sp_id);
                    const parseSpProvider = JSON.parse(spProvider);
                    parseSpProvider.professionalBody = otherDetails.spods_professional_body
                    let professionalRating = await RatingSchema.find({ sprs_service_provider_id: sp_id._id })
                    // console.log('professionalRating:', professionalRating)
                    var sumRating = 0;
                    for (var RatingData of professionalRating) {
                      sumRating += parseInt(RatingData.sprs_rating);
                    }
                    let avgRating = sumRating / professionalRating.length;
                    if (!isNaN(avgRating)) {
                      avgRating = avgRating.toFixed(1);
                    } else {
                      avgRating = 0;
                    }
                    console.log('avgRating:', avgRating)
                    let temps = await parseSpProvider
                    const spProvider1 = JSON.stringify(temps);
                    const parseSpProvider1 = JSON.parse(spProvider1);
                    parseSpProvider1.avgRating = avgRating
                    languageServiceProvData.push(parseSpProvider1);
                  }
                });
              }

            })

            //  let temp = await lang_sp_id.spls_service_provider_id.toString();
            //  await languageServiceProvIdArray.push(temp);
          }
        }
      })


      await ServiceProviderLanguageSchema.find(QuerySyntex).then(async service_provider_detail_lang1 => {
        if (service_provider_detail_lang1) {
          for (var lang_sp_id1 of service_provider_detail_lang1) {
            let temp = await lang_sp_id1.spls_service_provider_id.toString();
            await languageServiceProvIdArray.push(temp);
          }
        }
      });


      //}

      console.log('currentPage:', page);
      console.log('totalPages:', Math.ceil(count / limit));

      if (experienceKeyword == '' && categoryKeyword == '' && cityKeyword == '') {
        res.send({
          err_msg, success_msg, layout: false,
          session: req.session,
          filterData: languageServiceProvData,
          totalPages: Math.ceil(count / limit),
          currentPage: page
        })
      }
    }




    /*=== Expirence ==*/

    if (experienceKeyword) {
      //for (var experienceWord of experienceKeyword) {
      QuerySyntex = { sps_experience: { $in: experienceKeyword }, _id: { $in: totalHireUnique } };
      count = await ServiceProviderSchema.countDocuments(QuerySyntex);
      //console.log('countcount:',count);
      await ServiceProviderSchema.find(QuerySyntex).sort({ _id: -1 }).limit(limit * 1).skip((page - 1) * limit).then(async service_provider_detail => {
        if (service_provider_detail) {
          for (var sp_id of service_provider_detail) {

            await ServiceProviderOtherDetailsSchema.findOne({ spods_service_provider_id: sp_id._id }).then(async otherDetails => {
              if (otherDetails) {
                const spProvider = JSON.stringify(sp_id);
                const parseSpProvider = JSON.parse(spProvider);
                parseSpProvider.professionalBody = otherDetails.spods_professional_body
                let professionalRating = await RatingSchema.find({ sprs_service_provider_id: sp_id._id })
                // console.log('professionalRating:', professionalRating)
                var sumRating = 0;
                for (var RatingData of professionalRating) {
                  sumRating += parseInt(RatingData.sprs_rating);
                }
                let avgRating = sumRating / professionalRating.length;
                if (!isNaN(avgRating)) {
                  avgRating = avgRating.toFixed(1);
                } else {
                  avgRating = 0;
                }
                // console.log('avgRating:', avgRating)
                let temps = await parseSpProvider
                const spProvider1 = JSON.stringify(temps);
                const parseSpProvider1 = JSON.parse(spProvider1);
                parseSpProvider1.avgRating = avgRating
                experienceServiceProvData.push(parseSpProvider1);
              }
            });


            //await experienceServiceProvData.push(sp_id);

          }
        }
      })



      await ServiceProviderSchema.find(QuerySyntex).then(async service_provider_detail1 => {
        if (service_provider_detail1) {
          for (var sp_id1 of service_provider_detail1) {
            let temp = await sp_id1._id.toString();
            await experienceServiceProvIdArray.push(temp);
          }
        }
      });
      // }

      //console.log('currentPage:',page);
      //console.log('totalPages:',Math.ceil(count / limit));

      if (categoryKeyword == '' && cityKeyword == '' && languageKeyword == '') {
        res.send({
          err_msg, success_msg, layout: false,
          session: req.session,
          filterData: experienceServiceProvData,
          totalPages: Math.ceil(count / limit),
          currentPage: page
        })
      }
    }

    /*==  Category and Expirence  ==*/
    if (experienceServiceProvIdArray != '' && categoryServiceProvIdArray != '' && cityServiceProvIdArray == '' && languageServiceProvIdArray == '') {
      console.log('insideee Category and Expirence')
      let ttt = await getMatch(experienceServiceProvIdArray, categoryServiceProvIdArray);
      console.log('ttt:', ttt)

      count = ttt.length;
      console.log('CE countcount:', count);

      if (ttt) {
        //for (var t of ttt) {
        // if(t){
        QuerySyntex = { _id: { $in: ttt }, _id: { $in: totalHireUnique } };
        console.log()
        await ServiceProviderSchema.find(QuerySyntex).sort({ _id: -1 }).limit(limit * 1).skip((page - 1) * limit).then(async service_provider_detail => {
          if (service_provider_detail) {
            for (var sp_id of service_provider_detail) {

              await ServiceProviderOtherDetailsSchema.findOne({ spods_service_provider_id: sp_id._id }).then(async otherDetails => {
                if (otherDetails) {
                  const spProvider = JSON.stringify(sp_id);
                  const parseSpProvider = JSON.parse(spProvider);
                  parseSpProvider.professionalBody = otherDetails.spods_professional_body
                  let professionalRating = await RatingSchema.find({ sprs_service_provider_id: sp_id._id })
                  //console.log('professionalRating:', professionalRating)
                  var sumRating = 0;
                  for (var RatingData of professionalRating) {
                    sumRating += parseInt(RatingData.sprs_rating);
                  }
                  let avgRating = sumRating / professionalRating.length;
                  if (!isNaN(avgRating)) {
                    avgRating = avgRating.toFixed(1);
                  } else {
                    avgRating = 0;
                  }
                  //console.log('avgRating:', avgRating)
                  let temps = await parseSpProvider
                  const spProvider1 = JSON.stringify(temps);
                  const parseSpProvider1 = JSON.parse(spProvider1);
                  parseSpProvider1.avgRating = avgRating
                  catExpServiceProvIdArray.push(parseSpProvider1);
                }
              });
              //let temp = await sp_id;
              // await catExpServiceProvIdArray.push(temp);
            }
          }
        })
        //}
        // }
        console.log('currentPage:', page);
        console.log('totalPages:', Math.ceil(count / limit));

        res.send({
          err_msg, success_msg, layout: false,
          session: req.session,
          filterData: catExpServiceProvIdArray,
          totalPages: Math.ceil(count / limit),
          currentPage: page
        })

      } else {
        res.send({
          err_msg, success_msg, layout: false,
          session: req.session,
          filterData: ''
        })
      }
    }


    /*== Category and City ==*/

    if (cityServiceProvIdArray != '' && categoryServiceProvIdArray != '' && experienceServiceProvIdArray == '' && languageServiceProvIdArray == '') {
      console.log('insideee Category and City')
      let ttt = await getMatch(cityServiceProvIdArray, categoryServiceProvIdArray);
      console.log('ttt:', ttt)

      count = ttt.length;
      console.log('CC countcount:', count);

      if (ttt) {
        //  for (var t of ttt) {
        //       if(t){
        QuerySyntex = { _id: { $in: ttt }, _id: { $in: totalHireUnique } };
        console.log()
        await ServiceProviderSchema.find(QuerySyntex).limit(limit * 1).skip((page - 1) * limit).then(async service_provider_detail => {
          if (service_provider_detail) {
            for (var sp_id of service_provider_detail) {

              await ServiceProviderOtherDetailsSchema.findOne({ spods_service_provider_id: sp_id._id }).then(async otherDetails => {
                if (otherDetails) {
                  const spProvider = JSON.stringify(sp_id);
                  const parseSpProvider = JSON.parse(spProvider);
                  parseSpProvider.professionalBody = otherDetails.spods_professional_body
                  let professionalRating = await RatingSchema.find({ sprs_service_provider_id: sp_id._id })
                  // console.log('professionalRating:', professionalRating)
                  var sumRating = 0;
                  for (var RatingData of professionalRating) {
                    sumRating += parseInt(RatingData.sprs_rating);
                  }
                  let avgRating = sumRating / professionalRating.length;
                  if (!isNaN(avgRating)) {
                    avgRating = avgRating.toFixed(1);
                  } else {
                    avgRating = 0;
                  }
                  //console.log('avgRating:', avgRating)
                  let temps = await parseSpProvider
                  const spProvider1 = JSON.stringify(temps);
                  const parseSpProvider1 = JSON.parse(spProvider1);
                  parseSpProvider1.avgRating = avgRating
                  catExpServiceProvIdArray.push(parseSpProvider1);
                }
              });
            }
          }
        })
        //   }
        // }

        console.log('currentPage:', page);
        console.log('totalPages:', Math.ceil(count / limit));


        res.send({
          err_msg, success_msg, layout: false,
          session: req.session,
          filterData: catExpServiceProvIdArray,
          totalPages: Math.ceil(count / limit),
          currentPage: page
        })

      } else {
        res.send({
          err_msg, success_msg, layout: false,
          session: req.session,
          filterData: ''
        })
      }
    }


    /*== Category And Language == */

    if (languageServiceProvIdArray != '' && categoryServiceProvIdArray != '' && cityServiceProvIdArray == '' && experienceServiceProvIdArray == '') {
      console.log('insideee Category And Language')
      let ttt = await getMatch(languageServiceProvIdArray, categoryServiceProvIdArray);
      console.log('ttt:', ttt)

      count = ttt.length;
      console.log('CL countcount:', count);

      if (ttt) {
        //  for (var t of ttt) {
        //       if(t){
        QuerySyntex = { _id: { $in: ttt }, _id: { $in: totalHireUnique } };
        console.log()
        await ServiceProviderSchema.find(QuerySyntex).limit(limit * 1).skip((page - 1) * limit).then(async service_provider_detail => {
          if (service_provider_detail) {
            for (var sp_id of service_provider_detail) {

              await ServiceProviderOtherDetailsSchema.findOne({ spods_service_provider_id: sp_id._id }).then(async otherDetails => {
                if (otherDetails) {
                  const spProvider = JSON.stringify(sp_id);
                  const parseSpProvider = JSON.parse(spProvider);
                  parseSpProvider.professionalBody = otherDetails.spods_professional_body
                  let professionalRating = await RatingSchema.find({ sprs_service_provider_id: sp_id._id })
                  //console.log('professionalRating:', professionalRating)
                  var sumRating = 0;
                  for (var RatingData of professionalRating) {
                    sumRating += parseInt(RatingData.sprs_rating);
                  }
                  let avgRating = sumRating / professionalRating.length;
                  if (!isNaN(avgRating)) {
                    avgRating = avgRating.toFixed(1);
                  } else {
                    avgRating = 0;
                  }
                  //console.log('avgRating:', avgRating)
                  let temps = await parseSpProvider
                  const spProvider1 = JSON.stringify(temps);
                  const parseSpProvider1 = JSON.parse(spProvider1);
                  parseSpProvider1.avgRating = avgRating
                  catExpServiceProvIdArray.push(parseSpProvider1);
                }
              });
            }
          }
        })
        //   }
        // }
        console.log('currentPage:', page);
        console.log('totalPages:', Math.ceil(count / limit));

        res.send({
          err_msg, success_msg, layout: false,
          session: req.session,
          filterData: catExpServiceProvIdArray,
          totalPages: Math.ceil(count / limit),
          currentPage: page
        })

      } else {
        res.send({
          err_msg, success_msg, layout: false,
          session: req.session,
          filterData: ''
        })
      }
    }



    /*== Expirence and City ==*/

    if (cityServiceProvIdArray != '' && experienceServiceProvIdArray != '' && categoryServiceProvIdArray == '' && languageServiceProvIdArray == '') {
      console.log('insideee Expirence and City')
      let ttt = await getMatch(cityServiceProvIdArray, experienceServiceProvIdArray);
      console.log('ttt:', ttt)

      count = ttt.length;
      console.log('CL countcount:', count);

      if (ttt) {
        //  for (var t of ttt) {
        //       if(t){
        QuerySyntex = { _id: { $in: ttt }, _id: { $in: totalHireUnique } };
        console.log()
        await ServiceProviderSchema.find(QuerySyntex).limit(limit * 1).skip((page - 1) * limit).then(async service_provider_detail => {
          if (service_provider_detail) {
            for (var sp_id of service_provider_detail) {

              await ServiceProviderOtherDetailsSchema.findOne({ spods_service_provider_id: sp_id._id }).then(async otherDetails => {
                if (otherDetails) {
                  const spProvider = JSON.stringify(sp_id);
                  const parseSpProvider = JSON.parse(spProvider);
                  parseSpProvider.professionalBody = otherDetails.spods_professional_body
                  let professionalRating = await RatingSchema.find({ sprs_service_provider_id: sp_id._id })
                  //console.log('professionalRating:', professionalRating)
                  var sumRating = 0;
                  for (var RatingData of professionalRating) {
                    sumRating += parseInt(RatingData.sprs_rating);
                  }
                  let avgRating = sumRating / professionalRating.length;
                  if (!isNaN(avgRating)) {
                    avgRating = avgRating.toFixed(1);
                  } else {
                    avgRating = 0;
                  }
                  //console.log('avgRating:', avgRating)
                  let temps = await parseSpProvider
                  const spProvider1 = JSON.stringify(temps);
                  const parseSpProvider1 = JSON.parse(spProvider1);
                  parseSpProvider1.avgRating = avgRating
                  catExpServiceProvIdArray.push(parseSpProvider1);
                }
              });
            }
          }
        })
        //   }
        // }

        console.log('currentPage:', page);
        console.log('totalPages:', Math.ceil(count / limit));

        res.send({
          err_msg, success_msg, layout: false,
          session: req.session,
          filterData: catExpServiceProvIdArray,
          totalPages: Math.ceil(count / limit),
          currentPage: page
        })

      } else {
        res.send({
          err_msg, success_msg, layout: false,
          session: req.session,
          filterData: ''
        })
      }
    }


    /*== Expirence and Language ==*/

    if (languageServiceProvIdArray != '' && experienceServiceProvIdArray != '' && categoryServiceProvIdArray == '' && cityServiceProvIdArray == '') {
      console.log('insideee Expirence and City')
      let ttt = await getMatch(languageServiceProvIdArray, experienceServiceProvIdArray);
      console.log('ttt:', ttt)

      count = ttt.length;
      console.log('EL countcount:', count);


      if (ttt) {
        //  for (var t of ttt) {
        //       if(t){
        QuerySyntex = { _id: { $in: ttt }, _id: { $in: totalHireUnique } };
        console.log()
        await ServiceProviderSchema.find(QuerySyntex).limit(limit * 1).skip((page - 1) * limit).then(async service_provider_detail => {
          if (service_provider_detail) {
            for (var sp_id of service_provider_detail) {

              await ServiceProviderOtherDetailsSchema.findOne({ spods_service_provider_id: sp_id._id }).then(async otherDetails => {
                if (otherDetails) {
                  const spProvider = JSON.stringify(sp_id);
                  const parseSpProvider = JSON.parse(spProvider);
                  parseSpProvider.professionalBody = otherDetails.spods_professional_body
                  let professionalRating = await RatingSchema.find({ sprs_service_provider_id: sp_id._id })
                  //console.log('professionalRating:', professionalRating)
                  var sumRating = 0;
                  for (var RatingData of professionalRating) {
                    sumRating += parseInt(RatingData.sprs_rating);
                  }
                  let avgRating = sumRating / professionalRating.length;
                  if (!isNaN(avgRating)) {
                    avgRating = avgRating.toFixed(1);
                  } else {
                    avgRating = 0;
                  }
                  //console.log('avgRating:', avgRating)
                  let temps = await parseSpProvider
                  const spProvider1 = JSON.stringify(temps);
                  const parseSpProvider1 = JSON.parse(spProvider1);
                  parseSpProvider1.avgRating = avgRating
                  catExpServiceProvIdArray.push(parseSpProvider1);
                }
              });
            }
          }
        })
        //   }
        // }

        console.log('currentPage:', page);
        console.log('totalPages:', Math.ceil(count / limit));

        res.send({
          err_msg, success_msg, layout: false,
          session: req.session,
          filterData: catExpServiceProvIdArray,
          totalPages: Math.ceil(count / limit),
          currentPage: page
        })

      } else {
        res.send({
          err_msg, success_msg, layout: false,
          session: req.session,
          filterData: ''
        })
      }
    }




    /* == City And Language ==*/

    if (languageServiceProvIdArray != '' && cityServiceProvIdArray != '' && experienceServiceProvIdArray == '' && categoryServiceProvIdArray == '') {
      console.log('insideee Category And Language')
      let ttt = await getMatch(languageServiceProvIdArray, cityServiceProvIdArray);
      console.log('ttt:', ttt)

      count = ttt.length;
      console.log('CityL countcount:', count);

      if (ttt) {
        //  for (var t of ttt) {
        //       if(t){
        QuerySyntex = { _id: { $in: ttt }, _id: { $in: totalHireUnique } };
        console.log()
        await ServiceProviderSchema.find(QuerySyntex).limit(limit * 1).skip((page - 1) * limit).then(async service_provider_detail => {
          if (service_provider_detail) {
            for (var sp_id of service_provider_detail) {

              await ServiceProviderOtherDetailsSchema.findOne({ spods_service_provider_id: sp_id._id }).then(async otherDetails => {
                if (otherDetails) {
                  const spProvider = JSON.stringify(sp_id);
                  const parseSpProvider = JSON.parse(spProvider);
                  parseSpProvider.professionalBody = otherDetails.spods_professional_body
                  let professionalRating = await RatingSchema.find({ sprs_service_provider_id: sp_id._id })
                  //console.log('professionalRating:', professionalRating)
                  var sumRating = 0;
                  for (var RatingData of professionalRating) {
                    sumRating += parseInt(RatingData.sprs_rating);
                  }
                  let avgRating = sumRating / professionalRating.length;
                  if (!isNaN(avgRating)) {
                    avgRating = avgRating.toFixed(1);
                  } else {
                    avgRating = 0;
                  }
                  // console.log('avgRating:', avgRating)
                  let temps = await parseSpProvider
                  const spProvider1 = JSON.stringify(temps);
                  const parseSpProvider1 = JSON.parse(spProvider1);
                  parseSpProvider1.avgRating = avgRating
                  catExpServiceProvIdArray.push(parseSpProvider1);
                }
              });
            }
          }
        })
        //   }
        // }

        console.log('currentPage:', page);
        console.log('totalPages:', Math.ceil(count / limit));

        res.send({
          err_msg, success_msg, layout: false,
          session: req.session,
          filterData: catExpServiceProvIdArray,
          totalPages: Math.ceil(count / limit),
          currentPage: page
        })

      } else {
        res.send({
          err_msg, success_msg, layout: false,
          session: req.session,
          filterData: ''
        })
      }
    }


    /*== Category + Experience + Location ==*/

    if (experienceServiceProvIdArray != '' && categoryServiceProvIdArray != '' && cityServiceProvIdArray != '' && languageServiceProvIdArray == '') {
      console.log('insideee Category + Experience + Location')
      let firstArray = await getMatch(experienceServiceProvIdArray, categoryServiceProvIdArray);
      console.log('firstArray:', firstArray)
      let totalArrayId = await getMatch(firstArray, cityServiceProvIdArray);
      let ttt = [...new Set(totalArrayId)];
      console.log('ttt:', ttt)


      count = ttt.length;
      console.log('CityL countcount:', count);


      if (ttt) {
        //  for (var t of ttt) {
        //       if(t){
        QuerySyntex = { _id: { $in: ttt }, _id: { $in: totalHireUnique } };
        console.log()
        await ServiceProviderSchema.find(QuerySyntex).limit(limit * 1).skip((page - 1) * limit).then(async service_provider_detail => {
          if (service_provider_detail) {
            for (var sp_id of service_provider_detail) {

              await ServiceProviderOtherDetailsSchema.findOne({ spods_service_provider_id: sp_id._id }).then(async otherDetails => {
                if (otherDetails) {
                  const spProvider = JSON.stringify(sp_id);
                  const parseSpProvider = JSON.parse(spProvider);
                  parseSpProvider.professionalBody = otherDetails.spods_professional_body
                  let professionalRating = await RatingSchema.find({ sprs_service_provider_id: sp_id._id })
                  //console.log('professionalRating:', professionalRating)
                  var sumRating = 0;
                  for (var RatingData of professionalRating) {
                    sumRating += parseInt(RatingData.sprs_rating);
                  }
                  let avgRating = sumRating / professionalRating.length;
                  if (!isNaN(avgRating)) {
                    avgRating = avgRating.toFixed(1);
                  } else {
                    avgRating = 0;
                  }
                  //console.log('avgRating:', avgRating)
                  let temps = await parseSpProvider
                  const spProvider1 = JSON.stringify(temps);
                  const parseSpProvider1 = JSON.parse(spProvider1);
                  parseSpProvider1.avgRating = avgRating
                  catExpServiceProvIdArray.push(parseSpProvider1);
                }
              });


              //let temp = await sp_id;
              // await catExpServiceProvIdArray.push(temp);
            }
          }
        })
        //   }
        // }
        console.log('currentPage:', page);
        console.log('totalPages:', Math.ceil(count / limit));

        res.send({
          err_msg, success_msg, layout: false,
          session: req.session,
          filterData: catExpServiceProvIdArray,
          totalPages: Math.ceil(count / limit),
          currentPage: page
        })

      } else {
        res.send({
          err_msg, success_msg, layout: false,
          session: req.session,
          filterData: ''
        })
      }
    }

    /*== Category + Experience + Language ==*/

    if (experienceServiceProvIdArray != '' && categoryServiceProvIdArray != '' && languageServiceProvIdArray != '' && cityServiceProvIdArray == '') {
      console.log('insideee Category + Experience + Language')
      let firstArray = await getMatch(experienceServiceProvIdArray, categoryServiceProvIdArray);
      console.log('firstArray:', firstArray)
      let totalArrayId = await getMatch(firstArray, languageServiceProvIdArray);
      let ttt = [...new Set(totalArrayId)];
      console.log('ttt:', ttt)

      count = ttt.length;
      console.log('CityL countcount:', count);

      if (ttt) {
        //  for (var t of ttt) {
        //       if(t){
        QuerySyntex = { _id: { $in: ttt }, _id: { $in: totalHireUnique } };
        console.log()
        await ServiceProviderSchema.find(QuerySyntex).limit(limit * 1).skip((page - 1) * limit).then(async service_provider_detail => {
          if (service_provider_detail) {
            for (var sp_id of service_provider_detail) {

              await ServiceProviderOtherDetailsSchema.findOne({ spods_service_provider_id: sp_id._id }).then(async otherDetails => {
                if (otherDetails) {
                  const spProvider = JSON.stringify(sp_id);
                  const parseSpProvider = JSON.parse(spProvider);
                  parseSpProvider.professionalBody = otherDetails.spods_professional_body
                  let professionalRating = await RatingSchema.find({ sprs_service_provider_id: sp_id._id })
                  //console.log('professionalRating:', professionalRating)
                  var sumRating = 0;
                  for (var RatingData of professionalRating) {
                    sumRating += parseInt(RatingData.sprs_rating);
                  }
                  let avgRating = sumRating / professionalRating.length;
                  if (!isNaN(avgRating)) {
                    avgRating = avgRating.toFixed(1);
                  } else {
                    avgRating = 0;
                  }
                  //console.log('avgRating:', avgRating)
                  let temps = await parseSpProvider
                  const spProvider1 = JSON.stringify(temps);
                  const parseSpProvider1 = JSON.parse(spProvider1);
                  parseSpProvider1.avgRating = avgRating
                  catExpServiceProvIdArray.push(parseSpProvider1);
                }
              });


              //let temp = await sp_id;
              // await catExpServiceProvIdArray.push(temp);
            }
          }
        })
        //   }
        // }

        console.log('currentPage:', page);
        console.log('totalPages:', Math.ceil(count / limit));

        res.send({
          err_msg, success_msg, layout: false,
          session: req.session,
          filterData: catExpServiceProvIdArray,
          totalPages: Math.ceil(count / limit),
          currentPage: page
        })

      } else {
        res.send({
          err_msg, success_msg, layout: false,
          session: req.session,
          filterData: ''
        })
      }
    }

    /*== Category + Location + Language ==*/

    if (cityServiceProvIdArray != '' && categoryServiceProvIdArray != '' && languageServiceProvIdArray != '' && experienceServiceProvIdArray == '') {
      console.log('insideee Category + Location + Language')
      let firstArray = await getMatch(cityServiceProvIdArray, categoryServiceProvIdArray);
      console.log('firstArray:', firstArray)
      let totalArrayId = await getMatch(firstArray, languageServiceProvIdArray);
      let ttt = [...new Set(totalArrayId)];
      console.log('ttt:', ttt)


      count = ttt.length;
      console.log('CityL countcount:', count);


      if (ttt) {
        //  for (var t of ttt) {
        //       if(t){
        QuerySyntex = { _id: { $in: ttt }, _id: { $in: totalHireUnique } };
        console.log()
        await ServiceProviderSchema.find(QuerySyntex).limit(limit * 1).skip((page - 1) * limit).then(async service_provider_detail => {
          if (service_provider_detail) {
            for (var sp_id of service_provider_detail) {

              await ServiceProviderOtherDetailsSchema.findOne({ spods_service_provider_id: sp_id._id }).then(async otherDetails => {
                if (otherDetails) {
                  const spProvider = JSON.stringify(sp_id);
                  const parseSpProvider = JSON.parse(spProvider);
                  parseSpProvider.professionalBody = otherDetails.spods_professional_body
                  let professionalRating = await RatingSchema.find({ sprs_service_provider_id: sp_id._id })
                  //console.log('professionalRating:', professionalRating)
                  var sumRating = 0;
                  for (var RatingData of professionalRating) {
                    sumRating += parseInt(RatingData.sprs_rating);
                  }
                  let avgRating = sumRating / professionalRating.length;
                  if (!isNaN(avgRating)) {
                    avgRating = avgRating.toFixed(1);
                  } else {
                    avgRating = 0;
                  }
                  //console.log('avgRating:', avgRating)
                  let temps = await parseSpProvider
                  const spProvider1 = JSON.stringify(temps);
                  const parseSpProvider1 = JSON.parse(spProvider1);
                  parseSpProvider1.avgRating = avgRating
                  catExpServiceProvIdArray.push(parseSpProvider1);
                }
              });


              //let temp = await sp_id;
              // await catExpServiceProvIdArray.push(temp);
            }
          }
        })
        //   }
        // }

        console.log('currentPage:', page);
        console.log('totalPages:', Math.ceil(count / limit));

        res.send({
          err_msg, success_msg, layout: false,
          session: req.session,
          filterData: catExpServiceProvIdArray,
          totalPages: Math.ceil(count / limit),
          currentPage: page
        })

      } else {
        res.send({
          err_msg, success_msg, layout: false,
          session: req.session,
          filterData: ''
        })
      }
    }


    /*== Experience + Location + Language ==*/

    if (cityServiceProvIdArray != '' && languageServiceProvIdArray != '' && experienceServiceProvIdArray != '' && categoryServiceProvIdArray == '') {
      console.log('insideee Experience + Location + Language')
      let firstArray = await getMatch(cityServiceProvIdArray, experienceServiceProvIdArray);
      console.log('firstArray:', firstArray)
      let totalArrayId = await getMatch(firstArray, languageServiceProvIdArray);
      let ttt = [...new Set(totalArrayId)];
      console.log('ttt:', ttt)

      count = ttt.length;
      console.log('CityL countcount:', count);

      if (ttt) {
        //  for (var t of ttt) {
        //       if(t){
        QuerySyntex = { _id: { $in: ttt }, _id: { $in: totalHireUnique } };
        console.log()
        await ServiceProviderSchema.find(QuerySyntex).limit(limit * 1).skip((page - 1) * limit).then(async service_provider_detail => {
          if (service_provider_detail) {
            for (var sp_id of service_provider_detail) {

              await ServiceProviderOtherDetailsSchema.findOne({ spods_service_provider_id: sp_id._id }).then(async otherDetails => {
                if (otherDetails) {
                  const spProvider = JSON.stringify(sp_id);
                  const parseSpProvider = JSON.parse(spProvider);
                  parseSpProvider.professionalBody = otherDetails.spods_professional_body
                  let professionalRating = await RatingSchema.find({ sprs_service_provider_id: sp_id._id })
                  //console.log('professionalRating:', professionalRating)
                  var sumRating = 0;
                  for (var RatingData of professionalRating) {
                    sumRating += parseInt(RatingData.sprs_rating);
                  }
                  let avgRating = sumRating / professionalRating.length;
                  if (!isNaN(avgRating)) {
                    avgRating = avgRating.toFixed(1);
                  } else {
                    avgRating = 0;
                  }
                  //console.log('avgRating:', avgRating)
                  let temps = await parseSpProvider
                  const spProvider1 = JSON.stringify(temps);
                  const parseSpProvider1 = JSON.parse(spProvider1);
                  parseSpProvider1.avgRating = avgRating
                  catExpServiceProvIdArray.push(parseSpProvider1);
                }
              });


              //let temp = await sp_id;
              // await catExpServiceProvIdArray.push(temp);
            }
          }
        })
        //   }
        // }

        console.log('currentPage:', page);
        console.log('totalPages:', Math.ceil(count / limit));

        res.send({
          err_msg, success_msg, layout: false,
          session: req.session,
          filterData: catExpServiceProvIdArray,
          totalPages: Math.ceil(count / limit),
          currentPage: page
        })

      } else {
        res.send({
          err_msg, success_msg, layout: false,
          session: req.session,
          filterData: ''
        })
      }
    }


    /*== Experience + Location + Language + Category ==*/

    if (cityServiceProvIdArray != '' && languageServiceProvIdArray != '' && experienceServiceProvIdArray != '' && categoryServiceProvIdArray != '') {
      console.log('insideee Experience + Location + Language + Category')
      let firstArray = await getMatch(cityServiceProvIdArray, experienceServiceProvIdArray);
      console.log('firstArray:', firstArray)
      let SecondArray = await getMatch(firstArray, languageServiceProvIdArray);
      console.log('SecondArray:', SecondArray)
      let totalArrayId = await getMatch(SecondArray, categoryServiceProvIdArray);
      let ttt = [...new Set(totalArrayId)];
      console.log('ttt:', ttt)


      count = ttt.length;
      console.log('CityL countcount:', count);


      if (ttt) {
        //  for (var t of ttt) {
        //       if(t){
        QuerySyntex = { _id: { $in: ttt }, _id: { $in: totalHireUnique } };
        console.log()
        await ServiceProviderSchema.find(QuerySyntex).limit(limit * 1).skip((page - 1) * limit).then(async service_provider_detail => {
          if (service_provider_detail) {
            for (var sp_id of service_provider_detail) {

              await ServiceProviderOtherDetailsSchema.findOne({ spods_service_provider_id: sp_id._id }).then(async otherDetails => {
                if (otherDetails) {
                  const spProvider = JSON.stringify(sp_id);
                  const parseSpProvider = JSON.parse(spProvider);
                  parseSpProvider.professionalBody = otherDetails.spods_professional_body
                  let professionalRating = await RatingSchema.find({ sprs_service_provider_id: sp_id._id })
                  //console.log('professionalRating:', professionalRating)
                  var sumRating = 0;
                  for (var RatingData of professionalRating) {
                    sumRating += parseInt(RatingData.sprs_rating);
                  }
                  let avgRating = sumRating / professionalRating.length;
                  if (!isNaN(avgRating)) {
                    avgRating = avgRating.toFixed(1);
                  } else {
                    avgRating = 0;
                  }
                  //console.log('avgRating:', avgRating)
                  let temps = await parseSpProvider
                  const spProvider1 = JSON.stringify(temps);
                  const parseSpProvider1 = JSON.parse(spProvider1);
                  parseSpProvider1.avgRating = avgRating
                  catExpServiceProvIdArray.push(parseSpProvider1);
                }
              });


              //let temp = await sp_id;
              // await catExpServiceProvIdArray.push(temp);
            }
          }
        })
        //   }
        // }

        console.log('currentPage:', page);
        console.log('totalPages:', Math.ceil(count / limit));

        res.send({
          err_msg, success_msg, layout: false,
          session: req.session,
          filterData: catExpServiceProvIdArray,
          totalPages: Math.ceil(count / limit),
          currentPage: page
        })

      } else {
        res.send({
          err_msg, success_msg, layout: false,
          session: req.session,
          filterData: ''
        })
      }
    }
    console.log('experienceServiceProvIdArray:', experienceServiceProvIdArray)
    console.log('categoryServiceProvIdArray:', categoryServiceProvIdArray)
    console.log('catExpServiceProvIdArray:', catExpServiceProvIdArray)
    console.log('cityServiceProvIdArray:', cityServiceProvIdArray)
    console.log('languageServiceProvIdArray:', languageServiceProvIdArray)

  }

});

app.get('/proposal-details', isCustomer, async (req, res) => {
  console.log("Current query is :", req.query);
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  req.session.pagename = 'proposal';
  var proposalDetails = [];
  var activeProposal = await SubmitProposalSchema.find({ _id: req.query.id });
  console.log("activeProposal is ", activeProposal);
  if (activeProposal) {
    for (var propertyId of activeProposal) {
      console.log("property Id", propertyId);

      let propertyObj = await propertyDetail.GetPropertyById(propertyId.sps_property_id);
      let serviceProvider = await ServiceProviderSchema.findOne({ _id: propertyId.sps_service_provider_id });
      var totalProposal = await SubmitProposalSchema.find({ sps_service_provider_id: propertyId.sps_service_provider_id });

      if (totalProposal) {
        propertyObj.total_proposal = await totalProposal.length;
      }
      if (serviceProvider) {
        propertyObj.sp_name = await serviceProvider.sps_fullname;
        propertyObj.sp_profession = await serviceProvider.sps_role_name;
        propertyObj.sp_state = await serviceProvider.sps_state;
        propertyObj.sp_country = await serviceProvider.sps_country_id;
        propertyObj.sp_city = await serviceProvider.sps_city;
        propertyObj.sp_joining_date = await serviceProvider.sps_created_at;
      }
      propertyObj.proposal_filename = await propertyId.sps_filename;
      propertyObj.sps_payment_mode = await propertyId.sps_payment_mode;
      propertyObj.sps_extra_notes = await propertyId.sps_extra_notes;
      propertyObj.sps_status = await propertyId.sps_status;
      propertyObj.sps_start_date = await propertyId.sps_start_date;
      propertyObj.sps_end_date = await propertyId.sps_end_date;
      propertyObj.proposalId = await propertyId._id;
      proposalDetails.push(propertyObj);
    }
  }
  console.log("active Proposal is:", proposalDetails);
  res.render('proposal-details', {
    err_msg, success_msg, layout: false,
    session: req.session,
    proposalDetails: proposalDetails,
  });
})

app.post('/change-proposal-status', isCustomer, async (req, res) => {
  console.log("Request comming for change status", req.body);
  let proposalId = req.body.proposalId;
  SubmitProposalSchema.updateOne({ '_id': proposalId }, { $set: { sps_status: req.body.proposalStatus } }, { upsert: true }, function (err) {
    if (err) {
      res.send({ status: false, message: 'Something going wrong please check again !!' })
    } else {
      res.send({ status: true, message: 'Your proposal update successfully !!' })
    }
  });
});


function getMatch(a, b) {
  var matches = [];
  console.log('aaaaaaaa:', a)
  console.log('bbbbbb:', b)
  for (var i = 0; i < a.length; i++) {
    for (var e = 0; e < b.length; e++) {
      if (a[i] === b[e]) matches.push(a[i]);
    }
  }
  return matches;
}



app.get('/get-notification', isCustomer, async (req, res) => {
  var notificationObj = {
    id: '',
    name: '',
    image: '',
    type: '',
    property_id: '',
    reciver_id: '',
    sender_id: '',
  }
  console.log('dddaaa:', req.query)
  var notifData = [];
  await NotificationSchema.find({ ns_receiver: req.query.ns_receiver, ns_receiver_type: req.query.ns_receiver_type, ns_read_status: req.query.ns_read_status }).then(async (notificationResults) => {
    console.log('notificationL:', notificationResults)
    if (notificationResults) {
      for (let notifResult of notificationResults) {
        if (notifResult.ns_sender_type == 'service_provider') {
          await ServiceProviderSchema.findOne({ _id: notifResult.ns_sender }).then(async (cusResult) => {
            notificationObj = {
              id: cusResult._id,
              name: cusResult.sps_fullname,
              image: '',
              type: 'message',
              property_id: notifResult.ns_property_id,
              reciver_id: notifResult.ns_receiver,
              sender_id: notifResult.ns_sender,
            }
            notifData.push(notificationObj)
          })
        }
      }
    }
  });
  uniqueArray = removeDuplicates(notifData, "id");
  console.log('autoLoadnotifData:', uniqueArray)
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  res.send({
    err_msg, success_msg,
    layout: false,
    session: req.session,
    notifData: uniqueArray
  });

});



module.exports = app;




