
const DocumentPermissionSchema = require('../../models/document_permission')
module.exports.changePermision = function (dataObj) {
    return new Promise(async function (resolve, reject) {
      // console.log('@@@@@@@@@',dataObj)
        //console.log("body:======", body);
       // console.log("dataObj:========", dataObj);
       DocumentPermissionSchema.findOne({dps_service_provider_id:dataObj.dps_service_provider_id}).then((data)=>{
        console.log("find by id ",data);
        if(data){
            if(dataObj.dps_view_permission=='yes'){
                DocumentPermissionSchema.updateOne({dps_view_permission:dataObj.dps_view_permission}).where({_id:data._id}).then((respo)=>{
                    console.log("Update A ",data);
                })
            }else if(dataObj.dps_download_permission=='yes'){
                DocumentPermissionSchema.updateOne({dps_download_permission:dataObj.dps_download_permission}).where({_id:data._id}).then((respo)=>{
                    console.log("Update B ",data);
                })
            }else if(dataObj.dps_view_permission=='yes'&&dataObj.dps_download_permission=='yes'){
                DocumentPermissionSchema.updateOne({dps_view_permission:dataObj.dps_view_permission,dps_download_permission:dataObj.dps_download_permission}).where({_id:data._id}).then((respo)=>{
                    console.log("Update C ",data);
                })
            }
             
        }else{
            var newdata = new DocumentPermissionSchema(dataObj);
            newdata.save().then(async (resp) => {
                let responce = await resp
                resolve(responce)
            }).catch((err) => {
                reject(err)
            })
        }
       })
       return;
        var newdata = new DocumentPermissionSchema(dataObj);

        newdata.save().then(async (resp) => {
            let responce = await resp
            resolve(responce)
        }).catch((err) => {
            reject(err)
        })
    });
};