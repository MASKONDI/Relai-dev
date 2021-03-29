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
const PropertyProfessinoalTaskSchema = require('../../models/property_professional_tasks_Schema')
module.exports.removeProfessionalById = function (pps_service_provider_id,pps_property_id) {
    return new Promise( async function (resolve, reject) {
        //ppts_user_id:{$in:req.session.user_id},
        // PropertyProfessinoalTaskSchema.find({ ppts_property_id:pps_property_id,ppts_assign_to:{$in:pps_service_provider_id}}).then(async(resp)=>{
        //     console.log('in remove profeshnoal==',resp)
        //     for(var k of resp){
        //         const items = k.ppts_task_status;
        //         var index_profeshnoal_Id=k.ppts_assign_to.indexOf(pps_service_provider_id);
        //         items.splice(index_profeshnoal_Id, 1);
        //         var assignItem = k.ppts_assign_to;
        //         assignItem.splice(index_profeshnoal_Id, 1);
                
        //         var responce= await PropertyProfessinoalTaskSchema.updateOne({_id:k._id}, { $set: {ppts_task_status:items ,ppts_assign_to:assignItem} })
               
        //         console.log('delete responce==',responce)
        //     }
        // })
        
       
       var data={$and:[{pps_service_provider_id:pps_service_provider_id,pps_property_id:pps_property_id}]}

   await PropertyProfessionalSchema.findOneAndRemove(data).then(async(resp)=>{
     
       if(resp){
        PropertyProfessinoalTaskSchema.find({ ppts_property_id:pps_property_id,ppts_assign_to:{$in:pps_service_provider_id}}).then(async(resp)=>{
            console.log('in remove profeshnoal==',resp)
            for(var k of resp){
                const items = k.ppts_task_status;
                var index_profeshnoal_Id=k.ppts_assign_to.indexOf(pps_service_provider_id);
                items.splice(index_profeshnoal_Id, 1);
                var assignItem = k.ppts_assign_to;
                assignItem.splice(index_profeshnoal_Id, 1);
                // ppts_is_delete
                
                if(assignItem==0){
                var responce= await PropertyProfessinoalTaskSchema.updateOne({_id:k._id}, { $set: {ppts_task_status:items ,ppts_assign_to:assignItem,ppts_is_delete:'yes'} })
                    console.log('responce=========================',responce)
                }else{
                var responce= await PropertyProfessinoalTaskSchema.updateOne({_id:k._id}, { $set: {ppts_task_status:items ,ppts_assign_to:assignItem,ppts_is_delete:'no'} })

                }
              
            }
            console.log('asign to==================',k.ppts_assign_to)
        })
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
module.exports.Get_all_Professional_by_property = function (pps_property_id,pps_user_id,pps_is_active_user_flag) {
    return new Promise( async function (resolve, reject) {
       // console.log('hello',professional_id)
       var pushArray=[];
       var pushArray1=[];
       var array2 ='';
       var array1='';
       var data={$and:[{
        pps_property_id:pps_property_id,pps_is_active_user_flag:pps_is_active_user_flag,pps_user_id:pps_user_id
        //pps_property_id:pps_property_id,pps_is_active_user_flag:pps_is_active_user_flag,pps_user_id:pps_user_id
        }]}
   await PropertyProfessionalSchema.find(data).then(async(resp)=>{
       console.log("resp=:",resp)
       if(resp){
       await  PropertiesSchema.findOne({_id:pps_property_id}).then(async(propertyData)=>{ 
           if('ps_tagged_user_id' in propertyData){
               console.log('here..1');
               console.log('here..gg:',propertyData.ps_tagged_user_id);
               console.log('here..pps_user_id:',pps_user_id);
                if(propertyData.ps_tagged_user_id == pps_user_id){
               console.log('here..2');
                        await PropertyProfessionalSchema.find({pps_property_id:pps_property_id,pps_user_id:propertyData.ps_user_id}).then(async(respData)=>{ 
                            console.log("respDatarespData=:",respData)

                            for(var k of respData){ 
                                var allhiredProp = await ServiceProviderSchema.findOne({_id:k.pps_service_provider_id})
                                 pushArray1.push(allhiredProp)
                           }
                           array2 = await pushArray1;
                           console.log("pushArray1ppppppppppppppppp:",array2);
             
                        });
                    }else{
                        console.log('here..111');
                        console.log('here..111gg:',propertyData.ps_tagged_user_id);
                        console.log('here..111pps_user_id:',pps_user_id);
                         
                                 console.log('here..2');
                                 await PropertyProfessionalSchema.find({pps_property_id:pps_property_id,pps_user_id:propertyData.ps_tagged_user_id}).then(async(respData)=>{ 
                                     console.log("respDatarespData=:",respData)
         
                                     for(var k of respData){ 
                                         var allhiredProp = await ServiceProviderSchema.findOne({_id:k.pps_service_provider_id})
                                          pushArray1.push(allhiredProp)
                                    }
                                    array2 = await pushArray1;
                                    console.log("pushArray1ppppppppppppppppp:",array2);
                      
                                 });
                    }
                }
           });
          
          for(var k of resp){ 
               var allhiredProp = await ServiceProviderSchema.findOne({_id:k.pps_service_provider_id})
                pushArray.push(allhiredProp)
          }
 
          array1 = await pushArray;
            const array3 = [...array1, ...array2];
           console.log("TTTTppppppppppppppppp",array3)
           resolve(array3)
       }
        
    }).catch((err)=>{
        reject(err)
    })
    });
};