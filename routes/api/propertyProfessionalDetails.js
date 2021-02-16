const PropertyProfessionalSchema=require("../../models/property_professional_Schema");
const ServiceProviderSchema=require("../../models/service_providers");
const PropertiesSchema = require("../../models/properties");
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

module.exports.GetAllHiredProertyByUserId = function (pps_service_provider_id,pps_is_active_user_flag,user_id) {
    return new Promise( async function (resolve, reject) {
       // console.log('hello',professional_id)
       var data={$and:[{pps_service_provider_id:pps_service_provider_id,pps_is_active_user_flag:pps_is_active_user_flag,pps_user_id:user_id}]}
   await PropertyProfessionalSchema.find(data).then(async(resp)=>{
       console.log("resp=:",resp)
       if(resp){
           var pushArray=[]
          for(var k of resp){ 
          var allhiredProp = await PropertiesSchema.findOne({_id:k.pps_property_id})
                //console.log("kkkkkkkkkkkkkkkkkk",allhiredProp)
                pushArray.push(allhiredProp)
          }
           var tt=await pushArray;
           // console.log("ppppppppppppppppp",allhiredProp)
           resolve(tt)
       }
       
       
    }).catch((err)=>{
        reject(err)
    })
    });
};