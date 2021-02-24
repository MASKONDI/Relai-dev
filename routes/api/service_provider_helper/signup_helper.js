const ServiceProviderEmploymentHistorySchema = require("../../../models/service_provider_employment_history");
module.exports.getAllEmployeHistory = function (service_provider_id) {
    return new Promise( async function (resolve, reject) {
       if(service_provider_id!=null){
        data = {
            spehs_service_provider_id:service_provider_id
        }
        ServiceProviderEmploymentHistorySchema.find(data).sort({_id:-1}).then(async(resp)=>{
            let responce = await resp
             resolve(responce)
         }).catch((err)=>{
             reject(err)
         })
       }else{
           reject({status:0})
       }
    }).catch((error) => {});
};