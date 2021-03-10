const ServiceProviderEmploymentHistorySchema = require("../../../models/service_provider_employment_history");
const ServiceProviderPortfolioSchema = require("../../../models/service_provider_portfolio");
const ServiceProviderReferenceSchema = require("../../../models/service_provider_reference");
const ServiceProviderPersonalDetailsSchema = require("../../../models/service_provider_personal_details");
const ServiceProviderOtherDetailsSchema = require("../../../models/service_providers_other_details");
const ServiceProviderIndemnityDetailsSchema = require("../../../models/service_provider_indemnity_details");
const ServiceProviderLanguageSchema = require("../../../models/service_provider_languages");
const { where } = require("../../../models/service_providers_other_details");


module.exports.getAllEmployeHistory = function (service_provider_id) {
    return new Promise(async function (resolve, reject) {
        if (service_provider_id != null) {
            data = {
                spehs_service_provider_id: service_provider_id
            }
            ServiceProviderEmploymentHistorySchema.find(data).sort({ _id: -1 }).then(async (resp) => {
                let responce = await resp
                resolve(responce)
            }).catch((err) => {
                reject(err)
            })
        } else {
            reject({ status: 0 })
        }
    }).catch((error) => { });
};

module.exports.savePortpofolio = function (req) {
    return new Promise(async function (resolve, reject) {
        if (req.files.length != 0) {
            let ext_type = '';
            var ext = ''
            await req.files.forEach(async element => {
                ext = element.mimetype
                console.log(ext)
               
                if (ext == "video/mp4") {
                    ext_type = 'video';
                } else if(ext=='image/jpeg'||ext=='image/png'){

                    ext_type = 'image';
                }
                if(ext_type=='image'||ext_type=='video'){
                var obj = {
                    spps_filename: element.filename,
                    spps_service_provider_id: req.session.user_id,
                    spps_type: ext_type,
                    // spps_file: {
                    //   data: fs.readFileSync(path.join(__dirname + '../../public/portfolioImage/' + element.filename)),
                    //   contentType: 'image/png'
                    // }
                }
                ServiceProviderPortfolioSchema.create(obj, async (err, item) => {
                    if (err) {
                        console.log(err);
                        reject({ status: false })
                    }
                    else {
                        var resp = await item.save()
                        resolve(true)


                    }

                });
            }else{
                reject(false)
            }


            })



        } else {
            reject(false)
        }

    }).catch((error) => { console.log(error) });
};
module.exports.editPortpofolio = function (req) {

}
module.exports.getPortpofolio = function (id) {
return new Promise(async function (resolve, reject) {
    if (id != null) {
        data = {
            spps_service_provider_id: id
        }
        await ServiceProviderPortfolioSchema.find(data).then(async (resp) => {
            let responce = await resp
            resolve(responce)
        }).catch((err) => {
            reject(err)
        })
    } else {
        reject({ status: 0 })
    }
}).catch((error) => { });
}
module.exports.getReferenceDetailById = function (id) {
    return new Promise(async function (resolve, reject) {
        if (id != null) {
            data = {
                rs_service_provider_id: id
            }
            ServiceProviderReferenceSchema.findOne(data).sort({ _id: -1 }).then(async (resp) => {
                let responce = await resp
                resolve(responce)
            }).catch((err) => {
                reject(err)
            })
        } else {
            reject({ status: 0 })
        }
    }).catch((error) => { });
};

module.exports.getPersonalDetialByID = function (id) {
    return new Promise(async function (resolve, reject) {
        if (id != null) {
            data = {
                spods_service_provider_id: id
            }
            ServiceProviderPersonalDetailsSchema.findOne(data).sort({ _id: -1 }).then(async (resp) => {
                let responce = await resp
                resolve(responce)
            }).catch((err) => {
                reject(err)
            })
        } else {
            reject({ status: 0 })
        }
    }).catch((error) => { });
};

module.exports.getOtherDetialByID = function (id) {
    return new Promise(async function (resolve, reject) {
        if (id != null) {
            data = {
                spods_service_provider_id: id
            }
            ServiceProviderOtherDetailsSchema.findOne(data).sort({ _id: -1 }).then(async (resp) => {
                let responce = await resp
                resolve(responce)
            }).catch((err) => {
                reject(err)
            })
        } else {
            reject({ status: 0 })
        }
    }).catch((error) => { });
};


