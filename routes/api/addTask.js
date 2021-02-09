const PropertyProfessinoalTaskSchema = require("../../models/property_professional_tasks_Schema");
const PropertiesPhaseSchema = require("../../models/property_phase_schema");
module.exports.GetTaskById = function (ppts_property_id,ppts_is_active_user_flag) {
    return new Promise( async function (resolve, reject) {
       if(ppts_property_id!=null){
        var data={$and:[{ppts_property_id: ppts_property_id,ppts_is_active_user_flag:ppts_is_active_user_flag}]}
        PropertyProfessinoalTaskSchema.find(data).then(async(resp)=>{
            console.log('resp:====',resp)
            let responce = await resp
             resolve(responce)
         }).catch((err)=>{
             reject(err)
         })
       }
    });
};


module.exports.save_addPhase = function (pps_property_id,pps_phase_name,pps_phase_start_date,pps_phase_end_date,pps_is_active_user_flag) {
    return new Promise( async function (resolve, reject) {
        var data={pps_property_id:pps_property_id,
        //pps_professional_id:pps_professional_id,
        //pps_user_id:req.session.user_id,
        pps_phase_name:pps_phase_name,
        pps_phase_start_date:pps_phase_start_date,
        pps_phase_end_date:pps_phase_end_date,
        pps_is_active_user_flag:pps_is_active_user_flag
    }
    var newdata = new PropertiesPhaseSchema(data);
    newdata.save().then(async(resp)=>{
       let responce = await resp
        resolve(responce)
    }).catch((err)=>{
        reject(err)
    })
    });
};