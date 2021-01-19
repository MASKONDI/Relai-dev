const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const PropertyProfessionalSchema = new Schema({
  //should be mongodb generated ObjectId()
  pps_id: { type: String, },
  pps_property_id: {
    type: Schema.Types.ObjectId,
    ref: "properties"
  },
  pps_service_provider_id: {
    type: Schema.Types.ObjectId,
    ref: "service_provider"
  },
  pps_pofessional_budget: { type: String },
  pps_exptected_delivery_date: { type: Date },
  pps_status: { type: String },
  pps_created_at: {
    type: Date,
    default: Date.now
  },
  pps_updated_at: { type: Date },
  pps_deleted_at: { type: Date },
  pps_deleted: {
    type: String,
    enum: ['0', '1'],
    default: '0'
  },
});
module.exports = property_professional = mongoose.model('property_professional', PropertyProfessionalSchema);

