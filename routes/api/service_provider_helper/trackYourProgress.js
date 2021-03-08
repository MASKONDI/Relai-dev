const PropertiesSchema = require("../../../models/properties");
const PropertyProfessionalSchema = require("../../../models/property_professional_Schema");
const customerHelper = require('./customerHelper.js');
module.exports.getAllPropertyByUserId = function (user_id) {
    return new Promise(async function (resolve, reject) {
        if (user_id != null) {
            data = {
                pps_service_provider_id: user_id
            }
           await PropertyProfessionalSchema.find(data).sort({ _id: -1 }).then(async (resp) => {
                if(resp){
                   // console.log('hireProfeshnoal:',resp)
                    var dataarray=[];
                    for(var k of resp){
                        
                        //console.log('+++++++++++++++++++++++++++++++',customerdata)
                        await PropertiesSchema.findOne({_id:k.pps_property_id}).then(async(responce)=>{
                            if(responce){
                                let customerdata = await customerHelper.getCustomerByID(k.pps_user_id)
                                var object_as_string = JSON.stringify(responce);
                                const t = JSON.parse(object_as_string);
                                t.user_image =customerdata
                                let temps = await t
                                let tempsData = await temps
                                dataarray.push(temps)
                                //console.log('property-profeshnoal data',responce)
                            //     var d=await responce
                            //     var dd = JSON.stringify(d)
                            //    var ddd= JSON.parse(dd)
                            //    var allpropertydata= ddd
                            //     allpropertydata.customerDetial=customerdata
                            //     var allpropertydatas=await allpropertydata
                            //     dataarray.push(allpropertydatas)
                            }
                        })

                    }

                    resolve(dataarray)
                }
                
            }).catch((err) => {
                reject(err)
            })
        } else {
            reject({ status: 0 })
        }
    }).catch((error) => { });
};