module.exports.getIndemnityDetailsById = function (id) {
    return new Promise(async function (resolve, reject) {
        if (id != null) {
            data = {
                spods_service_provider_id: id
            }
            ServiceProviderIndemnityDetailsSchema.findOne(data).sort({ _id: -1 }).then(async (resp) => {
                let responce = await resp
                resolve(responce)
            }).catch((err) => {
                reject(err)
            })
        } else {
            reject({ status: 0 })
        }
    }).catch((error) => { });
};

module.exports.getIndemnityLanguageById = function (id) {
    return new Promise(async function (resolve, reject) {
        if (id != null) {
            data = {
                spls_service_provider_id: id
            }
            await ServiceProviderLanguageSchema.find(data).then(async (resp) => {
                let responce = await resp
                resolve(responce)
            }).catch((err) => {
                reject(err)
            })
        } else {
            reject({ status: 0 })
        }
    }).catch((error) => { });
};

module.exports.saveOneLang = function (req) {
    return new Promise(async function (resolve, reject) {
        const serviceProviderLanguage = new ServiceProviderLanguageSchema({
            spls_service_provider_id: req.session.user_id,
            spls_language: req.body.spls_language,
            spls_language_proficiency_level: req.body.spls_language_proficiency_level
          });
          serviceProviderLanguage
          .save().then((resp)=>{
            if(resp){
                resolve({
                    message: "language-details submitted successfully.please continue...",
                    status: true,
                  })
            }
          }).catch((err)=>{
              console.log(err)
              resolve({
                message: "saveOneLang ",
                status: false,
              })
          })
    }).catch((error) => { });
};

module.exports.editOneLang = function (req) {
    return new Promise(async function (resolve, reject) {
        const serviceProviderLanguage ={
            spls_service_provider_id: req.session.user_id,
            spls_language: req.body.spls_language,
            spls_language_proficiency_level: req.body.spls_language_proficiency_level
          }
          ServiceProviderLanguageSchema
          .updateOne(serviceProviderLanguage).where({_id:req.body.lang_id}).then((resp)=>{
            console.log(resp)
            if(resp){
                resolve({
                    message: "language-details Update successfully",
                    status: true,
                  })
            }
          }).catch((err)=>{
              console.log(err)
              resolve({
                message: "editOneLang ",
                status: false,
              })
          })
    }).catch((error) => { });
};
module.exports.saveMultipleLang = function (req) {
    return new Promise(async function (resolve, reject) {
        req.body.spls_language.forEach(async function(row,i){
        var data={
            spls_service_provider_id: req.session.user_id,
            spls_language: req.body.spls_language[i],
            spls_language_proficiency_level: req.body.spls_language_proficiency_level[i]
          }
          console.log('deepak',data)
          const serviceProviderLanguage = new ServiceProviderLanguageSchema(data)
          await serviceProviderLanguage
          .save().then((resp)=>{
            if(resp){
                resolve({
                    message: "language-details submitted successfully.please continue...",
                    status: true,
                  })
            }
          }).catch((err)=>{
              console.log(err._message)
              resolve({
                'message': "saveMultipleLang",
                status: false,
              })
          })
        })
    }).catch((error) => { });
};
 
module.exports.editMultipleLang = function (req) {
    return new Promise(async function (resolve, reject) {
        req.body.spls_language.forEach(async function(row,i){
        var data={
            spls_service_provider_id: req.session.user_id,
            spls_language: req.body.spls_language[i],
            spls_language_proficiency_level: req.body.spls_language_proficiency_level[i]
          }
          console.log('deepak',data)
         
          await ServiceProviderLanguageSchema
          .updateMany(data).where({_id:req.body.lang_id[i]}).then((resp)=>{
            if(resp){
                resolve({
                    message: "language-details update successfully.",
                    status: true,
                  })
            }
          }).catch((err)=>{
              console.log(err._message)
              resolve({
                'message': "editMultipleLang",
                status: false,
              })
          })
        })
    }).catch((error) => { });
};
  