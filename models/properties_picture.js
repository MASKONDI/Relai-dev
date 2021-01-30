const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const PropertiesPictureSchema = new Schema({

  //should be objectID genrated by MongoDB
  pps_picture_id: {
    type: String
  },
  pps_property_id: {
    type: Schema.Types.ObjectId,
    ref: 'properties'
  },
  pps_property_image: {
    data: Buffer,
    contantType: String
  },
  pps_property_image_name: {
    type: String
  },
  pps_status: {
    type: String,
  },
  pps_created_at: {
    type: Date,
    default: Date.now
  },
  pps_updated_at: {
    type: Date
  },
  pps_deleted_at: {
    type: Date
  },
  pps_is_active_user_flag: {
    type: String,
    enum: ['buyer', 'seller', 'renovator'],

  },
});
module.exports = propertiespicture = mongoose.model('propertiespicture', PropertiesPictureSchema);