
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const ServiceProviderEmploymentHistorySchema = new Schema({

  //should be mongodb generated object_id 
  spehs_id: {
    type: String,
  },

  spehs_service_provider_id: {
    type: Schema.Types.ObjectId,
    ref: "serviceProviders"
  },
  spehs_name_of_employer: {
    type: String,
    required: true,
  },
  spehs_job_title: {
    type: String,
    required: true,
  },
  spehs_job_description: {
    type: String,
    required: true,
  },
  spehs_reason_for_leaving: {
    type: String,
  },
  spehs_from_date: {
    type: String,
  },
  spehs_to_date: {
    type: String,
  },
  spehs_created_at: {
    type: Date,
    default: Date.now,
  },
  spehs_updated_at: {
    type: Date,
  },
  spehs_deleted_at: {
    type: Date,
  },
});
module.exports = ServiceProviderEmploymentHistory = mongoose.model('serviceProviderEmploymentHistory', ServiceProviderEmploymentHistorySchema);
