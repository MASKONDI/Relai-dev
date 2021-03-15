const PropertyProfessionalSchema= require('../../../models/property_professional_Schema');
const ServiceProviderSchema=require("../../../models/service_providers");

module.exports.getHiredPropertyProfessional = function (pps_service_provider_id) {
    return new Promise(async function (resolve, reject) {
        if (pps_service_provider_id != null) {
           let data=await PropertyProfessionalSchema.find({pps_service_provider_id:pps_service_provider_id}).sort({ _id: -1 }).limit(3)
                if(data){
                    var object_as_string = JSON.stringify(data);
                    const propertyProfessional = JSON.parse(object_as_string);
                   
                    resolve(propertyProfessional)
                }else{
                    reject({status:0,'message':'data not found'})
                }
           
        } else {
            reject({status:0,'message':'data not found'})
        }
    }).catch((error) => { });
};



module.exports.GetProfessionalById = function (ppts_assign_to) {
    return new Promise( async function (resolve, reject) {
       // console.log('hello',ppts_assign_to)
       var data={_id:ppts_assign_to}
   await ServiceProviderSchema.find(data).then(async(resp)=>{
       if(resp){
           //console.log("respArray out of loop",respArray)
           resolve(resp)
       }
       
       
    }).catch((err)=>{
        reject(err)
    })
    });
};
