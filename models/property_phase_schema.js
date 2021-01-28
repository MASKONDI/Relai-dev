const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const PropertiesPhaseSchema = new Schema({

  pps_phase_id: { type: String },
  pps_property_id: {
    type: Schema.Types.ObjectId,
    ref: "properties"
  },
  pps_phase_name: {
    type: String
  },
  pps_phase_start_date: {
    type: Date
  },
  pps_phase_end_date: {
    type: Date
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
  pps_deleted: {
    type: String,
    enum: ['0', '1'],
    default: '0'
  },
  pps_is_active_user_flag: {
    type: String,
    enum: ['buyer', 'seller', 'renovator'],
  },

});
module.exports = propertiesphase = mongoose.model('propertiesphase', PropertiesPhaseSchema);