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

module.exports.GetTaskByPhaseName = function (ppts_property_id,ppts_phase_name,ppts_is_active_user_flag) {
    return new Promise( async function (resolve, reject) {
       if(ppts_property_id!=null){
        var data={$and:[{ppts_property_id: ppts_property_id,ppts_phase_name:ppts_phase_name,ppts_is_active_user_flag:ppts_is_active_user_flag}]}
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

module.exports.add_existing_task = function (req) {
    return new Promise( async function (resolve, reject) {
        var newTask={};
        if (typeof (req.body.task_element) == 'object') {
                req.body.task_element.forEach(async function(row ,i){


                    PropertyProfessinoalTaskSchema.findOne({ppts_property_id: req.body.ppts_property_id,ppts_user_id:req.session.user_id,ppts_task_name:row,ppts_assign_to:req.body.ppts_assign_to,ppts_phase_name:req.body.ppts_phase_name,ppts_is_active_user_flag:req.session.active_user_login }).then(async (data) => {
                          console.log('Already task in table:',data)
                        if (!data) {
                          
                            newTask ={
                            ppts_property_id: req.body.ppts_property_id,
                            ppts_user_id: req.session.user_id,
                            ppts_task_name: row,
                            ppts_assign_to: req.body.ppts_assign_to,
                            ppts_due_date: req.body.duedate,
                            ppts_phase_name: req.body.ppts_phase_name,
                            ppts_is_active_user_flag: req.session.active_user_login,
                            ppts_note: req.body.notes,
                            ppts_phase_flag:req.body.ppts_phase_flag
                            }
                            console.log('Newdata',newTask)
                            const allobj = await  new PropertyProfessinoalTaskSchema(newTask);
                            allobj.save().then(async function(resp){
                                let responce = await resp
                                resolve(responce)
                            }).catch((err)=>{
                                reject(err)
                            });
                        }
                    }).catch((err) => {
                        reject(err)
                    })


                })
      
          } else {
            console.log("addTask post:", req.body);
             newTask = {
                ppts_property_id: req.body.ppts_property_id,
                ppts_user_id: req.session.user_id,
                ppts_task_name: req.body.task_element,
                ppts_assign_to: req.body.ppts_assign_to,
                ppts_due_date: req.body.duedate,
                ppts_phase_name: req.body.ppts_phase_name,
                ppts_is_active_user_flag: req.session.active_user_login,
                ppts_note: req.body.notes,
                ppts_phase_flag:req.body.ppts_phase_flag
            }
            const allobj = await  new PropertyProfessinoalTaskSchema(newTask);
            allobj.save().then(async function(resp){
                let responce = await resp
                resolve(responce)
            }).catch((err)=>{
                reject(err)
            });
            
          }
        // const allobj = await  new PropertyProfessinoalTaskSchema(newTask);
         //console.log('allobj',allobj)
    
      
    });
};