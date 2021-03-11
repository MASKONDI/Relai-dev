const PropertyProfessinoalTaskSchema = require("../../../models/property_professional_tasks_Schema");
const PropertiesPhaseSchema = require("../../../models/property_phase_schema");
const PropertiesSchema = require("../../../models/properties");



module.exports.GetTaskById = function (ppts_property_id, sp_id) {
  return new Promise(async function (resolve, reject) {
    if (ppts_property_id != null) {
      var data = {
        ppts_property_id: ppts_property_id,
        ppts_assign_to: sp_id
      }
      PropertyProfessinoalTaskSchema.find(data).then(async (resp) => {
        console.log('Getting Response from server is :', resp)
        let responce = await resp
        resolve(responce)
      }).catch((err) => {
        reject(err)
      })
    }
  });
};

module.exports.GetTaskByPhaseName = function (ppts_property_id, ppts_phase_name, sp_id) {
  return new Promise(async function (resolve, reject) {
    var pps_property_id = ppts_property_id;
    if (ppts_property_id != null) {
      await PropertiesSchema.findOne({ _id: pps_property_id }).then(async (propertyData) => {
        if (propertyData) {
          console.log('Service_provider id is :', sp_id);
          var data = {
            $and: [{
              ppts_property_id: ppts_property_id, ppts_phase_name: ppts_phase_name, ppts_assign_to: sp_id
            }]
          }
          PropertyProfessinoalTaskSchema.find(data).then(async (resp) => {
            console.log('getting response from server is : ', resp)
            let responce = await resp
            resolve(responce)
          }).catch((err) => {
            reject(err)
          })
          //}
        }
      })
    }
  });
};