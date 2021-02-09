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