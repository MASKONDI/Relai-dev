const PropertyProfessionalSchema=require("../../models/property_professional_Schema");
const ServiceProviderSchema=require("../../models/service_providers");
module.exports.GetProfessionalById = function (ppts_assign_to) {
    return new Promise( async function (resolve, reject) {
       // console.log('hello',professional_id)
       var data={_id:ppts_assign_to}
   await ServiceProviderSchema.find(data).then(async(resp)=>{
       //console.log("resp=:",resp)
       if(resp){
           //console.log("respArray out of loop",respArray)
           resolve(resp)
       }
       
       
    }).catch((err)=>{
        reject(err)
    })
    });
};
module.exports.removeProfessionalById = function (pps_service_provider_id,pps_property_id) {
    return new Promise( async function (resolve, reject) {
       
       var data={$and:[{pps_service_provider_id:pps_service_provider_id,pps_property_id:pps_property_id}]}
   await PropertyProfessionalSchema.findOneAndRemove(data).then(async(resp)=>{
     
       if(resp){
          
           resolve(resp)
       }
       
       
    }).catch((err)=>{
        reject(err)
    })
    });
};