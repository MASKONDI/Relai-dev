const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const path = require('path');
const ejs = require('ejs');
const app = express();

var Jimp = require('jimp');
var fs = require('fs');
var base64ToImage = require('base64-to-image');
var multer = require('multer');
const ServiceProviderPortfolioSchema = require("../models/service_provider_portfolio");

const CustomerKycSchema = require("../models/customer_kyc");

const PropertiesPictureSchema = require("../models/properties_picture");

const PropertiesPlanPictureSchema = require("../models/properties_plan_picture");
const CustomerUploadDocsSchema = require("../models/customer_upload_document");

//** Upload Document Start */

var Storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./public/upload");
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  }
});
var maxSize = 1000000 * 1000;
var upload = multer({
  storage: Storage,
  limits: {
    fileSize: maxSize
  }
});


// Retriving the image
// app.get('/upload', (req, res) => {
//   ServiceProviderPortfolioSchema.find({}, (err, items) => {
//     if (err) {
//       console.log(err);
//     }
//     else {
//       res.render('app', { items: items });
//     }
//   });
// });

// Uploading the image
app.post('/upload', upload.single('portfolio-docs'), (req, res, next) => {
  var err_msg = null;
  var success_msg = null;
  //need to add conditions if session is expired

  console.log("req is :", req.file);
  console.log("req.session.user_id is :", req.session.user_id);
  var obj = {
    spps_filename: req.file.filename,
    spps_service_provider_id: req.session.user_id,
    //spps_type: req.file.fieldname,
    spps_file: {
      data: fs.readFileSync(path.join(__dirname + '../../public/upload/' + req.file.filename)),
      contentType: 'image/png'
    }
  }

  ServiceProviderPortfolioSchema.create(obj, (err, item) => {
    if (err) {
      console.log(err);
      req.flash('err_msg', "Something went worng please try aftersome time");
    }
    else {
      item.save();
      console.log("file Submitted Successfully");
      req.flash('success_msg', "Portfolio-docs Uploaded Successfully");
      res.redirect('/portfolio');
    }
  });
});




// Uploading the image
app.post('/upload-kyc-docs', upload.single('kyc-docs'), (req, res, next) => {
  var err_msg = null;
  var success_msg = null;
  console.log("req is :", req.file);
  console.log("req.session.id is", req.session.user_id);
  var obj = {
    cks_document_name: req.file.filename,
    cks_document_file: {
      data: fs.readFileSync(path.join(__dirname + '../../public/upload/' + req.file.filename)),
      contentType: 'image/png'
    }
  }

  CustomerKycSchema.create(obj, (err, item) => {
    if (err) {
      console.log(err);
      req.flash('err_msg', "Something went worng please try after some time");
    }
    else {
      item.save();
      console.log("file Submitted Successfully");
      req.flash('success_msg', "KYC-docs Uploaded Successfully");
      res.redirect('/kyc-professional');
    }
  });
});

// Uploading the image
app.post('/upload-properties-pic', upload.single('properties-pic'), (req, res, next) => {
  var err_msg = null;
  var success_msg = null;
  console.log("req is :", req.file);
  var obj = {
    pps_property_image_name: req.file.filename,
    pps_property_image: {
      data: fs.readFileSync(path.join(__dirname + '../../public/upload/' + req.file.filename)),
      contentType: 'image/png'
    }
  }

  PropertiesPictureSchema.create(obj, (err, item) => {
    if (err) {
      console.log(err);
      req.flash('err_msg', "Something went worng please try after some time");
      res.redirect('/add-property');
    }
    else {
      item.save();
      console.log("file Submitted Successfully");
      req.flash('success_msg', "Properties picture Uploaded Successfully");
      res.redirect('/add-property');
    }
  });
});

// Uploading the image
app.post('/upload-new-document', upload.single('new_Docs'), async (req, res, next) => {
  var err_msg = null;
  var success_msg = null;
  console.log("req is :", req.file);
  //add conditions for type of file and set the type of file
  console.log(".........files.......", req.file.filename)
  var ext = path.extname(req.file.filename);
  var basename = path.basename(req.file.filename, ext);
  console.log('basename:', basename)
  let ext_type = (ext == ".mp4") ? "video" : "image";
  let size = req.file.size / 1024;
  let docs_size = "";
  if (size > 1024) {
    size = size / 1024;
    docs_size = size.toFixed(1) + " MB";
  } else {
    docs_size = size.toFixed(1) + " KB"
  }

  if (ext_type == 'image') {
    var baseExt = ext.replace(/\./g, "");
    var w_text = new Date().toUTCString()
    var file_hash = path.join(__dirname + '../../public/upload/' + req.file.filename);
    var icon_images = path.join(__dirname + '../../public/images/logo-2.png');
    let icon_image = await Jimp.read(icon_images)
    await Jimp.read(file_hash, async function (err, image) {
      if (err) {
        console.log("jimp error", err);
        res.send(err)
      }

      await icon_image.resize(80, 30);
      await Jimp.loadFont(Jimp.FONT_SANS_8_WHITE, async function (err, font) {
        if (err) {
          console.log("jimp3 error", err);
          res.send(err)
        }
        image.composite(icon_image, (image.bitmap.width - 90), (image.bitmap.height - 45), {
          mode: Jimp.BLEND_SOURCE_OVER,
          opacityDest: 1,
          opacitySource: 0.9
        });
        image.print(font, (image.bitmap.width - 110), (image.bitmap.height - 10), w_text)
        // nova_new.composite(image, 0, 0);
        var d = await image.getBase64Async(Jimp.MIME_PNG)
        var base64Str = d;
        var path = __dirname + '../../public/upload/';
        var optionalObj = { 'fileName': basename, 'type': baseExt };
        base64ToImage(base64Str, path, optionalObj);

        console.log("file extension is", { ext_type, ext })
        var obj = {
          cuds_document_name: req.file.filename,
          cuds_customer_id: req.session.user_id,
          cuds_document_type: ext_type,
          cuds_document_size: docs_size,
          cuds_document_file: {
            data: d,
            contentType: ext
          }
        }

        CustomerUploadDocsSchema.create(obj, (err, item) => {
          if (err) {
            console.log(err); console.log(err);
            req.flash('err_msg', "Something went worng please try after some time");
            res.redirect('/mydreamhome-details-docs');
          }
          else {
            item.save();
            console.log("file Submitted Successfully");
            //req.flash('success_msg', "Properties plan Picture Uploaded Successfully");
            res.redirect('/mydreamhome-details-docs');
          }
        });

      })

    });
  }
});



module.exports = app;