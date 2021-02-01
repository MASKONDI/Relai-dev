
const PropertiesSchema = require("../../models/properties");

module.exports.GetPropertById = function (propertyId) {
    return new Promise( async function (resolve, reject) {
        //console.log('hello',pps_property_id,pps_is_active_user_flag)
        var data={_id:propertyId}
   await PropertiesSchema.findOne(data).then(async(resp)=>{
       let responce = await resp
        resolve(responce)
    }).catch((err)=>{
        reject(err)
    })
    });
};
