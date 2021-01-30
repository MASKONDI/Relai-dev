




const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const PropertiesPlanPictureSchema = new Schema({
  //should be auto generated
  ppps_id: {
    type: String,
  },
  ppps_property_id: {
    type: Schema.Types.ObjectId,
    ref: 'properties'
  },
  ppps_plan_image: {
    data: Buffer,
    contantType: String
  },
  ppps_plan_image_name: {
    type: String,
  },
  ppps_status: {
    type: String,
  },
  ppps_created_at: {
    type: Date,
    default: Date.now
  },
  ppps_updated_at: {
    type: Date,
  },
  ppps_deleted_at: {
    type: Date
  },
  ppps_is_active_user_flag: {
    type: String,
    enum: ['buyer', 'seller', 'renovator'],
  },

});
module.exports = propertiesplanpicture = mongoose.model('propertiesplanpicture', PropertiesPlanPictureSchema);