const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const ServiceProviderEducationSchema = new Schema({

  //should be mongodb generated object_id 
  spes_id: {
    type: String,
  },
  spes_service_provider_id: {
    type: Schema.Types.ObjectId,
    ref: "serviceProviders"
  },
  spes_university_school_name: {
    type: String,
    required: true,
  },
  spes_qualification_obtained: {
    type: String,
    required: true,
  },

  spes_from_date: {
    type: String,
  },

  spes_to_date: {
    type: String,
  },
  spes_created_at: {
    type: Date,
    default: Date.now,
  },
  spes_updated_at: {
    type: Date,
  },
  spes_deleted_at: {
    type: Date,
  },
});
module.exports = ServiceProviderEducation = mongoose.model('sp_education', ServiceProviderEducationSchema);
