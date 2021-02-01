
const PropertiesPhaseSchema = require("../../models/property_phase_schema");
const ServiceProviderSchema=require("../../models/service_providers");
module.exports.GetPhaseByPropertyId = function (pps_property_id,pps_is_active_user_flag) {
    return new Promise( async function (resolve, reject) {
        //console.log('hello',pps_property_id,pps_is_active_user_flag)
        var data={$and:[{pps_is_active_user_flag: pps_is_active_user_flag,pps_property_id:pps_property_id}]}
   await PropertiesPhaseSchema.find(data).then(async(resp)=>{
       let responce = await resp
        resolve(responce)
    }).catch((err)=>{
        reject(err)
    })
    });
};
module.exports.GetProfessionalById = function (professional_id) {
    return new Promise( async function (resolve, reject) {
       // console.log('hello',professional_id)
        var data={_id:professional_id}
   await ServiceProviderSchema.findOne(data).then(async(resp)=>{
       let responce = await resp
        resolve(responce)
    }).catch((err)=>{
        reject(err)
    })
    });
};